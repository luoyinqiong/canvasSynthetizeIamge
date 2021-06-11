<template>
  <div style="position: relative; width: 100%; height: 800px;overflow:hidden">
    <div ref="box" class="box" :style="boxStyle">
      <div ref="bgBox" class="bgImgBox">
        <img
          @load="getImgHeight"
          ref="bg"
          class="phone"
          src="../assets/background.png"
          alt=""
        />
      </div>
      <div class="coverImgBox" :style="coverStyle" @click="clickCoverImg">
        <img
          class="coverImg opacity8"
          :style="coverImgStyle"
          ref="cover"
          src="../assets/testImg.jpg"
          alt=""
          v-finger:pinch="pinchHandler"
          v-finger:rotate="rotateHandler"
          @click="clickCoverImg"
        />
        <img class="del_icon" src="../assets/del_icon.png" alt="" />
        <img class="rotate_icon" src="../assets/rotate_icon.png" alt="" />
        <img class="scale_icon" src="../assets/scale_icon.png" alt="" />
        <!-- <div class="fontA">文字</div> -->
      </div>
    </div>
    <div class="btn" style="top: 600px" @click="create">生成图片</div>
  </div>
</template>
<script>
// 运行需要安装html2canvas和alloyfinger的依赖
import html2canvas from "html2canvas";
import VConsole from "vconsole";
new VConsole();
export default {
  name: "Test",
  data() {
    return {
      height: 0,
      x: 0,
      y: 0,
      scaleT: "", // 保存定时器
      scale: 1,
      rotate: 0,
      pointX: 0,
      pointY: 0,
    };
  },
  computed: {
    boxStyle: function () {
      return `height:${this.height}px;`;
    },
    coverStyle: function () {
      return `height:${this.height}px;transform:rotate(${this.rotate}deg) scale(${this.scale});overflow:hidden;`;
    },
    coverImgStyle: function () {
      if (
        this.height &&
        this.$refs.cover.naturalHeight > this.$refs.cover.naturalWidth
      ) {
        // 计算图片的偏移值
        return `width:auto;height:${this.height}px;transform: translate(-50%,-50%);`;
      }
      return `width:12rem;height:auto;transform: translate(-50%,-50%);`;
    },
  },
  mounted() {
    // console.log(html2canvas)
  },
  methods: {
    create() {
      let realHtml = this.$refs.box;
      var canvas = document.createElement("canvas"); //创建一个canvas节点
      var scale = 100 / (100 * window.devicePixelRatio); //定义任意放大倍数 支持小数
      canvas.width = realHtml.offsetWidth; //定义canvas 宽度 * 缩放
      canvas.height = realHtml.offsetHeight; //定义canvas高度 *缩放
      canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
      var opts = {
        allowTaint: true,
        tainttest: true, //检测每张图片都已经加载完成
        scale: window.devicePixelRatio, // 添加的scale 参数
        useCORS: true,
        canvas: canvas, //自定义 canvas
        // logging: true, //日志开关
        width: realHtml.offsetWidth, //dom 原始宽度
        height: realHtml.offsetHeight, //dom 原始高度
        x: realHtml.offsetLeft + realHtml.offsetParent.offsetLeft,
        y: realHtml.offsetTop + realHtml.offsetParent.offsetTop,
      };

      html2canvas(realHtml, opts).then(function (canvas) {
        var imgUrl = canvas
          .toDataURL("image/" + ".jpg")
          .replace("image/" + ".jpg", "image/octet-stream");

        // var a = document.createElement("a"); // 创建一个a节点插入的document
        // var event = new MouseEvent("click"); // 模拟鼠标click点击事件
        // a.download = "二维码.jpg"; // 设置a节点的download属性值
        // a.href = imgUrl; // 将图片的src赋值给a节点的href
        // a.dispatchEvent(event);
        // a.click()
        // $().remove(a);

        if (window.navigator.msSaveOrOpenBlob) {
          var bstr = atob(imgUrl.split(",")[1]);
          var n = bstr.length;
          var u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          var blob = new Blob([u8arr]);
          window.navigator.msSaveOrOpenBlob(blob, "二维码" + "." + "jpg");
        } else {
          // 这里就按照chrome等新版浏览器来处理
          var a = document.createElement("a");
          a.href = imgUrl;
          a.setAttribute("download", "二维码.jpg");
          a.click();
          a = null;
        }
      });
    },
    getImgHeight() {
      this.height = this.$refs.bg.offsetHeight;
      this.pointX =
        this.$refs.bgBox.offsetLeft + this.$refs.bgBox.offsetWidth / 2;
      this.pointY =
        this.$refs.bgBox.offsetTop + this.$refs.bgBox.offsetHeight / 2;
      // this.pointX = this.$refs.bgBox.offsetLeft + this.$refs.bgBox.offsetWidth;
      // this.pointY = this.$refs.bgBox.offsetTop;
      console.log(this.$refs);
    },

    // 缩放
    pinchHandler(evt) {
      evt.preventDefault();
      console.log("scale", evt, evt.zoom);
      if (evt.zoom > 1) {
        this.scale = this.scale + 0.05;
      } else {
        if (this.scale < 0.45) {
          this.scale = 0.4;
        } else {
          this.scale = this.scale - 0.05;
        }
      }
    },

    // 旋转
    rotateHandler(evt) {
      evt.preventDefault();
      // console.log("rotate",evt.zoom)
      this.rotate = evt.angle < 0 ? this.rotate - 1 : this.rotate + 1;
      // if(!this.scaleT){
      // this.scaleT = setTimeout(()=>{
      //   clearTimeout(this.scaleT);
      //   this.scaleT="";
      // },100)
      // }
    },

    // // 获取点击缩放或者旋转按钮时初始位置
    // getStartPoint(e) {
    //   if(e.targetTouches.length == 1){
    //     this.x = e.targetTouches[0].clientX;
    //     this.y = e.targetTouches[0].clientY;
    //   }else if(e.targetTouches.length == 2){

    //   }

    //   console.log(e.targetTouches);
    // },
    // touchMoveEvent(e){
    //   e.preventDefault();
    //   // console.log(e)
    //   if(e.targetTouches.length == 1){
    //     this.setRotate(e)
    //   }else if(e.targetTouches.length == 2){
    //     this.setScale(e);
    //   }
    // },
    // // 设置缩放倍数
    // setScale(e) {
    //   e.preventDefault();
    //   let mScaleX = e.targetTouches[0].clientX;
    //   let mScaleY = e.targetTouches[0].clientY;
    //   let flag = ""; // 1放大 2缩小
    //   if (this.x - mScaleX > 3 && mScaleY - this.y > 3) {
    //     flag = 1;
    //   } else if (mScaleX - this.x > 3 && this.y - mScaleY > 3) {
    //     flag = 2;
    //   }
    //   this.x = mScaleX;
    //   this.y = mScaleY;
    //   if (flag == 1) {
    //     // 放大图片
    //     if (this.scale >= 1.9) {
    //       this.scale = 2;
    //     } else {
    //       this.scale = this.scale + 0.1;
    //     }
    //   } else if (flag == 2) {
    //     //缩小图片
    //     if (this.scale >= 0.2) {
    //       this.scale = this.scale - 0.1;
    //     } else {
    //       this.scale = 0.1;
    //     }
    //   }
    //   // if(!this.scaleT){
    //   //   this.scaleT = setTimeout(()=>{
    //   //     if(flag == 1){
    //   //       // 放大图片
    //   //       this.scale = this.scale + 0.1;
    //   //     }else if(flag == 2){
    //   //       //缩小图片
    //   //       if(this.scale>=0.2){
    //   //         this.scale = this.scale - 0.1;
    //   //       }else{
    //   //         this.scale = 0.1
    //   //       }
    //   //     }
    //   //     console.log(this.scale)
    //   //     clearTimeout(this.scaleT);
    //   //     this.scaleT = "";
    //   //   },100)
    //   // }
    //   // console.log("set",e.targetTouches[0])
    // },
    // // 设置旋转角度
    // setRotate(e) {
    //   e.preventDefault();
    //   // console.log(e)
    //   let mRotateX = e.targetTouches[0].clientX;
    //   let mRotateY = e.targetTouches[0].clientY;
    //   let beforeDeg =
    //     (Math.atan2(this.y - this.pointY, this.x - this.pointX) / Math.PI) *
    //     180;
    //   let afterDeg =
    //     (Math.atan2(mRotateY - this.pointY, mRotateX - this.pointX) / Math.PI) *
    //     180;

    //   this.x = mRotateX;
    //   this.y = mRotateY;
    //   this.rotate = this.rotate + afterDeg - beforeDeg;
    // },
    clickCoverImg() {
      console.log(123);
    },
  },
};
</script>
<style scoped>
.box {
  width: 12rem;
  position: absolute;
  top: 3.75rem;
  left: calc(50% - 6rem);
}

.btn {
  position: absolute;
}

.bgImgBox,
.coverImgBox {
  font-size: 0;
  position: absolute;
  left: 0;
  top: 0;
  /* transform: translate(-50%, -50%); */
  user-select: none;
}

.phone {
  width: 12rem;
  height: auto;
  /* margin: 0 auto; */
}

.bgImgBox {
  width: 12rem;
  z-index: 1;
}

.opacity8 {
  opacity: 0.8;
}

.coverImgBox {
  width: 12rem;
  z-index: 5;
}

.coverImg {
  position: absolute;
  top: 50%;
  left: 50%;
  /* width: 12rem; */
  /* object-fit:cover; */
  /* transition: all 0.1s; */
}

.del_icon,
.rotate_icon,
.scale_icon {
  position: absolute;
  width: 1.5rem;
  height: 1.5rem;
  /* cursor: pointer; */
  user-select: none;
}

.del_icon {
  left: 0;
  top: 0;
}

.rotate_icon {
  right: 0;
  top: 0;
}

.scale_icon {
  left: 0;
  bottom: 0;
}
.fontA {
  position: absolute;
  z-index: 8;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  color: red;
}
</style>
