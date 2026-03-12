export default function Header({ children }: { children: React.ReactNode }) {
    return (
        <header className="sticky top-0 z-10 w-full border-b border-white/10 bg-black/60 backdrop-blur `supports-backdrop-filter:bg-black/40">
            <div className="mx-auto flex max-w-5xl items-center justify-center gap-4 px-4 py-4">
                {children}
            </div>
        </header>
    );
}
