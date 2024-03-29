'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Show,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';
import Timer from '@/components/Timer20';
import { useSelector, useDispatch } from 'react-redux';
import * as Action from '@/redux/question_reducer';
import {
  PushUserAnswer,
  PushAnswer,
  ResetResultAction,
  usePublishResult,
} from '@/hooks/SetResults';
import { updateResultAction } from '@/redux/result_reducer';
import {
  attempts_Number,
  earnPoints_Number,
  flagResult,
  getResult,
  wrong_Answers,
} from '@/helper/helper';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MathComponent } from 'mathjax-react';
import { CldImage } from 'next-cloudinary';
import { MdOutlineTipsAndUpdates } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const EasyMode = (ctx) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [getData, setGetData] = useState({
    isLoading: false,
    apiData: [],
    serverError: null,
  });
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [checked, setChecked] = useState(undefined);
  const [data, setData] = useState();
  const [show, setShow] = useState(false);
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
    setGetData((prev) => ({ ...prev, isLoading: true }));

    // Assuming this function is defined in a component or context
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/questions/${ctx.params.id}`);

        if (response.status === 200) {
          const exam = response.data;
          setData(exam);

          const questions = exam.questions;

          if (questions.length > 0) {
            dispatch(Action.startExamAction(questions));
          } else {
            throw new Error('No Question Available');
          }
        } else {
          throw new Error('API Error');
        }
      } catch (error) {
        setGetData((prev) => ({
          ...prev,
          isLoading: false,
          serverError: error,
        }));
      }
    };

    // Call the fetchData function
    fetchData();
  }, [dispatch]);

  const result = useSelector((state) => state.result.result);
  const answers = useSelector((state) => state.result.answer);

  // const state = useSelector(state => state)
  const question = useSelector(
    (state) => state.questions.queue[state.questions.trace]
  );
  const track = useSelector((state) => state.questions.trace + 1);
  const { trace } = useSelector((state) => state.questions);
  const PrevResult = useSelector((state) => state.result.result[trace]);
  const { queue } = useSelector((state) => state.questions);

  // useEffect(() => {
  //   console.log(question);
  //   console.log(result);
  //   console.log(answers);
  // });

  useEffect(() => {
    // console.log({ trace, checked });
    setChecked(value);
    if (value) {
      dispatch(updateResultAction({ trace, checked }));
    }
  });

  const quitBtn = () => {
    if (window.confirm('Are you sure you want to quit?')) {
      restartQuiz();
      router.push('/');
    }
  };

  const totalPoints = queue.length * 1;
  const attempts = attempts_Number(result);
  const earnPoints = earnPoints_Number(result, answers, 1);
  const wrongAnswers = wrong_Answers(result, answers, 1);
  const flag = flagResult(totalPoints, earnPoints);
  const length = data?.questions.length;

  // console.log(earnPoints);
  // console.log(wrongAnswers);
  // console.log(length);
  // console.log(result.length);

  /** store user result */
  // usePublishResult({username : user?.user.username, result: result, length: length,  attempts: attempts, points: earnPoints, achieved: flag? "passed" : "Failed" })
  let remarks = '';
  const percentScore = Math.floor((earnPoints / data?.questions.length) * 100);

  if (percentScore <= 30) {
    remarks = 'You need more practice';
  } else if (percentScore > 30 && percentScore <= 50) {
    remarks = 'Better luck next time';
  } else if (percentScore <= 70 && percentScore > 50) {
    remarks = 'You can do better';
  } else if (percentScore >= 71 && percentScore <= 84) {
    remarks = 'You did great!';
  } else {
    remarks = "You|'re an absolute genius ";
  }

  function restartQuiz() {
    setShowFinalScore(false);
    setChecked('');
    setValue('');
    setIsPlaying(false);
    dispatch(Action.resetAllAction(length));
    dispatch(ResetResultAction());
  }

  function onNext() {
    // console.log('On Next click');
    if (track < queue.length) {
      dispatch(Action.moveNextAction());

      /** insert a new result in the array */
      if (result.length <= trace) {
        dispatch(PushUserAnswer(value));
        dispatch(
          PushAnswer(
            question?.answer ? question?.answer : question?.answerMaths
          )
        );
      }

      setValue('');
      setChecked('');
    }

    if (track >= 1) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }

  function onPrev() {
    // console.log('On OnPrev click');
    if (track > 1) {
      dispatch(Action.movePrevAction());
    }
    setValue('');
    // if( trace <= result.length){
    //   value(PrevResult)
    // }
  }

  function Done() {
    dispatch(PushUserAnswer(value));
    dispatch(PushAnswer(question?.answer));
    setShowFinalScore(true);
  }

  // function showReview() {}

  const [value, setValue] = useState('');
  // console.log(value);

  const [results, setResults] = useState([]);

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
      // toastLoading
    },
  });

  return (
    <Box
      color={'gray.900'}
      bg={'gray.300'}
      p={[3, 5]}
      maxW={800}
      my={'10'}
      mx={[2, 'auto']}
      borderRadius={5}
      className="font-poppins w-full"
    >
      {!question || !data ? (
        <Box align={'center'} fontSize={['xs', 'sm']}>
          <Text>Loading Quiz....</Text>
          <Text>Good Luck✌️</Text>
        </Box>
      ) : (
        <>
          {showFinalScore ? (
            <>
              <Box fontSize={['xs', 'sm']}>
                <VStack spacing={3}>
                  <Heading fontSize={'2xl'}>Quiz has ended</Heading>
                  <Text>
                    {' '}
                    {attempts} out of {data.questions.length}{' '}
                  </Text>
                  <Text color={'blue.500'} fontSize="4xl">
                    Your Score: {percentScore}%
                  </Text>
                  <Text>{remarks}</Text>
                </VStack>
                <Box mb={5} mt={5}>
                  <Flex>
                    <UnorderedList listStyleType={'none'}>
                      {/* <ListItem>Username:</ListItem><br /> */}
                      <ListItem>Number Questions:</ListItem>
                      <br />
                      <ListItem>Attempted Questions:</ListItem>
                      <br />
                      <ListItem>Correct Answers:</ListItem>
                      <br />
                      <ListItem>Wrong Answers:</ListItem>
                    </UnorderedList>
                    <Spacer />
                    <UnorderedList listStyleType={'none'}>
                      {/* <ListItem className="capitalize">{user.user.username}</ListItem><br/> */}
                      <ListItem>{data.questions.length}</ListItem>
                      <br />
                      <ListItem>{attempts || 0}</ListItem>
                      <br />
                      <ListItem>{earnPoints || 0}</ListItem>
                      <br />
                      <ListItem>{wrongAnswers || 0}</ListItem>
                    </UnorderedList>
                  </Flex>
                </Box>
                <HStack mt={10}>
                  <Button size={['xs', 'sm']} onClick={restartQuiz}>
                    Restart
                  </Button>
                  <Button size={['xs', 'sm']} onClick={quitBtn}>
                    Quit
                  </Button>

                  {/* <Button size={['xs', 'sm']}>
                    <Link href={'#'}>Review Answers</Link>
                  </Button> */}
                </HStack>
              </Box>
              <Box fontSize={['xs', 'sm']} mt={10}>
                <VStack>
                  <Heading align={'center'} fontSize={['xs', 'lg']}>
                    {data.subject.toUpperCase()}
                  </Heading>
                  <Text fontSize={['xs', 'sm']}>OBJECTIVE TEST REVIEW</Text>
                  <Text fontSize={['xs', 'sm']}>
                    {data.type} {data.month} {data.year}{' '}
                  </Text>
                </VStack>
                <Box>
                  {data.sheet.map((qtn, index) => (
                    <Box key={index}>
                      <Heading align={'center'} fontSize={['x-small', 'sm']}>
                        {qtn.part}
                      </Heading>
                      <Heading align={'center'} fontSize={['x-small', 'sm']}>
                        {qtn.label}
                      </Heading>
                      <Heading
                        align={'center'}
                        my={3}
                        fontSize={['x-small', 'md']}
                      >
                        {qtn.section}
                      </Heading>
                      <Heading
                        align={'center'}
                        mb={3}
                        fontSize={['x-small', 'sm']}
                      >
                        {qtn.instructions}
                      </Heading>
                      <Box>
                        {qtn.mathsInstructions && (
                          <Box
                            className="flex justify-center"
                            mt={2}
                            fontSize={['x-small', 'sm']}
                          >
                            <MathComponent
                              tex={String.raw`${qtn.mathsInstructions}`}
                            />
                          </Box>
                        )}
                        <Box
                          fontSize={['x-small', 'sm']}
                          align="center"
                          fontWeight={'semibold'}
                        >
                          {qtn.img ? (
                            <Box fontSize={['xs', 'sm']} my={8}>
                              <Text
                                align={'center'}
                                fontWeight={'semibold'}
                                fontSize={['xs', 'sm']}
                                mb={'3'}
                              >
                                {qtn.sub1}
                              </Text>
                              <Text
                                align={'center'}
                                fontWeight={'semibold'}
                                fontSize={['x-small', 'sm']}
                                mb={'3'}
                              >
                                {qtn.sub2}
                              </Text>
                              <CldImage
                                width={qtn.imgWidth ? `${qtn.imgWidth}` : 250}
                                height={
                                  qtn.imgHeight ? `${qtn.imgHeight}` : 100
                                }
                                src={qtn.img}
                                alt="questionImage"
                              />
                              <Text
                                align={'center'}
                                fontWeight={'semibold'}
                                fontSize={['x-small', 'sm']}
                                mb={'3'}
                              >
                                {qtn.sub3}
                              </Text>
                              <Box>
                                {qtn.mathsQuestion1 && (
                                  <Box
                                    className="flex justify-center"
                                    fontSize={['x-small', 'sm']}
                                    my={-3}
                                  >
                                    <MathComponent
                                      tex={String.raw`${qtn.mathsQuestion1}`}
                                    />
                                  </Box>
                                )}
                              </Box>
                              <Box>
                                {qtn.mathsQuestion2 && (
                                  <Box
                                    className="flex justify-center"
                                    fontSize={['x-small', 'sm']}
                                    my={-3}
                                  >
                                    <MathComponent
                                      tex={String.raw`${qtn.mathsQuestion2}`}
                                    />
                                  </Box>
                                )}
                              </Box>
                              <Box>
                                {qtn.mathsQuestion3 && (
                                  <Box
                                    className="flex justify-center"
                                    fontSize={['x-small', 'sm']}
                                    my={-3}
                                  >
                                    <MathComponent
                                      tex={String.raw`${qtn.mathsQuestion3}`}
                                    />
                                  </Box>
                                )}
                              </Box>
                              <Box className="flex justify-start">
                                {qtn.mathsQuestion4 && (
                                  <Box
                                    className="flex justify-center"
                                    fontSize={['x-small', 'sm']}
                                  >
                                    <MathComponent
                                      tex={String.raw`${qtn.mathsQuestion4}`}
                                    />
                                  </Box>
                                )}
                              </Box>
                              <Text
                                align={'center'}
                                fontWeight={'semibold'}
                                size={'s'}
                                fontSize={['x-small', 'sm']}
                                mb={'3'}
                              >
                                {qtn.sub4}
                              </Text>
                              <Text
                                align={'center'}
                                fontWeight={'semibold'}
                                size={'s'}
                                fontSize={['x-small', 'sm']}
                                mb={'3'}
                              >
                                {qtn.sub5}
                              </Text>
                              <Text
                                fontWeight={'semibold'}
                                size={'s'}
                                className="flex justify-start"
                                fontSize={['x-small', 'sm']}
                                mb={'2'}
                              >
                                {qtn.question}
                              </Text>
                            </Box>
                          ) : (
                            <>
                              {qtn.mathsQuestion || qtn.mathsQuestion1 ? (
                                <Box fontSize={['x-small', 'sm']} my={5}>
                                  <Text
                                    align={'center'}
                                    fontWeight={'semibold'}
                                    size={'s'}
                                    fontSize={['x-small', 'sm']}
                                    mb={'3'}
                                  >
                                    {qtn.sub1}
                                  </Text>
                                  <Text
                                    align={'center'}
                                    fontWeight={'semibold'}
                                    size={'s'}
                                    fontSize={['x-small', 'sm']}
                                    mb={'3'}
                                  >
                                    {qtn.sub2}
                                  </Text>
                                  <Box>
                                    {qtn.mathsQuestion && (
                                      <Box
                                        className="flex justify-start"
                                        fontSize={['x-small', 'sm']}
                                      >
                                        <MathComponent
                                          tex={String.raw`${qtn.mathsQuestion}`}
                                        />
                                      </Box>
                                    )}
                                  </Box>
                                  <Box>
                                    {qtn.mathsQuestion1 && (
                                      <Box
                                        className="flex justify-center"
                                        fontSize={['xx-small', 'sm']}
                                      >
                                        <MathComponent
                                          tex={String.raw`${qtn.mathsQuestion1}`}
                                        />
                                      </Box>
                                    )}
                                  </Box>
                                  <Box>
                                    {qtn.mathsQuestion2 && (
                                      <Box
                                        className="flex justify-center"
                                        fontSize={['x-small', 'sm']}
                                      >
                                        <MathComponent
                                          tex={String.raw`${qtn.mathsQuestion2}`}
                                        />
                                      </Box>
                                    )}
                                  </Box>
                                  <Box>
                                    {qtn.mathsQuestion3 && (
                                      <Box
                                        className="flex justify-center"
                                        fontSize={['x-small', 'sm']}
                                      >
                                        <MathComponent
                                          tex={String.raw`${qtn.mathsQuestion3}`}
                                        />
                                      </Box>
                                    )}
                                  </Box>
                                  <Text
                                    align={'center'}
                                    fontWeight={'semibold'}
                                    size={'s'}
                                    fontSize={['x-small', 'sm']}
                                    mb={'3'}
                                  >
                                    {qtn.sub3}
                                  </Text>
                                  <Text
                                    align={'center'}
                                    fontWeight={'semibold'}
                                    size={'s'}
                                    fontSize={['x-small', 'sm']}
                                    mb={'3'}
                                  >
                                    {qtn.sub4}
                                  </Text>
                                  <Text
                                    align={'center'}
                                    fontWeight={'semibold'}
                                    size={'s'}
                                    fontSize={['x-small', 'sm']}
                                    mb={'3'}
                                  >
                                    {qtn.sub5}
                                  </Text>
                                  <Box className="flex justify-start">
                                    {qtn.mathsQuestion4 && (
                                      <Box
                                        className="flex justify-center"
                                        fontSize={['x-small', 'sm']}
                                      >
                                        <MathComponent
                                          tex={String.raw`${qtn.mathsQuestion4}`}
                                        />
                                      </Box>
                                    )}
                                  </Box>
                                  <Text
                                    fontWeight={'semibold'}
                                    className="flex justify-start"
                                    fontSize={['x-small', 'sm']}
                                    mb={'2'}
                                  >
                                    {qtn.question}
                                  </Text>
                                </Box>
                              ) : (
                                <Box my={10}>
                                  <Text mb={'3'} fontSize={['x-small', 'sm']}>
                                    {qtn.sub1}
                                  </Text>
                                  <Text mb={'3'} fontSize={['x-small', 'sm']}>
                                    {qtn.sub2}
                                  </Text>
                                  <Text mb={'3'} fontSize={['x-small', 'sm']}>
                                    {qtn.sub3}
                                  </Text>
                                  <Text mb={'3'} fontSize={['x-small', 'sm']}>
                                    {qtn.su4}
                                  </Text>
                                  <Text mb={'3'} fontSize={['x-small', 'sm']}>
                                    {qtn.sub5}
                                  </Text>
                                  <Text mb={'3'} fontSize={['x-small', 'sm']}>
                                    {qtn.sub6}
                                  </Text>
                                  <Box
                                    className="flex justify-start"
                                    align={'center'}
                                    mb={3}
                                  >
                                    <Text
                                      className="flex justify-start"
                                      noOfLines={[3, 2, 2]}
                                    >
                                      {qtn.question}
                                    </Text>
                                  </Box>
                                  <Text mb={-8} className="flex justify-start">
                                    {qtn.num}
                                  </Text>
                                </Box>
                              )}
                            </>
                          )}
                        </Box>
                        <Grid
                          templateColumns={{
                            base: 'repeat(1, 1fr)',
                            md: 'repeat(2, 1fr)',
                          }}
                          gap={4}
                        >
                          <>
                            {qtn.optionimgA ? (
                              <Box
                                className={
                                  qtn.optionimgA === qtn.answerimg
                                    ? `font-quicksand text-sky-400`
                                    : `font-quicksand`
                                }
                              >
                                𝐀. 
                                <CldImage
                                  width="250"
                                  height="150"
                                  src={qtn.optionimgA}
                                  alt="questionImg"
                                />
                              </Box>
                            ) : (
                              <>
                                {qtn.optionMathsA ? (
                                  <Box
                                    fontWeight="semibold"
                                    mb={-5}
                                    fontSize={['x-small', 'sm']}
                                    className={
                                      qtn.optionMathsA === qtn.answerMaths
                                        ? `font-quicksand text-sky-400`
                                        : `font-quicksand`
                                    }
                                  >
                                    <MathComponent
                                      tex={String.raw` 𝐀. ${qtn.optionMathsA}`}
                                    />
                                  </Box>
                                ) : (
                                  <Box className="flex justify-start">
                                    <Text
                                      className={
                                        qtn.optionA === qtn.answer
                                          ? `font-quicksand text-sky-400`
                                          : `font-quicksand`
                                      }
                                      noOfLines={[3, 2, 1]}
                                      fontWeight="semibold"
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
                              <Box
                                className={
                                  qtn.optionimgB === qtn.answerimg
                                    ? `font-quicksand text-sky-400`
                                    : `font-quicksand`
                                }
                              >
                                𝐁.  
                                <CldImage
                                  width="250"
                                  height="150"
                                  src={qtn.optionimgB}
                                  alt="questionImg"
                                />
                              </Box>
                            ) : (
                              <>
                                {qtn.optionMathsB ? (
                                  <Box
                                    fontWeight="semibold"
                                    mb={-4}
                                    fontSize={['x-small', 'sm']}
                                    className={
                                      qtn.optionMathsB === qtn.answerMaths
                                        ? `font-quicksand text-sky-400`
                                        : `font-quicksand`
                                    }
                                  >
                                    <MathComponent
                                      tex={String.raw`𝐁. ${qtn.optionMathsB}`}
                                    />
                                  </Box>
                                ) : (
                                  <Box className="flex justify-start">
                                    <Text
                                      className={
                                        qtn.optionB === qtn.answer
                                          ? `font-quicksand text-sky-400`
                                          : `font-quicksand`
                                      }
                                      noOfLines={[3, 2, 2]}
                                      fontWeight="semibold"
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
                              <Box
                                className={
                                  qtn.optionimgC === qtn.answerimg
                                    ? `font-quicksand text-sky-400`
                                    : `font-quicksand`
                                }
                              >
                                𝐂.  
                                <CldImage
                                  width="250"
                                  height="150"
                                  src={qtn.optionimgC}
                                  alt="questionImg"
                                />
                              </Box>
                            ) : (
                              <>
                                {qtn.optionMathsC ? (
                                  <Box
                                    fontWeight="semibold"
                                    mb={-4}
                                    fontSize={['x-small', 'sm']}
                                    className={
                                      qtn.optionMathsC === qtn.answerMaths
                                        ? `font-quicksand text-sky-400`
                                        : `font-quicksand`
                                    }
                                  >
                                    <MathComponent
                                      tex={String.raw`𝐂. ${qtn.optionMathsC}`}
                                    />
                                  </Box>
                                ) : (
                                  <Box className="flex justify-start">
                                    <Text
                                      className={
                                        qtn.optionC === qtn.answer
                                          ? `font-quicksand text-sky-400`
                                          : `font-quicksand`
                                      }
                                      noOfLines={[3, 2, 2]}
                                      fontWeight="semibold"
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
                              <Box
                                className={
                                  qtn.optionimgD === qtn.answerimg
                                    ? `font-quicksand text-sky-400`
                                    : `font-quicksand`
                                }
                              >
                                𝐃.  
                                <CldImage
                                  width="250"
                                  height="150"
                                  src={qtn.optionimgD}
                                  alt="questionImg"
                                />
                              </Box>
                            ) : (
                              <>
                                {qtn.optionMathsD ? (
                                  <Box
                                    fontWeight="semibold"
                                    mb={3}
                                    fontSize={['x-small', 'sm']}
                                    className={
                                      qtn.optionMathsD === qtn.answerMaths
                                        ? `font-quicksand text-sky-400`
                                        : `font-quicksand`
                                    }
                                  >
                                    <MathComponent
                                      tex={String.raw`𝐃. ${qtn.optionMathsD}`}
                                    />
                                  </Box>
                                ) : (
                                  <Box className="flex justify-start">
                                    <Text
                                      className={
                                        qtn.optionD === qtn.answer
                                          ? `font-quicksand text-sky-400`
                                          : `font-quicksand`
                                      }
                                      noOfLines={[3, 2, 2]}
                                      fontWeight="semibold"
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
              <Box>
                <VStack>
                  <Heading align={'center'} fontSize={['xs', 'lg']}>
                    {data.subject.toUpperCase()}
                  </Heading>
                  <Text fontSize={['xs', 'sm']}>OBJECTIVE TEST</Text>
                  <Text fontSize={['xs', 'sm']}>
                    {data.type} {data.month} {data.year}{' '}
                  </Text>
                  <Heading align={'center'} fontSize={['xs', 'sm']}>
                    {question?.part}
                  </Heading>
                  <Heading align={'center'} fontSize={['xs', 'sm']}>
                    {question?.label}
                  </Heading>
                </VStack>
                <Flex alignItems={'center'}>
                  <Text fontSize={['xs', 'sm']}>
                    {track} of {data.questions.length}
                  </Text>
                  <Spacer />
                  <Timer
                    setShowFinalScore={setShowFinalScore}
                    isPlaying={isPlaying}
                  />
                </Flex>
                <Heading align={'center'} mb={3} fontSize={['xs', 'md']}>
                  {question?.section}
                </Heading>
                <Text align={'center'} fontSize={['xs', 'sm']} m={5}>
                  {question?.instructions}
                </Text>
              </Box>
              <Box>
                <Box align="center" mb={5} maxH={450}>
                  {question.img ? (
                    <Box fontSize={['xs', 'sm']}>
                      <Text
                        align={'center'}
                        fontWeight={'semibold'}
                        fontSize={['xs', 'sm']}
                        mb={'3'}
                      >
                        {question.sub1}
                      </Text>
                      <Text
                        align={'center'}
                        fontWeight={'semibold'}
                        fontSize={['xs', 'sm']}
                        mb={'3'}
                      >
                        {question.sub2}
                      </Text>
                      <CldImage
                        width={question.imgWidth ? `${question.imgWidth}` : 300}
                        height={
                          question.imgHeight ? `${question.imgHeight}` : 100
                        }
                        src={question.img}
                        alt="questionImage"
                      />
                      <Text
                        align={'center'}
                        fontWeight={'semibold'}
                        fontSize={['xs', 'sm']}
                        mb={'3'}
                      >
                        {question.sub3}
                      </Text>
                      <Box>
                        {question.mathsQuestion1 && (
                          <Box
                            className="flex justify-center"
                            fontSize={['xs', 'sm']}
                            my={-3}
                          >
                            <MathComponent
                              tex={String.raw`${question.mathsQuestion1}`}
                            />
                          </Box>
                        )}
                      </Box>
                      <Box>
                        {question.mathsQuestion2 && (
                          <Box
                            className="flex justify-center"
                            fontSize={['xs', 'sm']}
                            my={-3}
                          >
                            <MathComponent
                              tex={String.raw`${question.mathsQuestion2}`}
                            />
                          </Box>
                        )}
                      </Box>
                      <Box>
                        {question.mathsQuestion3 && (
                          <Box
                            className="flex justify-center"
                            fontSize={['xs', 'sm']}
                            my={-3}
                          >
                            <MathComponent
                              tex={String.raw`${question.mathsQuestion3}`}
                            />
                          </Box>
                        )}
                      </Box>
                      <Box className="flex justify-start">
                        {question.mathsQuestion4 && (
                          <Box
                            className="flex justify-center"
                            fontSize={['xs', 'sm']}
                          >
                            <MathComponent
                              tex={String.raw`${question.mathsQuestion4}`}
                            />
                          </Box>
                        )}
                      </Box>
                      <Text
                        align={'center'}
                        fontWeight={'semibold'}
                        size={'s'}
                        fontSize={['xs', 'sm']}
                        mb={'3'}
                      >
                        {question.sub4}
                      </Text>
                      <Text
                        align={'center'}
                        fontWeight={'semibold'}
                        size={'s'}
                        fontSize={['xs', 'sm']}
                        mb={'3'}
                      >
                        {question.sub5}
                      </Text>
                      <Text
                        fontWeight={'semibold'}
                        size={'s'}
                        className="flex justify-start"
                        fontSize={['xs', 'sm']}
                        mb={'2'}
                      >
                        {question.question}
                      </Text>
                    </Box>
                  ) : (
                    <>
                      {question.mathsQuestion || question.mathsQuestion1 ? (
                        <Box fontSize={['xs', 'sm']}>
                          <Text
                            align={'center'}
                            fontWeight={'semibold'}
                            size={'s'}
                            fontSize={['xs', 'sm']}
                            mb={'3'}
                          >
                            {question.sub1}
                          </Text>
                          <Text
                            align={'center'}
                            fontWeight={'semibold'}
                            size={'s'}
                            fontSize={['xs', 'sm']}
                            mb={'3'}
                          >
                            {question.sub2}
                          </Text>
                          <Box>
                            {question.mathsQuestion && (
                              <Box
                                className="flex justify-center"
                                fontSize={['xs', 'sm']}
                              >
                                <MathComponent
                                  tex={String.raw`${question.mathsQuestion}`}
                                />
                              </Box>
                            )}
                          </Box>
                          <Box>
                            {question.mathsQuestion1 && (
                              <Box
                                className="flex justify-center"
                                fontSize={['xs', 'sm']}
                              >
                                <MathComponent
                                  tex={String.raw`${question.mathsQuestion1}`}
                                />
                              </Box>
                            )}
                          </Box>
                          <Box>
                            {question.mathsQuestion2 && (
                              <Box
                                className="flex justify-center"
                                fontSize={['xs', 'sm']}
                              >
                                <MathComponent
                                  tex={String.raw`${question.mathsQuestion2}`}
                                />
                              </Box>
                            )}
                          </Box>
                          <Box>
                            {question.mathsQuestion3 && (
                              <Box
                                className="flex justify-center"
                                fontSize={['xs', 'sm']}
                              >
                                <MathComponent
                                  tex={String.raw`${question.mathsQuestion3}`}
                                />
                              </Box>
                            )}
                          </Box>
                          <Text
                            align={'center'}
                            fontWeight={'semibold'}
                            size={'s'}
                            fontSize={['xs', 'sm']}
                            mb={'3'}
                          >
                            {question.sub3}
                          </Text>
                          <Text
                            align={'center'}
                            fontWeight={'semibold'}
                            size={'s'}
                            fontSize={['xs', 'sm']}
                            mb={'3'}
                          >
                            {question.sub4}
                          </Text>
                          <Text
                            align={'center'}
                            fontWeight={'semibold'}
                            size={'s'}
                            fontSize={['xs', 'sm']}
                            mb={'3'}
                          >
                            {question.sub5}
                          </Text>
                          <Box className="flex justify-start">
                            {question.mathsQuestion4 && (
                              <Box
                                className="flex justify-center"
                                fontSize={['xs', 'sm']}
                              >
                                <MathComponent
                                  tex={String.raw`${question.mathsQuestion4}`}
                                />
                              </Box>
                            )}
                          </Box>
                          <Text
                            fontWeight={'semibold'}
                            className="flex justify-start"
                            fontSize={['xs', 'sm']}
                            mb={'2'}
                          >
                            {question.question}
                          </Text>
                        </Box>
                      ) : (
                        <Box>
                          <Text
                            align={'center'}
                            fontWeight={'semibold'}
                            size={'s'}
                            fontSize={['xs', 'sm']}
                            mb={'3'}
                          >
                            {question.sub1}
                          </Text>
                          <Text
                            align={'center'}
                            fontWeight={'semibold'}
                            size={'s'}
                            fontSize={['xs', 'sm']}
                            mb={'3'}
                          >
                            {question.sub2}
                          </Text>
                          <Text
                            align={'center'}
                            fontWeight={'semibold'}
                            size={'s'}
                            fontSize={['xs', 'sm']}
                            mb={'3'}
                          >
                            {question.sub3}
                          </Text>
                          <Text
                            align={'center'}
                            fontWeight={'semibold'}
                            size={'s'}
                            fontSize={['xs', 'sm']}
                            mb={'3'}
                          >
                            {question.sub4}
                          </Text>
                          <Text
                            align={'center'}
                            fontWeight={'semibold'}
                            size={'s'}
                            fontSize={['xs', 'sm']}
                            mb={'3'}
                          >
                            {question.sub5}
                          </Text>
                          <Text
                            className="flex justify-start"
                            fontWeight={'semibold'}
                            fontSize={['xs', 'sm']}
                            mb={'2'}
                          >
                            {question.question}
                          </Text>
                        </Box>
                      )}
                    </>
                  )}
                </Box>

                <RadioGroup
                  onChange={setValue}
                  value={PrevResult ? PrevResult : value}
                  mt={5}
                >
                  <Grid
                    templateColumns={{
                      base: 'repeat(1, 1fr)',
                      md: 'repeat(2, 1fr)',
                    }}
                    gap={6}
                  >
                    <>
                      {question.optionimgA ? (
                        <Radio
                          size="lg"
                          borderColor="black"
                          colorScheme="green"
                          className="flex items-center"
                          value={question?.optionimgA}
                        >
                          𝐀.{' '}
                          <CldImage
                            width={
                              question.imgWidth ? `${question.imgWidth}` : 350
                            }
                            height={
                              question.imgHeight ? `${question.imgHeight}` : 100
                            }
                            src={question?.optionimgA}
                            alt="optionimgA"
                          />
                        </Radio>
                      ) : (
                        <Radio
                          size="lg"
                          borderColor="black"
                          colorScheme="green"
                          value={
                            question?.optionMathsA
                              ? question?.optionMathsA
                              : question?.optionA
                          }
                        >
                          {question.optionMathsA ? (
                            <Box fontSize={['xs', 'sm']} my={-2}>
                              <MathComponent
                                tex={String.raw`𝐀. ${question?.optionMathsA}`}
                              />
                            </Box>
                          ) : (
                            <Text
                              className="font-quicksand"
                              fontWeight="semibold"
                              fontSize={['xs', 'sm']}
                            >
                              𝐀. {question?.optionA}
                            </Text>
                          )}
                        </Radio>
                      )}
                    </>
                    <>
                      {question.optionimgB ? (
                        <Radio
                          size="lg"
                          borderColor="black"
                          colorScheme="green"
                          value={question?.optionimgB}
                        >
                          𝐁.{' '}
                          <CldImage
                            width={
                              question.imgWidth ? `${question.imgWidth}` : 350
                            }
                            height={
                              question.imgHeight ? `${question.imgHeight}` : 100
                            }
                            src={question?.optionimgB}
                            alt="optionimgB"
                          />
                        </Radio>
                      ) : (
                        <Radio
                          size="lg"
                          borderColor="black"
                          colorScheme="green"
                          value={
                            question?.optionMathsB
                              ? question?.optionMathsB
                              : question?.optionB
                          }
                        >
                          {question.optionMathsB ? (
                            <Box fontSize={['xs', 'sm']} my={-2}>
                              <MathComponent
                                tex={String.raw`𝐁. ${question?.optionMathsB}`}
                              />
                            </Box>
                          ) : (
                            <Text
                              className="font-quicksand"
                              fontWeight="semibold"
                              fontSize={['xs', 'sm']}
                            >
                              𝐁. {question?.optionB}
                            </Text>
                          )}
                        </Radio>
                      )}
                    </>
                    <>
                      {question.optionimgC ? (
                        <Radio
                          size="lg"
                          borderColor="black"
                          colorScheme="green"
                          value={question?.optionimgC}
                        >
                          𝐂.{' '}
                          <CldImage
                            width={
                              question.imgWidth ? `${question.imgWidth}` : 350
                            }
                            height={
                              question.imgHeight ? `${question.imgHeight}` : 100
                            }
                            src={question?.optionimgC}
                            alt="optionimgC"
                          />
                        </Radio>
                      ) : (
                        <Radio
                          size="lg"
                          borderColor="black"
                          colorScheme="green"
                          value={
                            question?.optionMathsC
                              ? question?.optionMathsC
                              : question?.optionC
                          }
                        >
                          {question.optionMathsC ? (
                            <Box fontSize={['xs', 'sm']} my={-2}>
                              <MathComponent
                                tex={String.raw`𝐂. ${question?.optionMathsC}`}
                              />
                            </Box>
                          ) : (
                            <Text
                              className="font-quicksand"
                              fontWeight="semibold"
                              fontSize={['xs', 'sm']}
                            >
                              𝐂. {question?.optionC}
                            </Text>
                          )}
                        </Radio>
                      )}
                    </>
                    <>
                      {question.optionimgD ? (
                        <Radio
                          size="lg"
                          borderColor="black"
                          colorScheme="green"
                          value={question?.optionimgD}
                        >
                          𝐃.{' '}
                          <CldImage
                            width={
                              question.imgWidth ? `${question.imgWidth}` : 350
                            }
                            height={
                              question.imgHeight ? `${question.imgHeight}` : 100
                            }
                            src={question?.optionimgD}
                            alt="optionimgD"
                          />
                        </Radio>
                      ) : (
                        <Radio
                          size="lg"
                          borderColor="black"
                          colorScheme="green"
                          value={
                            question?.optionMathsD
                              ? question?.optionMathsD
                              : question?.optionD
                          }
                        >
                          {question.optionMathsD ? (
                            <Box fontSize={['xs', 'sm']} my={-2}>
                              <MathComponent
                                tex={String.raw`𝐃. ${question?.optionMathsD}`}
                              />
                            </Box>
                          ) : (
                            <Text
                              className="font-quicksand"
                              fontWeight="semibold"
                              fontSize={['xs', 'sm']}
                            >
                              𝐃. {question?.optionD}
                            </Text>
                          )}
                        </Radio>
                      )}
                    </>
                  </Grid>
                </RadioGroup>
                <Flex mt={10}>
                  {trace > 0 ? (
                    <Button
                      fontSize={['xs', 'sm']}
                      borderRadius={1}
                      colorScheme="yellow"
                      color={'black'}
                      onClick={onPrev}
                    >
                      Prev
                    </Button>
                  ) : (
                    <></>
                  )}
                  <Spacer />
                  {track === data.questions.length ? (
                    <Button
                      fontSize={['xs', 'sm']}
                      borderRadius={1}
                      colorScheme="green"
                      color={'black'}
                      onClick={Done}
                    >
                      Done
                    </Button>
                  ) : (
                    <Button
                      fontSize={['xs', 'sm']}
                      borderRadius={1}
                      colorScheme="green"
                      color={'black'}
                      onClick={onNext}
                    >
                      Next
                    </Button>
                  )}
                </Flex>
              </Box>
              <Box>
                <HStack mt={'10'} spacing={50}>
                  <Button size={['xs', 'sm']} onClick={quitBtn}>
                    Quit
                  </Button>
                  <Button size={['xs', 'sm']} onClick={restartQuiz}>
                    <Link href={`/quiz/${data._id}`}>Back</Link>
                  </Button>
                  <Show below="sm">
                    <Popover>
                      <PopoverTrigger>
                        <IconButton
                          size="sm"
                          icon={<MdOutlineTipsAndUpdates size={15} />}
                          w={8}
                          h={8}
                          color="pink.700"
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader bg={'pink.300'}>Tooltip!</PopoverHeader>
                        <PopoverBody>
                          <Text fontSize={['xs', 'sm']}>
                            For better view of diagrams, zoom in or rotate
                            screen to landscape
                          </Text>
                        </PopoverBody>
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
  );
};

export default EasyMode;
