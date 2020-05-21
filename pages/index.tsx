import React, { FC } from 'react';
import { useEntriesQuery } from '../.generated/hooks';

const Index: FC = () => {
    const { data, loading, error } = useEntriesQuery();

    if (!data || loading) return <p>Loading...</p>;
    if (error) return <p>Error: {JSON.stringify(error)}</p>;

    return (
        <div>
            <a href="/api/login">Login</a>
            <ul>
                {data.serverEntries.map((entry) => (
                    <li key={entry.id}>
                        {entry.name} {entry.features}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Index;
