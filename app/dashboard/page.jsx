import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'


const Dashboard = () => {
  const toastLoading = toast('Please sign in first', {
    icon: '🔐'
  });
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login')
    }
  })
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard