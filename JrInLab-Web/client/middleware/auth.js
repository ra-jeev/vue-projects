export default (context) => {
  const { store, route, redirect } = context
  const isLoggedIn = store.getters['user/isLoggedIn']

  if (
    (route.path.includes('/admin') || route.path.includes('/documents')) &&
    !isLoggedIn
  ) {
    redirect('/sign-in', { next: route.path.substring(1) })
    return
  }

  if (route.path.includes('/sign-in') && isLoggedIn) {
    redirect('/admin')
    return
  }

  if (route.path === '/sign-out' && isLoggedIn) {
    store.dispatch('user/signOut')
    redirect('/')
  }
}
