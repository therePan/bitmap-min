// https://stackoverflow.com/questions/7584794/accessing-jpeg-exif-rotation-data-in-javascript-on-the-client-side
export default (file) => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const view = new DataView((e.target).result)
      if (view.getUint16(0, false) !== 0xFFD8) {
        return resolve(-2)
      }
      let length = view.byteLength
      let offset = 2
      while (offset < length) {
        const marker = view.getUint16(offset, false)
        offset += 2
        if (marker === 0xFFE1) {
          let tmp = view.getUint32(offset += 2, false)
          if (tmp !== 0x45786966) {
            return resolve(-1)
          }
          let little = view.getUint16(offset += 6, false) === 0x4949
          offset += view.getUint32(offset + 4, little)
          let tags = view.getUint16(offset, little)
          offset += 2
          for (let i = 0; i < tags; i++) {
            if (view.getUint16(offset + (i * 12), little) === 0x0112) {
              // 骚东西
              const orientation = view.getUint16(offset + (i * 12) + 8, little)
              view.setUint16(offset + (i * 12) + 8, 1, little)
              const xBlob = new Blob([view.buffer])
              return resolve(orientation, xBlob)
            }
          }
        } else if ((marker & 0xFF00) !== 0xFF00) {
          break
        } else {
          offset += view.getUint16(offset, false)
        }
      }
      return resolve(-1)
    }
    reader.readAsArrayBuffer(file)
  })
}
