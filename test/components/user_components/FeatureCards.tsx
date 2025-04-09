import { ChevronRight, Plane, X } from "lucide-react";
import { Card } from "@/components/ui/card";

export const FeatureCards = () => {
  return (
    <div className="grid grid-cols-2 gap-3 mx-4 mb-3">
      <Card className="bg-white border-0 rounded-2xl p-5">
        <div className="flex flex-col items-start text-left">
          <div className="w-12 h-12 bg-[#E7F7E8] rounded-full flex items-center justify-center mb-3">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[#00857E]"
            >
              <path
                d="M12 8v4l3 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="text-base font-bold mb-1.5">
            하나금융그룹
            <br />
            신용대출 조회
          </div>
          <div className="flex items-center text-xs text-gray-500">
            자세히보기 <ChevronRight className="w-3 h-3 ml-0.5" />
          </div>
        </div>
      </Card>
      <Card className="bg-white border-0 rounded-2xl p-5">
        <div className="flex flex-col items-start text-left">
          <div className="w-12 h-12 bg-[#EEF6FF] rounded-full flex items-center justify-center mb-3">
            <Plane className="w-7 h-7 text-[#4760FF]" />
          </div>
          <div className="text-base font-bold mb-1.5 leading-tight">
            여행 전 체크
            <br />
            트래블로그
          </div>
          <div className="flex items-center text-xs text-gray-500">
            자세히보기 <ChevronRight className="w-3 h-3 ml-0.5" />
          </div>
        </div>
      </Card>
    </div>
  );
};
