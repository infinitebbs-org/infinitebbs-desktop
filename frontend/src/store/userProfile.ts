import { makeCache } from "@solid-primitives/resource"

import { getUserProfile, UserProfile } from "@/api/user"


const CACHE_DURATION = 60 * 60 * 1000 // 1小时缓存

// 创建带缓存的用户信息获取器
const [userProfileFetcher] = makeCache(
    async (userId: number) => {
        const response = await getUserProfile(userId)
        if (response.success && response.data) {
            console.log("获取用户信息成功:", response.data)
            return response.data
        }
        return null
    },
    {
        cache: {},
        storage: localStorage,
        expires: CACHE_DURATION,
    }
)

const actions = {
    // 获取用户信息（带缓存）
    async fetchUserProfile(userId: number): Promise<UserProfile | null> {
        return userProfileFetcher(userId, {} as any)
    },

}

export default {
    actions,
}
