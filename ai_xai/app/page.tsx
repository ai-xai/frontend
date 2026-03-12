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
        <main className="flex flex-col bg-neutral-950 h-screen p-1.5">
            <Header>
                <Heading>Select an image</Heading>
                <span>or</span>
                <Heading>
                    <Link href="/upload">Upload your own</Link>
                </Heading>
            </Header>
            <section className="border-b pt-10 h-full border-neutral-800 rounded-2xl mt-1.5 overflow-auto">
                <div className="flex justify-center gap-3.5 flex-wrap p-2">
                    {images.map((e, i) => (
                        <Image
                            key={i}
                            src={`http://localhost:8000/images?image=${e}`}
                            height={200}
                            width={200}
                            alt={e}
                            className="cursor-pointer"
                            onClick={() => router.push(`/predict?image=${e}`)}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
