import "./Loading.css"

import { ThreeDots } from "solid-spinner"

const SmallLoading = () => {
    return (
        <div class="small-loading-container">
            <ThreeDots color="#4a9eff" width={30} height={30} />
        </div>
    )
}

export default SmallLoading
