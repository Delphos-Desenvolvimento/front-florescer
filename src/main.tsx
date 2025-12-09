import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

export const GlobalStyles = () => (
  <style>
    {`
      .MuiAppBar-root {
        background-color: #FFFFFF !important;
      }
    `}
  </style>
);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <GlobalStyles />
      <App />
    </>
  </StrictMode>,
)
