import { ChevronRight, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const CarPromotion = () => {
  return (
    <Card className="mx-4 mb-3 bg-white border-0 rounded-2xl">
      <div className="p-5 min-h-[220px]">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[13px] font-medium text-[#00BF91]">
            하나캐피탈
          </span>
          <button className="text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          다이렉트 장기렌터카
          <br />
          <span className="font-bold text-base">로켓출고 가능!</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <div className="grid grid-cols-3 gap-2 w-full">
            {["하나증권", "하나카드", "하나캐피탈"].map((text, i) => (
              <Button
                key={i}
                variant="secondary"
                size="sm"
                className="h-8 text-xs font-normal bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                {text}
              </Button>
            ))}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center h-8 text-xs px-0 text-gray-500 hover:text-gray-700"
        >
          하나금융그룹 모아보기 <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </Card>
  );
};
