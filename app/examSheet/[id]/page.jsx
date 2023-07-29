'use client'

import React from 'react'
import { notFound } from "next/navigation"
import { Box, Heading, VStack } from '@chakra-ui/react'


async function getData( id ) {
  const res = await fetch(`http://localhost:3000/api/questions/${id}`, {
    cache: 'no-store'
  })

  if (!res.ok) {
    return notFound()
  }

  return res.json()
}



const ExamSheet = async ({ params }) => {  
 const data = await getData(params.id)

  return (
    <Box
      color={'gray.900'}
      bg={('gray.300')}
      p={'10'}
      maxW={800}
      my={'10'}
      mx={[4, 4, 5, 'auto']}
      borderRadius={5}
    >
      {data.subject}
    </Box>
  )
}

export default ExamSheet