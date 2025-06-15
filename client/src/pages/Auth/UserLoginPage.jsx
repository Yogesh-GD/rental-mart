import React, { useState } from 'react'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router'
import { NavLink } from 'react-router'
import { userLogin } from '../../slices/Auth/authSlice'


const UserLoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState(
    {
      email: '',
      password: '',
    }
  )
  const { status, error } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key])
    })
    dispatch(userLogin(data))
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (status === "succeed") {
    setTimeout(() => {
      navigate("/")
    }, 1000);
  }

  return (
    <div className=' '>
      <div>
        <h2 className='  text-4xl font-semibold my-5'>Create new account.</h2>
        <h3 className=' text-[#000] mt-5 mx-3'>New Here? <NavLink className={' text-[#676767]'} to={"/auth/user/register"} >Register</NavLink></h3>

        <div className=' lg:w-[400px]  pt-3 ' >
          <form className=' flex flex-col gap-4 py-10' >

            <div className=' relative flex justify-between gap-3 items-center  px-3  py-3 text-zinc-500 rounded-xl'>
              <input className=' peer border-b-2 border-[#000] flex-grow bg-transparent text-black  focus:outline-none' type="email" name="email" id="email" onChange={(e) => handleChange(e)} />
              <label className={` transition-all duration-200 absolute left-3  peer-focus:-top-3 peer-focus:text-sm ${formData.email.length > 0 ? '-top-3' : 'top-3'} `} htmlFor="email">Email</label>
              mail
            </div>

            <div className='relative flex justify-between gap-3 items-center  px-3  py-3 text-zinc-500 rounded-xl'>
              <input className='peer  border-b-2 border-[#000] flex-grow bg-transparent text-black  focus:outline-none' type={passwordVisible ? 'text' : 'password'} name="password" id="password" onChange={(e) => handleChange(e)} />
              <label className={` transition-all duration-200 absolute   left-3 peer-focus:-top-3 peer-focus:text-sm ${formData.password.length > 0 ? '  -top-3' : 'top-3'} `} htmlFor="password">Password</label>
              {!passwordVisible ? <BsEye className='cursor-pointer text-black' onClick={() => setPasswordVisible(!passwordVisible)} /> : <BsEyeSlash className='cursor-pointer text-black' onClick={() => setPasswordVisible(!passwordVisible)} />}
            </div>
            {error && <p className="mt-3 text-sm text-red-400">{error.message}</p>}

            <button className=' text-white bg-[#000] px-3 py-2 rounded-3xl' type="submit" onClick={(e) => handleSubmit(e)}>Login</button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default UserLoginPage

