import { Search, TrendingUp, Clock, Sparkles, MapPin, Compass, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

export function Discover() {
  const trendingSearches = [
    { label: '제주도 한달살기', score: '+124%' },
    { label: '서울 야경 명소', score: '+89%' },
    { label: '부산 감성 카페', score: '+75%' },
    { label: '강릉 오션뷰 펜션', score: '+62%' },
    { label: '경주 황리단길', score: '+45%' },
    { label: '전주 벚꽃 명소', score: '+30%' },
  ];

  const recentItems = [
    {
      img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      title: '설악산 국립공원',
      type: '자연 명소'
    },
    {
      img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
      title: '해운대 엘시티',
      type: '숙박'
    },
    {
      img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
      title: '비밀의 숲 오두막',
      type: '이색 숙소'
    },
    {
      img: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
      title: '이태원 루프탑 라운지',
      type: '카페/바'
    },
    {
      img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
      title: '전주 한옥 체험',
      type: '체험'
    },
    {
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      title: '동해바다 요트 투어',
      type: '액티비티'
    },
    {
      img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      title: '대관령 양떼목장',
      type: '자연 명소'
    },
    {
      img: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
      title: '제주 비자림',
      type: '산책로'
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-6 py-16 sm:px-12 sm:py-24 flex items-center shadow-2xl isolate">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1620127252536-04fbafdc18f3?w=1600&h=600&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>당신을 위한 여행 인스퍼레이션</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            어디로 떠날지 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-sm">
              고민되시나요?
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-xl font-medium leading-relaxed">
            취향에 맞는 숨겨진 명소와 트렌디한 장소들을 찾아보세요.
            당신만의 특별한 여정이 지금 시작됩니다.
          </p>
        </div>
      </section>

      {/* Trending Search Tags */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-2xl text-orange-500 shadow-inner">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">실시간 급상승</h2>
          </div>
          <button className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors hidden sm:block">
            더보기
          </button>
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4">
          {trendingSearches.map((item, index) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={index}
              className="group flex items-center gap-3 px-5 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-transparent transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-slate-400 font-bold text-lg">
                {index + 1}
              </span>
              <span className="relative z-10 font-bold text-slate-700 group-hover:text-slate-900">
                {item.label}
              </span>
              <span className="relative z-10 text-xs font-bold text-green-500 ml-2 bg-green-50 px-2 py-1 rounded-lg">
                {item.score}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Recently Viewed (Masonry Grid) */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-100 rounded-2xl text-blue-500 shadow-inner">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">최근 본 콘텐츠</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">다시 보고 싶은 장소들을 모아두었어요</p>
          </div>
        </div>

        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 3, 1024: 4 }}>
          <Masonry gutter="1.5rem">
            {recentItems.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                key={index}
                className="group relative rounded-3xl overflow-hidden cursor-pointer bg-slate-100 transform hover:-translate-y-2 transition-transform duration-500 shadow-sm hover:shadow-2xl"
              >
                <img
                  src={`${item.img}?w=500&fit=crop`}
                  alt={item.title}
                  className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                  style={{ minHeight: '180px' }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white/90 text-xs font-bold tracking-wide mb-2">
                    {item.type}
                  </div>
                  <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <button className="flex-1 py-2 bg-white text-slate-900 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors">
                      자세히 보기
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </section>
    </div>
  );
}
