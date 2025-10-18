import "./Loading.css"

import { ThreeDots } from "solid-spinner"

const Loading = () => {
    return (
        <div class="loading-container">
            <div class="loading-content">
                <ThreeDots color="#4a9eff" width={60} height={60} />
            </div>
        </div>
    )
}

export default Loading
