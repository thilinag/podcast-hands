import React from 'react'
import styles from "./UserCard.module.css";
import User from '../interfaces'

const UserCard = (props: User) => {

    const { user: { name, wantsToTalk }} = props;
    const emoji:string = wantsToTalk ? '✋' : '';
    
    return (
        <div className={styles.user}>
            {name}
            {wantsToTalk && 
                <i className={styles.userStatus}>{ emoji }</i>
            }
        </div>
    )
}

export default UserCard;

