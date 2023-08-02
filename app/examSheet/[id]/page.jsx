'use client'

import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, Grid, HStack, Heading, Icon, ListItem, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Show, Spacer, Text, UnorderedList, VStack } from '@chakra-ui/react'
import { CldImage, CldOgImage } from 'next-cloudinary'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import { MathComponent } from "mathjax-react";


const ExamSheet = (ctx) => {  

  const [data, setData] = useState()

  useEffect(() =>{
    async function getQuestions() {
      const res = await fetch(`/api/questions/${ctx.params.id}`)

      if (!res.ok) {
        return notFound()
      }

      const exam = await res.json()
      setData(exam)
    }
    getQuestions()
  }, [])

  
  return (
    <Box
      color={'gray.900'}
      bg={('gray.300')}
      p={[2, 5]}
      maxW={800}
      my={'10'}
      mx={[2, 'auto']}
      borderRadius={5}
      className='font-poppins w-full'
    >
      {!data ? (
        <Box align={'center'}>
          <Text fontSize={['x-small', 'sm']}>
            Loading Questions....
          </Text>
          <Text fontSize={['x-small', 'sm']}>
            Practice it in quiz mode
          </Text>
        </Box>
      ) : (
        <Box>
          <VStack>
            <Heading align={'center'} fontSize={['x-small', 'sm']}>{data.subject.toUpperCase()}</Heading>
            <Text fontSize={['x-small', 'sm']}>OBJECTIVE TEST</Text>
            <Text fontSize={['x-small', 'sm']}>{data.type} {data.month} {data.year}</Text>
          </VStack>
          <Box>
            {data.sheet.map((qtn, index) => (
              <Box key={index}>
                <Heading size={'md'} align={'center'} fontSize={['x-small', 'sm']}>{qtn.part}</Heading>
                <Heading size={'md'} align={'center'} fontSize={['x-small', 'sm']}>{qtn.label}</Heading>
                <Heading size="md" align={'center'} mb={3} fontSize={['x-small', 'sm']}>{qtn.section}</Heading>
                <Text align={'center'} m={5} fontSize={['x-small', 'sm']}>{qtn.instructions}</Text>
                <Box align='center'>
                  {qtn.img ? (
                    <>
                    </>
                  ) : (
                    <>
                      {qtn.mathsQuestion ? (
                        <>
                        </>
                      ) : (
                        <>
                          <Text align={'center'} fontWeight={'semibold'} size={'s'} fontSize={['x-small', 'sm']} mb={'3'}>
                              {qtn.sub1}
                          </Text>
                          <Text align={'center'} fontWeight={'semibold'} size={'s'} fontSize={['x-small', 'sm']} mb={'3'}>
                              {qtn.sub2}
                          </Text>
                          <Text align={'center'} fontWeight={'semibold'} size={'s'}fontSize={['x-small', 'sm']} mb={'3'}>
                              {qtn.sub3}
                          </Text>
                          <Text align={'center'} fontWeight={'semibold'} size={'s'} fontSize={['x-small', 'sm']} mb={'3'}>
                              {qtn.su4}
                          </Text>
                          <Text align={'center'} fontWeight={'semibold'} size={'s'} fontSize={['x-small', 'sm']} mb={'3'}>
                              {qtn.sub5}
                          </Text>
                          <Text align={'center'} fontWeight={'semibold'} size={'s'} fontSize={['x-small', 'sm']} mb={'3'}>
                              {qtn.sub6}
                          </Text>
                          <HStack justify={'flex-start'} className='flex justify-start' align={'center'}>
                            
                            <Text fontWeight={'semibold'} className='flex justify-start'  noOfLines={[3,2,1]} fontSize={['x-small', 'sm']}>
                              {qtn.question}
                            </Text>
                          </HStack>
                          <Text align={'center'} className='flex justify-start'  fontWeight={'semibold'} fontSize={['x-small', 'sm']}>
                            {qtn.num}.
                          </Text>
                          <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={4} >
                            <>
                              {qtn.optionimgA ? (
                                <>
                                </>
                              ) : (
                                <>
                                  {qtn.optionMathsA ? (
                                    <></>
                                  ) : (
                                    <Box className='flex justify-start'>
                                      <Text 
                                        className='font-quicksand'  
                                        noOfLines={[3,2,1]}
                                        fontWeight='semibold' 
                                        fontSize={['x-small', 'sm']}
                                      >
                                        𝐀. {qtn.optionA}
                                      </Text>
                                    </Box>    
                                  )}
                                </>
                              )}
                            </>
                            <>
                              {qtn.optionimgB ? (
                                <>
                                </>
                              ) : (
                                <>
                                  {qtn.optionMathsB ? (
                                    <></>
                                  ) : (
                                  <Box className='flex justify-start'>
                                    <Text 
                                      className='font-quicksand' 
                                      noOfLines={[3,2,1]} 
                                      fontWeight='semibold' 
                                      fontSize={['x-small', 'sm']}
                                    >
                                      𝐁. {qtn.optionB}
                                    </Text>
                                  </Box>
                                  )}
                                </>
                              )}
                            </>
                            <>
                              {qtn.optionimgC ? (
                                <>
                                </>
                              ) : (
                                <>
                                  {qtn.optionMathsC ? (
                                    <></>
                                  ) : (
                                    <Box className='flex justify-start'>
                                      <Text 
                                        className='font-quicksand'  
                                        noOfLines={[3,2,1]}
                                        fontWeight='semibold' 
                                        fontSize={['x-small', 'sm']}
                                      >
                                        𝐂. {qtn.optionC}
                                      </Text>
                                    </Box>
                                  )}
                                </>
                              )}
                            </>
                            <>
                              {qtn.optionimgD ? (
                                <>
                                </>
                              ) : (
                                <>
                                  {qtn.optionMathsD ? (
                                    <></>
                                  ) : (
                                    <Box className='flex justify-start'>
                                      <Text 
                                        className='font-quicksand'  
                                        noOfLines={[3,2,1]}
                                        fontWeight='semibold' 
                                        fontSize={['x-small', 'sm']}
                                      >
                                        𝐃. {qtn.optionD}
                                      </Text>
                                    </Box>
                                  )}
                                </>
                              )}
                            </>
                          </Grid>
                        </>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
          <Text fontStyle={'italic'} mt={4} fontWeight={'bold'} fontSize={['xs', 'sm']} className='flex justify-center'>END OF OBJECTIVE TEST</Text>
        </Box>
      )}
    </Box>
  )
}

export default ExamSheet