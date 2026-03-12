import Header from "@/components/Header";
import Heading from "@/components/Heading";
import Image from "next/image";
import Link from "next/link";
export default function Upload() {
    return (
        <main className="min-h-dvh px-4 pb-10">
            <Header>
                <div className="flex flex-col items-center gap-2">
                    <Heading>Scan the QR code to upload an image</Heading>
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
                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/2 p-6 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                    <p className="text-sm text-zinc-400">
                        Open your phone camera and scan the code.
                    </p>
                    <div className="mt-6 flex justify-center">
                        <Image
                            className="rounded-xl border border-white/10 bg-white p-3"
                            src="http://localhost:8080/upload"
                            alt="qrcode"
                            width={220}
                            height={220}
                            priority
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
