"use client";

import Header from "@/components/Header";
import Heading from "@/components/Heading";
import Image from "next/image";
import Link from "next/link";
import Container from "./_components/Container";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Predict() {
    const searchParams = useSearchParams();
    const [imgUrl, setImgUrl] = useState<string | null>(null);
    const [imgBlob, setImgBlob] = useState<Blob | null>(null);
    const [gradCamUrl, setGradCamUrl] = useState<string | null>(null);

    useEffect(() => {
        let url: string | undefined;
        (async () => {
            const image = encodeURIComponent(searchParams.get("image") ?? "");
            const res = await fetch(
                `http://localhost:8000/images?image=${image}`,
            );
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

                const res = await fetch("http://localhost:8080/predict", {
                    method: "POST",
                    body: fd,
                });
                const blob = await res.blob();
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
            <section className="mx-auto mt-8 max-w-5xl">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Container className="items-center">
                        <span className="text-sm font-medium text-zinc-200">
                            Chosen image
                        </span>
                        {imgUrl && (
                            <Image
                                src={imgUrl}
                                alt="chosen"
                                width={300}
                                height={300}
                                className="mt-2 h-auto w-full max-w-[320px] rounded-xl border border-white/10"
                                priority
                            />
                        )}
                    </Container>
                    <Container className="justify-center">
                        <span className="text-sm font-medium text-zinc-200">
                            Result
                        </span>
                        <div className="mt-2 space-y-2">
                            <div className="flex items-baseline justify-between gap-3">
                                <span className="text-sm text-zinc-400">
                                    Prediction
                                </span>
                                <span className="text-sm font-semibold text-zinc-100">
                                    AI Generated
                                </span>
                            </div>
                            <div className="flex items-baseline justify-between gap-3">
                                <span className="text-sm text-zinc-400">
                                    Confidence
                                </span>
                                <span className="text-sm font-semibold text-zinc-100">
                                    99%
                                </span>
                            </div>
                        </div>
                    </Container>
                    <Container className="items-center">
                        <span className="text-sm font-medium text-zinc-200">
                            GradCAM
                        </span>
                        {gradCamUrl && (
                            <Image
                                src={gradCamUrl}
                                alt="gradcam"
                                width={300}
                                height={300}
                                className="mt-2 h-auto w-full max-w-[320px] rounded-xl border border-white/10"
                                priority
                            />
                        )}
                    </Container>
                </div>
            </section>
        </main>
    );
}
