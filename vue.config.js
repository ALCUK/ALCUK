module.exports = {
    transpileDependencies: ['vuetify'],
    publicPath: '/ALCUK/',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
}
