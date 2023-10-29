

interface ButtonProps {
    text?: string;
    onClick: () => void;
    children?: React.ReactNode;
    disabled?: boolean;
}


export function Button({ text, onClick, children, disabled = false }: ButtonProps) {
    if (!text && !children) throw new Error("You must provide a text or children")
    return (
        <button className="button" onClick={onClick} disabled={disabled}>
            {text ? text : children}
        </button>
    )

}