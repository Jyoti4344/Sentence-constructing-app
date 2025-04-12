const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/questions',
        destination: '/api/questions',
      },
    ]
  },
}

export default nextConfig
