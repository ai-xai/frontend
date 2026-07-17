"use client";

import { API_URL } from "@/consts/urls";
import Header from "@/components/Header";
import Heading from "@/components/Heading";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

function UploadForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(searchParams.get("token"));
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(
    "idle",
  );
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) {
      fetch(`${API_URL}/api/v1/upload-token`)
        .then((res) => res.json())
        .then((data) => setToken(data.token))
        .catch(() => setStatus("error"));
    }
  }, [token]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setFileName(file.name);
    setStatus("uploading");
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch(
        `${API_URL}/api/v1/upload/${encodeURIComponent(token)}`,
        { method: "POST", body: fd },
      );
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const disabled = !token || status === "uploading";

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/2 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="text-center">
        <p className="text-sm text-zinc-400">
          Choose a file from your phone or computer — it will upload
          immediately.
        </p>
      </div>

      <label
        className={`mt-6 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/18 bg-white/1 px-4 py-8 text-center transition ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:border-white/28 hover:bg-white/3"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          disabled={disabled}
          onChange={handleFileChange}
          className="sr-only"
        />
        <span className="inline-flex h-11 items-center justify-center rounded-full border border-white/16 bg-white/6 px-4 text-sm font-semibold text-white">
          Choose image
        </span>
        <span className="text-xs text-zinc-500">JPG / PNG / WEBP</span>
      </label>

      <div className="mt-4 text-center">
        {status === "idle" && !fileName && (
          <p className="text-xs text-zinc-500">
            {'Tip: on mobile, tap "Choose image".'}
          </p>
        )}
        {status === "uploading" && (
          <p className="text-sm text-zinc-400">Uploading {fileName}…</p>
        )}
        {status === "done" && (
          <p className="text-sm text-emerald-400">Uploaded successfully.</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-400">
            Something went wrong. Try again.
          </p>
        )}
      </div>
    </div>
  );
}

export default function Upload() {
  return (
    <main className="min-h-dvh px-4 pb-10">
      <Header>
        <div className="flex flex-col items-center gap-2">
          <Heading>Upload an image</Heading>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <span>or</span>
            <Link
              className="rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-zinc-100 transition hover:border-white/20 hover:bg-white/6"
              href="/"
            >
              Go back
            </Link>
          </div>
        </div>
      </Header>
      <section className="mx-auto mt-8 flex max-w-5xl items-center justify-center">
        <Suspense fallback={<p className="text-zinc-400 text-sm">Loading…</p>}>
          <UploadForm />
        </Suspense>
      </section>
    </main>
  );
}
