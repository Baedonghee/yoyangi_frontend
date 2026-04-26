import { Search, Home, Camera, Map, Heart, User, Plus, Grid, Bell } from 'lucide-react';

export function Screen1() {
  const categories = [
    { icon: Home, label: '홈', color: 'bg-blue-500' },
    { icon: Camera, label: '사진', color: 'bg-purple-500' },
    { icon: Map, label: '지도', color: 'bg-green-500' },
    { icon: Heart, label: '찜', color: 'bg-red-500' },
    { icon: User, label: '프로필', color: 'bg-orange-500' },
    { icon: Plus, label: '추가', color: 'bg-pink-500' },
    { icon: Grid, label: '갤러리', color: 'bg-indigo-500' },
    { icon: Bell, label: '알림', color: 'bg-yellow-500' },
  ];

  const images = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
  ];

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-800">Explore</h1>
            <div className="flex gap-3">
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <User className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 py-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">카테고리</h2>
        <div className="grid grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <button
              key={index}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-100 transition-all group"
            >
              <div className={`${category.color} p-4 rounded-2xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-slate-600 font-medium">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      <div className="flex-1 px-6 pb-20 overflow-y-auto">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">추천 갤러리</h2>
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
            >
              <img
                src={`${img}?w=400&h=400&fit=crop`}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
        <div className="flex items-center justify-around py-3 px-6">
          <button className="flex flex-col items-center gap-1 text-blue-600">
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">홈</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
            <Search className="w-6 h-6" />
            <span className="text-xs">검색</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
            <Heart className="w-6 h-6" />
            <span className="text-xs">찜</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
            <User className="w-6 h-6" />
            <span className="text-xs">프로필</span>
          </button>
        </div>
      </div>
    </div>
  );
}
