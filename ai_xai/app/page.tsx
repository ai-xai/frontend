"use client";

import { API_URL } from "@/consts/urls";
import Header from "@/components/Header";
import Heading from "@/components/Heading";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const QR_REFRESH_INTERVAL_MS = 3 * 60 * 1000;

function QrIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <path d="M14 14h3v3h-3zM17 17h4v4h-4zM14 21h1M21 14h1" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function QrModal({ onClose }: { onClose: () => void }) {
  const [qrTimestamp, setQrTimestamp] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setQrTimestamp(Date.now());
    }, QR_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-black p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-zinc-500 transition hover:bg-white/6 hover:text-zinc-200"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
        <p className="text-sm font-medium text-zinc-200">
          Scan with your phone
        </p>
        <div className="rounded-xl border border-white/10 bg-white p-2">
          <Image
            src={`${API_URL}/api/v1/qr?t=${qrTimestamp}`}
            alt="Scan to upload from your phone"
            width={180}
            height={180}
            unoptimized
          />
        </div>
        <p className="text-xs text-zinc-500">Code refreshes every 3 minutes</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [images, setImages] = useState<Array<string>>([]);
  const [qrOpen, setQrOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`${API_URL}/api/v1/images`)
      .then((response) => response.json())
      .then((json) => setImages(Object.keys(json.images)))
      .catch((error) => console.error(error));
  }, []);

  return (
    <main className="min-h-dvh px-4 pb-10">
      <Header>
        <div className="flex flex-col items-center gap-3">
          <Heading>Select an image</Heading>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <span>or</span>
            <Link
              className="rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-zinc-100 transition hover:border-white/20 hover:bg-white/6"
              href="/upload"
            >
              Upload your own
            </Link>
            <button
              onClick={() => setQrOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-zinc-100 transition hover:border-white/20 hover:bg-white/6"
            >
              <QrIcon />
              Scan QR
            </button>
          </div>
        </div>
      </Header>

      {qrOpen && <QrModal onClose={() => setQrOpen(false)} />}

      <section className="mx-auto mt-8 max-w-5xl">
        <div className="rounded-2xl border border-white/10 `bg-white/2 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <p className="text-sm text-zinc-400">
              Choose an image to run a prediction.
            </p>
            <span className="text-xs text-zinc-500">{images.length} items</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((e, i) => (
              <Image
                key={i}
                src={`${API_URL}/api/v1/images?image=${e}`}
                height={200}
                width={200}
                alt={e}
                className="h-auto w-full cursor-pointer rounded-xl border border-white/10 bg-white/3 p-2 transition hover:border-white/20 hover:bg-white/6"
                onClick={() => router.push(`/predict?image=${e}`)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
