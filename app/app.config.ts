export default defineAppConfig({
  title: 'CEM QR Generator',
  email: 'christianbathie@cem.com.au',
  github: 'https://github.com/CEM-Christian/cem-qr-sink',
  description: 'A Link Shortener and QR Code Generator with Analytics.',
  image: 'https://sink.cool/banner.png',
  previewTTL: 300, // 5 minutes
  slugRegex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
  reserveSlug: [
    'dashboard',
  ],
})
