module.exports = {
    preset: 'react-native',
    transform: {
        '^.+\\.[tj]sx?$': 'babel-jest',
    },
    testMatch: ['**/tests/**/*.test.js'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironment: 'node',

    // 👇 Ignora la carpeta de integración (Appium) y archivos RN problemáticos
    testPathIgnorePatterns: ['/node_modules/', '/tests/integration/'],

    // 👇 Esto evita que Jest procese archivos con sintaxis TS del core RN
    transformIgnorePatterns: [
        'node_modules/(?!(@react-native|react-native|expo|@expo|react-clone-referenced-element)/)',
    ],

    // 👇 Ignora el setup del core RN (culpable del error)
    setupFiles: [],
};
