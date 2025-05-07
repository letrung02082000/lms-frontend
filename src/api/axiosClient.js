import axios from 'axios'
const currentPath = window.location.hostname;
const baseURL = process.env.REACT_APP_ENV === 'production' ? (currentPath?.split('.')?.includes('lms2') ? process.env.REACT_APP_API_2_URL : process.env.REACT_APP_API_URL) : 'http://localhost:5050';
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
