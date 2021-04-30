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
  data['secret'] = 'aead5f0b9a1bf24b62036bbe16daabcd'
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

// 切换打包服务起用状态
export function switchServiceStatus(data) {
  return request({
    url: PREFIX + '/online/service/switch',
    method: 'post',
    data
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

// 获取打包请求预置版本列表
export function getPackageRequestList() {
  return request({
    url: PREFIX + '/ci/package-request-list',
    method: 'get'
  })
}

// 新增打包请求预置版本
export function addPackageRequest(data) {
  return request({
    url: PREFIX + '/ci/package-request-list',
    method: 'post',
    data
  })
}

// 获取打包请求预置版本详情
export function getPackageRequest(id) {
  return request({
    url: PREFIX + '/ci/package-request-list/' + id,
    method: 'get'
  })
}

// 更新打包请求预置版本
export function updatePackageRequest(id, data) {
  return request({
    url: PREFIX + '/ci/package-request-list/' + id,
    method: 'put',
    data
  })
}

// 删除打包请求预置版本
export function deletePackageRequest(id) {
  return request({
    url: PREFIX + '/ci/package-request-list/' + id,
    method: 'delete'
  })
}

// 将当前版本设置为默认
export function setDefault(id) {
  return request({
    url: PREFIX + '/ci/set-default/' + id,
    method: 'post'
  })
}

// 创建补丁
export function createPatch(data) {
  return request({
    url: PREFIX + '/ci/create-patch',
    method: 'post',
    data
  })
}
