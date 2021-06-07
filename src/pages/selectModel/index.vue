<template>
  <div class="model-container">
    <van-tree-select
      :items="list"
      :main-active-index="mainActiveIndex"
      :active-id="activeId"
      @click-nav="onClickNav"
      height="80vh"
    >
      <div slot="content" class="item-box">
        <div v-for="item in list[mainActiveIndex].children"
            :class="['item', activeId == item.id? 'selected-item' : '']"
            @click="onClickItem(item.id)"
            :key="item.id"
        >
          {{item.text}}
        </div>
      </div>
    </van-tree-select>
    <div class="bottom-btn">
      <van-button size="large" round type="info" @click="toSelectPhoto">下一步</van-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { TreeSelect, Button, Toast } from 'vant'
Vue.use(TreeSelect)
Vue.use(Button)
Vue.use(Toast)
export default {
  name: 'selectModel',
  data () {
    return {
      list: [
        {
          // 导航名称
          text: 'Iphone',
          // 禁用选项
          disabled: false,
          // 该导航下所有的可选项
          children: [
            {
              // 名称
              text: 'Iphone 5S1',
              // id，作为匹配选中状态的标识
              id: 1
            },
            {
              text: 'Iphone 5S',
              id: 2
            }
          ]
        },
        {
          // 导航名称
          text: '华为',
          // 禁用选项
          disabled: false,
          // 该导航下所有的可选项
          children: [
            {
              // 名称
              text: '1',
              // id，作为匹配选中状态的标识
              id: 1
            },
            {
              text: '2',
              id: 2
            }
          ]
        }
      ],
      mainActiveIndex: 0,
      activeId: null
    }
  },
  methods: {
    onClickNav (e) {
      this.mainActiveIndex = e
      this.activeId = null
    },
    onClickItem (itemId) {
      this.activeId = itemId
      this.$store.state.caseInfo.selectModel = itemId
    },
    toSelectPhoto () {
      if (this.activeId === null) {
        Toast('请选择机型')
        return
      }
      this.$router.push({name: 'selectPhoto'})
    }
  }
}
</script>

<style scoped>

.item-box{
  background: #F3F3F3;
  height: 100%;
  padding: 2em 0.5em;
}
.item{
  float: left;
  border: 1px solid #F3F3F3;
  box-shadow: 1px 1px 15px #e6e6e6;
  background: #ffffff;
  border-radius: 2em;
  padding: 10px;
  margin-left: 1em;
  margin-bottom: 1em;
}
.selected-item{
  border:1px solid rgb(0 0 0 / 10%) !important;
  box-shadow: 1px 1px 15px rgb(0 0 0 / 20%) !important;
}
.bottom-btn{
  width: 90%;
  position: absolute;
  bottom: 3%;
  left: 5%;
}
</style>
