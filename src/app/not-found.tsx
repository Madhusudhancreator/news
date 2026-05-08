import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold mb-4">404 – Page Not Found</h1>
      <p className="text-lg text-gray-600">The page you are looking for has been removed or does not exist.</p>
      <Link href="/" className="mt-6 text-red-500 underline">Back to Homepage</Link>
    </div>
  );
}

  