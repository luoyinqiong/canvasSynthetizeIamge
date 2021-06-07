<template>
  <div>
    <div class="canvas" :class="!isChangeImg ? 'is_hidden_border':''">
      <canvas id="canvas" width="180" height="300"></canvas>
      <van-image :class="['phone_bg', isChangeImg ? 'phone_bg_opacity':'']" width="180" height="300" :src="phoneImg" />
      <van-image :class="['aad_phone_img', isChangeImg ? 'is_opacity':'']" :width="imgWidth" :height="imgHeight" :src="imgSrc"/>
    </div>
    <!-- <van-image :width="imgWidth" :height="imgHeight" :src="changeimg"/> -->
    <div class="select_img_box">
      <van-uploader :after-read="afterRead">
        <div class="upload_button">
          <van-icon name="photo-o" size="25" />
          <span class="text">上传图片</span>
        </div>
      </van-uploader>
      <van-image class="img_list" width="80" height="140" :src="imgSrc"/>
    </div>
    <div class="bottom-btn">
      <van-button size="large" round type="info" @click="next">下一步</van-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Image as VanImage, Uploader, Icon, Button } from 'vant'
Vue.use(VanImage)
Vue.use(Uploader)
Vue.use(Icon)
Vue.use(Button)
export default {
  name: 'selectPhoto',
  data () {
    return {
      imgWidth: 200,
      imgHeight: 320,
      // 手机型号图片
      phoneImg: 'https://oss.hz2030.com/2020/10/17/3b4df02f853d413fb62e326b68dc0c18.png',
      // 用户选择中图片
      imgSrc: 'https://www.hz2030.com/userPicures/TOB20200806-RQMY6ZKL.jpeg',
      canvas: '',
      ctx: '',
      arr: '',
      // 是否在修改图片
      isChangeImg: false,
      changeimg: ''
    }
  },
  methods: {
    afterRead (file) {
      // 此时可以自行将文件上传至服务器
      console.log(file)
    },
    next () {
      this.canvas = document.getElementById('canvas')
      this.ctx = this.canvas.getContext('2d')
      this.arr = []
      this.getImageData(this.phoneImg).then(res => {
        this.getImageData(this.imgSrc).then(res => {
          this.make()
          // 合成canvas图片
          this.changeimg = this.canvas.toDataURL('image/png')
        })
      })
    },
    // 获取图片信息
    getImageData (src) {
      var that = this
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.crossOrigin = ''
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        img.src = src
        img.onload = function () {
          canvas.width = this.width
          canvas.height = this.height
          /**
           * drawImage(img,sx,sy,swidth,sheight,x,y,width,height) 画布上面绘制图片
           * sx 开始剪切的 x 坐标位置
           * sy 开始剪切的 y 坐标位置
           * swidth 被剪切图像的宽度
           * sheight 被剪切图像的高度
           * x 在画布上放置图像的 x 坐标位置
           * y 在画布上放置图像的 y 坐标位置
           * width 要使用的图像的宽度
           * height 要使用的图像的高度
          */
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height, 0, 0, 180, 300)
          /**
           * getImageData 复制画布上指定矩形的像素数据，然后通过 putImageData() 将图像数据放回画布
           * getImageData(x,y,width,height)
           * x 开始复制的左上角位置的 x 坐标
           * y 开始复制的左上角位置的 y 坐标
           * width 将要复制的矩形区域的宽度
           * height 将要复制的矩形区域的高度
          */
          that.arr.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
          resolve()
        }
      })
    },
    // 合成图片
    make () {
      let target = this.arr[0]
      let add = this.arr[1]
      for (let i = 0; i < target.height; i++) {
        for (let j = 0; j < target.width; j++) {
          var index = i * target.width * 4 + j * 4
          var r = target.data[index + 0]
          var g = target.data[index + 1]
          var b = target.data[index + 2]
          var a = target.data[index + 3]
          if (a < 255) {
            let index1 = (i - 0) * add.width * 4 + (j - 0) * 4
            if (add.data[index1]) {
              if (a === 0) {
                target.data[index] = add.data[index1]
                target.data[index + 1] = add.data[index1 + 1]
                target.data[index + 2] = add.data[index1 + 2]
                target.data[index + 3] = 255
              } else {
                let ratio = a / 255
                target.data[index] = ratio * r + (1 - ratio) * add.data[index1]
                target.data[index + 1] = ratio * g + (1 - ratio) * add.data[index1 + 1]
                target.data[index + 2] = ratio * b + (1 - ratio) * add.data[index1 + 2]
                target.data[index + 3] = 255
              }
            } else {
              break
            }
          }
          continue
        }
      }
      this.ctx.putImageData(target, 0, 0)
    }
  }
}
</script>

<style scoped>
  .canvas {
    width: 180px;
    height: 300px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px auto 50px;
  }
  .is_hidden_border{
    overflow: hidden;
  }
  .phone_bg {
    position: absolute;
    margin: auto;
    z-index: 9;
  }
  .aad_phone_img {
    position: absolute;
    margin: auto;
    opacity: 1;
    z-index: 2;
  }
  .is_opacity {
    opacity: 0.5;
    z-index: 10;
  }
  .phone_bg_opacity{
    z-index: 2;
  }
  .select_img_box {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0 10px;
  }
  .img_list{
    margin-right: 10px;
  }
  .van-image__img{
    border-radius: 8px;
  }
  .upload_button{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 140px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 8px;
    color: #fff;
    margin-right: 10px;
  }
  .text{
    font-size: 14px;
    margin-top: 10px;
  }
  .bottom-btn{
    width: 90%;
    position: absolute;
    bottom: 3%;
    left: 5%;
  }
</style>
