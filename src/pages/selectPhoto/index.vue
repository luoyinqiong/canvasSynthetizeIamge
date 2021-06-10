<template>
  <div>
    <div class="canvas_box">
      <canvas id="canvas" ref="canvasImg" :width="pageWidth" height="350"></canvas>
      <!-- 手机壳模板图片 -->
      <img ref="phoneShellTemplate" class="phone_shell_template" :width="imgWidth" :height="imgHeight" :src="phoneImg"/>
      <!-- 缓存选中制作图片 -->
      <img ref="selectImg" class="select_img" :width="selectImgWidth" :src="selectImgs"/>
    </div>
    <!-- 选择图片 start -->
    <template v-if="!pageProgress">
      <div class="select_img_box">
        <div class="upload_button" @click="popupState = true">
          <van-icon name="photograph" size="25" />
          <span class="text">上传图片</span>
        </div>
        <van-image class="img_list" width="80" height="140" src="https://www.hz2030.com/userPicures/TOB20200806-RQMY6ZKL.jpeg" @click="selectImg"/>
      </div>
      <van-popup overlay-class="popup" v-model="popupState" position="bottom">
        <van-uploader capture="camera" :after-read="afterRead">
          <p>拍照</p>
        </van-uploader>
        <van-uploader :after-read="afterRead">
          <p>从手机相册选择</p>
        </van-uploader>
        <p @click="popupState = false">取消</p>
      </van-popup>
    </template>
    <!-- 选择图片 end -->
    <!-- 颜色选择器进度条 start -->
    <div class="color_font_select" v-if="pageProgress">
      <Slider v-model="colors" :showDetails="false" />
      <div class="font_slider">
        <span v-for="item in 10" :key="item">文字{{item}}</span>
      </div>
    </div>
    <!-- 颜色选择器进度条 end -->
    <div class="bottom-btn">
      <van-button size="large" round type="info" @click="next">下一步</van-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Canvas from './../../utils/canvasEL'
import Slider from './../../components/vue-color/Slider.vue'
import { Image as VanImage, Uploader, Icon, Button, Popup } from 'vant'
Vue.use(VanImage)
Vue.use(Uploader)
Vue.use(Icon)
Vue.use(Button)
Vue.use(Popup)
export default {
  name: 'selectPhoto',
  components: {
    Slider
  },
  data () {
    return {
      // 手机壳模型宽度、高度、手机型号图片
      imgWidth: 180,
      imgHeight: 320,
      phoneImg: 'https://oss.hz2030.com/2020/10/17/3b4df02f853d413fb62e326b68dc0c18.png',
      // 页面宽度
      pageWidth: document.body.clientWidth,
      // 用户选择中图片、图片宽度
      selectImgs: '',
      selectImgWidth: 180,
      // 弹窗状态
      popupState: false,
      pageProgress: false,
      colors: '#194d33'
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
      this.$nextTick(() => {
        this.drawCanvas()
      })
    },
    drawCanvas () {
      const that = this
      console.log('this.$refs.canvasImg', that.$refs.canvasImg)
      // 读取手机壳模板图片参数
      const phoneBgObj = that.$refs.phoneShellTemplate
      // console.log('phoneBgObj====', that.$refs.phoneShellTemplate)
      // 模板距离视图左边距离、顶部距离，原始宽度，原始高度
      // const templateLeft = phoneBgObj.getBoundingClientRect().left
      // const templateTop = phoneBgObj.getBoundingClientRect().top
      const templateWidth = phoneBgObj.naturalWidth
      const templateHeight = phoneBgObj.naturalHeight
      // 读取制作图片参数
      const selectImgObj = that.$refs.selectImg
      // console.log('selectImgObj===', selectImgObj)
      // 制作图片原始宽度、原始高度
      const selectImgWidth = selectImgObj.naturalWidth
      const selectImgHeight = selectImgObj.naturalHeight
      // 计算制作图片宽高
      // 获取模板图片的实际宽度
      const templateScrollWidth = phoneBgObj.scrollWidth
      const templateScrollHeight = templateHeight / (templateWidth / templateScrollWidth)
      const scale = (selectImgWidth / templateScrollWidth) > (selectImgHeight / templateScrollHeight) ? (selectImgHeight / templateScrollHeight) : (selectImgWidth / templateScrollWidth)
      const adImgWidth = parseInt(selectImgWidth / scale)
      that.selectImgWidth = adImgWidth
      // console.log('that.selectImgWidth===', that.selectImgWidth)
      const canvas = new Canvas.Element()
      console.log('Canvas====', canvas)
    },
    // 下一步
    next () {
      console.log('下一步')
      this.pageProgress = !this.pageProgress
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
  /* 手机壳样式 */
  .phone_shell_template {
    position: absolute;
    margin: auto;
    z-index: 9;
  }
  /* 缓存选择图片 */
  .select_img {
    position: absolute;
    top: -9999px;
    left: -9999px;
    height: auto;
  }
  /* 图片列表 */
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
  /* 上传图片 */
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
    font-size: 12px;
    margin-top: 5px;
  }
  .van-popup--bottom {
    height: '30%';
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .van-popup--bottom p{
    margin: 0;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #1b1b1b;
    border-top: 1px solid #ebedf0;
  }
  /deep/ .van-uploader__wrapper{
    display: block !important;
  }
  .font_slider{
    display: flex;
    flex-direction: row;
    flex-flow: row;
    overflow-x: auto;
  }
  .font_slider span{
    flex:none;
    padding: 0 30px;
  }
  .bottom-btn{
    width: 90%;
    margin: 30px auto 0;
  }
</style>
