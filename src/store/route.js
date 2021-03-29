import { routes as constantRoutes } from '../router'

const state = {
  routes: constantRoutes,
  routesLoaded: false
};
const mutations = {
  SET_ROUTES(state, routes) {
    state.routes = constantRoutes.concat(routes)
  },
  SET_ROUTESLOADED(state, status) {
    state.routesLoaded = status
  },
  RESET_ROUTES(state) {
    state.routes = constantRoutes
    state.routesLoaded = false
  }
}
const actions = {
  async getPowerRoutes() {
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}