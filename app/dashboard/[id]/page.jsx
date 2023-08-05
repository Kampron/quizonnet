'use client'

import PromptCard from '@/components/PromptCard'
import { useSession } from 'next-auth/react'
import { notFound } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Dashboard = (ctx) => {
  const {data: session} = useSession()
  const [ids, setIds] = useState([])
  const [qtns, setQtns] = useState([])


  useEffect(() => {
    async function getQtnIds() {
      const res = await fetch(`/api/questions/user/userQtns/${ ctx.params.id }`, {
      })
    
      if (!res.ok) {
        return notFound
      }
    
      const qtnIds = await res.json()
      setIds(qtnIds)

    }
    getQtnIds()

  
    
      async function getQuestion() {
        const res = await fetch(`/api/questions`)

        if (!res.ok) {
          return notFound
        }

        const exam  = await res.json()

        setQtns(exam)
      }

      getQuestion()
    
  }, [ids])


  const userQtns = qtns.filter(qtn => ids.includes(qtn._id));

  
  return (
    <section className='w-full'>
      <h1 className='head_text text-left'> 
        <span className='blue_gradient'>Your Dashboard</span>
      </h1>
      <p className='desc text-left font-poppins font-semibold'>Below are all the questions you added to your dashboard.<br /> Free to add more or delete unwanted questions</p>

      <div className='mt-10 prompt_layout'>
        {userQtns.map((qtn, index) => (
          <PromptCard 
            key={index}
            post={qtn}
          />
          ))}  
      </div>

    </section>
  )
}

export default Dashboard