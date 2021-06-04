#! /usr/local/bin/node

const path = require('path')
const theme = require('./deploy/theme/theme.js')

const resolve = dir => {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: '',
    lintOnSave: true,
    devServer: {
        overlay: {
            warnings: false,
            errors: true
        },
        hot: false,
        // disableHostCheck: true
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set('_c', resolve('src/components'))
            .set('_rcs', resolve('src/providers/rcs')) // 中台接口providers
            .set('_hub', resolve('src/providers/hub')) // 聚合层接口providers
        config.module
            .rule('less')
            .oneOf('vue')
            .use('px2rem-loader')
            .loader('px2rem-loader')
            .before('postcss-loader')
            .options({
                remUnit: 75
            })
            .end()
    },
    configureWebpack: {
        externals: {
            globalConfig: "window.globalConfig"
            // wx: "window.wx"
        }
    },
    // 打包时不生成.map文件
    productionSourceMap: true,
    pluginOptions: {
        "style-resources-loader": {
            preProcessor: "less",
            patterns: [path.resolve(__dirname, "src/assets/css/base.less")]
        }
    },
    css: {
        loaderOptions: {
            less: {
                modifyVars: theme
            },
            postcss: {
                plugins: [
                    require('postcss-plugin-px2rem')({
                        rootValue: 37.5,
                        exclude: false,
                        mediaQuery: false,
                        minPixelValue: 0
                    })
                ]
            }
        }
    }
}
