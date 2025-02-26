import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"


export const Header = () => {
  return (
    <div className="flex justify-between items-center px-5 py-3 bg-white">
      <div className="flex items-center gap-3">
        <User className="w-6 h-6 text-gray-600" />
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-3 text-xs font-medium border-gray-200 rounded-full"
        >
          전체계좌
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-gray-200 rounded-full p-1">
          <button className="px-3 py-1 text-xs font-medium bg-white rounded-full shadow">
            홈
          </button>
          <button className="px-3 py-1 text-xs font-medium text-gray-600">
            간편
          </button>
        </div>
        <button className="relative">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-[10px] text-white flex items-center justify-center">
            1
          </span>
        </button>
      </div>
    </div>
  );
};
