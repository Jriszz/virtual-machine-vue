import request from '@/utils/request'

const PREFIX = '/resource'

// 资源列表
export function getResourceList(params) {
  return request({
    url: PREFIX + '',
    method: 'get',
    params
  })
}

// 资源枚举
export function getResourceEnum() {
  return request({
    url: PREFIX + '/enum',
    method: 'get'
  })
}

// 资源添加
export function addResource(data) {
  return request({
    url: PREFIX + '',
    method: 'post',
    data
  })
}

// 资源详情
export function getResourceDetail(resource_id) {
  return request({
    url: PREFIX + '/' + resource_id,
    method: 'get'
  })
}

// 修改资源信息
export function editResource(resource_id, data) {
  return request({
    url: PREFIX + '/' + resource_id,
    method: 'put',
    data
  })
}

// 删除资源
export function deleteResource(resource_id) {
  return request({
    url: PREFIX + '/' + resource_id,
    method: 'delete'
  })
}

// 资源角色列表
export function getResourceRoleList(resource_id) {
  return request({
    url: PREFIX + '/' + resource_id + '/rolelist',
    method: 'get'
  })
}

// 角色添加资源
export function resourceJoinRole(resource_id, role_id) {
  return request({
    url: PREFIX + '/' + resource_id + '/rolelist',
    method: 'post',
    data: { role_id }
  })
}

// 角色踢除资源
export function resourceLeaveRole(resource_id, role_id) {
  return request({
    url: PREFIX + '/' + resource_id + '/rolelist',
    method: 'delete',
    data: { role_id }
  })
}

