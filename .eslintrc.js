module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "next",
        "next/core-web-vitals",
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
        'react/react-in-jsx-scope': 'off',
        'react/display-name': 'off',
    }
};