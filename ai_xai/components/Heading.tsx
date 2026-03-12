export default function Heading({ children }: { children: React.ReactNode }) {
    return (
        <h1 className="text-zinc-100 text-xl sm:text-2xl font-semibold tracking-tight text-center">
            {children}
        </h1>
    );
}
