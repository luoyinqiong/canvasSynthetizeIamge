export default{
  state: {
    navTitle: '',
    leftArrow: true
  },
  mutations: {
    setNavTitle (state, title) {
      state.navTitle = title
    },
    setLeftArrow (state, leftArrow) {
      state.leftArrow = leftArrow
    }
  },
  action: {
    setNavTitle ({ commit }, title) {
      commit('setNavTitle', title)
    },
    setLeftArrow ({ commit }, leftArrow) {
      commit('setLeftArrow', leftArrow)
    }
  }
}
