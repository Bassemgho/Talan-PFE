/* eslint-disable */
import io from 'socket.io-client';
// const sockets = io('http://localhost:5000', { autoConnect: true, forceNew: true });
const token = localStorage.getItem('accessToken');
console.log(token);
const socket = io.connect('http://localhost:5000/', {
  query: {token}
});
// const sockets = io('/');
export default socket;
