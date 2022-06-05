import { useState, createContext } from 'react';
import io from 'socket.io-client';

const token = localStorage.getItem('accessToken');
console.log(token);
const socketc = io.connect('http://localhost:5000/', {
  query: {token}
});
// const sockets = io('/');

export const SocketContext = createContext({})

export const SocketProvider = ({ children }) => {
  const [socket , setSocket] = useState(socketc)
  const getSocket = () => {
    if (socket==null){
      setSocket(socketc)
    }
    return socket;
  }
  return (
    <SocketContext.Provider value={{getSocket}}
    >
    {children}
    </SocketContext.Provider>
  )
}
