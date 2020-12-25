import request from '@/utils/request2'

export function environ_info(req_params) {
  const request_obj = request({
    url: '/environ-config',
    method: 'get',
    params: req_params
  })

  return request_obj
}

export function new_environ_info(params) {
  let request_params = ''
  request_params = { 'ip_address': params['ip_address'], 'app_name': params['app_name'], 'environ_name': params['environ_name'], 'version_bit': params['version_bit'], 'app_path': params['app_path'] }

  const request_obj = request({
    url: '/environ-config',
    method: 'post',
    data: request_params
  })

  return request_obj
}

export function put_environ_info(params) {
  const request_params = { 'environ_id': params['environ_id'], 'ip_address': params['ip_address'], 'app_name': params['app_name'], 'environ_name': params['environ_name'], 'version_bit': params['version_bit'], 'app_path': params['app_path'] }
  console.log(request_params)

  const request_obj = request({
    url: '/environ-config',
    method: 'put',
    data: request_params
  })

  return request_obj
}

export function remove_environ_info(params) {
  let request_params = ''
  request_params = { 'environ_id': params['environ_id'], 'ip_address': params['ip_address'], 'app_name': params['app_name'], 'version_bit': params['version_bit'] }

  const request_obj = request({
    url: '/environ-config',
    method: 'delete',
    data: request_params
  })

  return request_obj
}

export function refresh_worker(params) {
  let request_params = ''
  console.log(params)
  request_params = { 'ip_address': params['ip_address'] }

  const request_obj = request({
    url: '/refresh-worker',
    method: 'get',
    params: request_params
  })

  return request_obj
}
