import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress configuration

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    console.log('getToken not null')
    if (to.path === '/login') {
      console.log('to=login, redirect /')
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      console.log('to=', to)
      console.log('from=', from)
      // 判断是否跳转到别的站点
      if (to.path === '/404') {
        console.log('to.path = 404')
        const redirectedFrom = to.redirectedFrom
        console.log(redirectedFrom)
        if (redirectedFrom) {
          console.log('跳回到最初始的来源站点')
          window.location.href = redirectedFrom.substring(1)
        }
        console.log('跳回到最初始的来源站点失败')
      } else {
        if (store.getters.roles.length === 0) {
          console.log('开始拉取会话信息')
          store.dispatch('GetSessionInfo').then(res => { // 拉取用户信息
            console.log('拉取会话信息成功')
            next()
          }).catch((err) => {
            console.log('拉取会话信息失败')
            store.dispatch('FedLogOut').then(() => {
              Message.error(err || 'Verification failed, please login again')
              next({ path: '/' })
            })
          })
        } else {
          next()
        }
      }
    }
  } else {
    console.log('getToken get null')
    if (whiteList.indexOf(to.path) !== -1) {
      console.log('未登陆，但为白名单')
      next()
    } else {
      console.log('未登陆，重定向到登陆页', `/login?redirect=${to.path}`)
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
