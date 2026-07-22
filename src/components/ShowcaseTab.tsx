import React, { useState } from 'react';
import { InstructorActivity, User } from '../types';
import { Award, Plus, Trash2, Edit, Calendar, User as UserIcon, BookOpen, Tag, X, Sparkles } from 'lucide-react';

interface ShowcaseTabProps {
  currentUser: User | null;
  activities: InstructorActivity[];
  onAddActivity: (newItem: Omit<InstructorActivity, 'id'>) => void;
  onUpdateActivity: (updatedItem: InstructorActivity) => void;
  onDeleteActivity: (id: string) => void;
}

export const ShowcaseTab: React.FC<ShowcaseTabProps> = ({
  currentUser,
  activities,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
}) => {
  // Both admin and approved instructors can manage resources/activities
  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'instructor';
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InstructorActivity | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<InstructorActivity | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [date, setDate] = useState('2026-07-16');

  const handleEditClick = (act: InstructorActivity) => {
    setEditingItem(act);
    setTitle(act.title);
    setInstructorName(act.instructorName);
    setDescription(act.description);
    setImageUrl(act.imageUrl);
    setTagsInput(act.tags.join(', '));
    setDate(act.date);
    setShowForm(true);
    // Scroll to form nicely
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setTitle('');
    setInstructorName('');
    setDescription('');
    setImageUrl('');
    setTagsInput('');
    setDate('2026-07-16');
    setShowForm(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !instructorName || !description) {
      alert('모든 필수 값을 입력해주세요.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const finalImageUrl = imageUrl.trim() || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600';

    if (editingItem) {
      // Edit Mode
      onUpdateActivity({
        ...editingItem,
        title,
        instructorName,
        description,
        imageUrl: finalImageUrl,
        tags,
        date,
      });
      alert('수업 설계/활동 자료가 성공적으로 수정되었습니다.');
    } else {
      // Add Mode
      onAddActivity({
        title,
        instructorName,
        description,
        imageUrl: finalImageUrl,
        tags,
        date,
      });
      alert('새로운 우수 수업설계/활동 자료가 등록되었습니다.');
    }

    // Reset fields
    handleCancel();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5.5 h-5.5 text-brand" />
            강사진 우수 수업 설계 & 활동 갤러리
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            연천 AI 교육 전문가 1기 수료생들의 창의적이고 검증된 강의 계획서 및 수업 실전 모습을 확인하고 편집할 수 있습니다.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => {
              if (showForm && editingItem) {
                // If currently editing, switch to clean add form
                setEditingItem(null);
                setTitle('');
                setInstructorName(currentUser?.name || '');
                setDescription('');
                setImageUrl('');
                setTagsInput('');
                setDate(new Date().toISOString().split('T')[0]);
              } else {
                setEditingItem(null);
                setTitle('');
                setInstructorName(currentUser?.name || '');
                setDescription('');
                setImageUrl('');
                setTagsInput('');
                setDate(new Date().toISOString().split('T')[0]);
                setShowForm(!showForm);
              }
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-hover rounded-xl shadow-md transition self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            우수 커리큘럼 등록
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {canManage && showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md border-2 border-brand/20 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-accent" />
              {editingItem ? '강사 활동 및 수업설계 편집 수정하기' : '새 AI 강의 커리큘럼 & 활동 등록하기'}
            </h4>
            <button
              type="button"
              onClick={handleCancel}
              className="p-1 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">수업 설계명 (메인 타이틀) *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 마이크로비트로 만드는 자율주행 스마트 세차기"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">담당 설계 강사명 *</label>
              <input
                type="text"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                placeholder="예: 최동훈 대표강사"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">설계 및 출강 날짜 *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">키워드 태그 (콤마 ','로 구분)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="예: 아두이노, 자율주행, 피지컬코딩, 중학교추천"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center justify-between">
                <span>대표 현장/교구 사진 URL</span>
                <span className="text-[10px] text-brand font-medium">내 컴퓨터 파일 선택 가능</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... 또는 컴퓨터에서 사진 선택"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
                />
                <label className="cursor-pointer px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-250 transition-all flex items-center gap-1 shrink-0">
                  <Plus className="w-3.5 h-3.5" />
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
                            setImageUrl(reader.result);
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">커리큘럼 상세 소개 및 수업 기대 효과 *</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 초등학교 고학년을 대상으로 하며, 자율주행 알고리즘을 물리 로봇 차종과 센서 연동을 통해 직관적으로 제어해보는 융합 계획안입니다."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-brand hover:bg-brand-hover rounded-lg shadow-sm transition"
            >
              {editingItem ? '수정 완료' : '게시 등록'}
            </button>
          </div>
        </form>
      )}

      {/* Grid Cards Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((act) => (
          <div
            key={act.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-brand/25 transition-all duration-300 flex flex-col h-full border border-slate-100"
          >
            {/* Image Wrapper with Scale Effect */}
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src={act.imageUrl}
                alt={act.title}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent"></div>
              
              {/* Floating Instructor Badge */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-extrabold text-brand shadow flex items-center gap-1">
                <UserIcon className="w-3 h-3" />
                {act.instructorName}
              </div>
            </div>

            {/* Card Content Area */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  {act.date}
                </div>
                
                <h4 className="text-base font-bold text-slate-900 leading-snug tracking-tight group-hover:text-brand transition duration-200 line-clamp-2">
                  {act.title}
                </h4>
                
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {act.description}
                </p>
              </div>

              {/* Tag Items and Button */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {act.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-brand border border-blue-100 flex items-center gap-0.5"
                    >
                      <Tag className="w-2 h-2 text-brand/60" />
                      {tag}
                    </span>
                  ))}
                  {act.tags.length > 3 && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-50 text-slate-400 border border-slate-100">
                      +{act.tags.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedActivity(act)}
                    className="flex-1 text-center py-2 text-xs font-semibold text-brand hover:text-white bg-blue-50/50 hover:bg-brand rounded-lg border border-blue-100 transition"
                  >
                    커리큘럼 상세 보기
                  </button>

                  {canManage && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(act)}
                        className="p-2 text-brand hover:text-white bg-blue-50 hover:bg-brand rounded-lg transition border border-blue-100"
                        title="자료 수정"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      
                      <button
                        onClick={() => {
                          if (confirm('이 강의 우수설계안 카드를 갤러리에서 영구히 삭제하시겠습니까?')) {
                            onDeleteActivity(act.id);
                          }
                        }}
                        className="p-2 text-red-500 hover:text-white bg-red-50 hover:bg-red-500 rounded-lg transition border border-red-100"
                        title="자료 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal Component */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-zoom-in">
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              <X className="w-5.5 h-5.5" />
            </button>

            {/* Modal Image Header */}
            <div className="relative h-60 w-full bg-slate-100">
              <img
                src={selectedActivity.imageUrl}
                alt={selectedActivity.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              
              <div className="absolute bottom-5 left-6 text-white pr-12">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] bg-accent/90 px-2.5 py-0.5 rounded text-blue-950 font-bold">
                    대표인증 교육안
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono">
                    설계일자: {selectedActivity.date}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {selectedActivity.title}
                </h3>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 space-y-6 text-slate-800">
              {/* Designer Card */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-150 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-brand font-bold flex items-center justify-center text-sm border border-blue-200">
                    {selectedActivity.instructorName.substring(0, 1) || '강'}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">DESIGNED BY</span>
                    <span className="font-extrabold text-sm text-slate-950">{selectedActivity.instructorName}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500 px-3 py-1 bg-white border border-slate-200 rounded-full">
                  연천 AI 1기 수료강사
                </span>
              </div>

              {/* Curriculum Overview */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-brand" />
                  교수안 개요 및 학습 연계 효과
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedActivity.description}
                </p>
              </div>

              {/* Core Syllabus Chapters (Removed per user requested: "차시별 교육내용이 자동으로 생성되는데 삭제해주고 표현되지 않도록 해줘") */}

              {/* Footer Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
                {selectedActivity.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action Close & Edit inside Modal */}
              <div className="flex justify-between items-center pt-2">
                <div>
                  {canManage && (
                    <button
                      onClick={() => {
                        const act = selectedActivity;
                        setSelectedActivity(null);
                        handleEditClick(act);
                      }}
                      className="px-4 py-2 bg-blue-50 text-brand hover:bg-brand hover:text-white rounded-xl text-xs font-bold border border-blue-100 transition flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      자료 수정하기
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition shadow"
                >
                  확인 및 모달 닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
