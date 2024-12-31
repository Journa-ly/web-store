export const SERVER_DOMAIN = 'api.journa.ai'
export const SERVER_SSL = true;
export const SERVER_URL = `http${SERVER_SSL ? "s": ""}://${SERVER_DOMAIN}`;
export const WEBSOCKET_URL = `ws${SERVER_SSL ? "s": ""}://${SERVER_DOMAIN}`;
export const THEME_ROUTE = '/images/theme';
export const PIPELINE_SESSION_ROUTE = (sessionID) => `/images/pipeline/session/${sessionID}`;
