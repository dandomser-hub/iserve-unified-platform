import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Star, FileText, Wallet, AlertTriangle, Users, Eye, Search, MapPin, Lock, User, ChevronRight } from 'lucide-react';
import { useRole } from '@/app/providers/RoleProvider';
import { ROLES, ROLE_HOME, APP_NAME, APP_TAGLINE } from '@/utils/constants';
import type { RoleId } from '@/types/auth';

const ROLE_ICONS: Record<string, React.ReactNode> = {
  system_admin: <Shield size={15} />,
  punong_barangay: <Star size={15} />,
  barangay_secretary: <FileText size={15} />,
  barangay_treasurer: <Wallet size={15} />,
  drrm_focal: <AlertTriangle size={15} />,
  gad_focal: <Users size={15} />,
  municipal_reviewer: <Eye size={15} />,
  read_only_auditor: <Search size={15} />,
};

const ROLE_PICKER_ORDER: RoleId[] = [
  'drrm_focal',
  'punong_barangay',
  'gad_focal',
  'municipal_reviewer',
  'barangay_secretary',
  'barangay_treasurer',
  'read_only_auditor',
  'system_admin',
];

const ROLE_BG: Record<string, string> = {
  system_admin: 'from-slate-600 to-slate-800',
  punong_barangay: 'from-forest to-forest-dark',
  barangay_secretary: 'from-ocean to-cyan-800',
  barangay_treasurer: 'from-mountain to-green-800',
  drrm_focal: 'from-sky to-blue-700',
  gad_focal: 'from-grass to-green-700',
  municipal_reviewer: 'from-amber-500 to-amber-700',
  read_only_auditor: 'from-slate-400 to-slate-600',
};

export function RoleSelectorPage() {
  const { setRole } = useRole();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (username.trim().toLowerCase() !== 'admin' || password !== 'demo1234') {
      setError('Invalid username or password.');
      return;
    }
    setRole('system_admin');
    navigate(ROLE_HOME['system_admin']);
  }

  function handleQuickSelect(roleId: RoleId) {
    setRole(roleId);
    navigate(ROLE_HOME[roleId]);
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-start py-10 px-4">
      <img
        src="/resources/barangay-iserve-resilient-community-hero-v1.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-600 to-emerald-400 opacity-[0.85]" />

      {/* ── Login Card ── */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
        {/* Card header strip */}
        <div className="bg-gradient-to-r from-forest-dark to-forest px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPin size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">{APP_NAME}</h1>
            <p className="text-green-200 text-xs leading-tight">Resilient and Empowered Barangay</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-white/[0.85] px-6 py-6 space-y-4">
          <div>
            <p className="text-gray-800 font-semibold text-sm">Sign in to your iSERVE account</p>
            <p className="text-forest-dark text-xs mt-0.5 leading-relaxed">{APP_TAGLINE}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                placeholder="Username"
                autoComplete="username"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors placeholder:text-gray-400 text-gray-800"
              />
            </div>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors placeholder:text-gray-400 text-gray-800"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-forest to-forest-dark text-white font-semibold text-sm py-2.5 rounded-lg hover:opacity-90 active:opacity-80 transition-opacity flex items-center justify-center gap-2"
          >
            Sign In
            <ChevronRight size={14} />
          </button>

          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-center">
            <p className="text-amber-700 text-[11px]">
              For DEMO purposes, Username: <span className="font-mono font-semibold">admin</span>, Password: <span className="font-mono font-semibold">demo1234</span>
            </p>
          </div>

        </form>
      </div>

      {/* ── Quick Demo Role Picker ── */}
      <div className="relative z-10 w-full max-w-3xl mt-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/20" />
          <p className="text-white/60 text-[11px] font-semibold uppercase tracking-widest whitespace-nowrap">
            Or jump in as a demo role
          </p>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ROLE_PICKER_ORDER.map(roleId => {
            const role = ROLES.find(item => item.id === roleId);
            if (!role) return null;

            return (
            <button
              key={role.id}
              onClick={() => handleQuickSelect(role.id as RoleId)}
              className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-xl p-3 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg flex items-center gap-2.5"
            >
              <div className={`w-7 h-7 bg-gradient-to-br ${ROLE_BG[role.id]} rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
                {ROLE_ICONS[role.id]}
              </div>
              <div className="min-w-0">
                <p className="text-white font-medium text-xs leading-tight truncate">{role.shortLabel}</p>
                <p className="text-green-300/70 text-[10px] group-hover:text-green-200 transition-colors">Select →</p>
              </div>
            </button>
            );
          })}
        </div>

        <p className="text-green-300/50 text-[11px] text-center mt-5 max-w-xl mx-auto leading-relaxed">
          This is a <strong className="text-green-300/70">prototype demo only</strong>. No real authentication, resident data, payments, or sensitive records are used. All data is fictional.
        </p>
      </div>
    </div>
  );
}
