type NavigationItem = {
  href: string;
  label: string;
  emphasized?: boolean;
};

export const siteConfig = {
  name: "요양이",
  title: "요양이 | 요양시설 찾기의 가장 빠른 시작",
  description:
    "추천 시설, 요양이 TV, 지역별 시설 정보를 빠르게 탐색하고 상담까지 연결하는 요양이 메인입니다.",
  siteUrl: "https://www.yoyangi.co.kr",
  locale: "ko_KR",
  contactEmail: "contact@yoyangi.co.kr",
  customerPhone: "1588-0000",
  customerHours: "평일 09:00 - 18:00",
  serverApiBaseUrl: process.env.YOYANGI_SERVER_API_BASE_URL ?? ""
} as const;

export const globalNavigation: NavigationItem[] = [
  { href: "/guide", label: "가이드" },
  { href: "/login", label: "로그인" },
  { href: "/signup", label: "회원가입" },
  { href: "/partner", label: "입점문의", emphasized: true }
];

export const quickActions = [
  { href: "/counsel", label: "상담하기", icon: "chat" },
  { href: "/youtube", label: "유튜브", icon: "youtube" },
  { href: "/blog", label: "블로그", icon: "blog" }
] as const;

export const footerLinkGroups = [
  {
    title: "회사소개",
    links: [
      { href: "/terms", label: "이용약관" },
      { href: "/privacy", label: "개인정보처리방침" },
      { href: "/guide", label: "요양 가이드" }
    ]
  },
  {
    title: "고객센터",
    links: [
      { href: "/guide", label: "자주 묻는 질문" },
      { href: "/notice", label: "공지사항" },
      { href: "/counsel", label: "1:1 문의" }
    ]
  }
] as const;
