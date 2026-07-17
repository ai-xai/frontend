"use client";

import { API_URL } from "@/consts/urls";
import Header from "@/components/Header";
import Heading from "@/components/Heading";
import Image from "next/image";
import Link from "next/link";
import Container from "./_components/Container";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Prediction = {
  label: string;
  target: number;
  probs: number[];
};

export default function Predict() {
  const searchParams = useSearchParams();
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgBlob, setImgBlob] = useState<Blob | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [gradCamUrl, setGradCamUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string | undefined;
    (async () => {
      const image = encodeURIComponent(searchParams.get("image") ?? "");
      const res = await fetch(`${API_URL}/api/v1/images?image=${image}`);
      const blob = await res.blob();
      url = URL.createObjectURL(blob);
      setImgBlob(blob);
      setImgUrl(url);
    })();
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [searchParams]);

  useEffect(() => {
    let url: string | undefined;
    if (imgBlob) {
      (async () => {
        const fd = new FormData();
        fd.append(
          "file",
          new File([imgBlob], "image.jpg", {
            type: imgBlob.type || "image/jpeg",
          }),
        );

        const res = await fetch(`${API_URL}/api/v1/predict`, {
          method: "POST",
          body: fd,
        });

        const pred = (await res.json()) as Prediction;
        setPrediction(pred);

        const target = pred.target;

        const gradRes = await fetch(
          `${API_URL}/api/v1/gradcam?target=${target}`,
          {
            method: "POST",
            body: fd,
          },
        );
        const blob = await gradRes.blob();
        url = URL.createObjectURL(blob);
        setGradCamUrl(url);
      })();
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    }
  }, [imgBlob]);

  return (
    <main className="min-h-dvh px-4 pb-10">
      <Header>
        <div className="flex flex-col items-center gap-2">
          <Heading>Prediction</Heading>
          <Link
            className="rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-sm text-zinc-100 transition hover:border-white/20 hover:bg-white/6"
            href="/"
          >
            Go back
          </Link>
        </div>
      </Header>
      {/*<section className="mx-auto mt-8 max-w-8xl">*/}
      <section className="mx-auto mt-8 max-w-6xl space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-zinc-400 text-sm uppercase tracking-widest">
              Model Classification
            </h2>
            <p className="text-3xl font-bold text-white">{prediction?.label}</p>
          </div>
          <div className="text-right">
            <p className="text-zinc-400 text-sm">Confidence Score</p>
            <p className="text-2xl font-mono text-emerald-400">
              {prediction &&
                `${(prediction.probs[prediction.target] * 100).toFixed(2)}%`}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Container className="items-center">
            <span className="text-sm font-medium text-zinc-400 mb-2">
              Input Image (448x448)
            </span>
            {imgUrl && (
              <Image
                src={imgUrl}
                alt="chosen"
                height={448}
                width={448}
                className="mt-2 aspect-square w-full max-w-md rounded-xl border border-white/10 object-fill"
                priority
              />
            )}
          </Container>
          <Container className="items-center">
            <span className="text-sm font-medium text-zinc-400 mb-2">
              Attention Map (Grad-CAM)
            </span>
            {gradCamUrl && (
              <Image
                src={gradCamUrl}
                alt="gradcam"
                width={448}
                height={448}
                className="mt-2 aspect-square w-full max-w-md rounded-xl border border-white/10 object-fill"
                priority
              />
            )}
          </Container>
        </div>
      </section>
    </main>
  );
}
