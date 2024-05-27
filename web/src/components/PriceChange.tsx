import { fmtDollars, fmtPercent } from "@/lib/utils";
import React from "react";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";

interface PriceChangeProps {
  percentChange: number;
  valueChange: number;
  loading?: boolean;
  subText?: string;
  hideIcon?: boolean;
  hidePercent?: boolean;
  hideDollars?: boolean;
}

export default function PriceChange({
  percentChange,
  valueChange,
  subText,
  loading = false,
  hideIcon = false,
  hidePercent = false,
  hideDollars = false,
}: PriceChangeProps) {
  const isPositive = percentChange > 0;
  const iconSize = 24;
  const textColor = isPositive ? "text-emerald-500" : "text-red-500";

  const textDollars = hideDollars ? "" : fmtDollars(valueChange);
  const textPercent = hidePercent
    ? ""
    : hideDollars
      ? fmtPercent(percentChange)
      : `(${fmtPercent(percentChange)})`;

  return (
    <div>
      {loading && <div className="shimmer h-7 w-40 rounded-md mb-2" />}
      {!loading && (
        <div className="flex items-center">
          {!hideIcon &&
            (isPositive ? (
              <BsCaretUpFill className={textColor} size={iconSize} />
            ) : (
              <BsCaretDownFill className={textColor} size={iconSize} />
            ))}
          <p className="text-xl">
            <span
              className={`font-bold ml-1 ${textColor}`}
            >{`${textDollars} ${textPercent}`}</span>
            <span className="text-gray-500 ml-1">{subText}</span>
          </p>
        </div>
      )}
    </div>
  );
}
