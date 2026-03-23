import Link from "next/link";
import Layout from "@/components/Layout";

export default function NotFound() {
  return (
    <Layout title="Page Not Found | BreakupTime">
      <div className="flex flex-col items-center text-center pt-16">
        <span className="text-5xl mb-6">💔</span>
        <h1 className="font-heading text-3xl font-bold mb-4" style={{ color: "var(--text-100)" }}>
          Page not found
        </h1>
        <p className="mb-8" style={{ color: "var(--text-40)" }}>
          This page doesn&apos;t exist. Maybe the relationship wasn&apos;t meant to be.
        </p>
        <Link
          href="/"
          className="btn-gradient text-white font-semibold text-base px-8 py-3 rounded-xl transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </Layout>
  );
}
