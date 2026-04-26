import { useNavigate } from 'react-router';
import { ChevronLeft, Clock, Eye, BookOpen, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export function GuideDetail() {
  const navigate = useNavigate();

  const guide = {
    id: 1,
    title: '요양원 입소 준비 가이드',
    date: '2026-04-15',
    views: 1240,
    content: `
요양원 입소는 어르신과 가족 모두에게 중요한 결정입니다. 원활한 입소를 위해 미리 준비해야 할 사항들을 안내해드립니다.

## 1. 필요 서류 준비

요양원 입소 시 반드시 준비해야 하는 서류들입니다:

### 필수 서류
- 장기요양인정서 원본
- 주민등록등본 (최근 3개월 이내 발급)
- 건강보험증 사본
- 의료급여증 사본 (해당자에 한함)
- 신분증 사본
- 최근 건강검진 결과지 (6개월 이내)

### 추가 서류
- 예방접종증명서 (독감, 폐렴구균 등)
- 복용 중인 약물 리스트
- 진료기록지 (있는 경우)
- 보호자 신분증 사본

## 2. 입소 전 상담

입소 전에 시설과 충분한 상담을 진행하는 것이 중요합니다.

### 확인해야 할 사항
- 월 이용료 및 추가 비용 안내
- 식사 제공 방식 및 메뉴
- 의료 서비스 제공 범위
- 프로그램 운영 현황
- 면회 시간 및 규정
- 외출·외박 규정

### 시설 둘러보기
실제로 시설을 방문하여 다음 사항들을 확인해보세요:
- 시설의 청결 상태
- 거주 공간의 편의성
- 직원들의 친절도
- 다른 어르신들의 생활 모습
- 안전시설 구비 여부

## 3. 개인 물품 준비

입소 시 가져가야 할 개인 물품들입니다.

### 의류
- 편안한 일상복 (5~7벌)
- 속옷 및 양말 (충분한 양)
- 외출복 1~2벌
- 계절에 맞는 외투
- 실내화 및 운동화

### 위생용품
- 칫솔, 치약, 비누
- 샴푸, 린스, 바디워시
- 수건 (3~5장)
- 휴지, 물티슈
- 개인 위생용품

### 기타 물품
- 안경, 보청기 (사용자)
- 틀니 보관함
- 사진 앨범 (추억의 사진들)
- 좋아하는 소품이나 장식품
- 개인 약품 (의사 처방)

## 4. 적응 기간

입소 후 적응 기간 동안 주의할 점들입니다.

### 초기 2주
- 잦은 면회보다는 시설 생활에 적응할 시간을 주세요
- 전화 통화로 안부를 확인하세요
- 직원들과 소통하며 어르신의 상태를 파악하세요

### 1개월 후
- 정기적인 면회 일정을 정하세요
- 어르신의 생활 패턴 변화를 관찰하세요
- 필요한 물품이나 서비스를 추가로 요청하세요

## 5. 가족의 역할

입소 후에도 가족의 관심과 사랑이 매우 중요합니다.

### 정기적인 소통
- 주 1~2회 전화 통화
- 월 2~4회 정기 면회
- 명절이나 생신 등 특별한 날 방문

### 시설과의 협력
- 어르신의 건강 상태 공유
- 선호하는 음식이나 활동 알려주기
- 건의사항이나 불편사항 전달
- 시설 행사나 프로그램 참여

## 6. 비용 관리

입소 비용에 대한 이해와 관리가 필요합니다.

### 월 정기 비용
- 본인부담금 (등급별 차등)
- 식비 및 간식비
- 관리비
- 기타 프로그램 비용

### 추가 비용
- 이·미용비
- 개인 물품 구매
- 외출·외박 시 비용
- 의료비 (시설 서비스 외)

## 마무리

요양원 입소는 시작이지 끝이 아닙니다. 지속적인 관심과 사랑으로 어르신께서 편안하고 행복한 노후를 보내실 수 있도록 도와주세요.

궁금한 점이 있으시면 언제든지 시설이나 요양이 고객센터로 문의해주세요.
    `,
  };

  const relatedGuides = [
    { id: 2, title: '장기요양등급 신청 방법' },
    { id: 3, title: '요양 비용 계산하기' },
    { id: 4, title: '좋은 요양원 선택 기준' },
  ];

  // Parse markdown-style content
  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      // H2 headings
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            {line.replace('## ', '')}
          </h2>
        );
      }
      // H3 headings
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // List items
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="text-gray-700 leading-relaxed ml-6 mb-2">
            {line.replace('- ', '')}
          </li>
        );
      }
      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-4"></div>;
      }
      // Regular paragraphs
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="w-full flex flex-col bg-white min-h-screen">
      {/* Back Button */}
      <div className="w-full border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/guide')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>가이드 목록으로</span>
          </button>
        </div>
      </div>

      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-sm font-bold mb-4">
            <BookOpen className="w-4 h-4" />
            요양 가이드
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {guide.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {guide.date}
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              조회 {guide.views.toLocaleString()}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg max-w-none"
        >
          <div className="text-base sm:text-lg">
            {renderContent(guide.content)}
          </div>
        </motion.div>

        {/* Related Guides */}
        <div className="mt-12 pt-12 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">관련 가이드</h3>
          <div className="space-y-3">
            {relatedGuides.map((related) => (
              <button
                key={related.id}
                onClick={() => navigate(`/guide/${related.id}`)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-orange-50 rounded-xl border border-gray-200 hover:border-orange-200 transition-all group"
              >
                <span className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {related.title}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">더 궁금한 점이 있으신가요?</h3>
            <p className="text-gray-700 mb-4">전문 상담사가 친절하게 안내해드립니다</p>
            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-md">
              상담 문의하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
