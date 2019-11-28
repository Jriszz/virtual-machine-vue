import request from '@/utils/request'

const PREFIX = '/stat'

// 按用户统计调用日志
export function statByUser(params) {
  return request({
    url: PREFIX + '/by-user',
    method: 'get',
    params
  })
}

// 按接口统计调用日志
export function statByInterface(params) {
  return request({
    url: PREFIX + '/by-interface',
    method: 'get',
    params
  })
}

// 按访问日期统计调用日志
export function statByDate(params) {
  return request({
    url: PREFIX + '/by-date',
    method: 'get',
    params
  })
}

// 按站点统计调用日志
export function statBySite(params) {
  return request({
    url: PREFIX + '/by-site',
    method: 'get',
    params
  })
}

// 按状态统计调用日志
export function statByStatus(params) {
  return request({
    url: PREFIX + '/by-status',
    method: 'get',
    params
  })
}
