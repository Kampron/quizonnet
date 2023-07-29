import { useEffect } from "react";
import { postResult } from "@/helper/helper";
import * as Action from '@/redux/result_reducer'

export const PushUserAnswer = (result) => async (dispatch) => {
  try {
    await dispatch(Action.pushResultAction(result))
  } catch (error) {
    console.log(error)
  }
}

export const PushAnswer = (answer) => async (dispatch) => {
  try {
    await dispatch(Action.pushAnswerAction(answer))
  } catch (error) {
    console.log(error)
  }
}

export const updateResult = (index) => async (dispatch) => {
  try {
      dispatch(Action.updateResultAction(index))
  } catch (error) {
      console.log(error)
  }
}

export const ResetResultAction = () => async (dispatch) => {
  try {
      await dispatch(Action.resetResultAction())
  } catch (error) {
      console.log(error)
  }
}


/** insert result */
export const usePublishResult = (resultData) => {
  useEffect(() => {
       const { username, result, length } = resultData;
      (async () => {
      
      try {
          if(!length && !result){
              throw new Error("Couldn't get Result")
          } 
          if(result.length === length) {
              await postResult('/quizonnet/results/shs/english', resultData, data => data)
          }
      } catch (error) {
          console.log(error)
      }
  })()
},[])
    
}