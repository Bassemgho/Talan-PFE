import { useRoutes } from 'react-router-dom';
import router from 'src/router';

import { SnackbarProvider } from 'notistack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import useAuth from 'src/hooks/useAuth';

import { CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import {PollDialogueProvider} from './contexts/PollDialogueContext.js'
import {SocketProvider} from './contexts/SocketContext.js'
import Appinit from './components/AppInit';

function App() {
  const content = useRoutes(router);
  const auth = useAuth();

  return (

    <ThemeProvider>
      <PollDialogueProvider>
        <SocketProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SnackbarProvider
              maxSnack={6}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <CssBaseline />
              {auth.isInitialized ? content : <Appinit />}
            </SnackbarProvider>
          </LocalizationProvider>
        </SocketProvider>
      </PollDialogueProvider>
    </ThemeProvider>
  );
}
export default App;
