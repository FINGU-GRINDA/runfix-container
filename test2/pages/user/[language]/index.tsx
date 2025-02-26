import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/user_components/Header";
import { AccountSection } from "@/components/user_components/AccountSection";
import { PromotionalBanner } from "@/components/user_components/PromotionalBanner";
import { MyData } from "@/components/user_components/MyData";
import { MonthTransactions } from "@/components/user_components/MonthTransactions";
import { FeatureCards } from "@/components/user_components/FeatureCards";
import { CarPromotion } from "@/components/user_components/CarPromotion";
import { HomeSettings } from "@/components/user_components/HomeSettings";
import { Footer } from "@/components/user_components/Footer";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { fitAndTranslate } from "runfix-container";
import { OverflowDetector } from "@/components/overflow-detector";

export default function HanaBankApp() {
  const router = useRouter();
  
  useEffect(() => {
    if (router.isReady) {
      const targetLang = router.query.lang as string;
      if (targetLang) {
        fitAndTranslate({
          targetLanguage: targetLang,
          sourceLanguage: "ko",
        });
      }
    }
  }, [router.isReady, router.query.lang]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F5F6F8] pb-20">
      <OverflowDetector />
      {/* Top Navigation */}
      <Header />
      {/* Main Content */}
      <div className="pb-4">
        {/* Account Section */}
        <AccountSection />

        {/* Promotional Banner */}
        <PromotionalBanner />

        {/* My Data Section */}
        <MyData />

        {/* February Transactions */}
        <MonthTransactions />

        {/* Feature Cards */}
        <FeatureCards />

        {/* Car Promotion */}
        <CarPromotion />

        {/* Home Settings */}
        <HomeSettings />

        {/* Footer */}
        <Footer />
      </div>

      {/* Scroll to Top */}
      <div className="fixed bottom-4 right-4">
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full bg-white shadow-md border-gray-200"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
