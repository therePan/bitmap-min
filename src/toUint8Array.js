export default (base64) => {
  const data = window.atob(base64.split(',')[1])
  var cache = new Uint8Array(data.length)
  for (var i = 0; i < data.length; i++) {
    cache[i] = data.charCodeAt(i)
  }
  return cache
}
