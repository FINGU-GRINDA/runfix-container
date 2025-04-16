import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const MyData = () => {
  return (
    <Card className="mx-4 mb-3 bg-[#2D4EE4] border-0 rounded-2xl overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white text-sm font-medium">
            마이데이터 자산
          </span>
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-xs">연결자산</span>
            <div className="flex items-center gap-1 px-1 py-0.5 bg-white/20 rounded">
              <button className="px-2 py-0.5 text-xs bg-white text-[#2D4EE4] rounded">
                ON
              </button>
              <button className="px-2 py-0.5 text-xs text-white/80">OFF</button>
            </div>
          </div>
        </div>
        <div className="text-2xl font-bold text-white mb-6">100,000원</div>
        <div className="h-28 relative flex items-end gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 ${i === 5 ? "bg-[#00BF91]" : "bg-[#4365FF]"}`}
              style={{ height: i === 5 ? "80%" : "20%" }}
            />
          ))}
        </div>
        <div className="text-right text-xs text-white/80 mt-2 mb-4">
          25.02.04 16:17:48
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full h-9 text-sm font-medium text-white border-white/20 bg-[#1B3CDB] hover:bg-[#152FB3]"
        >
          자산 연결하기
        </Button>
      </div>
    </Card>
  );
};
