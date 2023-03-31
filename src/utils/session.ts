/** 封装session工具类 */
const koi: any = window.sessionStorage;
export default {
    // 获取session
    getItem(key: string | number) {
        try {
            return JSON.parse(koi.getItem(key));
        } catch (err) {
            return null;
        }
    },
    // 赋值session
    setItem(key: string | number, val: string | number) {
        koi.setItem(key, JSON.stringify(val));
    },
    // 清除所有session
    clear() {
        koi.clear();
    },
    // 获取session值索引
    keys(index: number) {
        return koi.key(index);
    },
    // 清除固定key的session值
    removeItem(key: string | number) {
        koi.removeItem(key);
    }
}