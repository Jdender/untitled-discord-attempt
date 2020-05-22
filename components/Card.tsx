import React, { FC } from 'react';
import {} from '../.generated/hooks';

interface CardProps {
    icon: string;
    header: string;
    content: string;
}

const Card: FC<CardProps> = ({ icon, header, content }) => (
    <div>
        <img src={icon} />
        <h1>{header}</h1>
        <p>{content}</p>
        <style jsx>{`
            div {
                width: 20vw;
                height: 50vh;
                background-color: var(--card-bg);
                border: 1px solid black;

                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
        `}</style>
    </div>
);

export default Card;
