'use client'

import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Grid, Heading, HStack, ListItem, Radio, RadioGroup, Spacer, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, UnorderedList, VStack} from "@chakra-ui/react";
import Timer from '@/components/Timer20';
import { useSelector, useDispatch } from "react-redux";
import * as Action from '@/redux/question_reducer'
import { PushUserAnswer, PushAnswer, ResetResultAction, usePublishResult } from '@/hooks/SetResults';
import { updateResultAction } from '@/redux/result_reducer';
import { attempts_Number, earnPoints_Number, flagResult, getResult, wrong_Answers } from '@/helper/helper';
import { useRouter } from 'next/navigation'
import Link from "next/link";
import { MathComponent } from "mathjax-react";
import { CldImage } from "next-cloudinary";


const EasyMode = (ctx) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const [getData, setGetData] = useState({ isLoading: false, apiData: [], serverError: null })
  const [showFinalScore, setShowFinalScore] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [checked, setChecked] = useState(undefined)
  const [data, setData] = useState()

  // useEffect(() =>{
  //   async function getQuestions() {
  //     const res = await fetch(`http://localhost:3000/api/questions/${ctx.params.id}`)

  //     if (!res.ok) {
  //       return notFound()
  //     }

  //     const exam = await res.json()
  //     setData(exam)
  //   }
  //   getQuestions()
  // }, [])

  useEffect(() => {
    setGetData(prev => ({...prev, isLoading: true}));

    (async () => {
      try {
        const res = await fetch(`/api/questions/${ctx.params.id}`)

        if (!res.ok) {
          return notFound()
        }

        const exam = await res.json()
        setData(exam)

        const questions = await exam.questions
        
        if(questions.length > 0) {
          // setGetData(prev => ({...prev, isLoading : false}))
          // setGetData(prev => ({...prev, apiData : questions}))
          // console.log(questions)

          /** dispatch an action */
          dispatch(Action.startExamAction(questions))
        } else {
          throw new Error("No Question Available")
        }
      } catch (error) {
        setGetData(prev => ({...prev, isLoading: false}))
        setGetData(prev => ({...prev, serverError: error}))
      }
    })();
  }, [dispatch])

  const result = useSelector(state => state.result.result)
  const answers = useSelector(state => state.result.answer)

  // const state = useSelector(state => state)
  const question = useSelector(state => state.questions.queue[state.questions.trace])
  const track = useSelector(state => (state.questions.trace) + 1)  
  const {trace} = useSelector(state => state.questions)  
  const PrevResult = useSelector(state => state.result.result[trace])
  const {queue} = useSelector(state => state.questions) 

  useEffect(() => {
    console.log(question)
    console.log(result)
    console.log(answers)
  })

  useEffect(() => {
    console.log({trace, checked})
    setChecked(value)
    if(value){
      dispatch(updateResultAction({trace, checked}))
    }
  })
  
  const quitBtn = () => {
    if (window.confirm('Are you sure you want to quit?')) {
      router.push('/')
   }
  }

  const totalPoints = queue.length * 1
  const attempts = attempts_Number(result)
  const earnPoints = earnPoints_Number(result, answers, 1)
  const wrongAnswers = wrong_Answers(result, answers, 1)
  const flag = flagResult(totalPoints, earnPoints)
  const length = data?.questions.length 
  
  console.log(earnPoints)
  console.log(wrongAnswers)
  console.log(length)
  console.log(result.length)

  /** store user result */
  // usePublishResult({username : user?.user.username, result: result, length: length,  attempts: attempts, points: earnPoints, achieved: flag? "passed" : "Failed" })
  let remarks = ''
  const percentScore = Math.floor((earnPoints/data?.questions.length) * 100)

  if(percentScore <= 30) {
    remarks = 'You need more practice'
  }else if (percentScore > 30 && percentScore <= 50) {
    remarks = 'Better luck next time'
  }else if (percentScore <= 70 && percentScore > 50) {
    remarks = 'You can do better'
  }else if (percentScore >= 71 && percentScore <= 84) {
    remarks = 'You did great!'
  }else {
    remarks = 'You|\'re an absolute genius '
  }

  function restartQuiz() {
    setShowFinalScore(false)
    setChecked('')
    setValue('')
    setIsPlaying(false)
    dispatch(Action.resetAllAction(length))
    dispatch(ResetResultAction())
  }

  function onNext() {
    console.log('On Next click')
    if(track < queue.length){
      dispatch(Action.moveNextAction())

      /** insert a new result in the array */
      if(result.length <= trace) {
        dispatch(PushUserAnswer(value))
        dispatch(PushAnswer(question?.answer ? question?.answer : question?.answerMaths))
      }
      
      setValue('')
      setChecked('')
      
    } 

    if (track >= 1) {
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }

  function onPrev() {
    console.log('On OnPrev click')
    if(track > 1){
      dispatch(Action.movePrevAction())
    } 
    setValue('')   
    // if( trace <= result.length){
    //   value(PrevResult)
    // }
  }

  function Done() {
    dispatch(PushUserAnswer(value))
    dispatch(PushAnswer(question?.answer))
    setShowFinalScore(true)
  }

  const [value, setValue] = useState('')
  console.log(value)

  const [results, setResults] = useState([])


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
      {(!question || !data) ? (
        <Box align={'center'}>
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
              <Box>
                <VStack spacing={3}>
                  <Heading>Quiz has ended</Heading>
                  <Text> {attempts} out of {data.questions.length} </Text>
                  <Text color={'blue.500'} fontSize='4xl'>Your Score: {percentScore}%</Text>
                  <Text>{remarks}</Text>
                </VStack>
                <Box mb={5} mt={5}>
                  <Flex>
                    <UnorderedList listStyleType={'none'}>
                      {/* <ListItem>Username:</ListItem><br /> */}
                      <ListItem>Number Questions:</ListItem><br />
                      <ListItem>Attempted Questions:</ListItem><br />
                      <ListItem>Correct Answers:</ListItem><br />
                      <ListItem>Wrong Answers:</ListItem>
                    </UnorderedList>
                    <Spacer />
                    <UnorderedList listStyleType={'none'}>
                      {/* <ListItem className="capitalize">{user.user.username}</ListItem><br/> */}
                      <ListItem>{data.questions.length}</ListItem><br/>
                      <ListItem>{attempts || 0}</ListItem><br/>
                      <ListItem>{earnPoints || 0}</ListItem><br/>
                      <ListItem>{wrongAnswers || 0}</ListItem>
                    </UnorderedList>
                  </Flex>
                </Box>
                <HStack mt={10}>
                  <Button onClick={restartQuiz}>Restart</Button>
                  <Button onClick={quitBtn}>Quit</Button>
                  <Button>
                    <Link href={'#'} state={data}>Review Answers</Link>
                  </Button>
                </HStack>
              </Box>
            </>
          ) : (
            <>
              <Box>
                <VStack>
                  <Heading align={'center'}>{data.subject.toUpperCase()}</Heading>
                  <Text>OBJECTIVE TEST</Text>
                  <Text>{data.type} {data.month} {data.year} </Text>
                  <Heading size={'md'} align={'center'}>{question?.part}</Heading>
                  <Heading size={'md'} align={'center'}>{question?.label}</Heading>
                </VStack>
                <Flex alignItems={'center'}>
                  <Text>{track} of {data.questions.length}</Text>
                  <Spacer />
                  <Timer setShowFinalScore={setShowFinalScore} isPlaying={isPlaying} />
                </Flex>
                <Heading  size='md' align={'center'} mb={3}>{question?.section}</Heading>
                <Text align={'center'} m={5}>{question?.instructions}</Text>
              </Box>
              <Box>
                  <Box align='center' m={3}>
                    {question.img ? (
                      <>
                        <Text fontWeight={'semibold'}size={'s'} mb={'2'}>
                        {question.question}
                        </Text>
                        <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                            {question.sub1}
                        </Text>
                        <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                            {question.sub2}
                        </Text>
                        <CldImage width="550" height="300" src={question.img} alt='questionImage'/>
                        <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                            {question.sub3}
                        </Text>
                        <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                            {question.sub4}
                        </Text>
                        <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                            {question.sub5}
                        </Text>
                      </>
                    ) : (
                      <>
                        {question.mathsQuestion ? (
                          <>
                            <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                              {question.sub1}
                            </Text>
                            <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                              {question.sub2}
                            </Text>
                            <Box className='flex justify-center'>
                              <MathComponent tex={String.raw`${question.mathsQuestion}`} />
                            </Box>
                            <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                              {question.sub3}
                            </Text>
                            <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                              {question.sub4}
                            </Text>
                            <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                                {question.sub5}
                            </Text>
                          </>
                          ) : (
                          <>
                            <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                                {question.sub1}
                            </Text>
                            <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                                {question.sub2}
                            </Text>
                            <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                                {question.sub3}
                            </Text>
                            <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                                {question.sub4}
                            </Text>
                            <Text align={'center'} fontWeight={'semibold'} size={'s'} mb={'3'}>
                                {question.sub5}
                            </Text>
                            <Text fontWeight={'semibold'} size={'s'} mb={'5'}>
                              {question.question}
                            </Text>
                          </>
                        )}
                      </>
                    )}
                  </Box>

                <RadioGroup onChange={setValue}  value={ PrevResult? PrevResult : value } >
                  <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={6}>
                    <Radio 
                      size='lg' 
                      borderColor='black' colorScheme='green' 
                      value={question?.optionMathsA ? question?.optionMathsA : question?.optionA}
                    >
                        {question.optionMathsA ? (
                          <MathComponent tex={String.raw`𝐀. ${question?.optionMathsA}`} />
                        ) :(
                          <Text className='font-quicksand' fontWeight='medium' fontSize='medium' >𝐀.   {question?.optionA}</Text>
                        )}
                    </Radio>
                    <Radio 
                      size='lg' 
                      borderColor='black' colorScheme='green' 
                      value={question?.optionMathsB ? question?.optionMathsB : question?.optionB}
                    >
                      {question.optionMathsB ? (
                        <MathComponent tex={String.raw`𝐁. ${question?.optionMathsB}`} />
                        ) : (
                        <Text className='font-quicksand' fontWeight='medium' fontSize='medium' >𝐁.   {question?.optionB}</Text>
                      )}
                    </Radio>
                    <Radio 
                      size='lg' 
                      borderColor='black' colorScheme='green' 
                      value={question?.optionMathsC ? question?.optionMathsC : question?.optionC}
                    >
                      {question.optionMathsC ? (
                        <MathComponent tex={String.raw`𝐂. ${question?.optionMathsC}`} />
                        ) : (
                        <Text className='font-quicksand' fontWeight='medium' fontSize='medium' >𝐂.   {question?.optionC}</Text>
                      )}
                    </Radio>
                    <Radio 
                      size='lg' 
                      borderColor='black' colorScheme='green' 
                      value={question?.optionMathsD ? question?.optionMathsD : question?.optionD}
                    >
                      {question.optionMathsD ? (
                        <MathComponent tex={String.raw`𝐃. ${question?.optionMathsD}`} />
                        ) : (
                        <Text className='font-quicksand' fontWeight='medium' fontSize='medium' >𝐃.   {question?.optionD}</Text>
                      )}
                    </Radio>
                  </Grid>
                </RadioGroup>
                <Flex mt={10}>
                  {trace > 0 ? <Button borderRadius={1} colorScheme='yellow' color={'black'}onClick={onPrev} >Prev</Button> : <></>}
                  <Spacer />
                  {(track === data.questions.length)? (
                    <Button borderRadius={1} colorScheme='green'  color={'black'} onClick={Done}>Done</Button>
                  ) : (
                    <Button borderRadius={1} colorScheme='green' color={'black'} onClick={onNext}>Next</Button>
                  )} 
                </Flex>
              </Box>
              <Box>
                <HStack mt={'10'} spacing={50}>
                  <Button onClick={quitBtn}>Quit</Button>
                  <Button><Link href={`/quiz/${data._id}`}>Back</Link></Button>
                </HStack>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  )
}

export default EasyMode