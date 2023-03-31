import { createApp } from 'vue'
import App from './App.vue'
// 引入自定义全局样式
import '@/assets/scss/style.scss'
// 引入路由
import router from './router/index'
// 引入element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 引入Pinia构造函数
import { createPinia } from 'pinia'
// Pinia持久化插件
import piniaPersist from 'pinia-plugin-persist'
// 实例化 Pinia
const pinia = createPinia();
// 使用持久化插件
pinia.use(piniaPersist)
// 引入DataV
import DataVVue3 from '@kjgl77/datav-vue3'
const app = createApp(App);
// 注册路由，扩展两个全局子对象app.config.globalConfigProperties
// $router和$route
app.use(router);
// 注册状态管理(vuex4)，扩展一个全局子对象app.config.globalConfigProperties
// 可以不用局部导入storeimport store from '@/store';[全局用$store也可以]
app.use(pinia);
// 全局注册ElementPlus图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus);
app.use(DataVVue3)
app.mount('#app');