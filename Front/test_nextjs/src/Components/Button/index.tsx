

interface ButtonProps {
    text?: string;
    onClick: () => void;
    children?: React.ReactNode;
}


export function Button({ text, onClick, children }: ButtonProps) {
    if (!text && !children) throw new Error("You must provide a text or children")
    return (
        <button onClick={onClick}>
            {children ? children : text}
        </button>
    )

}