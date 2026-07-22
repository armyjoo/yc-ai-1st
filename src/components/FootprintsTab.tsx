import React, { useState } from 'react';
import { FootprintItem, User } from '../types';
import { Calendar, Plus, Trash2, SlidersHorizontal, Image as ImageIcon, MapPin, Sparkles, Edit3, Check, X } from 'lucide-react';

interface FootprintsTabProps {
  currentUser: User | null;
  footprints: FootprintItem[];
  onAddFootprint: (newItem: Omit<FootprintItem, 'id'>) => void;
  onUpdateFootprint: (updatedItem: FootprintItem) => void;
  onDeleteFootprint: (id: string) => void;
}

export const FootprintsTab: React.FC<FootprintsTabProps> = ({
  currentUser,
  footprints,
  onAddFootprint,
  onUpdateFootprint,
  onDeleteFootprint,
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Edit footprint state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<'youth' | 'school' | 'camp' | 'expert'>('expert');
  const [editImageUrl, setEditImageUrl] = useState('');
  
  // Add footprint state
  const [date, setDate] = useState('2026-07');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'youth' | 'school' | 'camp' | 'expert'>('expert');
  const [imageUrl, setImageUrl] = useState('');

  const categories = [
    { id: 'all', label: '전체 보기' },
    { id: 'expert', label: '전문가 교육과정' },
    { id: 'school', label: '초중고 출강활동' },
    { id: 'camp', label: '청소년 융합캠프' },
  ];

  const filteredItems = footprints
    .filter(item => filterCategory === 'all' || item.category === filterCategory)
    .sort((a, b) => b.date.localeCompare(a.date)); // descending sort for timeline

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !subtitle) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    const finalImageUrl = imageUrl.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600';

    onAddFootprint({
      date,
      title,
      subtitle,
      description,
      category,
      imageUrl: finalImageUrl,
    });

    // Reset Form
    setTitle('');
    setSubtitle('');
    setDescription('');
    setImageUrl('');
    setShowAddForm(false);
  };

  const startEdit = (item: FootprintItem) => {
    setEditingId(item.id);
    setEditDate(item.date);
    setEditTitle(item.title);
    setEditSubtitle(item.subtitle);
    setEditDescription(item.description);
    setEditCategory(item.category);
    setEditImageUrl(item.imageUrl);
  };

  const handleSaveEdit = () => {
    if (!editTitle || !editDescription || !editSubtitle) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }
    if (editingId) {
      onUpdateFootprint({
        id: editingId,
        date: editDate,
        title: editTitle,
        subtitle: editSubtitle,
        description: editDescription,
        category: editCategory,
        imageUrl: editImageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      });
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'expert':
        return { text: '강사 전문양성', style: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'school':
        return { text: '초중고 파견출강', style: 'bg-indigo-100 text-indigo-700 border-indigo-200' };
      case 'camp':
        return { text: '청소년 캠프지원', style: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      default:
        return { text: '연천 교육협력', style: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5.5 h-5.5 text-brand" />
            연천 AI 교육의 찬란한 발자취
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            강사진이 연천 전역에서 청소년 및 기관을 대상으로 인공지능을 전파해온 역사적 타임라인입니다.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-hover rounded-xl shadow-md transition self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            새 발자취 일정 등록
          </button>
        )}
      </div>

      {/* Admin Add Form */}
      {isAdmin && showAddForm && (
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl shadow-md border border-brand/20 space-y-4">
          <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">새 타임라인 일정 등록하기</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">일정 구분 (연월)</label>
              <input
                type="month"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">분류</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
              >
                <option value="expert">전문가 교육과정</option>
                <option value="school">초중고 출강활동</option>
                <option value="camp">청소년 융합캠프</option>
                <option value="youth">기타 연천군 협력</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center justify-between">
                <span>대표 이미지 URL (생략시 기본)</span>
                <span className="text-[10px] text-brand font-medium">컴퓨터 사진 가능</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">활동명 (메인 타이틀)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 제1기 AI 교육 전문가 심화 과정 개강"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">소제목 (세부 기획명)</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="예: 실전 로보틱스 및 교수설계 완성"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">상세 성과 및 교육 설명</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 마이크로비트 무선 라디오 통신 및 엔트리 머신러닝 연동을 중심으로 24시간 교육 및 강의 교재를 직접 시범 개발하였습니다."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-brand hover:bg-brand-hover rounded-lg shadow-sm transition"
            >
              업로드
            </button>
          </div>
        </form>
      )}

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 w-fit">
        <div className="flex items-center gap-1.5 px-3 text-slate-400 border-r border-slate-200 mr-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="text-xs font-bold font-sans">필터</span>
        </div>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterCategory === cat.id
                ? 'bg-brand text-white shadow-brand/20 shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-150'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Timeline Layout */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-400">선택한 분류에 등록된 교육 발자취 일정이 없습니다.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-brand/20 ml-4 md:ml-36 pl-8 md:pl-10 space-y-12 pb-8">
          {filteredItems.map((item) => {
            const badge = getCategoryBadge(item.category);
            return (
              <div key={item.id} className="relative group">
                {/* Timeline node - glowing dot */}
                <div className="absolute -left-[41px] md:-left-[49px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-brand flex items-center justify-center shadow-md transition group-hover:scale-125 group-hover:border-accent z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                </div>

                {/* Left Date Label (on desktop) */}
                <div className="hidden md:block absolute -left-44 top-1 w-32 text-right">
                  <span className="font-orbitron font-extrabold text-lg text-slate-900 tracking-wider">
                    {item.date}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase font-orbitron mt-0.5">Education Date</span>
                </div>

                {/* Main Card */}
                <div className="glass-panel p-6 rounded-2xl shadow-brand/2 hover:shadow-brand/5 hover:border-brand/20 transition-all duration-300">
                  {editingId === item.id ? (
                    <div className="space-y-4 text-slate-850 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-bold text-brand flex items-center gap-1">
                          <Edit3 className="w-3.5 h-3.5 animate-pulse" />
                          발자취 역사적 일정 실시간 편집
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            저장
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            취소
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">날짜 (연월)</label>
                          <input
                            type="month"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">분류</label>
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value as any)}
                            className="w-full px-2.5 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                          >
                            <option value="expert">전문가 교육과정</option>
                            <option value="school">초중고 출강활동</option>
                            <option value="camp">청소년 융합캠프</option>
                            <option value="youth">기타 연천군 협력</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1 flex items-center justify-between">
                            <span>대표 이미지 URL</span>
                            <span className="text-[9px] text-brand font-medium">컴퓨터 사진 가능</span>
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={editImageUrl}
                              onChange={(e) => setEditImageUrl(e.target.value)}
                              className="flex-1 px-2.5 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                            />
                            <label className="cursor-pointer px-2 py-1.5 bg-slate-150 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-250 transition-all flex items-center shrink-0">
                              찾기
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (typeof reader.result === 'string') {
                                        setEditImageUrl(reader.result);
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">활동명 (메인 타이틀)</label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">소제목 (세부 기획명)</label>
                          <input
                            type="text"
                            value={editSubtitle}
                            onChange={(e) => setEditSubtitle(e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">상세 성과 및 교육 설명</label>
                        <textarea
                          rows={3}
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand leading-relaxed"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Mobile Date Header */}
                      <div className="md:hidden flex items-center justify-between border-b border-slate-100 pb-2 col-span-12">
                        <span className="font-orbitron font-extrabold text-base text-slate-900">
                          {item.date}
                        </span>
                        <span className="text-[10px] text-slate-400">Y-AI TIMELINE</span>
                      </div>

                      {/* Text Content Column */}
                      <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.style}`}>
                              {badge.text}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold font-sans flex items-center gap-0.5">
                              <MapPin className="w-3 h-3 text-slate-300" />
                              연천 청소년센터 외
                            </span>
                          </div>
                          
                          <h4 className="text-lg font-bold text-slate-900 group-hover:text-brand transition duration-200">
                            {item.title}
                          </h4>
                          
                          <p className="text-brand font-medium text-xs">
                            {item.subtitle}
                          </p>
                          
                          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                            {item.description}
                          </p>
                        </div>

                        {/* Admin Action Buttons */}
                        {isAdmin && (
                          <div className="pt-2 flex items-center gap-2">
                            <button
                              onClick={() => startEdit(item)}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs text-brand hover:text-white bg-blue-50 hover:bg-brand rounded-lg border border-blue-100 transition cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              일정 수정
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('이 발자취 데이터를 삭제하시겠습니까?')) {
                                  onDeleteFootprint(item.id);
                                }
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-lg transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              일정 삭제
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Image Column */}
                      <div className="lg:col-span-4 relative h-40 lg:h-auto min-h-[140px] rounded-xl overflow-hidden group/img">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition duration-500 group-hover/img:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition duration-300 flex items-end p-3">
                          <span className="text-[10px] text-white flex items-center gap-1 font-semibold">
                            <Sparkles className="w-3 h-3 text-accent" />
                            현장 활동 사진
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
