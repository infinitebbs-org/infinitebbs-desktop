import "./Home.css"

interface HomeProps {
  username: string
  onLogout: () => void
}

function Home(props: HomeProps) {
  return (
    <div class="home-page">
      <header class="home-header">
        <h1>欢迎来到 InfiniteBBS</h1>
        <div class="user-info">
          <span>当前用户: {props.username}</span>
          <button onClick={props.onLogout}>退出登录</button>
        </div>
      </header>
      <main class="home-content">
        <h2>首页内容</h2>
        <p>您已成功登录！</p>
      </main>
    </div>
  )
}

export default Home
