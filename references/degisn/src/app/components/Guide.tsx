import { useState } from 'react';
import { useNavigate } from 'react-router';
import { BookOpen, ChevronRight, Search, FileText, Heart, Users, Calculator, Shield, MessageCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export function Guide() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const guides = [
    {
      id: 1,
      title: '요양원 입소 준비 가이드',
      description: '요양원 입소 전 준비해야 할 서류와 절차를 안내해드립니다.',
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
      views: 1240,
      date: '2026-04-15',
    },
    {
      id: 2,
      title: '장기요양등급 신청 방법',
      description: '장기요양등급 신청부터 등급 판정까지의 전체 과정을 상세히 설명합니다.',
      icon: Shield,
      color: 'bg-green-100 text-green-600',
      views: 2150,
      date: '2026-04-12',
    },
    {
      id: 3,
      title: '요양 비용 계산하기',
      description: '등급별 본인부담금과 실제 월 비용을 계산하는 방법을 알려드립니다.',
      icon: Calculator,
      color: 'bg-orange-100 text-orange-600',
      views: 1890,
      date: '2026-04-10',
    },
    {
      id: 4,
      title: '좋은 요양원 선택 기준',
      description: '어르신께 맞는 최적의 요양 시설을 선택하는 방법과 체크리스트를 제공합니다.',
      icon: Heart,
      color: 'bg-pink-100 text-pink-600',
      views: 3420,
      date: '2026-04-08',
    },
    {
      id: 5,
      title: '요양보호사와의 소통 팁',
      description: '요양보호사와 원활한 소통을 위한 실용적인 조언을 드립니다.',
      icon: MessageCircle,
      color: 'bg-purple-100 text-purple-600',
      views: 980,
      date: '2026-04-05',
    },
    {
      id: 6,
      title: '방문요양 서비스 이용하기',
      description: '재가요양 서비스의 종류와 이용 방법에 대해 자세히 알아봅니다.',
      icon: Users,
      color: 'bg-teal-100 text-teal-600',
      views: 1560,
      date: '2026-04-03',
    },
    {
      id: 7,
      title: '입소 후 적응 가이드',
      description: '요양원 입소 후 어르신과 가족이 적응하는 방법을 안내합니다.',
      icon: Clock,
      color: 'bg-indigo-100 text-indigo-600',
      views: 720,
      date: '2026-04-01',
    },
    {
      id: 8,
      title: '치매 어르신 돌봄 가이드',
      description: '치매 어르신을 위한 특별한 돌봄 방법과 주의사항을 알려드립니다.',
      icon: Heart,
      color: 'bg-rose-100 text-rose-600',
      views: 2890,
      date: '2026-03-28',
    },
  ];

  const filteredGuides = guides.filter(guide =>
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
              <BookOpen className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">요양 가이드</h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              요양 시설 이용에 필요한 모든 정보를 쉽고 자세하게 안내해드립니다
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="가이드 검색하기..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      {/* Guide Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2">
          {filteredGuides.map((guide, index) => {
            const Icon = guide.icon;
            return (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/guide/${guide.id}`)}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${guide.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                      {guide.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>조회 {guide.views.toLocaleString()}</span>
                        <span>·</span>
                        <span>{guide.date}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium text-lg">검색 결과가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
