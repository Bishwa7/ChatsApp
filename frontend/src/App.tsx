
import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {

  const socketRef = useRef(null)
  const inputRef = useRef(null)
  const [messages, setMessages] = useState(["hello","Brother"])


  const sendMessage = () => {
    const socket = socketRef.current
    //@ts-ignore
    if (socket && socket.readyState === WebSocket.OPEN && inputRef.current) {

      //@ts-ignore
      const message = inputRef.current.value
      
      //@ts-ignore
      socket.send(JSON.stringify({
        type: "chat",
        payload: {
          message: message
        }
      }));
      //@ts-ignore
      inputRef.current.value = "";
    } 
    else {
      console.warn("Socket not connected yet");
    }
  }

  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:8080")
    //@ts-ignore
    socketRef.current=ws

    ws.onmessage = (ev) => {
      setMessages((prev)=> [...prev, ev.data])
      
    }


    // hard coding room join logic for now (will create diff page for it later)
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }))
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    }
  },[])



  return (
    <div className='h-screen flex justify-center items-center bg-rose-900'>
      <div className=' w-[500px] h-[90%] bg-black text-white flex flex-col justify-between border border-white rounded-lg'>
        <div className='bg-slate-700 h-[85%] m-[10px] border border-white rounded-md'>
          {messages.map(message => <div className='bg-white text-black p-[10px] m-[10px] rounded-md'> {message} </div>)}
        </div>

        <div className='flex justify-between h-[6%] mx-[10px] my-[20px] rounded-md'>
          <div className='bg-slate-700 w-[80%] h-[100%] rounded-md'>
            <input ref={inputRef} type='text' placeholder='message...' className='w-[100%] h-[100%]'></input>
          </div>
          <div className='w-[18%] h-[100%] flex justify-center items-center rounded-md'>
            <button onClick={sendMessage} className='bg-rose-900 w-[100%] h-[100%] flex justify-center items-center rounded-lg'>
              Send
            </button>
          </div>
          
        </div>
        
        
      </div>
    </div>
    
  )
}

export default App
