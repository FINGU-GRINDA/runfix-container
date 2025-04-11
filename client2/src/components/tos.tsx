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

interface TermsOfServiceProps {
  trigger?: React.ReactNode;
}

export const TermsOfService = ({ trigger }: TermsOfServiceProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="link">Terms of Service</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Last updated: April 11, 2025
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <section>
            <h3 className="text-lg font-semibold">1. Acceptance of Terms</h3>
            <p>
              By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold">2. Use License</h3>
            <p>
              Permission is granted to temporarily access the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on our website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or &ldquo;mirror&rdquo; the materials on any other server</li>
            </ul>
            <p className="mt-2">
              This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold">3. Disclaimer</h3>
            <p>
              The materials on our website are provided on an &lsquo;as is&rsquo; basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            <p className="mt-2">
              Further, we do not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on our website or otherwise relating to such materials or on any sites linked to this site.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold">4. Limitations</h3>
            <p>
              In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold">5. Accuracy of Materials</h3>
            <p>
              The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our website are accurate, complete, or current. We may make changes to the materials contained on our website at any time without notice.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold">6. Links</h3>
            <p>
              We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user&apos;s own risk.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold">7. Modifications</h3>
            <p>
              We may revise these terms of service for our website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold">8. Governing Law</h3>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold">9. Contact Us</h3>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-2">
              Email: legal@example.com<br />
              Address: 123 Legal Avenue, City, Country
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
