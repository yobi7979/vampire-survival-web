'use client';

import { useState } from 'react';
import Link from 'next/link';

// 탭 정의
const tabs = [
  { id: 'character', label: '캐릭터 설정' },
  { id: 'monster', label: '몬스터 설정' },
  { id: 'weapon', label: '무기 설정' },
  { id: 'game', label: '게임 환경 설정' },
  { id: 'presets', label: '프리셋 관리' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('character');
  const [presetName, setPresetName] = useState('');
  const [presets, setPresets] = useState<string[]>([]);
  const [saveMessage, setSaveMessage] = useState('');

  // 프리셋 저장 함수
  const savePreset = () => {
    if (!presetName.trim()) {
      setSaveMessage('프리셋 이름을 입력해주세요.');
      return;
    }

    // 실제 구현에서는 현재 설정값을 저장
    const newPresets = [...presets, presetName];
    setPresets(newPresets);
    
    // 로컬 스토리지에 저장 (실제 구현에서는 설정값도 함께 저장)
    localStorage.setItem('vampire-survival-presets', JSON.stringify(newPresets));
    
    setSaveMessage(`"${presetName}" 프리셋이 저장되었습니다.`);
    setPresetName('');
    
    // 3초 후 메시지 제거
    setTimeout(() => {
      setSaveMessage('');
    }, 3000);
  };

  // 프리셋 불러오기 함수
  const loadPreset = (name: string) => {
    // 실제 구현에서는 저장된 설정값을 불러옴
    setSaveMessage(`"${name}" 프리셋을 불러왔습니다.`);
    
    // 3초 후 메시지 제거
    setTimeout(() => {
      setSaveMessage('');
    }, 3000);
  };

  // 프리셋 삭제 함수
  const deletePreset = (name: string) => {
    const newPresets = presets.filter(preset => preset !== name);
    setPresets(newPresets);
    
    // 로컬 스토리지 업데이트
    localStorage.setItem('vampire-survival-presets', JSON.stringify(newPresets));
    
    setSaveMessage(`"${name}" 프리셋이 삭제되었습니다.`);
    
    // 3초 후 메시지 제거
    setTimeout(() => {
      setSaveMessage('');
    }, 3000);
  };

  // 프리셋 공유 함수
  const sharePreset = (name: string) => {
    // 실제 구현에서는 공유 가능한 URL 또는 코드 생성
    const shareCode = btoa(name); // 간단한 인코딩 (실제로는 더 복잡한 로직 필요)
    
    // 클립보드에 복사
    navigator.clipboard.writeText(`https://vampire-survival.example.com/shared?preset=${shareCode}`)
      .then(() => {
        setSaveMessage('공유 링크가 클립보드에 복사되었습니다.');
        
        // 3초 후 메시지 제거
        setTimeout(() => {
          setSaveMessage('');
        }, 3000);
      })
      .catch(() => {
        setSaveMessage('공유 링크 복사에 실패했습니다.');
        
        // 3초 후 메시지 제거
        setTimeout(() => {
          setSaveMessage('');
        }, 3000);
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-500">뱀파이어 서바이벌</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/" className="hover:text-red-400">홈</Link></li>
              <li><Link href="/settings" className="text-red-400 border-b-2 border-red-400">설정</Link></li>
              <li><Link href="/play" className="hover:text-red-400">게임 플레이</Link></li>
              <li><Link href="/help" className="hover:text-red-400">도움말</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">게임 설정</h2>
        
        {/* 알림 메시지 */}
        {saveMessage && (
          <div className="bg-green-800 text-white p-3 rounded mb-4">
            {saveMessage}
          </div>
        )}
        
        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-700 mb-6">
          <ul className="flex flex-wrap -mb-px">
            {tabs.map(tab => (
              <li key={tab.id} className="mr-2">
                <button
                  className={`inline-block p-4 rounded-t-lg ${
                    activeTab === tab.id
                      ? 'text-red-500 border-b-2 border-red-500'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* 탭 콘텐츠 */}
        <div className="mt-6">
          {activeTab === 'character' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">캐릭터 설정</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">캐릭터 이미지</h4>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-red-400 transition">
                    <p>이미지를 업로드하려면 클릭하세요</p>
                    <p className="text-sm text-gray-400 mt-2">PNG, JPG 또는 GIF 파일 (최대 2MB)</p>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">캐릭터 속성</h4>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">이름</label>
                    <input type="text" className="w-full bg-gray-700 border border-gray-600 rounded p-2" placeholder="캐릭터 이름" />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">체력</label>
                    <input type="range" min="1" max="100" className="w-full" />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>낮음</span>
                      <span>높음</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">이동 속도</label>
                    <input type="range" min="1" max="100" className="w-full" />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>느림</span>
                      <span>빠름</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">공격력</label>
                    <input type="range" min="1" max="100" className="w-full" />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>약함</span>
                      <span>강함</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'monster' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">몬스터 설정</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">몬스터 이미지</h4>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-red-400 transition">
                    <p>이미지를 업로드하려면 클릭하세요</p>
                    <p className="text-sm text-gray-400 mt-2">PNG, JPG 또는 GIF 파일 (최대 2MB)</p>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">몬스터 속성</h4>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">이름</label>
                    <input type="text" className="w-full bg-gray-700 border border-gray-600 rounded p-2" placeholder="몬스터 이름" />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">체력</label>
                    <input type="range" min="1" max="100" className="w-full" />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>낮음</span>
                      <span>높음</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">이동 속도</label>
                    <input type="range" min="1" max="100" className="w-full" />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>느림</span>
                      <span>빠름</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">공격력</label>
                    <input type="range" min="1" max="100" className="w-full" />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>약함</span>
                      <span>강함</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">생성 빈도</label>
                    <input type="range" min="1" max="100" className="w-full" />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>낮음</span>
                      <span>높음</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'weapon' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">무기 설정</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">무기 이미지</h4>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-red-400 transition">
                    <p>이미지를 업로드하려면 클릭하세요</p>
                    <p className="text-sm text-gray-400 mt-2">PNG, JPG 또는 GIF 파일 (최대 2MB)</p>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">무기 속성</h4>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">이름</label>
                    <input type="text" className="w-full bg-gray-700 border border-gray-600 rounded p-2" placeholder="무기 이름" />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">공격력</label>
                    <input type="range" min="1" max="100" className="w-full" />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>약함</span>
                      <span>강함</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">공격 속도</label>
                    <input type="range" min="1" max="100" className="w-full" />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>느림</span>
                      <span>빠름</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">공격 범위</label>
                    <input type="range" min="1" max="100" className="w-full" />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>좁음</span>
                      <span>넓음</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">특수 효과</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded p-2">
                      <option>없음</option>
                      <option>화염 데미지</option>
                      <option>빙결 효과</option>
                      <option>관통 효과</option>
                      <option>흡혈 효과</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'game' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">게임 환경 설정</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">게임 배경</h4>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-red-400 transition">
                    <p>배경 이미지를 업로드하려면 클릭하세요</p>
                    <p className="text-sm text-gray-400 mt-2">PNG, JPG 또는 GIF 파일 (최대 2MB)</p>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">게임 설정</h4>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">난이도</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded p-2">
                      <option>쉬움</option>
                      <option>보통</option>
                      <option>어려움</option>
                      <option>매우 어려움</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">게임 속도</label>
                    <input type="range" min="1" max="100" className="w-full" />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>느림</span>
                      <span>빠름</span>
                    </div>
                  </div>
                  
                  <div className="mb-4 flex items-center">
                    <input type="checkbox" id="sound-effects" className="mr-2" />
                    <label htmlFor="sound-effects" className="text-sm font-medium">효과음</label>
                  </div>
                  
                  <div className="mb-4 flex items-center">
                    <input type="checkbox" id="music" className="mr-2" />
                    <label htmlFor="music" className="text-sm font-medium">배경 음악</label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'presets' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">프리셋 관리</h3>
              
              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <h4 className="font-medium mb-2">새 프리셋 저장</h4>
                <div className="flex">
                  <input 
                    type="text" 
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-l p-2" 
                    placeholder="프리셋 이름" 
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                  />
                  <button 
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-r"
                    onClick={savePreset}
                  >
                    저장
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-2">현재 설정을 프리셋으로 저장합니다.</p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">저장된 프리셋</h4>
                
                {presets.length === 0 ? (
                  <p className="text-gray-400">저장된 프리셋이 없습니다.</p>
                ) : (
                  <ul className="divide-y divide-gray-700">
                    {presets.map((preset, index) => (
                      <li key={index} className="py-3 flex justify-between items-center">
                        <span>{preset}</span>
                        <div className="flex space-x-2">
                          <button 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                            onClick={() => loadPreset(preset)}
                          >
                            불러오기
                          </button>
                          <button 
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                            onClick={() => sharePreset(preset)}
                          >
                            공유
                          </button>
                          <button 
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            onClick={() => deletePreset(preset)}
                          >
                            삭제
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* 저장 버튼 */}
        <div className="mt-8 flex justify-end">
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded">
            설정 저장
          </button>
        </div>
      </main>
    </div>
  );
}
