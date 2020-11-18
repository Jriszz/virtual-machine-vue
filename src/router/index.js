import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRoutes = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/profiles',
    name: '个中信息',
    hidden: false,
    children: [{
      path: 'profiles',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '个人信息', icon: 'user' }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
  path: '/userCenter',
  component: Layout,
  redirect: '',
  name: 'userCenter',
  hidden: false,
  meta: { title: '用户中心', icon: 'peoples', roles: ['super_admin'] },
  children: [{
    path: 'accesslog',
    component: () => import('@/views/user/userAccessLog'),
    meta: { title: '访问日志', icon: 'eye-open' }
  },
  {
    path: 'users',
    component: () => import('@/views/user/index'),
    meta: { title: '用户列表', icon: 'user', roles: ['super_admin'] }
  },
  {
    path: 'roles',
    component: () => import('@/views/role/index'),
    meta: { title: '角色列表', icon: 'peoples' }
  },
  {
    path: 'systems',
    component: () => import('@/views/businessSystem/index'),
    meta: { title: '站点列表', icon: 'component' }
  },
  {
    path: 'resources',
    component: () => import('@/views/systemResource/index'),
    meta: { title: '站点资源', icon: 'list' }
  }
  ]
},

{
  path: '/platform',
  component: Layout,
  redirect: '',
  name: 'platform',
  hidden: false,
  meta: { title: '测试平台', icon: 'table' },
  children: [{
    path: 'flows',
    component: () => import('@/views/flows/index'),
    meta: { title: '流程列表', icon: 'list' }
  },
  {
    path: 'tasks',
    component: () => import('@/views/tasks/index'),
    meta: { title: '任务列表', icon: 'list' }
  },
  {
    path: 'records',
    component: () => import('@/views/records/index'),
    meta: { title: '用例结果', icon: 'list' }
  },
  {
    path: 'reports',
    component: () => import('@/views/reports/index'),
    meta: { title: '统计报表', icon: 'chart' }
  },
  {
    path: 'envir-table',
    component: () => import('@/views/envManager/envir_config'),
    name: 'EnvirConfig',
    meta: { title: '环境配置', icon: 'table' }
  }
  ]
},

{
  path: '/cicd',
  component: Layout,
  redirect: '/',
  name: 'CICD平台',
  hidden: false,
  meta: { title: 'CICD平台', icon: 'component' },
  children: [{
    path: 'package',
    component: () => import('@/views/package/index'),
    meta: { title: '在线打包', icon: 'list' }
  },
  {
    path: 'version',
    component: () => import('@/views/package/packageRecordList'),
    meta: { title: '版本管理', icon: 'list' }
  }
  ]
},

// 404 page must be placed at the end !!!
{ path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
