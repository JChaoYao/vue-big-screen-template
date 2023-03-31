<!-- echarts模板，有局部刷新需要在mounted自行开启 -->
<template>      
    <div ref="refChart" :style="{ height: YHOne + 'px'}"></div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted, onBeforeUnmount ,onUnmounted } from 'vue';
import * as echarts from 'echarts'; 
// 导入echarts皮肤
import skin from '@/assets/theme/skin';
    // 获取ref
    let refChart = ref<any>()
    // 获取浏览器可视区域高度（包含滚动条）、 window.innerHeight
    // 获取浏览器可视区域高度（不包含工具栏高度）、document.documentElement.clientHeight
    // 获取body的实际高度  (三个都是相同，兼容性不同的浏览器而设置的) document.body.clientHeight
    let screenHeight = ref(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
    let screenWidth = ref(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
    const chartInstance= ref()
    let allData1 = ref([]);
    let allData2 = ref([]);
    // 浏览器高度
    let YHOne = ref();
    // 浏览器宽度
    let YWOne = ref();
    // 浏览器字体大小
    let YFOne = ref();
    // 自适应浏览器获取宽高大小定时器
    const screenTimer = ref();
    // 局部刷新定时器    
    const dataTimer = ref();
    // tootip定时器ID-用于清除定时器
    const tootipTimer = ref(); 

    onBeforeMount( () => {
      // Echarts页面加载进来时，首先设置高度进行显示图表进行初始化
      YHOne.value = Math.round(screenHeight.value * 0.29)
    })

    onMounted( () => {
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
        //getDataTimer();
        // Tootip刷新定时器
        getTootipTimer();  
    })

    onBeforeUnmount(() => {
      // 清除tootip刷新定时器
      clearInterval(tootipTimer.value);
      tootipTimer.value = null;     
      // 销毁Echarts图表
      chartInstance.value.dispose();
      chartInstance.value = null;
    })
    onUnmounted( () => {
      // 清除自适应屏幕定时器
      clearInterval(screenTimer.value);
      screenTimer.value = null;
      // 清除局部刷新定时器
      clearInterval(dataTimer.value);
      dataTimer.value = null;
      // 页面大小改变时触发销毁
      window.removeEventListener('resize',getScreenHeight);
      // 页面大小改变时触发销毁
      window.removeEventListener('resize',getScreenWidth);
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
        YHOne.value = Math.round(screenHeight.value * 0.29);
        //console.log("高度->"+screenHeight +"-"+ YHOne);
    }
    // 字体大小根据宽度自适应
    const getScreenWidth = () => {
      screenWidth.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      // 浏览器字体计算
      YFOne.value = Math.round(screenWidth.value / 100);
      // 浏览器宽度宽度
      YWOne.value = screenWidth;       
      //console.log("宽度->"+screenWidth);
    }

    const initChart = () => {
      // 覆盖默认主题
      echarts.registerTheme('myTheme', skin);
      // 定义实例
      chartInstance.value = echarts.init(refChart.value, 'myTheme');  
      const initOption = {
        title: {
          text: "🍁雾霭与雾霾浓度",
          left: 'left'
        },           
        tooltip: {
          trigger: 'item'
        },
        grid: {
          top: '20%',
          left: '1%',
          right: '2%',
          bottom: '3%',
          containLabel: true,
        },
        color: ['#019688', '#119AC2'],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '浓度数据',
            // 字体大小
            // nameTextStyle: {
            //    fontSize: 12
            // },
            axisTick: { // 轴刻度线
              show: false,
            },
            // 刻度文字颜色
            axisLabel: { color: '#808080' },
            // y轴刻度设置
            axisLine: {
              lineStyle: {
                width: 2,
                color: '#019688',
              },
            },
            // y轴分隔线设置
            splitLine: {
              lineStyle: {
                color: 'rgba(226,226,226,0.5)',
              },
            },
          },
          {
            type: 'value',
            name: '测量原始值',
            interval: 2,
            axisTick: { // 轴刻度线
              show: false,
            },
            axisLabel: { color: '#808080' },
            axisLine: {
              lineStyle: {
                width: 2,
                color: '#019688',
              },
            },
            // y轴分隔线设置
            splitLine: {
              lineStyle: {
                color: 'rgba(226,226,226,0.5)',
              },
            },
            // splitArea: {
            //   show: true,
            //   areaStyle: {
            //     color: ['rgba(250,250,250,0.3)', 'rgba(226,226,226,0.3)'],
            //   },
            // },
          },
        ],
        series: [
          {
            name: '浓度数据',
            type: 'line',
            smooth: true,
            symbolSize: 6,
            areaStyle: {},
            itemStyle: {
              borderWidth: 2,
            },
          },
          {
            name: '测量原始值',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            symbolSize: 6,
            areaStyle: {},
            itemStyle: {
              borderWidth: 2,
            },
          },
        ],       
      };
      // 图表初始化配置
      chartInstance.value.setOption(initOption);
      // 鼠标移入停止定时器
      // chartInstance.on("mouseover", () => {
      //   clearInterval(dataTimer);
      // });

      // 鼠标移入启动定时器
      // chartInstance.on("mouseout", () => {
      //   getDataTimer();
      // });
      // 鼠标移入停止定时器
      chartInstance.value.on("mouseover", () => {
        clearInterval(tootipTimer.value);
      });

      // 鼠标移入启动定时器
      chartInstance.value.on("mouseout", () => {
        getTootipTimer();
      });              
    }

    const getData = () => {
      // 调用接口方法
      // getModuleData().then(res => {
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
      // 处理图表需要的数据
      const dataOption = {
        xAxis: [
          {
            data: ['12:00', '13:00', '14:00', '15:00','16:00', '17:00', '18:00', '19:00','20:00', '21:00', '22:00', '23:00']
          }
        ],
        series: [
          {
            data: [0.2, 0.049, 0.07, 0.23, 0.25, 0.07, 0.15, 0.162, 0.32, 0.2, 0.06, 0.33]
          },
          {
            data: [2.6, 5.9, 9.0, 6.4, 8.7, 0.7, 5.6, 2.2, 0.4, 0.18, 0.24, 0.25]
          }
        ],         
      };
      // 图表数据变化配置
      chartInstance.value.setOption(dataOption);
    }

    const screenAdapter = () => {
      const titleFontSize = Math.round(refChart.value.offsetWidth / 50);
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        // 圆点分类标题
        legend: {
          textStyle: {
            fontSize: Math.round(titleFontSize / 1.2),
          }
        },
        xAxis: {
          //  改变x轴字体颜色和大小
          axisLabel: {
            textStyle: {
              fontSize: Math.round(titleFontSize * 0.8),
            },
          },
        },
        yAxis: [
          {
            // 字体大小
            nameTextStyle: {
              fontSize: titleFontSize
            },        
            //  改变y轴字体颜色和大小
            axisLabel: {
              textStyle: {
                fontSize: Math.round(titleFontSize * 0.8),
              },
            },
          },
          {
            // 字体大小
            nameTextStyle: {
              fontSize: titleFontSize
            },        
            //  改变y轴字体颜色和大小
            axisLabel: {
              textStyle: {
                fontSize: Math.round(titleFontSize * 0.8),
              },
            },
          }              
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

    // 定时器
    const getTootipTimer = () => {
      let index = 0; // 播放所在下标
      tootipTimer.value = setInterval(() => {
        // echarts实现定时播放tooltip
        chartInstance.value.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: index
        });
        index++;
        if(index > 12) {
          index = 0;
        }  
        //console.log("Hello World")
      }, 2000)
    }     

</script>
<style lang='scss' scoped>

</style>