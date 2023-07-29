/** fetch questions hook to fetch api data and set values to store */

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
/** redux actions */
import * as Action from '@/redux/question_reducer'

export const useFetchQuestions = (ctx) => {
  const dispatch = useDispatch()
  const [getData, setGetData] = useState({ isLoading : false, apiData : [], serverError : null })

  useEffect(() => {
    setGetData(prev => ({...prev, isLoading : true }))

    /** async function fetch backend data */

    (async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/questions/${ctx.params.id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const questions = await response.json()

        if(response.ok) {
          setGetData(prev => ({...prev, isLoading : false}))
          setGetData(prev => ({...prev, apiData : questions}))
          console.log(questions)

          /** dispatch an action */
          dispatch(Action.startExamAction(questions))
        } else{
          throw new Error("No Questions Available")
        }
      } catch (error) {
        setGetData(prev => ({...prev, isLoading : false}))
        setGetData(prev => ({...prev, serverError : error}))
      }
    })();

  }, [dispatch])

  return [getData, setGetData]
}


/** MoveAction Dispatch function */
export const MovePrevQuestion = () => async (dispatch) => {
  try {
    dispatch(Action.movePrevAction())
  } catch (error) {
    console.log(error)
  }
}


/** MoveAction Dispatch function */
export const MoveNextQuestion = () => async (dispatch) => {
  try {
    dispatch(Action.moveNextAction())
  } catch (error) {
    console.log(error)
  }
}