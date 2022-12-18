import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App'
import Home from './Home'
import NewSplit from './NewSplit'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewSplit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
