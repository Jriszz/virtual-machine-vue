const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  avatar: state => state.users.sessionUser.avatar,
  name: state => state.users.sessionUser.name,
  roles: state => state.users.sessionUser.roles || [],
  permission_routes: state => state.permission.routes
}
export default getters
