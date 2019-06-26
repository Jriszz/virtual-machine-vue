import Cookies from 'js-cookie'

const TokenKey = 'SSO-TICKET'

export default TokenKey

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { domain: document.domain, path: '/' })
}

export function removeToken() {
  return Cookies.remove(TokenKey, { domain: document.domain, path: '/' })
}
