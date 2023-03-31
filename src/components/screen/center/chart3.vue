<!-- echarts模板，有局部刷新需要在mounted自行开启 -->
<template>      
    <div ref="refChart" :style="{ height: YHOne + 'px'}"></div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted, onBeforeUnmount ,onUnmounted } from 'vue';
// import { listTenDayData } from "@/api/home/index";
import * as echarts from 'echarts'; 
// 导入echarts皮肤
import skin from '@/assets/theme/skin';
import { randomNum } from '@/utils/koi';
    // 获取ref
    let refChart = ref<any>()
    // 获取浏览器可视区域高度（包含滚动条）、 window.innerHeight
    // 获取浏览器可视区域高度（不包含工具栏高度）、document.documentElement.clientHeight
    // 获取body的实际高度  (三个都是相同，兼容性不同的浏览器而设置的) document.body.clientHeight
    let screenHeight = ref(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
    let screenWidth = ref(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
    let chartInstance = ref();   
    const allData1 = ref();
    const allData2 = ref();
    // 浏览器高度
    let YHOne = ref();
    // 浏览器宽度
    let kWOne = ref();
    // 浏览器字体大小
    let kFOne = ref();
    // 自适应浏览器获取宽高大小定时器
    const screenTimer = ref();
    // 局部刷新定时器    
    const dataTimer = ref();

    onBeforeMount(() => {
      // Echarts页面加载进来时，首先设置高度进行显示图表进行初始化
      YHOne.value = Math.round(screenHeight.value * 0.35)
    })

    onMounted(() => {
      // 页面大小改变时触发
      window.addEventListener('resize',getScreenHeight, false);
      // 页面大小改变时触发
      window.addEventListener('resize',getScreenWidth, false);
      // 鼠标移动时触发
      //window.addEventListener('mousemove',getHeight, false);
      // 自适应浏览器获取宽高大小定时器
      resizeScreen();
      // 图表初始化
      initChart();
      // 获取接口数据
      getData();
      // 调用Echarts图表自适应方法
      screenAdapter();    
      // Echarts图表自适应
      window.addEventListener("resize", screenAdapter);
      // 局部刷新定时器
      getDataTimer(); 
    })

    onBeforeUnmount(() => {
      // 销毁Echarts图表
      chartInstance.value.dispose();
      chartInstance.value = null;
    })

    onUnmounted(() => {
      // 清除自适应屏幕定时器
      clearInterval(screenTimer.value);
      screenTimer.value = null;
      // 清除局部刷新定时器
      clearInterval(dataTimer.value);
      dataTimer.value = null;
      // 页面大小改变时触发销毁
      window.removeEventListener('resize',getScreenHeight, false);
      // 页面大小改变时触发销毁
      window.removeEventListener('resize',getScreenWidth, false);
      // Echarts图表自适应销毁
      window.removeEventListener("resize", screenAdapter);
    })

    // 自适应浏览器获取宽高大小定时器
    const resizeScreen = () => {
      screenTimer.value = setInterval(() => {
        getScreenHeight();
        getScreenWidth();
      }, 200)
    }
    // 获取浏览器高度进行自适应
    const getScreenHeight = () => {
        screenHeight.value  = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        // 四舍五入取整数
        YHOne.value  = Math.round(screenHeight.value * 0.35);
        //console.log("高度->"+screenHeight +"-"+ YHOne);
    }
    // 字体大小根据宽度自适应
    const getScreenWidth = () => {
      screenWidth.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      // 浏览器字体计算
      kFOne.value = Math.round(screenWidth.value / 100);
      // 浏览器宽度宽度
      kWOne = screenWidth;       
      //console.log("宽度->"+screenWidth);
    }
    
    const initChart = () => {
      // 覆盖默认主题
      echarts.registerTheme('myTheme', skin);
      // 定义实例
      chartInstance.value = echarts.init(refChart.value, 'myTheme');  
      const initOption = {
        title: {
          text: "🍄手机近期耗电量",
          top: '1%'
        },        
        grid: {
          top: "12%",
          left: "6%",
          bottom: "10%",
          right: "2%"
        },
        tooltip: {
          show: true,
        },
        legend: {
            data: ['柱形耗电量', '折线耗电量'],
            right: "5%",
        },     
        xAxis: [
          {
            type: 'category',
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '柱形耗电量',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value: any) {
                return value + ' V';
              }
            }
          },          
          {
            name: '折线耗电量',
            type: 'line',
            tooltip: {
              valueFormatter: function (value: any) {
                return value + ' V';
              }
            },
            // 圆滑连接                                  
            smooth: true,
            itemStyle: {
                color: '#00f2f1'  // 线颜色
            }                     
          }
        ]                        
      };
      // 图表初始化配置
      chartInstance.value.setOption(initOption);  
    }
    const getData = () => {
      // 先进行置空
      allData1.value = [];
      allData2.value = [];
      let num1 = randomNum(100,200);
      let num2 = randomNum(200,500);
      let num3 = randomNum(200,500);
      let num4 = randomNum(500,700);
      let num5 = randomNum(500,700);
      let num6 = randomNum(700,800);
      let num7 = randomNum(800,900);
      let num8 = randomNum(900,1000);
      allData1.value = [
          "09-03",
          "09-04",
          "09-05",
          "09-06",
          "09-07",
          "09-08",
          "09-09",
          "09-10"
      ]
      allData2.value.push(num1,num2,num3,num4,num5,num6,num7,num8);
      // 调用接口方法
      // listTenDayData().then(res => {
      //       allData = res.data;
      //       updateChart();      
      //       //console.log("ALLDATA->"+JSON.stringify(allData.pcsSum));
      //       // echarts查不到数据，将初始化echarts的方法全部放置到接口方法中即可。  
      // })  
      // 获取服务器的数据, 对allData进行赋值之后, 调用updateChart方法更新图表
      //console.log("ALLDATA->",JSON.stringify(res.data))
      //console.log("ALLDATA->",JSON.stringify(allData))
      updateChart();
    }
    const updateChart = () => {
      const colorArr = [
        ["#0BA82C", "#4FF778"],
        ["#2E72BF", "#23E5E5"],
        ["#5052EE", "#AB6EE5"],
        ["hotpink", "lightsalmon"],
      ];      
      // 处理图表需要的数据
      const dataOption = {
        xAxis: {
            // x轴刻度文字                                  
            data: allData1.value
        },
        series: [
          {
              // y轴柱形耗电量数据                                  
              data: allData2.value,
              itemStyle: {
                  //颜色样式部分
                  normal: {
                    label: {
                      show: true, //开启数字显示
                      position: "top", //在上方显示数字
                      textStyle: {
                        //数值样式
                        color: "lightpink", //字体颜色
                        //fontSize: 10, //字体大小
                      },
                    },
                    //   柱状图颜色渐变
                    color: (arg: any) => {
                      let targetColorArr = null;
                      if (arg.value > 700) {
                        targetColorArr = colorArr[0];
                      } else if (arg.value > 500) {
                        targetColorArr = colorArr[1];
                      } else if (arg.value > 200) {
                        targetColorArr = colorArr[2];
                      } else {
                        targetColorArr = colorArr[3];
                      }
                      return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: targetColorArr[0],
                        },
                        {
                          offset: 1,
                          color: targetColorArr[1],
                        },
                      ]);
                    },
                  },
                }               
          },
                    
          {
              // y轴折线耗电量数据                                  
              data: allData2.value
          }          
        ]                         
      };
      // 图表数据变化配置
      chartInstance.value.setOption(dataOption);
    }

    const screenAdapter = () => {
      let titleFontSize = Math.round(refChart.value.offsetWidth / 50);
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        // 圆点分类标题
        legend: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        xAxis: {
          //  改变x轴字体颜色和大小
          axisLabel: {
            textStyle: {
              fontSize: Math.round(titleFontSize * 0.9),
            },
          },
        },
        yAxis: {
          //  改变y轴字体颜色和大小
          axisLabel: {
            textStyle: {
              fontSize: Math.round(titleFontSize * 0.9),
            },
          },
        },
        series: [
          // 双柱的话复制粘贴一份即可    
          {
            // 圆柱的宽度
            barWidth: Math.round(titleFontSize * 1.2),
            itemStyle: {
              //颜色样式部分
              normal: {
                label: {
                  textStyle: {
                    fontSize: Math.round(titleFontSize), //字体大小
                  },
                },
              },
            },
          }
        ],               
      };
      // 图表自适应变化配置
      chartInstance.value.setOption(adapterOption);
      // 手动的调用图表对象的resize 才能产生效果
      chartInstance.value.resize();
    }
    // 定时器
    const getDataTimer = () => {
      dataTimer.value = setInterval(() => {
        // 执行刷新数据的方法
        getData();
        //console.log("Hello World")
      }, 3000)
    }
</script>

<style lang='scss' scoped>

</style>