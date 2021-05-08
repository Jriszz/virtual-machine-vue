import request from '@/utils/request'

const PREFIX = '/cicd'

// 获取打包列表
export function getCompatibleList(params) {
  return request({
    url: PREFIX + '/ci/compatible-list',
    method: 'get',
    params
  })
}
