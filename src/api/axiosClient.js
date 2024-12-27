import axios from 'axios'

// const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000'
const baseURL = process.env.REACT_APP_API_URL || 'https://api.isinhvien.vn'
const token = localStorage.getItem("user-jwt-tk");

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Authorization': `Bearer ${token}`
  }
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
