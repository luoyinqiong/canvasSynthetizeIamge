<template>
  <div>
    <div class="canvas_box" ref="img" >
      <img width="180" height="auto" :src="phoneImg" />
    </div>
    <!-- 颜色选择器进度条 end -->
    <div class="bottom-btn">
      <van-button size="large" round type="info" >加入购物车</van-button>
      <van-button size="large" round type="info" >加入定制库</van-button>
      <van-button size="large" round type="info" @click="saveImg">分享</van-button>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import Vue from 'vue'
import { Image as VanImage, Button } from 'vant'
Vue.use(VanImage)
Vue.use(Button)
export default {
  name: 'saveImg',
  data () {
    return {
      phoneImg: 'https://img01.yzcdn.cn/vant/cat.jpeg'
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    saveImg () {
      let realHtml = this.$refs.img
      var canvas = document.createElement('canvas') // 创建一个canvas节点
      var scale = 100 / (100 * window.devicePixelRatio) // 定义任意放大倍数 支持小数
      canvas.width = realHtml.offsetWidth // 定义canvas 宽度 * 缩放
      canvas.height = realHtml.offsetHeight // 定义canvas高度 *缩放
      canvas.getContext('2d').scale(scale, scale) // 获取context,设置scale
      html2canvas(realHtml, {
        allowTaint: true,
        tainttest: true, // 检测每张图片都已经加载完成
        scale: window.devicePixelRatio, // 添加的scale 参数
        useCORS: true,
        canvas: canvas, // 自定义 canvas
        // logging: true, // 日志开关
        width: realHtml.offsetWidth, // dom 原始宽度
        height: realHtml.offsetHeight, // dom 原始高度
        x: realHtml.offsetLeft + realHtml.offsetParent.offsetLeft,
        y: realHtml.offsetTop + realHtml.offsetParent.offsetTop
      }).then(canvas => {
        let imgUrl = canvas
          .toDataURL('image/' + '.jpg')
          .replace('image/' + '.jpg', 'image/octet-stream')
        if (window.navigator.msSaveOrOpenBlob) {
          var bstr = atob(imgUrl.split(',')[1])
          var n = bstr.length
          var u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          var blob = new Blob([u8arr])
          window.navigator.msSaveOrOpenBlob(blob, '二维码' + '.' + 'jpg')
        } else {
          // 这里就按照chrome等新版浏览器来处理
          var a = document.createElement('a')
          a.href = imgUrl
          a.setAttribute('download', '二维码.jpg')
          a.click()
        }
      })
    }
  }
}
</script>

<style scoped>
  .canvas_box {
    width: 180px;
    height: 320px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px auto 30px;
    /* overflow: hidden; */
  }
  .bottom-btn{
    width: 80%;
    margin: 40px auto;
  }
  .van-button  {
    margin-bottom: 30px;
  }
</style>
