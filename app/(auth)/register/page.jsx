'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import Link from 'next/link';
import { toast, Toaster, ToastBar } from 'react-hot-toast';
import { BsInfoCircleFill } from 'react-icons/bs'
import { GiCheckMark } from 'react-icons/gi'
import { FaTimes } from 'react-icons/fa'
import { HiOutlineFingerPrint, HiOutlineAtSymbol, HiOutlineUser } from "react-icons/hi";

const instructions = "text-[0.7rem] rounded-[0.5rem] bg-[#000] text-[#fff] p-[0.25rem] relative bottom-[-10px]"
const offscreen = "absolute left-[-999px]"
const hide = "hidden"
const valid = "ml-0.25rem"
const invalid = "ml-0.25rem"
const errmsg = "bg-[lightpink] text-[firebrick] font-[bold] p-[0.5rem] mb-[0.5rem] "

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;/^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;


const Register = () => {
  const userRef = useRef()
  const emailRef = useRef()
  const errRef = useRef()

  const [error , setError] = useState('')
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validName, setValidName] = useState(false)
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [show, setShow] = useState(false)

  const router = useRouter()
  const session = useSession()  
  useEffect(() => {
        setValidName(USER_REGEX.test(username));
    }, [username])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
    }, [password])

    useEffect(() => {
        setError('');
    }, [username, password])

  const notify = () => toast.promise(signIn("google"), {
    loading: 'Loading',
  success: 'Got the data',
  error: 'Error when fetching'
  });
  if(session === 'authenticated') {
    router.push('/')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastLoading = toast.loading('Loading...');

    try{
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username, 
          email, 
          password,
        }),
      });
      toastLoading

      if(res.status === 501) {
        toast.error("Email already registered", { id: toastLoading })
      }

      if(res.status === 201) {
        toast.success("Account created successfully", { id: toastLoading })
        router.push("/login?success=Account has been created");
      }
      
    }catch (err) {
      setError(err)
      console.log(error)
    }
  }
  return (
    <>
    
    <section className='w-full max-w-full flex-start flex-col'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>Register</span>
      </h1>
      <p className='desc text-left max-w-md font-inter'>
        Sign up and instantly get access to myriad of past questions and take live quizzes. 
      </p>
      <div className='mt-10 w-full sm:w-1/2 max-w-2xl flex flex-col gap-4 glassmorphism' >
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <span className={validName ? valid : hide }>
              <GiCheckMark color="limegreen" className='inline ml-[0.30rem]' />
          </span>
          <span className={validName || !username ? hide : invalid}>
              <FaTimes color="red" className='inline ml-[0.30rem]' />
          </span>
          <div className='input_group'>
             <input
              type='text'
              placeholder='Username'
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              className='form_input'
            />
            <span className='flex items-center px-4 mr-5'>    
            <HiOutlineUser size={25} color='gray'/>
          </span>
          </div>
       

        <p id='uidnote' className={userFocus && username && !validName ? instructions : offscreen}>
          <BsInfoCircleFill className='inline mr-[0.35rem]' />
          4 to 24 characters.<br />
          Must begin with a letter.<br />
          Letters, numbers, underscores, hyphens allowed.
        </p>

        <div className='input_group'>
          <input
            type='email'
            autoComplete="off"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            className='form_input'
          />
          <span className='flex items-center px-4 mr-5'>    
            <HiOutlineAtSymbol size={25} color='gray'/>
          </span>
        </div>
        

        <span className={validPwd ? valid : hide }>
          <GiCheckMark color="limegreen" className='inline ml-[0.30rem]' />
        </span>
        <span className={validPwd || !password ? hide : invalid}>
          <FaTimes color="red" className='inline ml-[0.30rem]' />
        </span>
        <div className='input_group'>
          <input
            type={`${show? "text":"password"}`}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-describedby="pwdnote"
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
            className='form_input'
          />
          <span className='flex items-center px-4 mr-5 cursor-pointer' onClick={() => setShow(!show)}>    
            <HiOutlineFingerPrint size={25} className='text-gray-500 hover:text-indigo-500'/>
          </span>
        </div>
        <p id="pwdnote" className={pwdFocus && !validPwd ? instructions : offscreen }>
          <BsInfoCircleFill className='inline mr-[0.35rem]' />
          8 to 24 characters.<br />
          Must include uppercase and lowercase letters, a number and a special character.<br />
          Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
        </p>
        <button className='signin_btn'>Sign up</button>
      </form>
  
      <button 
        className='google_btn'
        onClick={notify}
      > 
        Login with Google
      </button>
      
      <Link className='blue_gradient font-extrabold' href="/login">
        Already have an account? <span className='green_gradient ml-3'>Sign In</span>
      </Link>
      </div>
    </section>
    {/* <button onClick={notify}>Make me a toast</button> */}
      {/* <Toaster /> */}
    </>
  )
}

export default Register