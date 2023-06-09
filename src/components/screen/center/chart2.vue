<!-- echarts模板，有局部刷新需要在mounted自行开启 -->
<template>      
    <div ref="refChart" :style="{ height: YHOne + 'px'}"></div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted, onBeforeUnmount ,onUnmounted } from 'vue';
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
    const chartInstance = ref();
    const allData1 = ref();
    const allData2 = ref();
    const YHOne = ref();
    // 自适应浏览器获取宽高大小定时器
    const screenTimer = ref();
    // 局部刷新数据定时器    
    const dataTimer = ref();

    onBeforeMount(() => {
      YHOne.value = Math.round(screenHeight.value * 0.36)
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
        screenHeight.value = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        // 四舍五入取整数
        YHOne.value = Math.round(screenHeight.value * 0.36);
        //console.log("高度->"+screenHeight +"-"+ YHOne);
    }
    // 字体大小根据宽度自适应
    const getScreenWidth = () => {
      screenWidth.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      //console.log("宽度->"+screenWidth);
    }
    const initChart = () => {
      // 覆盖默认主题
      echarts.registerTheme('myTheme', skin);
      // 定义实例
      chartInstance.value = echarts.init(refChart.value, 'myTheme');  
      const initOption = {
        title: {
          text: "🌞24小时IGB温度对比",
          left: 'left'
        },            
        calculable: true,
        legend: {
          //   指示框名字  注意！要和下方series中的name一起改
          data: ["IGB最低温度", "IGB最高温度"],
          // 指示框位置  距离上下左右多少
          right: "5%",
          // top: '50%',
          textStyle: {
            //color: '#4F4F4F'   //字体颜色
          },
        },
        grid: {
          top: "15%",
          left: "2%",
          right: "2%",
          bottom: "6%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
        textStyle:{
          align:'left'
          }
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              //x轴线的颜色以及宽度
              show: true, //是否显示X轴
              lineStyle: {
                color: "#4F4F4F",
              },
            },
            axisLabel: {
              // interval: 0,  //间隔几条显示
              // rotate: 20,  // 切斜度数
              // fontSize: 10,   //字体大小
            },
            axisTick: {
              //是否显示刻度线
              show: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              //y轴刻度线
              show: true,
            },
            axisLine: {
              show: false, // Y轴
              lineStyle: {
                color: "#4F4F4F",
              },
            },
            splitLine: {
              // 表格里面Y轴线条
              show: true,
              lineStyle: {
                type: "dashed", //虚线
                color: "#04072F", //虚线颜色
              },
            },
          },
        ],
        series: [
          {
            name: "IGB最低温度",
            type: "bar",
            itemStyle: {
              //颜色样式部分
              normal: {
                barBorderRadius: [20, 20, 0, 0], //圆角[上左，上右，下右，下左]
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
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: "#8277E9" },
                  { offset: 1, color: "#CC77E9" },
                ]),
              },
            },
          },
          {
            name: "IGB最高温度",
            type: "bar",
            itemStyle: {
              //颜色样式部分
              normal: {
                barBorderRadius: [20, 20, 0, 0], //圆角[上左，上右，下右，下左]
                label: {
                  show: true, //开启数字显示
                  position: "top", //在上方显示数字
                  textStyle: {
                    //数值样式
                    color: "white", //字体颜色
                    fontSize: 10, //字体大小
                  },
                },
                //   柱状图颜色渐变
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: "#017CE4" },
                  { offset: 1, color: "#249EFD" },
                ]),
              },
            },
          },
        ],     
      };
      // 图表初始化配置
      chartInstance.value.setOption(initOption);
      // 鼠标移入停止定时器
      chartInstance.value.on("mouseover", () => {
        clearInterval(dataTimer.value);
      });

      // 鼠标移入启动定时器
      chartInstance.value.on("mouseout", () => {
        getDataTimer();
      });      
    }


    const getData = () => {
      // 先进行置空
      allData1.value = [];
      allData2.value = [];
      let num1 = randomNum(50,150);
      let num2 = randomNum(50,150);
      let num3 = randomNum(50,150);
      let num4 = randomNum(50,150);
      let num5 = randomNum(50,150);
      let num6 = randomNum(50,150);
      let num7 = randomNum(50,150);
      let num8 = randomNum(50,150);
      let num9 = randomNum(50,150);
      let num10 = randomNum(50,150);
      let num11 = randomNum(50,150);
      let num12 = randomNum(50,150);
      let num13 = randomNum(50,150);
      let num14 = randomNum(50,150);
      let num15 = randomNum(50,150);
      let num16 = randomNum(50,150);
      let num17 = randomNum(50,150);
      let num18 = randomNum(50,150);
      let num19 = randomNum(50,150);
      let num20 = randomNum(50,150);
      let num21 = randomNum(50,150);
      let num22 = randomNum(50,150);
      let num23 = randomNum(50,150);
      let num24 = randomNum(50,150);
      let num25 = randomNum(50,150);
      allData1.value.push(num1,num2,num3,num4,num5,num6,num7,num8,num9,num10,num11,num12,num13,num14,num15,num16,num17,num18,num19,num20,num21,num22,num23,num24,num25);
      allData2.value.push(num7+5,num8+6,num9+7,num10+8,num11+9,num12+10,num14+11,num15+12,num25+13,num1+14,num2+15,num20+16,num3+17,num4+18,num5+19,num6+20,num24+21,num23+22,num22+23,num21+24,num19+25,num18+26,num17+27,num16+28,num13+29);
      // 调用接口方法
      // get24HoursData3().then(res => {
      //       allData = res.data;
      //       // 刷新数据即可
      //       updateChart();
      //       //console.log("ALLDATA->"+JSON.stringify(allData));
      //       // echarts查不到数据，将初始化echarts的方法全部放置到接口方法中即可。  
      // })  
      // 获取服务器的数据, 对allData进行赋值之后, 调用updateChart方法更新图表
      //console.log("ALLDATA->",JSON.stringify(res.data))
      //console.log("ALLDATA->",JSON.stringify(allData))
      updateChart();
    }

    const updateChart = () => {
      // 处理图表需要的数据
      const dataOption = {
        // xAxis: [
        //   {
        //     data: allData.timeHour
        //   },
        // ],
        // series: [
        //   {
        //     data: allData.column1
        //   },
        //   {
        //     data: allData.column1
        //   },
        // ], 
        xAxis: [
          {
            data: [
              "0:00",
              "1:00",
              "2:00",
              "3:00",
              "4:00",
              "5:00",
              "6:00",
              "7:00",
              "8:00",
              "9:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
              "19:00",
              "20:00",
              "21:00",
              "22:00",
              "23:00",
              "24:00"
            ],
          },
        ],
        series: [
          {
          // data: [
          //     220, 182, 191, 234, 290, 330, 310, 365, 220, 182, 191, 234, 290,
          //     330, 310, 365, 220, 182, 191, 234, 290, 330, 310, 365, 235,
          //   ]
           data: allData1.value
          },
          {
            // data: [
            //   120, 132, 101, 134, 90, 230, 210, 265, 120, 132, 101, 134, 90,
            //   230, 210, 265, 120, 132, 101, 134, 90, 230, 210, 265, 156,
            // ]
            data: allData2.value
          },
        ],  

      };
      // 图表数据变化配置
      chartInstance.value.setOption(dataOption);
    }

    const screenAdapter = () => {
      const titleFontSize = Math.round(refChart.value.offsetWidth / 50);
      //console.log("screenAdapter->"+titleFontSize);
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: Math.round(titleFontSize),
          },
        },
        // 圆点分类标题
        legend: {
          textStyle: {
            fontSize: Math.round(titleFontSize),
          },
        },
        xAxis: {
          //  改变x轴字体颜色和大小
          axisLabel: {
            textStyle: {
              fontSize: Math.round(titleFontSize),
            },
          },
        },
        yAxis: {
          //  改变y轴字体颜色和大小
          axisLabel: {
            textStyle: {
              fontSize: Math.round(titleFontSize),
            },
          },
        },
        series: [
            {
              // 圆柱的宽度
              barWidth: Math.round(titleFontSize * 0.8),
              itemStyle: { //设置渐变色                     
                normal: {
                    label: {
                      textStyle: {
                        fontSize: Math.round(titleFontSize), //字体大小
                    },
                  },                  
                }
              }
          },
          {
            // 圆柱的宽度
            barWidth: Math.round(titleFontSize * 0.8),
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
          },
        ]         
      };
      // 图表自适应变化配置
      chartInstance.value.setOption(adapterOption);
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