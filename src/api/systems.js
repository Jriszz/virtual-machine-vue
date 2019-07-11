import request from '@/utils/request'

const PREFIX = '/system'

// 站点列表
export function getSystemList(params) {
  return request({
    url: PREFIX + '',
    method: 'get',
    params
  })
}

// 站点添加
export function addSystem(data) {
  return request({
    url: PREFIX + '',
    method: 'post',
    data
  })
}

// 站点详情
export function getSystemDetail(system_id) {
  return request({
    url: PREFIX + '/' + system_id,
    method: 'get'
  })
}

// 修改站点信息
export function editSystem(system_id, data) {
  return request({
    url: PREFIX + '/' + system_id,
    method: 'put',
    data
  })
}

// 禁用站点
export function deleteSystem(system_id) {
  return request({
    url: PREFIX + '/' + system_id,
    method: 'delete'
  })
}

// 启用站点
export function enableSystem(system_id) {
  return request({
    url: PREFIX + '/' + system_id,
    method: 'post'
  })
}
