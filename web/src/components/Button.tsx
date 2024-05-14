import React from 'react';
import "@/components/style/loading.css";

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

export default function Button({ 
    children,
    onClick = undefined,
    isLoading = false,
    disabled = false,
    type = "button"
 }: {
    children: React.ReactNode;
    onClick?: (() => void) | undefined;
    isLoading?: boolean;
    disabled?: boolean;
    type?: "button" | "submit";
 }) {

    let color = "bg-emerald-500 hover:bg-emerald-700";
    if (disabled) {
        color = "bg-gray-300 cursor-not-allowed";
    }
    if (isLoading) {
        color = "bg-emerald-700 cursor-wait";
    }

    return (
        <button
            className={`${color} text-white font-bold py-2 px-4 rounded`}
            onClick={onClick}
            disabled={isLoading || disabled}
            type={type}
        >
            {children} {isLoading && <span className="inline-loading"/>}
        </button>
    );
};
