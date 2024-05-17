export const fmtDollars = (value: number) => {
    const isNegative = value < 0;
    return `${isNegative ? '-' : ''}$${Math.abs(value).toFixed(2)}`;
};

export const fmtPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
};
