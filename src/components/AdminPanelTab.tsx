import React, { useState } from 'react';
import { User, CourseApplication, SharedResource, NoticeItem, FootprintItem, InstructorActivity, HomeContent, PastEducationRecord } from '../types';
import { Settings, Users, ClipboardList, Database, Check, X, ShieldAlert, Award, AlertCircle, FileText, Trash2, CheckCircle, RefreshCw, Layout, Sparkles, Search, PlusCircle, Printer, Download, Calendar, MessageSquare, Edit } from 'lucide-react';

interface AdminPanelTabProps {
  currentUser: User | null;
  usersList: User[];
  applications: CourseApplication[];
  resources: SharedResource[];
  notices: NoticeItem[];
  footprints: FootprintItem[];
  activities: InstructorActivity[];
  homeContent: HomeContent;
  pastRecords: PastEducationRecord[];
  onUpdateHomeContent: (content: HomeContent) => void;
  onApproveInstructor: (userId: string) => void;
  onRejectInstructor: (userId: string) => void;
  onAuditApplication: (appId: string, status: 'approved' | 'rejected', comment: string) => void;
  onUpdateApplication?: (updatedApp: CourseApplication) => void;
  onResetAllData: () => void;
  onAddPastRecord: (newItem: Omit<PastEducationRecord, 'id'>) => void;
  onDeletePastRecord: (id: string) => void;
}

export const AdminPanelTab: React.FC<AdminPanelTabProps> = ({
  currentUser,
  usersList,
  applications,
  resources,
  notices,
  footprints,
  activities,
  homeContent,
  pastRecords = [],
  onUpdateHomeContent,
  onApproveInstructor,
  onRejectInstructor,
  onAuditApplication,
  onUpdateApplication,
  onResetAllData,
  onAddPastRecord,
  onDeletePastRecord,
}) => {
  const [subTab, setSubTab] = useState<'users' | 'applications' | 'database' | 'homepage' | 'apptab'>('users');
  const [editHomeForm, setEditHomeForm] = useState<HomeContent>({ ...homeContent });
  const [auditComments, setAuditComments] = useState<{ [key: string]: string }>({});

  // Past records search state
  const [pastSearchSchool, setPastSearchSchool] = useState('');
  const [pastSearchInstructor, setPastSearchInstructor] = useState('');

  // Past record creation state
  const [newOrgName, setNewOrgName] = useState('');
  const [newInstructorName, setNewInstructorName] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCompletionDate, setNewCompletionDate] = useState('');
  const [newStudentCount, setNewStudentCount] = useState<number>(20);
  const [newHours, setNewHours] = useState<number>(8);
  const [newContentSummary, setNewContentSummary] = useState('');

  // Certificate Issuance Modal State
  const [selectedInstructorForCert, setSelectedInstructorForCert] = useState<string | null>(null);
  const [certSerialNumber, setCertSerialNumber] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);

  // Interactive statistics viewer states
  const [activeStatTab, setActiveStatTab] = useState<'users' | 'footprints' | 'activities' | 'resources' | 'notices' | 'applications' | 'pastRecords' | null>(null);
  const [statSearchQuery, setStatSearchQuery] = useState('');

  // Application Edit state
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [editFocusMode, setEditFocusMode] = useState<'original' | 'admin'>('original');
  const [editAppOrgName, setEditAppOrgName] = useState('');
  const [editAppApplicantName, setEditAppApplicantName] = useState('');
  const [editAppPhone, setEditAppPhone] = useState('');
  const [editAppEmail, setEditAppEmail] = useState('');
  const [editAppDesiredDate, setEditAppDesiredDate] = useState('');
  const [editAppTargetStudents, setEditAppTargetStudents] = useState('');
  const [editAppStudentCount, setEditAppStudentCount] = useState<number>(0);
  const [editAppMessage, setEditAppMessage] = useState('');
  const [editAppPassword, setEditAppPassword] = useState('');
  const [editAppAdminComment, setEditAppAdminComment] = useState('');
  const [editAppCustomCurriculum, setEditAppCustomCurriculum] = useState('');
  const [editAppBudget, setEditAppBudget] = useState('');
  const [editAppAssignedInstructor, setEditAppAssignedInstructor] = useState('');
  const [editAppInternalNote, setEditAppInternalNote] = useState('');

  const startEditingApp = (app: CourseApplication, focusMode: 'original' | 'admin' = 'original') => {
    setEditingAppId(app.id);
    setEditFocusMode(focusMode);
    setEditAppOrgName(app.organizationName);
    setEditAppApplicantName(app.applicantName);
    setEditAppPhone(app.phone);
    setEditAppEmail(app.email);
    setEditAppDesiredDate(app.desiredDate);
    setEditAppTargetStudents(app.targetStudents);
    setEditAppStudentCount(app.studentCount);
    setEditAppMessage(app.message);
    setEditAppPassword(app.password || '');
    setEditAppAdminComment(app.adminComment || '');
    setEditAppCustomCurriculum(app.additionalData?.customCurriculum || '');
    setEditAppBudget(app.additionalData?.budget || '');
    setEditAppAssignedInstructor(app.additionalData?.assignedInstructor || '');
    setEditAppInternalNote(app.additionalData?.internalNote || '');
  };

  const saveEditingApp = (appId: string) => {
    if (!onUpdateApplication) return;
    
    const originalApp = applications.find(a => a.id === appId);
    if (!originalApp) return;

    const updatedApp: CourseApplication = {
      ...originalApp,
      organizationName: editAppOrgName,
      applicantName: editAppApplicantName,
      phone: editAppPhone,
      email: editAppEmail,
      desiredDate: editAppDesiredDate,
      targetStudents: editAppTargetStudents,
      studentCount: editAppStudentCount,
      message: editAppMessage,
      password: editAppPassword,
      adminComment: editAppAdminComment,
      additionalData: {
        customCurriculum: editAppCustomCurriculum,
        budget: editAppBudget,
        assignedInstructor: editAppAssignedInstructor,
        internalNote: editAppInternalNote
      }
    };

    onUpdateApplication(updatedApp);
    setEditingAppId(null);
    alert('교육 상담 신청안 정보 및 추가 행정 정보가 실시간 수정되었습니다.');
  };

  // Keep state in sync if props change
  React.useEffect(() => {
    setEditHomeForm({ ...homeContent });
  }, [homeContent]);

  const handleSaveHome = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateHomeContent(editHomeForm);
    alert('홈페이지 메인화면 홍보 정보가 정상 수정되었습니다.');
  };

  const handleSaveAppTab = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateHomeContent(editHomeForm);
    alert('교육상담 및 출강 신청 페이지 구성 정보가 성공적으로 저장 및 반영되었습니다.');
  };

  const handleAuditSubmit = (appId: string, status: 'approved' | 'rejected') => {
    const comment = auditComments[appId] || '';
    if (status === 'approved' && !comment) {
      alert('출강 배정 정보 또는 협의 비고사항 코멘트를 작성해 주세요.');
      return;
    }
    onAuditApplication(appId, status, comment);
    alert(`[행정 처리가 완료되었습니다]\n상태: ${status === 'approved' ? '출강 승인 및 강사 매칭' : '출강 반려'}\n코멘트: ${comment || '없음'}`);
  };

  const pendingInstructors = usersList.filter(u => u.role === 'instructor_pending');
  const approvedInstructors = usersList.filter(u => u.role === 'instructor');
  const generalUsers = usersList.filter(u => u.role === 'general');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-slate-100 pb-5">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5.5 h-5.5 text-red-600 animate-spin-slow" />
          관리자 대시보드
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          수료생 검증 승인, 출강 상담 신청안 심의, 홈페이지 데이터 포털 현황 모니터링을 관장하는 최고 관리 센터입니다.
        </p>
      </div>

      {/* Sub-tab selections */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setSubTab('users')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            subTab === 'users'
              ? 'border-brand text-brand font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          회원 가입 및 권한 승인 ({pendingInstructors.length} 대기)
        </button>
        <button
          onClick={() => setSubTab('applications')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            subTab === 'applications'
              ? 'border-brand text-brand font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          교육출강 상담 심사 ({applications.filter(a => a.status === 'pending').length} 대기)
        </button>
        <button
          onClick={() => setSubTab('database')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            subTab === 'database'
              ? 'border-brand text-brand font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          시스템 데이터 통계 & 통합 리셋
        </button>
        <button
          onClick={() => setSubTab('homepage')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            subTab === 'homepage'
              ? 'border-brand text-brand font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layout className="w-4 h-4" />
          메인화면 문구 통합수정
        </button>
        <button
          onClick={() => setSubTab('apptab')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            subTab === 'apptab'
              ? 'border-brand text-brand font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          교육상담 페이지 편집
        </button>
      </div>

      {/* SECTION 1: USER MANAGEMENT */}
      {subTab === 'users' && (
        <div className="space-y-6">
          {/* Pending Instructors list */}
          <div className="glass-panel p-5 sm:p-6 rounded-2xl shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              1기 수료 명단 대조 및 정강사 등급 승인 심사 ({pendingInstructors.length}건 대기)
            </h4>

            {pendingInstructors.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs leading-relaxed">
                현재 신규 가입한 대기 승인 강사 회원이 없습니다.<br/>
                테스트를 원하시면 일반 로그인 후 '강사실/자료실' 탭의 가상 승인 트리거를 누르거나, 'pending@yeoncheon.ai'로 가입 신청을 접수하세요.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-2">
                {pendingInstructors.map((user) => (
                  <div key={user.id} className="py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-950 text-sm">{user.name} 예비강사</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                          수료대조 요망
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">가입 이메일: {user.email} / 연락처: {user.phone || '미등록'}</p>
                      <p className="text-xs text-slate-600 font-semibold">• 소속: {user.affiliation || '개인'} / • 전문분야: {user.specialty || '인공지능 교육 기초'}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onApproveInstructor(user.id);
                          alert(`[정강사 임명 및 권한 승인 완료]\n${user.name} 강사님이 정식 회원 등급으로 격상되었습니다. 강사자료실 입장이 즉각 수용됩니다.`);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        정강사 자격 승인
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`${user.name} 회원을 보류 또는 거절 처리하시겠습니까?`)) {
                            onRejectInstructor(user.id);
                          }
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 rounded-lg text-xs transition"
                      >
                        <X className="w-3.5 h-3.5" />
                        승인 보류
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved Instructors & General members list summary */}
          <div className="glass-panel p-5 sm:p-6 rounded-2xl shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-500" />
              인증이 완료된 연천 정강사 데이터베이스 ({approvedInstructors.length}명 수록)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {approvedInstructors.map(user => (
                <div key={user.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900">{user.name} 정강사</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">인증 정회원</span>
                  </div>
                  <p className="font-mono text-slate-400">ID: {user.email}</p>
                  <p className="text-slate-600 font-semibold">소속: {user.affiliation} | 분야: {user.specialty}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: APPLICATION AUDIT */}
      {subTab === 'applications' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 sm:p-6 rounded-2xl shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-brand" />
              교육출강 매칭 및 행정 비고 심의 ({applications.filter(a => a.status === 'pending').length}건 대기)
            </h4>

            {applications.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                현재 접수 완료된 외부 교육 파견 신청서가 없습니다.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <div key={app.id} className="py-6">
                    {editingAppId === app.id ? (
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                          <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                            <Edit className="w-4 h-4 text-brand animate-pulse" />
                            {editFocusMode === 'original' ? '신청서 원본 상세 항목 편집' : '행정 관리 추가 데이터 & 교육설계 편집'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {app.id}</span>
                        </div>

                        {/* Focus switcher within editing mode */}
                        <div className="flex gap-2.5 bg-slate-200 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => setEditFocusMode('original')}
                            className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition duration-200 cursor-pointer ${
                              editFocusMode === 'original' 
                                ? 'bg-white text-slate-900 shadow-sm' 
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            신청서 원본 내용 편집
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditFocusMode('admin')}
                            className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition duration-200 flex items-center justify-center gap-1 cursor-pointer ${
                              editFocusMode === 'admin' 
                                ? 'bg-brand text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            추가 행정 데이터 & 설계안 편집
                          </button>
                        </div>

                        {/* Section 1: Original Request Fields */}
                        <div className={`p-4 rounded-xl border transition-all duration-200 ${
                          editFocusMode === 'original' 
                            ? 'bg-white border-slate-350 shadow-xs ring-2 ring-slate-800/10' 
                            : 'bg-slate-50/50 border-slate-200 opacity-60'
                        }`}>
                          <span className="block text-xs font-extrabold text-slate-800 mb-3 pb-1 border-b border-slate-150">
                            교사 신청서 원본 상세 항목
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-600 font-bold mb-1">기관/학교명</label>
                              <input
                                type="text"
                                value={editAppOrgName}
                                onChange={(e) => setEditAppOrgName(e.target.value)}
                                disabled={editFocusMode !== 'original'}
                                className="w-full px-3 py-1.5 border border-slate-250 bg-white rounded-lg focus:outline-none focus:border-brand disabled:bg-slate-100 disabled:text-slate-500"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-600 font-bold mb-1">신청인(교사) 성명</label>
                              <input
                                type="text"
                                value={editAppApplicantName}
                                onChange={(e) => setEditAppApplicantName(e.target.value)}
                                disabled={editFocusMode !== 'original'}
                                className="w-full px-3 py-1.5 border border-slate-250 bg-white rounded-lg focus:outline-none focus:border-brand disabled:bg-slate-100 disabled:text-slate-500"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-600 font-bold mb-1">연락처</label>
                              <input
                                type="text"
                                value={editAppPhone}
                                onChange={(e) => setEditAppPhone(e.target.value)}
                                disabled={editFocusMode !== 'original'}
                                className="w-full px-3 py-1.5 border border-slate-250 bg-white rounded-lg focus:outline-none focus:border-brand text-xs font-mono disabled:bg-slate-100 disabled:text-slate-500"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-600 font-bold mb-1">이메일</label>
                              <input
                                type="text"
                                value={editAppEmail}
                                onChange={(e) => setEditAppEmail(e.target.value)}
                                disabled={editFocusMode !== 'original'}
                                className="w-full px-3 py-1.5 border border-slate-250 bg-white rounded-lg focus:outline-none focus:border-brand text-xs font-mono disabled:bg-slate-100 disabled:text-slate-500"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-600 font-bold mb-1">희망일자</label>
                              <input
                                type="text"
                                value={editAppDesiredDate}
                                onChange={(e) => setEditAppDesiredDate(e.target.value)}
                                disabled={editFocusMode !== 'original'}
                                className="w-full px-3 py-1.5 border border-slate-250 bg-white rounded-lg focus:outline-none focus:border-brand text-xs disabled:bg-slate-100 disabled:text-slate-500"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-600 font-bold mb-1">대상 연령 (예: 초등, 중등, 교사 등)</label>
                              <input
                                type="text"
                                value={editAppTargetStudents}
                                onChange={(e) => setEditAppTargetStudents(e.target.value)}
                                disabled={editFocusMode !== 'original'}
                                className="w-full px-3 py-1.5 border border-slate-250 bg-white rounded-lg focus:outline-none focus:border-brand text-xs disabled:bg-slate-100 disabled:text-slate-500"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-600 font-bold mb-1">수량/학생수 (명)</label>
                              <input
                                type="number"
                                value={editAppStudentCount}
                                onChange={(e) => setEditAppStudentCount(Number(e.target.value))}
                                disabled={editFocusMode !== 'original'}
                                className="w-full px-3 py-1.5 border border-slate-250 bg-white rounded-lg focus:outline-none focus:border-brand text-xs font-mono disabled:bg-slate-100 disabled:text-slate-500"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-600 font-bold mb-1">조회용 비밀번호</label>
                              <input
                                type="text"
                                value={editAppPassword}
                                onChange={(e) => setEditAppPassword(e.target.value)}
                                disabled={editFocusMode !== 'original'}
                                className="w-full px-3 py-1.5 border border-slate-250 bg-white rounded-lg focus:outline-none focus:border-brand text-xs font-mono disabled:bg-slate-100 disabled:text-slate-500"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block text-slate-600 font-bold mb-1">신청 상세 요청사항</label>
                            <textarea
                              value={editAppMessage}
                              onChange={(e) => setEditAppMessage(e.target.value)}
                              disabled={editFocusMode !== 'original'}
                              rows={2}
                              className="w-full px-3 py-1.5 border border-slate-250 bg-white rounded-lg focus:outline-none focus:border-brand text-xs disabled:bg-slate-100 disabled:text-slate-500"
                            />
                          </div>
                        </div>

                        {/* Section 2: Administrative Data (Only active / highlighted when in admin focus mode) */}
                        <div className={`p-4 rounded-xl border transition-all duration-200 ${
                          editFocusMode === 'admin' 
                            ? 'bg-blue-50/20 border-brand/40 shadow-xs ring-4 ring-brand/10' 
                            : 'bg-slate-50/50 border-slate-200 opacity-60'
                        }`}>
                          <span className="block text-xs font-extrabold text-brand flex items-center gap-1 mb-3 pb-1 border-b border-brand/10">
                            <Sparkles className="w-3.5 h-3.5 text-brand" />
                            최고 관리자 전용 추가 행정 데이터 및 맞춤형 교육설계
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">· 맞춤형 교육과정/교구 설계</label>
                              <input
                                type="text"
                                value={editAppCustomCurriculum}
                                onChange={(e) => setEditAppCustomCurriculum(e.target.value)}
                                disabled={editFocusMode !== 'admin'}
                                placeholder="예: 마이크로비트 센서 무선 무인 통신 6차시 맞춤 설계"
                                className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-[11px] focus:outline-none focus:border-brand disabled:bg-slate-100 disabled:text-slate-400"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">· 확정 예산 또는 교구재 재료비</label>
                              <input
                                type="text"
                                value={editAppBudget}
                                onChange={(e) => setEditAppBudget(e.target.value)}
                                disabled={editFocusMode !== 'admin'}
                                placeholder="예: 교보재 무상 대여 지원 연계 (자유학기제 예산 지원)"
                                className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-[11px] focus:outline-none focus:border-brand disabled:bg-slate-100 disabled:text-slate-400"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">· 배정 강사 명단</label>
                              <input
                                type="text"
                                value={editAppAssignedInstructor}
                                onChange={(e) => setEditAppAssignedInstructor(e.target.value)}
                                disabled={editFocusMode !== 'admin'}
                                placeholder="예: 주강사 최현지(피지컬), 보조강사 이태영 배정완료"
                                className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-[11px] focus:outline-none focus:border-brand disabled:bg-slate-100 disabled:text-slate-400"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">· 내부 행정 조율 특이사항</label>
                              <input
                                type="text"
                                value={editAppInternalNote}
                                onChange={(e) => setEditAppInternalNote(e.target.value)}
                                disabled={editFocusMode !== 'admin'}
                                placeholder="예: 학부모 참관 수업 병행 예정. 사전 센서 셋업 테스트 완료함."
                                className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-[11px] focus:outline-none focus:border-brand disabled:bg-slate-100 disabled:text-slate-400"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-600 font-bold mb-1">강사 매칭 정보 및 기획안 회신용 행정 비고 코멘트 (심사결과용)</label>
                          <input
                            type="text"
                            value={editAppAdminComment}
                            onChange={(e) => setEditAppAdminComment(e.target.value)}
                            placeholder="예: 정강사 배정 및 무료 교육 기획안 매칭 완료."
                            className="w-full px-3.5 py-2 border border-slate-250 bg-white rounded-xl text-xs focus:outline-none focus:border-brand"
                          />
                        </div>

                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => saveEditingApp(app.id)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-brand hover:bg-brand/90 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            변경사항 저장 및 동기화
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingAppId(null)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            편집 취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {/* Header info */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                          <div>
                            <span className="text-xs font-extrabold text-slate-900 bg-white px-2 py-1 rounded border mr-2 shadow-2xs">
                              {app.organizationName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">접수시간: {app.appliedAt}</span>
                          </div>
                          <div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              app.status === 'approved' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : app.status === 'rejected'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                            }`}>
                              상태: {app.status === 'approved' ? '승인 및 배정완료' : app.status === 'rejected' ? '반려' : '대기 검토중'}
                            </span>
                          </div>
                        </div>

                        {/* Body content */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-slate-500 font-semibold">신청자 성명: <span className="text-slate-800">{app.applicantName}</span></p>
                            <p className="text-slate-500 font-semibold font-mono">이메일/연락처: <span className="text-slate-800">{app.email} / {app.phone}</span></p>
                            {app.password && (
                              <p className="text-slate-500 font-semibold font-mono">조회용 비밀번호: <span className="text-brand font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{app.password}</span></p>
                            )}
                          </div>
                          <div>
                            <p className="text-slate-500 font-semibold">희망일자: <span className="text-slate-800">{app.desiredDate}</span></p>
                            <p className="text-slate-500 font-semibold">대상학생 / 수량: <span className="text-slate-800">{app.targetStudents} / {app.studentCount}명</span></p>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 text-xs">
                          <span className="font-bold text-slate-500 block mb-1">신청 상세 요청사항:</span>
                          <p className="text-slate-700 leading-relaxed italic">"{app.message}"</p>
                        </div>

                        {/* Display Additional Data if exists */}
                        {app.additionalData && (app.additionalData.customCurriculum || app.additionalData.budget || app.additionalData.assignedInstructor || app.additionalData.internalNote) && (
                          <div className="p-4 bg-brand/[0.03] border border-brand/10 rounded-xl text-xs space-y-2">
                            <span className="font-extrabold text-brand flex items-center gap-1 text-[11px] border-b border-brand/10 pb-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              최고 관리자 기획안 설계 및 추가 행정 데이터
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                              {app.additionalData.customCurriculum && (
                                <p><strong className="text-slate-800">· 교육과정설계:</strong> {app.additionalData.customCurriculum}</p>
                              )}
                              {app.additionalData.budget && (
                                <p><strong className="text-slate-800">· 예산/재료비:</strong> {app.additionalData.budget}</p>
                              )}
                              {app.additionalData.assignedInstructor && (
                                <p><strong className="text-slate-800">· 배정 강사:</strong> {app.additionalData.assignedInstructor}</p>
                              )}
                              {app.additionalData.internalNote && (
                                <p className="sm:col-span-2 font-mono text-[11px] bg-slate-100/55 p-1.5 rounded border border-slate-200 mt-1">
                                  <strong className="text-slate-800">· 행정 특이사항:</strong> {app.additionalData.internalNote}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action form for audit comment */}
                        <div className="space-y-2 border-t border-slate-100 pt-4">
                          <label className="block text-xs font-bold text-slate-800">강사 매칭 정보 및 기획안 회신용 행정 비고 코멘트 작성 (필수)</label>
                          <input
                            type="text"
                            value={auditComments[app.id] || app.adminComment || ''}
                            onChange={(e) => setAuditComments({ ...auditComments, [app.id]: e.target.value })}
                            placeholder="예: 김은혜 강사(블록코딩 전문) 매칭 배정 완료. 피지컬 교구 25단위 지원 가능 협의 완료."
                            className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                          />
                          
                          <div className="flex flex-wrap gap-2 justify-end pt-1">
                            <button
                              onClick={() => startEditingApp(app, 'original')}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-150 text-slate-700 font-bold text-xs border border-slate-300 rounded-lg shadow-xs hover:shadow-sm transition duration-200 cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5 text-slate-500" />
                              신청서 원본 내용 편집
                            </button>
                            <button
                              onClick={() => startEditingApp(app, 'admin')}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-lg shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                              {app.additionalData && (app.additionalData.customCurriculum || app.additionalData.budget || app.additionalData.assignedInstructor || app.additionalData.internalNote)
                                ? "추가 행정 데이터 및 설계안 수정" 
                                : "추가 행정 데이터 및 설계안 입력"}
                            </button>
                            <button
                              onClick={() => handleAuditSubmit(app.id, 'approved')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              교육 승인 및 강사배정
                            </button>
                            <button
                              onClick={() => handleAuditSubmit(app.id, 'rejected')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 rounded-lg text-xs transition cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              출강 반려 처리
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: DATABASE STATISTICS & RESET */}
      {subTab === 'database' && (
        <div className="space-y-8 animate-fade-in">
          {/* Statistics Grid - Click to view detail */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                ⚡ 각 통계 카드를 클릭하면 실시간 레코드 목록을 즉시 탐색할 수 있습니다.
              </span>
              {activeStatTab && (
                <button
                  onClick={() => {
                    setActiveStatTab(null);
                    setStatSearchQuery('');
                  }}
                  className="text-[10px] text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
                >
                  상세 뷰어 전체 닫기
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
              {/* Box 1: Users */}
              <button
                onClick={() => {
                  setActiveStatTab(activeStatTab === 'users' ? null : 'users');
                  setStatSearchQuery('');
                }}
                className={`p-4 border rounded-2xl text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-md cursor-pointer flex flex-col justify-between items-center ${
                  activeStatTab === 'users'
                    ? 'bg-blue-50/60 border-brand ring-4 ring-blue-100/50 shadow-sm'
                    : 'bg-white border-slate-150 hover:bg-slate-50'
                }`}
                title="총 회원 가입 현황 목록 열기"
              >
                <span className="text-[10px] text-slate-400 font-bold block mb-1">총 회원 수</span>
                <span className="font-orbitron font-extrabold text-xl text-brand">{usersList.length}명</span>
                <span className="text-[9px] text-slate-400 font-bold mt-1.5 underline">현황 보기</span>
              </button>

              {/* Box 2: Footprints */}
              <button
                onClick={() => {
                  setActiveStatTab(activeStatTab === 'footprints' ? null : 'footprints');
                  setStatSearchQuery('');
                }}
                className={`p-4 border rounded-2xl text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-md cursor-pointer flex flex-col justify-between items-center ${
                  activeStatTab === 'footprints'
                    ? 'bg-slate-100 border-slate-400 ring-4 ring-slate-200/50 shadow-sm'
                    : 'bg-white border-slate-150 hover:bg-slate-50'
                }`}
                title="발자취 연대기 실적 목록 열기"
              >
                <span className="text-[10px] text-slate-400 font-bold block mb-1">발자취 일정</span>
                <span className="font-orbitron font-extrabold text-xl text-slate-800">{footprints.length}개</span>
                <span className="text-[9px] text-slate-400 font-bold mt-1.5 underline">현황 보기</span>
              </button>

              {/* Box 3: Activities */}
              <button
                onClick={() => {
                  setActiveStatTab(activeStatTab === 'activities' ? null : 'activities');
                  setStatSearchQuery('');
                }}
                className={`p-4 border rounded-2xl text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-md cursor-pointer flex flex-col justify-between items-center ${
                  activeStatTab === 'activities'
                    ? 'bg-slate-100 border-slate-400 ring-4 ring-slate-200/50 shadow-sm'
                    : 'bg-white border-slate-150 hover:bg-slate-50'
                }`}
                title="강사 수업설계 갤러리 목록 열기"
              >
                <span className="text-[10px] text-slate-400 font-bold block mb-1">갤러리 카드</span>
                <span className="font-orbitron font-extrabold text-xl text-slate-800">{activities.length}개</span>
                <span className="text-[9px] text-slate-400 font-bold mt-1.5 underline">현황 보기</span>
              </button>

              {/* Box 4: Resources */}
              <button
                onClick={() => {
                  setActiveStatTab(activeStatTab === 'resources' ? null : 'resources');
                  setStatSearchQuery('');
                }}
                className={`p-4 border rounded-2xl text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-md cursor-pointer flex flex-col justify-between items-center ${
                  activeStatTab === 'resources'
                    ? 'bg-emerald-50/60 border-emerald-500 ring-4 ring-emerald-100/50 shadow-sm'
                    : 'bg-white border-slate-150 hover:bg-slate-50'
                }`}
                title="공유 교육자료실 목록 열기"
              >
                <span className="text-[10px] text-slate-400 font-bold block mb-1">교육자료실</span>
                <span className="font-orbitron font-extrabold text-xl text-emerald-600">{resources.length}개</span>
                <span className="text-[9px] text-emerald-500 font-bold mt-1.5 underline">현황 보기</span>
              </button>

              {/* Box 5: Notices */}
              <button
                onClick={() => {
                  setActiveStatTab(activeStatTab === 'notices' ? null : 'notices');
                  setStatSearchQuery('');
                }}
                className={`p-4 border rounded-2xl text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-md cursor-pointer flex flex-col justify-between items-center ${
                  activeStatTab === 'notices'
                    ? 'bg-indigo-50/60 border-indigo-500 ring-4 ring-indigo-100/50 shadow-sm'
                    : 'bg-white border-slate-150 hover:bg-slate-50'
                }`}
                title="공지 게시글 목록 열기"
              >
                <span className="text-[10px] text-slate-400 font-bold block mb-1">공지 게시글</span>
                <span className="font-orbitron font-extrabold text-xl text-indigo-600">{notices.length}개</span>
                <span className="text-[9px] text-indigo-500 font-bold mt-1.5 underline">현황 보기</span>
              </button>

              {/* Box 6: Applications */}
              <button
                onClick={() => {
                  setActiveStatTab(activeStatTab === 'applications' ? null : 'applications');
                  setStatSearchQuery('');
                }}
                className={`p-4 border rounded-2xl text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-md cursor-pointer flex flex-col justify-between items-center ${
                  activeStatTab === 'applications'
                    ? 'bg-amber-50/60 border-amber-500 ring-4 ring-amber-100/50 shadow-sm'
                    : 'bg-white border-slate-150 hover:bg-slate-50'
                }`}
                title="출강 심사 승인 대기 목록 열기"
              >
                <span className="text-[10px] text-slate-400 font-bold block mb-1">출강 심의 수</span>
                <span className="font-orbitron font-extrabold text-xl text-amber-600">{applications.length}건</span>
                <span className="text-[9px] text-amber-600 font-bold mt-1.5 underline">현황 보기</span>
              </button>

              {/* Box 7: Past Records */}
              <button
                onClick={() => {
                  setActiveStatTab(activeStatTab === 'pastRecords' ? null : 'pastRecords');
                  setStatSearchQuery('');
                }}
                className={`p-4 border rounded-2xl text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-md cursor-pointer flex flex-col justify-between items-center ${
                  activeStatTab === 'pastRecords'
                    ? 'bg-blue-50/60 border-brand ring-4 ring-blue-100/50 shadow-sm'
                    : 'bg-white border-slate-150 hover:bg-slate-50'
                }`}
                title="과거 완료된 이력 목록 열기"
              >
                <span className="text-[10px] text-slate-400 font-bold block mb-1">완료 교육 이력</span>
                <span className="font-orbitron font-extrabold text-xl text-brand">{pastRecords.length}건</span>
                <span className="text-[9px] text-brand font-bold mt-1.5 underline">현황 보기</span>
              </button>
            </div>
          </div>

          {/* Interactive Statistics Details Viewer Panel */}
          {activeStatTab && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-md border-t-4 border-brand animate-fade-in space-y-6 bg-white/95">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-4">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-brand" />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      {activeStatTab === 'users' && '👥 [실시간 데이터] 플랫폼 가입 회원 통합 현황'}
                      {activeStatTab === 'footprints' && '📅 [실시간 데이터] 연천 AI 교육 전문가 발자취 연대표'}
                      {activeStatTab === 'activities' && '🎨 [실시간 데이터] 강사진 실시간 수업 설계 갤러리'}
                      {activeStatTab === 'resources' && '📂 [실시간 데이터] 교육 자료 공유실 등록 현황'}
                      {activeStatTab === 'notices' && '📢 [실시간 데이터] 연천 AI 교육 공지사항 게시판 현황'}
                      {activeStatTab === 'applications' && '✉️ [실시간 데이터] 실시간 학교/기관 교육출강 심사 현황'}
                      {activeStatTab === 'pastRecords' && '🏆 [실시간 데이터] 영구보존용 완료 교육 이력 데이터'}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      시스템 내 저장된 실제 원본 레코드를 직관적이고 빠르게 상세 탐색 및 검색합니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={statSearchQuery}
                    onChange={(e) => setStatSearchQuery(e.target.value)}
                    placeholder="실시간 내용 검색어 입력..."
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand w-48 sm:w-64"
                  />
                  {statSearchQuery && (
                    <button 
                      onClick={() => setStatSearchQuery('')}
                      className="text-xs text-slate-400 hover:text-slate-600 font-bold px-2 py-1 bg-slate-100 rounded-lg cursor-pointer"
                    >
                      지우기
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setActiveStatTab(null);
                      setStatSearchQuery('');
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="뷰어 닫기"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CONTENTS BASED ON ACTIVE STAT TAB */}
              <div className="overflow-x-auto max-h-[350px] overflow-y-auto border border-slate-150 rounded-2xl">
                {activeStatTab === 'users' && (() => {
                  const filtered = usersList.filter(u => 
                    u.name.toLowerCase().includes(statSearchQuery.toLowerCase()) ||
                    u.email.toLowerCase().includes(statSearchQuery.toLowerCase()) ||
                    (u.affiliation && u.affiliation.toLowerCase().includes(statSearchQuery.toLowerCase())) ||
                    (u.specialty && u.specialty.toLowerCase().includes(statSearchQuery.toLowerCase()))
                  );
                  return (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold sticky top-0 z-10">
                          <th className="p-3">가입일</th>
                          <th className="p-3">성명 (이메일)</th>
                          <th className="p-3">역할 등급</th>
                          <th className="p-3">소속 기관/학교</th>
                          <th className="p-3">담당 연락처</th>
                          <th className="p-3">주요 전문 분야</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filtered.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400">일치하는 회원이 존재하지 않습니다.</td>
                          </tr>
                        ) : (
                          filtered.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50/50 transition">
                              <td className="p-3 font-mono text-slate-500">{u.joinedAt || '2026.03'}</td>
                              <td className="p-3">
                                <div className="font-bold text-slate-800">{u.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  u.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' :
                                  u.role === 'instructor' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                  u.role === 'instructor_pending' ? 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse' :
                                  'bg-slate-50 text-slate-600 border border-slate-100'
                                }`}>
                                  {u.role === 'admin' ? '🛡️ 관리자' :
                                   u.role === 'instructor' ? '🎓 정식 강사' :
                                   u.role === 'instructor_pending' ? '⏳ 승인 대기 강사' : '👤 일반 회원'}
                                </span>
                              </td>
                              <td className="p-3 text-slate-600 font-medium">{u.affiliation || '미등록'}</td>
                              <td className="p-3 font-mono text-slate-500">{u.phone || '미등록'}</td>
                              <td className="p-3 text-slate-500">{u.specialty || '일반 회원 소양 교육'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  );
                })()}

                {activeStatTab === 'footprints' && (() => {
                  const filtered = footprints.filter(f => 
                    f.title.toLowerCase().includes(statSearchQuery.toLowerCase()) ||
                    f.subtitle.toLowerCase().includes(statSearchQuery.toLowerCase()) ||
                    f.description.toLowerCase().includes(statSearchQuery.toLowerCase())
                  );
                  return (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold sticky top-0 z-10">
                          <th className="p-3">날짜/시기</th>
                          <th className="p-3">구분 카테고리</th>
                          <th className="p-3">활동명 (서브타이틀)</th>
                          <th className="p-3">주요 실적 상세 설명</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filtered.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-slate-400">일치하는 발자취 활동이 없습니다.</td>
                          </tr>
                        ) : (
                          filtered.map(f => (
                            <tr key={f.id} className="hover:bg-slate-50/50 transition">
                              <td className="p-3 font-mono font-bold text-slate-600">{f.date}</td>
                              <td className="p-3">
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                                  {f.category === 'youth' ? '청소년 교육' :
                                   f.category === 'school' ? '학교 연계형' :
                                   f.category === 'camp' ? '캠프/해커톤' : '전문가 양성'}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-slate-800">{f.title}</div>
                                <div className="text-[11px] text-slate-400">{f.subtitle}</div>
                              </td>
                              <td className="p-3 text-slate-500 text-[11px] leading-relaxed max-w-xs">{f.description}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  );
                })()}

                {activeStatTab === 'activities' && (() => {
                  const filtered = activities.filter(a => 
                    a.title.toLowerCase().includes(statSearchQuery.toLowerCase()) ||
                    a.instructorName.toLowerCase().includes(statSearchQuery.toLowerCase()) ||
                    a.description.toLowerCase().includes(statSearchQuery.toLowerCase())
                  );
                  return (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold sticky top-0 z-10">
                          <th className="p-3">교육 시기</th>
                          <th className="p-3">출강 강사</th>
                          <th className="p-3">교과명 및 활동 주제</th>
                          <th className="p-3">교실 피드백 요약</th>
                          <th className="p-3">태그 정보</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filtered.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400">일치하는 갤러리 자료가 없습니다.</td>
                          </tr>
                        ) : (
                          filtered.map(a => (
                            <tr key={a.id} className="hover:bg-slate-50/50 transition">
                              <td className="p-3 font-mono text-slate-500">{a.date || '2026-06'}</td>
                              <td className="p-3 font-bold text-brand">{a.instructorName}</td>
                              <td className="p-3 font-semibold text-slate-800">{a.title}</td>
                              <td className="p-3 text-slate-500 text-[11px] leading-relaxed max-w-xs">{a.description}</td>
                              <td className="p-3">
                                <div className="flex flex-wrap gap-1">
                                  {a.tags.map((t, idx) => (
                                    <span key={idx} className="bg-blue-50 text-blue-600 text-[9px] px-1.5 py-0.5 rounded font-semibold border border-blue-100">
                                      #{t}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  );
                })()}

                {activeStatTab === 'resources' && (() => {
                  const filtered = resources.filter(r => 
                    r.title.toLowerCase().includes(statSearchQuery.toLowerCase()) ||
                    r.author.toLowerCase().includes(statSearchQuery.toLowerCase()) ||
                    r.description.toLowerCase().includes(statSearchQuery.toLowerCase())
                  );
                  return (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold sticky top-0 z-10">
                          <th className="p-3">등록일</th>
                          <th className="p-3">공유 강사</th>
                          <th className="p-3">자료 카테고리</th>
                          <th className="p-3">자료 문서명 및 설명</th>
                          <th className="p-3">등록 첨부명 (크기)</th>
                          <th className="p-3 text-center">다운로드</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filtered.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400">공유 등록된 교안 자료가 존재하지 않습니다.</td>
                          </tr>
                        ) : (
                          filtered.map(r => (
                            <tr key={r.id} className="hover:bg-slate-50/50 transition">
                              <td className="p-3 font-mono text-slate-500">{r.uploadedAt}</td>
                              <td className="p-3 font-bold text-slate-800">{r.author}</td>
                              <td className="p-3">
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">
                                  {r.category === 'syllabus' ? '수업계획서' :
                                   r.category === 'guide' ? '강사 가이드' :
                                   r.category === 'slide' ? '발표 슬라이드' : '소프트웨어 키트'}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="font-semibold text-slate-800">{r.title}</div>
                                <div className="text-[10px] text-slate-400">{r.description}</div>
                              </td>
                              <td className="p-3 font-mono text-[11px] text-slate-600">
                                📂 {r.fileName} <span className="text-[10px] text-slate-400">({r.fileSize})</span>
                              </td>
                              <td className="p-3 text-center font-mono font-bold text-slate-700">{r.downloads}회</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  );
                })()}

                {activeStatTab === 'notices' && (() => {
                  const filtered = notices.filter(n => 
                    n.title.toLowerCase().includes(statSearchQuery.toLowerCase()) ||
                    n.content.toLowerCase().includes(statSearchQuery.toLowerCase()) ||
                    n.author.toLowerCase().includes(statSearchQuery.toLowerCase())
                  );
                  return (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold sticky top-0 z-10">
                          <th className="p-3">작성일</th>
                          <th className="p-3">작성자</th>
                          <th className="p-3">구분</th>
                          <th className="p-3">공지 게시글 제목</th>
                          <th className="p-3 text-center">조회수</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filtered.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400">게시된 공지사항이 존재하지 않습니다.</td>
                          </tr>
                        ) : (
                          filtered.map(n => (
                            <tr key={n.id} className="hover:bg-slate-50/50 transition">
                              <td className="p-3 font-mono text-slate-500">{n.date}</td>
                              <td className="p-3 font-semibold text-slate-700">{n.author}</td>
                              <td className="p-3">
                                {n.isImportant ? (
                                  <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-extrabold px-2 py-0.5 rounded animate-pulse">중요 공지</span>
                                ) : (
                                  <span className="bg-slate-50 text-slate-500 border border-slate-100 text-[10px] px-2 py-0.5 rounded">일반 알림</span>
                                )}
                              </td>
                              <td className="p-3 font-bold text-slate-800">{n.title}</td>
                              <td className="p-3 text-center font-mono text-slate-500">{n.views}회</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  );
                })()}

                {activeStatTab === 'applications' && (() => {
                  const filtered = applications.filter(a => 
                    a.organizationName.toLowerCase().includes(statSearchQuery.toLowerCase()) ||
                    a.applicantName.toLowerCase().includes(statSearchQuery.toLowerCase()) ||
                    a.desiredDate.toLowerCase().includes(statSearchQuery.toLowerCase()) ||
                    a.targetStudents.toLowerCase().includes(statSearchQuery.toLowerCase())
                  );
                  return (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold sticky top-0 z-10">
                          <th className="p-3">접수일자</th>
                          <th className="p-3">학교/기관명</th>
                          <th className="p-3">신청 교사명 (연락처)</th>
                          <th className="p-3">희망 일정</th>
                          <th className="p-3">대상 학급 (인원)</th>
                          <th className="p-3">심사 상태</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filtered.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400">일치하는 교육출강 신청 내역이 없습니다.</td>
                          </tr>
                        ) : (
                          filtered.map(a => (
                            <tr key={a.id} className="hover:bg-slate-50/50 transition">
                              <td className="p-3 font-mono text-slate-400">{a.appliedAt || '2026-06'}</td>
                              <td className="p-3 font-extrabold text-slate-950">{a.organizationName}</td>
                              <td className="p-3 text-slate-800 font-medium">
                                {a.applicantName} <span className="text-slate-400 text-[10px] font-mono">({a.phone})</span>
                              </td>
                              <td className="p-3 font-semibold text-slate-700">{a.desiredDate}</td>
                              <td className="p-3 font-mono text-slate-600">
                                {a.targetStudents} <span className="text-brand font-bold">({a.studentCount}명)</span>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                  a.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                  a.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                  'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                                }`}>
                                  {a.status === 'approved' ? '🟢 배정 승인' :
                                   a.status === 'rejected' ? '🔴 반려/조정' : '⏳ 심사 대기'}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  );
                })()}

                {activeStatTab === 'pastRecords' && (() => {
                  const filtered = pastRecords.filter(p => 
                    p.organizationName.toLowerCase().includes(statSearchQuery.toLowerCase()) ||
                    p.instructorName.toLowerCase().includes(statSearchQuery.toLowerCase()) ||
                    p.courseName.toLowerCase().includes(statSearchQuery.toLowerCase()) ||
                    p.contentSummary.toLowerCase().includes(statSearchQuery.toLowerCase())
                  );
                  return (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold sticky top-0 z-10">
                          <th className="p-3">교육완료일</th>
                          <th className="p-3">학교/기관명</th>
                          <th className="p-3">출강 강사명</th>
                          <th className="p-3">완료 교안과정</th>
                          <th className="p-3 text-center">인원 / 시간</th>
                          <th className="p-3">수업 성과 피드백 요약</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filtered.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400">일치하는 과거 완료 이력이 존재하지 않습니다.</td>
                          </tr>
                        ) : (
                          filtered.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50/50 transition">
                              <td className="p-3 font-mono font-bold text-slate-500">{p.completionDate}</td>
                              <td className="p-3 font-bold text-slate-900">{p.organizationName}</td>
                              <td className="p-3 text-brand font-bold">{p.instructorName}</td>
                              <td className="p-3 font-semibold text-slate-700">{p.courseName}</td>
                              <td className="p-3 text-center font-mono font-bold text-slate-800">{p.studentCount}명 / <span className="text-emerald-600">{p.hours}시간</span></td>
                              <td className="p-3 text-[11px] text-slate-500 italic max-w-xs">{p.contentSummary}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  );
                })()}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center bg-slate-50 p-4 rounded-2xl border border-slate-150 text-[11px] text-slate-500">
                <span>💡 상단 검색창에 검색어를 기입하면 해당 범주의 데이터가 실시간으로 자동 필터링됩니다.</span>
                <button
                  onClick={() => {
                    setActiveStatTab(null);
                    setStatSearchQuery('');
                  }}
                  className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 cursor-pointer transition shadow-2xs self-end"
                >
                  상세 뷰어 닫기
                </button>
              </div>
            </div>
          )}

          {/* MAIN PAST EDUCATION RECORDS CONTAINER */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Award className="w-5 h-5 text-brand" />
                  📚 관내 학교별 / 강사별 과거 완료 교육 통합 관리 자료
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  학교 출강이 종료된 완료 이력을 영구 보존하며, 강사별 총 강의시간 합산을 통해 실시간 경력증명서를 즉각 출력합니다.
                </p>
              </div>
            </div>

            {/* SEARCH AND FILTER FORM */}
            <div className="p-4 bg-slate-50/70 border border-slate-150 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">학교 및 기관명 검색</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={pastSearchSchool}
                    onChange={(e) => setPastSearchSchool(e.target.value)}
                    placeholder="예: 연천초등학교"
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">출강 강사명 검색</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={pastSearchInstructor}
                    onChange={(e) => setPastSearchInstructor(e.target.value)}
                    placeholder="예: 김은혜 강사"
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={() => {
                    setPastSearchSchool('');
                    setPastSearchInstructor('');
                  }}
                  className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition"
                >
                  필터 초기화
                </button>
              </div>
            </div>

            {/* PAST RECORDS DISPLAY */}
            {pastRecords.filter(rec => {
              const matchesSchool = rec.organizationName.toLowerCase().includes(pastSearchSchool.toLowerCase());
              const matchesInstructor = rec.instructorName.toLowerCase().includes(pastSearchInstructor.toLowerCase());
              return matchesSchool && matchesInstructor;
            }).length === 0 ? (
              <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-400">일치하는 과거 완료 교육 이력이 존재하지 않습니다.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold">
                      <th className="p-3">교육 완료일</th>
                      <th className="p-3">학교/기관명</th>
                      <th className="p-3">담당 강사</th>
                      <th className="p-3">이수 교육과정명</th>
                      <th className="p-3 text-center">인원 / 시간</th>
                      <th className="p-3 text-right">기능 / 증명서</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {pastRecords.filter(rec => {
                      const matchesSchool = rec.organizationName.toLowerCase().includes(pastSearchSchool.toLowerCase());
                      const matchesInstructor = rec.instructorName.toLowerCase().includes(pastSearchInstructor.toLowerCase());
                      return matchesSchool && matchesInstructor;
                    }).map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-500">{rec.completionDate}</td>
                        <td className="p-3 font-semibold text-slate-900">{rec.organizationName}</td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              setSelectedInstructorForCert(rec.instructorName);
                              setCertSerialNumber(`연천AI-CERT-2026-${Math.abs(rec.instructorName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 1000}`);
                            }}
                            className="bg-blue-50 hover:bg-blue-100 hover:scale-[1.02] active:scale-[0.98] text-brand px-2.5 py-1 rounded-lg font-bold border border-blue-200 transition-all cursor-pointer flex items-center gap-1 text-left shadow-2xs"
                            title={`${rec.instructorName} 강사님의 전체 출강 이력 경력증명서 통합 조회 및 출력`}
                          >
                            <span>{rec.instructorName}</span>
                            <span className="text-[9px] text-brand/70 font-normal underline">(경력합산 출력)</span>
                          </button>
                        </td>
                        <td className="p-3 text-slate-700 font-medium">{rec.courseName}</td>
                        <td className="p-3 text-center font-mono">
                          <span className="font-bold text-slate-800">{rec.studentCount}명</span>
                          <span className="text-slate-300 mx-1">|</span>
                          <span className="font-bold text-emerald-600">{rec.hours}시간</span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedInstructorForCert(rec.instructorName);
                                setCertSerialNumber(`연천AI-CERT-2026-${Math.abs(rec.instructorName.charCodeAt(0) * 11) % 1000}`);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand hover:bg-blue-700 text-white text-[11px] font-bold rounded-md transition shadow-2xs"
                            >
                              <FileText className="w-3 h-3" />
                              증명서 발급
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('본 과거 완료 교육 데이터를 목록에서 영구 삭제하겠습니까?')) {
                                  onDeletePastRecord(rec.id);
                                  alert('성공적으로 삭제되었습니다.');
                                }
                              }}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                              title="기록 영구 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* FORM TO ADD A NEW PAST RECORD PERMANENTLY */}
            <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                ➕ 신규 완료 교육 이력 수동 등록 (영구 보존 데이터 적재)
              </h5>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newOrgName.trim() || !newInstructorName.trim() || !newCourseName.trim() || !newCompletionDate) {
                    alert('필수 기입 사항을 빠짐없이 등록해 주세요.');
                    return;
                  }
                  onAddPastRecord({
                    organizationName: newOrgName.trim(),
                    instructorName: newInstructorName.trim(),
                    courseName: newCourseName.trim(),
                    completionDate: newCompletionDate,
                    studentCount: Number(newStudentCount) || 20,
                    hours: Number(newHours) || 8,
                    contentSummary: newContentSummary.trim() || '교육 실습을 성공적으로 완수하고 피드백을 전달하였습니다.'
                  });
                  alert(`[완료 데이터 영구 적재 성공]\n${newOrgName} - ${newInstructorName} 강사님의 이력이 안전하게 영구 저장되었습니다.`);
                  // clear form
                  setNewOrgName('');
                  setNewInstructorName('');
                  setNewCourseName('');
                  setNewCompletionDate('');
                  setNewStudentCount(20);
                  setNewHours(8);
                  setNewContentSummary('');
                }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs"
              >
                <div>
                  <label className="block font-bold text-slate-600 mb-1">학교/기관명 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    placeholder="예: 연천고등학교"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">출강 강사명 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newInstructorName}
                    onChange={(e) => setNewInstructorName(e.target.value)}
                    placeholder="예: 김은혜 강사"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">교육 완료 날짜 <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={newCompletionDate}
                    onChange={(e) => setNewCompletionDate(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-bold text-slate-600 mb-1">수행 교육 과정명 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    placeholder="예: 엔트리 비디오 감지 기술 활용 AI 실버 케어 게임 디자인"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">수업 대상 학생수 (명)</label>
                  <input
                    type="number"
                    value={newStudentCount}
                    onChange={(e) => setNewStudentCount(Number(e.target.value))}
                    min={1}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">총 이수 강의 시간 (시간)</label>
                  <input
                    type="number"
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    min={1}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">등록 승인 서명자</label>
                  <input
                    type="text"
                    value="연천군청 지능정보과"
                    className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-xs font-semibold"
                    disabled
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-bold text-slate-600 mb-1">수업 결과 및 피드백 요약 내용</label>
                  <textarea
                    value={newContentSummary}
                    onChange={(e) => setNewContentSummary(e.target.value)}
                    placeholder="교육 이수 완료 후 피드백 및 교과 진행 특이사항을 간략히 요약 기록합니다."
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg h-20 resize-none text-xs"
                  />
                </div>
                <div className="sm:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <PlusCircle className="w-4 h-4" />
                    과거 교육 이력 영구 적재 등록
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RESET Platform database */}
          <div className="p-6 bg-red-50/50 border border-red-200 rounded-3xl space-y-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5.5 h-5.5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-extrabold text-red-950">공식 플랫폼 기초 데이터 영구 공장초기화</h4>
                <p className="text-xs text-red-700 leading-relaxed mt-1">
                  테스트 작성 중 입력하셨던 회원가입, 출강 요청, 교안 업로드 데이터 및 수동 등록한 모든 과거 교육 이력이 완전히 말소되며 최초 수립된 공식 1기 기본 더미 데이터셋으로 즉각 복구됩니다.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (confirm('모든 수정한 데이터가 말소됩니다. 최초 상태로 초기화 하겠습니까?')) {
                  onResetAllData();
                  alert('[공장초기화 완료]\n모든 정보가 Yeoncheon AI 1st Official 기본값으로 환원되었습니다.');
                }
              }}
              className="flex items-center gap-1.5 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow shadow-red-200 transition"
            >
              <RefreshCw className="w-4 h-4" />
              공식 기본 셋업으로 전체 초기화하기
            </button>
          </div>
        </div>
      )}

      {/* SECTION 4: HOMEPAGE SETTINGS */}
      {subTab === 'homepage' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 sm:p-6 rounded-2xl shadow-sm space-y-6">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand animate-pulse" />
              메인 광장 헤로 프로모션 문구 직접 설정
            </h4>
            
            <form onSubmit={handleSaveHome} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">상단 영문 태그라인</label>
                  <input
                    type="text"
                    value={editHomeForm.heroTagline}
                    onChange={(e) => setEditHomeForm({ ...editHomeForm, heroTagline: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">예: Yeoncheon AI Education Expert 1st Gen</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">홍보용 메인 헤드라인 타이틀</label>
                  <input
                    type="text"
                    value={editHomeForm.heroTitle}
                    onChange={(e) => setEditHomeForm({ ...editHomeForm, heroTitle: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">예: 연천의 교실을 바꾸는 최첨단 지능화 AI 강사단</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">홍보용 설명 단락 (Curiosity 유발 소개)</label>
                  <textarea
                    value={editHomeForm.heroDescription}
                    onChange={(e) => setEditHomeForm({ ...editHomeForm, heroDescription: e.target.value })}
                    rows={4}
                    className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">메인화면에 접속하는 외부인 및 교육 신청자들에게 호기심과 기술적 깊이를 선사할 수 있는 핵심 구문입니다.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">하단 푸터 영역 설명 (연천 AI 교육 전문가 1기 제목 아래 내용)</label>
                  <textarea
                    value={editHomeForm.footerDescription || ''}
                    onChange={(e) => setEditHomeForm({ ...editHomeForm, footerDescription: e.target.value })}
                    rows={3}
                    className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">하단(Footer) 좌측 연천 AI 교육 전문가 1기 로고명 하단에 표시되는 소개 문구를 설정합니다.</p>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <span className="block text-xs font-bold text-brand">📞 하단 푸터 연락처 상세 정보 (Contact Info)</span>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">행정실 및 교육문화센터 주소</label>
                      <input
                        type="text"
                        value={editHomeForm.contactAddress || ''}
                        onChange={(e) => setEditHomeForm({ ...editHomeForm, contactAddress: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                        placeholder="경기도 연천군 전곡읍 평화로 연천 청소년문화센터 3층"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">연락처 전화번호</label>
                        <input
                          type="text"
                          value={editHomeForm.contactPhone || ''}
                          onChange={(e) => setEditHomeForm({ ...editHomeForm, contactPhone: e.target.value })}
                          className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                          placeholder="031-839-XXXX (연천군청 지능디지털교육과 행정실)"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">공식 이메일 주소</label>
                        <input
                          type="email"
                          value={editHomeForm.contactEmail || ''}
                          onChange={(e) => setEditHomeForm({ ...editHomeForm, contactEmail: e.target.value })}
                          className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                          placeholder="info@yeoncheon.ai"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <span className="block text-xs font-bold text-brand flex items-center gap-1">
                    <Database className="w-4 h-4 text-brand" />
                    🎯 AI 교구 추천 및 리터러시 퀴즈 구역 편집 (Custom Interaction Sections)
                  </span>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">1. AI 교구 스마트 추천 구역 설정</span>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">교구 추천 구역 타이틀</label>
                        <input
                          type="text"
                          value={editHomeForm.recommendTitle || ''}
                          onChange={(e) => setEditHomeForm({ ...editHomeForm, recommendTitle: e.target.value })}
                          className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                          placeholder="연천 청소년들이 가장 열광할 AI 교구는 무엇일까요?"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">교구 추천 구역 설명문구</label>
                        <textarea
                          value={editHomeForm.recommendDesc || ''}
                          onChange={(e) => setEditHomeForm({ ...editHomeForm, recommendDesc: e.target.value })}
                          rows={2}
                          className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                          placeholder="설명 문구..."
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-200/60 pt-3.5 space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">대상 연령 드롭다운 타이틀 라벨</label>
                          <input
                            type="text"
                            value={editHomeForm.recommendAgeLabel || ''}
                            onChange={(e) => setEditHomeForm({ ...editHomeForm, recommendAgeLabel: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                            placeholder="대상 연령 선택"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">매칭 분석 버튼 텍스트</label>
                          <input
                            type="text"
                            value={editHomeForm.recommendBtnText || ''}
                            onChange={(e) => setEditHomeForm({ ...editHomeForm, recommendBtnText: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                            placeholder="연천 AI 매칭 커리큘럼 분석하기"
                          />
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                        <span className="block text-xs font-bold text-slate-800">대상 연령 선택 항목 설정 (4개)</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editHomeForm.recommendAgeOpt1 || ''}
                            onChange={(e) => setEditHomeForm({ ...editHomeForm, recommendAgeOpt1: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                            placeholder="초등학교 고학년 (엔트리/메이커)"
                          />
                          <input
                            type="text"
                            value={editHomeForm.recommendAgeOpt2 || ''}
                            onChange={(e) => setEditHomeForm({ ...editHomeForm, recommendAgeOpt2: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                            placeholder="중학교 자유학기 (머신러닝/아두이노)"
                          />
                          <input
                            type="text"
                            value={editHomeForm.recommendAgeOpt3 || ''}
                            onChange={(e) => setEditHomeForm({ ...editHomeForm, recommendAgeOpt3: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                            placeholder="고등학교 동아리 (파이썬/고급 인공지능)"
                          />
                          <input
                            type="text"
                            value={editHomeForm.recommendAgeOpt4 || ''}
                            onChange={(e) => setEditHomeForm({ ...editHomeForm, recommendAgeOpt4: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                            placeholder="학부모 및 주민 (생활 AI/실무 리터러시)"
                          />
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                        <div className="mb-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">희망 교육 카테고리 드롭다운 타이틀 라벨</label>
                          <input
                            type="text"
                            value={editHomeForm.recommendCategoryLabel || ''}
                            onChange={(e) => setEditHomeForm({ ...editHomeForm, recommendCategoryLabel: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                            placeholder="희망 교육 카테고리"
                          />
                        </div>
                        <span className="block text-xs font-bold text-slate-800">희망 교육 카테고리 항목 설정 (4개)</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editHomeForm.recommendCategoryOpt1 || ''}
                            onChange={(e) => setEditHomeForm({ ...editHomeForm, recommendCategoryOpt1: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                            placeholder="자율주행 코딩 & 스마트 모빌리티"
                          />
                          <input
                            type="text"
                            value={editHomeForm.recommendCategoryOpt2 || ''}
                            onChange={(e) => setEditHomeForm({ ...editHomeForm, recommendCategoryOpt2: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                            placeholder="생성형 AI 미디어아트 (챗GPT/달리)"
                          />
                          <input
                            type="text"
                            value={editHomeForm.recommendCategoryOpt3 || ''}
                            onChange={(e) => setEditHomeForm({ ...editHomeForm, recommendCategoryOpt3: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                            placeholder="머신러닝 모델 학습 (티처블머신)"
                          />
                          <input
                            type="text"
                            value={editHomeForm.recommendCategoryOpt4 || ''}
                            onChange={(e) => setEditHomeForm({ ...editHomeForm, recommendCategoryOpt4: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                            placeholder="아두이노 IoT & 친환경 스마트팜"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-4">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">2. 나의 AI 디지털 리터러시 지수 퀴즈 구역 설정</span>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">퀴즈 구역 타이틀</label>
                        <input
                          type="text"
                          value={editHomeForm.quizTitle || ''}
                          onChange={(e) => setEditHomeForm({ ...editHomeForm, quizTitle: e.target.value })}
                          className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                          placeholder="나의 AI 디지털 리터러시 지수는?"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">퀴즈 구역 설명문구</label>
                        <textarea
                          value={editHomeForm.quizDesc || ''}
                          onChange={(e) => setEditHomeForm({ ...editHomeForm, quizDesc: e.target.value })}
                          rows={2}
                          className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                          placeholder="퀴즈 설명 문구..."
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-3 space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                        <span className="block text-xs font-bold text-slate-800">Q1 질문 설정 (①번 항목이 무조건 정답)</span>
                        <input
                          type="text"
                          value={editHomeForm.quizQ1Text || ''}
                          onChange={(e) => setEditHomeForm({ ...editHomeForm, quizQ1Text: e.target.value })}
                          className="w-full px-3.5 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                          placeholder="질문 내용을 입력하세요"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <span className="text-[10px] text-emerald-600 font-bold block mb-1">정답 ①</span>
                            <input
                              type="text"
                              value={editHomeForm.quizQ1Correct || ''}
                              onChange={(e) => setEditHomeForm({ ...editHomeForm, quizQ1Correct: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-emerald-300 bg-emerald-50 text-xs rounded-lg focus:outline-none"
                              placeholder="정답"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block mb-1">오답 ②</span>
                            <input
                              type="text"
                              value={editHomeForm.quizQ1Wrong1 || ''}
                              onChange={(e) => setEditHomeForm({ ...editHomeForm, quizQ1Wrong1: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-slate-250 text-xs rounded-lg focus:outline-none"
                              placeholder="오답"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block mb-1">오답 ③</span>
                            <input
                              type="text"
                              value={editHomeForm.quizQ1Wrong2 || ''}
                              onChange={(e) => setEditHomeForm({ ...editHomeForm, quizQ1Wrong2: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-slate-250 text-xs rounded-lg focus:outline-none"
                              placeholder="오답"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                        <span className="block text-xs font-bold text-slate-800">Q2 질문 설정 (②번 항목이 무조건 정답)</span>
                        <input
                          type="text"
                          value={editHomeForm.quizQ2Text || ''}
                          onChange={(e) => setEditHomeForm({ ...editHomeForm, quizQ2Text: e.target.value })}
                          className="w-full px-3.5 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                          placeholder="질문 내용을 입력하세요"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block mb-1">오답 ①</span>
                            <input
                              type="text"
                              value={editHomeForm.quizQ2Wrong1 || ''}
                              onChange={(e) => setEditHomeForm({ ...editHomeForm, quizQ2Wrong1: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-slate-250 text-xs rounded-lg focus:outline-none"
                              placeholder="오답"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-emerald-600 font-bold block mb-1">정답 ②</span>
                            <input
                              type="text"
                              value={editHomeForm.quizQ2Correct || ''}
                              onChange={(e) => setEditHomeForm({ ...editHomeForm, quizQ2Correct: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-emerald-300 bg-emerald-50 text-xs rounded-lg focus:outline-none"
                              placeholder="정답"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block mb-1">오답 ③</span>
                            <input
                              type="text"
                              value={editHomeForm.quizQ2Wrong2 || ''}
                              onChange={(e) => setEditHomeForm({ ...editHomeForm, quizQ2Wrong2: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-slate-250 text-xs rounded-lg focus:outline-none"
                              placeholder="오답"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                        <span className="block text-xs font-bold text-slate-800">Q3 질문 설정 (①번 항목이 무조건 정답)</span>
                        <input
                          type="text"
                          value={editHomeForm.quizQ3Text || ''}
                          onChange={(e) => setEditHomeForm({ ...editHomeForm, quizQ3Text: e.target.value })}
                          className="w-full px-3.5 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                          placeholder="질문 내용을 입력하세요"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <span className="text-[10px] text-emerald-600 font-bold block mb-1">정답 ①</span>
                            <input
                              type="text"
                              value={editHomeForm.quizQ3Correct || ''}
                              onChange={(e) => setEditHomeForm({ ...editHomeForm, quizQ3Correct: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-emerald-300 bg-emerald-50 text-xs rounded-lg focus:outline-none"
                              placeholder="정답"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block mb-1">오답 ②</span>
                            <input
                              type="text"
                              value={editHomeForm.quizQ3Wrong1 || ''}
                              onChange={(e) => setEditHomeForm({ ...editHomeForm, quizQ3Wrong1: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-slate-250 text-xs rounded-lg focus:outline-none"
                              placeholder="오답"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block mb-1">오답 ③</span>
                            <input
                              type="text"
                              value={editHomeForm.quizQ3Wrong2 || ''}
                              onChange={(e) => setEditHomeForm({ ...editHomeForm, quizQ3Wrong2: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-slate-250 text-xs rounded-lg focus:outline-none"
                              placeholder="오답"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                        <span className="block text-xs font-bold text-slate-800">퀴즈 구역 하단 푸터 슬로건 설정</span>
                        <input
                          type="text"
                          value={editHomeForm.quizFooterText || ''}
                          onChange={(e) => setEditHomeForm({ ...editHomeForm, quizFooterText: e.target.value })}
                          className="w-full px-3.5 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                          placeholder="쉽고 유익한 AI 교육 트렌드, 연천 AI 통합 플랫폼이 선도합니다."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand hover:bg-brand/90 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  메인 홍보정보 저장 반영하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 5: APPLICATION PAGE SETTINGS */}
      {subTab === 'apptab' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 sm:p-6 rounded-2xl shadow-sm space-y-6 bg-white">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-brand" />
              '교육상담 & 출강 신청' 페이지의 전체 텍스트 및 안내 정보 직접 수정
            </h4>

            <form onSubmit={handleSaveAppTab} className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-4">
                <span className="text-xs font-bold text-slate-800 block border-b border-slate-200 pb-1.5">
                  1. 페이지 헤더 정보 설정 (대문 영역)
                </span>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">상단 페이지 대제목</label>
                    <input
                      type="text"
                      value={editHomeForm.appTabTitle || ''}
                      onChange={(e) => setEditHomeForm({ ...editHomeForm, appTabTitle: e.target.value })}
                      className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                      placeholder="찾아가는 AI 코딩 교육상담 & 출강 신청"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">상단 페이지 상세 설명문</label>
                    <textarea
                      value={editHomeForm.appTabDesc || ''}
                      onChange={(e) => setEditHomeForm({ ...editHomeForm, appTabDesc: e.target.value })}
                      rows={2}
                      className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                      placeholder="연천 관내 초중고등학교, 자치회, 공공기관의 연령별 AI 리터러시 출강 교육 신청을 직접 수렴하고 있습니다."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-4">
                <span className="text-xs font-bold text-slate-800 block border-b border-slate-200 pb-1.5">
                  2. 상담 신청서 폼 문구 설정
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">신청서 폼 헤더 텍스트</label>
                    <input
                      type="text"
                      value={editHomeForm.appFormHeader || ''}
                      onChange={(e) => setEditHomeForm({ ...editHomeForm, appFormHeader: e.target.value })}
                      className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                      placeholder="교육 파견 및 무료 설계 상담서 양식"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">신청 완료 팝업 타이틀</label>
                    <input
                      type="text"
                      value={editHomeForm.appSuccessTitle || ''}
                      onChange={(e) => setEditHomeForm({ ...editHomeForm, appSuccessTitle: e.target.value })}
                      className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                      placeholder="출강 교육 신청서가 성공적으로 접수되었습니다!"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">신청 완료 팝업 본문 문구</label>
                    <input
                      type="text"
                      value={editHomeForm.appSuccessDesc || ''}
                      onChange={(e) => setEditHomeForm({ ...editHomeForm, appSuccessDesc: e.target.value })}
                      className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                      placeholder="하단의 '상담 신청 이력' 탭에서 관리자의 실시간 심사 상태를 확인하실 수 있습니다."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-4">
                <span className="text-xs font-bold text-slate-800 block border-b border-slate-200 pb-1.5">
                  3. 우측 사이드바: 강사진 파견 약속 설정
                </span>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">약속 박스 대헤더</label>
                    <input
                      type="text"
                      value={editHomeForm.appPromiseHeader || ''}
                      onChange={(e) => setEditHomeForm({ ...editHomeForm, appPromiseHeader: e.target.value })}
                      className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                      placeholder="연천 교육 전문가 1기 파견 약속"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">파견 약속 세부 본문 ①</label>
                    <textarea
                      value={editHomeForm.appPromiseDesc1 || ''}
                      onChange={(e) => setEditHomeForm({ ...editHomeForm, appPromiseDesc1: e.target.value })}
                      rows={3}
                      className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                      placeholder="본 과정 강사진은 연천군청 공식 인증 정교재와 최첨단 교육용 센서 키트(마이크로비트, 아두이노 등)를 직접 지참하여 출강하므로, 고도화된 양질의 실습형 교육이 학생들에게 안전하게 보장됩니다."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">파견 약속 세부 본문 ② (예산 및 행정 지원 상담)</label>
                    <textarea
                      value={editHomeForm.appPromiseDesc2 || ''}
                      onChange={(e) => setEditHomeForm({ ...editHomeForm, appPromiseDesc2: e.target.value })}
                      rows={3}
                      className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                      placeholder="구체적인 교재 재료비 산정, 학교 보조금 연계 설계, 자유학기 코스웨어 편성 등 구체적인 교육 예정 사항은 제출해주신 온라인 상담 신청서를 기반으로 전담 매칭된 강사가 1:1 맞춤 상담 및 컨설팅을 즉각 지원해 드립니다."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-4">
                <span className="text-xs font-bold text-slate-800 block border-b border-slate-200 pb-1.5">
                  4. 우측 사이드바: 퀵 FAQ Brief 내용 수정
                </span>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">FAQ 영역 대헤더</label>
                    <input
                      type="text"
                      value={editHomeForm.appFaqHeader || ''}
                      onChange={(e) => setEditHomeForm({ ...editHomeForm, appFaqHeader: e.target.value })}
                      className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
                      placeholder="FAQ BRIEF"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <label className="block text-xs font-bold text-slate-600 mb-1">자주 묻는 질문 ① (Q)</label>
                      <input
                        type="text"
                        value={editHomeForm.appFaqQ1 || ''}
                        onChange={(e) => setEditHomeForm({ ...editHomeForm, appFaqQ1: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none mb-2"
                        placeholder="Q. 노트북이나 교구재가 구비되어 있지 않아도 되나요?"
                      />
                      <label className="block text-xs font-bold text-slate-600 mb-1">답변 내용 ① (A)</label>
                      <textarea
                        value={editHomeForm.appFaqA1 || ''}
                        onChange={(e) => setEditHomeForm({ ...editHomeForm, appFaqA1: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none"
                        placeholder="A. 출강 신청 시 교구재 렌탈 협의가 가능합니다..."
                      />
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <label className="block text-xs font-bold text-slate-600 mb-1">자주 묻는 질문 ② (Q)</label>
                      <input
                        type="text"
                        value={editHomeForm.appFaqQ2 || ''}
                        onChange={(e) => setEditHomeForm({ ...editHomeForm, appFaqQ2: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none mb-2"
                        placeholder="Q. 교육 과정 기간은 어떻게 되나요?"
                      />
                      <label className="block text-xs font-bold text-slate-600 mb-1">답변 내용 ② (A)</label>
                      <textarea
                        value={editHomeForm.appFaqA2 || ''}
                        onChange={(e) => setEditHomeForm({ ...editHomeForm, appFaqA2: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none"
                        placeholder="A. 1일성 특강부터 자유학기제 장기 연계형 정규 과정까지 협의 하에 지원합니다."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-brand hover:bg-brand/90 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  교육상담 페이지 설정 저장 반영하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 경력증명서 정식 발급 및 인쇄용 모달 */}
      {selectedInstructorForCert && (() => {
        const matchedInstructorClasses = pastRecords.filter(rec => 
          rec.instructorName.trim().toLowerCase().includes(selectedInstructorForCert.trim().toLowerCase())
        );
        const totalCompletedHours = matchedInstructorClasses.reduce((sum, rec) => sum + rec.hours, 0);
        const totalCompletedSchools = matchedInstructorClasses.length;
        const selectedInstructorUser = usersList.find(u => 
          u.name.trim().toLowerCase().includes(selectedInstructorForCert.trim().toLowerCase())
        );

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in print:bg-white print:p-0">
            <div className="w-full max-w-2xl bg-white text-slate-900 p-8 sm:p-12 rounded-3xl shadow-2xl relative border-8 border-amber-100/50 my-8 print:border-0 print:shadow-none print:my-0 print:p-0">
              {/* Elegant Golden Frame Visuals */}
              <div className="absolute inset-2 border border-amber-200/50 pointer-events-none rounded-2xl print:hidden"></div>
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedInstructorForCert(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition z-10 print:hidden"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-8">
                {/* Document Header */}
                <div className="text-center space-y-2">
                  <p className="text-[10px] font-mono tracking-widest text-slate-400 font-bold">
                    {certSerialNumber || '연천AI-CERT-2026-X'}
                  </p>
                  <h1 className="text-3xl font-serif font-extrabold tracking-[0.5em] text-slate-800 mr-[-0.5em] mt-2">
                    경 력 증 명 서
                  </h1>
                  <div className="w-24 h-1 bg-amber-400 mx-auto mt-4"></div>
                </div>

                {/* Personal Information Table */}
                <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                  <div className="grid grid-cols-4 border-b border-slate-200">
                    <div className="col-span-1 bg-slate-50 p-3 font-bold border-r border-slate-200 text-slate-700 text-center">성 명</div>
                    <div className="col-span-1 p-3 border-r border-slate-200 text-slate-800 font-semibold">{selectedInstructorForCert}</div>
                    <div className="col-span-1 bg-slate-50 p-3 font-bold border-r border-slate-200 text-slate-700 text-center">생년월일</div>
                    <div className="col-span-1 p-3 text-slate-800 font-mono">1982. 04. 15</div>
                  </div>
                  <div className="grid grid-cols-4 border-b border-slate-200">
                    <div className="col-span-1 bg-slate-50 p-3 font-bold border-r border-slate-200 text-slate-700 text-center">소 속</div>
                    <div className="col-span-1 p-3 border-r border-slate-200 text-slate-800 font-semibold">{selectedInstructorUser?.affiliation || '연천 AI 교육 전문가 협회 (제 1기)'}</div>
                    <div className="col-span-1 bg-slate-50 p-3 font-bold border-r border-slate-200 text-slate-700 text-center">연락처</div>
                    <div className="col-span-1 p-3 text-slate-800 font-mono">{selectedInstructorUser?.phone || '010-9876-5432'}</div>
                  </div>
                  <div className="grid grid-cols-4">
                    <div className="col-span-1 bg-slate-50 p-3 font-bold border-r border-slate-200 text-slate-700 text-center">전문 분야</div>
                    <div className="col-span-3 p-3 text-slate-800 font-semibold">{selectedInstructorUser?.specialty || '인공지능 리터러시 & 피지컬 컴퓨팅 융합'}</div>
                  </div>
                </div>

                {/* Sub Title */}
                <h3 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1.5 flex items-center justify-between">
                  <span>1. 교육 출강 및 지도 세부 경력 이력</span>
                  <span className="text-[10px] text-slate-400 font-normal">총 {totalCompletedSchools}개교 / 총 {totalCompletedHours}시간 강의 수행</span>
                </h3>

                {/* Detailed Classes List */}
                {matchedInstructorClasses.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-lg">
                    출강 경력이 전산상 등록되어 있지 않습니다.
                  </p>
                ) : (
                  <div className="overflow-hidden border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                          <th className="p-2.5">교육일자</th>
                          <th className="p-2.5">출강 학교/기관</th>
                          <th className="p-2.5">교육과정명</th>
                          <th className="p-2.5 text-center">시간</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {matchedInstructorClasses.map((cl, idx) => (
                          <tr key={cl.id || idx}>
                            <td className="p-2.5 font-mono text-slate-500">{cl.completionDate}</td>
                            <td className="p-2.5 font-bold text-slate-800">{cl.organizationName}</td>
                            <td className="p-2.5 text-slate-600">{cl.courseName}</td>
                            <td className="p-2.5 text-center font-mono font-bold text-emerald-600">{cl.hours}H</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-50 font-bold border-t border-slate-300">
                          <td colSpan={3} className="p-2.5 text-right text-slate-700 font-serif">위 기재 경력 합계 (총 이수 시간):</td>
                          <td className="p-2.5 text-center font-mono text-emerald-700 text-sm">{totalCompletedHours}시간</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                {/* Legal Confirmation block */}
                <div className="text-center pt-8 space-y-6 relative">
                  {/* Official Stamp Vector Overlay */}
                  <div className="absolute right-12 bottom-6 w-24 h-24 border-4 border-red-500/80 rounded-full flex items-center justify-center font-bold text-red-500/80 text-[10px] leading-tight select-none rotate-12 uppercase font-serif tracking-widest pointer-events-none">
                    연천군수<br />공인인
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-serif max-w-md mx-auto">
                    위 사람은 경기도 연천군과 교육위원회에서 운영하는 <strong>「연천 AI 교육 전문가 강사 양성과정 제 1기」</strong> 교육생으로서, 상기 명시된 관내 디지털 및 소프트웨어 인공지능 창의 교육 파견 실적을 성실히 이수 및 완수하였음을 공식적으로 증명합니다.
                  </p>

                  <div className="space-y-1">
                    <div className="flex justify-center items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-mono font-bold text-slate-500">발급일자: {issueDate}</span>
                    </div>
                    <p className="text-sm font-serif font-extrabold text-slate-800 tracking-wider">
                      연천군 AI 교육 전문가 제1기 행정위원회 위원장
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end pt-6 border-t border-slate-150 print:hidden">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    증명서 인쇄 및 PDF 저장
                  </button>
                  <button
                    onClick={() => setSelectedInstructorForCert(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
