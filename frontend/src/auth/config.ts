export const authConfig = {
  googleClientId: typeof GOOGLE_CLIENT_ID !== 'undefined' ? GOOGLE_CLIENT_ID : '',
  githubClientId: typeof GITHUB_CLIENT_ID !== 'undefined' ? GITHUB_CLIENT_ID : '',
  isGoogleEnabled: () => Boolean(authConfig.googleClientId),
  isGitHubEnabled: () => Boolean(authConfig.githubClientId),
};
