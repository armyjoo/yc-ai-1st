import React, { useState } from 'react';
import { Cpu, Sparkles, ArrowRight, BookOpen, Users, Calendar, MessageSquare, Zap, Target, CheckCircle2, ChevronRight, HelpCircle, Edit3, Check, X } from 'lucide-react';
import { User, InstructorActivity, FootprintItem, HomeContent } from '../types';

interface HomeTabProps {
  currentUser: User | null;
  activities: InstructorActivity[];
  footprints: FootprintItem[];
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  homeContent: HomeContent;
  onUpdateHomeContent: (content: HomeContent) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  currentUser,
  activities,
  footprints,
  setActiveTab,
  onOpenAuth,
  homeContent,
  onUpdateHomeContent,
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<HomeContent>({ ...homeContent });

  React.useEffect(() => {
    setEditForm({ ...homeContent });
  }, [homeContent]);

  const handleSave = () => {
    onUpdateHomeContent(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({ ...homeContent });
    setIsEditing(false);
  };

  // Curiosity Interaction 1: Smart Curriculum Finder state
  const [studentLevel, setStudentLevel] = useState<string>('');
  const [interestArea, setInterestArea] = useState<string>('');
  const [recommendation, setRecommendation] = useState<{
    title: string;
    description: string;
    matchRate: number;
    activityId?: string;
  } | null>(null);

  // Curiosity Interaction 2: Interactive AI Education Quiz
  const [quizStep, setQuizStep] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizResult, setQuizResult] = useState<string>('');

  const handleFindCurriculum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentLevel || !interestArea) {
      alert('대상 연령과 관심 분야를 선택해주세요!');
      return;
    }

    // Dynamic search over real activities first, or smart procedural fallback
    const matched = activities.find(act => 
      act.tags.some(tag => tag.includes(studentLevel) || tag.includes(interestArea)) ||
      act.description.includes(studentLevel) || act.description.includes(interestArea)
    );

    if (matched) {
      setRecommendation({
        title: matched.title,
        description: `${matched.instructorName} 강사님의 대표작으로, ${studentLevel} 학생들의 눈높이에 맞춘 ${interestArea} 융합 실습 위주의 커리큘럼입니다.`,
        matchRate: 98,
        activityId: matched.id
      });
    } else {
      // Procedural generation of a match to pique curiosity
      setRecommendation({
        title: `연천 1기 맞춤형 [${studentLevel} 대상 ${interestArea} 메이커 클래스]`,
        description: `연천 AI 교육 전문가 강사진이 즉시 맞춤 설계할 수 있는 프로그램입니다. 현재 지역 학교들과 연계하여 ${interestArea} 교구 및 생성형 AI 도구를 활용한 창의 수업이 성황리에 협의 중입니다.`,
        matchRate: 95
      });
    }
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    const nextScore = isCorrect ? quizScore + 1 : quizScore;
    setQuizScore(nextScore);
    
    if (quizStep < 2) {
      setQuizStep(quizStep + 1);
    } else {
      // Finished
      let evaluation = '';
      const finalScore = nextScore;
      if (finalScore === 3) {
        evaluation = 'AI 교육 스페셜리스트급 지식! 우리 아이들과 지역 청소년들에게 미래 기술을 불어넣을 최고의 자질을 갖고 계십니다. 연천 AI 1기 강사진과의 협력이나 교육 신청을 즉시 진행해보세요.';
      } else if (finalScore === 2) {
        evaluation = '훌륭한 디지털 리터러시 역량! 조금 더 피지컬 컴퓨팅과 생성형 AI 융합 수업 사례를 둘러보시면 트렌드를 선도하실 수 있습니다. 강사 갤러리를 구경해보세요.';
      } else {
        evaluation = '새로운 신기술 교육에 대한 호기심 가득! 연천 AI 교육 전문가 통합 플랫폼에서 제공하는 우수 수업 설계와 발자취를 통해 누구나 손쉽게 AI 교육 전문가로 거듭날 수 있습니다.';
      }
      setQuizResult(evaluation);
      setQuizStep(3); // Result step
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizScore(0);
    setQuizResult('');
  };

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      {/* Admin Quick Controller */}
      {isAdmin && (
        <div className="p-4 bg-white border border-brand/20 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
            <span className="text-xs font-semibold">관리자 제어모드 활성화: 메인페이지 홍보 문구 수정 권한이 있습니다.</span>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  저장하기
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                >
                  취소
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-brand hover:bg-brand/90 rounded-lg shadow-sm transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                메인 문구 직접 수정하기
              </button>
            )}
          </div>
        </div>
      )}

      {/* 1. Hero Dynamic Promotional Banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl overflow-hidden p-8 sm:p-12 md:p-16 text-white border border-blue-500/25 shadow-2xl">
        {/* Neon decorative glow spots */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl"></div>
        
        {/* Tech Grid Overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,102,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,102,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {isEditing ? (
            <div className="space-y-4 text-left max-w-2xl mx-auto bg-black/50 p-6 rounded-2xl border border-white/10 backdrop-blur-md max-h-[70vh] overflow-y-auto">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider border-b border-white/10 pb-1.5 flex items-center justify-between">
                <span>🖥️ 메인 홈페이지 콘텐츠 통합 직접 편집기</span>
                <span className="text-[9px] text-slate-400 font-normal">관리자 전용 실시간 반영</span>
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">상단 영문 태그라인</label>
                  <input
                    type="text"
                    value={editForm.heroTagline}
                    onChange={(e) => setEditForm({ ...editForm, heroTagline: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-800 text-white border border-white/20 rounded-lg text-xs focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">하단 푸터 영역 설명</label>
                  <input
                    type="text"
                    value={editForm.footerDescription || ''}
                    onChange={(e) => setEditForm({ ...editForm, footerDescription: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-800 text-white border border-white/20 rounded-lg text-xs focus:outline-none focus:border-brand"
                    placeholder="하단 로고명 아래 표시되는 소개 문구"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1">홍보용 메인 헤드라인 타이틀</label>
                <input
                  type="text"
                  value={editForm.heroTitle}
                  onChange={(e) => setEditForm({ ...editForm, heroTitle: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-800 text-white border border-white/20 rounded-lg text-xs focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1">홍보용 설명 단락 (Curiosity 유발 소개)</label>
                <textarea
                  value={editForm.heroDescription}
                  onChange={(e) => setEditForm({ ...editForm, heroDescription: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-1.5 bg-slate-800 text-white border border-white/20 rounded-lg text-xs focus:outline-none focus:border-brand"
                />
              </div>

              <div className="border-t border-white/10 pt-3 space-y-3">
                <span className="block text-[10px] font-bold text-cyan-300">💡 3대 핵심 경쟁력 카드 문구 편집</span>
                
                <div className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] font-bold text-slate-400">첫 번째 경쟁력 카드</span>
                  <input
                    type="text"
                    value={editForm.feature1Title || ''}
                    onChange={(e) => setEditForm({ ...editForm, feature1Title: e.target.value })}
                    placeholder="카드 1 제목"
                    className="w-full px-3 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-xs focus:outline-none"
                  />
                  <textarea
                    value={editForm.feature1Desc || ''}
                    onChange={(e) => setEditForm({ ...editForm, feature1Desc: e.target.value })}
                    placeholder="카드 1 상세 설명"
                    rows={2}
                    className="w-full px-3 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] font-bold text-slate-400">두 번째 경쟁력 카드</span>
                  <input
                    type="text"
                    value={editForm.feature2Title || ''}
                    onChange={(e) => setEditForm({ ...editForm, feature2Title: e.target.value })}
                    placeholder="카드 2 제목"
                    className="w-full px-3 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-xs focus:outline-none"
                  />
                  <textarea
                    value={editForm.feature2Desc || ''}
                    onChange={(e) => setEditForm({ ...editForm, feature2Desc: e.target.value })}
                    placeholder="카드 2 상세 설명"
                    rows={2}
                    className="w-full px-3 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] font-bold text-slate-400">세 번째 경쟁력 카드</span>
                  <input
                    type="text"
                    value={editForm.feature3Title || ''}
                    onChange={(e) => setEditForm({ ...editForm, feature3Title: e.target.value })}
                    placeholder="카드 3 제목"
                    className="w-full px-3 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-xs focus:outline-none"
                  />
                  <textarea
                    value={editForm.feature3Desc || ''}
                    onChange={(e) => setEditForm({ ...editForm, feature3Desc: e.target.value })}
                    placeholder="카드 3 상세 설명"
                    rows={2}
                    className="w-full px-3 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 space-y-3">
                <span className="block text-[10px] font-bold text-cyan-300">📞 하단 푸터 연락처 정보 편집 (Contact Info)</span>
                
                <div className="grid grid-cols-1 gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 mb-1">교육 행정실/문화센터 주소</label>
                    <input
                      type="text"
                      value={editForm.contactAddress || ''}
                      onChange={(e) => setEditForm({ ...editForm, contactAddress: e.target.value })}
                      placeholder="경기도 연천군 전곡읍 평화로 연천 청소년문화센터 3층"
                      className="w-full px-3 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 mb-1">전화번호</label>
                      <input
                        type="text"
                        value={editForm.contactPhone || ''}
                        onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })}
                        placeholder="031-839-XXXX (연천군청 지능디지털교육과 행정실)"
                        className="w-full px-3 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 mb-1">이메일 주소</label>
                      <input
                        type="text"
                        value={editForm.contactEmail || ''}
                        onChange={(e) => setEditForm({ ...editForm, contactEmail: e.target.value })}
                        placeholder="info@yeoncheon.ai"
                        className="w-full px-3 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 space-y-3">
                <span className="block text-[10px] font-bold text-cyan-300">🎯 AI 교구 추천 및 리터러시 퀴즈 편집</span>
                
                <div className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] font-bold text-slate-400">1. AI 교구 스마트 추천 구역</span>
                  <div>
                    <label className="block text-[9px] text-slate-400 mb-1">구역 타이틀</label>
                    <input
                      type="text"
                      value={editForm.recommendTitle || ''}
                      onChange={(e) => setEditForm({ ...editForm, recommendTitle: e.target.value })}
                      placeholder="연천 청소년들이 가장 열광할 AI 교구는 무엇일까요?"
                      className="w-full px-3 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 mb-1">구역 설명문</label>
                    <textarea
                      value={editForm.recommendDesc || ''}
                      onChange={(e) => setEditForm({ ...editForm, recommendDesc: e.target.value })}
                      placeholder="설명문구"
                      rows={2}
                      className="w-full px-3 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-white/5 pt-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 mb-1">대상 연령 선택 드롭다운 라벨</label>
                      <input
                        type="text"
                        value={editForm.recommendAgeLabel || ''}
                        onChange={(e) => setEditForm({ ...editForm, recommendAgeLabel: e.target.value })}
                        placeholder="대상 연령 선택"
                        className="w-full px-2 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-[10px] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 mb-1">매칭 분석 버튼 텍스트</label>
                      <input
                        type="text"
                        value={editForm.recommendBtnText || ''}
                        onChange={(e) => setEditForm({ ...editForm, recommendBtnText: e.target.value })}
                        placeholder="연천 AI 매칭 커리큘럼 분석하기"
                        className="w-full px-2 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-[10px] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 border-t border-white/5 pt-2">
                    <span className="block text-[9px] text-slate-400 font-bold">대상 연령 드롭다운 선택 항목 (4개)</span>
                    <input
                      type="text"
                      value={editForm.recommendAgeOpt1 || ''}
                      onChange={(e) => setEditForm({ ...editForm, recommendAgeOpt1: e.target.value })}
                      placeholder="항목 1"
                      className="w-full px-2 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-[10px] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={editForm.recommendAgeOpt2 || ''}
                      onChange={(e) => setEditForm({ ...editForm, recommendAgeOpt2: e.target.value })}
                      placeholder="항목 2"
                      className="w-full px-2 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-[10px] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={editForm.recommendAgeOpt3 || ''}
                      onChange={(e) => setEditForm({ ...editForm, recommendAgeOpt3: e.target.value })}
                      placeholder="항목 3"
                      className="w-full px-2 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-[10px] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={editForm.recommendAgeOpt4 || ''}
                      onChange={(e) => setEditForm({ ...editForm, recommendAgeOpt4: e.target.value })}
                      placeholder="항목 4"
                      className="w-full px-2 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-[10px] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5 border-t border-white/5 pt-2">
                    <span className="block text-[9px] text-slate-400 font-bold">희망 교육 카테고리 드롭다운 라벨 및 항목 (4개)</span>
                    <input
                      type="text"
                      value={editForm.recommendCategoryLabel || ''}
                      onChange={(e) => setEditForm({ ...editForm, recommendCategoryLabel: e.target.value })}
                      placeholder="희망 교육 카테고리"
                      className="w-full px-2 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-[10px] focus:outline-none mb-1"
                    />
                    <input
                      type="text"
                      value={editForm.recommendCategoryOpt1 || ''}
                      onChange={(e) => setEditForm({ ...editForm, recommendCategoryOpt1: e.target.value })}
                      placeholder="분야 1"
                      className="w-full px-2 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-[10px] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={editForm.recommendCategoryOpt2 || ''}
                      onChange={(e) => setEditForm({ ...editForm, recommendCategoryOpt2: e.target.value })}
                      placeholder="분야 2"
                      className="w-full px-2 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-[10px] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={editForm.recommendCategoryOpt3 || ''}
                      onChange={(e) => setEditForm({ ...editForm, recommendCategoryOpt3: e.target.value })}
                      placeholder="분야 3"
                      className="w-full px-2 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-[10px] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={editForm.recommendCategoryOpt4 || ''}
                      onChange={(e) => setEditForm({ ...editForm, recommendCategoryOpt4: e.target.value })}
                      placeholder="분야 4"
                      className="w-full px-2 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-[10px] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] font-bold text-slate-400">2. 나의 AI 디지털 리터러시 지수 퀴즈 구역</span>
                  <div>
                    <label className="block text-[9px] text-slate-400 mb-1">퀴즈 구역 타이틀</label>
                    <input
                      type="text"
                      value={editForm.quizTitle || ''}
                      onChange={(e) => setEditForm({ ...editForm, quizTitle: e.target.value })}
                      placeholder="나의 AI 디지털 리터러시 지수는?"
                      className="w-full px-3 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 mb-1">퀴즈 구역 설명문</label>
                    <textarea
                      value={editForm.quizDesc || ''}
                      onChange={(e) => setEditForm({ ...editForm, quizDesc: e.target.value })}
                      placeholder="퀴즈 구역 설명문구"
                      rows={2}
                      className="w-full px-3 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-xs focus:outline-none"
                    />
                  </div>

                  <div className="border-t border-white/10 pt-2 space-y-2">
                    <span className="text-[9px] font-bold text-cyan-300">Q1 퀴즈 문항 설정 (①번이 무조건 정답이 됩니다)</span>
                    <input
                      type="text"
                      value={editForm.quizQ1Text || ''}
                      onChange={(e) => setEditForm({ ...editForm, quizQ1Text: e.target.value })}
                      placeholder="Q1 질문"
                      className="w-full px-3 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-xs focus:outline-none"
                    />
                    <div className="grid grid-cols-3 gap-1">
                      <input
                        type="text"
                        value={editForm.quizQ1Correct || ''}
                        onChange={(e) => setEditForm({ ...editForm, quizQ1Correct: e.target.value })}
                        placeholder="정답 ①"
                        className="px-2 py-1 bg-emerald-950/40 text-white border border-emerald-500/30 rounded-lg text-[10px] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={editForm.quizQ1Wrong1 || ''}
                        onChange={(e) => setEditForm({ ...editForm, quizQ1Wrong1: e.target.value })}
                        placeholder="오답 ②"
                        className="px-2 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-[10px] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={editForm.quizQ1Wrong2 || ''}
                        onChange={(e) => setEditForm({ ...editForm, quizQ1Wrong2: e.target.value })}
                        placeholder="오답 ③"
                        className="px-2 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-[10px] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-2 space-y-2">
                    <span className="text-[9px] font-bold text-cyan-300">Q2 퀴즈 문항 설정 (②번이 무조건 정답이 됩니다)</span>
                    <input
                      type="text"
                      value={editForm.quizQ2Text || ''}
                      onChange={(e) => setEditForm({ ...editForm, quizQ2Text: e.target.value })}
                      placeholder="Q2 질문"
                      className="w-full px-3 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-xs focus:outline-none"
                    />
                    <div className="grid grid-cols-3 gap-1">
                      <input
                        type="text"
                        value={editForm.quizQ2Wrong1 || ''}
                        onChange={(e) => setEditForm({ ...editForm, quizQ2Wrong1: e.target.value })}
                        placeholder="오답 ①"
                        className="px-2 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-[10px] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={editForm.quizQ2Correct || ''}
                        onChange={(e) => setEditForm({ ...editForm, quizQ2Correct: e.target.value })}
                        placeholder="정답 ②"
                        className="px-2 py-1 bg-emerald-950/40 text-white border border-emerald-500/30 rounded-lg text-[10px] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={editForm.quizQ2Wrong2 || ''}
                        onChange={(e) => setEditForm({ ...editForm, quizQ2Wrong2: e.target.value })}
                        placeholder="오답 ③"
                        className="px-2 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-[10px] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-2 space-y-2">
                    <span className="text-[9px] font-bold text-cyan-300">Q3 퀴즈 문항 설정 (①번이 무조건 정답이 됩니다)</span>
                    <input
                      type="text"
                      value={editForm.quizQ3Text || ''}
                      onChange={(e) => setEditForm({ ...editForm, quizQ3Text: e.target.value })}
                      placeholder="Q3 질문"
                      className="w-full px-3 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-xs focus:outline-none"
                    />
                    <div className="grid grid-cols-3 gap-1">
                      <input
                        type="text"
                        value={editForm.quizQ3Correct || ''}
                        onChange={(e) => setEditForm({ ...editForm, quizQ3Correct: e.target.value })}
                        placeholder="정답 ①"
                        className="px-2 py-1 bg-emerald-950/40 text-white border border-emerald-500/30 rounded-lg text-[10px] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={editForm.quizQ3Wrong1 || ''}
                        onChange={(e) => setEditForm({ ...editForm, quizQ3Wrong1: e.target.value })}
                        placeholder="오답 ②"
                        className="px-2 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-[10px] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={editForm.quizQ3Wrong2 || ''}
                        onChange={(e) => setEditForm({ ...editForm, quizQ3Wrong2: e.target.value })}
                        placeholder="오답 ③"
                        className="px-2 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-[10px] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-2 space-y-2">
                    <span className="text-[9px] font-bold text-cyan-300">퀴즈 구역 하단 푸터 슬로건 설정</span>
                    <input
                      type="text"
                      value={editForm.quizFooterText || ''}
                      onChange={(e) => setEditForm({ ...editForm, quizFooterText: e.target.value })}
                      placeholder="쉽고 유익한 AI 교육 트렌드, 연천 AI 통합 플랫폼이 선도합니다."
                      className="w-full px-3 py-1 bg-slate-800 text-white border border-white/15 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/15 border border-blue-500/30 rounded-full text-xs font-bold text-cyan-300 tracking-wider uppercase animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                {homeContent.heroTagline}
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300">
                  {homeContent.heroTitle}
                </span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
                {homeContent.heroDescription}
              </p>
            </>
          )}

          <div className="pt-4 flex flex-wrap justify-center gap-3.5">
            <button
              onClick={() => setActiveTab('showcase')}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 transition-all flex items-center gap-2 group text-sm"
            >
              우수 커리큘럼 갤러리 둘러보기
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => setActiveTab('application')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl border border-white/20 transition-all text-sm"
            >
              출강 문의 및 교육 신청
            </button>
          </div>
        </div>

        {/* Dynamic Key metrics */}
        <div className="relative z-10 mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8 border-t border-white/15">
          <div className="text-center">
            <span className="block text-2xl sm:text-3xl font-extrabold text-cyan-300 font-orbitron">100%</span>
            <span className="text-[11px] text-slate-400 font-medium">연천군 공인 및 검증 완료</span>
          </div>
          <div className="text-center border-l border-white/10">
            <span className="block text-2xl sm:text-3xl font-extrabold text-cyan-300 font-orbitron">{activities.length}+개</span>
            <span className="text-[11px] text-slate-400 font-medium">독창적 AI 융합 수업안</span>
          </div>
          <div className="text-center border-l border-white/10 col-span-1">
            <span className="block text-2xl sm:text-3xl font-extrabold text-cyan-300 font-orbitron">{footprints.length}+회</span>
            <span className="text-[11px] text-slate-400 font-medium">현장 연수 및 워크숍 누적</span>
          </div>
          <div className="text-center border-l border-white/10">
            <span className="block text-2xl sm:text-3xl font-extrabold text-cyan-300 font-orbitron">REALTIME</span>
            <span className="text-[11px] text-slate-400 font-medium">강사진 정보 실시간 매칭</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Section 1: "Curiosity trigger" - AI Smart Curriculum Recommendation (궁금증 유발 맞춤 매칭) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-150 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold mb-3 border border-indigo-100">
              <Target className="w-3.5 h-3.5" />
              SMART RECOMMENDATION
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {homeContent.recommendTitle || "연천 청소년들이 가장 열광할 AI 교구는 무엇일까요?"}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {homeContent.recommendDesc || "아이들의 학교 급수와 관심 교과 카테고리를 선택해보세요. 연천 AI 1기 전문 강사단이 검증한 최적의 하이테크 피지컬 컴퓨팅 커리큘럼과 매칭 비율을 연산합니다."}
            </p>

            <form onSubmit={handleFindCurriculum} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">{homeContent.recommendAgeLabel || "대상 연령 선택"}</label>
                <select
                  value={studentLevel}
                  onChange={(e) => {
                    setStudentLevel(e.target.value);
                    setRecommendation(null);
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand"
                  required
                >
                  <option value="">-- 대상을 선택하세요 --</option>
                  <option value="초등">{homeContent.recommendAgeOpt1 || "초등학교 고학년 (엔트리/메이커)"}</option>
                  <option value="중등">{homeContent.recommendAgeOpt2 || "중학교 자유학기 (머신러닝/아두이노)"}</option>
                  <option value="고등">{homeContent.recommendAgeOpt3 || "고등학교 동아리 (파이썬/고급 인공지능)"}</option>
                  <option value="지역사회">{homeContent.recommendAgeOpt4 || "학부모 및 주민 (생활 AI/실무 리터러시)"}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">{homeContent.recommendCategoryLabel || "희망 교육 카테고리"}</label>
                <select
                  value={interestArea}
                  onChange={(e) => {
                    setInterestArea(e.target.value);
                    setRecommendation(null);
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand"
                  required
                >
                  <option value="">-- 기술 분야를 선택하세요 --</option>
                  <option value="자율주행">{homeContent.recommendCategoryOpt1 || "자율주행 코딩 & 스마트 모빌리티"}</option>
                  <option value="생성형 AI">{homeContent.recommendCategoryOpt2 || "생성형 AI 미디어아트 (챗GPT/달리)"}</option>
                  <option value="머신러닝">{homeContent.recommendCategoryOpt3 || "머신러닝 모델 학습 (티처블머신)"}</option>
                  <option value="사물인터넷">{homeContent.recommendCategoryOpt4 || "아두이노 IoT & 친환경 스마트팜"}</option>
                </select>
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-300" />
                  {homeContent.recommendBtnText || "연천 AI 매칭 커리큘럼 분석하기"}
                </button>
              </div>
            </form>
          </div>

          {/* Matches Result View */}
          {recommendation && (
            <div className="mt-6 p-4 bg-blue-50/60 rounded-2xl border border-blue-100/80 animate-fade-in space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">시스템 연산 추천 결과:</span>
                <span className="text-xs font-extrabold text-brand bg-white px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1 font-orbitron">
                  <Zap className="w-3 h-3 text-accent" />
                  MATCH RATE: {recommendation.matchRate}%
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                {recommendation.title}
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {recommendation.description}
              </p>
              <div className="pt-1 flex justify-end gap-2">
                {recommendation.activityId ? (
                  <button
                    onClick={() => setActiveTab('showcase')}
                    className="text-[10px] font-bold text-brand hover:underline flex items-center gap-0.5"
                  >
                    갤러리에서 실물 보기
                    <ChevronRight className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('application')}
                    className="text-[10px] font-bold text-brand hover:underline flex items-center gap-0.5"
                  >
                    이 주제로 바로 강의 의뢰하기
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Section 2: "Curiosity Quiz" - Digital & AI Education Aptitude Quiz (궁금증 유발 미니 퀴즈) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-150 shadow-xs flex flex-col justify-between relative overflow-hidden">
          {/* subtle decoration background */}
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-blue-500/5 blur-2xl pointer-events-none"></div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold mb-3 border border-emerald-100">
              <HelpCircle className="w-3.5 h-3.5" />
              AI EDUCATION APTITUDE QUIZ
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {homeContent.quizTitle || "나의 AI 디지털 리터러시 지수는?"}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {homeContent.quizDesc || "미래 기술 교육의 상식 및 상호작용 방식에 관한 3가지 간단한 퀴즈를 풀고 나의 역량 수치를 체크해보세요!"}
            </p>
          </div>

          <div className="my-6">
            {quizStep === 0 && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 font-medium">
                  <strong>Q1.</strong> {homeContent.quizQ1Text || "인공지능이 인간처럼 학습하도록 이미지를 보여주고 가르치는 가장 기초적인 구글의 노코드 도구 이름은?"}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => handleQuizAnswer(true)}
                    className="w-full text-left p-2.5 text-xs font-semibold rounded-lg border border-slate-200 hover:border-brand hover:bg-blue-50/20 text-slate-700 transition"
                  >
                    ① {homeContent.quizQ1Correct || "티처블 머신 (Teachable Machine)"}
                  </button>
                  <button
                    onClick={() => handleQuizAnswer(false)}
                    className="w-full text-left p-2.5 text-xs font-semibold rounded-lg border border-slate-200 hover:border-brand hover:bg-blue-50/20 text-slate-700 transition"
                  >
                    ② {homeContent.quizQ1Wrong1 || "알파고 크리에이터"}
                  </button>
                  <button
                    onClick={() => handleQuizAnswer(false)}
                    className="w-full text-left p-2.5 text-xs font-semibold rounded-lg border border-slate-200 hover:border-brand hover:bg-blue-50/20 text-slate-700 transition"
                  >
                    ③ {homeContent.quizQ1Wrong2 || "아두이노 실버웨어"}
                  </button>
                </div>
              </div>
            )}

            {quizStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 font-medium">
                  <strong>Q2.</strong> {homeContent.quizQ2Text || "초등학교 및 중학교 교구로 널리 쓰이며, 빛 센서, 가속도 센서, LED 스크린이 내장된 소형 피지컬 마이크로 프로세서 보드는?"}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => handleQuizAnswer(false)}
                    className="w-full text-left p-2.5 text-xs font-semibold rounded-lg border border-slate-200 hover:border-brand hover:bg-blue-50/20 text-slate-700 transition"
                  >
                    ① {homeContent.quizQ2Wrong1 || "인텔 코어 i7"}
                  </button>
                  <button
                    onClick={() => handleQuizAnswer(true)}
                    className="w-full text-left p-2.5 text-xs font-semibold rounded-lg border border-slate-200 hover:border-brand hover:bg-blue-50/20 text-slate-700 transition"
                  >
                    ② {homeContent.quizQ2Correct || "마이크로비트 (Micro:bit)"}
                  </button>
                  <button
                    onClick={() => handleQuizAnswer(false)}
                    className="w-full text-left p-2.5 text-xs font-semibold rounded-lg border border-slate-200 hover:border-brand hover:bg-blue-50/20 text-slate-700 transition"
                  >
                    ③ {homeContent.quizQ2Wrong2 || "라즈베리 아이스크림"}
                  </button>
                </div>
              </div>
            )}

            {quizStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 font-medium">
                  <strong>Q3.</strong> {homeContent.quizQ3Text || "2026년부터 초중고 교실에 순차적으로 전면 도입되는 맞춤형 개별화 코스웨어가 탑재된 미래형 교과서의 명칭은?"}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => handleQuizAnswer(true)}
                    className="w-full text-left p-2.5 text-xs font-semibold rounded-lg border border-slate-200 hover:border-brand hover:bg-blue-50/20 text-slate-700 transition"
                  >
                    ① {homeContent.quizQ3Correct || "AI 디지털교과서 (AIDT)"}
                  </button>
                  <button
                    onClick={() => handleQuizAnswer(false)}
                    className="w-full text-left p-2.5 text-xs font-semibold rounded-lg border border-slate-200 hover:border-brand hover:bg-blue-50/20 text-slate-700 transition"
                  >
                    ② {homeContent.quizQ3Wrong1 || "로봇 가상 교재"}
                  </button>
                  <button
                    onClick={() => handleQuizAnswer(false)}
                    className="w-full text-left p-2.5 text-xs font-semibold rounded-lg border border-slate-200 hover:border-brand hover:bg-blue-50/20 text-slate-700 transition"
                  >
                    ③ {homeContent.quizQ3Wrong2 || "자율주행 코딩페이퍼"}
                  </button>
                </div>
              </div>
            )}

            {quizStep === 3 && (
              <div className="space-y-4 animate-fade-in text-center py-2">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-sm font-extrabold text-slate-900">
                  퀴즈 진단 완료! 맞춘 개수: <span className="text-brand font-orbitron">{quizScore} / 3</span>개
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed px-2">
                  {quizResult}
                </p>
                <button
                  onClick={resetQuiz}
                  className="mt-2 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition"
                >
                  퀴즈 다시 풀기
                </button>
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-400 font-medium text-center border-t border-slate-100 pt-3">
            {homeContent.quizFooterText || "쉽고 유익한 AI 교육 트렌드, 연천 AI 통합 플랫폼이 선도합니다."}
          </div>
        </div>
      </div>

      {/* 3. Promotional Content Cards (플랫폼 특성 및 기능 중심 홍보 그리드) */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-xl font-bold text-slate-900">
            연천 AI 교육 전문가 플랫폼의 3대 핵심 경쟁력
          </h3>
          <p className="text-xs text-slate-500">
            우리 지역 교육 환경을 첨단 지능화 디지털 교실로 바꾸는 최고의 기술 인프라를 소개합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 hover:border-brand/30 transition-all shadow-xs space-y-4">
            <div className="w-10 h-10 bg-blue-50 text-brand rounded-xl flex items-center justify-center border border-blue-100">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">
              {homeContent.feature1Title || "1. 철저히 검증된 우리지역 맞춤 인재"}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {homeContent.feature1Desc || "연천 AI 교육 전문가 강사 양성과정을 최고 성적으로 이수한 1기 전문 강사단이 직접 연수, 출강, 맞춤 교재 개발까지 통합 케어합니다."}
            </p>
            <button
              onClick={() => setActiveTab('greetings')}
              className="text-[11px] font-bold text-brand hover:underline flex items-center gap-0.5"
            >
              개설 취지 및 인사말 보기
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 hover:border-brand/30 transition-all shadow-xs space-y-4">
            <div className="w-10 h-10 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center border border-cyan-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">
              {homeContent.feature2Title || "2. 현장에서 입증된 무결점 교재/교수안"}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {homeContent.feature2Desc || "단순 이론 교육을 탈피하여 실물 피지컬 센싱, 블록 코딩, 로봇 제어 등 학습자의 흥미와 참여를 극대화하는 검증된 커리큘럼입니다."}
            </p>
            <button
              onClick={() => setActiveTab('showcase')}
              className="text-[11px] font-bold text-brand hover:underline flex items-center gap-0.5"
            >
              우수 설계안 갤러리 가기
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 hover:border-brand/30 transition-all shadow-xs space-y-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">
              {homeContent.feature3Title || "3. 투명하고 간편한 온라인 매칭 시스템"}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {homeContent.feature3Desc || "각급 학교 교사, 공공기관 담당자, 마을 교육 활동가 누구나 클릭 몇 번만으로 맞춤 강의 계획 수립과 원클릭 강사 파견을 의뢰할 수 있습니다."}
            </p>
            <button
              onClick={() => setActiveTab('application')}
              className="text-[11px] font-bold text-brand hover:underline flex items-center gap-0.5"
            >
              온라인 원클릭 신청하기
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Latest dynamic feeds to build trust */}
      <div className="bg-[#F1F5F9]/50 rounded-2xl p-6 sm:p-8 border border-slate-200">
        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-brand animate-pulse" />
          통합 플랫폼 실시간 최근 소식
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-tight block mb-0.5">최신 발자취</span>
              <span className="font-semibold text-slate-800">
                {footprints.length > 0 ? footprints[0].title : '연천 AI 전문가 제1기 양성 프로그램'}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('footprints')}
              className="text-[11px] font-bold text-brand hover:underline shrink-0 ml-2"
            >
              자세히
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-extrabold text-cyan-600 uppercase tracking-tight block mb-0.5">우수 강의안</span>
              <span className="font-semibold text-slate-800">
                {activities.length > 0 ? activities[0].title : '마이크로비트 활용 스마트 세차'}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('showcase')}
              className="text-[11px] font-bold text-brand hover:underline shrink-0 ml-2"
            >
              자세히
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
