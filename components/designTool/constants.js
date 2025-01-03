console.log('ENV:', process.env)
export const SERVER_DOMAIN = process.env.NEXT_PUBLIC_SERVER_DOMAIN
export const SERVER_SSL = process.env.NEXT_PUBLIC_SERVER_SSL;
export const SERVER_URL = `http${SERVER_SSL ? "s": ""}://${SERVER_DOMAIN}`;
export const WEBSOCKET_URL = `ws${SERVER_SSL ? "s": ""}://${SERVER_DOMAIN}`;
export const THEME_ROUTE = '/images/theme';
export const PIPELINE_SESSION_ROUTE = (sessionID) => `/images/pipeline/session/${sessionID}`;
