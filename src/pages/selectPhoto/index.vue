<template>
  <div>
    <div class="canvas_area" id="canvas_area">
      <div id="cover" class="template"></div>
      <canvas id="canvas" width="750" height="350"></canvas>
      <!-- <van-image id="template" class="phone_bg" width="180" height="300" :src="phoneImg" /> -->
      <img id="template" class="phone_bg" :width="imgWidth" :height="imgHeight" :src="phoneImg"/>
    </div>
    <img id="oImg" :width="imgWidth" :height="imgHeight" :src="selectImgs"/>
    <div class="select_img_box">
      <van-uploader :after-read="afterRead">
        <div class="upload_button">
          <van-icon name="photo-o" size="25" />
          <span class="text">上传图片</span>
        </div>
      </van-uploader>
      <van-image class="img_list" width="80" height="140" src="https://www.hz2030.com/userPicures/TOB20200806-RQMY6ZKL.jpeg" @click="selectImg"/>
    </div>
    <div class="bottom-btn">
      <van-button size="large" round type="info">下一步</van-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import YAHOO from './utilitie'
import Canvas from './canvasEl'
import { Image as VanImage, Uploader, Icon, Button } from 'vant'
Vue.use(VanImage)
Vue.use(Uploader)
Vue.use(Icon)
Vue.use(Button)
export default {
  name: 'selectPhoto',
  data () {
    return {
      imgWidth: 180,
      imgHeight: 320,
      // 手机型号图片
      phoneImg: 'https://oss.hz2030.com/2020/10/17/3b4df02f853d413fb62e326b68dc0c18.png',
      // 用户选择中图片
      selectImgs: '',
      canvas: ''
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    afterRead (file) {
      console.log(file)
    },
    // 选择图片
    selectImg () {
      this.selectImgs = 'https://www.hz2030.com/userPicures/TOB20200806-RQMY6ZKL.jpeg'
      this.drawCanvas()
    },
    /**
     * 绘制图片
     */
    drawCanvas () {
      let imageId = 'oImg'

      // 如果此容器已经存在则删除
      if (YAHOO.util.Dom.inDocument('canvas-canvas-container')) {
        var canvasArea = document.getElementById('canvas_area')
        canvasArea.innerHTML = this.canvasHtml()
      }

      // 读取模板图片参数
      var templateObj = document.getElementById('template')
      console.log('templateObj====', templateObj)
      var tLeft = templateObj.offsetLeft // 获取开模图顶部x坐标
      var tTop = templateObj.offsetTop // 获取开模图顶部y坐标
      var tWidth = templateObj.naturalWidth // 获取开模图宽度
      var tHeight = templateObj.naturalHeight // 获取开模图高度

      // 读取制作图片参数
      var oImgObj = document.getElementById(imageId)
      var oWidth = oImgObj.naturalWidth
      var oHeight = oImgObj.naturalHeight

      // 读取制作区域参数
      var canvasAreaObj = document.getElementById('canvas_area')
      var aLeft = canvasAreaObj.offsetLeft // 获取canvas区域顶部x坐标
      var aTop = canvasAreaObj.offsetTop // 获取canvas区域顶部y坐标
      var aWidth = canvasAreaObj.clientWidth
      var aHeight = canvasAreaObj.clientHeight
      // 计算制作图片宽高
      var imgWidth = templateObj.scrollWidth // 计算误差
      var imgHeight = tHeight / (tWidth / imgWidth)
      var scale = (oWidth / imgWidth) > (oHeight / imgHeight) ? (oHeight / imgHeight) : (oWidth / imgWidth)
      var adImgWidth = parseInt(oWidth / scale)
      var adImgHeight = parseInt(oHeight / scale)

      // 设置制作图大小
      oImgObj.width = adImgWidth
      oImgObj.height = adImgHeight

      // 计算掩盖层参数
      var coverBorderLeft = tLeft - aLeft
      var coverBorderTop = tTop - aTop
      var coverWidth = imgWidth
      var coverHeight = imgHeight
      var coverBorderRight = aWidth - coverBorderLeft - coverWidth
      var coverBorderBottom = aHeight - coverBorderTop - coverHeight

      // 设置掩盖层参数
      var coverObj = document.getElementById('cover')
      coverObj.style.width = coverWidth + 'px'
      coverObj.style.height = coverHeight + 'px'
      coverObj.style.borderTop = coverBorderTop + 'px solid #ebebeb'
      coverObj.style.borderLeft = coverBorderLeft + 'px solid #ebebeb'
      coverObj.style.borderRight = coverBorderRight + 'px solid #ebebeb'
      coverObj.style.borderBottom = coverBorderBottom + 'px solid #ebebeb'

      // 制图开始
      this.canvas = new Canvas.Element()
      this.canvas._aImages = null
      this.canvas.init('canvas', {
        width: 750,
        height: 350,
        x: tLeft,
        y: tTop
      })
      let oImg = new Canvas.Img(imageId, {
        // left图片需左右居中，向左移动 = (adImgWidth - imgWidth) / 2
        angle: 0,
        top: tTop - ((adImgHeight - imgHeight) / 2),
        left: tLeft - ((adImgWidth - imgWidth) / 2),
        border: 0
      })
      this.canvas.addImage(oImg) // 绘制图片
      this.canvas._aImages[0].setCornersVisibility(false) // 选中四角

      // 修改开模状态
      this.canvas.renderAll(false)
    },
    // 初始化html
    canvasHtml () {
      let templateSrc = 'https://oss.hz2030.com/2020/10/17/3b4df02f853d413fb62e326b68dc0c18.png'
      var html = '<div id="cover" class="template"></div>' +
          '<img src="' + templateSrc + '" id="template" width="300"/>' +
          '<canvas id="canvas"></canvas>'
      return html
    }
  }
}
</script>

<style scoped>
  .canvas_area {
    width: 180px;
    height: 300px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px auto 50px;
  }
  canvas {
    position: absolute;
    opacity: 0.5;
    z-index: 3;
  }
  .phone_bg {
    position: absolute;
    margin: auto;
    z-index: 9;
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
  #oImg {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
</style>
