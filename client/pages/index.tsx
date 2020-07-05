import Layout from '../components/Layout'
import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react';
import SessionView from '../components/SessionView';
import styles from "./index.module.css";
import { v4 as uuidv4 } from 'uuid';

interface StartSessionViewProps {
  nameRef: any,

  setSessionState: any
}
const StartSessionView = (props: StartSessionViewProps) => {
  const { nameRef, setSessionState } = props;
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const savedUserName = localStorage.getItem('userName');
    if (savedUserName) {
      setUserName(savedUserName);
    }
  });

  const handleChange = (e: any) => {
    localStorage.setItem('userName', e.target.value);
    setUserName(e.target.value);
  }

  return (<form className={styles.joinForm} onSubmit={() => setSessionState(true)}>
    <input required placeholder='Name' value={userName} onChange={handleChange} className={styles.nameInput} type="text" name={"screenName"} ref={nameRef} autoFocus/>
    <button className={styles.joinButton}>Join</button>
  </form>);
};

const IndexPage = () => {

  const nameRef = useRef<HTMLInputElement>(null);
  const [sessionStatus, setSessionState] = useState<boolean>(false);
  const [room, setRoom] = useState<string>("")

  useEffect(()=> {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    if (params.has("room")) {
      setRoom(params.get("room") || "")
    } else {
      let roomId = uuidv4()
      setRoom(roomId);
      window.location.search = "&room=" + roomId; 
    }
  }, [])
  
  return (
    <Layout title="TK Hands APP">
      {!sessionStatus 
        ? <StartSessionView nameRef={nameRef} setSessionState={setSessionState} /> 
        : <SessionView name={nameRef.current?.value || ""} room={room} />}
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(IndexPage), {
  ssr: false
})
