import React, { useState, useEffect } from 'react';
import styles from './Counter.module.css';

const Counter = (props: Date) => {
    const { queuedAt } = props;

    const [counter, setCounter] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
          setCounter(counter => Math.floor((new Date() - new Date(queuedAt)) / 1000));
        }, 1000);

        return () => {
          clearInterval(interval);
        };
    }, []);

    return (
        <span className={styles.root}>
            {counter > 0 ? counter: ''}
        </span>
    )
}

export default Counter;

