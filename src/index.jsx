import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ClientsDataProvider } from './contexts/ClientsDataContext'

createRoot(document.getElementById('root')).render(
  <ClientsDataProvider>
    <App />
  </ClientsDataProvider>
)