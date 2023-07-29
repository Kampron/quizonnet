import { createSlice } from "@reduxjs/toolkit";

export const resultReducer = createSlice({
  name : 'result',
  initialState : {
    userId : null,
    result : [],
    answer : []
  },
  reducers : {
    setUserId : (state, action) => {
      state.userId = action.payload
    },

    pushAnswerAction :(state, action) => {
      state.answer.push(action.payload)
    },

    pushResultAction : (state, action) => {
      state.result.push(action.payload)
    },

    updateResultAction : (state, action) => {
      const {trace, checked } = action.payload
      state.result.fill(checked, trace, trace + 1)
    },

    resetResultAction : () => {
      return {
        userId : null,
        result : [],
        answer : []
      }
    }
  }
})

export const { setUserId, pushAnswerAction, pushResultAction, updateResultAction, resetResultAction } = resultReducer.actions

export default resultReducer.reducer