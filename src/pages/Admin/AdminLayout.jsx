import { Navigate, Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  const isAuthenticated = !!localStorage.getItem('adminToken');

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-body relative overflow-x-hidden">
      {/* Top Navbar */}
      <nav className="bg-slate-900/40 backdrop-blur-xl border-b border-slate-800/80 py-5 z-50 relative shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
        <div className="w-11/12 max-w-[1800px] mx-auto flex justify-between items-center px-4 md:px-0">
          <div className="flex items-center space-x-3.5">
            <Link to="/admin" className="flex items-center space-x-2.5 group">
              <span className="material-icons-outlined text-indigo-400 group-hover:rotate-12 transition-transform duration-300 text-xl flex items-center justify-center">
                admin_panel_settings
              </span>
              <h1 className="text-base md:text-lg font-display font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 uppercase">
                System Control Center
              </h1>
            </Link>
            
            <div className="hidden sm:flex items-center space-x-2 text-[9px] bg-slate-950/80 border border-slate-850 px-3 py-1 rounded-full text-slate-400 font-bold uppercase tracking-wider backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Site (Home) Button */}
            <a
              href="https://nokib.vercel.app/"
              className="text-xs font-display font-bold uppercase tracking-wider text-slate-355 hover:text-white bg-slate-900 border border-slate-800 hover:border-indigo-500/40 px-5 py-2.5 rounded-2xl transition-all duration-300 flex items-center space-x-2 shadow-sm"
            >
              <span className="material-icons-outlined text-sm flex items-center justify-center">home</span>
              <span className="hidden sm:inline">View Site</span>
            </a>

            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                window.location.href = '/admin/login';
              }}
              className="text-xs font-display font-bold uppercase tracking-wider text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-800 hover:border-red-500/30 px-5 py-2.5 rounded-2xl transition-all duration-300 flex items-center space-x-2 shadow-sm"
            >
              <span className="material-icons-outlined text-sm flex items-center justify-center">logout</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="py-10 w-11/12 max-w-[1800px] mx-auto px-4 md:px-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
