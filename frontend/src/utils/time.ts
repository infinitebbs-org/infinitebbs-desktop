export const formatActivityTime = (createdAt: string): string => {
    const now = new Date()
    const created = new Date(createdAt)
    const diff = now.getTime() - created.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (minutes < 60) return `${minutes} 分钟`
    if (hours < 24) return `${hours} 小时`
    return `${days} 天`
}