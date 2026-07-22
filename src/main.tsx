import React, { useState, useEffect, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl max-w-md w-full shadow-2xl">
        <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold flex items-center justify-center">
          ⚠️
        </div>
        <h1 className="text-xl font-bold text-white mb-2">화면 로딩 중 오류가 발생했습니다</h1>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          저장된 로컬 데이터나 브라우저 캐시 충돌로 인해 애플리케이션을 불러오지 못했습니다. 아래 버튼을 눌러 초기화 및 새로고침을 진행해 주세요.
        </p>
        <div className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-red-300 text-left mb-6 overflow-x-auto max-h-32">
          {error.message || 'React render error'}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            페이지 새로고침
          </button>
          <button
            onClick={reset}
            className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-extrabold transition cursor-pointer"
          >
            캐시 초기화 후 재시작
          </button>
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(event.error || new Error(event.message));
    };
    const handleRejection = (event: PromiseRejectionEvent) => {
      const err = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      setError(err);
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (error) {
    return <ErrorFallback error={error} reset={handleReset} />;
  }

  return <App />;
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <MainApp />
    </StrictMode>
  );
}
