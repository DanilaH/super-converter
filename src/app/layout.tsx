import type { Metadata } from "next";
import Link from "next/link";
import { englishContent } from "@/content/en";
import "./globals.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "Compare Lists",
};

function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.wordmark}>
        {englishContent.siteName}
      </Link>
    </header>
  );
}

function SiteFooter() {
  return <footer className={styles.footer}>{englishContent.siteName}</footer>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={styles.shell}>
        <SiteHeader />
        <main className={styles.main}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
