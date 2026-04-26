import { useState, useRef, useEffect } from 'react';
import { MapPin, Star, Filter, Heart, SlidersHorizontal, ChevronDown, MessageCircle, ChevronLeft, ChevronRight, LayoutGrid, List, Phone, Building2 } from 'lucide-react';
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

export function SearchResults() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [premiumPage, setPremiumPage] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedType, setSelectedType] = useState('전체');
  const [selectedGrade, setSelectedGrade] = useState('전체');
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [gradeDropdownOpen, setGradeDropdownOpen] = useState(false);

  const regionRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const gradeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(event.target as Node)) {
        setRegionDropdownOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setTypeDropdownOpen(false);
      }
      if (gradeRef.current && !gradeRef.current.contains(event.target as Node)) {
        setGradeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [premiumPage]);

  const itemsPerPage = 9;

  const categories = ['전체', '요양원', '주야간보호', '방문요양', '요양병원', '방문간호', '단기보호', '치매전담'];

  const regions = ['전체', '서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
  const types = ['전체', '민간', '법인', '국공립', '개인'];
  const grades = ['전체', 'A등급', 'B등급', 'C등급', 'D등급', 'E등급'];

  const listings = [
    {
      name: '프리미엄 노블레스 요양원 (최신식 VIP실 및 넓은 산책로 보유)',
      region: '서울 강남구 역삼동',
      rating: 4.9,
      reviews: 128,
      isPremium: true,
      images: [
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1538356111053-748a48e1acb8?w=600&h=400&fit=crop',
      ],
      keywords: ['프리미엄', '재활특화', '도심형'],
      badge: '추천',
    },
    {
      name: '늘푸른 주야간보호센터',
      region: '경기 성남시 분당구',
      rating: 4.8,
      reviews: 85,
      isPremium: true,
      images: [
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=400&fit=crop',
      ],
      keywords: ['차량운행', '인지재활', '맞춤식단'],
    },
    {
      name: '은빛마을 치매전담 요양원 (자연 친화적 환경과 전문 의료진 상주)',
      region: '경기도 용인시 수지구',
      rating: 4.7,
      reviews: 210,
      isPremium: true,
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
      isPremium: true,
      images: [
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop',
      ],
      keywords: ['오션뷰', '문화프로그램', '호텔식'],
    },
    {
      name: '한결 프리미엄 요양원',
      region: '서울 서초구 반포동',
      rating: 4.8,
      reviews: 92,
      isPremium: true,
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
      isPremium: true,
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
      isPremium: true,
      images: [
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1587578931567-4763999cc1d5?w=600&h=400&fit=crop',
      ],
      keywords: ['조용함', '공원인접', '산책코스'],
    },
    {
      name: '그린 라이프 시니어타운',
      region: '경기 화성시 동탄신도시',
      rating: 4.8,
      reviews: 143,
      isPremium: true,
      images: [
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop',
      ],
      keywords: ['신축', '친환경', '문화생활'],
      badge: '인기',
    },
    {
      name: '해맞이 실버홈',
      region: '강원 강릉시 강문동',
      rating: 4.7,
      reviews: 89,
      isPremium: true,
      images: [
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12?w=600&h=400&fit=crop',
      ],
      keywords: ['바다전망', '힐링', '요양치료'],
    },
    {
      name: '행복한 동행 방문요양',
      region: '서울 강북구 미아동',
      rating: 4.8,
      reviews: 42,
      isPremium: false,
      images: [],
      keywords: ['방문목욕', '가사지원', '병원동행'],
      phone: '02-987-6543'
    },
    {
      name: '소망 노인요양공동생활가정',
      region: '경기도 부천시 원미구',
      rating: 4.5,
      reviews: 12,
      isPremium: false,
      images: [],
      keywords: ['소수정예', '가정식', '안락함'],
      phone: '032-123-4567'
    },
    {
      name: '늘솜 데이케어센터',
      region: '인천 남동구 구월동',
      rating: 4.7,
      reviews: 28,
      isPremium: false,
      images: [],
      keywords: ['인지치료', '차량운행', '물리치료'],
      phone: '032-987-1234'
    },
    {
      name: '사랑채 방문간호센터',
      region: '서울 노원구 상계동',
      rating: 4.6,
      reviews: 35,
      isPremium: false,
      images: [],
      keywords: ['전문간호', '재활운동', '건강관리'],
      phone: '02-456-7890'
    },
    {
      name: '다정 주야간보호센터',
      region: '경기 안양시 동안구',
      rating: 4.5,
      reviews: 21,
      isPremium: false,
      images: [],
      keywords: ['치매케어', '노인돌봄', '식사제공'],
      phone: '031-234-5678'
    },
    {
      name: '금빛 요양보호',
      region: '부산 동래구 온천동',
      rating: 4.7,
      reviews: 18,
      isPremium: false,
      images: [],
      keywords: ['방문요양', '활동보조', '생활지원'],
      phone: '051-789-0123'
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

  // 프리미엄 시설과 일반 시설 분리
  const premiumListings = listings.filter(item => item.isPremium);
  const basicListings = listings.filter(item => !item.isPremium);

  // 프리미엄 시설 페이징
  const totalPremiumPages = Math.ceil(premiumListings.length / itemsPerPage);
  const startIndex = (premiumPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPremiumListings = premiumListings.slice(startIndex, endIndex);

  return (
    <div className="w-full flex flex-col bg-gray-50/50 min-h-screen">
      
      {/* Top Filter Bar */}
      <div className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 pb-4">

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-bold rounded-full transition-all ${
                  activeCategory === category
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sub Filters & View Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-0.5">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
              {/* Region Dropdown */}
              <div ref={regionRef} className="relative flex-shrink-0">
                <button
                  onClick={() => {
                    setRegionDropdownOpen(!regionDropdownOpen);
                    setTypeDropdownOpen(false);
                    setGradeDropdownOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-orange-500" />
                  {selectedRegion === '전체' ? '지역 선택' : selectedRegion}
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${regionDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {regionDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-[100] max-h-64 overflow-y-auto">
                    {regions.map((region) => (
                      <button
                        key={region}
                        onClick={() => {
                          setSelectedRegion(region);
                          setRegionDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                          selectedRegion === region ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                <SlidersHorizontal className="w-4 h-4 text-gray-500" /> 상세 조건
              </button>

              {/* Type Dropdown */}
              <div ref={typeRef} className="relative flex-shrink-0 hidden sm:block">
                <button
                  onClick={() => {
                    setTypeDropdownOpen(!typeDropdownOpen);
                    setRegionDropdownOpen(false);
                    setGradeDropdownOpen(false);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {selectedType === '전체' ? '설립유형' : selectedType}
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${typeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {typeDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-[100]">
                    {types.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedType(type);
                          setTypeDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                          selectedType === type ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Grade Dropdown */}
              <div ref={gradeRef} className="relative flex-shrink-0 hidden sm:block">
                <button
                  onClick={() => {
                    setGradeDropdownOpen(!gradeDropdownOpen);
                    setRegionDropdownOpen(false);
                    setTypeDropdownOpen(false);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {selectedGrade === '전체' ? '평가등급' : selectedGrade}
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${gradeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {gradeDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-[100]">
                    {grades.map((grade) => (
                      <button
                        key={grade}
                        onClick={() => {
                          setSelectedGrade(grade);
                          setGradeDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                          selectedGrade === grade ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Desktop View Controls */}
            <div className="hidden sm:flex items-center gap-4 flex-shrink-0 ml-4">
              <div className="text-sm font-medium text-gray-500">
                총 <span className="font-bold text-orange-500 mx-0.5">{premiumListings.length + basicListings.length}</span>개의 시설
              </div>
              <div className="h-4 w-px bg-gray-200"></div>
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
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full">
        
        {/* Mobile View Controls */}
        <div className="sm:hidden flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-gray-500">
            총 <span className="font-bold text-orange-500">{premiumListings.length + basicListings.length}</span>개의 시설
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200/50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Premium Facilities Section */}
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
          {currentPremiumListings.map((listing, index) => (
            /* --- PREMIUM FACILITY CARD (WITH IMAGES) --- */
            <motion.div
              key={index}
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
                    {listing.images.map((img, i) => (
                      <div key={i} className="h-full outline-none">
                        <img src={img} alt={`${listing.name} ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </Slider>
                  
                  {/* Badges */}
                  <button className="absolute top-2.5 right-2.5 p-2 bg-white/70 hover:bg-white backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors z-10 shadow-sm">
                    <Heart className="w-4 h-4" />
                  </button>
                  {listing.badge && (
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-orange-500 text-white text-[11px] font-black rounded-md shadow-sm z-10">
                      {listing.badge}
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className={`p-4 flex flex-col flex-1 ${viewMode === 'list' ? 'justify-center' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-[16px] text-gray-900 leading-snug line-clamp-2 break-keep group-hover:text-orange-600 transition-colors">
                      {listing.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg flex-shrink-0 border border-yellow-100">
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs font-bold text-yellow-700">{listing.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                    <span className="truncate">{listing.region}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                    {listing.keywords.map((kw, idx) => (
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

        {/* Premium Pagination */}
        {totalPremiumPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-8 mb-6">
            <button
              onClick={() => setPremiumPage(Math.max(1, premiumPage - 1))}
              disabled={premiumPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPremiumPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setPremiumPage(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all shadow-sm ${
                  premiumPage === page
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setPremiumPage(Math.min(totalPremiumPages, premiumPage + 1))}
              disabled={premiumPage === totalPremiumPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Basic Facilities Section */}
        {basicListings.length > 0 && (
          <>
            <div className="flex items-center gap-3 mb-4 mt-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
              <div className="text-sm font-bold text-gray-500 px-4">기타 시설 정보</div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
              {basicListings.map((listing, index) => (
                /* --- BASIC FACILITY CARD (NO IMAGES) --- */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={index}
                  className={`bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-lg border border-gray-200 transition-all duration-300 flex flex-col group min-w-0 ${
                    viewMode === 'list' ? 'sm:flex-row sm:items-center justify-between gap-4' : 'gap-3'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 flex-shrink-0 group-hover:bg-orange-50 transition-colors shadow-inner">
                      <Building2 className="w-6 h-6 text-gray-400 group-hover:text-orange-400 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-[15px] sm:text-[16px] text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                          {listing.name}
                        </h3>
                        {listing.rating && (
                          <span className="flex items-center gap-0.5 text-[11px] font-bold text-yellow-700 bg-yellow-50 border border-yellow-100 px-1.5 py-0.5 rounded-md">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {listing.rating}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{listing.region}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {listing.keywords.map((kw, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 bg-gray-50 text-gray-600 text-[11px] font-medium rounded-md border border-gray-100">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={`flex gap-2 ${viewMode === 'list' ? 'w-full sm:w-auto mt-0 sm:mt-0 flex-row sm:flex-col' : 'w-full mt-0'}`}>
                    <button className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 bg-white border border-gray-300 hover:border-orange-500 hover:bg-orange-50 text-gray-700 hover:text-orange-600 text-[13px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5">
                      <Phone className="w-4 h-4" /> 전화상담
                    </button>
                    {viewMode === 'list' && (
                      <button className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-[13px] font-bold rounded-xl transition-colors flex items-center justify-center">
                        상세보기
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
