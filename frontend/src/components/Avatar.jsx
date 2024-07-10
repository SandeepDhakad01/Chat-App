import React from 'react'
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from 'react-redux';

const Avatar = ({userId,name,imageUrl,width,height}) => {
    const onlineUsers = useSelector(state => state?.user?.onlineUsers)

    let avatarName = ""

      let tname=""
      if(name)
      tname=name.trim()
    if(tname){
      const splitName = tname?.split(" ")

      if(splitName.length > 1){
        avatarName = splitName[0][0].toUpperCase()+splitName[1][0].toUpperCase()
      }else{
        avatarName = name[0].toUpperCase()
      }
    }

    const bgColor = [
      'bg-slate-200',
      'bg-teal-200',
      'bg-red-200',
      'bg-green-200',
      'bg-yellow-200',
      'bg-gray-200',
      "bg-cyan-200",
      "bg-sky-200",
      "bg-blue-200"
    ]

    const randomNumber = Math.floor(Math.random() * 9)

    let isOnline =false;
    if(userId)
  isOnline = Array.from(onlineUsers).includes(userId)
  
  return (
    <div className={`text-slate-800  rounded-full font-bold relative`} style={{width : width+"px", height : height+"px" }}>
        {
            imageUrl ? (
                <img
                    src={imageUrl}
                    width={width}
                    height={height}
                    alt={name}
                    className='overflow-hidden rounded-full'
                />
            ) : (
                name ? (
                    <div  style={{width : width+"px", height : height+"px" }} className={`overflow-hidden rounded-full flex justify-center items-center text-lg ${bgColor[randomNumber]}`}>
                        {avatarName}
                    </div>
                ) :(
                  <PiUserCircle
                    size={width}
                  />
                )
            )
        }

        {
          isOnline && (
            <div className='bg-green-600 p-1 absolute bottom-2 -right-1 z-10 rounded-full'></div>
          )
        }
      
    </div>
  )
}

export default Avatar
