import { Portfolio, Timeframe } from '@/types';
import React, { useState } from 'react';
import StrategyPreview from './StrategyPreview';
import { fetchSS } from '@/lib/fetch';
import { useQuery } from 'react-query';
import Button from './Button';

interface StrategyListProps {
    timeframe: Timeframe;
    handleOpenCreatePortfolioModal: () => void;
}

export default function StrategyList({
    timeframe,
    handleOpenCreatePortfolioModal
}: StrategyListProps) {
    const { data, status, error } = useQuery('portfolios', () => fetchSS('/portfolio/list'));

    if (status === 'loading') {
        return (
            <div>
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="mt-4">
                        <div className="h-24 w-full shimmer"></div>
                    </div>
                ))}
                <Button className="mt-4 w-full" disabled>Create a new strategy</Button>
            </div>
        )
    }

    else if (status === 'error') {
        return <p>{String(error)}</p>
    }

    return (
        <div>
            {(data as Portfolio[]).map((strategy, index) => (
                <StrategyPreview
                    key={index}
                    portfolio={strategy}
                    className="mt-4"
                />
            ))}
            <Button className="mt-4 w-full" onClick={handleOpenCreatePortfolioModal}>Create a new strategy</Button>
        </div>
    );
};
