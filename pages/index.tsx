import React, { FC } from 'react';
import { useEntriesQuery } from '../.generated/hooks';
import Card from '../components/Card';

const Index: FC = () => {
    const { data, loading, error } = useEntriesQuery();

    if (!data || loading) return <p>Loading...</p>;
    if (error) return <p>Error: {JSON.stringify(error)}</p>;

    return (
        <div>
            <a href="/api/login">Login</a>
            <main>
                {data.serverEntries.map((entry) => (
                    <Card
                        key={entry.id}
                        icon={
                            entry.icon == null
                                ? 'https://discord.com/assets/f8389ca1a741a115313bede9ac02e2c0.svg'
                                : `https://cdn.discordapp.com/icons/${entry.id}/${entry.icon}.png`
                        }
                        header={entry.name}
                        content={entry.description}
                    />
                ))}
            </main>
            <style jsx>{`
                main {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-evenly;
                    align-items: center;
                }
            `}</style>
        </div>
    );
};

export default Index;
