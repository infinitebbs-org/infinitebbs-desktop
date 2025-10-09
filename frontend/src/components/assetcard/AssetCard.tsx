import "./AssetCard.css"

import { Component } from "solid-js"

interface AssetCardProps {
    iconSrc: string
    alt: string
    amount: number
}

const AssetCard: Component<AssetCardProps> = (props) => {
    return (
        <div class="asset-card">
            <img src={props.iconSrc} alt={props.alt} class="asset-icon" />
            <div class="asset-amount">{props.amount}</div>
        </div>
    )
}

export default AssetCard
