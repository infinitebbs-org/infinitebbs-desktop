import { fetchUserInfo, userState } from "@/store/user"
import "./Profile.css"
import { onMount } from "solid-js"

const Profile = () => {
    onMount(() => {
        if (!userState.user) {
            fetchUserInfo()
        }
    })

    const user = () =>
        userState.user || {
            id: "-",
            info: {
                name: "-",
                coin: 0,
                bean: 0,
                premium: { is_active: false, expires_at: null },
            },
            roles: [],
        }

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
                                    <div class="role-badge">
                                        {user().roles.join(", ")}
                                    </div>
                                )}
                            </div>
                            <div class="premium-icon">
                                <img
                                    src={
                                        user().info.premium?.is_active
                                            ? "/premium.svg"
                                            : "/unpremium.svg"
                                    }
                                    alt="会员状态"
                                    title={
                                        user().info.premium?.is_active
                                            ? `会员到期时间: ${
                                                  user().info.premium
                                                      ?.expires_at || "未知"
                                              }`
                                            : "请激活会员"
                                    }
                                />
                            </div>
                            <div class="id-badge">ID: {user().id ?? "-"}</div>
                        </div>

                        {/* external assets: placed outside the main card with spacing */}
                        <div class="assets-container">
                            <div class="assets-row">
                                <div class="asset-card">
                                    <img
                                        src="/gold_coin.svg"
                                        alt="金币"
                                        class="asset-icon"
                                    />
                                    <div class="asset-amount">
                                        {Math.floor(user().info.coin / 10000)}
                                    </div>
                                </div>
                                <div class="asset-card">
                                    <img
                                        src="/silver_coin.svg"
                                        alt="银币"
                                        class="asset-icon"
                                    />
                                    <div class="asset-amount">
                                        {Math.floor(
                                            (user().info.coin % 10000) / 100
                                        )}
                                    </div>
                                </div>
                                <div class="asset-card">
                                    <img
                                        src="/copper_coin.svg"
                                        alt="铜币"
                                        class="asset-icon"
                                    />
                                    <div class="asset-amount">
                                        {user().info.coin % 100}
                                    </div>
                                </div>
                                <div class="asset-card">
                                    <img
                                        src="/bean.svg"
                                        alt="豆子"
                                        class="asset-icon"
                                    />
                                    <div class="asset-amount">
                                        {user().info.bean}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Profile
