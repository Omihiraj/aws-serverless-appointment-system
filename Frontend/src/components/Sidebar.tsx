import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Calendar, UserCog, UserPlus, Store, BarChart3, Activity, Menu, X, Sparkles } from 'lucide-react';
interface SidebarProps {
  isMobileOpen: boolean;
  toggleMobileSidebar: () => void;
}
const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  toggleMobileSidebar
}) => {
  const navItems = [{
    name: 'Dashboard',
    path: '/dashboard',
    icon: <Calendar className="w-5 h-5" />
  }, {
    name: 'Client Profiles',
    path: '/dashboard/clients',
    icon: <Users className="w-5 h-5" />
  }, {
    name: 'Appointments History',
    path: '/dashboard/appointments',
    icon: <Calendar className="w-5 h-5" />
  }, {
    name: 'Treatment Profiles',
    path: '/dashboard/treatments',
    icon: <Sparkles className="w-5 h-5" />
  }, {
    name: 'Manage Therapists',
    path: '/dashboard/therapists',
    icon: <UserCog className="w-5 h-5" />
  }, {
    name: 'Manage Users',
    path: '/dashboard/users',
    icon: <UserPlus className="w-5 h-5" />
  }, {
    name: 'Manage Stores',
    path: '/dashboard/stores',
    icon: <Store className="w-5 h-5" />
  }, {
    name: 'Reports',
    path: '/dashboard/reports',
    icon: <BarChart3 className="w-5 h-5" />
  }, {
    name: 'Activity Log',
    path: '/dashboard/activity',
    icon: <Activity className="w-5 h-5" />
  }];
  return <>
      {isMobileOpen && <div className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" onClick={toggleMobileSidebar} />}
      <div className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out transform
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:relative lg:translate-x-0
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-[#D4AF37]">
            Derma Plan Academy
          </h1>
          <button className="p-1 rounded-md lg:hidden hover:bg-gray-800" onClick={toggleMobileSidebar}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-5">
          <ul className="space-y-2">
            {navItems.map(item => <li key={item.path}>
                <NavLink to={item.path} className={({
              isActive
            }) => `
                    flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200
                    ${isActive ? 'bg-gray-800 text-[#D4AF37]' : 'text-gray-300 hover:bg-gray-800 hover:text-[#D4AF37]'}
                  `}>
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>)}
          </ul>
        </nav>
      </div>
    </>;
};
export default Sidebar;