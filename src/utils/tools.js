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

export default {
  cleanObjNullProperty,
  objectToFormData,
  getCookie,
  dateToStr,
  getQueryString
}
