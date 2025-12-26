import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import { DemoPaymentPage } from './pages/DemoPaymentPage'
import { PaymentSuccess } from './pages/PaymentSuccess'
import { PaymentFailure } from './pages/PaymentFailure'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/payment/demo" element={<DemoPaymentPage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentFailure />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
