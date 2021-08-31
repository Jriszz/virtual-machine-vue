import request from '@/utils/request2'

const PREFIX = '/cd'
// const PREFIX = ''

export function machine_info(req_params = null) {
  const request_obj = request({
    url: PREFIX + '/cd/machine-info',
    method: 'get',
    params: req_params
  })

  return request_obj
}

export function machine_take(req_params = null) {
  const request_obj = request({
    url: PREFIX + '/cd/machine-take',
    method: 'get',
    params: req_params
  })

  return request_obj
}

export function get_app(req_params = null) {
  const request_obj = request({
    url: PREFIX + '/cd/machine-take',
    method: 'post',
    data: req_params
  })

  return request_obj
}

export function app_start(req_params = null) {
  const request_obj = request({
    url: PREFIX + '/cd/app-start',
    method: 'get',
    params: req_params
  })

  return request_obj
}

export function app_run(req_params = null) {
  const request_obj = request({
    url: PREFIX + '/cd/app-start',
    method: 'post',
    data: req_params
  })

  return request_obj
}

export function connect_service(req_params = null) {
  const request_obj = request({
    url: PREFIX + '/cd/connect-service',
    method: 'get',
    params: req_params
  })

  return request_obj
}
export function modify_ip(req_params = null) {
  const request_obj = request({
    url: PREFIX + '/cd/modify-ip',
    method: 'get',
    params: req_params
  })

  return request_obj
}
