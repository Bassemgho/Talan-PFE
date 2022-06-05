/* eslint-disable */
import {useState,useEffect,useContext,useRef} from 'react'
import {
  Box,
  Card,
  Typography,
  alpha,
  IconButton,
  Tooltip,
  TextField,
  Avatar,
  Badge,
  Divider,
  Button,
  Slide,
  CircularProgress,
  styled
} from '@mui/material';


function UsersDisplay({children}){
  return (
    <Box
  sx={{
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    p: 1,
    m: 1,
    bgcolor: 'background.paper',
    borderRadius: 1,
  }}
>
{children}
</Box>

  )
}
export default UsersDisplay
