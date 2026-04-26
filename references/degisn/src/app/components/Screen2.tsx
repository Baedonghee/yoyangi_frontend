import { Search, SlidersHorizontal, MapPin, Star } from 'lucide-react';

export function Screen2() {
  const listings = [
    {
      title: '아름다운 산 전망',
      location: '강원도',
      rating: 4.8,
      reviews: 124,
      price: '₩120,000',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    },
    {
      title: '바다 근처 숙소',
      location: '부산',
      rating: 4.9,
      reviews: 89,
      price: '₩95,000',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    },
    {
      title: '조용한 숲속 오두막',
      location: '제주도',
      rating: 4.7,
      reviews: 156,
      price: '₩85,000',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
    },
    {
      title: '도심 속 힐링 공간',
      location: '서울',
      rating: 4.6,
      reviews: 203,
      price: '₩150,000',
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
    },
  ];

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-800">검색 결과</h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
              <SlidersHorizontal className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">필터</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="장소, 지역 검색..."
              className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <p className="text-sm text-slate-600">
          총 <span className="font-semibold text-slate-800">{listings.length}개</span>의 결과를 찾았습니다
        </p>
      </div>

      {/* Listings */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {listings.map((listing, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="flex gap-4">
                <div className="w-32 h-32 flex-shrink-0">
                  <img
                    src={`${listing.image}?w=200&h=200&fit=crop`}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 py-3 pr-4">
                  <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">
                    {listing.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-slate-700">{listing.rating}</span>
                    <span className="text-sm text-slate-500">({listing.reviews})</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">{listing.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
