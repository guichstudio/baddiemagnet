import Head from "next/head";

export default function Layout({ children, title = "BaddieMagnet" }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Are you ready to pull a baddie? Take the test and find out."
        />
        <meta name="format-detection" content="telephone=no" />
        <meta property="og:title" content="BaddieMagnet — Are You Ready For a Baddie?" />
        <meta property="og:description" content="Find out if you have what it takes to attract high-value women." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BaddieMagnet — Are You Ready For a Baddie?" />
        <meta name="twitter:description" content="Find out if you have what it takes to attract high-value women." />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <div className="min-h-screen font-body relative overflow-hidden" style={{ color: "var(--text-100)" }}>
        <main className="max-w-[600px] lg:max-w-[800px] mx-auto px-6 py-10 lg:px-12">{children}</main>
      </div>
    </>
  );
}
