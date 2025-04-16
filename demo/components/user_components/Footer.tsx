import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <div className="px-4">
      <Separator className="mb-3" />
      <div className="flex justify-center">
        <button className="text-xs text-gray-500 underline">
          개인정보처리방침
        </button>
      </div>
    </div>
  );
};
