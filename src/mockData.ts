import { GreetingContent, FootprintItem, InstructorActivity, SharedResource, NoticeItem, HomeContent } from './types';

export const INITIAL_HOME_CONTENT: HomeContent = {
  heroTagline: "Yeoncheon AI Education Expert 1st Gen",
  heroTitle: "연천의 교실을 바꾸는 최첨단 지능화 AI 강사단",
  heroDescription: "인공지능 소프트웨어부터 실물 피지컬 메이커 코딩까지, 연천군 청소년과 지역사회의 디지털 대전환을 완벽하게 이끌어갈 공식 1st 교육 전문가 그룹의 허브입니다.",
  footerDescription: "우리는 디지털 불평등을 개혁하고 연천 청소년들의 지적 성장을 전폭 지원하기 위해 연천군과 주무 강사진이 의기투합하여 설립한 스마트 교육 자치 포털입니다.",
  feature1Title: "1. 철저히 검증된 우리지역 맞춤 인재",
  feature1Desc: "연천 AI 교육 전문가 강사 양성과정을 최고 성적으로 이수한 1기 전문 강사단이 직접 연수, 출강, 맞춤 교재 개발까지 통합 케어합니다.",
  feature2Title: "2. 현장에서 입증된 무결점 교재/교수안",
  feature2Desc: "단순 이론 교육을 탈피하여 실물 피지컬 센싱, 블록 코딩, 로봇 제어 등 학습자의 흥미와 참여를 극대화하는 검증된 커리큘럼입니다.",
  feature3Title: "3. 투명하고 간편한 온라인 매칭 시스템",
  feature3Desc: "각급 학교 교사, 공공기관 담당자, 마을 교육 활동가 누구나 클릭 몇 번만으로 맞춤 강의 계획 수립과 원클릭 강사 파견을 의뢰할 수 있습니다.",
  contactAddress: "경기도 연천군 전곡읍 평화로 연천 청소년문화센터 3층",
  contactPhone: "031-839-XXXX (연천군청 지능디지털교육과 행정실)",
  contactEmail: "info@yeoncheon.ai",
  recommendTitle: "연천 청소년들이 가장 열광할 AI 교구는 무엇일까요?",
  recommendDesc: "아이들의 학교 급수와 관심 교과 카테고리를 선택해보세요. 연천 AI 1기 전문 강사단이 검증한 최적의 하이테크 피지컬 컴퓨팅 커리큘럼과 매칭 비율을 연산합니다.",
  quizTitle: "나의 AI 디지털 리터러시 지수는?",
  quizDesc: "미래 기술 교육의 상식 및 상호작용 방식에 관한 3가지 간단한 퀴즈를 풀고 나의 역량 수치를 체크해보세요!",
  quizQ1Text: "인공지능이 인간처럼 학습하도록 이미지를 보여주고 가르치는 가장 기초적인 구글의 노코드 도구 이름은?",
  quizQ1Correct: "티처블 머신 (Teachable Machine)",
  quizQ1Wrong1: "알파고 크리에이터",
  quizQ1Wrong2: "아두이노 실버웨어",
  quizQ2Text: "초등학교 및 중학교 교구로 널리 쓰이며, 빛 센서, 가속도 센서, LED 스크린이 내장된 소형 피지컬 마이크로 프로세서 보드는?",
  quizQ2Correct: "마이크로비트 (Micro:bit)",
  quizQ2Wrong1: "인텔 코어 i7",
  quizQ2Wrong2: "라즈베리 아이스크림",
  quizQ3Text: "2026년부터 초중고 교실에 순차적으로 전면 도입되는 맞춤형 개별화 코스웨어가 탑재된 미래형 교과서의 명칭은?",
  quizQ3Correct: "AI 디지털교과서 (AIDT)",
  quizQ3Wrong1: "로봇 가상 교재",
  quizQ3Wrong2: "자율주행 코딩페이퍼",
  recommendAgeLabel: "대상 연령 선택",
  recommendAgeOpt1: "초등학교 고학년 (엔트리/메이커)",
  recommendAgeOpt2: "중학교 자유학기 (머신러닝/아두이노)",
  recommendAgeOpt3: "고등학교 동아리 (파이썬/고급 인공지능)",
  recommendAgeOpt4: "학부모 및 주민 (생활 AI/실무 리터러시)",
  recommendCategoryLabel: "희망 교육 카테고리",
  recommendCategoryOpt1: "자율주행 코딩 & 스마트 모빌리티",
  recommendCategoryOpt2: "생성형 AI 미디어아트 (챗GPT/달리)",
  recommendCategoryOpt3: "머신러닝 모델 학습 (티처블머신)",
  recommendCategoryOpt4: "아두이노 IoT & 친환경 스마트팜",
  recommendBtnText: "연천 AI 매칭 커리큘럼 분석하기",
  quizFooterText: "쉽고 유익한 AI 교육 트렌드, 연천 AI 통합 플랫폼이 선도합니다.",
  appTabTitle: "찾아가는 AI 코딩 교육상담 & 출강 신청",
  appTabDesc: "연천 관내 초중고등학교, 자치회, 공공기관의 연령별 AI 리터러시 출강 교육 신청을 직접 수렴하고 있습니다.",
  appFormHeader: "교육 파견 및 무료 설계 상담서 양식",
  appSuccessTitle: "출강 교육 신청서가 성공적으로 접수되었습니다!",
  appSuccessDesc: "하단의 '상담 신청 이력' 탭에서 관리자의 실시간 심사 상태를 확인하실 수 있습니다.",
  appPromiseHeader: "연천 교육 전문가 1기 파견 약속",
  appPromiseDesc1: "본 과정 강사진은 연천군청 공식 인증 정교재와 최첨단 교육용 센서 키트(마이크로비트, 아두이노 등)를 직접 지참하여 출강하므로, 고도화된 양질의 실습형 교육이 학생들에게 안전하게 보장됩니다.",
  appPromiseDesc2: "구체적인 교재 재료비 산정, 학교 보조금 연계 설계, 자유학기 코스웨어 편성 등 구체적인 교육 예정 사항은 제출해주신 온라인 상담 신청서를 기반으로 전담 매칭된 강사가 1:1 맞춤 상담 및 컨설팅을 즉각 지원해 드립니다.",
  appFaqHeader: "FAQ BRIEF",
  appFaqQ1: "Q. 노트북이나 교구재가 구비되어 있지 않아도 되나요?",
  appFaqA1: "A. 출강 신청 시 교구재 렌탈 협의가 가능합니다. 마이크로비트나 메이커용 키트는 강사진이 지원용 유닛을 보유하고 있습니다.",
  appFaqQ2: "Q. 교육 과정 기간은 어떻게 되나요?",
  appFaqA2: "A. 1일성 특강(2~4시간)부터 자유학기제 장기 연계형 정규 과정(8~12주)까지 협의 하에 전방위 커스텀 지원합니다."
};

export const INITIAL_GREETING_CONTENT: GreetingContent = {
  introTitle: "연천의 미래를 밝히는 AI 교육 인재 양성소",
  introSubtitle: "연천 AI 교육 전문가 강사 양성과정 제 1기",
  introContent: "연천군과 한국지능정보사회진흥원 등이 협력하여 주관하는 '연천 AI 교육 전문가 강사 양성과정'은 다가오는 디지털 대전환 시대에 연천의 인재들이 지역 사회를 넘어 국가적 혁신을 선도할 수 있는 주역으로 성장하도록 적극 지원합니다. 본 과정의 1기 수료생들은 엄선된 교육 커리큘럼을 이수하고 실전 강의 역량까지 인증받은 최고의 디지털 교육 파트너입니다.",
  greetingTitle: "우리지역 디지털 인재 양성을 향한 힘찬 발걸음",
  greetingSubtitle: "연천의 미래 교육, 1기 강사진이 앞장서 열어가겠습니다.",
  greetingContent: "존경하는 연천군민과 교육 관계자 여러분, 반갑습니다. 연천은 아름다운 대자연과 유서 깊은 평화의 터전이자, 이제 첨단 인공지능 기술과 창의융합 교육을 통해 미래 교육 혁신 도시로 도약하고 있습니다. 우리 지역 고유의 자원과 첨단 디지털 기술을 융합하여 교사, 학부모, 청소년 모두가 만족할 수준 높은 맞춤형 AI 교육 프로그램을 제공하겠습니다. 1기 강사진들이 온 정성을 다해 연천의 청소년들이 글로벌 AI 선도자로 성장하도록 도울 것을 굳건히 약속드립니다.",
  greetingAuthor: "연천 AI 교육 전문가 강사진 일동",
  greetingAuthorRole: "공식 1기 대표단 및 교육 위원회",
  introImageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
  graduatesCountText: "1ST GRADUATES",
  activeRegionText: "경기도 연천군"
};

export const INITIAL_FOOTPRINTS: FootprintItem[] = [
  {
    id: "f1",
    date: "2026-03",
    title: "제1기 전문가 양성과정 입문",
    subtitle: "AI 리터러시 & 기초 엔지니어링",
    description: "연천 청소년센터에서 AI 모델 구동 이론 및 블록 코딩, 로보틱스 기초를 융합한 총 40시간의 집중 전문 교육 이수 시작.",
    category: "expert",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "f2",
    date: "2026-04",
    title: "교수설계 및 마이크로 티칭",
    subtitle: "강의 교재 개발 및 실전 모의 수업",
    description: "초중고 발달단계에 맞는 인공지능 윤리, 프롬프트 엔지니어링 수업안을 직접 기획하고 실전 시뮬레이션 및 심층 동료 피드백 수행.",
    category: "expert",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "f3",
    date: "2026-05",
    title: "관내 초등학교 시범 출강",
    subtitle: "찾아가는 코딩 & 생성형 미술 교실",
    description: "연천초, 전곡초 학생을 대상으로 인공지능 원리를 활용한 맞춤형 자율 창의 교실을 운영하여 교육 현장 적용 가능성 전격 입증.",
    category: "school",
    imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "f4",
    date: "2026-06",
    title: "청소년 센터 AI 메이커 캠프",
    subtitle: "피지컬 컴퓨팅으로 그리는 스마트 시티",
    description: "연천 청소년수련관과 협력하여 2박 3일 융합 캠프 진행. 마이크로비트와 기계학습 센서들을 활용한 친환경 도시 모델 프로젝트 멘토링 주도.",
    category: "camp",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600"
  }
];

export const INITIAL_SHOWCASE: InstructorActivity[] = [
  {
    id: "s1",
    title: "생성형 AI 챗봇 만들기 & 윤리 교육",
    instructorName: "이정훈 강사",
    description: "학생들이 학교의 급식 메뉴나 동아리를 안내하는 지능형 챗봇을 직접 구현하며 거대언어모델(LLM)의 작동 원리와 악용 방지 윤리를 함께 배우는 명품 수업입니다.",
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=600",
    tags: ["ChatGPT", "API 융합", "인공지능 윤리", "중고교 강좌"],
    date: "2026-07-01"
  },
  {
    id: "s2",
    title: "엔트리 모션 감지 기반 피지컬 헬스케어 게임",
    instructorName: "김미경 강사",
    description: "카메라 모션 추적 AI 센서와 브레드보드 자이로 센서를 연동해, 청소년들이 스스로 스트레칭 및 민첩성을 기르는 인터랙티브 체육 게임을 코딩하는 융합 수업을 개발했습니다.",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600",
    tags: ["엔트리", "비디오인식", "피지컬 컴퓨팅", "초등융합"],
    date: "2026-07-08"
  },
  {
    id: "s3",
    title: "티처블 머신을 적용한 스마트 친환경 분류기",
    instructorName: "최영민 강사",
    description: "카메라에 비친 재활용품을 플라스틱, 캔, 유리로 자동 판별하는 머신러닝 지도학습 분류기를 함께 훈련시키고 실물 서보모터 휴지통을 제어하는 고주파 몰입 학습입니다.",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600",
    tags: ["티처블머신", "머신러닝", "스마트그린", "자유학기제"],
    date: "2026-07-12"
  }
];

export const INITIAL_RESOURCES: SharedResource[] = [
  {
    id: "r1",
    title: "2026년 하반기 생성형 AI 활용 창의 수업지도안 (초등 중급)",
    category: "syllabus",
    description: "이미지 생성 도구와 텍스트 프롬프트를 융합하여 교과 융합(미술, 국어) 4차시로 바로 사용 가능한 교사 매뉴얼 및 활동지 포함본.",
    fileName: "2026_Y_AI_Elementary_Plan.pdf",
    fileSize: "4.8 MB",
    author: "박성호 교육팀장",
    uploadedAt: "2026-07-02",
    downloads: 32
  },
  {
    id: "r2",
    title: "마이크로비트 스마트 그린홈 제어용 허브 라이브러리",
    category: "software",
    description: "토양수분 센서, 워터펌프, RGB LED를 결합한 사물인터넷 실습을 엔트리 블록에서 원활히 제어할 수 있도록 튜닝한 하드웨어 HEX 코드 모음.",
    fileName: "Microbit_SmartGreenHome_V1.1.zip",
    fileSize: "14.2 MB",
    author: "한승우 연구원",
    uploadedAt: "2026-07-09",
    downloads: 18
  },
  {
    id: "r3",
    title: "인공지능과 지식재산권, 편향성 극복 토론식 PPT 템플릿",
    category: "slide",
    description: "학교 방문 진로 특강이나 인공지능 관련 리터러시 토크 콘서트에서 바로 활용 가능한 고해상도 프리젠테이션 슬라이드 및 시나리오 스크립트.",
    fileName: "AI_Ethics_Discussion_Template.pptx",
    fileSize: "9.6 MB",
    author: "김지윤 부장강사",
    uploadedAt: "2026-07-14",
    downloads: 27
  },
  {
    id: "r4",
    title: "청소년 자율주행 모빌리티 자율학기제 12차시 커리큘럼",
    category: "guide",
    description: "카메라 자율주행 로봇 차량 구동 실습 교구 연계용 장기 커리큘럼 설계도 및 학생 평가 루브릭 양식.",
    fileName: "Autonomous_Mobility_12Weeks.pdf",
    fileSize: "7.1 MB",
    author: "강사협회 위원회",
    uploadedAt: "2026-07-16",
    downloads: 11
  }
];

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: "n1",
    title: "📢 [공지] 2026년도 하반기 연천 관내 초/중/고등학교 출강 파견 신청 안내",
    content: "안녕하세요. 연천 AI 교육 전문가 협의회 사무국입니다. 다가오는 2학기를 맞아 관내 초중고교를 대상으로 '찾아가는 인공지능 자율 탐구 캠프' 및 '정규 교과 연계 디지털 교실' 강사 파견 신청을 상시 접수받고 있습니다. 홈페이지 상단의 [교육상담 & 신청] 메뉴에서 간편하게 예약해 주시면 담당자가 기획 예산 및 커리큘럼 협의 전화를 즉시 드립니다. 많은 관심과 성원 부탁드립니다.",
    author: "관리자",
    date: "2026-07-10",
    views: 145,
    isImportant: true
  },
  {
    id: "n2",
    title: "🗓️ [세미나] 제 1기 강사진 핵심 교수법 역량 강화 심화 세미나 개최 안내 (8월 5일)",
    content: "연천의 우수한 교육 퀄리티 향상을 위하여, 1기 강사진 전원을 대상으로 하는 오프라인 보수 세미나가 8월 5일 오후 2시 연천 청소년센터 대회의실에서 진행됩니다. 최신 피지컬 IoT 신규 키트 실습 설명회 및 신임 교육 모델 평가 제도가 소개될 예정이오니 한 분도 빠짐없이 참석해 주시기 바랍니다.",
    author: "관리자",
    date: "2026-07-15",
    views: 68,
    isImportant: false
  },
  {
    id: "n3",
    title: "✨ 1기 정강사 인증 완료 공지 및 강사방 전용 권한 안내",
    content: "전문가 양성과정을 정식으로 수료하신 1기 강사분들의 회원 정보 업데이트가 진행 중입니다. 회원가입 시 '강사 회원'으로 가입해 두시면, 관리자가 확인 후 '정강사 권한'으로 승인 처리를 해 드립니다. 승인 완료된 강사분들은 홈페이지 상단의 [강사실/자료실] 탭에 입장하여 최신 교안, 소프트웨어 가이드라인 등의 첨부 파일을 무제한 다운로드하고 수업계획표 공유가 가능하오니 꼭 가입해 주시기 바랍니다.",
    author: "관리자",
    date: "2026-07-16",
    views: 52,
    isImportant: true
  }
];

export const INITIAL_PAST_RECORDS: any[] = [
  {
    id: "p1",
    organizationName: "전곡초등학교",
    instructorName: "김은혜 강사",
    courseName: "인공지능 리터러시 & 생성형 AI 챗봇 교실",
    completionDate: "2026-05-18",
    studentCount: 22,
    hours: 8,
    contentSummary: "생성형 AI의 가치와 위험성을 이해하고, ChatGPT 및 엔트리를 결합해 학교 안내용 인공지능 챗봇을 설계하는 실습형 교육 완수."
  },
  {
    id: "p2",
    organizationName: "연천중학교",
    instructorName: "이정훈 강사",
    courseName: "머신러닝 비디오 센서 기반 자율주행 교구 융합 교실",
    completionDate: "2026-06-05",
    studentCount: 18,
    hours: 12,
    contentSummary: "구글 티처블 머신과 자율주행 하드웨어 교구를 차선 추적 알고리즘과 결합하여 피지컬 스마트 홈 및 모빌리티 설계 교육 이수 완료."
  },
  {
    id: "p3",
    organizationName: "백학중학교",
    instructorName: "최영민 강사",
    courseName: "마이크로비트 스마트 환경 센서 및 친환경 헬스케어 키트 메이커",
    completionDate: "2026-06-20",
    studentCount: 15,
    hours: 10,
    contentSummary: "마이크로비트 온도 센서와 서보 모터를 활용한 스마트 분리수거 제어기 및 청소년 자세 교정용 웨어러블 알림 장치 제작 완료."
  }
];

