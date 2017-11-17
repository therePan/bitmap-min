import getOrientation from './getOrientation'
import toUint8Array from './toUint8Array'

class BitmapMin {
  static defaultOptions = {
    width: 1024,
    height: 1024,
    proportional: false,
    jpeg: false,
    quality: .92,
  }

  constructor(options = {}) {
    this._options = {
      ...this.constructor.defaultOptions,
      ...options,
    }
    this._ctx = document.createElement('canvas').getContext('2d')
    this._img = document.createElement('img')
  }

  load = (file, callback) => {
    const reader = new FileReader()
    getOrientation(file, (orientation, xBlob) => {
      reader.onload = (ev) => {
        this._img.onload = (ev) => {
          const { naturalWidth, naturalHeight } = ev.target

          const [oWidth, oHeight] = this._outSize(naturalWidth, naturalHeight)

          this._begin(orientation, oWidth, oHeight)
          this._ctx.drawImage(
            this._img,
            0, 0, naturalWidth, naturalHeight,
            0, 0, oWidth, oHeight,
          )

          const imageType = this._options.jpeg ? 'image/jpeg' : file.type
          const base64 = this._ctx.canvas.toDataURL(imageType, this._options.quality)
          var blob = new Blob([toUint8Array(base64)], {
            type: imageType,
            endings: 'transparent',
          })

          callback(base64, blob)
        }
        this._img.src = ev.target.result
      }
      reader.readAsDataURL(xBlob || file)
    })
  }

  _begin = (orientation = 1, width, height) => {
    const ctx = this._ctx
    const canvas = ctx.canvas

    if (orientation > 4) {
      canvas.width = height
      canvas.height = width
    } else  {
      canvas.width = width
      canvas.height = height
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    switch (orientation) {
      case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
      case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
      case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
      case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
      case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
      case 7: ctx.transform(0, -1, -1, 0, height, width); break;
      case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
      default: ctx.transform(1, 0, 0, 1, 0, 0);
    }
  }

  _outSize = (width, height) => {
    const MAX_WIDTH = this._options.width
    const MAX_HEIGHT = this._options.height
    let oWidth, oHeight
    if (width / MAX_WIDTH > height / MAX_HEIGHT) {
      if (width > MAX_WIDTH) {
        oWidth = MAX_WIDTH
        oHeight = MAX_WIDTH / width * height
      }
    } else {
      if (height > MAX_HEIGHT) {
        oWidth = MAX_HEIGHT / height * width
        oHeight = MAX_HEIGHT
      }
    }
    return [oWidth || width, oHeight || height]
  }
}

export default BitmapMin
