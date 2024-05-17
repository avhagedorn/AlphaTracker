import { fmtDollars, fmtPercent } from '@/lib/utils';
import React from 'react';
import { BsCaretDownFill, BsCaretUpFill } from 'react-icons/bs';

interface PriceChangeProps {
    percentChange: number;
    valueChange: number;
    subText?: string;
}

export default function PriceChange({
    percentChange,
    valueChange,
    subText,
} : PriceChangeProps
) {
    const isPositive = percentChange > 0;
    const iconSize = 24;
    const textColor = isPositive ? 'text-emerald-500' : 'text-red-500';

    return (
        <div>
            <div className="flex items-center">
                {isPositive ? 
                    <BsCaretUpFill className={textColor} size={iconSize}/> : 
                    <BsCaretDownFill className={textColor} size={iconSize}
                />}
                <p className="text-xl">
                    <span className={`font-bold ml-1 ${textColor}`}>{`${fmtDollars(valueChange)} (${fmtPercent(percentChange)})`}</span>
                    <span className="text-gray-500 ml-1">{subText}</span>
                </p>
            </div>
        </div>
    );
};
