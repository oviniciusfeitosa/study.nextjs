// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [{ hostname: "lh3.googleusercontent.com" }],
	},
	// async redirects() {
  //   return [
  //     {
  //       source: '/auth/login',
  //       destination: '/login',
  //       permanent: true,
  //     },
  //   ];
  // },

};

export default nextConfig;