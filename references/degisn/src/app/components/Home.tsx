import { Home as HomeIcon, MapPin, Building2, UserPlus, Heart, Stethoscope, BedDouble, Plus, ArrowRight, Play, Star, ChevronLeft, ChevronRight, CalendarClock, ShieldCheck } from 'lucide-react';
import Slider from 'react-slick';
import { motion } from 'motion/react';

import { useNavigate } from 'react-router';

const CustomArrow = ({ className, style, onClick, direction }: any) => (
  <button
    className={`absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur shadow-md rounded-full text-gray-700 hover:bg-orange-500 hover:text-white transition-all ${
      direction === 'left' ? '-left-4 lg:-left-5' : '-right-4 lg:-right-5'
    }`}
    style={{ ...style }}
    onClick={onClick}
  >
    {direction === 'left' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
  </button>
);

export function Home() {
  const navigate = useNavigate();

  const bannerSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    appendDots: (dots: any) => (
      <div style={{ bottom: '20px' }}>
        <ul className="m-0 flex justify-center gap-2"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2.5 h-2.5 rounded-full bg-white/50 hover:bg-white/90 transition-all cursor-pointer"></div>
    ),
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1.2, arrows: false, centerMode: false } },
    ],
  };

  const categories = [
    { icon: Building2, label: '요양원', color: 'bg-orange-100 text-orange-600' },
    { icon: HomeIcon, label: '주야간보호', color: 'bg-green-100 text-green-600' },
    { icon: UserPlus, label: '방문요양', color: 'bg-blue-100 text-blue-600' },
    { icon: BedDouble, label: '요양병원', color: 'bg-purple-100 text-purple-600' },
    { icon: Stethoscope, label: '방문간호', color: 'bg-teal-100 text-teal-600' },
    { icon: Heart, label: '방문목욕', color: 'bg-pink-100 text-pink-600' },
    { icon: MapPin, label: '복지용구', color: 'bg-yellow-100 text-yellow-600' },
    { icon: CalendarClock, label: '단기보호', color: 'bg-indigo-100 text-indigo-600' },
    { icon: ShieldCheck, label: '치매전담', color: 'bg-rose-100 text-rose-600' },
    { icon: Plus, label: '전체보기', color: 'bg-gray-100 text-gray-600' },
  ];

  const recommendedFacilities = [
    { name: '행복한 노인요양원', location: '서울 강남구', rating: 4.8, img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop' },
    { name: '늘푸른 주야간보호센터', location: '경기 성남시', rating: 4.9, img: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&h=400&fit=crop' },
    { name: '은빛마을 요양원', location: '부산 해운대구', rating: 4.7, img: 'https://images.unsplash.com/photo-1538356111053-748a48e1acb8?w=600&h=400&fit=crop' },
    { name: '사랑가득 실버타운', location: '대구 수성구', rating: 4.9, img: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop' },
    { name: '편안한 노인케어', location: '인천 연수구', rating: 4.6, img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=400&fit=crop' },
  ];

  const tvItems = [
    { title: '치매 예방을 위한 하루 10분 운동법', views: '1.2만', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop' },
    { title: '좋은 요양원 선택하는 5가지 기준', views: '3.4만', img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop' },
    { title: '국가지원금 100% 활용하기', views: '5.8만', img: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=600&h=400&fit=crop' },
    { title: '어르신들이 좋아하는 식단 모음', views: '2.1만', img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop' },
    { title: '보호자를 위한 힐링 명상', views: '8천', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 pb-16 pt-0">
      
      {/* Top Rolling Banner */}
      <section className="relative w-full">
        <Slider {...bannerSettings} className="w-full rounded-none sm:rounded-3xl overflow-hidden mt-0 sm:mt-6">
          <div className="relative h-[240px] sm:h-[400px] outline-none">
            <img src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1600&h=600&fit=crop" className="w-full h-full object-cover" alt="Banner 1" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <div className="px-6 sm:px-12">
                <h2 className="text-white text-2xl sm:text-4xl font-black mb-2 sm:mb-4 leading-tight">우리 가족을 위한<br/>최고의 선택</h2>
                <p className="text-white/90 text-sm sm:text-lg font-medium">안심하고 맡길 수 있는 요양시설을 찾아보세요</p>
              </div>
            </div>
          </div>
          <div className="relative h-[240px] sm:h-[400px] outline-none">
            <img src="https://images.unsplash.com/photo-1516302752946-609c471d2c60?w=1600&h=600&fit=crop" className="w-full h-full object-cover" alt="Banner 2" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <div className="px-6 sm:px-12">
                <h2 className="text-white text-2xl sm:text-4xl font-black mb-2 sm:mb-4 leading-tight">입점 및 상담<br/>무료 지원</h2>
                <p className="text-white/90 text-sm sm:text-lg font-medium">요양이와 함께 성장할 파트너를 모십니다</p>
              </div>
            </div>
          </div>
        </Slider>
      </section>

      {/* Categories */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-5 lg:grid-cols-10 gap-2 sm:gap-4">
          {categories.map((category, index) => (
            <motion.button
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              key={index}
              onClick={() => navigate('/search')}
              className="flex flex-col items-center gap-2 sm:gap-3 p-1 sm:p-2 group"
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-[1rem] sm:rounded-2xl ${category.color} flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md`}>
                <category.icon className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <span className="text-[11px] sm:text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors whitespace-nowrap">
                {category.label}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-3 w-full bg-gray-50 my-8 hidden sm:block"></div>

      {/* Recommended Facilities */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">요양이 추천시설</h2>
          <button onClick={() => navigate('/recommended')} className="text-sm font-bold text-gray-500 hover:text-orange-500 flex items-center gap-1 transition-colors">
            전체보기 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="relative mx-[-8px] px-2 sm:mx-0 sm:px-0">
          <Slider {...sliderSettings}>
            {recommendedFacilities.map((item, index) => (
              <div key={index} className="px-2 sm:px-3 outline-none">
                <div
                  onClick={() => navigate(`/facility/${index + 1}`)}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-3 right-3 p-2 bg-white/50 backdrop-blur rounded-full hover:bg-white hover:text-red-500 transition-colors text-gray-600"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-sm">
                      추천
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 truncate group-hover:text-orange-500 transition-colors">{item.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500 mb-3">
                      <MapPin className="w-4 h-4 text-orange-400" /> {item.location}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-gray-800">{item.rating}</span>
                      </div>
                      <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">상담 가능</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Yoyangi TV */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">요양이 TV</h2>
          <button className="text-sm font-bold text-gray-500 hover:text-orange-500 flex items-center gap-1 transition-colors">
            전체보기 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="relative mx-[-8px] px-2 sm:mx-0 sm:px-0">
          <Slider {...sliderSettings}>
            {tvItems.map((item, index) => (
              <div key={index} className="px-2 sm:px-3 outline-none">
                <div className="group rounded-3xl overflow-hidden cursor-pointer">
                  <div className="relative aspect-video overflow-hidden rounded-3xl shadow-sm group-hover:shadow-lg transition-all duration-300">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-300">
                        <Play className="w-5 h-5 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 px-1">
                    <h3 className="font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors">{item.title}</h3>
                    <p className="text-sm font-medium text-gray-500 mt-2">조회수 {item.views}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Facilities by Region */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">지역별 시설</h2>
          <button onClick={() => navigate('/search')} className="text-sm font-bold text-gray-500 hover:text-orange-500 flex items-center gap-1 transition-colors">
            전체보기 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="relative mx-[-8px] px-2 sm:mx-0 sm:px-0">
          <Slider {...sliderSettings}>
            {['서울', '경기', '인천', '부산', '대구', '대전'].map((region, index) => (
              <div key={index} className="px-2 sm:px-3 outline-none">
                <div onClick={() => navigate('/search')} className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
                  <img src={`https://images.unsplash.com/photo-${1506126613408 + index * 100}?w=400&h=500&fit=crop`} alt={region} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-black text-white mb-1">{region}</h3>
                    <p className="text-white/80 text-sm font-bold flex items-center gap-1 group-hover:text-orange-300 transition-colors">
                      시설 찾아보기 <ArrowRight className="w-4 h-4" />
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

    </div>
  );
}
