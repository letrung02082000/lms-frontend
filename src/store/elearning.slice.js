import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activityReport: null,
  elearningCourses: null,
  elearningCoursesContents: null,
  elearningGrades: null,
  elearningUser: null,
  elearningSettings: null,
  bookTime: null,
  quizAttempts: null,
  isLimitExceeded: false,
  timeLimitPerDay: null,
  totalTodayTime: null,
}

export const elearningSlice = createSlice({
  name: 'elearning',
  initialState,
  reducers: {
    updateElearningData: (state, action) => {
      state = { ...state, ...action.payload }
      return state
    },
  }
})

export const { updateElearningData } = elearningSlice.actions
export const selectElearningCourses = state => state.elearning.elearningCourses
export const selectElearningCoursesContents = state => state.elearning.elearningCoursesContents
export const selectElearningGrades = state => state.elearning.elearningGrades
export const selectElearningUser = state => state.elearning.elearningUser
export const selectElearningSettings = state => state.elearning.elearningSettings
export const selectActivityReport = state => state.elearning.activityReport
export const selectBookTime = state => state.elearning.bookTime
export const selectQuizAttempts = state => state.elearning.quizAttempts
export const selectIsLimitExceeded = state => state.elearning.isLimitExceeded
export const selectElearningData = state => state.elearning
export default elearningSlice.reducer
