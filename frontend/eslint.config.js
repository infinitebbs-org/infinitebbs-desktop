import js from "@eslint/js"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import solid from "eslint-plugin-solid"
import simpleImportSort from "eslint-plugin-simple-import-sort"

export default [
    js.configs.recommended,
    {
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
            globals: {
                console: "readonly",
                document: "readonly",
                window: "readonly",
                localStorage: "readonly",
                fetch: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                AbortController: "readonly",
                RequestInit: "readonly",
                HTMLElement: "readonly",
                HTMLDivElement: "readonly",
                MouseEvent: "readonly",
                Event: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            solid,
            "simple-import-sort": simpleImportSort,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            ...solid.configs.recommended.rules,
            "@typescript-eslint/no-explicit-any": "off",
            "solid/no-innerhtml": "off",
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            // 自定义规则可以在这里添加
        },
    },
    {
        ignores: ["dist/**", "node_modules/**"],
    },
]
