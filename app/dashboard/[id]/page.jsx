'use client'

import { useSession } from 'next-auth/react'
import React from 'react'

const Dashboard = () => {
  const {data:session} = useSession()
  return (
    <div>Sorry this page is still under construction🙏</div>
  )
}

export default Dashboard