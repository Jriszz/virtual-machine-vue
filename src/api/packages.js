import request from '@/utils/request'

const PREFIX = '/cicd'

// 参数枚举
export function getParamEnum() {
  return request({
    url: PREFIX + '/online/enum',
    method: 'get'
  })
}

// 获取打包列表
export function getPackageList() {
  return request({
    url: PREFIX + '/online/package',
    method: 'get'
  })
}

// 新增打包请求
export function addPackage(data) {
  return request({
    url: PREFIX + '/online/package',
    method: 'post',
    data
  })
}

// 获取打包详情
export function getPackageDetail(key) {
  return request({
    url: PREFIX + '/online/package/' + key,
    method: 'get'
  })
}

// 删除打包请求
export function removePackage(key) {
  return request({
    url: PREFIX + '/online/package/' + key,
    method: 'delete'
  })
}

// 获取打包服务列表
export function getServiceList() {
  return request({
    url: PREFIX + '/online/service',
    method: 'get'
  })
}

// 获取打包记录列表
export function getPackageRecordList(params) {
  return request({
    url: PREFIX + '/ci/package-list',
    method: 'get',
    params
  })
}

// 删除打包记录列表
export function deletePackageRecord(primary_id) {
  return request({
    url: PREFIX + '/ci/package-list/' + primary_id,
    method: 'delete'
  })
}

// 打包版本发布到gitea release
export function releasePackage(primary_id, data) {
  return request({
    url: PREFIX + '/ci/package-list/' + primary_id + '/release',
    method: 'post',
    data
  })
}

// 上传安装包到OSS
export function uploadOSS(primary_id, data) {
  return request({
    url: PREFIX + '/ci/package-list/' + primary_id + '/upload-oss',
    method: 'post',
    data
  })
}

// 下载OpenPGP公钥
export function downloadOpenPGPPublicKey() {
  return 'http://192.168.0.111/api/cicd/ci/openpgp-public-key'
}

// 获取安装包OpenPGP签名摘要
export function getPackageSignCheckFile(primary_id) {
  return 'http://192.168.0.111/api/cicd/ci/package-list/' + primary_id + '/sign'
}
