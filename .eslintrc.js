// https://eslint.org/docs/user-guide/configuring

module.exports = {
  env: {
    "node": true,
    "es6": true,
    "mocha": true
  },
  parserOptions: {
    "parser": "babel-eslint",
    "ecmaVersion": 8,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ["plugin:vue/strongly-recommended"],
  // required to lint *.vue files
  plugins: [
    "vue"
  ],
  rules: {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "keyword-spacing": [
      "error"
    ],
    "object-curly-spacing": [
      "error",
      "always"
    ],
    "no-trailing-spaces": [
      "error"
    ],

    // eslint-plugin-vue overrides
    "vue/attributes-order": ["error", {
      "order": ["DEFINITION", "LIST_RENDERING", "CONDITIONALS", "RENDER_MODIFIERS", "GLOBAL", "UNIQUE", "BINDING", "OTHER_ATTR", "EVENTS", "CONTENT"]
    }],
    "vue/max-attributes-per-line": ["error", {
      "singleline": 2,
      "multiline": {
        "max": 2,
        "allowFirstLine": true
      }
    }],
    "vue/require-default-prop": "off",
  }
};