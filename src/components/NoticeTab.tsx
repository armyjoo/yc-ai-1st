import React, { useState } from 'react';
import { NoticeItem, User } from '../types';
import { FileText, Search, Plus, Trash2, Calendar, User as UserIcon, Eye, Bell, ChevronDown, ChevronUp, Edit3, Check, X } from 'lucide-react';

interface NoticeTabProps {
  currentUser: User | null;
  notices: NoticeItem[];
  onAddNotice: (newItem: Omit<NoticeItem, 'id' | 'date' | 'views'>) => void;
  onUpdateNotice: (updatedItem: NoticeItem) => void;
  onDeleteNotice: (id: string) => void;
}

export const NoticeTab: React.FC<NoticeTabProps> = ({
  currentUser,
  notices,
  onAddNotice,
  onUpdateNotice,
  onDeleteNotice,
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Edit Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editIsImportant, setEditIsImportant] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('모든 입력 값을 기입해주세요.');
      return;
    }

    onAddNotice({
      title,
      content,
      author: '최고관리자',
      isImportant,
    });

    // Reset Form
    setTitle('');
    setContent('');
    setIsImportant(false);
    setShowAddForm(false);
  };

  const startEdit = (notice: NoticeItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(notice.id);
    setEditTitle(notice.title);
    setEditContent(notice.content);
    setEditIsImportant(notice.isImportant);
    setExpandedNoticeId(notice.id); // Keep expanded for editing
  };

  const handleSaveEdit = (e: React.MouseEvent, notice: NoticeItem) => {
    e.stopPropagation();
    if (!editTitle || !editContent) {
      alert('공지 제목과 내용을 기입해주세요.');
      return;
    }
    onUpdateNotice({
      ...notice,
      title: editTitle,
      content: editContent,
      isImportant: editIsImportant
    });
    setEditingId(null);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const toggleExpand = (id: string) => {
    if (expandedNoticeId === id) {
      setExpandedNoticeId(null);
    } else {
      setExpandedNoticeId(id);
    }
  };

  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort: Important first, then date descending
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.isImportant && !b.isImportant) return -1;
    if (!a.isImportant && b.isImportant) return 1;
    return b.date.localeCompare(a.date);
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5.5 h-5.5 text-brand animate-bounce" />
            공지사항 & 통합 알림 게시판
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            연천 AI 교육 전문가 협회에서 전하는 수료생 지침, 하반기 강의 일정, 관내 공지사항을 수집합니다.
          </p>
        </div>

        <div className="flex gap-2">
          {isAdmin && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-hover rounded-xl shadow-md transition self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              신규 공지사항 등록
            </button>
          )}
        </div>
      </div>

      {/* Admin Notice Post Form */}
      {isAdmin && showAddForm && (
        <form onSubmit={handlePost} className="glass-panel p-6 rounded-2xl shadow-md border border-brand/20 space-y-4">
          <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">신규 공지 게시글 등록하기</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">공지글 제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: [알림] 1기 연천 AI 교육 강사수령증 및 출강 배정 회의 안내"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">중요 여부 지정</label>
              <div className="flex items-center h-10">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isImportant}
                    onChange={(e) => setIsImportant(e.target.checked)}
                    className="w-4.5 h-4.5 accent-brand"
                  />
                  <span className="text-xs font-bold text-red-600">중요 공지로 최상단 고정 (핀)</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">공지 상세 본문</label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="예: 공지 세부 본문 내용을 기재해주세요. HTML 및 띄어쓰기가 완벽하게 보존됩니다."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand leading-relaxed"
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
              공지 즉시 배포
            </button>
          </div>
        </form>
      )}

      {/* Control Panels: Search */}
      <div className="relative w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="공지 제목 또는 본문 검색..."
          className="w-full pl-10 pr-4 py-3 border border-slate-250 rounded-2xl text-xs focus:outline-none focus:border-brand"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-4.5 top-3.5" />
      </div>

      {/* Notice List Container */}
      {sortedNotices.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-400">게시된 알림 또는 검색 조건에 부합하는 공지사항이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedNotices.map((notice) => {
            const isExpanded = expandedNoticeId === notice.id;
            const isEditing = editingId === notice.id;
            return (
              <div
                key={notice.id}
                className={`rounded-2xl transition duration-200 overflow-hidden ${
                  notice.isImportant
                    ? 'border border-red-200 bg-red-50/10'
                    : 'border border-slate-150 bg-white'
                } shadow-2xs hover:shadow-sm`}
              >
                {isEditing ? (
                  <div className="p-5 space-y-4 text-slate-850 bg-slate-50/80 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-brand flex items-center gap-1">
                        <Edit3 className="w-3.5 h-3.5 animate-pulse" />
                        공지사항 게시글 실시간 직접 편집
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleSaveEdit(e, notice)}
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

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-8">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">공지 제목</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand font-semibold"
                        />
                      </div>
                      <div className="md:col-span-4">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">중요 공지 여부</label>
                        <label className="inline-flex items-center gap-2 h-9 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editIsImportant}
                            onChange={(e) => setEditIsImportant(e.target.checked)}
                            className="w-4 h-4 accent-brand"
                          />
                          <span className="text-xs font-bold text-red-600">최상단 중요 핀 고정</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">공지 본문 내용</label>
                      <textarea
                        rows={5}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-250 rounded-lg text-xs focus:outline-none focus:border-brand leading-relaxed whitespace-pre-wrap"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Header click bar */}
                    <div
                      onClick={() => toggleExpand(notice.id)}
                      className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition"
                    >
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        {notice.isImportant ? (
                          <span className="self-start sm:self-auto text-[9px] font-black px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 animate-pulse flex-shrink-0">
                            중요 알림
                          </span>
                        ) : (
                          <span className="self-start sm:self-auto text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 flex-shrink-0">
                            일반
                          </span>
                        )}

                        <h4 className={`text-sm font-bold text-slate-900 leading-snug tracking-tight ${notice.isImportant ? 'text-red-950 font-extrabold' : ''}`}>
                          {notice.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 font-sans font-medium flex-shrink-0">
                        <span className="hidden sm:inline font-mono">{notice.date}</span>
                        <span className="font-mono flex items-center gap-0.5">
                          <Eye className="w-3.5 h-3.5" /> {notice.views}회
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Collapsible content section */}
                    {isExpanded && (
                      <div className="px-5 pb-6 pt-2 border-t border-slate-100/60 text-xs sm:text-sm text-slate-700 space-y-4 leading-relaxed animate-fade-in">
                        <p className="whitespace-pre-wrap">{notice.content}</p>

                        {/* Metadata summary and actions footer */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 font-semibold text-slate-500 font-sans">
                              <UserIcon className="w-3.5 h-3.5" />
                              발송처: {notice.author}
                            </span>
                            <span className="sm:hidden font-mono">{notice.date}</span>
                          </div>

                          {isAdmin && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => startEdit(notice, e)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs text-brand hover:text-white bg-blue-50 hover:bg-brand rounded-lg border border-blue-100 transition cursor-pointer font-semibold"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                공지 수정
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('이 공지사항 게시물을 즉각 삭제처리할까요?')) {
                                    onDeleteNotice(notice.id);
                                  }
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-lg transition cursor-pointer font-semibold"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                공지 삭제
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
