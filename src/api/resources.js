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

