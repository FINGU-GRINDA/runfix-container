import React from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface PrivacyPolicyProps {
  trigger?: React.ReactNode;
}

export const PrivacyPolicy = ({ trigger }: PrivacyPolicyProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="link">Privacy Policy</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            Last updated: April 11, 2025
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <section>
            <h3 className="text-lg font-semibold">1. Introduction</h3>
            <p>
              Welcome to our Privacy Policy. This document explains how we collect, use, and protect your personal information when you use our services.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold">2. Information We Collect</h3>
            <p>
              We may collect the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong>Personal Information:</strong> Name, email address, phone number, and other contact details you provide when creating an account or using our services.
              </li>
              <li>
                <strong>Usage Information:</strong> Information about how you use our services, including access times, pages viewed, and the routes you take through our platform.
              </li>
              <li>
                <strong>Device Information:</strong> Information about the device you use to access our services, including hardware model, operating system, unique device identifiers, and mobile network information.
              </li>
              <li>
                <strong>Location Information:</strong> With your consent, we may collect and process information about your actual location using various technologies including IP address, GPS, and other sensors.
              </li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold">3. How We Use Your Information</h3>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send notifications, updates, and support messages</li>
              <li>Personalize your experience and deliver content relevant to your interests</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold">4. Information Sharing and Disclosure</h3>
            <p>
              We do not sell or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>With service providers who perform services on our behalf</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights and property</li>
              <li>With your consent or at your direction</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold">5. Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold">6. Your Rights</h3>
            <p>
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Access and receive a copy of your personal information</li>
              <li>Rectify inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Restrict or object to the processing of your personal information</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold">7. Changes to This Privacy Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold">8. Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              Email: privacy@example.com<br />
              Address: 123 Privacy Street, City, Country
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
