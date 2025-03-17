'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-500">뱀파이어 서바이벌</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/" className="text-red-400 border-b-2 border-red-400">홈</Link></li>
              <li><Link href="/settings" className="hover:text-red-400">설정</Link></li>
              <li><Link href="/play" className="hover:text-red-400">게임 플레이</Link></li>
              <li><Link href="/help" className="hover:text-red-400">도움말</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {/* 히어로 섹션 */}
        <section className="relative">
          <div className="bg-black bg-opacity-60 absolute inset-0 z-10"></div>
          <div className="container mx-auto px-6 py-32 relative z-20 text-center">
            <h2 className="text-5xl font-bold mb-6 text-red-500">웹에서 즐기는 뱀파이어 서바이벌</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              나만의 캐릭터, 몬스터, 무기를 커스터마이징하고 친구들과 공유하세요. 
              무한히 몰려오는 적들 속에서 생존하는 로그라이크 게임을 웹에서 즐겨보세요!
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/play" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium text-lg">
                게임 시작
              </Link>
              <Link href="/settings" className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium text-lg">
                게임 설정
              </Link>
            </div>
          </div>
        </section>

        {/* 특징 섹션 */}
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">게임 특징</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-red-400">캐릭터 커스터마이징</h3>
                <p>자신만의 캐릭터를 만들어보세요. 이미지 업로드부터 능력치 설정까지 모든 것을 커스터마이징할 수 있습니다.</p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-red-400">몬스터 커스터마이징</h3>
                <p>다양한 몬스터를 직접 만들어보세요. 몬스터의 외형과 능력치를 조절하여 게임의 난이도를 조절할 수 있습니다.</p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-red-400">무기 커스터마이징</h3>
                <p>강력한 무기를 디자인하고 능력치를 설정해보세요. 다양한 특수 효과를 추가하여 게임 플레이를 더욱 재미있게 만들 수 있습니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 프리셋 공유 섹션 */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">프리셋 공유 시스템</h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h3 className="text-2xl font-semibold mb-4 text-red-400">나만의 설정을 공유하세요</h3>
                <p className="mb-4">
                  게임 설정을 프리셋으로 저장하고 친구들과 공유할 수 있습니다. 
                  공유 링크를 통해 다른 사람들도 당신이 만든 게임 환경을 그대로 체험할 수 있습니다.
                </p>
                <p>
                  다양한 프리셋을 만들고 저장하여 매번 다른 게임 경험을 즐겨보세요. 
                  커뮤니티에서 인기 있는 프리셋을 불러와 플레이할 수도 있습니다.
                </p>
              </div>
              <div className="md:w-5/12 bg-gray-700 p-6 rounded-lg">
                <h4 className="font-medium mb-4">프리셋 예시</h4>
                <div className="space-y-3">
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="font-medium">하드코어 모드</div>
                    <div className="text-sm text-gray-400">몬스터 체력 +50%, 플레이어 체력 -30%</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="font-medium">스피드런 모드</div>
                    <div className="text-sm text-gray-400">게임 속도 +100%, 몬스터 생성 빈도 +70%</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="font-medium">초보자 모드</div>
                    <div className="text-sm text-gray-400">플레이어 공격력 +30%, 몬스터 공격력 -20%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 시작하기 섹션 */}
        <section className="py-16 bg-gray-800 text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">지금 바로 시작하세요!</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              웹 브라우저에서 바로 즐길 수 있는 뱀파이어 서바이벌 게임을 경험해보세요.
              설치 필요 없이 바로 플레이할 수 있습니다.
            </p>
            <Link href="/play" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium text-lg inline-block">
              게임 시작
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-8 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">© 2025 뱀파이어 서바이벌 웹. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}
