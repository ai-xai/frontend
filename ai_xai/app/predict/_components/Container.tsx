export default function Container({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`${className} flex flex-col p-4 min-h-100 min-w-78 bg-black border border-neutral-800 rounded-2xl`}
        >
            {children}
        </div>
    );
}
