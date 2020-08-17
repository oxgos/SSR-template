<template>
  <div class='bar'>Bar</div>
</template>

<script>
import barStoreModule from '../store/modules/bar'

export default {
  name: 'Bar',
  asyncData({ store }) {
    // 使用 store.registerModule 惰性注册(lazy-register)这个模块
    store.registerModule('bar', barStoreModule)
    return store.dispatch('bar/inc')
  },
  methods: {
      
  },
}
</script>
<style lang="less" scoped>
  .bar {}
</style>