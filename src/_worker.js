/* eslint-disable no-undef */
export default {
  async fetch(request) {
    const { pathname, searchParams } = new URL(request.url)
    if (pathname === '/avatar') {
      const avatarResponse = await fetch(
        `https://avatars.githubusercontent.com/u/${searchParams.get('user') || '81231195'}`,
      )
      return new Response(avatarResponse.body, {
        headers: {
          'Cache-Control': 'public, max-age=5',
        },
      })
    }
  },
}
