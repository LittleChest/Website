/* eslint-disable no-undef */
export default {
  async fetch(request) {
    const { pathname } = new URL(request.url)
    if (pathname === '/avatar') {
      const avatarResponse = await fetch('https://avatars.githubusercontent.com/u/81231195')
      return new Response(avatarResponse.body, {
        headers: {
          'Cache-Control': 'public, max-age=5',
        },
      })
    }
  },
}
