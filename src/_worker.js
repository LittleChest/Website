/* eslint-disable no-undef */
export default {
  async fetch(request) {
    if (new URL(request.url).pathname === '/avatar') {
      const avatarResponse = await fetch('https://avatars.githubusercontent.com/u/81231195')
      return new Response(avatarResponse.body, {
        headers: {
          'Cache-Control': 'public, max-age=5',
        },
      })
    }
    const meta = {
      ip: request.headers.get('cf-connecting-ip'),
      // rayid: request.headers.get('cf-ray'),
      asn: request.cf.asn,
      asorg: request.cf.asOrganization,
      // city: request.cf.city,
      // region: request.cf.region,
      colo: request.cf.colo,
      pseudo: request.headers.get('cf-pseudo-ipv4'),
    }
    return new Response(JSON.stringify(meta), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    })
  },
}
