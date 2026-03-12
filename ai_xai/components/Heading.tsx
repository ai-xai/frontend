export default function Heading({ children }: { children: React.ReactNode }) {
    return (
        <h1 className="text-neutral-100 text-3xl text-center">{children}</h1>
    );
}
