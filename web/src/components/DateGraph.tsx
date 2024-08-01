import dynamic from "next/dynamic";
import { GraphData, Timeframe } from "@/types";
import { ReferenceDot, ReferenceLine } from "recharts";

const CompareGraph = dynamic(() => import("@/components/CompareGraph"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full shimmer"></div>,
});

interface DateGraphProps {
  data: GraphData[];
  width: number | string;
  height: number | string;
  animationDuration: number;
  lineWidth: number;
  leftLineName?: string;
  rightLineName?: string;
  children?: React.ReactNode;
  selectedTimeframe: Timeframe;
  handleTimeframeChange: (timeframe: Timeframe) => void;
}

export default function DateGraph({
  data,
  width,
  height,
  lineWidth,
  animationDuration,
  selectedTimeframe,
  handleTimeframeChange,
  leftLineName,
  rightLineName,
  children,
}: DateGraphProps) {
  const getStyle = (timeframe: Timeframe) => {
    return timeframe === selectedTimeframe
      ? "font-bold bg-emerald-500 text-white"
      : "text-xl hover:font-bold";
  };

  return (
    <div className="flex flex-col w-full">
      <CompareGraph
        width={width}
        height={height}
        data={data}
        ticks={4}
        animationDuration={animationDuration}
        hideLegend
        lineWidth={lineWidth}
        leftLineName={leftLineName}
        rightLineName={rightLineName}
      >
        <ReferenceLine
          x="9:30 AM"
          strokeDasharray="3 3"
          strokeWidth={selectedTimeframe === Timeframe.DAY ? 2 : 0}
        />
        <ReferenceLine
          x="4:00 PM"
          strokeDasharray="3 3"
          strokeWidth={selectedTimeframe === Timeframe.DAY ? 2 : 0}
        />
        {/* <ReferenceDot
          x={"1:00 PM"}
          y={37000}
          // label={`waah`}
          // r={10}
          stroke="none"
          fill={"#00C853"}
        /> */}
        {children}
      </CompareGraph>
      <div className="flex space-x-4 w-full pt-2 pb-2 border-b-2 border-gray-300">
        {Object.values(Timeframe).map((timeframe, index) => (
          <div key={index} className="flex justify-center items-start text-xl">
            <button
              onClick={() => handleTimeframeChange(timeframe)}
              className={`${getStyle(timeframe)} w-12 p-1 rounded-md`}
            >
              {timeframe}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
