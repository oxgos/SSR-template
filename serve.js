const express = require('express')
const server = express()
const path = require('path')
const resolve = file => path.resolve(__dirname, file)

const isProd = process.env.NODE_ENV === 'production'
/**
 * 每次编辑过应用程序源代码之后，都必须停止并重启服务。这在开发过程中会影响开发效率
 * 此外，Node.js 本身不支持 source map
 */
// const createApp = require('./src/entry-server')
// const renderer = require('vue-server-renderer').createRenderer({
//   template: require('fs').readFileSync('./index.template.html', 'utf-8')
// })

// createBundleRenderer用于解决上述问题
const { createBundleRenderer } = require('vue-server-renderer')
const template = require('fs').readFileSync('./index.template.html', 'utf-8')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

// server.use(favicon('./public/logo-48.png'))
server.use('/dist', serve('./dist', true))

server.get('*', (req, res) => {
  res.setHeader("Content-Type", "text/html")
  console.log(`------req.url----`, req.url)
  const context = {
    title: 'ssr模板练习',
    metas: `
      <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
      <meta name="keyword" content="vue,ssr">
      <meta name="description" content="vue srr demo">
    `,
    url: req.url
  }

  // createApp(context)
  //   .then(app => {
  //     renderer.renderToString(app, (err, html) => {
  //       if (err) {
  //         if (err.code === 404) {
  //           res.status(404).end('Page not found')
  //         } else {
  //           res.status(500).end('Internal Server Error')
  //         }
  //       } else {
  //         res.end(html)
  //       }
  //     })
  //   })

  const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false, // 推荐
    template, // （可选）页面模板
    clientManifest // （可选）客户端构建 manifest
  })
  renderer.renderToString(context, (err, html) => {
    console.log(`------err----`, err)
    console.log(`------html----`, html)

    if (err) {
      if (err.code === 404) {
        res.status(404).end('Page not found')
      } else {
        res.status(500).end('Internal Server Error')
      }
    } else {
      res.end(html)
    }
  })

})

const port = process.env.PORT || 8080
server.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
