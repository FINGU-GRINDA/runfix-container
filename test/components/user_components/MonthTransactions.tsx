import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const MonthTransactions = () => {
  return (
    <Card className="mx-4 mb-3 bg-[#2D4EE4] border-0 rounded-2xl">
      <div className="p-6 min-h-[200px]">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1">
            <span className="text-[15px] font-medium text-white">2월 지출</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs text-white/80">25.02.04 16:17:48</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="text-xl font-bold text-white">0원</div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs font-medium text-white bg-[#1B3CDB] border-white/20 hover:bg-[#152FB3]"
          >
            숨김
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full h-9 text-sm text-white border-white/20 bg-[#1B3CDB] hover:bg-[#152FB3]"
        >
          지난달 오늘 날짜와 똑같이 썼어요
        </Button>
      </div>
    </Card>
  );
};
