import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Brain,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Search,
  PenTool,
  Send,
  Target,
  TrendingUp,
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/analyze', icon: Search, label: 'Analyze' },
  { path: '/suggest', icon: Sparkles, label: 'Suggest' },
  { path: '/create', icon: PenTool, label: 'Create' },
  { path: '/post', icon: Send, label: 'Post' },
  { path: '/learn', icon: Target, label: 'Learn' },
  { path: '/improve', icon: TrendingUp, label: 'Improve' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <Sparkles size={22} />
          </div>
          {!collapsed && (
            <div className="sidebar__logo-text">
              <span className="sidebar__logo-name">Growcial</span>
              <span className="sidebar__logo-tag">OS</span>
            </div>
          )}
        </div>
        <button
          className="sidebar__toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Plan Badge */}
      {!collapsed && (
        <div className="sidebar__plan">
          <div className="sidebar__plan-card glass-card">
            <Zap size={16} className="sidebar__plan-icon" />
            <div>
              <div className="sidebar__plan-label">
                {user?.plan === 'free' ? 'Free Plan' : user?.plan || 'Free Plan'}
              </div>
              <div className="sidebar__plan-desc">2 ideas/day</div>
            </div>
            <button className="btn btn-primary btn-sm sidebar__upgrade-btn">
              Upgrade
            </button>
          </div>
        </div>
      )}

      {/* User & Logout */}
      <div className="sidebar__footer">
        <div className="sidebar__user">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="sidebar__avatar" />
          ) : (
            <div className="sidebar__avatar sidebar__avatar--placeholder">
              {user?.displayName?.[0] || 'U'}
            </div>
          )}
          {!collapsed && (
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">{user?.displayName || 'User'}</div>
              <div className="sidebar__user-email">{user?.email || ''}</div>
            </div>
          )}
        </div>
        <button className="sidebar__logout" onClick={handleLogout} aria-label="Logout">
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
