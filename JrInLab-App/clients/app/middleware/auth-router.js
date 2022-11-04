export default async ({ store, route, redirect, from }) => {
  const isLoggedIn = store.getters.isAuthenticated

  console.log(
    `auth middleware: route.path: ${route.path}, isLoggedIn: ${isLoggedIn}, from: `,
    from,
    ' route',
    route
  )

  if (
    !['/sign-in', '/sign-up', '/verify-email'].includes(route.path) &&
    !isLoggedIn
  ) {
    console.log('auth middleware:: redirecting to sign in page')
    redirect('/sign-in')
    return
  }

  if (
    ['/sign-in', '/sign-up', '/verify-email'].includes(route.path) &&
    isLoggedIn
  ) {
    console.log('auth middleware:: redirecting to index page')
    redirect('/')
    return
  }

  if (route.name !== 'projects-id' && from.name === 'projects-id') {
    console.log('navigating away, so save the project ===============')
    store.commit('saveCode', true)
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 50)
    })
  }
}
