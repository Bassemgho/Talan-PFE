/* eslint-disable */
import { useState, createContext } from 'react';

export const PollDialogueContext = createContext({})

export const PollDialogueProvider = ({ children })=>{
  const [isOpen,setOpen] = useState(false)
  const [voteisOpen,setVoteOpen] = useState(false)
  const [allisOpen,setallOpen] = useState(false)
  const [poll,setpoll] = useState({})
  const [allpolls,setAllpolls] = useState([])
  const openAll = () => {
    setallOpen(true)
  }
  const closeAll = () => {
    setallOpen(false)
  }
  const openVote = () => {
    setVoteOpen(true)
  }
  const closeVote = () => {
    setVoteOpen(false)
  }
  const onClose = ()=>{
    setOpen(false)
  }
  const onOpen = ()=>{
    setOpen(true)
  }
  return (
    <PollDialogueContext.Provider
    value={{isOpen,onOpen,onClose,voteisOpen,openVote,closeVote,setpoll,poll,allisOpen,openAll,closeAll,allpolls,setAllpolls}}>
    {children}
    </PollDialogueContext.Provider>
  );
}
