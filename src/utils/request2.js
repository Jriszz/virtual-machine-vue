import axios from 'axios'
import { Message } from 'element-ui'
import { hideLoading, showLoading } from '@/utils/loading'
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API2, // api 的 base_url
  timeout: 60000 // request timeout

})

// request interceptor
service.interceptors.request.use(

  config => {
    // do something before request is sent
    // config.headers['withCredentials'] =true
    config.headers['Content-type'] = 'application/json,text/plain,*/*'
    showLoading()
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    hideLoading()
    return res
  },
  error => {
    hideLoading()
    console.log('err' + error) // for debug
    Message({
      message: '网络错误',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
