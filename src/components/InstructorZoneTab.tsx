import React, { useState } from 'react';
import { SharedResource, User } from '../types';
import { Lock, Unlock, Download, Search, Plus, Trash2, FolderGit, FileText, SlidersHorizontal, BookOpen, UserCheck } from 'lucide-react';

interface InstructorZoneTabProps {
  currentUser: User | null;
  resources: SharedResource[];
  onAddResource: (newItem: Omit<SharedResource, 'id' | 'uploadedAt' | 'downloads'>) => void;
  onDeleteResource: (id: string) => void;
  onIncrementDownload: (id: string) => void;
  onQuickRoleSwitchToInstructor: () => void;
  onOpenAuth: () => void;
}

export const InstructorZoneTab: React.FC<InstructorZoneTabProps> = ({
  currentUser,
  resources,
  onAddResource,
  onDeleteResource,
  onIncrementDownload,
  onQuickRoleSwitchToInstructor,
  onOpenAuth,
}) => {
  const isAuthorized = currentUser && (currentUser.role === 'instructor' || currentUser.role === 'admin');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State for uploading resources
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'syllabus' | 'guide' | 'slide' | 'software'>('syllabus');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('4.5 MB');

  const categories = [
    { id: 'all', label: '전체 자료' },
    { id: 'syllabus', label: '수업지도안/계획서' },
    { id: 'guide', label: '조립 및 센서매뉴얼' },
    { id: 'slide', label: '특강 발표 PPT' },
    { id: 'software', label: '소프트웨어/HEX 소스코드' },
  ];

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !fileName) {
      alert('필수 양식을 가득 채워주세요.');
      return;
    }

    onAddResource({
      title,
      category,
      description,
      fileName,
      fileSize,
      author: currentUser?.name || '익명 강사',
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setFileName('');
    setShowAddForm(false);
  };

  const filteredResources = resources.filter((res) => {
    const matchesCategory = filterCategory === 'all' || res.category === filterCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'syllabus': return '수업계획안';
      case 'guide': return '하드웨어 매뉴얼';
      case 'slide': return '수업용 PPT';
      case 'software': return '프로그램 소스';
      default: return '일반 자료';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'syllabus': return 'bg-blue-50 text-brand border-blue-100';
      case 'guide': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'slide': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'software': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const handleDownloadClick = (id: string, fileName: string) => {
    onIncrementDownload(id);
    alert(`[가상 파일 다운로드 완료]\n파일명: ${fileName}\n연천 정강사 교육 자료실의 최신 교안이 로컬 파일에 임시 캐싱되었습니다.`);
  };

  // 1. LOCKED VIEW FOR UNAUTHORIZED USERS
  if (!isAuthorized) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-8 animate-fade-in">
        {/* Hologram style lock indicator */}
        <div className="relative mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center border border-red-100 shadow-neon-strong animate-pulse">
          <Lock className="w-10 h-10 text-red-500" />
          <div className="absolute inset-0 bg-red-400/10 rounded-full blur-lg animate-ping"></div>
        </div>

        <div className="space-y-3">
          <span className="font-orbitron font-extrabold text-xs text-red-500 tracking-widest bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
            AUTHORIZED PERSONNEL ONLY
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            연천 1기 정강사 전용 교육 자료실 잠금
          </h3>
          <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
            본 공간은 연천 AI 교육 전문가 강사 양성과정을 성공적으로 수료하고 행정 주무관의 '정강사 권한 승인'이 완료된 우수 교육 인력 전용 아카이브 포털입니다.
          </p>
        </div>

        {/* Current Role status visualizer */}
        <div className="max-w-md mx-auto p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">현재 계정 정보:</span>
            <span className="text-slate-800">
              {currentUser ? `${currentUser.name} (${currentUser.email})` : '비회원 상태'}
            </span>
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">부여된 등급 권한:</span>
            <span className="text-amber-600">
              {currentUser 
                ? (currentUser.role === 'instructor_pending' ? '인증 대기 상태 (검토중)' : '일반 등급 (권한 미달)')
                : '비회원 (입장 불가)'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-200 pt-3">
            💡 <span className="font-bold">입장 승인 가이드:</span> 회원가입 시 '강사 회원'을 선택해 주시면 관리자가 위원회 수료 명단을 확인하여 1시간 내 정강사로 특별 등급 상향을 조치해 드립니다.
          </p>
        </div>

        {/* Action Button & Fast Evaluator Shortcut */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-2">
          {currentUser ? (
            <button
              onClick={onQuickRoleSwitchToInstructor}
              className="w-full sm:flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              정강사 계정으로 즉각 권한전환 (테스트)
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-full sm:flex-1 py-3 bg-brand hover:bg-brand-hover text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
            >
              로그인 / 회원 가입하러 가기
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. RESOURCE LIST VIEW FOR AUTHORIZED USERS
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Unlock className="w-5.5 h-5.5 text-emerald-600 animate-pulse" />
            정강사 전용 고성능 교육 공유 자료실
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            강사분들이 실전 수업을 설계하고 학교 파견 시 그대로 인쇄 또는 로드하여 쓸 수 있는 검증 교안 아카이브 공간입니다.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-hover rounded-xl shadow-md transition self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            새 자료 등록
          </button>
        </div>
      </div>

      {/* Admin/Instructor Resource Upload Form */}
      {showAddForm && (
        <form onSubmit={handleUpload} className="glass-panel p-6 rounded-2xl shadow-md border border-brand/20 space-y-4">
          <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">신규 교육 지도안 및 소프트웨어 소스코드 공유</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">자료 분류</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
              >
                <option value="syllabus">수업지도안 / 강의계획서</option>
                <option value="guide">조립 및 센서 매뉴얼</option>
                <option value="slide">특강 발표 PPT 템플릿</option>
                <option value="software">프로그램 / HEX 소스코드</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">자료 제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 초등 3학년 인공지능 이미지 인식 놀이 1차시"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">가상 첨부 파일명 (확장자 필수)</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="예: AI_Elementary_Level1.pdf"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">가상 파일 크기</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="예: 4.8 MB 또는 12.2 MB"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">작성 등록자</label>
              <input
                type="text"
                value={currentUser?.name || ''}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-500 font-sans font-bold"
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">자료 내용 및 사용 교구 키트 설명</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 해당 자료는 연천 관내 아동센터에 출강 시 60분 특강용으로 제작된 엔트리 코딩 자료입니다. 비디오 모션 센싱 카메라가 장착된 노트북이 필요합니다."
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
              교안 아카이브 등재
            </button>
          </div>
        </form>
      )}

      {/* Control Panels: Search and Categories */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Horizontal Filter */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterCategory === cat.id
                  ? 'bg-white text-brand shadow-sm font-bold border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Simple Search Input box */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="자료명, 확장자, 키구 검색..."
            className="w-full pl-9 pr-4 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:border-brand"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Resources Table/List view */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-400">조건에 부합하는 정강사 교육 자료가 발견되지 않았습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-5 bg-white border border-slate-150 hover:border-brand/35 rounded-2xl shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getCategoryColor(res.category)}`}>
                    {getCategoryLabel(res.category)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    크기: {res.fileSize}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug tracking-tight hover:text-brand transition cursor-pointer">
                  {res.title}
                </h4>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {res.description}
                </p>

                <div className="p-2.5 bg-slate-50 rounded-lg text-[10px] font-mono text-slate-600 border border-slate-100 flex items-center gap-1.5 overflow-hidden">
                  <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{res.fileName}</span>
                </div>
              </div>

              {/* Download trigger bottom bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-slate-400">
                  작성: <span className="font-semibold text-slate-700 font-sans">{res.author}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 font-mono">
                    다운: {res.downloads}회
                  </span>
                  
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleDownloadClick(res.id, res.fileName)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-brand hover:bg-brand-hover rounded-lg transition shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      자료 받기
                    </button>
                    
                    {currentUser?.role === 'admin' && (
                      <button
                        onClick={() => {
                          if (confirm('이 교육 자료를 저장소에서 영구 제거하시겠습니까?')) {
                            onDeleteResource(res.id);
                          }
                        }}
                        className="p-1.5 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-lg transition border border-red-100"
                        title="자료실 강제 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
