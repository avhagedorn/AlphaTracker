"use client"

import React from 'react';
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

interface GraphData {
    date: string;
    spy: number;
    portfolio: number;
}

interface CompareGraphProps {
    width: number;
    height: number;
    margin?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    data: GraphData[];
    ticks: number;
    animationDuration?: number;
    hideLegend?: boolean;
    lineWidth?: number;
}

function getVisuallyAppealingRange(data: GraphData[], stepCount: number) {
    const low = Math.min(...data.map((d) => d.portfolio), ...data.map((d) => d.spy));
    const high = Math.max(...data.map((d) => d.portfolio), ...data.map((d) => d.spy));

    const range = high - low;
    const stepSize = range / (stepCount - 1);
    
    const power = Math.floor(Math.log10(stepSize));
    const roundedStepSize = Math.ceil(stepSize / Math.pow(10, power)) * Math.pow(10, power);
    
    const newLow = Math.floor(low / roundedStepSize) * roundedStepSize;
    const newHigh = Math.ceil(high / roundedStepSize) * roundedStepSize;

    return [newLow, newHigh];
  }

export default function CompareGraph({
    data,
    width,
    height,
    margin,
    ticks,
    animationDuration = 1500,
    hideLegend = false,
    lineWidth = 2,
}: CompareGraphProps) {
    const domain = getVisuallyAppealingRange(data, ticks);

    return (
        <LineChart 
            width={width} 
            height={height} 
            data={data}
            margin={margin}
        >
            <XAxis 
                dataKey="date" 
                className="text-sm"
                tick={!hideLegend}
                axisLine={!hideLegend}
                height={hideLegend ? 0 : undefined}
            />
            <YAxis
                domain={domain} 
                allowDataOverflow={false}
                className="text-sm"
                tickCount={ticks}
                tickFormatter={(value) => `$${value}`}
                tick={!hideLegend}
                axisLine={!hideLegend}
                width={hideLegend ? 0 : undefined}
            />
            <Tooltip />
            {!hideLegend && <Legend />}
            <Line 
                type="monotone" 
                dataKey="portfolio" 
                stroke="#82ca9d" 
                animationDuration={animationDuration} 
                name="Your Portfolio"
                dot={false}
                strokeWidth={lineWidth}
            />
            <Line 
                type="monotone" 
                dataKey="spy" 
                stroke="#8884d8" 
                animationDuration={animationDuration} 
                name="SP500"
                dot={false}
                strokeWidth={lineWidth}
            />
        </LineChart>
    );
}
