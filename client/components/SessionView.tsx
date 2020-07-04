import socketIOClient from "socket.io-client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./SessionView.module.css";
import UserCard from './UserCard';
import { User } from '../interfaces';

interface SessionViewProps {
    name: string,
    room: string
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
        // TODO Auto Configure Based On Environment
        const socket = socketIOClient("/", {
            query: "userName=" + props.name + "&room=" + props.room
        });
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

        if (!sessionState) {
            return (<div>Loading&hellip;</div>);
        }

        //sort users by queuedAt;
        const userQueue: User[] = sessionState.users.sort((a, b) => new Date(a.queuedAt || 0).valueOf() - new Date(b.queuedAt || 0).valueOf());

        //move users who did not queue to the end
        const sortedUserQueue : User[] = [
            ...userQueue.filter( user => user.queuedAt !== null),
            ...userQueue.filter( user => user.queuedAt === null)
        ];

        return (
            <div className={styles.users}>
                { sortedUserQueue.map( user => {
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
            <button className={styles.letMeTalkButton} type="button" onClick={()=>toggleHands()} autoFocus>
                { wantToTalk ? 'Clear' : 'Let me talk ✋' }
            </button>
        </>
    )
}

export default dynamic(() => Promise.resolve(SessionView), {
    ssr: false
})
