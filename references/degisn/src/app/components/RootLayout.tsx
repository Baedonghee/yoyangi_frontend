import { Outlet, Link, useNavigate } from 'react-router';
import { Search, Heart, MessageCircle, Youtube, FileText, Menu, BookOpen } from 'lucide-react';

export function RootLayout() {
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/search');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Top Header Layer */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button className="sm:hidden p-2 text-gray-600 hover:text-orange-500 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-md">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
              </div>
              <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">요양이</span>
            </Link>
          </div>

          {/* Center Search Bar (Hidden on small mobile) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="어떤 요양시설을 찾으시나요?"
                className="w-full pl-6 pr-14 py-3 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-sm hover:bg-orange-600 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Right Nav Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Icon */}
            <button className="md:hidden p-2 text-gray-600 hover:text-orange-500 transition-colors">
              <Search className="w-6 h-6" />
            </button>
            
            <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold text-gray-600">
              <Link to="/guide" className="hover:text-orange-500 transition-colors">가이드</Link>
              <Link to="/login" className="hover:text-orange-500 transition-colors">로그인</Link>
              <Link to="/signup" className="hover:text-orange-500 transition-colors">회원가입</Link>
              <span className="w-px h-4 bg-gray-300"></span>
              <Link to="/partner" className="text-orange-500 hover:text-orange-600 transition-colors border border-orange-500 px-3 py-1.5 rounded-full">입점문의</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center pb-12 sm:pb-0 overflow-x-hidden">
        <Outlet />
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed right-4 bottom-24 sm:right-6 sm:bottom-6 z-50 flex flex-col gap-3 items-end">
        <button className="flex items-center gap-2 px-4 h-12 bg-[#FFEB3B] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-transform cursor-pointer">
          <MessageCircle className="w-5 h-5 text-gray-900 fill-gray-900" />
          <span className="text-sm font-bold text-gray-900 whitespace-nowrap">상담하기</span>
        </button>
        <button className="flex items-center gap-2 px-4 h-12 bg-[#FF0000] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-transform cursor-pointer">
          <Youtube className="w-5 h-5 text-white" />
          <span className="text-sm font-bold text-white whitespace-nowrap">유튜브</span>
        </button>
        <button className="flex items-center gap-2 px-4 h-12 bg-[#03C75A] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-transform cursor-pointer">
          <FileText className="w-5 h-5 text-white fill-white" />
          <span className="text-sm font-bold text-white whitespace-nowrap">블로그</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-12 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">요양이</span>
              </div>
              <p className="text-gray-500 text-sm font-medium">안심하고 맡길 수 있는<br/>가족을 위한 첫 걸음</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-bold text-gray-800">회사소개</h4>
              <ul className="space-y-2 text-sm text-gray-500 font-medium">
                <li><Link to="#" className="hover:text-orange-500">이용약관</Link></li>
                <li><Link to="#" className="hover:text-orange-500">개인정보처리방침</Link></li>
                <li><Link to="#" className="hover:text-orange-500">위치기반서비스 이용약관</Link></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-bold text-gray-800">고객센터</h4>
              <ul className="space-y-2 text-sm text-gray-500 font-medium">
                <li><Link to="/guide" className="hover:text-orange-500">요양 가이드</Link></li>
                <li><Link to="#" className="hover:text-orange-500">공지사항</Link></li>
                <li><Link to="#" className="hover:text-orange-500">자주 묻는 질문</Link></li>
                <li><Link to="#" className="hover:text-orange-500">1:1 문의</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-800">대표전화</h4>
              <p className="text-2xl font-black text-orange-500">1588-0000</p>
              <p className="text-xs text-gray-400 font-medium">평일 09:00 - 18:00 (점심시간 12:00 - 13:00)<br/>주말 및 공휴일 휴무</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400 font-medium text-center md:text-left">
              (주)요양이 | 대표자: 홍길동 | 사업자등록번호: 123-45-67890<br/>
              통신판매업신고: 제2026-서울강남-0000호 | 주소: 서울특별시 강남구 테헤란로 123<br/>
              © Yoyangi Corp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
