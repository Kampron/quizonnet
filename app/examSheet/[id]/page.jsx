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
                <Box fontSize={['x-small', 'sm']} align='center' fontWeight={'semibold'}>
                  {qtn.img ? (
                    <>
                      <Text  mb={'2'}>
                        {qtn.question}
                      </Text>
                      <Text  mb={'2'}>
                        {qtn.sub1}
                      </Text>
                      <Text  mb={'2'}>
                        {qtn.sub2}
                      </Text>
                      <HStack gap={1}>
                        <Text>{qtn.num}</Text>
                        <CldImage width="550" height="300" src={qtn.img} alt='questionImage' />
                      </HStack>
                      <Text  mb={'2'}>
                        {qtn.sub3}
                      </Text>
                      <Text  mb={'2'}>
                        {qtn.sub4}
                      </Text>
                      <Text  mb={'2'}>
                        {qtn.sub5}
                      </Text>
                    </>
                    ) : (
                    <>
                      {qtn.mathsQuestion ? (
                        <>
                          <Text mb={'2'} className='flex justify-start'>
                            {qtn.sub1}
                          </Text>
                          <Text  className='flex justify-start'>
                            {qtn.sub2}
                          </Text>
                          <Box className='flex justify-start' my={-3}>
                            <MathComponent tex={String.raw`${qtn.mathsQuestion}`} />
                          </Box>
                          <Box>
                            {qtn.mathsQuestion1 && (
                              <Box className='flex justify-start' mt={2}>
                              <MathComponent tex={String.raw`${qtn.mathsQuestion1}`} />
                            </Box>
                            )}
                          </Box>
                          <Text mt={2}  className='flex justify-start'>
                            {qtn.sub3}
                          </Text>
                          <Text mb={'2'} className='flex justify-start'>
                            {qtn.sub4}
                          </Text>
                          <Text mb={'2'} className='flex justify-start'>
                            {qtn.sub5}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text  mb={'3'}>
                              {qtn.sub1}
                          </Text>
                          <Text  mb={'3'}>
                              {qtn.sub2}
                          </Text>
                          <Text  mb={'3'}>
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
                        </>
                      )}
                    </>
                  )}
                </Box>
                <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={4} >
                  <>
                    {qtn.optionimgA ? (
                      <CldImage width="30"height="30"  src={qtn.optionimgA} alt='questionImg' />
                    ) : (
                      <>
                        {qtn.optionMathsA ? (
                          <Box fontWeight='semibold' fontSize={['x-small', 'sm']}>
                            <MathComponent tex={String.raw` 𝐀.${qtn.optionMathsA}`} />
                          </Box>
                        ) : (
                          <Box className='flex justify-start'>
                            <Text 
                              className='font-quicksand'  
                              noOfLines={[3,2,1]}
                              fontWeight='semibold' 
                              fontSize={['x-small', 'sm']}
                            >
                              𝐀.{qtn?.optionA}
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
                          <Box fontWeight='semibold' fontSize={['x-small', 'sm']}>
                              <MathComponent tex={String.raw`𝐁.${qtn.optionMathsB}`} />
                            </Box>
                        ) : (
                        <Box className='flex justify-start'>
                          <Text 
                            className='font-quicksand' 
                            noOfLines={[3,2,1]} 
                            fontWeight='semibold' 
                            fontSize={['x-small', 'sm']}
                          >
                            𝐁.{qtn?.optionB}
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
                          <Box fontWeight='semibold' fontSize={['x-small', 'sm']}>
                            <MathComponent tex={String.raw`𝐂.${qtn.optionMathsC}`} />
                          </Box>
                        ) : (
                          <Box className='flex justify-start'>
                            <Text 
                              className='font-quicksand'  
                              noOfLines={[3,2,1]}
                              fontWeight='semibold' 
                              fontSize={['x-small', 'sm']}
                            >
                              𝐂.{qtn?.optionC}
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
                          <Box fontWeight='semibold' fontSize={['x-small', 'sm']}>
                            <MathComponent tex={String.raw`𝐃.${qtn.optionMathsD}`} />
                          </Box>
                        ) : (
                          <Box className='flex justify-start'>
                            <Text 
                              className='font-quicksand'  
                              noOfLines={[3,2,1]}
                              fontWeight='semibold' 
                              fontSize={['x-small', 'sm']}
                            >
                              𝐃.{qtn?.optionD}
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
          <Text fontStyle={'italic'} mt={4} fontWeight={'bold'} fontSize={['xs', 'sm']} className='flex justify-center'>END OF OBJECTIVE TEST</Text>
        </Box>
      )}
    </Box>
  )
}

export default ExamSheet