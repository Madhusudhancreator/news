import HomeLayout from "@/components/layouts/HomeLayout";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <HomeLayout>
      <div className="xl:max-w-4xl md:mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-red-500 mb-6">Contact Us</h1>
        <div className="text-gray-700 text-lg leading-relaxed space-y-4">
          <p>We&apos;d love to hear from you. Reach out for news tips, advertising inquiries, or general feedback.</p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-3">
            <p><strong>Publication:</strong> News City 24</p>
            <p><strong>Editor &amp; Publisher:</strong> Matiur Rahman Tuku</p>
            <p><strong>Email:</strong> <a href="mailto:info@newscity24.com" className="text-red-500 underline">info@newscity24.com</a></p>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
