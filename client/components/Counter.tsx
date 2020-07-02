import React, { useState, useEffect } from 'react';
import styles from './Counter.module.css';

type CounterProps = {
  queuedAt: Date | null
}

const Counter = (props: CounterProps) => {
    const { queuedAt } = props;

    const [counter, setCounter] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
          if (queuedAt) {
            setCounter(Math.floor((new Date().valueOf() - new Date(queuedAt).valueOf()) / 1000));
          }
        }, 1000);

        return () => {
          clearInterval(interval);
        };
    }, [counter, queuedAt]);

    return (
        <span className={styles.root}>
            {counter > 0 ? counter: ''}
        </span>
    )
}

export default Counter;

