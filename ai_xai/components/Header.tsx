export default function Header({ children }: { children: React.ReactNode }) {
    return (
        <header className="min-h-15 flex items-end justify-center gap-5 p-2 w-full border-b border-neutral-800 rounded-2xl">
            {children}
        </header>
    );
}
