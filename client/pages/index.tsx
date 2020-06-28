import Layout from '../components/Layout'
import dynamic from 'next/dynamic'
import { useState, useRef } from 'react';
import SessionView from '../components/SessionView';

const IndexPage = () => {

  const nameRef = useRef<HTMLInputElement>(null);
  const [sessionStatus, setSessionState] = useState<boolean>(false);

  const StartSessionView = () => (
    <div>
      <input type="text" name={"screenName"} ref={nameRef} />
      <button onClick={() => setSessionState(true)}>Connect</button>
    </div>
  )


  return (
    <Layout title="TK Hands APP">
      {!sessionStatus? <StartSessionView/> : <SessionView name={nameRef.current?.value || ""}/>}
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(IndexPage), {
  ssr: false
})
