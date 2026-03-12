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
        <main className="flex flex-col bg-neutral-950 h-screen">
            <Header>
                <Heading>
                    <Link href="/">Go back</Link>
                </Heading>
            </Header>
            <section className="flex flex-row border-b items-start pt-15 gap-1.5 justify-center h-full border-neutral-800 rounded-2xl mt-1.5">
                <Container className="items-center">
                    <span className="text-xl">Chosen image:</span>
                    {imgUrl && (
                        <Image
                            src={imgUrl}
                            alt="chosen"
                            width={300}
                            height={300}
                            priority
                        />
                    )}
                </Container>
                <Container className="justify-center">
                    <span className="text-2xl">
                        {"Prediction: "}
                        <span className="text-lg font-bold">AI Generated</span>
                    </span>
                    <span className="text-2xl">
                        {"Confidence: "}
                        <span className="text-lg font-bold">99%</span>
                    </span>
                </Container>
                <Container className="items-center">
                    <span className="text-xl">GradCAM:</span>
                    {gradCamUrl && (
                        <Image
                            src={gradCamUrl}
                            alt="gradcam"
                            width={300}
                            height={300}
                            priority
                        />
                    )}
                </Container>
            </section>
        </main>
    );
}
