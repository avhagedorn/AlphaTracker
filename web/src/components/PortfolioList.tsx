import React from 'react';
import CompareGraph from './CompareGraph';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { useQuery } from 'react-query';
import { fetchSS } from '@/lib/fetch';
import { Portfolio } from '@/types';

function PortfolioList() {
    const { data, status, error, isFetching, refetch } = useQuery('portfolios', () => fetchSS('/portfolio/list'));
    const [toDeletePortfolio, setToDeletePortfolio] = React.useState<Portfolio | null>(null);

    const handleDelete = (portfolio: Portfolio) => {
        fetchSS(`/portfolio/${portfolio.id}/delete`, {
            method: 'POST',
        }).then(() => {
            setToDeletePortfolio(null);
            refetch();
        });
    }

    if (isFetching) {
        return null;
    }

    if (status === 'error') {
        return <h1>{String(error)}</h1>
    }

    return (
        <div className="flex flex-col items-center justify-center mt-16">
            {
                (data as Portfolio[]).map((portfolio, idx) => (
                    <div key={`portfolio-${idx}`}>
                        <h1 
                            className='text-2xl font-bold'
                            onClick={() => setToDeletePortfolio(portfolio)}
                        >
                            {portfolio.name}
                        </h1>
                        <p>{portfolio.description}</p>
                        <CompareGraph
                            width={1000}
                            height={300}
                            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                            data={[]}
                            ticks={4}
                        />
                    </div>
            ))}
            <ConfirmDeleteModal 
                isOpen={!!toDeletePortfolio}
                onDelete={() => handleDelete(toDeletePortfolio!!)} 
                onCancel={() => setToDeletePortfolio(null)}
                deletionPrompt={`Are you sure you want to delete ${toDeletePortfolio?.name}?`}
            />
    </div>
    );
};

export default PortfolioList;