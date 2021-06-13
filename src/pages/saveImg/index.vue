<template>
  <div>
    <div class="canvas_box">
      <van-image width="180" height="320" :src="phoneImg" />
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
import Vue from 'vue'
import { Image as VanImage, Button } from 'vant'
Vue.use(VanImage)
Vue.use(Button)
export default {
  name: 'saveImg',
  data () {
    return {
      phoneImg: 'https://oss.hz2030.com/2020/10/17/3b4df02f853d413fb62e326b68dc0c18.png'
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    saveImg () {
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
