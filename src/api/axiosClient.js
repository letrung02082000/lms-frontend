import axios from 'axios'

console.log(process.env.NODE_ENV)

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/'

const axiosClient = axios.create({
  baseURL,
  headers: {}
})

const handleResponse = res => {
  return res.data
}

const handleError = err => {
  return Promise.reject(err)
}

axiosClient.interceptors.request.use(
  req => {
    return req
  },
  err => {
    return Promise.reject(err)
  }
)

axiosClient.interceptors.response.use(handleResponse, handleError)

export default axiosClient
