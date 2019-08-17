import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import TokenKey, { getToken } from '@/utils/auth'

// 路由
// import Router from '../router/index'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 30 * 1000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers[TokenKey] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.error_code === 0) {
      return response.data
    } else if (res.error_code === 1005) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })
      console.log('当前会话已过期，重新认证,')
      store.dispatch('FedLogOut')
      return Promise.reject(response)
    } else {
      Message({
        message: res.msg,
        type: 'error',
        duration: 10 * 1000
      })
      return response.data
    }
  },
  error => {
    console.log(error) // for debug
    const { status } = error.response
    if (status === 401) {
      MessageBox.confirm(
        '你已被登出，可以取消继续留在该页面，或者重新登录',
        '确定登出',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else if (status === 403) {
      Message({
        message: '对不起，您不能访问此资源',
        type: 'error',
        duration: 5 * 1000
      })
    } else if (status === 302) {
      console.log(error)
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)

export default service
