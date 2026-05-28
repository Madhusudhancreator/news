import HomeLayout from "@/components/layouts/HomeLayout";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <HomeLayout>
      <div className="xl:max-w-4xl md:mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-red-500 mb-6">Privacy Policy</h1>
        <div className="prose max-w-none text-gray-700 text-lg leading-relaxed space-y-4">
          <p>
            News City 24 respects your privacy. This policy explains what information we collect,
            how we use it, and your rights regarding that information.
          </p>
          <h2 className="text-2xl font-semibold mt-4">Information We Collect</h2>
          <p>
            We may collect basic usage data such as page views and browser type to improve our
            service. We do not sell your personal data to third parties.
          </p>
          <h2 className="text-2xl font-semibold mt-4">Cookies</h2>
          <p>
            We use cookies to enhance your browsing experience. You may disable cookies in your
            browser settings, though some features may not function properly.
          </p>
          <h2 className="text-2xl font-semibold mt-4">Third-Party Services</h2>
          <p>
            Our site may embed content from third-party services (e.g. YouTube, Facebook).
            These services have their own privacy policies.
          </p>
          <h2 className="text-2xl font-semibold mt-4">Contact</h2>
          <p>
            For privacy-related concerns, please contact us via our{" "}
            <a href="/contact" className="text-red-500 underline">Contact page</a>.
          </p>
        </div>
      </div>
    </HomeLayout>
  );
}
