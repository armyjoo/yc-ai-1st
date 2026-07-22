import React, { useState } from 'react';
import { CourseApplication, User, HomeContent } from '../types';
import { MessageSquare, Send, CheckCircle2, History, HelpCircle, ShieldCheck, Edit, Settings, Save, X, Sparkles } from 'lucide-react';

// Masking functions for privacy protection
const maskName = (name: string): string => {
  if (!name) return '';
  const trimmed = name.trim();
  if (trimmed.length <= 1) return trimmed;
  if (trimmed.length === 2) return trimmed[0] + '*';
  return trimmed[0] + '*'.repeat(trimmed.length - 2) + trimmed[trimmed.length - 1];
};

const maskPhone = (phone: string): string => {
  if (!phone) return '';
  const clean = phone.trim();
  const parts = clean.split('-');
  if (parts.length === 3) {
    return `${parts[0]}-****-${parts[2]}`;
  }
  const regex = /^(\d{3})-?(\d{3,4})-?(\d{4})$/;
  const match = clean.match(regex);
  if (match) {
    return `${match[1]}-****-${match[3]}`;
  }
  if (clean.length > 7) {
    return clean.slice(0, 3) + '-****-' + clean.slice(clean.length - 4);
  }
  return '***-****';
};

interface ApplicationTabProps {
  currentUser: User | null;
  applications: CourseApplication[];
  onSubmitApplication: (newItem: Omit<CourseApplication, 'id' | 'appliedAt' | 'status'>) => void;
  homeContent: HomeContent;
  onUpdateHomeContent?: (updated: HomeContent) => void;
}

export const ApplicationTab: React.FC<ApplicationTabProps> = ({
  currentUser,
  applications,
  onSubmitApplication,
  homeContent,
  onUpdateHomeContent,
}) => {
  const [orgName, setOrgName] = useState(currentUser?.affiliation || '');
  const [applicantName, setApplicantName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  // Page Editing States (Admin Mode)
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [editFields, setEditFields] = useState<HomeContent>({ ...homeContent });

  const handleStartEdit = () => {
    setEditFields({ ...homeContent });
    setIsEditingPage(true);
  };

  const handleSavePageConfig = () => {
    if (onUpdateHomeContent) {
      onUpdateHomeContent(editFields);
      alert('교육상담 및 출강 신청 페이지 구성 정보가 성공적으로 업데이트되었습니다.');
    }
    setIsEditingPage(false);
  };

  const [email, setEmail] = useState(currentUser?.email || '');
  const [desiredDate, setDesiredDate] = useState('2026-09-01');
  const [targetStudents, setTargetStudents] = useState('초등 5학년');
  const [studentCount, setStudentCount] = useState<number>(20);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [orgType, setOrgType] = useState<'yeoncheon_public' | 'yeoncheon_private' | 'external'>('yeoncheon_public');

  // Individual application lookup states
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchPassword, setSearchPassword] = useState('');
  const [searchedApplications, setSearchedApplications] = useState<CourseApplication[] | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Success indicator state
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filter and display logic (Admin view only)
  const [viewFilter, setViewFilter] = useState<'mine' | 'all'>(currentUser ? 'mine' : 'all');

  const displayApplications = viewFilter === 'mine' && currentUser
    ? applications.filter(app => app.email === currentUser.email)
    : applications;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !applicantName || !phone || !email || !message || !password) {
      alert('비밀번호를 포함한 모든 필수 입력 필드를 기재해주세요.');
      return;
    }

    onSubmitApplication({
      organizationName: orgName,
      applicantName,
      phone,
      email,
      desiredDate,
      targetStudents,
      studentCount,
      message,
      password,
    });

    setSubmitSuccess(true);
    setMessage('');
    setPassword('');
    
    // Clear success banner after 5 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 5000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return { text: '출강 배정완료', style: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'rejected':
        return { text: '출강 불가', style: 'bg-red-100 text-red-800 border-red-200' };
      default:
        return { text: '신청 검토중', style: 'bg-amber-100 text-amber-800 border-amber-200' };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5.5 h-5.5 text-brand" />
            {homeContent.appTabTitle || "찾아가는 AI 코딩 교육상담 & 출강 신청"}
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {homeContent.appTabDesc || "연천 관내 초중고등학교, 자치회, 공공기관의 연령별 AI 리터러시 출강 교육 신청을 직접 수렴하고 있습니다."}
          </p>
        </div>
        
        {currentUser?.role === 'admin' && (
          <button
            onClick={handleStartEdit}
            className="self-start sm:self-center px-4 py-2 bg-brand/10 hover:bg-brand/15 text-brand border border-brand/20 hover:border-brand/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Settings className="w-4 h-4 animate-spin-slow" />
            ⚙️ 페이지 구성 편집 (Admin)
          </button>
        )}
      </div>

      {/* Admin Mode Editing Modal */}
      {isEditingPage && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-slate-100 animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand" />
                <h3 className="font-extrabold text-slate-900 text-sm">교육상담 & 출강 신청 페이지 텍스트 편집</h3>
              </div>
              <button
                onClick={() => setIsEditingPage(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">상단 대문 제목</label>
                <input
                  type="text"
                  value={editFields.appTabTitle || ''}
                  onChange={(e) => setEditFields({ ...editFields, appTabTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                  placeholder="찾아가는 AI 코딩 교육상담 & 출강 신청"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">상단 설명문구</label>
                <textarea
                  value={editFields.appTabDesc || ''}
                  onChange={(e) => setEditFields({ ...editFields, appTabDesc: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                  placeholder="설명문구를 입력하세요"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">신청 양식 타이틀</label>
                  <input
                    type="text"
                    value={editFields.appFormHeader || ''}
                    onChange={(e) => setEditFields({ ...editFields, appFormHeader: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                    placeholder="교육 파견 및 무료 설계 상담서 양식"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">신청 성공 안내 제목</label>
                  <input
                    type="text"
                    value={editFields.appSuccessTitle || ''}
                    onChange={(e) => setEditFields({ ...editFields, appSuccessTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                    placeholder="출강 교육 신청서가 성공적으로 접수되었습니다!"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">신청 성공 안내 내용</label>
                <input
                  type="text"
                  value={editFields.appSuccessDesc || ''}
                  onChange={(e) => setEditFields({ ...editFields, appSuccessDesc: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                  placeholder="하단의 '상담 신청 이력' 탭에서 실시간 상태를 확인하실 수 있습니다."
                />
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                <span className="block text-xs font-bold text-brand">🤝 강사단 파견 약속 구역 설정</span>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">구역 타이틀</label>
                  <input
                    type="text"
                    value={editFields.appPromiseHeader || ''}
                    onChange={(e) => setEditFields({ ...editFields, appPromiseHeader: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                    placeholder="연천 교육 전문가 1기 파견 약속"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">파견 약속 내용 ①</label>
                  <textarea
                    value={editFields.appPromiseDesc1 || ''}
                    onChange={(e) => setEditFields({ ...editFields, appPromiseDesc1: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                    placeholder="인증 정교재와 키트 보유 등의 설명..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">파견 약속 내용 ② (예산/행정 상담)</label>
                  <textarea
                    value={editFields.appPromiseDesc2 || ''}
                    onChange={(e) => setEditFields({ ...editFields, appPromiseDesc2: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                    placeholder="학교 예산 지원 설명..."
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                <span className="block text-xs font-bold text-cyan-600">❔ FAQ BRIEF 구역 설정</span>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">FAQ 구역 대헤더</label>
                  <input
                    type="text"
                    value={editFields.appFaqHeader || ''}
                    onChange={(e) => setEditFields({ ...editFields, appFaqHeader: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                    placeholder="FAQ BRIEF"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">FAQ Q1 질문</label>
                    <input
                      type="text"
                      value={editFields.appFaqQ1 || ''}
                      onChange={(e) => setEditFields({ ...editFields, appFaqQ1: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                      placeholder="Q. 노트북이나 교구재가 구비되어 있지 않아도 되나요?"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">FAQ A1 답변</label>
                    <textarea
                      value={editFields.appFaqA1 || ''}
                      onChange={(e) => setEditFields({ ...editFields, appFaqA1: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                      placeholder="A. 교구재 렌탈 협의가 가능합니다..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">FAQ Q2 질문</label>
                    <input
                      type="text"
                      value={editFields.appFaqQ2 || ''}
                      onChange={(e) => setEditFields({ ...editFields, appFaqQ2: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                      placeholder="Q. 교육 과정 기간은 어떻게 되나요?"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">FAQ A2 답변</label>
                    <textarea
                      value={editFields.appFaqA2 || ''}
                      onChange={(e) => setEditFields({ ...editFields, appFaqA2: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                      placeholder="A. 1일성 특강부터 장기 과정까지 가능합니다..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-2 bg-slate-50 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setIsEditingPage(false)}
                className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100 transition"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSavePageConfig}
                className="px-5 py-2 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
              >
                <Save className="w-4 h-4" />
                저장 및 적용하기
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Application Form */}
        <div className="lg:col-span-7 space-y-6">
          {submitSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 shadow-xs animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold">{homeContent.appSuccessTitle || "출강 교육 신청서가 성공적으로 접수되었습니다!"}</p>
                <p className="text-emerald-600 mt-0.5">{homeContent.appSuccessDesc || "하단의 '상담 신청 이력' 탭에서 관리자의 실시간 심사 상태를 확인하실 수 있습니다."}</p>
              </div>
            </div>
          )}

          <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand to-accent"></div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="text-sm font-bold text-slate-950 border-b border-slate-100 pb-2 flex items-center gap-1">
                <Send className="w-4 h-4 text-brand" />
                {homeContent.appFormHeader || "교육 파견 및 무료 설계 상담서 양식"}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">기관/학교 유형</label>
                  <select
                    value={orgType}
                    onChange={(e) => setOrgType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand"
                  >
                    <option value="yeoncheon_public">연천군 관내 공립 교육기관 (초중고/공공)</option>
                    <option value="yeoncheon_private">연천 관내 비영리/사립 기관 (아동센터 등)</option>
                    <option value="external">연천군 외 타 시도 기관/일반 기업</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">신청 기관명 (학교명)</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="예: 연천초등학교"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">신청인(교사/담당자) 성명</label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="예: 김미소 교사"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">신청자 이메일</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="예: misona@gamil.com"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">담당자 연락처 (전화)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="예: 010-1234-5678"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">출강 희망 일자</label>
                  <input
                    type="date"
                    value={desiredDate}
                    onChange={(e) => setDesiredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">대상 교육 연령 / 학생층</label>
                  <input
                    type="text"
                    value={targetStudents}
                    onChange={(e) => setTargetStudents(e.target.value)}
                    placeholder="예: 초등 6학년"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">수강생 예상 총인원 수</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={studentCount}
                    onChange={(e) => setStudentCount(Number(e.target.value))}
                    className="flex-1 accent-brand"
                  />
                  <span className="font-orbitron font-extrabold text-sm text-brand bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 w-16 text-center">
                    {studentCount}명
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">희망 강의 성격 및 주요 세부 요청 사항</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="예: 엔트리 인공지능 번역 및 챗봇 블록을 마스터하는 1일 3시간 창의 캠프형 특강 출강을 요청합니다. 교육용 기자재로 마이크로비트나 노트북 지원 여부도 궁금합니다."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  🔑 신청 확인 및 조회용 비밀번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="추후 본인 신청내역 조회를 위한 비밀번호를 입력해주세요 (예: 4자리 숫자)"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  ※ 작성하신 성함, 연락처, 그리고 이 비밀번호를 통해 비회원 상태에서도 안전하게 신청 결과를 조회하실 수 있습니다.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand hover:bg-brand-hover text-white text-sm font-extrabold rounded-xl shadow-lg hover:shadow-brand/20 transition duration-200 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                출강 교육 설계 상담 신청서 보내기
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Information & Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Yeoncheon Education Expert Commitment info panel */}
          <div className="glass-panel p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-brand" />
              {homeContent.appPromiseHeader || "연천 교육 전문가 1기 파견 약속"}
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {homeContent.appPromiseDesc1 || "본 과정 강사진은 연천군청 공식 인증 정교재와 최첨단 교육용 센서 키트(마이크로비트, 아두이노 등)를 직접 지참하여 출강하므로, 고도화된 양질의 실습형 교육이 학생들에게 안전하게 보장됩니다."}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100/70 pt-3">
              {homeContent.appPromiseDesc2 || "구체적인 교재 재료비 산정, 학교 보조금 연계 설계, 자유학기 코스웨어 편성 등 구체적인 교육 예정 사항은 제출해주신 온라인 상담 신청서를 기반으로 전담 매칭된 강사가 1:1 맞춤 상담 및 컨설팅을 즉각 지원해 드립니다."}
            </p>
          </div>

          {/* Quick FAQ info panel */}
          <div className="p-6 bg-slate-900 text-white rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold uppercase font-orbitron text-accent tracking-wider">
                {homeContent.appFaqHeader || "FAQ BRIEF"}
              </span>
            </div>
            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
              <div>
                <p className="font-bold text-white mb-0.5">
                  {homeContent.appFaqQ1 || "Q. 노트북이나 교구재가 구비되어 있지 않아도 되나요?"}
                </p>
                <p className="text-slate-400">
                  {homeContent.appFaqA1 || "A. 출강 신청 시 교구재 렌탈 협의가 가능합니다. 마이크로비트나 메이커용 키트는 강사진이 지원용 유닛을 보유하고 있습니다."}
                </p>
              </div>
              <div>
                <p className="font-bold text-white mb-0.5">
                  {homeContent.appFaqQ2 || "Q. 교육 과정 기간은 어떻게 되나요?"}
                </p>
                <p className="text-slate-400">
                  {homeContent.appFaqA2 || "A. 1일성 특강(2~4시간)부터 자유학기제 장기 연계형 정규 과정(8~12주)까지 협의 하에 전방위 커스텀 지원합니다."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secure Application Lookup & Admin Only Status Log */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-xs mt-4">
        {currentUser?.role === 'admin' ? (
          // ADMIN-ONLY REAL-TIME VIEW
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand" />
                <h4 className="text-sm font-bold text-slate-900">
                  🛡️ [관리자 모드] 연천 관내 실시간 상담 신청 전체 현황
                </h4>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
                <button
                  onClick={() => setViewFilter('mine')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    viewFilter === 'mine'
                      ? 'bg-white text-brand shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  내 신청 내역 ({applications.filter(app => app.email === currentUser.email).length})
                </button>
                <button
                  onClick={() => setViewFilter('all')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    viewFilter === 'all'
                      ? 'bg-white text-brand shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  전체 실시간 현황 ({applications.length})
                </button>
              </div>
            </div>

            {displayApplications.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-400">신청 기록이 존재하지 않습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayApplications.map((app) => {
                  const status = getStatusBadge(app.status);
                  return (
                    <div key={app.id} className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-150 relative overflow-hidden flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-xs font-extrabold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-250">
                            {app.organizationName}
                          </span>
                          {currentUser && app.email === currentUser.email && (
                            <span className="text-[10px] font-bold text-brand bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
                              내 신청서
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">
                            신청일: {app.appliedAt}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${status.style}`}>
                            {status.text}
                          </span>
                          {app.password && (
                            <span className="text-[10px] bg-slate-200 text-slate-600 font-mono px-1.5 py-0.5 rounded">
                              PW: {app.password}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-600 space-y-1">
                          <p>• <span className="font-semibold text-slate-800">희망 일자:</span> {app.desiredDate} / <span className="font-semibold text-slate-800">교육 대상:</span> {app.targetStudents} ({app.studentCount}명)</p>
                          <p className="italic bg-white p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-500 mt-2">
                            "{app.message}"
                          </p>
                        </div>

                        {app.adminComment && (
                          <div className="mt-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs">
                            <span className="font-bold text-emerald-800 block mb-0.5">🛡️ 행정 위원회 답변:</span>
                            <p className="text-slate-700 leading-relaxed">{app.adminComment}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-start md:items-end justify-between text-right gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">CONTACT</span>
                          <span className="text-xs font-semibold text-slate-800">
                            {app.applicantName} ({app.phone})
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">{app.email}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          // APPLICANT INDIVIDUAL SECURE SEARCH PORTAL (For General users, Instructors, and Guests)
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <History className="w-5 h-5 text-brand" />
              <h4 className="text-sm font-bold text-slate-900">
                내 상담 신청 및 출강 심사 내역 개별 조회
              </h4>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed bg-blue-50/50 p-3.5 rounded-xl border border-blue-100/50">
              🔒 개인정보 보호 지침에 의하여 <strong>실시간 전체 신청 현황은 관리자에게만 제공</strong>됩니다. 
              신청인께서는 접수 시 입력한 <strong>성명, 연락처, 비밀번호</strong>를 입력하여 본인의 소중한 신청 이력 및 배정 결과를 개별적으로 즉시 조회하실 수 있습니다.
            </p>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!searchName.trim() || !searchPhone.trim() || !searchPassword.trim()) {
                  alert('성명, 연락처, 비밀번호를 모두 기입해 주세요.');
                  return;
                }
                const matched = applications.filter((app) => {
                  const isNameMatch = app.applicantName.trim().replace(/\s+/g, '') === searchName.trim().replace(/\s+/g, '');
                  const cleanAppPhone = app.phone.replace(/[^0-9]/g, '');
                  const cleanSearchPhone = searchPhone.replace(/[^0-9]/g, '');
                  const isPhoneMatch = cleanAppPhone === cleanSearchPhone;
                  const isPasswordMatch = app.password?.trim() === searchPassword.trim();
                  return isNameMatch && isPhoneMatch && isPasswordMatch;
                });
                setSearchedApplications(matched);
                setSearchAttempted(true);
              }}
              className="p-5 bg-slate-50 rounded-2xl border border-slate-150 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">신청인 성명</label>
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="예: 홍길동 선생님"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">담당자 연락처 (전화)</label>
                <input
                  type="tel"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="예: 010-4444-4444"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">설정한 비밀번호</label>
                <input
                  type="password"
                  value={searchPassword}
                  onChange={(e) => setSearchPassword(e.target.value)}
                  placeholder="신청 시 지정한 비밀번호"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                내 신청 내역 조회
              </button>
            </form>

            {/* SEARCH RESULTS VIEW */}
            {searchAttempted && (
              <div className="mt-6 border-t border-slate-100 pt-6 space-y-4">
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  🔍 검색 결과: 총 {searchedApplications?.length || 0}건의 신청 내역 발견
                </h5>

                {!searchedApplications || searchedApplications.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-250 rounded-2xl">
                    <p className="text-xs text-slate-500 font-bold">일치하는 신청 내역이 존재하지 않습니다.</p>
                    <p className="text-[11px] text-slate-400 mt-1">입력하신 신청인 성명, 연락처, 비밀번호가 올바른지 다시 한번 확인해주시기 바랍니다.</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-mono">※ 테스트 가이드: 초기 홍길동 선생님 데이터는 연락처 [010-4444-4444], 비밀번호 [1234]로 조회 가능합니다.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchedApplications.map((app) => {
                      const status = getStatusBadge(app.status);
                      return (
                        <div key={app.id} className="p-5 bg-blue-50/30 border border-blue-100 rounded-2xl relative overflow-hidden flex flex-col md:flex-row justify-between gap-4">
                          <div className="absolute top-0 left-0 w-1 h-full bg-brand"></div>
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-extrabold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                                {app.organizationName}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                신청일: {app.appliedAt}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${status.style}`}>
                                {status.text}
                              </span>
                            </div>

                            <div className="text-xs text-slate-600 space-y-1">
                              <p>• <span className="font-semibold text-slate-800">희망 일자:</span> {app.desiredDate} / <span className="font-semibold text-slate-800">교육 대상:</span> {app.targetStudents} ({app.studentCount}명)</p>
                              <p className="italic bg-white p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-500 mt-1">
                                "{app.message}"
                              </p>
                            </div>

                            {app.adminComment && (
                              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs">
                                <span className="font-bold text-emerald-800 block mb-0.5">🛡️ 행정 위원회 답변 및 강사 매칭:</span>
                                <p className="text-slate-700 leading-relaxed">{app.adminComment}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-start md:items-end justify-between text-right gap-2">
                            <div>
                              <span className="text-[10px] text-slate-400 block font-bold">CONTACT</span>
                              <span className="text-xs font-semibold text-slate-800">
                                {app.applicantName} ({app.phone})
                              </span>
                              <span className="text-[10px] text-slate-400 block font-mono">{app.email}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
