import { Outlet } from "react-router-dom"
import React from 'react';
import { Toaster } from 'react-hot-toast';

function App() {


  return (
    < div className="w-screen h-screen bg-gray-200">
      <Toaster/>
        <Outlet/>
      
    </div>
  )
}

export default App
