'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Heading,
  Radio,
  RadioGroup,
  Spacer,
  Text,
  VStack,
  useBoolean,
} from '@chakra-ui/react';
import Timer from '@/components/Timer20';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MathComponent } from 'mathjax-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

async function getData(id) {
  const res = await fetch(`http://localhost:3000/api/questions/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return notFound();
  }

  return res.json();
}

const Quiz = (ctx) => {
  const [easyMode, setEasyMode] = useBoolean();
  const [value, setValue] = useState('');
  const [data, setData] = useState();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    async function getQuestions() {
      try {
        const response = await axios.get(`/api/questions/${ctx.params.id}`);

        if (response.status !== 200) {
          return notFound;
        }

        const exam = response.data;
        setData(exam); // Assuming setData is defined elsewhere
      } catch (error) {
        console.error(error);
      }
    }
    getQuestions();
  }, []);

  // const toastLoading = toast('Please sign in first', {
  //   icon: '🔐'
  // });

  return (
    <>
      {session?.user && (
        <Box
          color={'gray.900'}
          bg={'gray.300'}
          p={[3, 5]}
          maxW={800}
          mx={[2, 'auto']}
          borderRadius={5}
          className="font-poppins w-full"
          fontSize={['xs', 'sm']}
        >
          <Box align={'left'}>
            <HStack>
              <Button size={'xs'} onClick={setEasyMode.toggle}>
                Easy Mode
              </Button>
              <Text fontSize={'xs'}>{easyMode ? 'On' : 'Off'}</Text>
            </HStack>
          </Box>
          {easyMode ? (
            <>
              <Box fontSize={['xs', 'sm']}>
                <VStack>
                  <Heading align={'center'} fontSize={['xs', 'lg']}>
                    {data.subject.toUpperCase()}
                  </Heading>
                  <Text>OBJECTIVE TEST</Text>
                  <Text fontSize={['xs', 'sm']}>
                    {data.type} {data.month} {data.year}
                  </Text>
                  <Heading fontSize={['xs', 'sm']} align={'center'}>
                    {data.questions[0].part}
                  </Heading>
                  <Heading size={'md'} align={'center'} fontSize={['xs', 'sm']}>
                    {data.questions[0].label}
                  </Heading>
                </VStack>
                <Flex alignItems={'center'}>
                  <Text fontWeight={'semibold'}>
                    1 of {data.questions.length}
                  </Text>
                  <Spacer />
                  <Timer />
                </Flex>
                <Heading fontSize={['xs', 'md']} align={'center'} mb={3}>
                  {data.questions[0].section}
                </Heading>
                <Text align={'center'} m={5}>
                  {data.questions[0].instructions}
                </Text>
              </Box>
              <Box>
                <Text fontWeight={'semibold'} size={'s'} mb={'5'}>
                  {data.questions[0].question}
                </Text>
                <RadioGroup onChange={setValue} value={value}>
                  <Grid
                    templateColumns={{
                      base: 'repeat(1, 1fr)',
                      md: 'repeat(2, 1fr)',
                    }}
                    gap={6}
                  >
                    <Radio
                      borderColor="black"
                      color={'red.300'}
                      size="md"
                      colorScheme="green"
                      value={data.questions[0].optionA}
                    >
                      {data.questions[0].optionMathsA ? (
                        <Box fontSize={['xs', 'sm']}>
                          <MathComponent
                            tex={String.raw`𝐀. ${data.questions[0].optionMathsA}`}
                          />
                        </Box>
                      ) : (
                        <Text
                          className="font-quicksand"
                          fontWeight="medium"
                          fontSize={['xs', 'sm']}
                        >
                          𝐀. {data.questions[0].optionA}
                        </Text>
                      )}
                    </Radio>
                    <Radio
                      borderColor="black"
                      color={'red.300'}
                      size="md"
                      colorScheme="green"
                      value={data.questions[0].optionB}
                    >
                      {data.questions[0].optionMathsB ? (
                        <Box fontSize={['xs', 'sm']}>
                          <MathComponent
                            tex={String.raw`𝐁. ${data.questions[0].optionMathsB}`}
                          />
                        </Box>
                      ) : (
                        <Text
                          className="font-quicksand"
                          fontWeight="medium"
                          fontSize={['xs', 'sm']}
                        >
                          𝐁. {data.questions[0].optionB}
                        </Text>
                      )}
                    </Radio>
                    <Radio
                      borderColor="black"
                      color={'red.300'}
                      size="md"
                      colorScheme="green"
                      value={data.questions[0].optionC}
                    >
                      {data.questions[0].optionMathsC ? (
                        <Box fontSize={['xs', 'sm']}>
                          <MathComponent
                            tex={String.raw`𝐂. ${data.questions[0].optionMathsC}`}
                          />
                        </Box>
                      ) : (
                        <Text
                          className="font-quicksand"
                          fontWeight="medium"
                          fontSize={['xs', 'sm']}
                        >
                          𝐂. {data.questions[0].optionC}
                        </Text>
                      )}
                    </Radio>
                    <Radio
                      borderColor="black"
                      color={'red.300'}
                      size="md"
                      colorScheme="green"
                      value={data.questions[0].optionD}
                    >
                      {data.questions[0].optionMathsD ? (
                        <Box fontSize={['xs', 'sm']}>
                          <MathComponent
                            tex={String.raw`𝐃. ${data.questions[0].optionMathsD}`}
                          />
                        </Box>
                      ) : (
                        <Text
                          className="font-quicksand"
                          fontWeight="medium"
                          fontSize={['xs', 'sm']}
                        >
                          𝐃. {data.questions[0].optionD}
                        </Text>
                      )}
                    </Radio>
                  </Grid>
                </RadioGroup>
                <Button mt={10} fontSize={['xs', 'sm']}>
                  <Link href={`/easyMode/${data._id}`}>Start Quiz</Link>
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
                  <Box fontSize={['xs', 'sm']}>
                    <VStack>
                      <Heading align={'center'} fontSize={['xs', 'lg']}>
                        {data.subject.toUpperCase()}
                      </Heading>
                      <Text fontSize={['xs', 'sm']}>OBJECTIVE TEST</Text>
                      <Text>
                        {data.type} {data.month} {data.year}
                      </Text>
                      <Heading fontSize={['xs', 'sm']} align={'center'}>
                        {data.questions[0].part}
                      </Heading>
                      <Heading fontSize={['xs', 'sm']} align={'center'}>
                        {data.questions[0].label}
                      </Heading>
                    </VStack>
                    <Flex alignItems={'center'}>
                      <Text>1 of {data.questions.length}</Text>
                      <Spacer />
                      <Timer />
                    </Flex>
                    <Heading fontSize={['xs', 'md']} align={'center'} mb={3}>
                      {data.questions[0].section}
                    </Heading>
                    <Text align={'center'} m={5}>
                      {data.questions[0].instructions}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight={'semibold'} size={'s'} mb={'5'}>
                      {data.questions[0].question}
                    </Text>
                    <Grid
                      templateColumns={{
                        base: 'repeat(1, 1fr)',
                        md: 'repeat(2, 1fr)',
                      }}
                      gap={6}
                    >
                      <>
                        {data.questions[0].optionMathsA ? (
                          <Box
                            className="font-quicksand flex justify-center"
                            as="button"
                            maxW="lg"
                            height="55px"
                            borderRadius="5px"
                            bg={'gray.100'}
                            color={'gray.900'}
                            _hover={{ bg: 'gray.200' }}
                          >
                            <Box fontWeight="semibold" fontSize={['xs', 'sm']}>
                              <MathComponent
                                tex={String.raw`${data.questions[0].optionMathsA}`}
                              />
                            </Box>
                          </Box>
                        ) : (
                          <Box
                            className="font-quicksand flex justify-center"
                            as="button"
                            maxW="lg"
                            height="40px"
                            borderRadius="5px"
                            bg={'gray.100'}
                            color={'gray.900'}
                            _hover={{ bg: 'gray.200' }}
                          >
                            <Text
                              noOfLines={[3, 2, 1]}
                              fontWeight="semibold"
                              fontSize={['xs', 'sm']}
                            >
                              {data.questions[0].optionA}
                            </Text>
                          </Box>
                        )}
                      </>
                      <>
                        {data.questions[0].optionMathsB ? (
                          <Box
                            className="font-quicksand flex justify-center"
                            as="button"
                            maxW="lg"
                            height="55px"
                            borderRadius="5px"
                            bg={'gray.100'}
                            color={'gray.900'}
                            _hover={{ bg: 'gray.200' }}
                          >
                            <Box fontWeight="semibold" fontSize={['xs', 'sm']}>
                              <MathComponent
                                tex={String.raw`${data.questions[0].optionMathsB}`}
                              />
                            </Box>
                          </Box>
                        ) : (
                          <Box
                            className="font-quicksand flex justify-center"
                            as="button"
                            maxW="lg"
                            height="40px"
                            borderRadius="5px"
                            bg={'gray.100'}
                            color={'gray.900'}
                            _hover={{ bg: 'gray.200' }}
                          >
                            <Text
                              noOfLines={[3, 2, 1]}
                              fontWeight="semibold"
                              fontSize={['xs', 'sm']}
                            >
                              {data.questions[0].optionB}
                            </Text>
                          </Box>
                        )}
                      </>
                      <>
                        {data.questions[0].optionMathsC ? (
                          <Box
                            className="font-quicksand flex justify-center"
                            as="button"
                            maxW="lg"
                            height="55px"
                            borderRadius="5px"
                            bg={'gray.100'}
                            color={'gray.900'}
                            _hover={{ bg: 'gray.200' }}
                          >
                            <Box fontWeight="semibold" fontSize={['xs', 'sm']}>
                              <MathComponent
                                tex={String.raw`${data.questions[0].optionMathsC}`}
                              />
                            </Box>
                          </Box>
                        ) : (
                          <Box
                            className="font-quicksand flex justify-center"
                            as="button"
                            maxW="lg"
                            height="40px"
                            borderRadius="5px"
                            bg={'gray.100'}
                            color={'gray.900'}
                            _hover={{ bg: 'gray.200' }}
                          >
                            <Text
                              noOfLines={[3, 2, 1]}
                              fontWeight="semibold"
                              fontSize={['xs', 'sm']}
                            >
                              {data.questions[0].optionC}
                            </Text>
                          </Box>
                        )}
                      </>
                      <>
                        {data.questions[0].optionMathsD ? (
                          <Box
                            className="font-quicksand flex justify-center"
                            as="button"
                            maxW="lg"
                            height="55px"
                            borderRadius="5px"
                            bg={'gray.100'}
                            color={'gray.900'}
                            _hover={{ bg: 'gray.200' }}
                          >
                            <Box fontWeight="semibold" fontSize={['xs', 'sm']}>
                              <MathComponent
                                tex={String.raw`${data.questions[0].optionMathsD}`}
                              />
                            </Box>
                          </Box>
                        ) : (
                          <Box
                            className="font-quicksand flex justify-center"
                            as="button"
                            maxW="lg"
                            height="40px"
                            borderRadius="5px"
                            bg={'gray.100'}
                            color={'gray.900'}
                            _hover={{ bg: 'gray.200' }}
                          >
                            <Text
                              noOfLines={[3, 2, 1]}
                              fontWeight="semibold"
                              fontSize={['xs', 'sm']}
                            >
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
      )}
    </>
  );
};

export default Quiz;
