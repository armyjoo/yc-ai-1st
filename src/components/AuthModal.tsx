import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { X, LogIn, UserPlus, Sparkles, Key } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
  onRegister: (
    email: string,
    name: string,
    role: UserRole,
    phone: string,
    affiliation: string,
    specialty: string,
    password?: string
  ) => void;
  usersList: User[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLogin,
  onRegister,
  usersList,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('general');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert('이메일 주소와 비밀번호를 모두 입력해 주세요.');
      return;
    }

    // Strict validation against usersList
    const matchedUser = usersList.find(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (!matchedUser) {
      alert('등록되지 않은 이메일 주소입니다. 회원가입 후 이용해 주세요.');
      return;
    }

    // Check password. Preseeded mock users default to '123456'
    const expectedPassword = matchedUser.password || '123456';
    if (expectedPassword !== password.trim()) {
      alert('비밀번호가 올바르지 않습니다. 다시 입력해 주세요.');
      return;
    }

    // Success
    onLogin(matchedUser);
    alert(`[로그인 완료] ${matchedUser.name}님, 오늘도 환영합니다!`);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !email.trim() ||
      !name.trim() ||
      !phone.trim() ||
      !affiliation.trim() ||
      !specialty.trim() ||
      !signUpPassword.trim()
    ) {
      alert('모든 입력 항목을 빠짐없이 채워주세요. (모든 필드는 필수 항목입니다)');
      return;
    }

    // Check if email already registered
    const isAlreadyRegistered = usersList.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (isAlreadyRegistered) {
      alert('이미 등록된 이메일 주소입니다. 다른 이메일을 사용해 주세요.');
      return;
    }

    onRegister(
      email.trim(),
      name.trim(),
      selectedRole,
      phone.trim(),
      affiliation.trim(),
      specialty.trim(),
      signUpPassword.trim()
    );

    alert(
      `[회원가입 완료]\n이름: ${name}\n이메일: ${email}\n분류: ${
        selectedRole === 'instructor_pending'
          ? '승인 대기 강사 회원 (최고관리자 확인 대조 후 강사방 해금)'
          : '일반 회원'
      }\n\n입력하신 정보로 로그인되었습니다.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-zoom-in border border-slate-100">
        
        {/* Top Header Background Panel */}
        <div className="bg-gradient-to-r from-slate-950 to-indigo-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-cyan-400 mb-1.5">
            <Key className="w-4 h-4 animate-bounce" />
            <span className="text-[10px] uppercase font-orbitron tracking-widest font-extrabold">MEMBERSHIP ACCESS</span>
          </div>
          <h3 className="text-lg font-bold">
            {isSignUp ? '연천 AI 통합 공식 회원가입' : '연천 AI 전문가 통합로그인'}
          </h3>
          <p className="text-[11px] text-slate-300 mt-1 font-sans">
            {isSignUp
              ? '간편 가입 후, 강사 수료증을 연동해 다양한 아카이브 서비스를 받으세요.'
              : '등록된 공식 이메일 계정과 패스워드를 입력하여 접속해 주세요.'}
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          

          {/* SIGN IN FORM */}
          {!isSignUp ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">이메일 주소 <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="예: admin@yeoncheon.ai"
                  className="w-full px-3.5 py-2.5 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">비밀번호 <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요 (예: 123456)"
                  className="w-full px-3.5 py-2.5 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand bg-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand hover:bg-brand/90 text-white font-extrabold text-xs rounded-xl shadow transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                로그인 완료
              </button>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role Select tab */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">회원 유형 선택 <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('general')}
                    className={`py-2 px-3 text-xs font-extrabold rounded-xl border text-center transition cursor-pointer ${
                      selectedRole === 'general'
                        ? 'bg-blue-50 text-brand border-brand'
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    일반 회원 (교사, 학부모 등)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('instructor_pending')}
                    className={`py-2 px-3 text-xs font-extrabold rounded-xl border text-center transition cursor-pointer ${
                      selectedRole === 'instructor_pending'
                        ? 'bg-blue-50 text-brand border-brand'
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    강사 회원 (연천 1기 전문가)
                  </button>
                </div>
              </div>

              {/* Basic credentials inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">가입자 성명 (실명) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예: 강동원"
                    className="w-full px-3.5 py-2.5 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">연락처 전화번호 <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="예: 010-9999-8888"
                    className="w-full px-3.5 py-2.5 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">가입용 이메일 계정 <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="예: instructor2@yeoncheon.ai"
                  className="w-full px-3.5 py-2.5 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                  required
                />
              </div>

              {/* Affiliation input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">소속 기관/학교명 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    placeholder="예: 연천고등학교 (혹은 개인)"
                    className="w-full px-3.5 py-2.5 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">주요 전문 교수 분야 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="예: 엔트리 블록코딩, 피지컬 교구"
                    className="w-full px-3.5 py-2.5 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                    required
                  />
                </div>
              </div>

              {/* Password field for signup */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">설정할 패스워드 <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="가입 후 로그인 시 사용할 패스워드를 입력하세요"
                  className="w-full px-3.5 py-2.5 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                  required
                />
              </div>

              {/* Notification note for instructor registration */}
              {selectedRole === 'instructor_pending' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[10.5px] text-amber-800 leading-relaxed">
                  📢 <span className="font-bold">안내:</span> 강사 회원으로 가입 신청을 완료하면 최고관리자가 수료 명부와 매칭한 후 즉각 정강사 권한으로 승인 처리합니다. 승인 대기 기간에는 강사실 입장 시 잠금화면이 표출됩니다.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-brand hover:bg-brand/95 text-white font-extrabold text-xs rounded-xl shadow transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                신규 통합가입 신청하기
              </button>
            </form>
          )}

          {/* Toggle between Sign In / Sign Up */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
            {isSignUp ? (
              <p>
                이미 공식 아이디를 갖고 계십니까?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-brand font-bold hover:underline cursor-pointer"
                >
                  기존 아이디 로그인
                </button>
              </p>
            ) : (
              <p>
                아직 연천 AI 1기 공식 아이디가 없으십니까?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-brand font-bold hover:underline cursor-pointer"
                >
                  회원가입 신청하기
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
