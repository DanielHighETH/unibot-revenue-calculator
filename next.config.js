/** @type {import('next').NextConfig} */
const nextConfig = {
    serverRuntimeConfig: {
        startFetch: false,
    },
}

module.exports = {
    nextConfig,
    async redirects() {
        return [
            {
                source: '/',
                destination: 'https://unibot-revenue-calculator.com/',
                permanent: true,
            },
            {
                source: '/about',
                destination: 'https://unibot-revenue-calculator.com/about',
                permanent: true,
            },
        ]
    }
}