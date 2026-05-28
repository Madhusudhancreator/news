import HomeLayout from "@/components/layouts/HomeLayout";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Comment Policy" };

export default function CommentPolicyPage() {
  return (
    <HomeLayout>
      <div className="xl:max-w-4xl md:mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-red-500 mb-6">Comment Policy</h1>
        <div className="prose max-w-none text-gray-700 text-lg leading-relaxed space-y-4">
          <p>
            We welcome thoughtful discussion and debate. To maintain a respectful community,
            please follow these guidelines when commenting:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Be respectful and constructive in your comments.</li>
            <li>Do not post hate speech, harassment, or discriminatory content.</li>
            <li>Do not share personal information of others without consent.</li>
            <li>Stay on topic and relevant to the article.</li>
            <li>Do not spam or post promotional content.</li>
            <li>Do not post false or misleading information.</li>
          </ul>
          <p>
            Comments that violate these guidelines may be removed without notice. Repeated
            violations may result in a ban from commenting.
          </p>
          <p>
            For concerns about a specific comment, please contact us via our{" "}
            <a href="/contact" className="text-red-500 underline">Contact page</a>.
          </p>
        </div>
      </div>
    </HomeLayout>
  );
}
