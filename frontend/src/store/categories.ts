export const categories = [
    {
        id: 1,
        name: "前沿快讯",
        description: "最新的技术动态和趋势",
        topic_count: 0,
        slug: "news",
        icon: "newspaper.svg"
    },
    {
        id: 9,
        name: "明断是非",
        description: "对争议的最终决定",
        topic_count: 0,
        slug: "judgment",
        icon: "law.svg"
    }
]


export const getCategoryIcon = (categoryId: number): string => {
    const category = categories.find((category) => category.id === categoryId)
    return category?.icon || "layers.svg"
}