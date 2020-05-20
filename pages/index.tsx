import React, { FC } from 'react';
import { useTodosQuery } from '../.generated/hooks';
import Link from 'next/link';

const Index: FC = () => {
    const { data, loading, error } = useTodosQuery();

    if (!data || loading) return <p>Loading...</p>;
    if (error) return <p>Error: {JSON.stringify(error)}</p>;

    return (
        <div>
            <Link href="/api/login">
                <a>Login</a>
            </Link>
            <ul>
                {data.todos.map((todo) => (
                    <li key={todo.id ?? ''}>{todo.description}</li>
                ))}
            </ul>
        </div>
    );
};

export default Index;
