'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { HiAtSymbol, HiFingerPrint } from 'react-icons/hi';

const Login = () => {
  const router = useRouter();

  const [show, setShow] = useState(false);

  const notify = () =>
    toast.promise(signIn('google', { callbackUrl: 'http://localhost:3000' }), {
      loading: 'signing in with google',
      success: 'Got the data',
      error: 'Error when fetching',
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    const toastLoading = toast.loading('Loading...');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      toastLoading;

      if (res?.error == null) {
        router.push('/');
        toast.success('Signed in successfully', { id: toastLoading });
      } else {
        toast.error('Email not registered or wrong password', {
          id: toastLoading,
        });
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.', {
        id: toastLoading,
      });
    }
  };

  return (
    <>
      <section className="w-full max-w-full flex-start flex-col">
        <h1 className="head_text text-left">
          <span className="blue_gradient">Sign In</span>
        </h1>
        <p className="desc text-left max-w-md font-inter">
          Sign in to enjoy all the amazing features i.e taking lives quizzes and
          personalizing your quizzes by adding questions to your dashboard
        </p>
        <div className="mt-10 w-full sm:w-1/2  max-w-2xl flex flex-col gap-4 glassmorphism">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="input_group">
              <input
                type="email"
                placeholder="Email"
                required
                className="form_input"
              />
              <span className="flex items-center px-1 mr-2">
                <HiAtSymbol size={18} color="gray" />
              </span>
            </div>

            <div className="input_group">
              <input
                type={`${show ? 'text' : 'password'}`}
                placeholder="Password"
                required
                className="form_input"
              />
              <span
                className="flex items-center px-1 mr-2 cursor-pointer"
                onClick={() => setShow(!show)}
              >
                <HiFingerPrint
                  size={18}
                  className="text-gray-500 hover:text-indigo-500"
                />
              </span>
            </div>

            <button className="signIn_btn ">Sign in</button>
          </form>

          <button className="google_btn" onClick={notify}>
            Login with Google
          </button>

          <Link className="blue_gradient font-extrabold" href="/register">
            Create new account
          </Link>
        </div>
      </section>
      <Toaster />
    </>
  );
};

export default Login;
