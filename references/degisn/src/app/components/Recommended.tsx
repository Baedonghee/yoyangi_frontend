import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Star, MapPin, Heart, MessageCircle, Award, LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import Slider from 'react-slick';

const CustomArrow = ({ className, style, onClick, direction }: any) => (
  <button
    className={`absolute top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur shadow-sm rounded-full text-gray-700 hover:bg-white transition-all opacity-0 group-hover:opacity-100 ${
      direction === 'left' ? 'left-2' : 'right-2'
    }`}
    style={{ ...style }}
    onClick={(e) => {
      e.stopPropagation();
      e.preventDefault();
      onClick();
    }}
  >
    {direction === 'left' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
  </button>
);

export function Recommended() {
  const navigate = useNavigate();
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const toggleLike = (id: number) => {
    setLikedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const facilities = [
    {
      id: 1,
      name: '프리미엄 노블레스 요양원 (최신식 VIP실 및 넓은 산책로 보유)',
      region: '서울 강남구 역삼동',
      rating: 4.9,
      reviews: 128,
      images: [
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1538356111053-748a48e1acb8?w=600&h=400&fit=crop',
      ],
      keywords: ['프리미엄', '재활특화', '도심형'],
      badge: '추천',
    },
    {
      id: 2,
      name: '늘푸른 주야간보호센터',
      region: '경기 성남시 분당구',
      rating: 4.8,
      reviews: 85,
      images: [
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=400&fit=crop',
      ],
      keywords: ['차량운행', '인지재활', '맞춤식단'],
      badge: '인기',
    },
    {
      id: 3,
      name: '은빛마을 치매전담 요양원 (자연 친화적 환경과 전문 의료진 상주)',
      region: '경기도 용인시 수지구',
      rating: 4.7,
      reviews: 210,
      images: [
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop',
      ],
      keywords: ['치매전문', '넓은정원', '의료진상주'],
      badge: '추천',
    },
    {
      id: 4,
      name: '사랑가득 실버타운',
      region: '부산 해운대구 우동',
      rating: 4.9,
      reviews: 156,
      images: [
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop',
      ],
      keywords: ['오션뷰', '문화프로그램', '호텔식'],
      badge: '인기',
    },
    {
      id: 5,
      name: '한결 프리미엄 요양원',
      region: '서울 서초구 반포동',
      rating: 4.8,
      reviews: 92,
      images: [
        'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=600&h=400&fit=crop',
      ],
      keywords: ['한강뷰', '고급식단', '24시간간호'],
      badge: '추천',
    },
    {
      id: 6,
      name: '청담 케어 센터',
      region: '서울 강남구 청담동',
      rating: 4.9,
      reviews: 164,
      images: [
        'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&h=400&fit=crop',
      ],
      keywords: ['럭셔리', '개인실', '프리미엄서비스'],
    },
    {
      id: 7,
      name: '평화로운 노후 요양원',
      region: '경기 고양시 일산동구',
      rating: 4.6,
      reviews: 78,
      images: [
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1587578931567-4763999cc1d5?w=600&h=400&fit=crop',
      ],
      keywords: ['조용함', '공원인접', '산책코스'],
    },
    {
      id: 8,
      name: '그린 라이프 시니어타운',
      region: '경기 화성시 동탄신도시',
      rating: 4.8,
      reviews: 143,
      images: [
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop',
      ],
      keywords: ['신축', '친환경', '문화생활'],
      badge: '인기',
    },
    {
      id: 9,
      name: '해맞이 실버홈',
      region: '강원 강릉시 강문동',
      rating: 4.7,
      reviews: 89,
      images: [
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12?w=600&h=400&fit=crop',
      ],
      keywords: ['바다전망', '힐링', '요양치료'],
    },
    {
      id: 10,
      name: '행복마을 케어센터',
      region: '인천 연수구 송도동',
      rating: 4.8,
      reviews: 67,
      images: [
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1587578931567-4763999cc1d5?w=600&h=400&fit=crop',
      ],
      keywords: ['가족같은', '소규모', '정성케어'],
      badge: '추천',
    },
    {
      id: 11,
      name: '숲속의 요양원',
      region: '경기 가평군 청평면',
      rating: 4.6,
      reviews: 54,
      images: [
        'https://images.unsplash.com/photo-1587578931567-4763999cc1d5?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&h=400&fit=crop',
      ],
      keywords: ['자연힐링', '산림욕', '청정지역'],
    },
    {
      id: 12,
      name: '도담도담 실버하우스',
      region: '경기 수원시 영통구',
      rating: 4.7,
      reviews: 73,
      images: [
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=600&h=400&fit=crop',
      ],
      keywords: ['따뜻한돌봄', '정성케어', '가정식'],
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
    appendDots: (dots: any) => (
      <div style={{ bottom: '10px', position: 'absolute', width: '100%' }}>
        <ul className="m-0 flex justify-center gap-1.5 p-0"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2 h-2 rounded-full bg-white/60 hover:bg-white transition-all"></div>
    ),
  };

  return (
    <div className="w-full flex flex-col bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">요양이 추천 시설</h1>
          </motion.div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* View Controls */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            총 <span className="font-bold text-orange-500">{facilities.length}</span>개의 추천 시설
          </p>
          <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200/50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              title="그리드 뷰"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              title="리스트 뷰"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-xl border border-gray-200 transition-all duration-300 flex group min-w-0 ${
                viewMode === 'list' ? 'flex-col sm:flex-row' : 'flex-col'
              }`}
            >
              {/* Image Carousel Area */}
              <div className={`relative bg-gray-100 overflow-hidden flex-shrink-0 slider-container ${
                viewMode === 'list' ? 'w-full sm:w-[280px] h-[240px] sm:h-[200px]' : 'w-full h-[240px] sm:h-[260px]'
              }`}>
                <Slider {...sliderSettings} className="w-full h-full [&_.slick-track]:flex [&_.slick-track]:h-full [&_.slick-slide]:h-full [&_.slick-slide>div]:h-full [&_.slick-list]:h-full">
                  {facility.images.map((img, i) => (
                    <div key={i} className="h-full outline-none">
                      <img src={img} alt={`${facility.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </Slider>

                {/* Badges */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(facility.id);
                  }}
                  className={`absolute top-2.5 right-2.5 p-2 backdrop-blur-sm rounded-full transition-colors z-10 shadow-sm ${
                    likedItems.includes(facility.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/70 text-gray-400 hover:bg-white hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedItems.includes(facility.id) ? 'fill-red-500' : ''}`} />
                </button>
                {facility.badge && (
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-orange-500 text-white text-[11px] font-black rounded-md shadow-sm z-10">
                    {facility.badge}
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className={`p-4 flex flex-col flex-1 ${viewMode === 'list' ? 'justify-center' : ''}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-[16px] text-gray-900 leading-snug line-clamp-2 break-keep group-hover:text-orange-600 transition-colors cursor-pointer"
                      onClick={() => navigate(`/facility/${facility.id}`)}>
                    {facility.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg flex-shrink-0 border border-yellow-100">
                    <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-bold text-yellow-700">{facility.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                  <span className="truncate">{facility.region}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                  {facility.keywords.map((kw, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-orange-50 text-orange-600 text-[11px] font-bold rounded-md border border-orange-100">
                      {kw}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => navigate(`/facility/${facility.id}`)}
                  className="w-full py-2.5 bg-gray-900 hover:bg-orange-500 text-white text-[14px] font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  바로 상담하기
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
