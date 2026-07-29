import { Menu, Bell, Search, ChevronDown, LogOut, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole, useCurrentRole } from '@/app/providers/RoleProvider';
import { BARANGAY_INFO } from '@/data/mockReferenceData';

interface HeaderBarProps {
  onMenuToggle: () => void;
}

const ROLE_COLORS: Record<string, string> = {
  system_admin: 'bg-slate-700 text-white',
  punong_barangay: 'bg-forest text-white',
  barangay_secretary: 'bg-ocean text-white',
  barangay_treasurer: 'bg-mountain text-white',
  drrm_focal: 'bg-sky text-white',
  gad_focal: 'bg-grass text-white',
  municipal_reviewer: 'bg-amber-600 text-white',
  read_only_auditor: 'bg-slate-500 text-white',
};

export function HeaderBar({ onMenuToggle }: HeaderBarProps) {
  const { roleId, clearRole } = useRole();
  const currentRole = useCurrentRole();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function handleSwitchRole() {
    setDropdownOpen(false);
    clearRole();
    navigate('/login-demo');
  }

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center gap-3 px-4 flex-shrink-0 z-20">
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Barangay name (desktop) */}
      <div className="hidden lg:flex items-center gap-2 text-sm font-semibold text-slate-700">
        <span className="text-forest">{BARANGAY_INFO.name}</span>
        <span className="text-slate-300">·</span>
        <span className="text-slate-500 font-normal text-xs">{BARANGAY_INFO.municipality}</span>
      </div>

      {/* Quick search */}
      <div className="flex-1 max-w-xs hidden sm:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Quick search..."
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest bg-slate-50"
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Notifications */}
      <button className="relative p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
        <Bell size={18} />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Role indicator + switcher */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
        >
          {currentRole && (
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${ROLE_COLORS[currentRole.id] || 'bg-slate-200 text-slate-700'}`}>
              {currentRole.shortLabel}
            </span>
          )}
          <span className="text-xs text-slate-600 hidden sm:inline max-w-[120px] truncate">
            {currentRole?.label || 'Select Role'}
          </span>
          <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white rounded-xl border border-slate-200 shadow-xl py-1 w-56 z-50">
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active Session</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">{currentRole?.label}</p>
            </div>
            <button
              onClick={handleSwitchRole}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={14} className="text-forest" />
              Switch Role
            </button>
            <button
              onClick={handleSwitchRole}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={14} />
              Exit Demo
            </button>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
      )}
    </header>
  );
}
