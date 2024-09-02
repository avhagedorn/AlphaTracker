import React from "react";
import { prepNumber } from "@/lib/utils";
import "@/style/animatedNumber.css";

interface NumberAnimationProps {
  value: number;
  className?: string;
}

const AnimatedNumber = ({
  value,
  className = "text-6xl font-bold",
}: NumberAnimationProps) => {
  const { isNegative, digitList, remainderList } = prepNumber(value);
  console.log(isNegative, digitList, remainderList);

  const getDigit = (digit: string, idx: number) => {
    return (
      <div className="flex relative h-[1lh] overflow-y-hidden">
        <div
          className={`flex flex-col relative transition-[top]`}
          key={idx}
          style={{
            top: `-${digit}lh`,
          }}
        >
          <div>0</div>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
          <div>6</div>
          <div>7</div>
          <div>8</div>
          <div>9</div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex ${className}`}>
      ${isNegative && <div>-</div>}
      {digitList.map(getDigit)}.{remainderList.map(getDigit)}
    </div>
  );
};

export default AnimatedNumber;
