import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react'
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const toastLoading = toast('Please sign in first', {
    icon: '🔐'
  });
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login')
      toastLoading
    }
  })
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard