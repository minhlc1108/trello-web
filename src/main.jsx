// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ConfirmProvider } from 'material-ui-confirm'
import { Provider } from 'react-redux'
import store from '~/redux/store'
import persistStore from 'redux-persist/es/persistStore'
import { PersistGate } from 'redux-persist/integration/react'

let persitor = persistStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <CssVarsProvider theme={theme}>
    <ConfirmProvider defaultOptions={{
      allowClose: false,
      confirmationButtonProps: { color: 'error', variant: 'contained' },
      cancellationButtonProps: { color: 'primary', variant: 'outlined' },
      buttonOrder: ['confirm', 'cancel']
    }}>
      <CssBaseline />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persitor}>
          <App />
          <ToastContainer position="bottom-left" theme="colored" />
        </PersistGate>
      </Provider>
    </ConfirmProvider>
  </CssVarsProvider>
  // </React.StrictMode>
)
