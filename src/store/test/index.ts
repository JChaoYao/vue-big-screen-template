import { defineStore } from 'pinia'

// 定义store，第一个参数是应用程序中 store 的唯一 id
export const testStore = defineStore('testStore', {
    state: () => {
        return {
            count: 0
        }
    },
    getters: { // 不能使用像state一样的箭头函数
        getCount(state) {
            return state.count
        }
    },
    actions: { // 不能使用像state一样的箭头函数
        setCount(count: number) {
            console.log(count)
            this.count = count;
        }
    },
    // 开启数据缓存，数据默认是存在sessionStorage
    persist: {
        enabled: true,
        strategies: [
            {
              key: 'testCache',//设置存储的key
              // storage: localStorage,//表示存储在localStorage
            }
          ]
    }
   
    // 默认所有 state 都会进行缓存,如果你不想所有的数据都持久化存储，那么可以通过 paths 指定要长久化的字段，其余的字段则不会进行长久化
    // persist: {
    //     enabled: true,
    //     strategies: [
    //       {
    //         storage: localStorage,
    //         paths: ['id'],//指定要长久化的字段
    //       }
    //     ]
    //   }
})