export interface HomeContent {
  heroTagline: string;
  heroTitle: string;
  heroDescription: string;
  footerDescription?: string;
  feature1Title?: string;
  feature1Desc?: string;
  feature2Title?: string;
  feature2Desc?: string;
  feature3Title?: string;
  feature3Desc?: string;
  contactAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  recommendTitle?: string;
  recommendDesc?: string;
  quizTitle?: string;
  quizDesc?: string;
  quizQ1Text?: string;
  quizQ1Correct?: string;
  quizQ1Wrong1?: string;
  quizQ1Wrong2?: string;
  quizQ2Text?: string;
  quizQ2Correct?: string;
  quizQ2Wrong1?: string;
  quizQ2Wrong2?: string;
  quizQ3Text?: string;
  quizQ3Correct?: string;
  quizQ3Wrong1?: string;
  quizQ3Wrong2?: string;
  recommendAgeLabel?: string;
  recommendAgeOpt1?: string;
  recommendAgeOpt2?: string;
  recommendAgeOpt3?: string;
  recommendAgeOpt4?: string;
  recommendCategoryLabel?: string;
  recommendCategoryOpt1?: string;
  recommendCategoryOpt2?: string;
  recommendCategoryOpt3?: string;
  recommendCategoryOpt4?: string;
  recommendBtnText?: string;
  quizFooterText?: string;
  appTabTitle?: string;
  appTabDesc?: string;
  appFormHeader?: string;
  appSuccessTitle?: string;
  appSuccessDesc?: string;
  appPromiseHeader?: string;
  appPromiseDesc1?: string;
  appPromiseDesc2?: string;
  appFaqHeader?: string;
  appFaqQ1?: string;
  appFaqA1?: string;
  appFaqQ2?: string;
  appFaqA2?: string;
}

export type UserRole = 'general' | 'instructor_pending' | 'instructor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  affiliation?: string; // 소속 기관/학교
  specialty?: string; // 주요 전문 분야 (인공지능 교육, 엔트리, 피지컬 컴퓨팅 등)
  joinedAt: string;
  password?: string;
}

export interface GreetingContent {
  introTitle: string;
  introSubtitle: string;
  introContent: string;
  greetingTitle: string;
  greetingSubtitle: string;
  greetingContent: string;
  greetingAuthor: string;
  greetingAuthorRole: string;
  introImageUrl?: string;
  graduatesCountText?: string;
  activeRegionText?: string;
}

export interface FootprintItem {
  id: string;
  date: string; // "2026-05"
  title: string;
  subtitle: string;
  description: string;
  category: 'youth' | 'school' | 'camp' | 'expert';
  imageUrl: string;
}

export interface InstructorActivity {
  id: string;
  title: string;
  instructorName: string;
  description: string;
  imageUrl: string;
  tags: string[];
  date: string;
}

export interface CourseApplication {
  id: string;
  organizationName: string;
  applicantName: string;
  phone: string;
  email: string;
  desiredDate: string;
  targetStudents: string; // 초등, 중등, 고등, 교사 등
  studentCount: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  adminComment?: string;
  password?: string; // 임시 비밀번호 (조회용)
  additionalData?: {
    customCurriculum?: string;
    budget?: string;
    assignedInstructor?: string;
    internalNote?: string;
  };
}

export interface SharedResource {
  id: string;
  title: string;
  category: 'syllabus' | 'guide' | 'slide' | 'software';
  description: string;
  fileName: string;
  fileSize: string;
  author: string;
  uploadedAt: string;
  downloads: number;
}

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  views: number;
  isImportant: boolean;
}

export interface PastEducationRecord {
  id: string;
  organizationName: string; // 학교/기관명
  instructorName: string; // 강사명
  courseName: string; // 교육과정명
  completionDate: string; // 교육 완료일
  studentCount: number; // 학생 수
  hours: number; // 총 강의 시간
  contentSummary: string; // 교육 내용 요약
}
