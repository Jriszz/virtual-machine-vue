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

