import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false }) // NProgress configuration

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (getToken()) {
    console.log('getToken not null')
    if (to.path === '/login') {
      console.log('to=login, redirect /')
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      // 判断是否跳转到别的站点
      if (to.path === '/404') {
        console.log('to.path = 404')
        const redirectedFrom = to.redirectedFrom
        console.log(redirectedFrom)
        if (redirectedFrom) {
          console.log('跳回到最初始的来源站点:' + redirectedFrom.substring(1))
          window.location.href = redirectedFrom.substring(1)
        }
      } else {
        const hasRoles = store.getters.roles && store.getters.roles.length > 0
        if (hasRoles) {
          next()
        } else {
          try {
            console.log('开始拉取会话信息')
            const { roles } = await store.dispatch('GetSessionInfo')
            const accessRoutes = await store.dispatch('generateRoutes', roles)
            router.addRoutes(accessRoutes)
            next({ ...to, replace: true })
          } catch (error) {
            console.log('拉取会话信息失败')
            console.log(error)
            store.dispatch('FedLogOut').then(() => {
              Message.error('获取用户信息失败，请重新登陆！')
              next({ path: '/' })
            })
          }
        }
      }
    }
  } else {
    console.log('getToken get null')
    if (whiteList.indexOf(to.path) !== -1) {
      console.log('未登陆，但为白名单')
      next()
    } else {
      // window.location.href = '/api/user/login'
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
