import { MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const AccountSection = () => {
  return (
    <Card className="mx-4 mt-4 mb-3 bg-white border-0 shadow-sm rounded-2xl">
      <div className="p-7">
        <div className="mb-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-lg font-medium text-gray-900">저축예금</span>
            <span className="text-xs text-blue-600 font-medium underline">
              한도계좌
            </span>
          </div>
          <div className="text-xs text-gray-500">
            입출금 658-910333-71107 복사
          </div>
        </div>
        <div className="mb-5">
          <div className="text-2xl font-bold mb-4">0원</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-10 text-sm font-medium border-gray-200 hover:bg-gray-50"
            >
              가져오기
            </Button>
            <Button
              size="sm"
              className="flex-1 h-10 text-sm font-medium bg-[#00BF91] hover:bg-[#00AB82] text-white"
            >
              보내기
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-3 border-gray-200 hover:bg-gray-50"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 text-[10px]">
            i
          </span>
          <span className="text-xs text-gray-500">
            이 계좌의 첫 이체를 기다리고 있어요!
          </span>
        </div>
      </div>
    </Card>
  );
};
