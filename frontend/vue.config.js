module.exports = {
    transpileDependencies: ['vuetify'],
    publicPath: '/ALCUK/',
    outputDir: '../backend/public/',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
}
