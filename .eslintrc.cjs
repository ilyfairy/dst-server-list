module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-essential",
    "@vue/typescript/recommended",
    // "@vue/prettier",
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "vue"],
  rules: {
    "@typescript-eslint/no-explicit-any": ["off"], // 是否允许使用any类型
    "@typescript-eslint/no-unused-vars": ["off"], // 已声明但未使用
    // "@typescript-eslint/consistent-type-exoprts": "error",
    // "@typescript-eslint/consistent-type-imports": "error",
  },
};

// module.exports = {
//   root: true,
//   env: {
//     node: true,
//   },
//   extends: [
//     "plugin:vue/vue3-recommended",
//     // "eslint:recommended",
//     // "@vue/typescript/recommended",
//     "@vue/prettier",
//     // "@vue/prettier/@typescript-eslint",
//   ],
//   parserOptions: {
//     parser: "@typescript-eslint/parser",
//     ecmaVersion: 2020,
//   },
//   plugins: ["vue", "@typescript-eslint"],
//   rules: {
//     // "vue/attribute-hyphenation": "off",
//     // "vue/require-default-prop": "off",
//     // "vue/no-multiple-template-root": "off",
//     // "vue/component-tags-order": [
//     //   "error",
//     //   {
//     //     order: ["template", "script", "style"],
//     //   },
//     // ],
//     // "prettier/prettier": [
//     //   "error",
//     //   {
//     //     singleQuote: true,
//     //     trailingComma: "es5",
//     //   },
//     // ],
//   },
// };

// module.exports = {
//   env: {
//     browser: true,
//     es2021: true,
//   },
//   extends: [
//     "eslint:recommended",
//     "plugin:@typescript-eslint/recommended",
//     "plugin:vue/vue3-essential",
//   ],
//   overrides: [
//     {
//       env: {
//         node: true,
//       },
//       files: [".eslintrc.{js,cjs}"],
//       parserOptions: {
//         sourceType: "script",
//       },
//     },
//   ],
//   parserOptions: {
//     parser: "@typescript-eslint/parser",
//     ecmaVersion: "latest",
//     sourceType: "module",
//   },
//   plugins: ["@typescript-eslint", "vue"],
//   rules: {
//     "@typescript-eslint/no-explicit-any": ["off"], // 是否允许使用any类型
//     "@typescript-eslint/no-unused-vars": ["off"], // 已声明但未使用
//   },
// };
