import React, { useState } from 'react'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router'
import { userRegister } from '../../slices/Auth/authSlice'

const UserRegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    contactNo:""
  })
  const [passwordVisible, setPasswordVisible] = useState(false)


  const { status, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key])
    })

    dispatch(userRegister(data))

  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })

  }


  return (
    <div className=' w-full md:w-1/2  '>


      <div >
        <h2 className='  text-4xl font-semibold my-5'>Create new account.</h2>
        <h3 className=' text-[#000] mt-5 mx-3'>Already A Member? <NavLink className={' text-[#676767]'} to={"/auth/user/login"}>Log In</NavLink></h3>
        <div className=' lg:w-[400px]  pt-3 ' >
          <form className=' flex flex-col gap-4 py-10' >
              {status === "registered" && <div> SuccessFully Registered, <Link to={"/auth/user/login"} >Login Now</Link> </div>}
            <div className=' relative flex justify-between gap-3 items-center  px-3  py-3 text-zinc-500 rounded-xl'>
              <input className=' peer border-b-2 border-[#000] flex-grow bg-transparent text-black  focus:outline-none' type="text" name="username" id="username" onChange={(e) => handleChange(e)} required />
              <label className={` transition-all duration-200 absolute left-3  peer-focus:-top-3 peer-focus:text-sm ${formData.username.length > 0 ? '-top-3' : 'top-3'} `} htmlFor="username">UserName</label>
             badge
            </div>

            <div className=' relative flex justify-between gap-3 items-center  px-3  py-3 text-zinc-500 rounded-xl'>
              <input className=' peer border-b-2 border-[#000] flex-grow bg-transparent text-black  focus:outline-none' type="email" name="email" id="email" onChange={(e) => handleChange(e)} required />
              <label className={` transition-all duration-200 absolute left-3  peer-focus:-top-3 peer-focus:text-sm ${formData.email.length > 0 ? '-top-3' : 'top-3'} `} htmlFor="email">Email</label>
             mail
            </div>

            <div className=' relative flex justify-between gap-3 items-center  px-3  py-3 text-zinc-500 rounded-xl'>
              <input className=' peer border-b-2 border-[#000] flex-grow bg-transparent text-black  focus:outline-none' type="text" name="contactNo" id="contactNo" onChange={(e) => handleChange(e)} required />
              <label className={` transition-all duration-200 absolute left-3  peer-focus:-top-3 peer-focus:text-sm ${formData.contactNo.length > 0 ? '-top-3' : 'top-3'} `} htmlFor="email">Contact No.</label>
             Contact No.
            </div>

            <div className=' relative flex justify-between gap-3 items-center  px-3  py-3 text-zinc-500 rounded-xl'>
              <input className=' peer border-b-2 border-[#000] flex-grow bg-transparent text-black  focus:outline-none' type={passwordVisible ? 'text' : 'password'} name="password" id="password" onChange={(e) => handleChange(e)} required />
              <label className={` transition-all duration-200 absolute left-3  peer-focus:-top-3 peer-focus:text-sm ${formData.password.length > 0 ? '-top-3' : 'top-3'} `} htmlFor="password">Password</label>
              {!passwordVisible ? <BsEye className='cursor-pointer text-black' onClick={() => setPasswordVisible(!passwordVisible)} /> : <BsEyeSlash className='cursor-pointer text-black' onClick={() => setPasswordVisible(!passwordVisible)} />}

            </div>
            {error && <p className="mt-3 text-sm text-red-400">{error.message}</p>}
            <button className=' text-white bg-[#000] px-3 py-2 rounded-3xl' type="submit" onClick={(e) => handleSubmit(e)} >Login</button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default UserRegisterPage