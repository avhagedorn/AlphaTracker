import React, { useEffect } from 'react';
import CompareGraph from './CompareGraph';
import useFetch from '@/lib/fetch';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface DisplayPortfolio {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
}

function PortfolioList() {
    const { data, loading, error } = useFetch('/portfolio/list');
    const [toDeletePortfolio, setToDeletePortfolio] = React.useState<DisplayPortfolio | null>(null);

    const handleDelete = (portfolio: DisplayPortfolio) => {
        // TODO
    }

    if (loading) {
        return null;
    }

    if (error) {
        return <h1>Error</h1>
    }

    return (
        <div className="flex flex-col items-center justify-center mt-16">
            {
                (data as DisplayPortfolio[]).map((portfolio) => (
                    <div key={portfolio.id}>
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