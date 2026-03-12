"use client";
import Header from "@/components/Header";
import Heading from "@/components/Heading";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const [images, setImages] = useState<Array<string>>([]);
    const router = useRouter();

    useEffect(() => {
        fetch("http://localhost:8000/images")
            .then((response) => response.json())
            .then((json) => setImages(Object.keys(json.images)))
            .catch((error) => console.error(error));
    }, []);

    return (
        <main className="min-h-dvh px-4 pb-10">
            <Header>
                <div className="flex flex-col items-center gap-2">
                    <Heading>Select an image</Heading>
                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                        <span>or</span>
                        <Link
                            className="rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-zinc-100 transition hover:border-white/20 hover:bg-white/6"
                            href="/upload"
                        >
                            Upload your own
                        </Link>
                    </div>
                </div>
            </Header>
            <section className="mx-auto mt-8 max-w-5xl">
                <div className="rounded-2xl border border-white/10 `bg-white/2 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                        <p className="text-sm text-zinc-400">
                            Choose an image to run a prediction.
                        </p>
                        <span className="text-xs text-zinc-500">
                            {images.length} items
                        </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {images.map((e, i) => (
                            <Image
                                key={i}
                                src={`http://localhost:8000/images?image=${e}`}
                                height={200}
                                width={200}
                                alt={e}
                                className="h-auto w-full cursor-pointer rounded-xl border border-white/10 bg-white/3 p-2 transition hover:border-white/20 hover:bg-white/6"
                                onClick={() =>
                                    router.push(`/predict?image=${e}`)
                                }
                            />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
