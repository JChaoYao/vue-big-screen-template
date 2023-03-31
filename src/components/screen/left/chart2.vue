<!-- echarts模板，有局部刷新需要在mounted自行开启 -->
<template>    
  <div ref="refChart" :style="{ height: YHOne + 'px'}"></div> 
</template>

<script setup lang="ts">
// 导入vue状态
import { reactive, ref, onMounted, onBeforeMount, onBeforeUnmount, onUnmounted } from 'vue';
import * as echarts from 'echarts';
// 导入echarts皮肤
import skin from '@/assets/theme/skin'; 
// const henanJson = import("@/assets/map/henan.json");
import henanData from '@/assets/map/henan.json';
type henanData = {};
const henanJson = henanData as henanData;
  // 获取ref
  let refChart = ref<any>()
  // 获取浏览器可视区域高度（包含滚动条）、 window.innerHeight
  // 获取浏览器可视区域高度（不包含工具栏高度）、document.documentElement.clientHeight
  // 获取body的实际高度  (三个都是相同，兼容性不同的浏览器而设置的) document.body.clientHeight
  let screenHeight =  ref(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
  let screenWidth = ref(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
  let chartInstance = ref();
  const allData = ref({
    安阳: [
        "王者荣耀：84041",
        "和平精英：77606",
        "QQ飞车：2798",
        "羊了个羊：3141",
        "蛋仔派对：15",
        "天天酷跑：453",
        "植物VS僵尸：28",
      ],
      许昌: [
        "王者荣耀：50590",
        "和平精英：48069",
        "QQ飞车：1027",
        "羊了个羊：1158",
        "蛋仔派对：15",
        "天天酷跑：295",
        "植物VS僵尸：26",
      ],
      漯河: [
        "王者荣耀：26072",
        "和平精英：25082",
        "羊了个羊：734",
        "蛋仔派对：21",
        "天天酷跑：211",
        "植物VS僵尸：24",
      ],
      开封: [
        "王者荣耀：64574",
        "和平精英：62505",
        "羊了个羊：1747",
        "蛋仔派对：14",
        "天天酷跑：282",
        "植物VS僵尸：26",
      ],
      濮阳: [
        "王者荣耀：65219",
        "和平精英：60310",
        "QQ飞车：2975",
        "羊了个羊：1510",
        "蛋仔派对：15",
        "天天酷跑：385",
        "植物VS僵尸：24",
      ],
      鹤壁: [
        "王者荣耀：29455",
        "和平精英：27847",
        "QQ飞车：7458",
        "羊了个羊：1448",
        "蛋仔派对：9",
        "天天酷跑：127",
        "植物VS僵尸：24",
      ],
      济源: [
        "王者荣耀：10483",
        "和平精英：9258",
        "QQ飞车：834",
        "羊了个羊：282",
        "蛋仔派对：999",
        "天天酷跑：85",
        "植物VS僵尸：24",
      ],
      驻马店: [
        "王者荣耀：84482",
        "和平精英：77147",
        "QQ飞车：4746",
        "羊了个羊：2153",
        "蛋仔派对：23",
        "天天酷跑：389",
        "植物VS僵尸：24",
      ],
      周口: [
        "王者荣耀：87770",
        "和平精英：82320",
        "QQ飞车：2459",
        "羊了个羊：2484",
        "蛋仔派对：25",
        "天天酷跑：456",
        "植物VS僵尸：26",
      ],
      洛阳: [
        "王者荣耀：72752",
        "和平精英：66219",
        "QQ飞车：4139",
        "羊了个羊：1796",
        "蛋仔派对：23",
        "天天酷跑：547",
        "植物VS僵尸：28",
      ],
      三门峡: [
        "王者荣耀：29873",
        "和平精英：28556",
        "QQ飞车：264",
        "羊了个羊：778",
        "蛋仔派对：13",
        "天天酷跑：236",
        "植物VS僵尸：26",
      ],
      南阳: [
        "王者荣耀：114495",
        "和平精英：105965",
        "QQ飞车：5501",
        "羊了个羊：2603",
        "蛋仔派对：27",
        "天天酷跑：371",
        "植物VS僵尸：28",
      ],
      商丘: [
        "王者荣耀：84995",
        "和平精英：77406",
        "QQ飞车：4872",
        "羊了个羊：2314",
        "蛋仔派对：1",
        "天天酷跑：376",
        "植物VS僵尸：26",
      ],
      信阳: [
        "王者荣耀：71743",
        "和平精英：68256",
        "QQ飞车：1499",
        "羊了个羊：1473",
        "蛋仔派对：21",
        "天天酷跑：468",
        "植物VS僵尸：26",
      ],
      焦作: [
        "王者荣耀：58408",
        "和平精英：54548",
        "QQ飞车：1624",
        "羊了个羊：1928",
        "蛋仔派对：15",
        "天天酷跑：269",
        "植物VS僵尸：24",
      ],
      平顶山: [
        "王者荣耀：50144",
        "和平精英：46507",
        "QQ飞车：1499",
        "羊了个羊：1718",
        "蛋仔派对：15",
        "天天酷跑：379",
        "植物VS僵尸：26",
      ],
      郑州: [
        "王者荣耀：123603",
        "和平精英：113985",
        "QQ飞车：5554",
        "羊了个羊：1929",
        "蛋仔派对：63",
        "天天酷跑：1698",
        "植物VS僵尸：374",
      ],
      新乡: [
        "王者荣耀：97748",
        "和平精英：91866",
        "QQ飞车：2807",
        "羊了个羊：2625",
        "蛋仔派对：31",
        "天天酷跑：393",
        "植物VS僵尸：26"
      ]  
  });
  let YHOne = ref();
  // 自适应浏览器获取宽高大小定时器
  const screenTimer = ref();
  // 局部刷新tooltip定时器    
  const tooltipTimer = ref();    

  onBeforeMount( () => {
      // Echarts页面加载进来时，首先设置高度进行显示图表进行初始化
      YHOne.value = Math.round(screenHeight.value * 0.45);
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
    initChart(allData.value);
    // 获取接口数据
    getData();
    // 调用Echarts图表自适应方法
    screenAdapter();    
    // Echarts图表自适应
    window.addEventListener("resize", screenAdapter);
    // 局部刷新定时器
    gettooltipTimer();   
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
    clearInterval(tooltipTimer.value);
    tooltipTimer.value = null;
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
      YHOne.value = Math.round(screenHeight.value * 0.45);
      //console.log("高度->"+screenHeight +"-"+ YHOne);
  }
  // 字体大小根据宽度自适应
  const getScreenWidth = () => {
    screenWidth.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    //console.log("宽度->"+screenWidth);
  }
  const initChart = (data: any) => {
    // 覆盖默认主题
    echarts.registerTheme('myTheme', skin);
    // 定义实例
    chartInstance.value = echarts.init(refChart.value, 'myTheme');  
    // 河南地图
    echarts.registerMap("henan", henanJson);
    const initOption = {
      title: {
        text: "🌻各地市玩家游戏数据(每周)",
      },
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
        formatter: function (params: any) {
          if (params.name == "安阳") {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.安阳.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.安阳[a] + "</p>";
            }
            return yu;
          } else if (params.name == "鹤壁") {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.鹤壁.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.鹤壁[a] + "</p>";
            }
            return yu;
          } else if (params.name == "济源") {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.济源.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.济源[a] + "</p>";
            }
            return yu;
          } else if (params.name == "焦作") {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.焦作.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.焦作[a] + "</p>";
            }
            return yu;
          } else if (params.name == "开封") {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.开封.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.开封[a] + "</p>";
            }
            return yu;
          } else if (params.name == "洛阳") {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.洛阳.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.洛阳[a] + "</p>";
            }
            return yu;
          } else if (params.name == "漯河") {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.漯河.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.漯河[a] + "</p>";
            }
            return yu;
          } else if (params.name == "南阳") {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.南阳.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.南阳[a] + "</p>";
            }
            return yu;
          } else if (params.name == "平顶山") {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.平顶山.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.平顶山[a] + "</p>";
            }
            return yu;
          } else if (params.name == "濮阳") {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.濮阳.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.濮阳[a] + "</p>";
            }
            return yu;
          } else if (params.name == "三门峡") {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.三门峡.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.三门峡[a] + "</p>";
            }
            return yu;
          } else if (params.name == "商丘") {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.商丘.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.商丘[a] + "</p>";
            }
            return yu;
          } else if (params.name == "新乡") {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.新乡.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.新乡[a] + "</p>";
            }
            return yu;
          } else if (params.name == "信阳") {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.信阳.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.信阳[a] + "</p>";
            }
            return yu;
          } else if (params.name == "许昌") {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.许昌.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.许昌[a] + "</p>";
            }
            return yu;
          } else if (params.name == "郑州") {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.郑州.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.郑州[a] + "</p>";
            }
            return yu;
          } else if (params.name == "周口") {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.周口.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.周口[a] + "</p>";
            }
            return yu;
          } else {
            let yu = "<span style='color: deepskyblue;font-weight: bold'>" + "河南省&nbsp;&nbsp;&nbsp;&nbsp;"+ "</span>" + "<span style='color: darkturquoise;font-weight: bold'>" + params.name + "</span>" ;
            for (let a = 0; a < data.驻马店.length; a++) {
              yu +=
                "<p style='text-align:left;color: white';font-weight: bold>" + data.驻马店[a] + "</p>";
            }
            return yu;
          }
        },
        confine: true,
      },
      geo: {
        map: "henan",
        roam: false, //不开启缩放和平移          
        show: true,
        silent: true,
        zlevel: 1,
        regions: [
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "郑州", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#acb159", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#F2501F", // 城市颜色
              },
            },
          },
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "开封", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#acb159", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#AF298B", // 整个省份的颜色
              },
            },
          },
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "信阳", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#acb159", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#6739B6", // 整个省份的颜色
              },
            },
          },
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "驻马店", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#acb159", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#39B54A", // 整个省份的颜色
              },
            },
          },
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "南阳", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#e6731c", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#F37B1D", // 整个省份的颜色
              },
            },
          },
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "周口", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#e6731c", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#0081FF", // 整个省份的颜色
              },
            },
          },
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "平顶山", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#e6731c", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#D6E029", // 整个省份的颜色
              },
            },
          },
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "漯河", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#e6731c", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#1FF2CB", // 整个省份的颜色
              },
            },
          },
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "许昌", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#e6731c", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#89AF29", // 整个省份的颜色
              },
            },
          },
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "洛阳", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#e6731c", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#9C26B0", // 整个省份的颜色
              },
            },
          },
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "三门峡", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#e6731c", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#21D1F2", // 整个省份的颜色
              },
            },
          },
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "济源", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#e6731c", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#24A7F2", // 整个省份的颜色
              },
            },
          },
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "新乡", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#e6731c", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#FBBD08", // 整个省份的颜色
              },
            },
          },
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "焦作", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#e6731c", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#A5673F", // 整个省份的颜色
              },
            },
          },
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "安阳", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#e6731c", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#A7F22E", // 整个省份的颜色
              },
            },
          },
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "鹤壁", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#e6731c", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#AFAA29", // 整个省份的颜色
              },
            },
          },
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "濮阳", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#e6731c", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#E03997", // 整个省份的颜色
              },
            },
          },
          {
            // 重点 部分 ,在这里给大家模拟一个省份颜色与界线颜色的修改,如果想修改多个省份就在后面多添加几个对象即可.
            name: "商丘", // 对应的是import "./china"  数据中的名称如: name: "广东省"(下面有截图)
            itemStyle: {
              normal: {
                opacity: 0.5, // 透明度
                borderColor: "#e6731c", // 省份界线颜色
                borderWidth: 0.5, // 省份界线的宽度
                areaColor: "#1CBBB4", // 整个省份的颜色
              },
            },
          },
        ],
      },
      series: [
        {
          name: "henan",
          type: "map",
          mapType: "henan", // 自定义扩展图表类型
          // layoutCenter: ['50%', '50%'],
          // layoutSize: "80%",     
          itemStyle: {
            normal: {
              borderWidth: 1, //区域边框宽度
              borderColor: "#58B9E8", //区域边框颜色
              areaColor: "#ffefd5", //区域颜色
              label: {
                show: true,
                textStyle: {
                  color: "#000",
                  //fontWeight: 600,
                  //fontSize: 13,
                },
              },
            },
            emphasis: {
              areaColor: "#13335A",
              borderColor: "#89b7e5",
              borderWidth: 1,
              shadowOffsetY: 5,
              shadowColor: "#1863DE",
              label: {
                show: true,
                textStyle: {
                  color: "#fff",
                },
              },
            },
          },
        },
      ],        
    };
    // 图表初始化配置
    chartInstance.value.setOption(initOption);
    // 鼠标移入停止定时器
    chartInstance.value.on("mouseover", () => {
      clearInterval(tooltipTimer.value);
    });

    // 鼠标移入启动定时器
    chartInstance.value.on("mouseout", () => {
      gettooltipTimer();
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
    const dataOption = {};
    // 图表数据变化配置
    chartInstance.value.setOption(dataOption);
  }

  const screenAdapter = () => {
    let titleFontSize = Math.round(refChart.value.offsetWidth / 50);
    const adapterOption = {
      title: {
        textStyle: {
          fontSize: Math.round(titleFontSize * 1.8),
        },
      },
      series: [
        {
          itemStyle: {
            normal: {
              label: {
                textStyle: {
                  fontWeight: Math.round(titleFontSize * 100),
                  fontSize: Math.round(titleFontSize * 1.2),
                },
              },
            },
          },
        },
      ],                
      // // 圆点分类标题
      // legend: {
      //   textStyle: {
      //     fontSize: Math.round(titleFontSize / 1.2),
      //   },
      // },
      // xAxis: {
      //   //  改变x轴字体颜色和大小
      //   axisLabel: {
      //     textStyle: {
      //       fontSize: Math.round(titleFontSize * 0.8),
      //     },
      //   },
      // },
      // yAxis: {
      //   //  改变y轴字体颜色和大小
      //   axisLabel: {
      //     textStyle: {
      //       fontSize: Math.round(titleFontSize * 0.8),
      //     },
      //   },
      // },
    };
    // 图表自适应变化配置
    chartInstance.value.setOption(adapterOption);
    chartInstance.value.resize();
  }

  // 定时器
  const gettooltipTimer = () => {
    let index = 0; // 播放所在下标
    tooltipTimer.value = setInterval(() => {
      // 执行刷新数据的方法
      getData();
      // echarts实现定时播放tooltip
      chartInstance.value.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: index
      });
      index++;
      if(index > 18) {
        index = 0;
      }      
      //console.log("Hello World->"+allData.length)
    }, 2000)
  }    
</script>
<style lang='scss' scoped>

</style>