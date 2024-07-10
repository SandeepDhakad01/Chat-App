import React, { useState } from 'react'

const ForgetPassword = () => {
  const [hidden,setHidden]=useState(true);
  return (
    <div className=' w-full h-full border-2 border-black flex flex-col justify-center items-center'>
    <div>Fuck Off 🤢</div>
      <button className={`${hidden?"block":"hidden"}  px-2 py-2 bg-yellow-500 rounded-md text-white font-semibold m-3`} onClick={()=>setHidden(false)}>Click here</button>
      <div className={` ${hidden?"hidden":""}`}>
        <h3> Its Lunch Time...</h3>
        <p> Visit Tomorrow😊</p>
      </div>
    </div>
  )
}

export default ForgetPassword