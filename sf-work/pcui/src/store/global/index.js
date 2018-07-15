import state from './state'
module.exports = {
  state,
  mutations: {
      setUserName(state, userName) {
        state.userName = userName
      },
      setRoleId(state, roleId) {
        state.roleId = roleId
      },
      setArea(state, area) {
        state.area = area
      },
      setSubArea(state, subArea) {
        state.subArea = subArea
      }
  },
  actions: {},
  getters: {}
}