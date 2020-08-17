const Vue = require('vue')

module.exports = function createApp(context) {
  return new Vue({
    data: {
      url: context.url
    },
    template: `<div>访问的url是: {{ url }}</div>`
  })
}
