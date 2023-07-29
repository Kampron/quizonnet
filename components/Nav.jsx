'use client'


import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { useEffect, useState } from "react";
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const links = [
  {
    id: 1,
    title: "Home",
    url: "/",
  },
  // {
  //   id: 2,
  //   title: "Portfolio",
  //   url: "/portfolio",
  // },
  // {
  //   id: 3,
  //   title: "Blog",
  //   url: "/blog",
  // },
  {
    id: 4,
    title: "About",
    url: "/about",
  },
  {
    id: 5,
    title: "Contact",
    url: "/contact",
  },
];



const Nav = () => {
  const { data: session } = useSession()
  const [toggleDropdown, setToggleDropdown] = useState(false)

  const router = useRouter()

  const handleSignOut = () => {
    router.push('/')
    signOut()
  }

  return (
    <nav className='flex justify-between  items-center w-full mt-5 mb-16'>
      <Link href="/" className="flex gap-2 items-center">
        <Image 
          src="/assets/images/logo.svg"
          alt="logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">Quizonnet</p>
      </Link>

      {/* Desktop Navigation */}
      <div className="sm:flex hidden">
        <div className="flex items-center gap-3 md:gap-5">
          {links.map((link) => (
            <Link key={link.id} href={link.url} className='font-poppins font-semibold'>
              {link.title}
            </Link>
          ))}
          {session?.user ? (
            <div className="flex gap-3 md:gap-5">
              <button type="button" onClick={handleSignOut} className="black_btn">
                <Link href="/">
                  Sign Out
                </Link>
              </button>

              <Link href='/profile'>
                {session?.user.image ? (
                  <Image 
                    src={session?.user.image}
                    width={37}
                    height={37}
                    className='rounded-full'
                    alt='profile'
                  />
                ): (
                  <Image 
                    src="/assets/images/avatar.png"
                    width={37}
                    height={37}
                    className='rounded-full'
                    alt='avatar'
                  />
                )}
              
            </Link>
            </div>
          ) : (
            <button className="black_btn">
              <Link href="/login">
                Sign In
              </Link>
            </button>
          )}
        </div>
      </div>

      {/* { Mobile Navigation } */}

      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            {session?.user.image ? (
              <Image 
                src={session?.user.image}
                width={37}
                height={37}
                className='rounded-full'
                alt='profile'
                onClick={() => setToggleDropdown((prev) => !prev)}
              />
              ) : (
                <Image 
                  src="/assets/images/avatar.png"
                  width={37}
                  height={37}
                  className='rounded-full'
                  alt='profile'
                  onClick={() => setToggleDropdown((prev) => !prev)}
                />
              )}
              
              {toggleDropdown && (
                <div className="dropdown">
                  <Link
                    href="/profile"
                    className="dropdown_link"
                    onClick={() => setToggleDropdown(false)}
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setToggleDropdown(false)
                      handleSignOut
                    }}
                    className="mt-5 w-full black_btn"
                  >
                    Sign Out
                  </button>
                </div>
              )}
          </div>
        ) : (
          <button className="black_btn">
            <Link href="/login">
              Sign In
            </Link>
          </button>
        )}
      </div>
    </nav>
  )
}

export default Nav