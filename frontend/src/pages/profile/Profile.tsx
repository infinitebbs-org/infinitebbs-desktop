import "./Profile.css"

import AssetCard from "@/components/assetcard/AssetCard"
import { logout, userState } from "@/store/user"

const Profile = () => {
    const user = () => userState.user!

    // 提取货币计算逻辑
    const gold = Math.floor(user().info.coin / 10000)
    const silver = Math.floor((user().info.coin % 10000) / 100)
    const copper = user().info.coin % 100
    const bean = user().info.bean

    // 提取会员状态逻辑
    const premiumSrc = user().info.premium?.is_active
        ? "/premium.svg"
        : "/unpremium.svg"
    const premiumTitle = user().info.premium?.is_active
        ? `会员到期时间: ${user().info.premium?.expires_at || "未知"}`
        : "请激活会员"

    // 提取用户角色逻辑
    const rolesString = user().roles.join(", ")

    return (
        <div class="profile-page">
            <div class="profile-wrapper">
                {userState.isLoading && (
                    <div class="status">正在加载用户信息…</div>
                )}
                {userState.error && (
                    <div class="status error">错误: {userState.error}</div>
                )}

                {user() && (
                    <>
                        <div class="profile-card">
                            <div class="avatar-section">
                                <img
                                    class="avatar"
                                    src="https://picsum.photos/100/100"
                                    alt="用户头像"
                                />
                            </div>
                            <div class="info-section">
                                <div class="name">
                                    {user().info.name ?? "-"}
                                </div>
                                {user().roles.length > 0 && (
                                    <div class="role-badge">{rolesString}</div>
                                )}
                            </div>
                            <div class="premium-icon">
                                <img
                                    src={premiumSrc}
                                    alt="会员状态"
                                    title={premiumTitle}
                                />
                            </div>
                            <div class="id-badge">ID: {user().id ?? "-"}</div>
                        </div>

                        <div class="assets-container">
                            <div class="assets-row">
                                <AssetCard
                                    iconSrc="/gold_coin.svg"
                                    alt="金币"
                                    amount={gold}
                                />
                                <AssetCard
                                    iconSrc="/silver_coin.svg"
                                    alt="银币"
                                    amount={silver}
                                />
                                <AssetCard
                                    iconSrc="/copper_coin.svg"
                                    alt="铜币"
                                    amount={copper}
                                />
                                <AssetCard
                                    iconSrc="/bean.svg"
                                    alt="豆子"
                                    amount={bean}
                                />
                            </div>
                        </div>

                        {/* 登出按钮 */}
                        <div class="logout-section">
                            <button class="logout-button" onClick={logout}>
                                登出
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Profile
