import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore() {
  return new Vuex.Store({
    state: {
      user: {}
    },
    getter: {
      userName: state => state.user[state.route.name]
    },
    mutations: {
      SET_USER(state, { id, name }) {
        Vue.set(state.user, id, name)
      }
    },
    actions: {
      updateItemsAction({ commit }, { id, name}) {
        commit('SET_USER', { id, name })
        // 一定要返回Promise
        return Promise.resolve()
      }
    }
  })
}
