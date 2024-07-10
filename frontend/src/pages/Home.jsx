import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import logo from '../assets/logo.png'
import io from 'socket.io-client'



const Home = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // console.log('user',user)
  const fetchUserDetails = async()=>{
    try {

      // Ensure axios sends cookies
axios.defaults.withCredentials = true;

       const URL = `${import.meta.env.VITE_BACKEND_URL}/v1/user/user-details`
        console.log("url",URL)

       const response = await axios.get(URL,{
        withCredentials : true
      })
          
        console.log("respnonse in home => " ,response)
        dispatch(setUser(response.data.data))

        if(response.data.data.logout){
            dispatch(logout())
           navigate("/email")
        }
        console.log("current user Details",response)
    } catch (error) {

      console.log("error in home ",error)
      navigate('/email')
    }
  }

  useEffect(()=>{
    fetchUserDetails()
  },[])

  /***socket connection */

useEffect(() => {
  if (user?._id) {
    const socketConnection = io(import.meta.env.VITE_SERVER_URL,{
      auth: {
        userId: user._id
      }
    });

    socketConnection.on("connect", () => {
      console.log("Socket connected");
      dispatch(setSocketConnection(socketConnection));

      socketConnection.on("onlineUser", (data) => {
        dispatch(setOnlineUser(data));
      //  console.log("onlineUser listener called -> ", data);
      });
    });

    return () => {
      if (socketConnection) {
        socketConnection.disconnect();
      }
    };
  }
}, [user._id.toString()]);



  const basePath = location.pathname === '/'
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
        <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
           <Sidebar/>
        </section>

        {/**message component**/}
        <section className={`${basePath && "hidden"}`} >
            <Outlet/>
        </section>


        <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex" }`}>
            <div>
              <img
                src={logo}
                width={250}
                alt='logo'
              />
            </div>
            <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
        </div>
    </div>
  )
}

export default Home
