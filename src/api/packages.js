import request from '@/utils/request'

const PREFIX = '/package'

// 参数枚举
export function getParamEnum() {
  return request({
    url: PREFIX + '/enum',
    method: 'get'
  })
}

// 获取打包列表
export function getPackageList() {
  return request({
    url: PREFIX + '/package',
    method: 'get'
  })
}

// 新增打包请求
export function addPackage(data) {
  return request({
    url: PREFIX + '/package',
    method: 'post',
    data
  })
}

// 获取打包详情
export function getPackageDetail(key) {
  return request({
    url: PREFIX + '/package/' + key,
    method: 'get'
  })
}

// 删除打包请求
export function removePackage(key) {
  return request({
    url: PREFIX + '/package/' + key,
    method: 'delete'
  })
}
