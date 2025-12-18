
export const PROVIDER_PRESETS = [
    {
        id: 'spotify',
        name: 'Spotify',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
        authUrl: 'https://accounts.spotify.com/authorize',
        tokenUrl: 'https://accounts.spotify.com/api/token',
        defaultScopes: 'user-read-private user-read-email',
        docUrl: 'https://developer.spotify.com/documentation/general/guides/authorization/code-flow/'
    },
    {
        id: 'google',
        name: 'Google',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        defaultScopes: 'openid email profile',
        docUrl: 'https://developers.google.com/identity/protocols/oauth2/web-server'
    },
    {
        id: 'github',
        name: 'GitHub',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        authUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token',
        defaultScopes: 'read:user',
        docUrl: 'https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps'
    },
    {
        id: 'discord',
        name: 'Discord',
        logo: 'https://assets-global.website-files.com/6257adef93867e56f84d3092/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png',
        authUrl: 'https://discord.com/api/oauth2/authorize',
        tokenUrl: 'https://discord.com/api/oauth2/token',
        defaultScopes: 'identify email',
        docUrl: 'https://discord.com/developers/docs/topics/oauth2'
    },
    {
        id: 'slack',
        name: 'Slack',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
        authUrl: 'https://slack.com/oauth/v2/authorize',
        tokenUrl: 'https://slack.com/api/oauth.v2.access',
        defaultScopes: 'chat:write',
        docUrl: 'https://api.slack.com/authentication/oauth-v2'
    }
];
