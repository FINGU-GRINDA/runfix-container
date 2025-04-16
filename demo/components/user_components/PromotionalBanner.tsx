import { ChevronLeft, ChevronRight } from "lucide-react";

export const PromotionalBanner = () => {
  return (
    <div className="bg-white px-5 py-4 mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium text-sm">행운의 네잎클로버 찾기</span>
        <div className="flex items-center gap-1 text-gray-400">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs">4/10</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-600">2월 행운력을 높이자</span>
        <span className="text-sm text-gray-800">2월의 모바일 캘린더!</span>
      </div>
    </div>
  );
};
