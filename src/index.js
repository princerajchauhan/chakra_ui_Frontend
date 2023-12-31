import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import ChatProvider from './Context/ChatContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <ChatProvider>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </ChatProvider>
  // </React.StrictMode>
);

