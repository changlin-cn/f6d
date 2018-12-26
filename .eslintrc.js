module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es6": true
    },
    globals:{

    },
    plugins:["prettier"],
    parser:'babel-eslint',
    "extends": ["eslint:recommended"],
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module"
    },
    "rules": {
       "no-console":0,
       "prettier/prettier": "error"
    }
}
