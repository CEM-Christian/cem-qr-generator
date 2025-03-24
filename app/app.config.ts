export default defineAppConfig({
  title: 'CEM QR Generator',
  email: 'christianbathie@cem.com.au',
  github: 'https://github.com/CEM-Christian/cem-qr-sink',
  description: 'A convenient QR code generator and link shortener for CEM',
  image: 'https://sink.cool/banner.png',
  previewTTL: 300, // 5 minutes
  slugRegex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
  reserveSlug: [
    'dashboard',
  ],
})
