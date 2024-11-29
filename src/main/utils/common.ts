// 格式化时间戳
export function formatTimestamp(timestamp) {
  // 创建一个Date对象
  const date = new Date(timestamp)

  // 获取年份（四位数）
  const year = date.getFullYear()

  // 获取月份（两位数，01-12）
  const month = String(date.getMonth() + 1).padStart(2, '0')

  // 获取日期（两位数，01-31）
  const day = String(date.getDate()).padStart(2, '0')

  // 获取小时（两位数，00-23）
  const hours = String(date.getHours()).padStart(2, '0')

  // 获取分钟（两位数，00-59）
  const minutes = String(date.getMinutes()).padStart(2, '0')

  // 获取秒数（两位数，00-59）
  const seconds = String(date.getSeconds()).padStart(2, '0')

  // 返回格式化后的字符串
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
