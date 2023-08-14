'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Heading,
  Icon,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Show,
  Spacer,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';
import { CldImage, CldOgImage } from 'next-cloudinary';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { MathComponent } from 'mathjax-react';

const ExamSheet = (ctx) => {
  const [data, setData] = useState();

  useEffect(() => {
    async function getQuestions() {
      const res = await fetch(`/api/questions/${ctx.params.id}`);

      if (!res.ok) {
        return notFound;
      }

      const exam = await res.json();
      setData(exam);
    }
    getQuestions();
  }, []);

  return (
    <Box
      color={'gray.900'}
      bg={'gray.300'}
      p={[2, 5]}
      maxW={850}
      my={'10'}
      mx={[2, 'auto']}
      borderRadius={5}
      className="font-poppins w-full"
    >
      {!data ? (
        <Box align={'center'}>
          <Text fontSize={['x-small', 'sm']}>Loading Questions....</Text>
          <Text fontSize={['x-small', 'sm']}>Practice it in quiz mode</Text>
        </Box>
      ) : (
        <Box>
          <VStack>
            <Heading align={'center'} fontSize={['x-small', 'sm']}>
              {data.subject.toUpperCase()}
            </Heading>
            <Text fontSize={['x-small', 'sm']}>OBJECTIVE TEST</Text>
            <Text fontSize={['x-small', 'sm']}>
              {data.type} {data.month} {data.year}
            </Text>
          </VStack>
          <Box>
            {data.sheet.map((qtn, index) => (
              <Box key={index}>
                <Heading
                  size={'md'}
                  align={'center'}
                  fontSize={['x-small', 'sm']}
                >
                  {qtn.part}
                </Heading>
                <Heading
                  size={'md'}
                  align={'center'}
                  fontSize={['x-small', 'sm']}
                >
                  {qtn.label}
                </Heading>
                <Heading
                  size="md"
                  align={'center'}
                  mb={3}
                  fontSize={['x-small', 'sm']}
                >
                  {qtn.section}
                </Heading>
                <Heading
                  size="md"
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
                </Box>
                <Box
                  fontSize={['x-small', 'sm']}
                  align="center"
                  fontWeight={'semibold'}
                >
                  {qtn.img ? (
                    <Box fontSize={['x-small', 'sm']} my={8}>
                      <Text
                        align={'center'}
                        fontWeight={'semibold'}
                        fontSize={['x-small', 'sm']}
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
                        height={qtn.imgHeight ? `${qtn.imgHeight}` : 100}
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
                              noOfLines={[3, 2, 1]}
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
                          width={qtn.imgWidth ? `${qtn.imgWidth}` : 350}
                          height={qtn.imgHeight ? `${qtn.imgHeight}` : 100}
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
                          width={qtn.imgWidth ? `${qtn.imgWidth}` : 350}
                          height={qtn.imgHeight ? `${qtn.imgHeight}` : 100}
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
                          width={qtn.imgWidth ? `${qtn.imgWidth}` : 350}
                          height={qtn.imgHeight ? `${qtn.imgHeight}` : 100}
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
                          width={qtn.imgWidth ? `${qtn.imgWidth}` : 350}
                          height={qtn.imgHeight ? `${qtn.imgHeight}` : 100}
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
            ))}
          </Box>
          <Text
            fontStyle={'italic'}
            mt={4}
            fontWeight={'bold'}
            fontSize={['xs', 'sm']}
            className="flex justify-center"
          >
            END OF OBJECTIVE TEST
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default ExamSheet;
