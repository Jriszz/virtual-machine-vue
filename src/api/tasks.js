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
