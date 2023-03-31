<!--  -->
<template>
  <div id="index">   
       <!--  DataV-Loading加载动画 -->
       <dv-loading v-if="loading" :style="{'font-weight': 'bold'}">Loading...</dv-loading>
       <!-- 总体布局-start -->
        <div v-else class="koi-body-png">
          <!-- 第一部分-头部-start -->
            <div class="header" :style="{ height: koiParams.height.YHtitlePng + 'px'}">
              <!-- 首页 -->
              <!-- <span class="koiPage font-bold colorDeepskyblue" @click="handleSkip()" :style="{'font-size': Math.round(koiParams.screen.screenWidth/60) + 'px'}" >首页</span>              -->
              <!-- 跳转大屏页面选择器 -->
              <el-select v-model="value" @change="handleNewScreen" placeholder="请选择大屏页面" class="selectPage" :style="{'width': Math.round(koiParams.screen.screenWidth * 0.12) + 'px','background-color' : 'pink'}" size="mini">
                <el-option
                  v-for="item in koiParams.options"
                  :key="item.value" 
                  :label="item.label"
                  :value="item.value"
                  v-html="
                    `<span style='color:${getTextColor(item.value)}'>${item.label}</span>`" 
                >
                </el-option>
              </el-select>                
              <!-- 时间 -->
              <div class="localTime colorPink" :style="{'font-size': Math.round(koiParams.screen.screenWidth/80) + 'px'}">{{ koiParams.dateParams.dateYear }} {{ koiParams.dateParams.dateWeek }} {{ koiParams.dateParams.dateDay }}</div>
              <!-- 标题 -->
              <span class="title font-bold colorText" :style="{'font-size': Math.round(koiParams.screen.screenWidth/80) + 'px'}">分布式储能平台</span>
          </div>
          <!-- 第一部分-头部-end -->

        <!-- ElementPlus Layout布局 -->
        <div class="layoutHome">
          <el-row>
            <el-col :span="6">
              <div :style="{ height: koiParams.height.YHLeftOne + 'px'}">
                <dv-border-box-12 style="padding:12px">
                  <leftchart1></leftchart1>
                </dv-border-box-12> 
              </div>
      
              <div :style="{ height: koiParams.height.YHLeftTwo + 'px'}">
                <dv-border-box-12 style="padding:12px">
                  <leftchart2></leftchart2>
                </dv-border-box-12> 
              </div>
            </el-col>

            <el-col :span="9"> 
              <div :style="{ height: koiParams.height.YHCenterOne + 'px'}">
                <dv-border-box-12 style="padding:12px">
                  <centerchart1></centerchart1>
                </dv-border-box-12> 
              </div>
              <div :style="{ height: koiParams.height.YHCenterTwo + 'px'}">
                <dv-border-box-12 style="padding:12px">
                  <centerchart2></centerchart2>
                </dv-border-box-12> 
              </div>
              <div :style="{ height: koiParams.height.YHCenterThree + 'px'}">
                <dv-border-box-12 style="padding:12px">
                  <centerchart3></centerchart3>
                </dv-border-box-12> 
              </div>              
            </el-col>
            
            <el-col :span="9">
              <div :style="{ height: koiParams.height.YHRightOne + 'px'}">
                <dv-border-box-12 style="padding:12px">
                  <rightchart1></rightchart1>
                </dv-border-box-12> 
              </div>
              <div :style="{ height: koiParams.height.YHRightTwo + 'px'}">
                <dv-border-box-12 style="padding:12px">
                  <rightchart2></rightchart2>
                </dv-border-box-12> 
              </div>
              <div :style="{ height: koiParams.height.YHRightThree + 'px'}">
                <dv-border-box-12 style="padding:12px">
                  <rightchart3></rightchart3>
                </dv-border-box-12> 
              </div>              
            </el-col>

          </el-row>
        </div>
          <!-- 总体布局end -->
        </div>
   </div>
</template>

<script setup lang="ts">
// 导入vue状态
import { reactive, ref, watch, h, onMounted, onBeforeMount, onBeforeUnmount, onUnmounted } from 'vue';
import { formatTime } from '@/utils/index';
// 引入 ElementPlus 的 ElNotification 消息提示。注意：ElementPlus在main.ts中注册后，在<template>标签中是全局引用的，但是在ts或者js中还是需要单独引入相关组件
import { ElNotification } from 'element-plus'
import leftchart1 from "@/components/screen/left/chart1.vue";
import leftchart2 from "@/components/screen/left/chart2.vue";
import centerchart1 from "@/components/screen/center/chart1.vue";
import centerchart2 from "@/components/screen/center/chart2.vue";
import centerchart3 from "@/components/screen/center/chart3.vue";
import rightchart1 from "@/components/screen/right/chart1.vue";
import rightchart2 from "@/components/screen/right/chart2.vue";
import rightchart3 from "@/components/screen/right/chart3.vue";
  // 单个使用ref
  const loading = ref<boolean>(true);
  const weekday = ref<string[]>(['周日', '周一', '周二', '周三', '周四', '周五', '周六']);
  const value = ref();

  // 只用来放置对象和数组，不建议放置单个
  const koiParams = reactive<any>({
      // 定时任务对象
      timer: {
        // 时间
        dateTimer: null,
        // 适应浏览器
        koiTimer: null,
        // Loading定时器
        loadingTimer: null
      },
      // 时间参数对象
      dateParams: {
        dateDay: null,
        dateYear: null,
        dateWeek: null
      },
      // 跳转大屏页面
      options: [{
        value: '1',
        label: 'Gitee'
      }, {
        value: '2',
        label: 'GitHub'
      }, {
        value: '3',
        label: 'CSDN'
      }, {
        value: '4',
        label: 'EMS页面'
      }, {
        value: '5',
        label: 'PCS页面'
      }],
      screen: {
        // 获取浏览器可视区域高度（包含滚动条）、
        // 获取浏览器可视区域高度（不包含工具栏高度）、
        // 获取body的实际高度  (三个都是相同，兼容性不同的浏览器而设置的)
        screenHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        screenWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      },     
      height: {
        YHtitlePng: null,
        YHLeftOne: null,
        YHLeftTwo: null,
        YHCenterOne: null,
        YHCenterTwo: null,
        YHCenterThree: null,
        YHRightOne: null,
        YHRightTwo: null,
        YHRightThree: null
      }
  });

  //  页面渲染结束
  onMounted(() => {
    // 页面大小改变时触发
    window.addEventListener('resize',getScreenHeight, false);
    // 页面大小改变时触发
    window.addEventListener('resize',getScreenWidth, false);
    // 鼠标移动时触发
    // window.addEventListener('mousemove',getHeight, false);
    // 时间定时器
    timeInterval();
    // 取消Loading定时器
    cancelLoading();
    // 自适应屏幕宽高定时器
    resizeScreen();
  })

  // Vue实例销毁之前
  onBeforeUnmount(() => {
    // 清除时间定时器
    clearInterval(koiParams.timer.dateTimer);
    koiParams.timer.dateTimer = null;
    // 清除loading定时器
    clearInterval(koiParams.timer.loadingTimer);
    koiParams.timer.loadingTimer = null;
    // 清除自适应屏幕宽高定时器
    clearInterval(koiParams.timer.koiTimer);
    koiParams.timer.koiTimer = null;    
    // 移除页面大小改变时触发事件
    window.removeEventListener('resize',getScreenHeight);
    // 移除页面大小改变时触发事件
    window.removeEventListener('resize',getScreenWidth);
  })

  // Vue实例销毁之后
  const onUnmounted = () => {

  }

  // 监听事件
  watch(
      () => [koiParams.screen.screenWidth, koiParams.screen.screenHeight],(newVal, oldVal) => {
        // 此时返回的是数组,按下标获取对应值
        // console.log(newVal[0]);
        // console.log(newVal[1]);
          if (newVal[0] <= 1200) {
                ElNotification({
                  title: '浏览器高度提示',
                  message: h('i', { style: 'color: teal' }, '浏览器宽度<1200px自适应效果减弱'),
                  type: 'warning',
                  position: 'bottom-right',
                  duration: 2000
                });
          }

          if (newVal[1] <= 700) {
                ElNotification({
                  title: '浏览器宽度提示',
                  message: h('strong', { style: 'color: teal' }, '浏览器高度<700px自适应效果减弱'),
                  type: 'warning',
                  position: 'bottom-right',
                  duration: 2000
                });
          } 
      }
  )

  const timeInterval = () => {
    koiParams.timer.dateTimer = setInterval(() => {
      const date = new Date()
      koiParams.dateParams.dateDay = formatTime(date, 'HH:mm:ss')
      koiParams.dateParams.dateYear = formatTime(date, 'yyyy/MM/dd')
      koiParams.dateParams.dateWeek = weekday.value[date.getDay()]
    }, 1000)
  }

  const cancelLoading = () => {
    koiParams.timer.loadingTimer = setTimeout(() => {
      loading.value = false
    }, 500)
  }
  
  const resizeScreen = () => {
    koiParams.timer.koiTimer = setInterval(() => {
      getScreenHeight();
      getScreenWidth();
    }, 200)
  }

  // 获取浏览器高度进行自适应
  const getScreenHeight = () => {
      let screenHeight = koiParams.screen.screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      // 四舍五入取整数
      koiParams.height.YHtitlePng = Math.round(screenHeight * 0.07);
      koiParams.height.YHLeftOne = Math.round(screenHeight * 0.46);
      koiParams.height.YHLeftTwo = Math.round(screenHeight * 0.46);
      koiParams.height.YHCenterOne= Math.round(screenHeight * 0.18);
      koiParams.height.YHCenterTwo = Math.round(screenHeight * 0.37);
      koiParams.height.YHCenterThree = Math.round(screenHeight * 0.37);
      koiParams.height.YHRightOne = Math.round(screenHeight * 0.3);
      koiParams.height.YHRightTwo = Math.round(screenHeight * 0.31);
      koiParams.height.YHRightThree = Math.round(screenHeight * 0.31);
      //console.log(screenHeight +"-"+ Math.round(percentHThirty) +"-"+ Math.round(percentHForty));
  }
  // 字体大小根据宽度自适应
  const getScreenWidth = () => {
    const screenWidth = koiParams.screen.screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    //console.log("width-"+screenWidth+"-height-"+koiParams.screen.screenHeight);
  }

  // 点击跳转Gitee页面
  // const handleSkip = () => {
  //   window.location.href = 'https://gitee.com/BigCatHome/koi-screen';
  // }

  // 跳转新的大屏页面
  const handleNewScreen = () => {
        // Gitee
        if(value.value =='1') {
            // 另外添加一个跳转页面
            window.location.href = 'https://gitee.com/BigCatHome/koi-screen';
        // GitHub    
        }else if(value.value =='2') {
            // 另外添加跳转页面
            window.location.href = 'https://github.com/yuxintao6/koi';
        // CSDN    
        }else if(value.value =='3') {
            // 另外添加跳转页面
            window.location.href = 'https://blog.csdn.net/qq_46856619?type=blog';
        // EMS    
        }else if(value.value =='4') {
            // 另外添加跳转页面
            window.location.href = 'https://gitee.com/BigCatHome/koi-screen';
        // PCS    
        }else if(value.value =='5') {
            // 另外添加跳转页面
            window.location.href = 'localhost:7777/screen2';
        // Gitee    
        }else {
            // 另外添加跳转页面
            window.location.href = 'https://gitee.com/BigCatHome/koi-screen';
        }
    }
    // 下拉框颜色
    const getTextColor = (value: any) => {
        if(value == '1') {
            return "#1404f3"
        }else if(value == '2') {
            return "tomato"
        }else if(value == '3') {
            return "#fa9804"
        }else if(value == '4') {
            return "#af04f3"
        }else {
            return "hotpink"
        }      
    }
</script>

<style lang="scss" scoped>
// 设置ElementUI输入框的背景色、字体颜色、边框属性设置；
::v-deep .el-input__wrapper {
  background-color: #080808;
  color:#fa8f04;
  border: 1px solid deepskyblue;
}
.el-select-dropdown__item:hover {
  background-color: rgba(14, 233, 233, 0.6);
}
</style>
