import appCfg from "../../config/app"

export function tansformAvatarURL(index) {
  index=index||''
  let rt = '/static/images/empty.png'
  if (index.startsWith('http'))
    rt = index
  else {
    let item = appCfg.AVATAR.MAP.find(p => p.id == index)
    if (!!item)
      rt = '/static/images/' + item.file
  }
  return rt
}
export function tansformImageURL(url) {
  url=url||''
  let rt = '/static/images/empty.png'
  if (url.startsWith('http'))
    rt = url
  else {
    rt = '/static/images/' + url
  }
  return rt
}
export function host(url) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  const parts = host.split('.').slice(-3)
  if (parts[0] === 'www') parts.shift()
  return parts.join('.')
}

export function timeAgo(time) {
  time = time || 0
  const between = (Date.now() - Number(time)) / 1000
  if (between < 3600) {
    return pluralize(~~(between / 60), '分钟前')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), '小时前')
  } else if (between < (86400 * 30)) {
    return pluralize(~~(between / (86400)), '天前')
  } else if (between < (86400 * 30 * 365)) {
    return pluralize(~~(between / (86400 * 30)), '月前')
  } else {
    return pluralize(~~(between / (86400 * 30 * 365)), '年前')
  }
}

function pluralize(time, label) {
  // if (time === 1) {
  return time + label
  // }
  // return time + label + 's'
}
const digitsRE = /(\d{3})(?=\d)/g

export function currency(value, currency, decimals) {
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  currency = currency != null ? currency : '元'
  decimals = decimals != null ? decimals : 2
  var stringified = Math.abs(value).toFixed(decimals)
  var _int = decimals
    ? stringified.slice(0, -1 - decimals)
    : stringified
  var i = _int.length % 3
  var head = i > 0
    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
    : ''
  var _float = decimals
    ? stringified.slice(-1 - decimals)
    : ''
  var sign = value < 0 ? '-' : ''
  return sign + currency + head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float
}