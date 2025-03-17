'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import useGameEngine from '@/hooks/useGameEngine';

export default function PlayPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [presets, setPresets] = useState<string[]>([]);

  // 게임 엔진 훅 사용
  const { startGame, togglePause, stopGame } = useGameEngine(
    canvasRef,
    (newScore) => setScore(newScore),
    (newTime) => setTime(newTime)
  );

  // 게임 시작 함수
  const handleStartGame = () => {
    setIsGameRunning(true);
    setScore(0);
    setTime(0);
    setIsPaused(false);
    
    // 게임 엔진 시작
    startGame();
  };

  // 게임 일시정지/재개 함수
  const handleTogglePause = () => {
    setIsPaused(!isPaused);
    togglePause();
  };

  // 게임 종료 함수
  const handleEndGame = () => {
    setIsGameRunning(false);
    stopGame();
  };

  // 프리셋 불러오기 함수
  const loadPreset = (name: string) => {
    setSelectedPreset(name);
    // 실제 구현에서는 저장된 설정값을 불러옴
  };

  // 프리셋 목록 불러오기
  useEffect(() => {
    const savedPresets = localStorage.getItem('vampire-survival-presets');
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets));
    }
  }, []);

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleTogglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPaused]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-500">뱀파이어 서바이벌</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/" className="hover:text-red-400">홈</Link></li>
              <li><Link href="/settings" className="hover:text-red-400">설정</Link></li>
              <li><Link href="/play" className="text-red-400 border-b-2 border-red-400">게임 플레이</Link></li>
              <li><Link href="/help" className="hover:text-red-400">도움말</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {!isGameRunning ? (
          <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">게임 시작</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">프리셋 선택</label>
              <select 
                className="w-full bg-gray-700 border border-gray-600 rounded p-2"
                value={selectedPreset}
                onChange={(e) => loadPreset(e.target.value)}
              >
                <option value="">기본 설정</option>
                {presets.map((preset, index) => (
                  <option key={index} value={preset}>{preset}</option>
                ))}
              </select>
            </div>
            
            <button 
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-medium"
              onClick={handleStartGame}
            >
              게임 시작
            </button>
            
            <p className="text-sm text-gray-400 mt-4 text-center">
              ESC 키를 눌러 게임을 일시정지할 수 있습니다.
            </p>
          </div>
        ) : (
          <div>
            {/* 게임 UI */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-lg font-medium">점수: {score}</span>
              </div>
              <div>
                <span className="text-lg font-medium">시간: {time.toFixed(1)}초</span>
              </div>
              <div>
                <button 
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  onClick={handleTogglePause}
                >
                  {isPaused ? '계속하기' : '일시정지'}
                </button>
              </div>
            </div>
            
            {/* 게임 캔버스 */}
            <div className="relative">
              <canvas 
                ref={canvasRef} 
                className="w-full h-[600px] bg-black rounded-lg"
              />
              
              {/* 일시정지 메뉴 */}
              {isPaused && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">일시정지</h3>
                    <div className="space-y-3">
                      <button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                        onClick={handleTogglePause}
                      >
                        게임 계속하기
                      </button>
                      <button 
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
                        onClick={handleEndGame}
                      >
                        게임 종료
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* 게임 컨트롤 설명 */}
            <div className="mt-4 bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2">조작 방법</h3>
              <ul className="text-sm text-gray-400">
                <li>• 방향키 또는 WASD: 캐릭터 이동</li>
                <li>• ESC: 일시정지</li>
                <li>• 공격은 자동으로 이루어집니다.</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
