/**
 * Exchange GitHub OAuth code for user profile (Vercel serverless).
 * Requires GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET env vars.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { code, redirectUri } = req.body || {};
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!code || !clientId || !clientSecret) {
    res.status(400).json({ error: 'Missing code or GitHub OAuth configuration' });
    return;
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      res.status(401).json({ error: tokenData.error || 'Token exchange failed' });
      return;
    }

    const profileRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github+json',
      },
    });
    const profile = await profileRes.json();
    if (!profile.id) {
      res.status(401).json({ error: 'Failed to load GitHub profile' });
      return;
    }

    res.status(200).json({ profile });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
