export default function Container({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`${className} flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/2 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]`}
        >
            {children}
        </div>
    );
}
