<template>
  <div class="cate-container">
    <div :class="['cate-box', selectCate === 1?'cate-selected':'']" @click="changeCate(1)">
      <img src="/static/images/blue80.png" alt="">
      <p>贴皮款手机壳</p>
    </div>
    <div :class="['cate-box', selectCate === 2?'cate-selected':'']" @click="changeCate(2)">
      <img src="/static/images/blue80.png" alt="">
      <p>链条斜跨款手机壳</p>
    </div>
    <div class="bottom-btn">
      <van-button size="large" round type="info" @click="toSelectModel">下一步</van-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Button } from 'vant'
Vue.use(Button)
export default {
  name: 'home',
  data () {
    return {
      selectCate: 1
    }
  },
  mounted () {
  },
  methods: {
    toSelectModel () {
      this.$router.push({name: 'selectModel'})
    },
    changeCate (cate) {
      this.selectCate = cate
      this.$store.state.caseInfo.selectCate = cate
    }
  }
}
</script>

<style scoped>
.cate-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 1em;
}
.cate-box{
  width: 10em;
  height: 10em;
  padding: 20px;
  margin: 20px;
  text-align: center;
  box-shadow: 1px 1px 10px rgb(0 0 0 / 10%);
  border-radius: 10px;
  border: 1px solid #ffffff;
}
.cate-selected{
  border:1px solid rgb(0 0 0 / 10%);
  box-shadow: 1px 1px 10px rgb(0 0 0 / 20%);
}
img{
  width: 80px;
  height: 120px;
}
p{
  font-size: 0.9em;
  line-height: 2.0em;
}
.bottom-btn{
  width: 90%;
  position: absolute;
  bottom: 3%;
  left: 5%;
}
</style>
