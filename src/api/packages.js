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

// 获取打包服务列表
export function getServiceList() {
  return request({
    url: PREFIX + '/service',
    method: 'get'
  })
}

// 获取打包记录列表
export function getPackageRecordList(params) {
  return request({
    url: '/ferrymen/package-record-list',
    method: 'get',
    params
  })
}

// 删除打包记录列表
export function deletePackageRecord(primary_id) {
  return request({
    url: '/ferrymen/package-record/' + primary_id,
    method: 'delete'
  })
}

// 打包版本发布到gitea release
export function releasePackage(primary_id, data) {
  return request({
    url: '/ferrymen/package-record/' + primary_id + '/release',
    method: 'post',
    data
  })
}

// 上传安装包到OSS
export function uploadOSS(primary_id) {
  return request({
    url: '/ferrymen/package-record/' + primary_id + '/upload-oss',
    method: 'post'
  })
}
