export const siteConfig = {
  authorFullName: 'Andrew Heins',
  professionalHeadline: 'TO BE DEFINED',
  employerName: 'Cantilever',
  employerUrl: 'https://cantilever.co',
  headshotUrl: 'https://assets.andrewheins.ca/images/andrew-heins-headshot.jpg',
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
