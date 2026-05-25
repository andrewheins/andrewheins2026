export const siteConfig = {
  authorFullName: 'Andrew Heins',
  professionalHeadline: 'President, Cantilever',
  authorBio: "I'm President of Cantilever, a digital agency. I've been on the internet since MUDs and Geocities, and I'm still trying to figure out what we built. I still think we can deliver on the promise we saw in it as kids.",
  employerName: 'Cantilever',
  employerUrl: 'https://cantilever.co',
  headshotUrl: 'https://assets.andrewheins.ca/images/andrew-photo.jpg',
  linkedInUrl: 'https://www.linkedin.com/in/andrew-heins-08093017/',
  workBlogUrl: 'https://cantilever.co/articles/',
  workBlogAuthorProfileUrl: 'https://cantilever.co/team/andrew-heins',
  assetBaseUrl: 'https://assets.andrewheins.ca',
  siteBaseUrl: 'https://andrewheins.ca',
  contactEmail: 'andrew.heins@gmail.com',
  gtmContainerId: 'GTM-XXXXXXX',
  cookieYesScriptId: 'PLACEHOLDER',
  workerEndpoint: 'https://PLACEHOLDER.workers.dev/contact',
  ogImageDefault: 'https://assets.andrewheins.ca/images/og-default.jpg',
} as const;

export type SiteConfig = typeof siteConfig;
