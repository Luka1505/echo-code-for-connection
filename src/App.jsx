import { NavLink, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import CheckIn from './pages/CheckIn.jsx';
import VoiceEcho from './pages/VoiceEcho.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Resources from './pages/Resources.jsx';
import Reflection from './pages/Reflection.jsx';

const navLinkBase =
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center app-bg text-gray-100">
      {/* Cosmic background elements */}
      <div className="cosmic-glow"></div>
      <div className="cosmic-blob blob-1"></div>
      <div className="cosmic-blob blob-2"></div>
      <div className="cosmic-blob blob-3"></div>
      
      {/* Star particles - very subtle background elements */}
      <div className="star-particle" style={{top: '15%', left: '12%', animation: 'starFloat1 28s ease-in-out infinite'}}></div>
      <div className="star-particle" style={{top: '32%', left: '78%', animation: 'starFloat2 32s ease-in-out infinite'}}></div>
      <div className="star-particle" style={{top: '58%', left: '25%', animation: 'starFloat3 26s ease-in-out infinite'}}></div>
      <div className="star-particle" style={{top: '72%', left: '88%', animation: 'starFloat4 30s ease-in-out infinite'}}></div>
      <div className="star-particle" style={{top: '22%', left: '65%', animation: 'starFloat5 27s ease-in-out infinite'}}></div>
      <div className="star-particle" style={{top: '84%', left: '42%', animation: 'starFloat1 29s ease-in-out infinite'}}></div>
      <div className="star-particle" style={{top: '48%', left: '8%', animation: 'starFloat2 31s ease-in-out infinite'}}></div>
      <div className="star-particle" style={{top: '68%', left: '55%', animation: 'starFloat3 28s ease-in-out infinite'}}></div>
      
      <div className="w-full max-w-3xl mx-4 rounded-2xl glass-card fade-in">
        <header className="border-b border-slate-800 px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">
              ECHO
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              A minimal space for check-ins and reflections.
            </p>
          </div>
          <nav className="flex flex-wrap gap-1.5 text-xs">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${navLinkBase} ${
                  isActive
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              Landing
            </NavLink>
            <NavLink
              to="/check-in"
              className={({ isActive }) =>
                `${navLinkBase} ${
                  isActive
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              Check-in
            </NavLink>
            <NavLink
              to="/voice-echo"
              className={({ isActive }) =>
                `${navLinkBase} ${
                  isActive
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              Voice Echo
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${navLinkBase} ${
                  isActive
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/resources"
              className={({ isActive }) =>
                `${navLinkBase} ${
                  isActive
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              Resources
            </NavLink>
          </nav>
        </header>

        <main className="px-6 py-6">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/check-in" element={<CheckIn />} />
            <Route path="/voice-echo" element={<VoiceEcho />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/reflection" element={<Reflection />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

