/** @type {import('next').NextConfig} */
const nextConfig = {
    serverRuntimeConfig: {
        startFetch: false,
    },
}

module.exports = {
    ...nextConfig,
    async redirects() {
        if (process.env.NODE_ENV !== 'development') {
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
            ];
        }
        return [];
    }
}
