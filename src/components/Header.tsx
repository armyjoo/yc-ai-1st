import React from 'react';
import { User, UserRole } from '../types';
import { Shield, LogIn, LogOut, Cpu, Menu, X, Award, Info, Calendar, Image, FileText, Lock, MessageSquare, Settings, Home } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const menuItems = [
    { id: 'home', label: '메인 광장', icon: Home },
    { id: 'greetings', label: '소개 & 인사말', icon: Info },
    { id: 'footprints', label: '교육의 발자취', icon: Calendar },
    { id: 'showcase', label: '강사 활동 갤러리', icon: Image },
    { id: 'application', label: '교육상담 & 신청', icon: MessageSquare },
    { id: 'resources', label: '강사실/자료실', icon: Lock },
    { id: 'notice', label: '공지사항', icon: FileText },
  ];

  // If user is admin, add admin panel menu
  if (currentUser && currentUser.role === 'admin') {
    menuItems.push({ id: 'admin', label: '관리자 패널', icon: Settings });
  }

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'instructor':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'instructor_pending':
        return 'bg-amber-100 text-amber-700 border border-amber-200 animate-pulse';
      default:
        return 'bg-blue-100 text-blue-700 border border-blue-200';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return '관리자';
      case 'instructor':
        return '인증 강사';
      case 'instructor_pending':
        return '승인 대기';
      default:
        return '일반 회원';
    }
  };

  return (
    <header className="w-full relative bg-white">
      {/* Sleek Interface Top Banner & Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-6 shadow-xs relative overflow-hidden shrink-0">
        {/* Subtle high-tech pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0066FF_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/60 shrink-0">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-brand uppercase font-orbitron">
                YEONCHEON AI ACADEMY
              </h1>
              <p className="text-[10px] font-extrabold text-accent tracking-widest uppercase flex items-center gap-1.5">
                <span>AI Education Expert</span>
                <span className="text-slate-300">•</span>
                <span>1st Gen</span>
              </p>
            </div>
          </div>

          <div className="text-center md:text-left py-1 md:py-0 border-y md:border-y-0 border-slate-100 w-full md:w-auto">
            <h2 className="text-base sm:text-lg font-bold text-slate-700 font-sans">
              연천의 미래를 밝히는 AI 교육 인재 양성소
            </h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              연천 AI 교육 전문가 강사 양성과정 공식 통합 플랫폼
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-50 text-brand text-xs font-bold rounded-full border border-blue-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
              OFFICIAL PLATFORM
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-brand text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left Brand Area */}
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-accent" />
              <span className="font-sans font-bold text-base text-white select-none">
                연천 AI<span className="text-accent font-orbitron font-extrabold ml-1">1기</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex h-full items-center">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`h-full flex items-center gap-1.5 px-4 transition-colors relative text-sm ${
                      isActive
                        ? 'bg-white/10 border-b-2 border-accent font-bold text-white'
                        : 'text-white/80 hover:bg-white/5 hover:text-white font-medium'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-accent' : 'text-white/60'}`} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Right User Authentication Area */}
            <div className="hidden sm:flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end text-right">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-white">{currentUser.name}</span>
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${getRoleBadgeColor(currentUser.role)}`}>
                        {getRoleLabel(currentUser.role)}
                      </span>
                    </div>
                    <span className="text-[9px] text-white/70 font-mono">{currentUser.email}</span>
                  </div>
                  
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white/90 hover:text-red-200 bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/10"
                  >
                    <LogOut className="w-3 h-3" />
                    로그아웃
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="bg-accent text-blue-900 px-4 py-1.5 rounded text-xs font-bold uppercase tracking-tight hover:brightness-105 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  로그인 / 가입
                </button>
              )}
            </div>

            {/* Mobile Menu Hamburger Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              {currentUser && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getRoleBadgeColor(currentUser.role)}`}>
                  {currentUser.name.substring(0, 3)}
                </span>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-3 space-y-1 shadow-inner">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-brand bg-blue-50/75'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
            
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {currentUser ? (
                <div className="px-4 py-2 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-xs text-slate-950">{currentUser.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getRoleBadgeColor(currentUser.role)}`}>
                      {getRoleLabel(currentUser.role)}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mb-2">{currentUser.email}</p>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-1 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    로그아웃
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white bg-brand rounded-lg shadow"
                >
                  <LogIn className="w-4 h-4" />
                  로그인 / 회원가입
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
