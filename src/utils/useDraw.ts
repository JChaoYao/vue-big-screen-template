import { filterFields } from "element-plus/es/components/form/src/utils"

export default function useDraw() {
    // 容器
    const appRef = ref()

    // 定时器
    const timer = ref()
    // 默认缩放值
    const scale = {
        width: '1',
        height: '1'
    }

    // 设计稿宽
    const baseWidth = 1920

    // 设计稿高
    const baseHeight = 1080

    // 设计稿宽高比
    const baseRate = parseFloat((baseWidth / baseHeight).toFixed(5))

    const calcRate = () => {
        // 当前宽高比
        const currentRate = parseFloat((window.innerWidth / window.innerHeight).toFixed(5))
        if (appRef.value) {
            if (currentRate > baseRate) {
                // 表示更宽
                scale.width = ((window.innerHeight * baseRate) / baseWidth).toFixed(5)
                scale.height = (window.innerHeight / baseHeight).toFixed(5)
                appRef.value.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%,-50%)`
            } else {
                // 表示更高
                scale.height = ((window.innerHeight / baseRate) / baseHeight).toFixed(5)
                scale.width = (window.innerWidth / baseWidth).toFixed(5)
                appRef.value.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%,-50%)`
            }
        }

    }

    const resize = () => {
        clearTimeout(timer.value)
        timer.value = setTimeout(() => {
            calcRate()
        }, 200)
    }

    const windowDraw = () => {
        window.addEventListener('resize', resize)
    }

    const unWindowDraw = () => {
        window.removeEventListener('resize', resize)
    }

    return {
        windowDraw,
        unWindowDraw,
        calcRate,
        appRef
    }
}