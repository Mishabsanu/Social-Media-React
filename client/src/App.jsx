

import { useSelector } from 'react-redux'
import './App.css'
import PageNotFound from './PageNotFound'
import EditPost from './components/editPost/EditPost'
import PostAdd from './components/postAdd/PostAdd'
import Search from './components/search/Search'
import EditProfile from './page/editProfile/EditProfile'
import Home from './page/home/Home'
import Login from './page/login/Login'
import Profile from './page/profile/Profile'
import Signup from './page/signup/Signup'
import "react-toastify/dist/ReactToastify.css";
import {Routes,Route} from 'react-router-dom'
function App() {
  const token=useSelector((state)=>state.token)
  console.log(token,'o');





  return (
    <>
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route path="/Profile/:id" element={!token ? <Login /> :<Profile />} />
      <Route path="/editProfile/:id" element={!token ? <Login /> : <EditProfile />} />
      <Route path="/postAdd" element={!token ? <Login /> :<PostAdd/>} />
      <Route path="/editPost/:id" element={!token ? <Login /> :<EditPost/>} />
      <Route path="/search" element={<Search/>} />


      <Route path="/" element={<Home />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>



    </>
  )
}

export default App
