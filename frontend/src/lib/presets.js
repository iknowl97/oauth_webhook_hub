import { SiGoogle, SiSpotify, SiGithub, SiDiscord, SiSlack, SiMeta } from "react-icons/si";

export const PRESETS = [
    {
        id: 'google',
        name: 'Google',
        icon: SiGoogle,
        color: '#DB4437',
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/calendar'
    },
    {
        id: 'spotify',
        name: 'Spotify',
        icon: SiSpotify,
        color: '#1DB954',
        authUrl: 'https://accounts.spotify.com/authorize',
        tokenUrl: 'https://accounts.spotify.com/api/token',
        scope: 'user-read-currently-playing playlist-modify-public'
    },
    {
        id: 'github',
        name: 'GitHub',
        icon: SiGithub,
        color: '#181717',
        authUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token',
        scope: 'repo user'
    },
    {
        id: 'discord',
        name: 'Discord',
        icon: SiDiscord,
        color: '#5865F2',
        authUrl: 'https://discord.com/oauth2/authorize',
        tokenUrl: 'https://discord.com/api/oauth2/token',
        scope: 'identify bot'
    },
    {
        id: 'slack',
        name: 'Slack',
        icon: SiSlack,
        color: '#4A154B',
        authUrl: 'https://slack.com/oauth/v2/authorize',
        tokenUrl: 'https://slack.com/api/oauth.v2.access',
        scope: 'chat:write commands'
    },
    {
        id: 'meta',
        name: 'Meta/Threads',
        icon: SiMeta,
        color: '#0668E1',
        authUrl: 'https://threads.net/oauth/authorize',
        tokenUrl: 'https://graph.threads.net/oauth/access_token',
        scope: 'threads_basic,threads_content_publish'
    }
];
