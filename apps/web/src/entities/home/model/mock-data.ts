import type {
  HomeCategory,
  HomePageData,
  RecommendedFacility
} from "@/entities/home/model/types";

export const homeCategories: HomeCategory[] = [
  { id: "religion", label: "종교시설", href: "/cares?themes=RE", icon: "RE", tone: "orange" },
  { id: "premium", label: "프리미엄", href: "/cares?themes=PR", icon: "PR", tone: "green" },
  { id: "economy", label: "경제적인", href: "/cares?themes=EC", icon: "EC", tone: "blue" },
  { id: "nursing", label: "간호특화", href: "/cares?themes=NU", icon: "NU", tone: "purple" },
  { id: "cooking", label: "직영조리", href: "/cares?themes=CK", icon: "CK", tone: "teal" },
  { id: "rehabilitation", label: "재활치료", href: "/cares?themes=RH", icon: "RH", tone: "pink" },
  { id: "manpower", label: "인력가산", href: "/cares?themes=LA", icon: "LA", tone: "yellow" },
  { id: "program", label: "프로그램", href: "/cares?themes=PG", icon: "PG", tone: "indigo" },
  { id: "downtown", label: "도심인접", href: "/cares?themes=DT", icon: "DT", tone: "rose" },
  { id: "walk", label: "산책/텃밭", href: "/cares?themes=WK", icon: "WK", tone: "gray" }
];

export const mockHomePageData: HomePageData = {
  seo: {
    title: "요양이 | 요양시설 찾기의 가장 빠른 시작",
    description:
      "상단 배너, 카테고리 탐색, 요양이 TV, 지역별 시설 정보를 SSR로 제공하는 요양이 메인 화면입니다.",
    keywords: [
      "요양이",
      "요양시설",
      "요양원",
      "주야간보호",
      "요양병원",
      "요양이 TV",
      "지역별 시설"
    ],
    canonicalPath: "/",
    ogImage:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1600&h=900&fit=crop"
  },
  heroBanners: [
    {
      id: "family-choice",
      title: "우리 가족을 위한 최고의 선택",
      description: "안심하고 맡길 수 있는 요양시설을 빠르게 비교하고 상담까지 연결하세요.",
      imageUrl:
        "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1600&h=700&fit=crop",
      href: "/search",
      ctaLabel: "시설 찾기"
    },
    {
      id: "partner-onboarding",
      title: "입점 및 상담 무료 지원",
      description: "요양이와 함께 성장할 시설 파트너를 위해 메인 노출과 상담 연결 흐름을 준비했습니다.",
      imageUrl:
        "https://images.unsplash.com/photo-1516302752946-609c471d2c60?w=1600&h=700&fit=crop",
      href: "/partner",
      ctaLabel: "입점 문의"
    },
    {
      id: "regional-discovery",
      title: "지역별 시설을 한 번에 탐색",
      description: "서울, 경기, 인천부터 주요 권역까지 지역 중심으로 시설 흐름을 빠르게 확인할 수 있습니다.",
      imageUrl:
        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1600&h=700&fit=crop",
      href: "/regions",
      ctaLabel: "지역별 보기"
    }
  ],
  categories: homeCategories,
  tvItems: [
    {
      id: "tv-1",
      title: "치매 예방을 위한 하루 10분 운동법",
      views: "조회수 1.2만",
      imageUrl:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop",
      href: "/tv"
    },
    {
      id: "tv-2",
      title: "좋은 요양원 선택하는 5가지 기준",
      views: "조회수 3.4만",
      imageUrl:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=450&fit=crop",
      href: "/tv"
    },
    {
      id: "tv-3",
      title: "국가지원금 100% 활용하기",
      views: "조회수 5.8만",
      imageUrl:
        "https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=800&h=450&fit=crop",
      href: "/tv"
    },
    {
      id: "tv-4",
      title: "어르신들이 좋아하는 식단 모음",
      views: "조회수 2.1만",
      imageUrl:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=450&fit=crop",
      href: "/tv"
    }
  ],
  regionalFacilities: [
    {
      id: "seoul",
      title: "서울",
      summary: "서울권 시설 찾아보기",
      imageUrl:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=760&fit=crop",
      href: "/regions"
    },
    {
      id: "gyeonggi",
      title: "경기",
      summary: "경기권 시설 찾아보기",
      imageUrl:
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=760&fit=crop",
      href: "/regions"
    },
    {
      id: "incheon",
      title: "인천",
      summary: "인천권 시설 찾아보기",
      imageUrl:
        "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&h=760&fit=crop",
      href: "/regions"
    },
    {
      id: "busan",
      title: "부산",
      summary: "부산권 시설 찾아보기",
      imageUrl:
        "https://images.unsplash.com/photo-1538356111053-748a48e1acb8?w=600&h=760&fit=crop",
      href: "/regions"
    },
    {
      id: "daegu",
      title: "대구",
      summary: "대구권 시설 찾아보기",
      imageUrl:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=760&fit=crop",
      href: "/regions"
    },
    {
      id: "daejeon",
      title: "대전",
      summary: "대전권 시설 찾아보기",
      imageUrl:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=760&fit=crop",
      href: "/regions"
    }
  ]
};

export const mockRecommendedFacilities: RecommendedFacility[] = [
  {
    id: "facility-1",
    name: "행복한 노인요양원",
    location: "서울 강남구",
    rating: 4.8,
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=520&fit=crop",
    href: "/facility/1",
    badge: "추천",
    consultationLabel: "상담 가능"
  },
  {
    id: "facility-2",
    name: "늘푸른 주야간보호센터",
    location: "경기 성남시",
    rating: 4.9,
    imageUrl:
      "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800&h=520&fit=crop",
    href: "/facility/2",
    badge: "추천",
    consultationLabel: "상담 가능"
  },
  {
    id: "facility-3",
    name: "은빛마을 요양원",
    location: "부산 해운대구",
    rating: 4.7,
    imageUrl:
      "https://images.unsplash.com/photo-1538356111053-748a48e1acb8?w=800&h=520&fit=crop",
    href: "/facility/3",
    badge: "추천",
    consultationLabel: "상담 가능"
  },
  {
    id: "facility-4",
    name: "사랑가득 실버타운",
    location: "대구 수성구",
    rating: 4.9,
    imageUrl:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=520&fit=crop",
    href: "/facility/4",
    badge: "추천",
    consultationLabel: "상담 가능"
  },
  {
    id: "facility-5",
    name: "편안한 노인케어",
    location: "인천 연수구",
    rating: 4.6,
    imageUrl:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=520&fit=crop",
    href: "/facility/5",
    badge: "추천",
    consultationLabel: "상담 가능"
  }
];
