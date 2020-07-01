import socketIOClient from "socket.io-client";
import { useEffect, useState, ReactElement } from "react";
import dynamic from "next/dynamic";
import styles from "./SessionView.module.css";
import UserCard from './UserCard';
import User from '../interfaces';

interface SessionViewProps {
    name: string
}

interface State {
    active?: User,
    users: User[]
}

const SessionView = (props: SessionViewProps) => {

    const [sessionState, setSessionState] = useState<State>();
    const [socket, setSocket] = useState<SocketIOClient.Socket>();
    const [wantToTalk, setWantToTalk] = useState<boolean>(false);

    useEffect(() => {
        const socket = socketIOClient("http://localhost:3005");
        socket.emit("registerUser", {
            "name": props.name
        })
        socket.on("state", (state: State) => {
            setSessionState(state);
        })
        setSocket(socket);
    }, []);

    const toggleHands = () => {
        if (!socket) return;
        setWantToTalk(!wantToTalk);
        socket.emit("toggleHands", true)
    }

    const Users = () => {

        console.log(sessionState.users);
        //sort users by queuedAt;
        const userQueue: User[] = sessionState.users.sort((a, b) => new Date(a.queuedAt) - new Date(b.queuedAt));

        //move users who did not queue to the end
        userQueue.push(userQueue.splice(userQueue.findIndex(user => user.queuedAt == null), 1)[0]);

        return (
            <div className={styles.users}>
                { userQueue.map( user => {
                    return (<UserCard user={user} key={user.id} />) 
                })}
            </div>

        )  
    } 

    return (
        <>
            { sessionState?.users &&
                <Users />
            }
            <button className={styles.letMeTalkButton} type="button" onClick={()=>toggleHands()}>
                { wantToTalk ? 'Changed my mind 🤐' : 'Let me talk ✋' }
            </button>
        </>
    )
}

export default dynamic(() => Promise.resolve(SessionView), {
    ssr: false
})
