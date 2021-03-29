import { createStore } from 'vuex';
import route from './route'

export default createStore({
  state: {
    sidebarOpened: false,
    count: 0,
  },
  getters: {
    getSidebarOpened: (state) => {
      return state.sidebarOpened;
    },
    getCount: (state)=>{
      return state.count
    }
  },
  mutations: {
    setSidebarOpened(state) {
      state.sidebarOpened = !state.sidebarOpened;
    },
    setCount(state, val) {
      state.count += val 
    }
  },
  actions: {},
  modules: {
    route
  }
})