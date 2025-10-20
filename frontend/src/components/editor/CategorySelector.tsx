import "./CategorySelector.css"

import { createSignal, For } from "solid-js"

import { categories, getCategoryIcon } from "@/store/categories"

interface CategorySelectorProps {
    value: number
    onChange: (value: number) => void
}

const CategorySelector = (props: CategorySelectorProps) => {
    const [showDropdown, setShowDropdown] = createSignal(false)
    const get_category = () => {
        return categories.find((category) => category.id === props.value)?.name
    }

    return (
        <div class="editor-meta-input-wrapper">
            <div
                class="editor-meta-category-input no-select"
                onClick={() =>
                    setShowDropdown((prev) => {
                        return !prev
                    })
                }
            >
                <img
                    src={`/${getCategoryIcon(props.value)}`}
                    class="category-dropdown-item-icon"
                />
                <span class="category-dropdown-item-text">
                    {get_category() || "请选择分类"}
                </span>
            </div>
            <div
                class="category-dropdown no-select"
                classList={{ open: showDropdown() }}
            >
                <For each={categories}>
                    {(option) => (
                        <div
                            onClick={() => {
                                props.onChange(option.id)
                                setShowDropdown(false)
                            }}
                        >
                            <img
                                src={`/${option.icon}`}
                                class="category-dropdown-item-icon"
                            />
                            <span class="category-dropdown-item-text">
                                {option.name}
                            </span>
                        </div>
                    )}
                </For>
            </div>
        </div>
    )
}

export default CategorySelector
