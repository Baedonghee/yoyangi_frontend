import { useState } from 'react';
import { Heart, Clock, MapPin, Star, MessageCircle, ChevronRight, User, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import Slider from 'react-slick';
import { ChevronLeft } from 'lucide-react';

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

export function Profile() {
  const [activeTab, setActiveTab] = useState<'liked' | 'recent'>('liked');

  const userProfile = {
    name: '김요양',
    id: 'yoyang2024',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
  };

  const likedFacilities = [
    {
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
      name: '은빛마을 치매전담 요양원 (자연 친화적 환경과 전문 의료진 상주)',
      region: '경기도 용인시 수지구',
      rating: 4.7,
      reviews: 210,
      images: [
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop',
      ],
      keywords: ['치매전문', '넓은정원', '의료진상주'],
      badge: '인기',
    },
    {
      name: '사랑가득 실버타운',
      region: '부산 해운대구 우동',
      rating: 4.9,
      reviews: 156,
      images: [
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop',
      ],
      keywords: ['오션뷰', '문화프로그램', '호텔식'],
    },
  ];

  const recentFacilities = [
    {
      name: '늘푸른 주야간보호센터',
      region: '경기 성남시 분당구',
      rating: 4.8,
      reviews: 85,
      images: [
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=400&fit=crop',
      ],
      keywords: ['차량운행', '인지재활', '맞춤식단'],
    },
    {
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

  const currentFacilities = activeTab === 'liked' ? likedFacilities : recentFacilities;

  return (
    <div className="w-full flex flex-col bg-gray-50/50 min-h-screen">
      {/* Profile Header Section */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            {/* Profile Image */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src={userProfile.image}
                  alt={userProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-md hover:bg-gray-800 transition-colors">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{userProfile.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 mb-4">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">{userProfile.id}</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl transition-colors">
                  프로필 수정
                </button>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors">
                  설정
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 border-t sm:border-t-0 sm:border-l border-gray-200 pt-6 sm:pt-0 sm:pl-8 w-full sm:w-auto justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{likedFacilities.length}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">좋아요</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{recentFacilities.length}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">최근 본</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex-1 sm:flex-none px-6 py-4 font-bold text-sm sm:text-base transition-all relative ${
                activeTab === 'liked'
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === 'liked' ? 'fill-orange-500' : ''}`} />
                좋아요 한 시설
                <span className="ml-1 px-2 py-0.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-full">
                  {likedFacilities.length}
                </span>
              </div>
              {activeTab === 'liked' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`flex-1 sm:flex-none px-6 py-4 font-bold text-sm sm:text-base transition-all relative ${
                activeTab === 'recent'
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                최근 본 시설
                <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                  {recentFacilities.length}
                </span>
              </div>
              {activeTab === 'recent' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {currentFacilities.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {currentFacilities.map((facility, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-xl border border-gray-200 transition-all duration-300 flex flex-col group min-w-0"
              >
                {/* Image Carousel */}
                <div className="relative bg-gray-100 overflow-hidden flex-shrink-0 slider-container w-full h-[240px] sm:h-[260px]">
                  <Slider {...sliderSettings} className="w-full h-full [&_.slick-track]:flex [&_.slick-track]:h-full [&_.slick-slide]:h-full [&_.slick-slide>div]:h-full [&_.slick-list]:h-full">
                    {facility.images.map((img, i) => (
                      <div key={i} className="h-full outline-none">
                        <img src={img} alt={`${facility.name} ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </Slider>

                  {/* Badges */}
                  <button className="absolute top-2.5 right-2.5 p-2 bg-white/70 hover:bg-white backdrop-blur-sm rounded-full text-red-500 hover:text-red-600 transition-colors z-10 shadow-sm">
                    <Heart className="w-4 h-4 fill-red-500" />
                  </button>
                  {facility.badge && (
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-orange-500 text-white text-[11px] font-black rounded-md shadow-sm z-10">
                      {facility.badge}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-[16px] text-gray-900 leading-snug line-clamp-2 break-keep group-hover:text-orange-600 transition-colors">
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

                  <button className="w-full py-2.5 bg-gray-900 hover:bg-orange-500 text-white text-[14px] font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    바로 상담하기
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'liked' ? (
                <Heart className="w-8 h-8 text-gray-400" />
              ) : (
                <Clock className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <p className="text-gray-500 font-medium text-lg">
              {activeTab === 'liked' ? '좋아요 한 시설이 없습니다' : '최근 본 시설이 없습니다'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
