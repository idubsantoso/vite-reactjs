import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from "@tanstack/react-query"

import App from './app/App'
import { queryClient } from './libs/query-client'
import './index.css'

async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_USE_MSW === "false") {
    return
  }

  const { worker } = await import("./mocks/browser")

  return worker.start({
    onUnhandledRequest: "bypass",
  })
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>,
  )
})
