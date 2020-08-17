const server = require('express')()
const createApp = require('./app')
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./index.template.html', 'utf-8')
})


server.get('*', (req, res) => {
  const context = {
    title: 'ssr模板练习',
    metas: `
      <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
      <meta name="keyword" content="vue,ssr">
      <meta name="description" content="vue srr demo">
    `
  }
  const data = { url: req.url }
  const app = createApp(data)

  res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
  renderer.renderToString(app, context)
    .then(html => {
      console.log(`利用模板后,renderToString: ${html}`)
      res.end(html)
    })
    .catch(err => {
      if (err) {
        res.status(500).end('Internal Server Error')
      }
    })
})

server.listen(8888, () => {
  console.log(`server listen to 8888 port`)
})
