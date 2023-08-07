'use client'

import Timer from '@/components/Timer20'
import { Box, Button, Flex, Grid, HStack, Heading, Icon, IconButton, ListItem, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Show, Spacer, Text, UnorderedList, VStack } from '@chakra-ui/react'
import { CldImage, CldOgImage } from 'next-cloudinary'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { MathComponent } from "mathjax-react";
import { useSession } from 'next-auth/react'
import { MdOutlineTipsAndUpdates } from  'react-icons/md'

const HardMode = (ctx) => {

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


  const [data, setData] = useState()
  const [showFinalScore, setShowFinalScore] = useState(false)
  const [currentQn, setCurrentQn] = useState(0)
  const [scores, setScores] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [wAnswer, setWAnswer] = useState(0)

  const correctAudio = React.createRef()
  const wrongAudio = React.createRef()

  const handleOptionClick = (e) => {
    if (currentQn + 1 >= 1) {
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }

    if(e.target.textContent === data.questions[currentQn].answer) {
      correctAudio.current.play()
      correctAnswer()
    } else {
      wrongAudio.current.play()
      wrongAnswer()
    }
  }

  const handleOptionMathsClick = (answer) => {
    if (currentQn + 1 >= 1) {
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }

    if(answer === data.questions[currentQn].answerMaths) {
      correctAudio.current.play()
      correctAnswer()
    } else {
      wrongAudio.current.play()
      wrongAnswer()
    }
  }

  const handleOptionClick1 = (answerimg) => {
    if (currentQn + 1 >= 1) {
        setIsPlaying(true)
    } else {
        setIsPlaying(false)
    }

    if (answerimg === data.questions[currentQn].answerimg) {

        correctAudio.current.play()
        correctAnswer()
    } else {

        wrongAudio.current.play()
        wrongAnswer()
    }
}


  const correctAnswer = () => {
    setScores(scores + 1)
    if (currentQn + 1 < data.questions.length) {
      setCurrentQn(currentQn + 1)
    } else {
      setShowFinalScore(true)
    }
  }

  const wrongAnswer = () => {
    setWAnswer(wAnswer + 1)
    if (currentQn + 1 < data.questions.length) {
      setCurrentQn(currentQn + 1)
    } else {
      setShowFinalScore(true)
    }
  }

  const quitBtn = () => {
    if (window.confirm('Are you sure you want to quit?')) {
      router.push('/')
    }
  }

  const restartQuiz = () => {
    setScores(0)
    setCurrentQn(0)
    setShowFinalScore(false)
    setIsPlaying(false)
    setScores(0)
    setWAnswer(0)
  }

  let remarks = ''

  const percentScore = Math.floor((scores / data?.questions.length)* 100)

  if(percentScore <= 30) {
    remarks = 'You need more practice'
  } else if (percentScore > 30 && percentScore <= 50) {
    remarks = 'Better luck next time'
  } else if (percentScore <= 70 && percentScore > 50) {
    remarks = 'You can better'
  } else if (percentScore >= 71 && percentScore <= 84) {
    remarks = 'You did great!'
  } else {
    remarks = 'You\'re an absolute genius'
  }


  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login')
      // toastLoading
    }
  })

 

  return (
    <Box 
      color={'gray.900'}
      bg={('gray.300')}
      p={[3, 5]}
      maxW={800}
      my={'10'}
      mx={[2, 'auto']}
      borderRadius={5}
      className='font-poppins w-full'
    >
      {!data ? (
        <Box align={'center'} fontSize={['xs', 'sm']}>
          <Text>
            Loading Quiz....
          </Text>
          <Text>
            Good Luck✌️
          </Text>
        </Box>
      ) : (
        <>
          {showFinalScore ? (
            <>
              <Box  fontSize={['xs', 'sm']}>
                <VStack spacing={3}>
                  <Heading  fontSize={'2xl'}>Quiz has ended</Heading>
                  <Text  fontSize={['xs', 'sm']}>{scores} out {data.questions.length}</Text>
                  <Text  color={'blue.500'} fontSize='4xl'>Your Score: {percentScore}%</Text>
                  <Text  fontSize={['xs', 'sm']}>{remarks}</Text>
                </VStack>
                <Box mb={5} mt={5}>
                  <Flex>
                    <UnorderedList listStyleType={'none'}>
                      <ListItem  fontSize={['xs', 'sm']}>Number of Questions:</ListItem><br />
                      <ListItem  fontSize={['xs', 'sm']}>Attempted Questions:</ListItem><br />
                      <ListItem  fontSize={['xs', 'sm']}>Correct Answers:</ListItem><br />
                      <ListItem  fontSize={['xs', 'sm']}>Wrong Answers:</ListItem>
                    </UnorderedList>
                    <Spacer />
                    <UnorderedList listStyleType={'none'}>
                      <ListItem>{data.questions.length}</ListItem><br />
                      <ListItem>{(scores + wAnswer)}</ListItem><br />
                      <ListItem>{scores}</ListItem><br />
                      <ListItem>{wAnswer}</ListItem>
                    </UnorderedList>
                  </Flex>
                </Box>
                <HStack>
                  <Button size={['xs', 'sm']} onClick={restartQuiz}>Restart</Button>
                  <Button size={['xs', 'sm']} onClick={quitBtn}>Quit</Button>
                  {/* <Button size={['xs', 'sm']}>
                    <Link href={'#'}>Review Answer</Link>
                  </Button> */}
                </HStack>
              </Box>
              <Box fontSize={['xs', 'sm']} mt={10}>
                <VStack>
                    <Heading align={'center'}  fontSize={['xs', 'sm']}>{data.subject.toUpperCase()}</Heading>
                    <Text  fontSize={['xs', 'sm']}>OBJECTIVE TEST REVIEW</Text>
                    <Text  fontSize={['xs', 'sm']}>{data.type} {data.month} {data.year} </Text>
                  </VStack>
                  <Box>
                    {data.sheet.map((qtn, index) => (
                      <Box key={index}>
                        <Heading size={'md'} align={'center'} fontSize={['x-small', 'sm']}>{qtn.part}</Heading>
                        <Heading size={'md'} align={'center'} fontSize={['x-small', 'sm']}>{qtn.label}</Heading>
                        <Heading size="md" align={'center'} mb={3} fontSize={['x-small', 'sm']}>{qtn.section}</Heading>
                        <Heading size="md" align={'center'} mb={3} fontSize={['x-small', 'sm']}>{qtn.instructions}</Heading>
                        <Box>
                        {qtn.mathsInstructions && (
                          <Box className='flex justify-center' mt={2}  fontSize={['x-small', 'sm']}>
                            <MathComponent tex={String.raw`${qtn.mathsInstructions}`} />
                          </Box>
                        )}
                        <Box 
                         fontSize={['x-small', 'sm']} 
                         align='center' 
                         fontWeight={'semibold'}
                        >
                          {qtn.img ? (
                            <Box my={8}>
                              <Text  mb={'2'}>
                                {qtn.question}
                              </Text>
                              <Text  mb={'2'} >
                                {qtn.sub1}
                              </Text>
                              <Text  mb={'2'} >
                                {qtn.sub2}
                              </Text>
                              <HStack gap={1}>
                                <Text>{qtn.num}</Text>
                                <CldImage width="550" height="300" src={qtn.img} alt='questionImage' />
                              </HStack>
                              <Text  mb={'2'} >
                                {qtn.sub3}
                              </Text>
                              <Text  mb={'2'}>
                                {qtn.sub4}
                              </Text>
                              <Text  mb={'2'}>
                                {qtn.sub5}
                              </Text>
                            </Box>
                          ) : (
                            <>
                              {qtn.mathsQuestion ? (
                                <Box my={5}>
                                  <Text mb={'2'} className='flex justify-start'>
                                    {qtn.sub1}
                                  </Text>
                                  <Text  className='flex justify-start'>
                                    {qtn.sub2}
                                  </Text>
                                  <Box className='flex justify-start' my={-4}>
                                    <MathComponent tex={String.raw`${qtn.mathsQuestion}`} />
                                  </Box>
                                  <Box>
                                    {qtn.mathsQuestion1 && (
                                      <Box className='flex justify-start' my={2}>
                                      <MathComponent tex={String.raw`${qtn.mathsQuestion1}`} />
                                    </Box>
                                    )}
                                  </Box>
                                  <Text mt={2}  className='flex justify-start'>
                                    {qtn.sub3}
                                  </Text>
                                  <Text mb={'2'} className='flex justify-start'>
                                    {qtn.question}
                                  </Text>
                                  <Text mb={'2'} className='flex justify-start'>
                                    {qtn.sub5}
                                  </Text>
                                </Box>
                              ) : (
                                <Box my={10}>
                                  <Text  mb={'3'} >
                                      {qtn.sub1}
                                  </Text>
                                  <Text  mb={'3'} >
                                      {qtn.sub2}
                                  </Text>
                                  <Text  mb={'3'} >
                                      {qtn.sub3}
                                  </Text>
                                  <Text  mb={'3'}>
                                      {qtn.su4}
                                  </Text>
                                  <Text  mb={'3'}>
                                      {qtn.sub5}
                                  </Text>
                                  <Text  mb={'3'}>
                                      {qtn.sub6}
                                  </Text>
                                  <Box className='flex justify-start' align={'center'}>
                                    <Text  className='flex justify-start'  noOfLines={[3,2,1]} >
                                      {qtn.question}
                                    </Text>
                                  </Box>
                                  <Text  className='flex justify-start'>
                                    {qtn.num}
                                  </Text>
                                </Box>
                              )}
                            </>
                          )}
                        </Box>
                        <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={4}
                        >
                          <>
                            {qtn.optionimgA ? (
                              <CldImage width="30"height="30"  src={qtn.optionimgA} alt='questionImg' />
                            ) : (
                              <>
                                {qtn.optionMathsA ? (
                                  <Box 
                                    fontWeight='semibold' mb={-5} fontSize={['x-small', 'sm']}
                                    className={qtn.optionMathsA === qtn.answerMaths ? `font-quicksand text-sky-400` : `font-quicksand`}
                                  >
                                    <MathComponent tex={String.raw` 𝐀. ${qtn.optionMathsA}`} />
                                  </Box>
                                ) : (
                                  <Box className='flex justify-start'>
                                    <Text 
                                      className={qtn.optionA === qtn.answer ? `font-quicksand text-sky-400` : `font-quicksand`}  
                                      noOfLines={[3,2,1]}
                                      fontWeight='semibold' 
                                      fontSize={['x-small', 'sm']}
                                    >
                                      𝐀. {qtn?.optionA}
                                    </Text>
                                  </Box>    
                                )}
                              </>
                            )}
                          </>
                          <>
                            {qtn.optionimgB ? (
                              <CldImage width="30"height="30"  src={qtn.optionimgB} alt='questionImg' />
                            ) : (
                              <>
                                {qtn.optionMathsB ? (
                                  <Box 
                                    fontWeight='semibold' mb={-4} fontSize={['x-small', 'sm']}
                                    className={qtn.optionMathsB === qtn.answerMaths ? `font-quicksand text-sky-400` : `font-quicksand`}
                                  >
                                      <MathComponent tex={String.raw`𝐁. ${qtn.optionMathsB}`} />
                                    </Box>
                                ) : (
                                <Box className='flex justify-start'>
                                  <Text 
                                    className={qtn.optionB === qtn.answer ? `font-quicksand text-sky-400` : `font-quicksand`}  
                                    noOfLines={[3,2,1]} 
                                    fontWeight='semibold' 
                                    fontSize={['x-small', 'sm']}
                                  >
                                    𝐁. {qtn?.optionB}
                                  </Text>
                                </Box>
                                )}
                              </>
                            )}
                          </>
                          <>
                            {qtn.optionimgC ? (
                              <CldImage width="30"height="30"  src={qtn.optionimgC} alt='questionImg' />
                            ) : (
                              <>
                                {qtn.optionMathsC ? (
                                  <Box 
                                    fontWeight='semibold' mb={-4} fontSize={['x-small', 'sm']}
                                    className={qtn.optionMathsC === qtn.answerMaths ? `font-quicksand text-sky-400` : `font-quicksand`}
                                  >
                                    <MathComponent tex={String.raw`𝐂. ${qtn.optionMathsC}`} />
                                  </Box>
                                ) : (
                                  <Box className='flex justify-start'>
                                    <Text 
                                      className={qtn.optionC === qtn.answer ? `font-quicksand text-sky-400` : `font-quicksand`} 
                                      noOfLines={[3,2,1]}
                                      fontWeight='semibold' 
                                      fontSize={['x-small', 'sm']}
                                    >
                                      𝐂. {qtn?.optionC}
                                    </Text>
                                  </Box>
                                )}
                              </>
                            )}
                          </>
                          <>
                            {qtn.optionimgD ? (
                              <CldImage width="30"height="30"  src={qtn.optionimgD} alt='questionImg' />
                            ) : (
                              <>
                                {qtn.optionMathsD ? (
                                  <Box 
                                    fontWeight='semibold' mb={3} fontSize={['x-small', 'sm']}
                                    className={qtn.optionMathsD === qtn.answerMaths ? `font-quicksand text-sky-400` : `font-quicksand`}
                                  >
                                    <MathComponent tex={String.raw`𝐃. ${qtn.optionMathsD}`} />
                                  </Box>
                                ) : (
                                  <Box className='flex justify-start'>
                                    <Text 
                                      className={qtn.optionD === qtn.answer ? `font-quicksand text-sky-400` : `font-quicksand`}   
                                      noOfLines={[3,2,1]}
                                      fontWeight='semibold' 
                                      mb={3}
                                      fontSize={['x-small', 'sm']}
                                    >
                                      𝐃. {qtn?.optionD}
                                    </Text>
                                  </Box>
                                )}
                              </>
                            )}
                          </>
                        </Grid>

                        </Box>
                      </Box>
                    ))}
                  </Box>
              </Box>
            </>
          ) : (
            <>
              <>
                <audio ref={wrongAudio} src='/assets/audio/wrongSound.mp3'/>
                <audio ref={correctAudio} src='/assets/audio/correctSound.mp3' />
              </>
              <Box  fontSize={['xs', 'sm']}>
                <VStack>
                  <Heading fontSize={['xs', 'lg']} align={'center'}>{data.subject.toUpperCase()}</Heading>
                  <Text>OBJECTIVE TEST</Text><Text>{data.type} {data.month} {data.year}</Text>
                  <Heading fontSize={['xs', 'sm']} align={'center'}>{data.questions[currentQn].part}</Heading>
                  <Heading fontSize={['xs', 'sm']} align={'center'}>{data.questions[currentQn].label}</Heading>
                </VStack>
                <Flex alignItems={'center'}>
                  <Text>{currentQn + 1} of {data.questions.length}</Text>
                  <Spacer />
                  <Timer setShowFinalScore={setShowFinalScore} isPlaying={isPlaying}/>
                </Flex>
                <Heading fontSize={['xs', 'md']} align={'center'} mb={3}>{data.questions[currentQn].section}</Heading>
                <Text align={'center'} m={5}>{data.questions[currentQn].instructions}</Text>
              </Box>
              <Box  fontSize={['xs', 'sm']}>
                  <Box align='center'>
                    {data.questions[currentQn].img ? (
                      <>
                        <Text fontWeight={'semibold'}size={'s'} mb={'2'}>
                        {data.questions[currentQn].question}
                        </Text>
                        <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                            {data.questions[currentQn].sub1}
                        </Text>
                        <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                            {data.questions[currentQn].sub2}
                        </Text>
                        <CldImage width="550" height="300" src={data.questions[currentQn].img} alt='questionImage'/>
                        <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                            {data.questions[currentQn].sub3}
                        </Text>
                        <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                            {data.questions[currentQn].sub4}
                        </Text>
                        <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                            {data.questions[currentQn].sub5}
                        </Text>
                      </>
                    ) : (
                      <>
                        {data.questions[currentQn].mathsQuestion ? (
                          <>
                          <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                              {data.questions[currentQn].sub1}
                          </Text>
                          <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                              {data.questions[currentQn].sub2}
                          </Text>
                          <Box className='flex justify-center'>
                            <MathComponent tex={String.raw`${data.questions[currentQn].mathsQuestion}`} />
                          </Box>
                          <Box>
                            {data.questions[currentQn].mathsQuestion1 && (
                              <Box className='flex justify-center'>
                                <MathComponent tex={String.raw`${data.questions[currentQn].mathsQuestion1}`} />
                              </Box>
                            )}
                          </Box>
                          <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                              {data.questions[currentQn].sub3}
                          </Text>
                          <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                              {data.questions[currentQn].sub4}
                          </Text>
                          <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                              {data.questions[currentQn].sub5}
                          </Text>
                        </>
                        ) : (
                        <>
                        <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                            {data.questions[currentQn].sub1}
                        </Text>
                        <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                            {data.questions[currentQn].sub2}
                        </Text>
                        <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                            {data.questions[currentQn].sub3}
                        </Text>
                        <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                            {data.questions[currentQn].sub4}
                        </Text>
                        <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                            {data.questions[currentQn].sub5}
                        </Text>
                        <Text className='flex justify-start' fontWeight={'semibold'} size={'s'} mb={'5'}>
                          {data.questions[currentQn].question}
                        </Text>
                      </>
                        )}
                      </>
                      
                    )}
                  </Box>
                  <Grid  templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={6}>
                      <>
                        {data.questions[currentQn].optionimgA ? (
                          <Box
                            onClick={() => handleOptionClick1(data.questions[currentQn].optionimgA)}
                            className='font-quicksand '
                            as='button'
                            maxW='lg'
                            height='60px'
                            borderRadius='5px'
                            bg={'gray.100'}
                            color={'gray.900'}
                            _hover={{ bg: 'gray.200' }}
                          >
                            <CldImage width="30"height="30"  src={data.questions[currentQn].optionimgA}/>
                          </Box>
                          ) : (
                          <>
                          {data.questions[currentQn].optionMathsA ? (
                            <Box
                              onClick={() => handleOptionMathsClick(data.questions[currentQn].optionMathsA)}
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
                                <MathComponent tex={String.raw`${data.questions[currentQn].optionMathsA}`} />
                              </Box>
                            </Box>
                            ) : (
                            <Box
                              onClick={handleOptionClick}
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
                              {data.questions[currentQn].optionA}
                              </Text>
                            </Box>
                          )}
                          </>    
                        )}
                      </>
                      <>
                          {data.questions[currentQn].optionimgB ? (
                            <Box
                              onClick={() => handleOptionClick1(data.questions[currentQn].optionimgB)}
                              className='font-quicksand flex justify-center'
                              as='button'
                              maxW='lg'
                              height='40px'
                              borderRadius='5px'
                              bg={'gray.100'}
                              color={'gray.900'}
                              _hover={{ bg: 'gray.200' }}
                            >
                              <CldImage width="20"height="20" src={data.questions[currentQn].optionimgB}/>
                            </Box>
                            ) : (
                              <>
                              {data.questions[currentQn].optionMathsB ? (
                                <Box
                                  onClick={() => handleOptionMathsClick(data.questions[currentQn].optionMathsB)}
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
                                    <MathComponent tex={String.raw`${data.questions[currentQn].optionMathsB}`} />
                                  </Box>
                                </Box>
                                ) : (
                                <Box
                                  onClick={handleOptionClick}
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
                                  {data.questions[currentQn].optionB}
                                  </Text>
                                </Box>
                              )}
                              </>
                          )}
                      </>
                      <>
                        {data.questions[currentQn].optionimgC ? (
                          <Box
                            onClick={() => handleOptionClick1(data.questions[currentQn].optionimgC)}
                            className='font-quicksand flex justify-center'
                            as='button'
                            maxW='lg'
                            height='40px'
                            borderRadius='5px'
                            bg={'gray.100'}
                            color={'gray.900'}
                            _hover={{ bg: 'gray.200' }}
                          >
                            <CldImage width="20"height="20" src={data.questions[currentQn].optionimgC}/>
                          </Box>
                          ) : (
                            <>
                            {data.questions[currentQn].optionMathsC ? (
                              <Box
                                onClick={() => handleOptionMathsClick(data.questions[currentQn].optionMathsC)}
                                className='font-quicksand flex justify-center'
                                as='button'
                                maxW='lg'
                                height='55px'
                                borderRadius='5px'
                                bg={'gray.100'}
                                color={'gray.900'}
                                _hover={{ bg: 'gray.200' }}
                              >
                                <Box  fontWeight='semibold' fontSize={['xs', 'sm']}>
                                  <MathComponent tex={String.raw`${data.questions[currentQn].optionMathsC}`} />
                                </Box>
                              </Box>
                              ) : (
                              <Box
                                onClick={handleOptionClick}
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
                                {data.questions[currentQn].optionC}
                                </Text>
                              </Box>
                            )}
                            </>
                        )}
                      </>
                      <>
                        {data.questions[currentQn].optionimgD ? (
                            <Box
                              onClick={() => handleOptionClick1(data.questions[currentQn].optionimgD)}
                              className='font-quicksand flex justify-center'
                              as='button'
                              maxW='lg'
                              height='40px'
                              borderRadius='5px'
                              bg={'gray.100'}
                              color={'gray.900'}
                              _hover={{ bg: 'gray.200' }}
                            >
                              <CldImage width="20"height="20" src={data.questions[currentQn].optionimgD}/>
                            </Box>
                          ) : (
                            <>
                          {data.questions[currentQn].optionMathsD ? (
                            <Box
                              onClick={() => handleOptionMathsClick(data.questions[currentQn].optionMathsD)}
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
                                <MathComponent tex={String.raw`${data.questions[currentQn].optionMathsD}`} />
                              </Box>
                            </Box>
                            ) : (
                            <Box
                              onClick={handleOptionClick}
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
                              {data.questions[currentQn].optionD}
                              </Text>
                            </Box>
                          )}
                          </>
                        )}
                      </>
                  </Grid>
              </Box>
              <Box  fontSize={['xs', 'sm']}>
                <HStack mt={'10'} spacing={50}>
                  <Button size={['xs', 'sm']} onClick={quitBtn}>Quit</Button>
                  <Button size={['xs', 'sm']}><Link href={`/quiz/${data._id}`}>Back</Link></Button>
                  <Show below="sm" >
                    <Popover>
                      <PopoverTrigger>
                        <IconButton size='sm' icon={<MdOutlineTipsAndUpdates size={15}/>} w={8} h={8} color='pink.700' />
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader bg={'blue.200'} >Tooltip!</PopoverHeader>
                        <PopoverBody><Text>For better view of diagrams, zoom in or rotate screen to landscape</Text></PopoverBody>
                      </PopoverContent>
                    </Popover>
                 </Show>
                </HStack>
              </Box>
            </>
          )}
          
        </>
      )}
    </Box>
      
  )
}

export default HardMode