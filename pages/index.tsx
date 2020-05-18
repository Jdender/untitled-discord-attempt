import React, { FC } from 'react';
import { useTodosQuery } from '../client-util/generated';

const Index: FC = () => {
    const { data, loading, error } = useTodosQuery();

    if (!data || loading) return <p>Loading...</p>;
    if (error) return <p>Error: {JSON.stringify(error)}</p>;

    return (
        <ul>
            {data.todos.map((todo, id) => (
                <li key={id}>{todo.description}</li>
            ))}
        </ul>
    );
};

export default Index;
