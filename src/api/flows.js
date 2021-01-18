import request from '@/utils/request'

const PREFIX = '/ferrymen'

// 所有流程最新版本列表
export function getFlowList(params) {
  return request({
    url: PREFIX + '/flow-list',
    method: 'get',
    params
  })
}

// 删除流程
export function deleteFlow(id) {
  return request({
    url: PREFIX + '/flow-list/' + id,
    method: 'delete'
  })
}

// 具体某一流程的版本列表
export function getFlowVersionList(params) {
  return request({
    url: PREFIX + '/flow/version',
    method: 'get',
    params
  })
}

// 流程及任务概要列表
export function getFlowTaskSummaryList() {
  return request({
    url: PREFIX + '/flow-task-summary',
    method: 'get'
  })
}

// 在线Worker列表
export function onlineWorkerList() {
  return request({
    url: PREFIX + '/worker-list',
    method: 'get'
  })
}

// 创建任务
export function createTaskByFlow(data) {
  return request({
    url: PREFIX + '/flow/create-task',
    method: 'post',
    data
  })
}

// 获取计划列表
export function getPlanStatus() {
  return request({
    url: PREFIX + '/plan/status-switch',
    method: 'get'
  })
}

// 切换计划列表
export function switchPlanStatus(data) {
  return request({
    url: PREFIX + '/plan/status-switch',
    method: 'post',
    data
  })
}
