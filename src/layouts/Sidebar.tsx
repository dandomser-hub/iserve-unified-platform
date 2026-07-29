import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Home, FileText, Wallet, Scale, Shield,
  AlertTriangle, Heart, BarChart2, Map, Settings, UserCog,
  ClipboardList, Layers, ChevronDown, ChevronRight, BookOpen,
  Activity, Archive, Star, MapPin
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useRole } from '@/app/providers/RoleProvider';
import { canAccessPath } from '@/utils/routeAccess';
import { BARANGAY_INFO } from '@/data/mockReferenceData';
import type { RoleId } from '@/types/auth';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

function getNavGroups(_roleId: RoleId): { group: string; items: NavItem[] }[] {
  return [
    {
      group: 'Overview',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
      ],
    },
    {
      group: 'Registry',
      items: [
        { label: 'Residents', path: '/residents', icon: <Users size={16} /> },
        { label: 'Households', path: '/households', icon: <Home size={16} /> },
      ],
    },
    {
      group: 'Documents',
      items: [
        { label: 'Request Intake', path: '/documents/intake', icon: <FileText size={16} /> },
        { label: 'Document Queue', path: '/documents/queue', icon: <Layers size={16} /> },
        { label: 'Templates', path: '/documents/templates', icon: <BookOpen size={16} /> },
        { label: 'Verification', path: '/documents/verification', icon: <Shield size={16} /> },
      ],
    },
    {
      group: 'Collections',
      items: [
        { label: 'Reference Log', path: '/collections/reference-log', icon: <Wallet size={16} /> },
        { label: 'Daily Certification', path: '/collections/daily-certification', icon: <ClipboardList size={16} /> },
        { label: 'Fees & Exemptions', path: '/collections/fees-exemptions', icon: <Archive size={16} /> },
      ],
    },
    {
      group: 'Blotter & KP',
      items: [
        { label: 'Blotter Registry', path: '/blotter', icon: <Scale size={16} /> },
        { label: 'KP Case Tracker', path: '/kp-cases', icon: <Activity size={16} /> },
      ],
    },
    {
      group: 'DRRM',
      items: [
        { label: 'DRRM Dashboard', path: '/drrm', icon: <AlertTriangle size={16} /> },
        { label: 'Early Warning', path: '/drrm/early-warning', icon: <AlertTriangle size={16} /> },
        { label: 'SitRep Builder', path: '/drrm/sitrep', icon: <FileText size={16} /> },
        { label: 'DANA Form', path: '/drrm/dana', icon: <Map size={16} /> },
        { label: 'Evacuation / DROMIC', path: '/drrm/evacuation-dromic', icon: <Home size={16} /> },
        { label: 'Hazard & Risk', path: '/drrm/hazard-risk', icon: <Map size={16} /> },
        { label: 'DRRM Resources', path: '/drrm/resources', icon: <Archive size={16} /> },
        { label: 'Relief Distribution', path: '/drrm/relief-distribution', icon: <Heart size={16} /> },
        { label: 'BDRRMC Actions', path: '/drrm/actions', icon: <ClipboardList size={16} /> },
      ],
    },
    {
      group: 'GAD',
      items: [
        { label: 'GAD Dashboard', path: '/gad', icon: <Heart size={16} /> },
        { label: 'Annex D-1', path: '/gad/annex-d1', icon: <FileText size={16} /> },
        { label: 'Annex E-1', path: '/gad/annex-e1', icon: <FileText size={16} /> },
        { label: 'Activity Monitor', path: '/gad/activity-monitor', icon: <Activity size={16} /> },
        { label: 'Participant Log', path: '/gad/participants', icon: <Users size={16} /> },
        { label: 'Budget Attribution', path: '/gad/budget-attribution', icon: <Wallet size={16} /> },
      ],
    },
    {
      group: 'Reports & Review',
      items: [
        { label: 'Reports & Exports', path: '/reports', icon: <BarChart2 size={16} /> },
        { label: 'Municipal Review', path: '/review/municipal-city', icon: <Star size={16} /> },
        { label: 'Compliance (SGLGB)', path: '/compliance/sglgb', icon: <Shield size={16} /> },
        { label: 'Data Quality', path: '/data-quality', icon: <Activity size={16} /> },
      ],
    },
    {
      group: 'Administration',
      items: [
        { label: 'Users & Roles', path: '/admin/users-roles', icon: <UserCog size={16} /> },
        { label: 'Audit Trail', path: '/admin/audit', icon: <ClipboardList size={16} /> },
        { label: 'Backup & Sync', path: '/admin/backup-sync', icon: <Archive size={16} /> },
        { label: 'Settings', path: '/admin/settings', icon: <Settings size={16} /> },
      ],
    },
    {
      group: 'Future Roadmap',
      items: [
        { label: 'Future Modules', path: '/roadmap', icon: <Map size={16} /> },
      ],
    },
  ];
}

function isAllowed(roleId: RoleId, item: NavItem): boolean {
  return canAccessPath(roleId, item.path);
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { roleId } = useRole();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const navGroups = useMemo(() => {
    if (!roleId) return [];
    return getNavGroups(roleId);
  }, [roleId]);

  const activeGroup = useMemo(() => {
    if (!roleId) return null;
    for (const { group, items } of navGroups) {
      const visible = items.filter(item => isAllowed(roleId, item));
      if (visible.some(item =>
        location.pathname === item.path ||
        location.pathname.startsWith(item.path + '/')
      )) {
        return group;
      }
    }
    return null;
  }, [location.pathname, navGroups, roleId]);

  if (!roleId) return null;

  function toggleGroup(group: string) {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  }

  function isExpanded(group: string): boolean {
    if (group in expandedGroups) return expandedGroups[group];
    return group === activeGroup;
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-40 flex flex-col
        bg-gradient-to-b from-forest-dark to-forest
        transform transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:z-auto lg:flex-shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo area */}
        <div className="p-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin size={18} className="text-forest" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Barangay iSERVE</p>
              <p className="text-green-200 text-[10px] leading-tight">{BARANGAY_INFO.name}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin px-2">
          {navGroups.map(({ group, items }) => {
            const visibleItems = items.filter(item => isAllowed(roleId, item));
            if (visibleItems.length === 0) return null;
            const expanded = isExpanded(group);

            return (
              <div key={group} className="mb-1">
                <button
                  onClick={() => toggleGroup(group)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-green-300/80 uppercase tracking-wider hover:text-green-200 transition-colors"
                >
                  <span>{group}</span>
                  {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </button>
                {expanded && (
                  <div className="space-y-0.5">
                    {visibleItems.map(item => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'text-green-100 hover:bg-white/10 hover:text-white'
                          }`
                        }
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 flex-shrink-0">
          <p className="text-green-300/60 text-[10px] text-center">Barangay iSERVE v0.1 · Prototype</p>
        </div>
      </aside>
    </>
  );
}
