import request from '@/utils/request'

const PREFIX = '/ferrymen'

// 统计报表——按流程
export function getReortByFlow(params) {
  return request({
    url: PREFIX + '/report/by-flow',
    method: 'get',
    params
  })
}

// 统计报表——按日期
export function getReortByDate(params) {
  return request({
    url: PREFIX + '/report/by-date',
    method: 'get',
    params
  })
}

// 统计报表——按应用
export function getReortByApp(params) {
  return request({
    url: PREFIX + '/report/by-app',
    method: 'get',
    params
  })
}

// 统计报表——按版本
export function getReortByVersion(params) {
  return request({
    url: PREFIX + '/report/by-version',
    method: 'get',
    params
  })
}

// 统计报表——按操作系统
export function getReortByOS(params) {
  return request({
    url: PREFIX + '/report/by-os',
    method: 'get',
    params
  })
}
