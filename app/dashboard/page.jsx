import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'


const Dashboard = () => {

  const router = useRouter()

  const toastLoading = toast('Please sign in first', {
    icon: '🔐'
  });
  
  const { status } = useSession()
  if(status === 'unauthenticated') {
    router.push('/login')
    toastLoading
  }
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard