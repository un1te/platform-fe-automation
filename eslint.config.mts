import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: [
			"node_modules",
			"dist",
			"build",
			"allure-report",
			"allure-results",
			"playwright-report",
			"test-results",
			"screenshots",
			".git",
			"coverage",
		],
	},
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser,
			},
			parser: tseslint.parser,
			parserOptions: {
				sourceType: "module",
				ecmaVersion: "latest",
			},
		},
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["**/*.ts"],
		rules: {
			// Core ESLint rules
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"no-debugger": "warn",
			"no-var": "error",
			"prefer-const": "error",
			"prefer-arrow-callback": "warn",
			indent: ["error", "tab"],
			"linebreak-style": ["error", "unix"],
			quotes: ["error", "double"],
			semi: ["error", "always"],
			"comma-dangle": ["error", "always-multiline"],
			"no-trailing-spaces": "error",
			"space-before-function-paren": [
				"error",
				{
					anonymous: "always",
					named: "never",
					asyncArrow: "always",
				},
			],
			"keyword-spacing": "error",
			"space-before-blocks": "error",
			"object-curly-spacing": ["error", "always"],
			"array-bracket-spacing": ["error", "never"],
			"eqeqeq": ["error", "always"],
			"no-else-return": "warn",

			// TypeScript specific rules
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/no-explicit-any": "warn",
		},
	},
	{
		files: ["tests/**/*.ts", "**/*.spec.ts", "**/*.test.ts"],
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
		},
	},
);
