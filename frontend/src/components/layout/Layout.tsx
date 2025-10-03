import { RouterProps } from "@solidjs/router"
import { JSX } from "solid-js"
import { A } from "@solidjs/router"
import { HiOutlineHome, HiOutlineUser } from "solid-icons/hi"
import "./Layout.css"

const Layout = (props: RouterProps) => {
    return (
        <div class="layout">
            <aside class="sidebar" role="navigation" aria-label="主导航">
                <ul class="nav-list">
                    <li class="nav-item">
                        <A href="/home" class="nav-link">
                            <HiOutlineHome class="icon" />
                            <span class="nav-label">话题</span>
                        </A>
                    </li>
                    <li class="nav-item">
                        <A href="/profile" class="nav-link">
                            <HiOutlineUser class="icon" />
                            <span class="nav-label">用户信息</span>
                        </A>
                    </li>
                </ul>
            </aside>
            <main class="content">{props.children as JSX.Element}</main>
        </div>
    )
}

export default Layout
