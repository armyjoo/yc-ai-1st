import React, { useState, useEffect } from 'react';
import { 
  User, UserRole, GreetingContent, FootprintItem, 
  InstructorActivity, CourseApplication, SharedResource, NoticeItem, HomeContent,
  PastEducationRecord
} from './types';
import { 
  INITIAL_GREETING_CONTENT, INITIAL_FOOTPRINTS, INITIAL_SHOWCASE, 
  INITIAL_RESOURCES, INITIAL_NOTICES, INITIAL_HOME_CONTENT,
  INITIAL_PAST_RECORDS
} from './mockData';

import { Header } from './components/Header';
import { HomeTab } from './components/HomeTab';
import { GreetingsTab } from './components/GreetingsTab';
import { FootprintsTab } from './components/FootprintsTab';
import { ShowcaseTab } from './components/ShowcaseTab';
import { ApplicationTab } from './components/ApplicationTab';
import { InstructorZoneTab } from './components/InstructorZoneTab';
import { NoticeTab } from './components/NoticeTab';
import { AdminPanelTab } from './components/AdminPanelTab';
import { AuthModal } from './components/AuthModal';

import { ShieldCheck, Mail, MapPin, Sparkles, Phone, ExternalLink } from 'lucide-react';

const LOCAL_STORAGE_PREFIX = 'y_aiep_';

export default function App() {
  // --- STATE DECLARATIONS ---
  const [activeTab, setActiveTab] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [homeContent, setHomeContent] = useState<HomeContent>(INITIAL_HOME_CONTENT);
  const [greetingContent, setGreetingContent] = useState<GreetingContent>(INITIAL_GREETING_CONTENT);
  const [footprints, setFootprints] = useState<FootprintItem[]>([]);
  const [activities, setActivities] = useState<InstructorActivity[]>([]);
  const [applications, setApplications] = useState<CourseApplication[]>([]);
  const [resources, setResources] = useState<SharedResource[]>([]);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [pastRecords, setPastRecords] = useState<PastEducationRecord[]>([]);

  // Helper for safe localStorage JSON reading
  const safeJsonParse = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.warn(`Error parsing localStorage key ${key}:`, e);
      return fallback;
    }
  };

  // --- INITIALIZATION (LOCAL STORAGE SYNC) ---
  useEffect(() => {
    try {
      // 0. Home Content
      const savedHome = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}home`);
      if (savedHome) {
        setHomeContent(safeJsonParse('home', INITIAL_HOME_CONTENT));
      } else {
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}home`, JSON.stringify(INITIAL_HOME_CONTENT));
      }

      // 1. Greetings Content
      const savedGreetings = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}greetings`);
      if (savedGreetings) {
        setGreetingContent(safeJsonParse('greetings', INITIAL_GREETING_CONTENT));
      } else {
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}greetings`, JSON.stringify(INITIAL_GREETING_CONTENT));
      }

      // 2. Footprints
      const savedFootprints = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}footprints`);
      if (savedFootprints) {
        setFootprints(safeJsonParse('footprints', INITIAL_FOOTPRINTS));
      } else {
        setFootprints(INITIAL_FOOTPRINTS);
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}footprints`, JSON.stringify(INITIAL_FOOTPRINTS));
      }

      // 3. Showcase Activities
      const savedActivities = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}activities`);
      if (savedActivities) {
        setActivities(safeJsonParse('activities', INITIAL_SHOWCASE));
      } else {
        setActivities(INITIAL_SHOWCASE);
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}activities`, JSON.stringify(INITIAL_SHOWCASE));
      }

      // 4. Resources
      const savedResources = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}resources`);
      if (savedResources) {
        setResources(safeJsonParse('resources', INITIAL_RESOURCES));
      } else {
        setResources(INITIAL_RESOURCES);
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}resources`, JSON.stringify(INITIAL_RESOURCES));
      }

      // 5. Notices
      const savedNotices = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}notices`);
      if (savedNotices) {
        setNotices(safeJsonParse('notices', INITIAL_NOTICES));
      } else {
        setNotices(INITIAL_NOTICES);
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}notices`, JSON.stringify(INITIAL_NOTICES));
      }

      // 6. Users List (Seeding default simulated users)
      const initialUsers: User[] = [
        { id: 'u1', email: 'admin@yeoncheon.ai', name: '이민수 주무관', role: 'admin', phone: '010-1234-5678', affiliation: '연천군청 디지털교육과', specialty: '교육 행정 총괄', joinedAt: '2026-03-01', password: '123456' },
        { id: 'u2', email: 'instructor@yeoncheon.ai', name: '김은혜 강사', role: 'instructor', phone: '010-9876-5432', affiliation: '연천 AI 교육 전문가 협회', specialty: '엔트리 블록코딩 & 생성형 AI', joinedAt: '2026-03-05', password: '123456' },
        { id: 'u3', email: 'pending@yeoncheon.ai', name: '이지훈 예비강사', role: 'instructor_pending', phone: '010-5555-5555', affiliation: '디지털 미래학교 연구원', specialty: '피지컬 아두이노 컴퓨팅', joinedAt: '2026-07-16', password: '123456' },
        { id: 'u4', email: 'user@yeoncheon.ai', name: '홍길동 선생님', role: 'general', phone: '010-4444-4444', affiliation: '연천초등학교', specialty: '일반 회원', joinedAt: '2026-07-10', password: '123456' },
      ];
      const savedUsers = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}users`);
      if (savedUsers) {
        setUsersList(safeJsonParse('users', initialUsers));
      } else {
        setUsersList(initialUsers);
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}users`, JSON.stringify(initialUsers));
      }

      // 7. Applications
      const initialApps: CourseApplication[] = [
        {
          id: "a1",
          organizationName: "연천초등학교",
          applicantName: "홍길동 선생님",
          phone: "010-4444-4444",
          email: "user@yeoncheon.ai",
          desiredDate: "2026-09-15",
          targetStudents: "초등 5학년",
          studentCount: 24,
          message: "생성형 AI 이미지 메이커와 모션 감지 코딩을 연계한 4차시 기초 수업 출강을 요청드립니다.",
          status: "approved",
          appliedAt: "2026-07-14",
          adminComment: "김은혜 강사님 배정 가능합니다. 세부 일정 조율을 위해 위원회에서 전화드리겠습니다.",
          password: "1234"
        },
        {
          id: "a2",
          organizationName: "전곡중학교",
          applicantName: "최영민 부장교사",
          phone: "010-8888-9999",
          email: "choi@school.go.kr",
          desiredDate: "2026-10-12",
          targetStudents: "중등 2학년 전체",
          studentCount: 120,
          message: "기후 위기 대응 스마트 친환경 분리배출기 머신러닝 자유학기제 특강을 기획 중입니다. 강사 3명 파견이 가능할지 여쭙고 싶습니다.",
          status: "pending",
          appliedAt: "2026-07-16",
          password: "5678"
        }
      ];
      const savedApplications = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}applications`);
      if (savedApplications) {
        setApplications(safeJsonParse('applications', initialApps));
      } else {
        setApplications(initialApps);
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}applications`, JSON.stringify(initialApps));
      }

      // 8. Past completed education records
      const savedPastRecords = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}past_records`);
      if (savedPastRecords) {
        setPastRecords(safeJsonParse('past_records', INITIAL_PAST_RECORDS));
      } else {
        setPastRecords(INITIAL_PAST_RECORDS);
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}past_records`, JSON.stringify(INITIAL_PAST_RECORDS));
      }

      // Seed automatic login for first-time evaluator convenience:
      const savedActiveUser = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}active_user`);
      if (savedActiveUser) {
        setCurrentUser(safeJsonParse('active_user', null));
      }
    } catch (err) {
      console.error('Error initializing state from localStorage:', err);
    }
  }, []);

  // --- STATE WRITERS ---
  const handleUpdateGreetings = (updated: GreetingContent) => {
    setGreetingContent(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}greetings`, JSON.stringify(updated));
  };

  const handleResetGreetings = () => {
    setGreetingContent(INITIAL_GREETING_CONTENT);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}greetings`, JSON.stringify(INITIAL_GREETING_CONTENT));
  };

  const handleAddFootprint = (newItem: Omit<FootprintItem, 'id'>) => {
    const freshItem: FootprintItem = {
      ...newItem,
      id: `f_${Date.now()}`
    };
    const updated = [freshItem, ...footprints];
    setFootprints(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}footprints`, JSON.stringify(updated));
  };

  const handleDeleteFootprint = (id: string) => {
    const updated = footprints.filter(f => f.id !== id);
    setFootprints(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}footprints`, JSON.stringify(updated));
  };

  const handleUpdateFootprint = (updatedItem: FootprintItem) => {
    const updated = footprints.map(f => f.id === updatedItem.id ? updatedItem : f);
    setFootprints(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}footprints`, JSON.stringify(updated));
  };

  const handleAddActivity = (newItem: Omit<InstructorActivity, 'id'>) => {
    const freshItem: InstructorActivity = {
      ...newItem,
      id: `s_${Date.now()}`
    };
    const updated = [freshItem, ...activities];
    setActivities(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}activities`, JSON.stringify(updated));
  };

  const handleDeleteActivity = (id: string) => {
    const updated = activities.filter(a => a.id !== id);
    setActivities(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}activities`, JSON.stringify(updated));
  };

  const handleUpdateActivity = (updatedItem: InstructorActivity) => {
    const updated = activities.map(a => a.id === updatedItem.id ? updatedItem : a);
    setActivities(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}activities`, JSON.stringify(updated));
  };

  const handleAddResource = (newItem: Omit<SharedResource, 'id' | 'uploadedAt' | 'downloads'>) => {
    const freshItem: SharedResource = {
      ...newItem,
      id: `r_${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      downloads: 0
    };
    const updated = [freshItem, ...resources];
    setResources(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}resources`, JSON.stringify(updated));
  };

  const handleDeleteResource = (id: string) => {
    const updated = resources.filter(r => r.id !== id);
    setResources(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}resources`, JSON.stringify(updated));
  };

  const handleIncrementDownload = (id: string) => {
    const updated = resources.map(r => r.id === id ? { ...r, downloads: r.downloads + 1 } : r);
    setResources(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}resources`, JSON.stringify(updated));
  };

  const handleAddNotice = (newItem: Omit<NoticeItem, 'id' | 'date' | 'views'>) => {
    const freshItem: NoticeItem = {
      ...newItem,
      id: `n_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      views: 0
    };
    const updated = [freshItem, ...notices];
    setNotices(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}notices`, JSON.stringify(updated));
  };

  const handleDeleteNotice = (id: string) => {
    const updated = notices.filter(n => n.id !== id);
    setNotices(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}notices`, JSON.stringify(updated));
  };

  const handleUpdateNotice = (updatedItem: NoticeItem) => {
    const updated = notices.map(n => n.id === updatedItem.id ? updatedItem : n);
    setNotices(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}notices`, JSON.stringify(updated));
  };

  const handleSubmitApplication = (newItem: Omit<CourseApplication, 'id' | 'appliedAt' | 'status'>) => {
    const freshApp: CourseApplication = {
      ...newItem,
      id: `a_${Date.now()}`,
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [freshApp, ...applications];
    setApplications(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}applications`, JSON.stringify(updated));
  };

  // Admin approvals
  const handleApproveInstructor = (userId: string) => {
    const updatedUsers = usersList.map(u => u.id === userId ? { ...u, role: 'instructor' as UserRole } : u);
    setUsersList(updatedUsers);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}users`, JSON.stringify(updatedUsers));
  };

  const handleRejectInstructor = (userId: string) => {
    const updatedUsers = usersList.filter(u => u.id !== userId);
    setUsersList(updatedUsers);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}users`, JSON.stringify(updatedUsers));
  };

  const handleAuditApplication = (appId: string, status: 'approved' | 'rejected', comment: string) => {
    const updatedApps = applications.map(app => 
      app.id === appId ? { ...app, status, adminComment: comment } : app
    );
    setApplications(updatedApps);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}applications`, JSON.stringify(updatedApps));
  };

  const handleUpdateApplication = (updatedApp: CourseApplication) => {
    const updatedApps = applications.map(app => 
      app.id === updatedApp.id ? updatedApp : app
    );
    setApplications(updatedApps);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}applications`, JSON.stringify(updatedApps));
  };

  const handleAddPastRecord = (newItem: Omit<PastEducationRecord, 'id'>) => {
    const freshRecord: PastEducationRecord = {
      ...newItem,
      id: `p_${Date.now()}`
    };
    const updated = [freshRecord, ...pastRecords];
    setPastRecords(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}past_records`, JSON.stringify(updated));
  };

  const handleDeletePastRecord = (id: string) => {
    const updated = pastRecords.filter(r => r.id !== id);
    setPastRecords(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}past_records`, JSON.stringify(updated));
  };

  const handleResetAllData = () => {
    localStorage.clear();
    setHomeContent(INITIAL_HOME_CONTENT);
    setGreetingContent(INITIAL_GREETING_CONTENT);
    setFootprints(INITIAL_FOOTPRINTS);
    setActivities(INITIAL_SHOWCASE);
    setResources(INITIAL_RESOURCES);
    setNotices(INITIAL_NOTICES);
    setPastRecords(INITIAL_PAST_RECORDS);
    
    const initialUsers: User[] = [
      { id: 'u1', email: 'admin@yeoncheon.ai', name: '이민수 주무관', role: 'admin', phone: '010-1234-5678', affiliation: '연천군청 디지털교육과', specialty: '교육 행정 총괄', joinedAt: '2026-03-01', password: '123456' },
      { id: 'u2', email: 'instructor@yeoncheon.ai', name: '김은혜 강사', role: 'instructor', phone: '010-9876-5432', affiliation: '연천 AI 교육 전문가 협회', specialty: '엔트리 블록코딩 & 생성형 AI', joinedAt: '2026-03-05', password: '123456' },
      { id: 'u3', email: 'pending@yeoncheon.ai', name: '이지훈 예비강사', role: 'instructor_pending', phone: '010-5555-5555', affiliation: '디지털 미래학교 연구원', specialty: '피지컬 아두이노 컴퓨팅', joinedAt: '2026-07-16', password: '123456' },
      { id: 'u4', email: 'user@yeoncheon.ai', name: '홍길동 선생님', role: 'general', phone: '010-4444-4444', affiliation: '연천초등학교', specialty: '일반 회원', joinedAt: '2026-07-10', password: '123456' },
    ];
    setUsersList(initialUsers);
    
    const initialApps: CourseApplication[] = [
      {
        id: "a1",
        organizationName: "연천초등학교",
        applicantName: "홍길동 선생님",
        phone: "010-4444-4444",
        email: "user@yeoncheon.ai",
        desiredDate: "2026-09-15",
        targetStudents: "초등 5학년",
        studentCount: 24,
        message: "생성형 AI 이미지 메이커와 모션 감지 코딩을 연계한 4차시 기초 수업 출강을 요청드립니다.",
        status: "approved",
        appliedAt: "2026-07-14",
        adminComment: "김은혜 강사님 배정 가능합니다. 세부 일정 조율을 위해 위원회에서 전화드리겠습니다.",
        password: "1234"
      }
    ];
    setApplications(initialApps);
    setCurrentUser(null);
  };

  // Auth Modal trigger actions
  const handleLogin = (loggedUser: User) => {
    setCurrentUser(loggedUser);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}active_user`, JSON.stringify(loggedUser));
  };

  const handleRegister = (
    email: string, 
    name: string, 
    role: UserRole, 
    phone: string, 
    affiliation: string, 
    specialty: string,
    password?: string
  ) => {
    const newUser: User = {
      id: `u_${Date.now()}`,
      email,
      name,
      role,
      phone,
      affiliation,
      specialty,
      password: password || '123456',
      joinedAt: new Date().toISOString().split('T')[0]
    };
    const updatedList = [newUser, ...usersList];
    setUsersList(updatedList);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}users`, JSON.stringify(updatedList));
    
    // Automatically login as this registered user!
    setCurrentUser(newUser);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}active_user`, JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}active_user`);
    // Reset active tab to home on sign out
    setActiveTab('greetings');
  };

  const handleQuickRoleSwitchToInstructor = () => {
    if (currentUser) {
      const updatedUser: User = { ...currentUser, role: 'instructor' };
      setCurrentUser(updatedUser);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}active_user`, JSON.stringify(updatedUser));
      // Also update in user list
      const updatedUsersList = usersList.map(u => u.email === currentUser.email ? { ...u, role: 'instructor' as UserRole } : u);
      setUsersList(updatedUsersList);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}users`, JSON.stringify(updatedUsersList));
      alert('[테스트 치트 가동] 정강사(instructor) 회원으로 임시 특수 등급 조정이 완료되었습니다. 강사실 포털을 탐구해보세요!');
    }
  };

  const handleUpdateHomeContent = (updated: HomeContent) => {
    setHomeContent(updated);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}home`, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans text-slate-800 antialiased">
      {/* Header Area */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Tab Rendering Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {activeTab === 'home' && (
          <HomeTab
            currentUser={currentUser}
            activities={activities}
            footprints={footprints}
            setActiveTab={setActiveTab}
            onOpenAuth={() => setAuthModalOpen(true)}
            homeContent={homeContent}
            onUpdateHomeContent={handleUpdateHomeContent}
          />
        )}

        {activeTab === 'greetings' && (
          <GreetingsTab
            currentUser={currentUser}
            greetingContent={greetingContent}
            onUpdateGreetings={handleUpdateGreetings}
            onResetGreetings={handleResetGreetings}
          />
        )}

        {activeTab === 'footprints' && (
          <FootprintsTab
            currentUser={currentUser}
            footprints={footprints}
            onAddFootprint={handleAddFootprint}
            onUpdateFootprint={handleUpdateFootprint}
            onDeleteFootprint={handleDeleteFootprint}
          />
        )}

        {activeTab === 'showcase' && (
          <ShowcaseTab
            currentUser={currentUser}
            activities={activities}
            onAddActivity={handleAddActivity}
            onUpdateActivity={handleUpdateActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        )}

        {activeTab === 'application' && (
          <ApplicationTab
            currentUser={currentUser}
            applications={applications}
            onSubmitApplication={handleSubmitApplication}
            homeContent={homeContent}
            onUpdateHomeContent={handleUpdateHomeContent}
          />
        )}

        {activeTab === 'resources' && (
          <InstructorZoneTab
            currentUser={currentUser}
            resources={resources}
            onAddResource={handleAddResource}
            onDeleteResource={handleDeleteResource}
            onIncrementDownload={handleIncrementDownload}
            onQuickRoleSwitchToInstructor={handleQuickRoleSwitchToInstructor}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {activeTab === 'notice' && (
          <NoticeTab
            currentUser={currentUser}
            notices={notices}
            onAddNotice={handleAddNotice}
            onUpdateNotice={handleUpdateNotice}
            onDeleteNotice={handleDeleteNotice}
          />
        )}

        {activeTab === 'admin' && currentUser?.role === 'admin' && (
          <AdminPanelTab
            currentUser={currentUser}
            usersList={usersList}
            applications={applications}
            resources={resources}
            notices={notices}
            footprints={footprints}
            activities={activities}
            homeContent={homeContent}
            pastRecords={pastRecords}
            onUpdateHomeContent={handleUpdateHomeContent}
            onApproveInstructor={handleApproveInstructor}
            onRejectInstructor={handleRejectInstructor}
            onAuditApplication={handleAuditApplication}
            onUpdateApplication={handleUpdateApplication}
            onResetAllData={handleResetAllData}
            onAddPastRecord={handleAddPastRecord}
            onDeletePastRecord={handleDeletePastRecord}
          />
        )}
      </main>

      {/* Authentication Popup Modal */}
      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          usersList={usersList}
        />
      )}

      {/* Futuristic Styled Premium Footer */}
      <footer className="w-full bg-slate-900 text-white mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-slate-800 pb-10">
            {/* Logo and mission briefing */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded bg-brand flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </span>
                <span className="font-sans font-bold text-lg text-white">
                  연천 AI 교육 전문가 1기
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                {homeContent.footerDescription || "우리는 디지털 불평등을 개혁하고 연천 청소년들의 지적 성장을 전폭 지원하기 위해 연천군과 주무 강사진이 의기투합하여 설립한 스마트 교육 자치 포털입니다."}
              </p>
            </div>

            {/* Slogan and contact numbers */}
            <div className="md:col-span-4 space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider font-orbitron text-accent">Contact Information</h4>
              <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{homeContent.contactAddress || "경기도 연천군 전곡읍 평화로 연천 청소년문화센터 3층"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{homeContent.contactPhone || "031-839-XXXX (연천군청 지능디지털교육과 행정실)"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{homeContent.contactEmail || "info@yeoncheon.ai"}</span>
                </li>
              </ul>
            </div>

            {/* External Quick Link Badges */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider font-orbitron text-accent">External Portals</h4>
              <div className="flex flex-col gap-2">
                <a 
                  href="https://www.yeoncheon.go.kr" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-brand/30 hover:bg-white/10 transition text-xs font-semibold text-slate-300 hover:text-white"
                >
                  <span>연천군청 공식 홈페이지</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
                <a 
                  href="https://www.nia.or.kr" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-brand/30 hover:bg-white/10 transition text-xs font-semibold text-slate-300 hover:text-white"
                >
                  <span>한국지능정보사회진흥원 (NIA)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans">
            <div>
              <p>© 2026 연천 AI 교육 전문가 강사 양성과정 1기 협의회. All Rights Reserved.</p>
              <p className="text-[10px] text-slate-600 mt-1">본 사이트는 깃허브 페이지 호스팅 전용 싱글 페이지 애플리케이션(SPA) 구조로 경량 통합 튜닝되어 가동 중입니다.</p>
            </div>
            
            <div className="flex gap-4">
              <a href="#greetings" onClick={() => setActiveTab('greetings')} className="hover:text-slate-300 transition">이용약관</a>
              <span className="text-slate-800">|</span>
              <a href="#greetings" onClick={() => setActiveTab('greetings')} className="hover:text-slate-300 transition">개인정보 처리방침</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
