import React, { FC } from 'react';
import { useTodosQuery } from '../.generated/hooks';

const Index: FC = () => {
    const { data, loading, error } = useTodosQuery();

    if (!data || loading) return <p>Loading...</p>;
    if (error) return <p>Error: {JSON.stringify(error)}</p>;

    return (
        <ul>
            {data.todos.map((todo) => (
                <li key={todo.id ?? ''}>{todo.description}</li>
            ))}
        </ul>
    );
};

export default Index;
