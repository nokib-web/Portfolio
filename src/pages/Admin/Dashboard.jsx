import React, { useState, useEffect } from 'react';
import { personas } from '../../data/personasData';
import { appConfig } from '../../config';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [activePersonaTab, setActivePersonaTab] = useState('developer');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [personasData, setPersonasData] = useState([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Helper for tabs
  const getTabsForPersona = (personaId) => {
    switch (personaId) {
      case 'developer':
        return [
          { id: 'projects', label: 'Projects', icon: 'grid_view' },
          { id: 'blogs', label: 'Blogs', icon: 'article' },
          { id: 'stats', label: 'Stats', icon: 'insights' }
        ];
      case 'writer':
        return [
          { id: 'blogs', label: 'Essays', icon: 'article' },
          { id: 'quote', label: 'My Quote', icon: 'format_quote' }
        ];
      case 'philosopher':
        return [
          { id: 'projects', label: 'Treatises', icon: 'grid_view' },
          { id: 'blogs', label: 'Writings', icon: 'article' }
        ];
      case 'friend':
        return [
          { id: 'timeline', label: 'Timeline (Moments)', icon: 'calendar_today' },
          { id: 'gallery', label: 'Gallery (Pixels)', icon: 'photo_camera' }
        ];
      default:
        return [];
    }
  };

  const handlePersonaTabChange = (personaId) => {
    setActivePersonaTab(personaId);
    const newTabs = getTabsForPersona(personaId);
    if (newTabs.length > 0) {
      const hasCurrentTab = newTabs.some(t => t.id === activeTab);
      if (!hasCurrentTab) {
        setActiveTab(newTabs[0].id);
      }
    }
  };

  const activePersonaObj = (personasData.length > 0 ? personasData : personas).find(
    p => p.personaId === activePersonaTab || p.id === activePersonaTab
  );

  const fetchItems = async () => {
    setLoading(true);

    if (activeTab === 'timeline' || activeTab === 'gallery' || activeTab === 'quote') {
      try {
        const res = await fetch(`${appConfig.apiBaseUrl}/api/personas`);
        if (res.ok) {
          const data = await res.json();
          setPersonasData(data);
          const personaObj = data.find(p => p.personaId === activePersonaTab || p.id === activePersonaTab);
          
          if (activeTab === 'quote') {
            const quoteObj = personaObj?.epigraph || { quote: '', attribution: '' };
            setItems([{
              ...quoteObj,
              _id: 'writer-epigraph',
              title: quoteObj.quote || 'No quote set yet',
              attribution: quoteObj.attribution || '',
              _index: 0
            }]);
          } else {
            const itemsWithIds = (personaObj?.[activeTab] || []).map((item, idx) => ({
              ...item,
              _id: item._id || `${activeTab}-${idx}`,
              _index: idx
            }));
            setItems(itemsWithIds);
          }
        }
      } catch (err) {
        console.error(err);
        if (activeTab === 'quote') {
          const quoteObj = activePersonaObj?.epigraph || { quote: '', attribution: '' };
          setItems([{
            ...quoteObj,
            _id: 'writer-epigraph',
            title: quoteObj.quote || 'No quote set yet',
            attribution: quoteObj.attribution || '',
            _index: 0
          }]);
        } else {
          const itemsWithIds = (activePersonaObj?.[activeTab] || []).map((item, idx) => ({
            ...item,
            _id: item._id || `${activeTab}-${idx}`,
            _index: idx
          }));
          setItems(itemsWithIds);
        }
      }
      setLoading(false);
      return;
    }

    let endpoint = '';
    if (activeTab === 'projects') endpoint = '/api/projects';
    else if (activeTab === 'blogs') endpoint = '/api/blogs/all';
    else if (activeTab === 'stats') endpoint = '/api/stats';

    endpoint += `?personaId=${activePersonaTab}`;
    
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${appConfig.apiBaseUrl}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (res.ok) setItems(Array.isArray(data) ? data : []);
      else setItems([]);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Initial load of personas Data
  useEffect(() => {
    const loadPersonas = async () => {
      try {
        const res = await fetch(`${appConfig.apiBaseUrl}/api/personas`);
        if (res.ok) {
          const data = await res.json();
          setPersonasData(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadPersonas();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [activeTab, activePersonaTab]);

  const getDefaultData = (tab) => {
    switch(tab) {
      case 'stats': return { label: '', value: 0, personaId: activePersonaTab };
      case 'projects': return { 
        title: '', description: '', techStack: '', image: '', 
        liveLink: '', githubLink: '', category: 'software', featured: false, personaId: activePersonaTab 
      };
      case 'blogs': return {
        title: '', slug: '', excerpt: '', content: '', 
        tags: '', readTime: '5 min read', coverImage: '', published: true, personaId: activePersonaTab
      };
      case 'timeline': return { year: '', title: '', description: '', personaId: activePersonaTab };
      case 'gallery': return { url: '', caption: '', span: 'col-span-1 row-span-1', personaId: activePersonaTab };
      case 'quote': return { quote: '', attribution: '', personaId: activePersonaTab };
      default: return {};
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData(getDefaultData(activeTab));
    setFormError('');
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    const data = { ...item };
    
    // Transform arrays/objects to strings for form editing
    if (activeTab === 'projects') {
      data.techStack = Array.isArray(data.techStack) ? data.techStack.join(', ') : data.techStack;
    } else if (activeTab === 'blogs') {
      data.tags = Array.isArray(data.tags) ? data.tags.join(', ') : data.tags;
    }

    setFormData(data);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    const token = localStorage.getItem('adminToken');

    if (activeTab === 'timeline' || activeTab === 'gallery') {
      const activeObj = personasData.find(p => p.personaId === activePersonaTab || p.id === activePersonaTab);
      if (!activeObj) {
        alert('Active persona not found.');
        return;
      }
      const updatedArray = (activeObj[activeTab] || []).filter((_, idx) => idx !== itemToDelete._index);
      try {
        const res = await fetch(`${appConfig.apiBaseUrl}/api/personas/${activeObj._id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({
            [activeTab]: updatedArray
          })
        });
        if (res.status === 401) {
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
          return;
        }
        if (res.ok) {
          fetchItems();
          setItemToDelete(null);
        } else {
          alert('Failed to delete item.');
        }
      } catch (err) {
        console.error(err);
      }
      return;
    }
    
    let endpoint = activeTab === 'blogs' ? '/api/blogs' : `/api/${activeTab}`;
    
    try {
      const res = await fetch(`${appConfig.apiBaseUrl}${endpoint}/${itemToDelete._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }
      if (res.ok) {
        fetchItems();
        setItemToDelete(null);
      } else {
        alert('Failed to delete item.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      if (activeTab === 'timeline' || activeTab === 'gallery' || activeTab === 'quote') {
        const activeObj = personasData.find(p => p.personaId === activePersonaTab || p.id === activePersonaTab);
        if (!activeObj) {
          setFormError('Active persona not found.');
          return;
        }

        let bodyUpdate = {};
        if (activeTab === 'quote') {
          bodyUpdate = {
            epigraph: {
              quote: formData.quote,
              attribution: formData.attribution
            }
          };
        } else {
          const updatedArray = [...(activeObj[activeTab] || [])];
          if (editingItem) {
            updatedArray[editingItem._index] = { ...formData };
          } else {
            updatedArray.push({ ...formData });
          }
          bodyUpdate = { [activeTab]: updatedArray };
        }

        const res = await fetch(`${appConfig.apiBaseUrl}/api/personas/${activeObj._id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(bodyUpdate)
        });

        if (res.status === 401) {
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
          return;
        }

        if (res.ok) {
          setIsModalOpen(false);
          fetchItems();
        } else {
          const errData = await res.json();
          setFormError(errData.msg || errData.error || 'Failed to save.');
        }
        return;
      }

      const parsedData = { ...formData };
      
      // Transform strings back to arrays/objects
      if (activeTab === 'projects') {
        parsedData.techStack = typeof parsedData.techStack === 'string' 
          ? parsedData.techStack.split(',').map(s => s.trim()).filter(Boolean) 
          : parsedData.techStack;
      } else if (activeTab === 'blogs') {
        parsedData.tags = typeof parsedData.tags === 'string' 
          ? parsedData.tags.split(',').map(s => s.trim()).filter(Boolean) 
          : parsedData.tags;
      }

      const endpoint = activeTab === 'blogs' ? '/api/blogs' : `/api/${activeTab}`;
      
      let url = `${appConfig.apiBaseUrl}${endpoint}`;
      let method = 'POST';
      
      if (editingItem) {
        url = `${url}/${editingItem._id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(parsedData)
      });

      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }

      if (res.ok) {
        setIsModalOpen(false);
        fetchItems();
      } else {
        const errData = await res.json();
        setFormError(errData.msg || errData.error || 'Failed to save.');
      }
    } catch (err) {
      setFormError(err.message || 'Error saving data. Please check inputs.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const renderFormFields = () => {
    const labelClass = "block text-[10px] font-display font-bold uppercase tracking-widest text-slate-400 mb-1.5";
    const inputClass = "w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-2xl p-3.5 text-slate-250 text-sm focus:outline-none transition-all duration-300 shadow-inner font-sans";
    const selectClass = "w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-2xl p-3.5 text-slate-250 text-sm focus:outline-none transition-all duration-300 shadow-inner font-sans cursor-pointer";

    if (activeTab === 'stats') {
      return (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Label</label>
            <input type="text" name="label" value={formData.label || ''} onChange={handleChange} className={inputClass} placeholder="e.g. Years Experience" />
          </div>
          <div>
            <label className={labelClass}>Value (Number)</label>
            <input type="number" name="value" value={formData.value || 0} onChange={handleChange} className={inputClass} />
          </div>
        </div>
      );
    }
    
    if (activeTab === 'projects') {
      return (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Title</label>
            <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea name="description" value={formData.description || ''} onChange={handleChange} className={inputClass} rows="3"></textarea>
          </div>
          <div>
            <label className={labelClass}>Tech Stack (comma separated)</label>
            <input type="text" name="techStack" value={formData.techStack || ''} onChange={handleChange} className={inputClass} placeholder="React, Node.js, MongoDB" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Image URL</label>
              <input type="text" name="image" value={formData.image || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select name="category" value={formData.category || 'software'} onChange={handleChange} className={selectClass}>
                <option value="software">Software</option>
                <option value="writing">Writing</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Live Link</label>
              <input type="text" name="liveLink" value={formData.liveLink || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>GitHub Link</label>
              <input type="text" name="githubLink" value={formData.githubLink || ''} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <div className="flex items-center space-x-2.5 pt-2">
            <input type="checkbox" name="featured" id="featured" checked={formData.featured || false} onChange={handleChange} className="w-4 h-4 rounded-lg text-indigo-600 focus:ring-indigo-500/30 bg-slate-950 border-slate-800" />
            <label htmlFor="featured" className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-350 cursor-pointer">Featured Project</label>
          </div>
        </div>
      );
    }

    if (activeTab === 'blogs') {
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title</label>
              <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Slug (URL friendly)</label>
              <input type="text" name="slug" value={formData.slug || ''} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Excerpt</label>
            <textarea name="excerpt" value={formData.excerpt || ''} onChange={handleChange} className={inputClass} rows="2"></textarea>
          </div>
          <div>
            <label className={labelClass}>Content (Markdown)</label>
            <textarea name="content" value={formData.content || ''} onChange={handleChange} className={`${inputClass} font-mono text-xs`} rows="8"></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tags (comma separated)</label>
              <input type="text" name="tags" value={formData.tags || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Read Time</label>
              <input type="text" name="readTime" value={formData.readTime || ''} onChange={handleChange} className={inputClass} placeholder="5 min read" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Cover Image URL</label>
            <input type="text" name="coverImage" value={formData.coverImage || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div className="flex items-center space-x-2.5 pt-2">
            <input type="checkbox" name="published" id="published" checked={formData.published !== false} onChange={handleChange} className="w-4 h-4 rounded-lg text-indigo-600 focus:ring-indigo-500/30 bg-slate-950 border-slate-800" />
            <label htmlFor="published" className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-350 cursor-pointer">Published</label>
          </div>
        </div>
      );
    }

    if (activeTab === 'timeline') {
      return (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Year</label>
            <input type="text" name="year" value={formData.year || ''} onChange={handleChange} className={inputClass} placeholder="e.g. 2023" />
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className={inputClass} placeholder="e.g. Trek to Sajek Valley" />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea name="description" value={formData.description || ''} onChange={handleChange} className={inputClass} rows="4" placeholder="Describe the moment..."></textarea>
          </div>
        </div>
      );
    }

    if (activeTab === 'gallery') {
      return (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Image URL</label>
            <input type="text" name="url" value={formData.url || ''} onChange={handleChange} className={inputClass} placeholder="e.g. https://images.unsplash.com/..." />
          </div>
          <div>
            <label className={labelClass}>Caption</label>
            <input type="text" name="caption" value={formData.caption || ''} onChange={handleChange} className={inputClass} placeholder="e.g. Morning mist in the mountains" />
          </div>
          <div>
            <label className={labelClass}>Span Layout</label>
            <select name="span" value={formData.span || 'col-span-1 row-span-1'} onChange={handleChange} className={selectClass}>
              <option value="col-span-1 row-span-1">Standard (1x1)</option>
              <option value="col-span-2 row-span-1">Wide (2x1)</option>
              <option value="col-span-1 row-span-2">Tall (1x2)</option>
              <option value="col-span-2 row-span-2">Large Square (2x2)</option>
            </select>
          </div>
        </div>
      );
    }

    if (activeTab === 'quote') {
      return (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Quote</label>
            <textarea name="quote" value={formData.quote || ''} onChange={handleChange} className={inputClass} rows="4" placeholder="Enter the quote..."></textarea>
          </div>
          <div>
            <label className={labelClass}>Attribution</label>
            <input type="text" name="attribution" value={formData.attribution || ''} onChange={handleChange} className={inputClass} placeholder="e.g. Stephen King" />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in-up">
      {/* Main Sidebar + Content Grid */}
      <div className="flex flex-col md:flex-row gap-8 relative">
        {/* Sidebar */}
        <aside 
          className={`space-y-3 shrink-0 transition-all duration-550 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isSidebarOpen ? 'w-full md:w-64' : 'w-full md:w-20'
          }`}
        >
          {/* Sidebar Header with Collapse Toggle */}
          <div className={`hidden md:flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} px-1 mb-4`}>
            {isSidebarOpen && (
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-display">
                Navigation
              </span>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white transition-all shadow-inner"
              title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <span className="material-icons-outlined text-xs flex items-center justify-center">
                {isSidebarOpen ? 'menu_open' : 'menu'}
              </span>
            </button>
          </div>

          {(personasData.length > 0 ? personasData : personas).map(p => {
            const targetId = p.personaId || p.id;
            let icon = 'person';
            if (targetId === 'developer') icon = 'code';
            else if (targetId === 'writer') icon = 'history_edu';
            else if (targetId === 'friend') icon = 'people_outline';
            else if (targetId === 'philosopher') icon = 'psychology';

            const isActive = activePersonaTab === targetId;

            return (
              <button
                key={targetId}
                onClick={() => handlePersonaTabChange(targetId)}
                className={`w-full px-5 py-4 rounded-2xl font-display font-bold uppercase tracking-widest text-[9px] transition-all duration-350 border flex items-center ${
                  isSidebarOpen ? 'justify-start space-x-3.5' : 'justify-center'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 border-indigo-400/20 text-white shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                    : 'bg-slate-900/40 border-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800/60 hover:border-slate-700'
                }`}
                title={!isSidebarOpen ? p.title : ''}
              >
                <span className="material-icons-outlined text-base shrink-0">{icon}</span>
                {isSidebarOpen && <span>{p.title}</span>}
              </button>
            );
          })}
        </aside>

        {/* Main Panel */}
        <div className="flex-1 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl p-8 min-h-[550px] shadow-2xl relative overflow-hidden">
          {/* Ambient light glow inside the card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
            <div>
              <h2 className="text-xl font-display font-black text-white capitalize tracking-wide flex items-center gap-2.5">
                <span className="material-icons-outlined text-indigo-400 text-xl">
                  {activeTab === 'projects' ? 'grid_view' : (activeTab === 'blogs' ? 'article' : (activeTab === 'stats' ? 'insights' : (activeTab === 'timeline' ? 'calendar_today' : 'photo_camera')))}
                </span>
                <span className="capitalize">{getTabsForPersona(activePersonaTab).find(t => t.id === activeTab)?.label || activeTab} Management</span>
              </h2>
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
                {getTabsForPersona(activePersonaTab).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-350 hover:border-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            {activeTab === 'quote' ? (
              <button 
                onClick={() => handleEdit(items[0] || { quote: '', attribution: '' })}
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 border border-indigo-400/20 text-white px-5 py-3 rounded-2xl font-display font-bold uppercase tracking-widest text-[9px] shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all duration-300 flex items-center space-x-2 shrink-0"
              >
                <span className="material-icons-outlined text-sm">edit</span>
                <span>Update Quote</span>
              </button>
            ) : (
              <button 
                onClick={handleCreate}
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 border border-indigo-400/20 text-white px-5 py-3 rounded-2xl font-display font-bold uppercase tracking-widest text-[9px] shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all duration-300 flex items-center space-x-2 shrink-0"
              >
                <span className="material-icons-outlined text-sm">add</span>
                <span>Create New</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="space-y-3.5 relative z-10">
              {items.length === 0 ? (
                <p className="text-slate-500 text-center py-16 text-sm font-medium">No {activeTab} found.</p>
              ) : (
                items.map(item => (
                  <div key={item._id} className="flex justify-between items-center p-5 bg-slate-950/40 border border-slate-800/80 rounded-2xl group hover:border-indigo-500/30 hover:bg-slate-950/90 transition-all duration-300 shadow-sm">
                    <div>
                      <h3 className="font-display font-bold text-slate-200 group-hover:text-indigo-400 transition-colors text-base tracking-wide">
                        {item.title || item.caption || item.label || item.id || 'Unnamed Item'}
                      </h3>
                      {(item.slug || item.value !== undefined || item.personaId || item.year || item.span || item.attribution) && (
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {item.slug && <span className="text-[9px] font-mono bg-slate-900/60 border border-slate-800/80 text-slate-400 px-2 py-0.5 rounded-md">Slug: {item.slug}</span>}
                          {item.value !== undefined && <span className="text-[9px] font-mono bg-slate-900/60 border border-slate-800/80 text-slate-400 px-2 py-0.5 rounded-md">Value: {item.value}</span>}
                          {item.year && <span className="text-[9px] font-mono bg-slate-900/60 border border-slate-800/80 text-slate-400 px-2 py-0.5 rounded-md">Year: {item.year}</span>}
                          {item.span && <span className="text-[9px] font-mono bg-slate-900/60 border border-slate-800/80 text-slate-400 px-2 py-0.5 rounded-md">Span: {item.span}</span>}
                          {item.attribution && <span className="text-[9px] font-mono bg-slate-900/60 border border-slate-800/80 text-slate-400 px-2 py-0.5 rounded-md">By: {item.attribution}</span>}
                          {item.personaId && <span className="text-[8px] font-black uppercase tracking-widest bg-indigo-950/40 border border-indigo-900/40 text-indigo-400 px-2.5 py-0.5 rounded-full">Persona: {item.personaId}</span>}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="p-2 rounded-xl bg-slate-900/85 hover:bg-indigo-600/15 border border-slate-800/80 hover:border-indigo-500/30 text-indigo-400 transition-all duration-200 shadow-inner"
                      >
                        <span className="material-icons-outlined text-sm flex items-center justify-center">edit</span>
                      </button>
                      {activeTab !== 'quote' && (
                        <button 
                          onClick={() => handleDelete(item)} 
                          className="p-2 rounded-xl bg-slate-900/85 hover:bg-red-600/15 border border-slate-800/80 hover:border-red-500/30 text-red-450 transition-all duration-200 shadow-inner"
                        >
                          <span className="material-icons-outlined text-sm flex items-center justify-center">delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950 w-screen h-screen flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-6 border-b border-slate-800/80 bg-slate-950/40 flex shrink-0 w-full">
            <div className="max-w-4xl mx-auto w-full flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-display font-black text-white flex items-center gap-3">
                <span>{editingItem ? 'Edit Item' : 'Create New Item'}</span>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-950/60 text-indigo-400 border border-indigo-900/40">
                  Persona: {formData.personaId}
                </span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-all shadow-inner"
              >
                <span className="material-icons-outlined text-sm flex items-center justify-center">close</span>
              </button>
            </div>
          </div>
          
          {/* Body */}
          <div className="flex-1 overflow-y-auto w-full p-6 md:p-12">
            <div className="max-w-4xl mx-auto w-full">
              {formError && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-2xl text-red-400 text-xs font-semibold uppercase tracking-wider">
                  {formError}
                </div>
              )}

              {/* Render appropriate form based on active tab */}
              {renderFormFields()}
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-slate-800/80 bg-slate-950/40 flex shrink-0 mt-auto w-full">
            <div className="max-w-4xl mx-auto w-full flex justify-end space-x-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 text-xs font-display font-bold uppercase tracking-wider text-slate-450 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/20 text-white rounded-2xl font-display font-bold uppercase tracking-widest text-[9px] shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all duration-300"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setItemToDelete(null)}></div>
          <div className="relative bg-slate-900/95 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-display font-black text-white mb-2 tracking-wide">Confirm Deletion</h3>
            <p className="text-slate-450 text-sm leading-relaxed mb-6 font-light font-body">
              Are you sure you want to delete <span className="font-bold text-white">{itemToDelete.title || itemToDelete.label || itemToDelete.id}</span>? This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setItemToDelete(null)}
                className="px-5 py-2.5 text-xs font-display font-bold uppercase tracking-wider text-slate-450 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 border border-red-400/20 text-white rounded-2xl font-display font-bold uppercase tracking-widest text-[9px] shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
