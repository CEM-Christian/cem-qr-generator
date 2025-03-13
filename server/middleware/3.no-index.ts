export default defineEventHandler((event) => {
  appendHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
})
