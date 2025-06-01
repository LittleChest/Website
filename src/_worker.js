/* eslint-disable no-undef */
export default {
  async fetch(request) {
    const meta = {
      ip: request.headers.get('cf-connecting-ip'),
      // rayid: request.headers.get('cf-ray'),
      asn: request.cf.asn,
      asorg: request.cf.asOrganization,
      // city: request.cf.city,
      // region: request.cf.region,
      colo: request.cf.colo,
    }
    return new Response(JSON.stringify(meta), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    })
  },
}
