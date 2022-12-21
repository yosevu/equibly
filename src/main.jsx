import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

import App from './App'
import Home from './Home'
import NewSplit from './NewSplit'
import NewLink from './NewLink'
import NewIncome from './NewIncome'
import SplitProportion from './SplitProportion'
import './index.css'

const {
  VITE_API_KEY: apiKey,
  VITE_AUTH_DOMAIN: authDomain,
  VITE_PROJECT_ID: projectId,
  VITE_STORAGE_BUCKET: storageBucket,
  VITE_MESSAGING_SENDER_ID: messagingSenderId,
  VITE_APP_ID: appId,
  VITE_MEASUREMENT_ID: measurementId,
} = import.meta.env;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const functions = getFunctions(app);
const addSplit = httpsCallable(functions, 'addSplit');
const removeSplit = httpsCallable(functions, 'removeSplit');
const addParty = httpsCallable(functions, 'addParty');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewSplit addSplit={addSplit} />} />
          <Route path="/link" element={<NewLink />} />
          <Route path="/income" element={<NewIncome addParty={addParty} />} />
          <Route path="/split" element={<SplitProportion db={db} removeSplit={removeSplit} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
