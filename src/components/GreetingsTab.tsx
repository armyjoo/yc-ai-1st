import React, { useState } from 'react';
import { GreetingContent, User } from '../types';
import { Edit3, Check, RefreshCw, BookOpen, Target, Sparkles, Eye } from 'lucide-react';

interface GreetingsTabProps {
  currentUser: User | null;
  greetingContent: GreetingContent;
  onUpdateGreetings: (updated: GreetingContent) => void;
  onResetGreetings: () => void;
}

export const GreetingsTab: React.FC<GreetingsTabProps> = ({
  currentUser,
  greetingContent,
  onUpdateGreetings,
  onResetGreetings,
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<GreetingContent>({ ...greetingContent });

  // Sync state if greetingContent changes externally
  React.useEffect(() => {
    setEditForm({ ...greetingContent });
  }, [greetingContent]);

  const handleSave = () => {
    onUpdateGreetings(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({ ...greetingContent });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Admin Quick Controller */}
      {isAdmin && (
        <div className="p-4 bg-slate-50 border border-brand/20 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
            <span className="text-sm font-semibold">관리자 제어모드 활성화: 인사말 및 개설취지 수정 권한이 있습니다.</span>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  저장하기
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-lg transition"
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-brand hover:bg-brand-hover rounded-lg shadow-sm transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  텍스트 실시간 편집
                </button>
                <button
                  onClick={onResetGreetings}
                  className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-xs transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  기초데이터 리셋
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Two Column Layout: Introduction & Greetings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Homepage opening mission */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-8 rounded-3xl shadow-brand/5 relative overflow-hidden group">
            {/* Top Cyan Glowing Corner Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand via-accent to-brand"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 text-brand rounded-2xl group-hover:bg-blue-100 transition duration-300">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-orbitron font-bold tracking-wider text-brand">VISION & MISSION</span>
                <h3 className="text-xl font-bold text-slate-900">홈페이지 개설 취지</h3>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">소개 제목</label>
                  <input
                    type="text"
                    value={editForm.introTitle}
                    onChange={(e) => setEditForm({ ...editForm, introTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">소개 부제목</label>
                  <input
                    type="text"
                    value={editForm.introSubtitle}
                    onChange={(e) => setEditForm({ ...editForm, introSubtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">소개 세부 내용</label>
                  <textarea
                    rows={8}
                    value={editForm.introContent}
                    onChange={(e) => setEditForm({ ...editForm, introContent: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand text-sm leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center justify-between">
                    <span>대표 이미지 URL (양성 모습/교육 현장)</span>
                    <span className="text-[10px] text-brand font-medium">컴퓨터 사진 첨부 가능</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editForm.introImageUrl || ''}
                      onChange={(e) => setEditForm({ ...editForm, introImageUrl: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
                    />
                    <label className="cursor-pointer px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-250 transition-all flex items-center gap-1 shrink-0">
                      파일 찾기
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setEditForm({ ...editForm, introImageUrl: reader.result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">양성 기수 텍스트</label>
                    <input
                      type="text"
                      value={editForm.graduatesCountText || ''}
                      onChange={(e) => setEditForm({ ...editForm, graduatesCountText: e.target.value })}
                      placeholder="1ST GRADUATES"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">활동 지역 텍스트</label>
                    <input
                      type="text"
                      value={editForm.activeRegionText || ''}
                      onChange={(e) => setEditForm({ ...editForm, activeRegionText: e.target.value })}
                      placeholder="경기도 연천군"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand text-sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <h4 className="text-2xl font-extrabold text-slate-900 leading-snug tracking-tight">
                  {greetingContent.introTitle}
                </h4>
                <div className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-xs font-bold text-slate-700">
                  {greetingContent.introSubtitle}
                </div>

                {greetingContent.introImageUrl && (
                  <div className="my-3 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                    <img 
                      src={greetingContent.introImageUrl} 
                      alt="연천 AI 교육 전문가 과정" 
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {greetingContent.introContent}
                </p>

                {/* Cyber style specs block */}
                <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs text-slate-400 font-bold block mb-1">양성 기수</span>
                    <span className="font-orbitron font-extrabold text-lg text-brand">
                      {greetingContent.graduatesCountText || '1ST GRADUATES'}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs text-slate-400 font-bold block mb-1">활동 지역</span>
                    <span className="font-sans font-extrabold text-lg text-slate-800">
                      {greetingContent.activeRegionText || '경기도 연천군'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Info Promo Card */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 border border-white/5 shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(#0066FF_1px,transparent_1px)] opacity-10 [background-size:12px_12px]"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-xs font-orbitron font-bold tracking-widest">AIEP ADVANTAGE</span>
              </div>
              <h4 className="text-lg font-bold text-white">연천 AI 1기 강사진의 특별함</h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✔</span>
                  <span>단순 이론을 넘어 엔트리 코딩과 피지컬 아두이노 키트를 즉각 연계하는 하이브리드 수업 설계</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✔</span>
                  <span>생성형 AI 기초 리터러시, 딥페이크 등 인공지능 윤리 교육 커리큘럼 자체 개발 및 보유</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✔</span>
                  <span>연천 청소년들의 정서적 배경을 완벽히 이해하고 밀착 지원하는 우리 지역 맞춤 전문가단</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Greetings (Our educator greetings) */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-8 sm:p-10 rounded-3xl shadow-xl relative group">
            {/* Top Brand Glowing Corner Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent via-brand to-accent"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 text-brand rounded-2xl group-hover:bg-blue-100 transition duration-300">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-orbitron font-bold tracking-wider text-brand">PRESIDENT GREETINGS</span>
                <h3 className="text-xl font-bold text-slate-900">지역 인재 육성 인사말</h3>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">인사말 제목</label>
                  <input
                    type="text"
                    value={editForm.greetingTitle}
                    onChange={(e) => setEditForm({ ...editForm, greetingTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">인사말 부제목</label>
                  <input
                    type="text"
                    value={editForm.greetingSubtitle}
                    onChange={(e) => setEditForm({ ...editForm, greetingSubtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">인사말 상세 본문</label>
                  <textarea
                    rows={12}
                    value={editForm.greetingContent}
                    onChange={(e) => setEditForm({ ...editForm, greetingContent: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand text-sm leading-relaxed"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">작성자 성명</label>
                    <input
                      type="text"
                      value={editForm.greetingAuthor}
                      onChange={(e) => setEditForm({ ...editForm, greetingAuthor: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">작성자 소속/직함</label>
                    <input
                      type="text"
                      value={editForm.greetingAuthorRole}
                      onChange={(e) => setEditForm({ ...editForm, greetingAuthorRole: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand text-sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h4 className="text-2xl font-extrabold text-slate-900 leading-snug tracking-tight">
                  "{greetingContent.greetingTitle}"
                </h4>
                <p className="text-brand font-semibold text-sm">
                  {greetingContent.greetingSubtitle}
                </p>
                <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-sans space-y-4">
                  {greetingContent.greetingContent}
                </div>

                {/* Elegant Signature Block */}
                <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/60 p-6 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand to-accent flex items-center justify-center text-white font-bold text-sm shadow-md">
                      YAI
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400 font-bold">WRITER</span>
                      <span className="font-extrabold text-slate-950 text-sm">{greetingContent.greetingAuthor}</span>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="text-[10px] uppercase font-orbitron tracking-wider text-slate-400 font-bold block mb-0.5">Affiliation</span>
                    <span className="text-xs font-bold text-slate-600 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-2xs">
                      {greetingContent.greetingAuthorRole}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
