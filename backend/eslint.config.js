import js from '@eslint/js';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    {
        files: ['src/**/*.js', 'tests/**/*.js', '*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.jest
            }
        },
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: 'next' }],
            'no-console': ['warn', { allow: ['warn', 'error', 'info'] }]
        }
    },
    prettierConfig
];
