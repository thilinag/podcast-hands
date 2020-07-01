import React, { useState, useEffect } from 'react'
import styles from "./UserCard.module.css";
import User from '../interfaces'

const UserCard = (props: User) => {

    const { user: { name, wantsToTalk, queuedAt }} = props;
    const emoji:string = wantsToTalk ? '✋' : '';
    const [ elapsedSeconds, setElapsedSeconds ] = useState<number>(0);

    const calculateElapsedSeconds = () => {
        return Math.floor((new Date() - new Date(queuedAt)) / 1000);
    }

    useEffect(() => {
      setTimeout(() => {
        setElapsedSeconds(calculateElapsedSeconds());
      }, 1000);
    });

    return (
        <div className={styles.user}>
            {name}
            {wantsToTalk && 
                <span className={styles.userStatus}>
                    <span className={styles.userStatusIcon}>
                        { emoji } 
                    </span>
                    <small className={styles.ellapsedSeconds}>
                        {elapsedSeconds > 0 ? elapsedSeconds: ''}
                    </small>
                </span>
            }
        </div>
    )
}

export default UserCard;

