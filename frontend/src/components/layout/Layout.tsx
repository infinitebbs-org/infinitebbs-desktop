import "./Layout.css"

import { RouterProps } from "@solidjs/router"
import { A } from "@solidjs/router"
import { JSX } from "solid-js"

import editorStore from "@/store/editor"

const Layout = (props: RouterProps) => {
    return (
        <div class="layout">
            <aside class="sidebar" role="navigation" aria-label="主导航">
                <div class="sidebar-top">
                    <div class="user-avatar" title="用户头像">
                        <A href="/profile">
                            <img
                                src="https://picsum.photos/100/100"
                                alt="用户头像"
                            />
                        </A>
                    </div>
                    <div class="nav-item" title="话题">
                        <A
                            href="/"
                            class="nav-link"
                            activeClass="active"
                            end={true}
                        >
                            <img src="/layers.svg" class="nav-icon" />
                        </A>
                    </div>

                    <div class="nav-item" title="裁决">
                        <img src="/law.svg" class="nav-icon" />
                    </div>
                </div>
                <div class="sidebar-bottom">
                    <div
                        class="nav-item"
                        onClick={() => editorStore.actions.openEditor("create")}
                        title="新建"
                    >
                        <img src="/edit.svg" class="nav-icon" />
                    </div>
                    <div class="nav-item" title="设置">
                        <A
                            href="/settings"
                            class="nav-link"
                            activeClass="active"
                        >
                            <img src="/settings.svg" class="nav-icon" />
                        </A>
                    </div>
                </div>
            </aside>
            <div class="content-area">
                <header data-tauri-drag-region class="top-bar" />
                <main class="content">{props.children as JSX.Element}</main>
            </div>
        </div>
    )
}

export default Layout
