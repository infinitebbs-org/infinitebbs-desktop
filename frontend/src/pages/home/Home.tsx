import "./Home.css"
import { logout } from "@/store/auth"
import { onMount } from "solid-js"
import { userState, fetchUserInfo } from "@/store/user"
import { A } from "@solidjs/router"

const Home = () => {
    onMount(async () => {
        await fetchUserInfo()
    })

    return (
        <div class="home-page">
            <header class="home-header">
                <h1>欢迎来到 InfiniteBBS</h1>
                <div class="user-info">
                    <span>
                        当前用户: {userState.user?.info.name || "加载中..."}
                    </span>
                    <button onClick={logout}>退出登录</button>
                </div>
            </header>
            <main class="home-content">
                <h2>首页内容</h2>
                <p>您已成功登录！</p>
                <A href="/profile">查看用户资料</A>
            </main>
        </div>
    )
}

export default Home
