import Vue from 'vue'
import Vuex from 'vuex'

import navBar from './module/navBar'
import caseInfo from './module/caseInfo'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    navBar,
    caseInfo
  }
})
