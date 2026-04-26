import { Search, TrendingUp, Clock, Sparkles } from 'lucide-react';

export function Screen3() {
  const trendingSearches = [
    '제주도 여행',
    '서울 맛집',
    '부산 카페',
    '강원도 숙소',
    '경주 관광',
    '전주 한옥마을',
  ];

  const recentImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Discover
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="무엇을 찾고 계신가요?"
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-2 border-slate-200 focus:outline-none focus:border-purple-500 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-slate-800">인기 검색어</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingSearches.map((search, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all"
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Section */}
      <div className="flex-1 px-6 pb-20 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-slate-800">최근 본 항목</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {recentImages.map((img, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
            >
              <img
                src={`${img}?w=400&h=400&fit=crop`}
                alt={`Recent ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-white text-sm font-medium">이미지 {index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-slate-200 shadow-lg">
        <div className="flex items-center justify-around py-3 px-6">
          <button className="flex flex-col items-center gap-1 text-purple-600">
            <Search className="w-6 h-6" />
            <span className="text-xs font-medium">검색</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">트렌드</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
            <Clock className="w-6 h-6" />
            <span className="text-xs">최근</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
            <Sparkles className="w-6 h-6" />
            <span className="text-xs">추천</span>
          </button>
        </div>
      </div>
    </div>
  );
}
