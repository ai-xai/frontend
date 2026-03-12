import Header from "@/components/Header";
import Heading from "@/components/Heading";
import Image from "next/image";
import Link from "next/link";
export default function Upload() {
    return (
        <main className="flex flex-col bg-neutral-950 h-screen">
            <Header>
                <Heading>Scan the code below to upload an image</Heading>
                <span>or</span>
                <Heading>
                    <Link href="/">Go back</Link>
                </Heading>
            </Header>
            <section className="pb-50 flex items-center justify-center h-full">
                <Image
                    className="invert"
                    src="http://localhost:8080/upload"
                    alt="qrcode"
                    width={200}
                    height={200}
                    priority
                />
            </section>
        </main>
    );
}
