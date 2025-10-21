import { createSignal } from "solid-js"

// 全局 tick 信号，用于强制刷新时间显示
export const [tick, setTick] = createSignal(0)

export const start_tick_timer = () => {
    // 启动计时器
    setTick((prev) => prev + 1)
    window.setTimeout(() => {
        start_tick_timer()
    }, 10000)
}

export const formatActivityTime = (createdAt: string): string => {
    // 依赖全局 tick 以强制刷新
    tick()
    const now = new Date()
    const created = new Date(createdAt)
    const diff = now.getTime() - created.getTime()

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    // 1小时内显示分钟
    if (minutes < 60) return `${minutes} 分钟`

    // 24小时内显示小时
    if (hours < 24) return `${hours} 小时`

    // 30天内显示天数
    if (days < 30) return `${days} 天`

    // 同年显示月日
    if (now.getFullYear() === created.getFullYear()) {
        const month = created.getMonth() + 1
        const day = created.getDate()
        return `${month} 月 ${day} 日`
    }

    // 不同年显示年月
    const year = created.getFullYear()
    const month = created.getMonth() + 1
    return `${year} 年 ${month} 月`
}
export const formatFullDateTime = (createdAt: string): string => {
    const date = new Date(createdAt)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    return `${year} 年 ${month} 月 ${day} 日 ${hours}:${minutes}`
}
