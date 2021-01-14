import request from '@/utils/request'

const PREFIX = '/ferrymen'

// 任务列表
export function getTaskList(params) {
  return request({
    url: PREFIX + '/task-list',
    method: 'get',
    params
  })
}

// 任务结果同步
export function taskSync(params) {
  return request({
    url: PREFIX + '/task/sync',
    method: 'get',
    params
  })
}

// 任务详情
export function getTaskDetail(id) {
  return request({
    url: PREFIX + '/task/' + id,
    method: 'get'
  })
}

// 任务删除
export function deleteTask(id) {
  return request({
    url: PREFIX + '/task/' + id,
    method: 'delete'
  })
}

// 任务日志
export function taskLog(params) {
  return request({
    url: PREFIX + '/task/log',
    method: 'get',
    params
  })
}

// 任务重启
export function taskRestart(data) {
  return request({
    url: PREFIX + '/task/restart',
    method: 'post',
    data
  })
}

// 任务用例执行记录
export function taskRecords(primary_id) {
  return request({
    url: PREFIX + '/task/' + primary_id + '/record-list',
    method: 'get'
  })
}

// 任务用例执行记录列表
export function getRecordList(params) {
  return request({
    url: PREFIX + '/case-record-list',
    method: 'get',
    params
  })
}

// 任务错误列表
export function getErrorList(params) {
  return request({
    url: PREFIX + '/error-record',
    method: 'get',
    params
  })
}

// 更新错误
export function updateError(primary_id, data) {
  return request({
    url: PREFIX + '/error-record/' + primary_id + '/update',
    method: 'post',
    data
  })
}
