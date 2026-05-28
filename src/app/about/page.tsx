import HomeLayout from "@/components/layouts/HomeLayout";
import { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <HomeLayout>
      <div className="xl:max-w-4xl md:mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-red-500 mb-6">About Us</h1>
        <div className="prose max-w-none text-gray-700 text-lg leading-relaxed space-y-4">
          <p>
            Welcome to <strong>News City 24</strong> — your trusted source for the latest news
            from Bangladesh and around the world. We are committed to delivering accurate,
            timely, and balanced journalism.
          </p>
          <p>
            Our team of experienced journalists and reporters work around the clock to bring you
            breaking news, in-depth analysis, and coverage across politics, economy, sports,
            entertainment, technology, and more.
          </p>
          <p>
            <strong>Editor &amp; Publisher:</strong> Matiur Rahman Tuku
          </p>
          <p>
            We believe in the power of an informed public. News City 24 is dedicated to upholding
            the highest standards of journalistic integrity and editorial independence.
          </p>
        </div>
      </div>
    </HomeLayout>
  );
}
