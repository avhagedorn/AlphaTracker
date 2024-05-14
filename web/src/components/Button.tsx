import React from 'react';
import "@/components/style/loading.css";

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

export default function     Button({ 
    children,
    onClick = undefined,
    isLoading = false,
    disabled = false,
    type = "button",
    color = "emerald",
    className = "",
 }: {
    children: React.ReactNode;
    onClick?: (() => void) | undefined;
    isLoading?: boolean;
    disabled?: boolean;
    type?: "button" | "submit";
    color?: "emerald" | "red" | "blue" | "gray" | "yellow";
    className?: string;
 }) {

    let colorClass = `bg-${color}-500 hover:bg-${color}-700`;
    if (disabled) {
        colorClass = "bg-gray-300 cursor-not-allowed";
    }
    if (isLoading) {
        colorClass = `bg-${color}-700 cursor-wait`;
    }

    return (
        <button
            className={`${className} ${colorClass} text-white font-bold py-2 px-4 rounded`}
            onClick={onClick}
            disabled={isLoading || disabled}
            type={type}
        >
            {children} {isLoading && <span className="inline-loading"/>}
        </button>
    );
};
