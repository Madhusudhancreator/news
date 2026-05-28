import HomeLayout from "@/components/layouts/HomeLayout";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Advertisement Policy" };

export default function AdvertisementPage() {
  return (
    <HomeLayout>
      <div className="xl:max-w-4xl md:mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-red-500 mb-6">Advertisement Policy</h1>
        <div className="prose max-w-none text-gray-700 text-lg leading-relaxed space-y-4">
          <p>
            News City 24 accepts advertisements that are lawful, honest, and respectful of our
            readers. We reserve the right to refuse or remove any advertisement that conflicts
            with our editorial standards or values.
          </p>
          <h2 className="text-2xl font-semibold mt-4">Advertising Guidelines</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All ads must comply with applicable laws and regulations.</li>
            <li>Ads must not be misleading or deceptive.</li>
            <li>Ads for illegal products or services will not be accepted.</li>
            <li>Advertising content is clearly labeled as such.</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-4">Advertise With Us</h2>
          <p>
            For advertising inquiries, please contact us at{" "}
            <a href="/contact" className="text-red-500 underline">our contact page</a>.
          </p>
        </div>
      </div>
    </HomeLayout>
  );
}
