module.exports = {
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    rootDir: __dirname,
    testURL: 'http://localhost',
    testMatch: ['<rootDir>/__tests__/**/*spec.@(js|ts)?(x)'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};
