const process1 = require('child_process')
// 去除对象中属性值为空的属性
function cleanObjNullProperty(myObj) {
  const newObj = {}
  for (const key in myObj) {
    try {
      if (myObj[key] === null || typeof myObj[key] === undefined || (typeof myObj[key] === 'string' && myObj[key].length === 0)) {
        continue
      } else if (myObj[key] instanceof Array) {
        newObj[key] = myObj[key].join(',')
      } else {
        newObj[key] = myObj[key]
      }
    } catch (err) {
      console.log(err)
      console.log('key=' + key + ', value=' + myObj[key])
    }
  }
  return newObj
}

// 将参数对象转换成FormData表单对象
function objectToFormData(object) {
  const formData = new FormData()
  object = cleanObjNullProperty(object)
  for (const key in object) {
    formData.append(key, object[key])
  }
  return formData
}

// 读取本地cookie
function getCookie(cname) {
  const name = cname + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    var c = ca[i].trim()
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

// date转YYYY-MM-DD
function dateToStr(date) {
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  return y + '-' + m + '-' + d
}

// 从url中提取查询字符串参数
function getQueryString(name) {
  const reg = new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)', 'i')
  const res = window.location.href.match(reg)
  if (res != null) {
    return unescape(res[2])
  }
  return null
}

// JSON转换成csv下载
function JSONToCSVConvertor(obj) {
  /*
  * 参数 data 是导出的数据
  * 参数 title 是导出的标题
  * showLabel 表示是否显示表头 默认显示
  */
  const JSONData = obj['data']
  const ShowLabel = typeof obj['showLabel'] === 'undefined' ? true : obj['showLabel']
  const ReportTitle = obj['title']
  const arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData
  let CSV = ''
  if (ShowLabel) {
    let row = ''
    for (const index in arrData[0]) {
      row += index + ','
    }
    row = row.slice(0, -1)
    CSV += row + '\r\n'
  }
  for (let i = 0; i < arrData.length; i++) {
    let row = ''
    for (const index in arrData[i]) {
      row += '"' + arrData[i][index] + '",'
    }
    row.slice(0, row.length - 1)
    CSV += row + '\r\n'
  }
  if (CSV === '') {
    console.error()
    return
  }
  const link = document.createElement('a')
  link.id = 'lnkDwnldLnk'
  document.body.appendChild(link)
  const csv = CSV
  const csvUrl = _getDownloadUrl(csv)
  let filename = ReportTitle || 'UserExport'
  filename = filename + '.csv'
  const linkDom = document.getElementById('lnkDwnldLnk')
  linkDom.setAttribute('download', filename)
  linkDom.setAttribute('href', csvUrl)
  linkDom.click()
  document.body.removeChild(link)
}

function _getDownloadUrl(text) {
  const BOM = '\uFEFF'
  if (window.Blob && window.URL && window.URL.createObjectURL) {
    const csvData = new Blob([BOM + text], {
      type: 'text/csv'
    })
    return URL.createObjectURL(csvData)
  } else {
    return 'data:attachment/csv;charset=utf-8,' + BOM + encodeURIComponent(text)
  }
}
export function execCommander(cmd) {
  process1.exec(cmd, function(error, stdout, stderr) {
    console.log('error:' + error)
    console.log('stdout:' + stdout)
    console.log('stderr:' + stderr)
  })
}

export default {
  cleanObjNullProperty,
  objectToFormData,
  getCookie,
  dateToStr,
  JSONToCSVConvertor,
  getQueryString
}
