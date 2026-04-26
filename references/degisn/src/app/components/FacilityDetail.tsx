import { useState } from 'react';
import { Heart, Star, MapPin, Phone, Users, Calendar, Wifi, Car, Utensils, Coffee, Award, Play, X, Check, Upload, Image as ImageIcon, TreePine, ChefHat, Droplets, Bath, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CustomArrow = ({ className, style, onClick, direction }: any) => (
  <button
    className={`absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/90 backdrop-blur shadow-lg rounded-full text-gray-700 hover:bg-white transition-all ${
      direction === 'left' ? 'left-3 sm:left-4' : 'right-3 sm:right-4'
    }`}
    style={{ ...style }}
    onClick={(e) => {
      e.stopPropagation();
      e.preventDefault();
      onClick();
    }}
  >
    {direction === 'left' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
  </button>
);

export function FacilityDetail() {
  const [isLiked, setIsLiked] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewImage, setReviewImage] = useState<string | null>(null);

  const facility = {
    name: '프리미엄 노블레스 요양원',
    subtitle: '최신식 VIP실 및 넓은 산책로를 갖춘 프리미엄 요양 시설',
    likes: 248,
    rating: 4.9,
    reviewCount: 128,
    images: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1538356111053-748a48e1acb8?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=1200&h=800&fit=crop',
    ],
    description: '프리미엄 노블레스 요양원은 어르신들의 품격 있는 노후를 위한 최상의 시설과 서비스를 제공합니다. 넓은 정원과 산책로, 최신식 의료 시설, 전문 간호 인력이 24시간 상주하며 어르신들의 건강과 안전을 책임집니다. 개인 맞춤형 케어 프로그램과 다양한 문화 여가 활동으로 삶의 질을 높여드립니다.',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    fees: {
      monthlyFee: '2,500,000원',
      deposit: '10,000,000원',
      mealCost: '300,000원',
      snackCost: '50,000원',
      programCost: '100,000원',
      utilityCost: '150,000원',
      totalMonthly: '3,100,000원',
      phone: '02-1234-5678',
      address: '서울특별시 강남구 역삼동 123-45',
    },
    capacity: {
      approved: 50,
    },
    amenities: [
      { icon: TreePine, label: '산책시설', available: true },
      { icon: ChefHat, label: '직영요리', available: true },
      { icon: Droplets, label: '난방형식', value: '온돌, 난방' },
      { icon: Bath, label: '방마다 화장실', available: true },
      { icon: Wind, label: '방마다 에어컨', available: false },
    ],
    location: {
      lat: 37.4979,
      lng: 127.0276,
    },
  };

  const reviews = [
    {
      id: 1,
      author: '김**',
      rating: 5,
      date: '2026-04-15',
      content: '부모님께서 매우 만족하고 계십니다. 시설도 깨끗하고 직원분들이 친절하세요. 특히 재활 프로그램이 잘 되어있어서 좋습니다.',
      isAnonymous: true,
    },
    {
      id: 2,
      author: '이**',
      rating: 4,
      date: '2026-04-10',
      content: '전반적으로 좋은 시설입니다. 식사도 맛있고 프로그램도 다양해요. 가격은 조금 있지만 그만한 가치가 있다고 생각합니다.',
      isAnonymous: true,
    },
    {
      id: 3,
      author: '박**',
      rating: 5,
      date: '2026-04-05',
      content: '정말 추천합니다. 어머니가 너무 좋아하세요. 간호사 선생님들이 세심하게 케어해주시고, 정원도 넓어서 산책하기 좋아요.',
      isAnonymous: true,
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
      <div style={{ bottom: '20px', position: 'absolute', width: '100%' }}>
        <ul className="m-0 flex justify-center gap-2 p-0"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2.5 h-2.5 rounded-full bg-white/70 hover:bg-white transition-all shadow-sm"></div>
    ),
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReview = () => {
    if (reviewRating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }
    if (reviewContent.trim() === '') {
      alert('후기 내용을 입력해주세요.');
      return;
    }
    // 여기서 실제로는 API 호출
    console.log({ rating: reviewRating, isAnonymous, content: reviewContent, image: reviewImage });
    setIsReviewModalOpen(false);
    setReviewRating(0);
    setIsAnonymous(false);
    setReviewContent('');
    setReviewImage(null);
    alert('후기가 등록되었습니다!');
  };

  return (
    <div className="w-full flex flex-col bg-white min-h-screen">
      {/* Image Slider */}
      <div className="w-full h-[280px] sm:h-[400px] lg:h-[500px] bg-gray-100 relative slider-container">
        <Slider {...sliderSettings} className="w-full h-full [&_.slick-track]:flex [&_.slick-track]:h-full [&_.slick-slide]:h-full [&_.slick-slide>div]:h-full [&_.slick-list]:h-full">
          {facility.images.map((img, i) => (
            <div key={i} className="h-full outline-none">
              <img src={img} alt={`${facility.name} ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </Slider>

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm shadow-lg transition-all z-20 ${
            isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">

        {/* Title & Subtitle */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{facility.name}</h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium">{facility.subtitle}</p>

          {/* Rating & Likes */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="font-bold text-yellow-700">{facility.rating}</span>
              <span className="text-sm text-gray-500">({facility.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="font-bold">{facility.likes + (isLiked ? 1 : 0)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">시설 소개</h2>
          <p className="text-gray-700 leading-relaxed">{facility.description}</p>
        </section>

        {/* YouTube Video */}
        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-orange-500" />
            영상으로 확인하기
          </h2>
          <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-md">
            <iframe
              width="100%"
              height="100%"
              src={facility.youtubeUrl}
              title="시설 소개 영상"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </section>

        {/* Fees */}
        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">시설 이용 요금</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              요양원 입소비는 <span className="font-bold text-gray-900">본인부담금+식비와 간식비+상급병실비용(선택)+이·미용비</span> 입니다.
            </p>
          </div>

          {/* Fees Table */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border-b border-gray-200">등급</th>
                  <th className="px-4 py-3 text-right text-sm font-bold text-gray-900 border-b border-gray-200">1일수가</th>
                  <th className="px-4 py-3 text-right text-sm font-bold text-gray-900 border-b border-gray-200">급여비용 합계</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 border-b border-gray-200">본인부담률</th>
                  <th className="px-4 py-3 text-right text-sm font-bold text-gray-900 border-b border-gray-200">본인부담금</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium border-b border-gray-100">1등급</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-100">81,540원</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-100">2,446,200원</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center border-b border-gray-100">20%</td>
                  <td className="px-4 py-3 text-sm font-bold text-orange-600 text-right border-b border-gray-100">489,240원</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium border-b border-gray-100">2등급</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-100">78,230원</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-100">2,346,900원</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center border-b border-gray-100">20%</td>
                  <td className="px-4 py-3 text-sm font-bold text-orange-600 text-right border-b border-gray-100">469,380원</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium border-b border-gray-100">3등급</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-100">75,120원</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-100">2,253,600원</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center border-b border-gray-100">20%</td>
                  <td className="px-4 py-3 text-sm font-bold text-orange-600 text-right border-b border-gray-100">450,720원</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium border-b border-gray-100">4등급</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-100">69,780원</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right border-b border-gray-100">2,093,400원</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center border-b border-gray-100">20%</td>
                  <td className="px-4 py-3 text-sm font-bold text-orange-600 text-right border-b border-gray-100">418,680원</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">5등급</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">64,270원</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">1,928,100원</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">20%</td>
                  <td className="px-4 py-3 text-sm font-bold text-orange-600 text-right">385,620원</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Notes */}
          <div className="space-y-2 mb-6">
            <p className="text-xs text-gray-600 leading-relaxed">· 본인부담금은 건강보험 공단이 정해놓은 수가(일일 비용)의 20% 이며, 2024년도 공단 수가는 위와 같습니다.</p>
            <p className="text-xs text-gray-600 leading-relaxed">· 이는 국가가 정해놓은 금액이며, 전국 공통입니다.</p>
          </div>

          {/* Calculation Example */}
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5">
            <h3 className="text-base font-bold text-gray-900 mb-3">3~5등급 본인부담금 20% 기준</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <span className="line-through">기본금액 (489,240원)</span>
              </div>
              <div className="text-base font-bold text-gray-900">
                기본금액 (489,240원) + 식비 (360,000원) + 간식비 (36,000원) = <span className="text-xl text-orange-600">885,240원</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600 font-medium">연락처</div>
                <div className="text-base font-bold text-gray-900">{facility.fees.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600 font-medium">주소</div>
                <div className="text-base font-bold text-gray-900">{facility.fees.address}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Capacity */}
        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">허가 인원</h2>
          <div className="bg-gray-50 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">정원</span>
              <span className="text-2xl font-bold text-gray-900">{facility.capacity.approved}명</span>
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">편의 사항</h2>
          <div className="space-y-3">
            {facility.amenities.map((amenity, index) => {
              const Icon = amenity.icon;
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <span className="text-base font-bold text-gray-900">{amenity.label}</span>
                  </div>
                  {amenity.value ? (
                    <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                      {amenity.value}
                    </span>
                  ) : amenity.available ? (
                    <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-bold">제공</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                      <X className="w-4 h-4" />
                      <span className="text-sm font-bold">제공안함</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Location */}
        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">위치</h2>
          <div className="bg-gray-50 rounded-2xl p-5 mb-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-900 font-medium">{facility.fees.address}</p>
              </div>
            </div>
          </div>
          <div className="w-full h-[300px] bg-gray-200 rounded-2xl overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${facility.location.lat},${facility.location.lng}`}
              className="w-full h-full"
            ></iframe>
          </div>
        </section>

        {/* Reviews */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">이용 후기 ({reviews.length})</h2>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors shadow-md"
            >
              후기 작성
            </button>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-600">{review.author}</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{review.author}</div>
                      <div className="text-xs text-gray-500">{review.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-lg border border-yellow-100">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-bold text-yellow-700">{review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.content}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setIsReviewModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white rounded-3xl shadow-2xl z-50 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">이용 후기 작성</h3>
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Rating */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">별점 선택</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= reviewRating
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    {reviewRating > 0 && (
                      <span className="ml-2 text-lg font-bold text-gray-900">{reviewRating}.0</span>
                    )}
                  </div>
                </div>

                {/* Anonymous Checkbox */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                        isAnonymous
                          ? 'bg-orange-500 border-orange-500'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {isAnonymous && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-sm font-medium text-gray-700">익명으로 작성하기</span>
                  </label>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">사진 첨부 (선택)</label>
                  {reviewImage ? (
                    <div className="relative">
                      <img src={reviewImage} alt="Review" className="w-full h-48 object-cover rounded-xl border border-gray-200" />
                      <button
                        onClick={() => setReviewImage(null)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors">
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 font-medium">사진을 선택해주세요</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">후기 내용</label>
                  <textarea
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="시설 이용 경험을 자세히 작성해주세요."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900"
                  />
                  <div className="text-xs text-gray-500 mt-2 text-right">
                    {reviewContent.length} / 500자
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-md"
                >
                  등록하기
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
