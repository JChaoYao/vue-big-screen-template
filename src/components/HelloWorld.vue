<template>
  <h1>HelloWorld</h1>
  <h2>没有安装axios和DataV</h2>
  <h2>解构方式获取值：{{ count1 }}</h2>
  <h2>计算属性获取值：{{ count2 }}</h2>
  <h2>计算属性获取值（getters）：{{ count3 }}</h2>
  <el-button @click="addBtn1">确定+1</el-button>
  <el-button @click="addBtn2">确定+1</el-button>
  <el-button @click="addBtn3">确定+1</el-button>
  <el-button @click="addBtn4">确定+1</el-button>
  <el-button @click="addBtn5">确定+1</el-button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { testStore } from "@/store/test/index";
import { storeToRefs } from "pinia"; // pinia解决使用结构方式造成数据丢失响应式问题

const store = testStore();
// 1、获取store里面的count 解构的方式，会使数据丢失响应式
const { count: count1 } = storeToRefs(store);
console.log("数值：",count1);
const addBtn1 = () => {
  store.count ++;
}
// 2、通过计算属性获取响应式
const count2 = computed(() => {
  return store.count;
});
const addBtn2 = () => {
  store.count ++;
}
// 3、通过计算属性获取响应式（getters）
const count3 = computed(() => {
  return store.getCount;
});
const addBtn3 = () => {
  store.count ++;
}

// 4、actions
const addBtn4 = () => {
  store.setCount(++store.count);
}

const addBtn5 = () => {
  //第一种改变数据的方式
  // store.count++;
  //第二种改变数据的方式
  // store.setCount(++store.count);
  //第三种改变数据的方式
  // store.$patch({
  //   count: ++store.count,
  // });
  //第四种改变数据的方式
  store.$patch((state)=>{
    state.count = ++state.count 
  })
}

</script>

<style scoped>
</style>
