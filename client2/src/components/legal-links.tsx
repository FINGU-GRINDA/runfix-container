import React from "react";
import { PrivacyPolicy } from "./privacy-policy";
import { TermsOfService } from "./tos";

interface LegalLinksProps {
  className?: string;
}

export const LegalLinks = ({ className }: LegalLinksProps) => {
  return (
    <div className={`flex gap-4 text-sm ${className || ""}`}>
      <PrivacyPolicy />
      <TermsOfService />
    </div>
  );
};
