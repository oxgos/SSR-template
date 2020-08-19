<template>
  <div class='foo'>Foo: {{ userName }}</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Foo',
  asyncData ({ store, route }) {
    console.log(route)
    // 触发 action 后，要返回 Promise(PS: 因为在entry-server里,要用Promise.all处理所有组件的asyncData)
    return store.dispatch('updateItemsAction', { id: 'user_name', name: route.name,  })
  },
  computed: {
    userName () {
      return this.$store.getters.userName
    }
    // ...mapGetters([
    //   'userName'
    // ])
  }
}
</script>
<style lang="less" scoped>
  .foo {
    color: red;
  }
</style>