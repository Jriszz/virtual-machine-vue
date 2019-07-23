import request from '@/utils/request'

const PREFIX = '/role'

// 角色列表
export function getRoleList(params) {
  return request({
    url: PREFIX + '',
    method: 'get',
    params
  })
}

// 角色添加
export function addRole(data) {
  return request({
    url: PREFIX + '',
    method: 'post',
    data
  })
}

// 角色详情
export function getRoleDetail(role_id) {
  return request({
    url: PREFIX + '/' + role_id,
    method: 'get'
  })
}

// 修改角色信息
export function editRole(role_id, data) {
  return request({
    url: PREFIX + '/' + role_id,
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRole(role_id) {
  return request({
    url: PREFIX + '/' + role_id,
    method: 'delete'
  })
}

// 角色枚举列表
export function getRoleEnumList() {
  return request({
    url: PREFIX + '/enum',
    method: 'get'
  })
}

// 角色成员列表
export function getRoleMemberList(role_id) {
  return request({
    url: PREFIX + '/' + role_id + '/memberlist',
    method: 'get'
  })
}

// 角色添加用户
export function addUserToRole(user_id, role_id) {
  return request({
    url: PREFIX + '/' + role_id + '/memberlist',
    method: 'post',
    data: { user_id }
  })
}

// 角色踢除用户
export function removeUserfromRole(user_id, role_id) {
  return request({
    url: PREFIX + '/' + role_id + '/memberlist',
    method: 'delete',
    data: { user_id }
  })
}

// 角色资源列表
export function getRoleResourceList(role_id) {
  return request({
    url: PREFIX + '/' + role_id + '/resourcelist',
    method: 'get'
  })
}

// 角色添加资源
export function addResourceToRole(role_id, resource_id) {
  return request({
    url: PREFIX + '/' + role_id + '/resourcelist',
    method: 'post',
    data: { resource_id }
  })
}

// 角色踢除资源
export function removeResourcefromRole(role_id, resource_id) {
  return request({
    url: PREFIX + '/' + role_id + '/resourcelist',
    method: 'delete',
    data: { resource_id }
  })
}
