import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DeveloperLayout from './layouts/DeveloperLayout';
import Home from './components/Home';
import Blog from './components/Blog/Blog';
import BlogPost from './components/Blog/BlogPost';
import SelectPersona from './components/SelectPersona';
import GalaxyLanding from './components/GalaxyLanding';
import PersonaLayout from './layouts/PersonaLayout';
import { appConfig } from './config';

function LandingWrapper() {
  const [viewMode, setViewMode] = useState(() => {
    const saved = localStorage.getItem('landingViewMode');
    if (saved) return saved;
    return appConfig.useGalaxyLanding ? 'galaxy' : 'grid';
  });

  const toggleViewMode = () => {
    const newMode = viewMode === 'galaxy' ? 'grid' : 'galaxy';
    setViewMode(newMode);
    localStorage.setItem('landingViewMode', newMode);
  };

  return viewMode === 'galaxy' ? (
    <GalaxyLanding onViewModeChange={toggleViewMode} />
  ) : (
    <SelectPersona onViewModeChange={toggleViewMode} />
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page to select a persona */}
        <Route path="/" element={<LandingWrapper />} />

        {/* Existing developer portfolio UI hosted under /developer */}
        <Route
          path="/developer/*"
          element={
            <DeveloperLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="*" element={<Navigate to="" replace />} />
              </Routes>
            </DeveloperLayout>
          }
        />

        {/* Dynamic routing shell for other personas */}
        <Route path="/:personaId/*" element={<PersonaLayout />} />

        {/* Fallback to root landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

