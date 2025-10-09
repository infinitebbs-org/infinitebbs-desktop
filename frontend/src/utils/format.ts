export const formatViewCount = (count: number) => {
    return count > 1000 ? `${(count / 1000).toFixed(1)}k` : count.toString()
}