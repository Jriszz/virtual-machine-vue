import request from '@/utils/request'

const PREFIX = '/user'

// 查询是否开放用户注册
export function openSignup() {
  return request({
    url: PREFIX + '/signup',
    method: 'get'
  })
}

// 用户注册
export function signup(data) {
  return request({
    url: PREFIX + '/signup',
    method: 'post',
    data
  })
}

// 用户登录
export function login(data) {
  return request({
    url: PREFIX + '/login',
    method: 'post',
    data
  })
}

// 获取当前会话用户信息
export function getSessionInfo() {
  return request({
    url: PREFIX + '/session-info',
    method: 'get'
  })
}

// 用户退出登录
export function logout() {
  return request({
    url: PREFIX + '/logout',
    method: 'post'
  })
}

// 用户列表
export function getUserList(params) {
  return request({
    url: PREFIX + '',
    method: 'get',
    params
  })
}

// 用户枚举列表
export function getUserEnumList() {
  return request({
    url: PREFIX + '/enum',
    method: 'get'
  })
}

// 用户注册
export function addUser(data) {
  return request({
    url: PREFIX + '',
    method: 'post',
    data
  })
}

// 用户详情
export function getUserDetail(user_id) {
  return request({
    url: PREFIX + '/' + user_id,
    method: 'get'
  })
}

// 修改用户信息
export function editUser(user_id, data) {
  return request({
    url: PREFIX + '/' + user_id,
    method: 'put',
    data
  })
}

// 修改用户密码
export function modifyUserPassword(data) {
  return request({
    url: PREFIX + '/modify_user_password',
    method: 'post',
    data
  })
}

// 重置用户密码
export function resetUserPassword(user_id, data) {
  return request({
    url: PREFIX + '/' + user_id + '/reset_user_password',
    method: 'post',
    data
  })
}

// 用户操作日志列表
export function getUserAccessLogList(params) {
  return request({
    url: PREFIX + '/access-log',
    method: 'get',
    params
  })
}

// 用户角色列表
export function getUserRoleList(user_id) {
  return request({
    url: PREFIX + '/' + user_id + '/rolelist',
    method: 'get'
  })
}

// 用户加入角色
export function userJoinRole(user_id, role_id) {
  return request({
    url: PREFIX + '/' + user_id + '/rolelist',
    method: 'post',
    data: { role_id }
  })
}

// 用户离开角色
export function userLeaveRole(user_id, role_id) {
  return request({
    url: PREFIX + '/' + user_id + '/rolelist',
    method: 'delete',
    data: { role_id }
  })
}
