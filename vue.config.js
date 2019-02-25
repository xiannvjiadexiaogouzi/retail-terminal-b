// //配置sass
// const fs = require('fs')
module.exports = {
    // css: {
    //     // 向所有 Sass 样式传入共享的全局变量
    //     loaderOptions: {
    //         // 给 sass-loader 传递选项
    //         sass: {
    //             // @/ 是 src/ 的别名
    //             // 所以这里假设你有 `src/variables.scss` 这个文件
    //             data: `@import "@/variables.scss";`
    //         }
    //     }
    // }

    baseUrl: './', //default ? 报错 ?
    // lintOnSave: true, //default
    //代理服务器
    devServer: {
        // // 设置主机地址
        // host: 'localhost',
        // // 设置默认端口
        // port: 8080,
        // 设置代理 (在有后端接口的情况下)
        proxy: {
            'api': {
                // 目标 API 地址
                target: 'http://47.107.167.164:8080',
                // 如果要代理 websockets
                ws: true,
                // 将主机标头的原点更改为目标URL
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '' //代理的路径
                },
            },
        },
    }
}