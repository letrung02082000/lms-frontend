import axios from 'axios'
console.log(process.env.NODE_ENV)
const axiosClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://isinhvien.vn/api' : 'http://localhost:5000/api',
  // timeout: 5000,
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
