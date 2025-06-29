
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Info, Grid, Search, Settings, LogOut, User } from 'lucide-react';
import { useSupabaseStore } from '../store/supabaseStore';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentAdmin, setCurrentAdmin } = useSupabaseStore();

  const handleLogout = () => {
    setCurrentAdmin(null);
    navigate('/');
  };

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/about', label: 'About', icon: Info },
    { to: '/categories', label: 'Categories', icon: Grid },
    { to: '/status', label: 'Check Status', icon: Search },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                E-LIFE SOCIETY
              </h1>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                      location.pathname === item.to
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
              
              {currentAdmin && currentAdmin.role === 'super' && (
                <Link
                  to="/admin/dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings size={16} />
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {currentAdmin ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {currentAdmin.username}
                  </span>
                  <Badge variant={currentAdmin.role === 'super' ? 'default' : 'secondary'}>
                    {currentAdmin.role}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/admin/login">
                <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
