import React, { useState, useEffect } from 'react';
import styles from "./UserCard.module.css";
import User from '../interfaces';
import Counter from './Counter';

const UserCard = (props: User) => {

    const { user: { name, wantsToTalk, queuedAt }} = props;
    const emoji:string = wantsToTalk ? '✋' : '';

    return (
        <div className={styles.user}>
            {name}
            {wantsToTalk && 
                <span className={styles.userStatus}>
                    <span className={styles.userStatusIcon}>
                        { emoji } 
                    </span>
                    <Counter queuedAt={queuedAt} />
                </span>
            }
        </div>
    )
}

export default UserCard;

