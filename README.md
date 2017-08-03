# bitmap-min
基于canvas的轻量级浏览器端位图处理插件 (gif, png, jpeg)

```javascript
var bitmapMin = new BitmapMin({
  width: 1024,  // 最大宽度
  height: 1024, // 最大高度
  jpeg: false,  // 强制转为 jpeg|jpg
  quality: .92, // jpeg|jpg 图片的质量
})

bitmapMin.load(file_or_blob, function(base64, blob) {
  document.getElementById('test').src = base64
})
```
