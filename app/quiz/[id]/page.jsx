'use client'

import React, { useEffect, useState } from 'react'
import { notFound } from "next/navigation"
import { Box, Button, Flex, Grid, HStack, Heading, Radio, RadioGroup, Spacer, Text, VStack, useBoolean } from '@chakra-ui/react'
import Timer from '@/components/Timer20'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MathComponent } from 'mathjax-react'
import { toast } from 'react-hot-toast'

async function getData( id ) {
  const res = await fetch(`http://localhost:3000/api/questions/${id}`, {
    cache: 'no-store'
  })

  if (!res.ok) {
    return notFound()
  }

  return res.json()
}

const Quiz = (ctx) => {  
  const [easyMode, setEasyMode] = useBoolean()
  const [value, setValue] = useState('')
  const [data, setData] = useState()

 
  useEffect(() => {
    async function getQuestions() {
      const res = await fetch(`/api/questions/${ctx.params.id}`, {
      })
    
      if (!res.ok) {
        return notFound()
      }
    
      const exam = await res.json()

      setData(exam)
    }
    getQuestions()
  }, [])

  // const toastLoading = toast('Please sign in first', {
  //   icon: '🔐'
  // });

  const router = useRouter()
  const { status } = useSession()

  if(status === "unauthenticated") {
    router.push('/login')
  }

  
  return (
    <Box
      color={'gray.900'}
      bg={('gray.300')}
      p={'10'}
      maxW={800}
      my={'10'}
      mx={[4, 4, 5, 'auto']}
      borderRadius={5}
      className='font-poppins w-full'
    >
      <Box align={'left'}>  
        <HStack>
          <Button size={'xs'} onClick={setEasyMode.toggle}>
            Easy Mode
          </Button>
          <Text fontSize={'xs'}>{easyMode ? "On" : "Off" }</Text>
        </HStack>                 
      </Box>
      {easyMode? (
        <>
          <Box>
            <VStack>
              <Heading align={'center'}>{data.subject.toUpperCase()}</Heading>
              <Text>OBJECTIVE TEST</Text>
              <Text>{data.type} {data.month} {data.year}</Text>
              <Heading size={'md'} align={'center'}>{data.questions[0].part}</Heading>
              <Heading size={'md'} align={'center'}>{data.questions[0].label}</Heading>
            </VStack>
            <Flex alignItems={'center'}>
              <Text>1 of {data.questions.length}</Text>
              <Spacer />
              <Timer />
            </Flex>
            <Heading size="md" align={'center'} mb={3}>{data.questions[0].section}</Heading>
            <Text align={'center'} m={5}>{data.questions[0].instructions}</Text>
          </Box>
          <Box>
            <Text fontWeight={'semibold'} size={'s'} mb={'5'}>
              {data.questions[0].question}
            </Text>
            <RadioGroup onChange={setValue} value={value}>
              <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={6}>
                <Radio borderColor='black' color={'red.300'} size='md' colorScheme='green' value={data.questions[0].optionA}>
                {data.questions[0].optionMathsA ? (
                  <MathComponent tex={String.raw`𝐀. ${data.questions[0].optionMathsA}`} />
                ) : (
                  <Text className='font-quicksand' fontWeight='medium' fontSize='medium' >𝐀.  {data.questions[0].optionA}</Text>
                )}
                </Radio>
                <Radio borderColor='black' color={'red.300'} size='md' colorScheme='green' value={data.questions[0].optionB}>
                {data.questions[0].optionMathsB ? (
                  <MathComponent tex={String.raw`𝐁. ${data.questions[0].optionMathsB}`} />
                ) : (
                  <Text className='font-quicksand' fontWeight='medium' fontSize='medium' >𝐁.  {data.questions[0].optionB}</Text>
                )}
                </Radio>
                <Radio borderColor='black' color={'red.300'} size='md' colorScheme='green' value={data.questions[0].optionC}>
                  {data.questions[0].optionMathsC ? (
                    <MathComponent tex={String.raw`𝐂. ${data.questions[0].optionMathsC}`} />
                  ) : (
                    <Text className='font-quicksand' fontWeight='medium' fontSize='medium' >𝐂.  {data.questions[0].optionC}</Text>
                  )}
                </Radio>
                <Radio borderColor='black' color={'red.300'} size='md' colorScheme='green' value={data.questions[0].optionD}>
                  {data.questions[0].optionMathsD ? (
                    <MathComponent tex={String.raw`𝐃. ${data.questions[0].optionMathsD}`} />
                  ) : (
                    <Text className='font-quicksand' fontWeight='medium' fontSize='medium' >𝐃.  {data.questions[0].optionD}</Text>
                  )}
                </Radio>
              </Grid>
            </RadioGroup>
            <Button mt={10}>
              <Link href={`/easyMode/${data._id}`}>Stat Quiz</Link>
            </Button>
          </Box>
        </>
      ) : (
        <>
          {!data ? (
            <>
              <Text align={'center'}>Loading...</Text>
            </>
          ) : (
            <>
              <Box>
                <VStack>
                  <Heading align={'center'}>{data.subject.toUpperCase()}</Heading>
                  <Text>OBJECTIVE TEST</Text><Text>{data.type} {data.month} {data.year}</Text>
                  <Heading size={'md'} align={'center'}>{data.questions[0].part}</Heading>
                  <Heading size={'md'} align={'center'}>{data.questions[0].label}</Heading>
                </VStack>
                <Flex alignItems={'center'}>
                  <Text>1 of {data.questions.length}</Text>
                  <Spacer />
                  <Timer />
                </Flex>
                <Heading size="md" align={'center'} mb={3}>{data.questions[0].section}</Heading>
                <Text align={'center'} m={5}>{data.questions[0].instructions}</Text>
              </Box>
              <Box>
              <Text fontWeight={'semibold'} size={'s'} mb={'5'}>
                {data.questions[0].question}
              </Text>
              <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={6}>
                <>
                  {data.questions[0].optionMathsA ? (
                    <Box
                      className='font-quicksand flex justify-center'
                      as='button'
                      maxW='lg'
                      height='55px'
                      borderRadius='5px'
                      bg={'gray.100'}
                      color={'gray.900'}
                      _hover={{ bg: 'gray.200' }}
                    >
                      <Box fontWeight='semibold' fontSize={['xs', 'sm']}>
                        <MathComponent tex={String.raw`${data.questions[0].optionMathsA}`} />
                      </Box>
                    </Box>
                    ) : (
                    <Box
                      className='font-quicksand flex justify-center'
                      as='button'
                      maxW='lg'
                      height='40px'
                      borderRadius='5px'
                      bg={'gray.100'}
                      color={'gray.900'}
                      _hover={{ bg: 'gray.200' }}
                    >
                      <Text  noOfLines={[3,2,1]}fontWeight='semibold' fontSize={['xs', 'sm']}>
                      {data.questions[0].optionA}
                      </Text>
                    </Box>
                  )}
                </>
                <>
                  {data.questions[0].optionMathsB ? (
                    <Box
                      className='font-quicksand flex justify-center'
                      as='button'
                      maxW='lg'
                      height='55px'
                      borderRadius='5px'
                      bg={'gray.100'}
                      color={'gray.900'}
                      _hover={{ bg: 'gray.200' }}
                    >
                      <Box fontWeight='semibold' fontSize={['xs', 'sm']}>
                        <MathComponent tex={String.raw`${data.questions[0].optionMathsB}`} />
                      </Box>
                    </Box>
                    ) : (
                    <Box
                      className='font-quicksand flex justify-center'
                      as='button'
                      maxW='lg'
                      height='40px'
                      borderRadius='5px'
                      bg={'gray.100'}
                      color={'gray.900'}
                      _hover={{ bg: 'gray.200' }}
                    >
                      <Text  noOfLines={[3,2,1]}fontWeight='semibold' fontSize={['xs', 'sm']}>
                      {data.questions[0].optionB}
                      </Text>
                    </Box>
                  )}
                </> 
                <>
                  {data.questions[0].optionMathsC ? (
                    <Box
                      className='font-quicksand flex justify-center'
                      as='button'
                      maxW='lg'
                      height='55px'
                      borderRadius='5px'
                      bg={'gray.100'}
                      color={'gray.900'}
                      _hover={{ bg: 'gray.200' }}
                    >
                      <Box fontWeight='semibold' fontSize={['xs', 'sm']}>
                        <MathComponent tex={String.raw`${data.questions[0].optionMathsC}`} />
                      </Box>
                    </Box>
                    ) : (
                    <Box
                      className='font-quicksand flex justify-center'
                      as='button'
                      maxW='lg'
                      height='40px'
                      borderRadius='5px'
                      bg={'gray.100'}
                      color={'gray.900'}
                      _hover={{ bg: 'gray.200' }}
                    >
                      <Text  noOfLines={[3,2,1]}fontWeight='semibold' fontSize={['xs', 'sm']}>
                      {data.questions[0].optionC}
                      </Text>
                    </Box>
                  )}
                </>
                <>
                  {data.questions[0].optionMathsD ? (
                    <Box
                      className='font-quicksand flex justify-center'
                      as='button'
                      maxW='lg'
                      height='55px'
                      borderRadius='5px'
                      bg={'gray.100'}
                      color={'gray.900'}
                      _hover={{ bg: 'gray.200' }}
                    >
                      <Box fontWeight='semibold' fontSize={['xs', 'sm']}>
                        <MathComponent tex={String.raw`${data.questions[0].optionMathsD}`} />
                      </Box>
                    </Box>
                    ) : (
                    <Box
                      className='font-quicksand flex justify-center'
                      as='button'
                      maxW='lg'
                      height='40px'
                      borderRadius='5px'
                      bg={'gray.100'}
                      color={'gray.900'}
                      _hover={{ bg: 'gray.200' }}
                    >
                      <Text  noOfLines={[3,2,1]}fontWeight='semibold' fontSize={['xs', 'sm']}>
                      {data.questions[0].optionD}
                      </Text>
                    </Box>
                  )}
                </>
              </Grid>
              <Button size={['xs', 'sm']} mt={10}>
                <Link href={`/hardMode/${data._id}`}>Start Quiz</Link>
              </Button>
              </Box>
            </>
          )}
          
        </>
      )}
    </Box>
  )
}

export default Quiz