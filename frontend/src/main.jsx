import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css';
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from "react-router-dom"
import Home from './pages/Home.jsx'
import Chat from './pages/Chat.jsx'
import Register from './pages/Register.jsx'
import CheckEmail from './pages/CheckEmail.jsx'
import CheckPassword from './pages/CheckPassword.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx';

import { Provider } from 'react-redux';
import {store} from './redux/store.js'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path='' element={<Home />}>
        <Route path=':userId' element={<Chat />} />
      </Route> 
      <Route path='register' element={<Register />} />
      <Route path='email' element={<CheckEmail />} />
      <Route path='password' element={<CheckPassword />} />
      <Route path='forgot-password' element={<ForgotPassword/>} />

    </Route>
  )
)


ReactDOM.createRoot(document.getElementById('root')).render(

    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
 
)
