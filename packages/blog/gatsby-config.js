module.exports = {
  plugins: [
    {
      resolve: `gatsby-theme-blog`,
      options: {},
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-147674244-1",
        anonymize: true,
        respectDNT: true,
      },
    },
  ],
  siteMetadata: {
    title: `Pair-Roulette`,
    author: `Charles-Henri GUERIN`,
    description: `Toutes les nouveautés sur Pair-Roulette.`,
    social: [
      {
        name: `Charles-Henri GUERIN`,
        url: `https://charlyx.dev`,
      },
      {
        name: `Yvonnick FRIN`,
        url: `https://yvonnickfrin.dev`,
      },
    ],
  },
}
