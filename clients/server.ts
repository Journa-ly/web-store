import axios from "axios";


const SERVER_DOMAIN = process.env.NEXT_PUBLIC_SERVER_DOMAIN;
const SERVER_SSL = process.env.NEXT_PUBLIC_SERVER_SSL;
const baseURL = `http${SERVER_SSL ? 's' : ''}://${SERVER_DOMAIN}`;

export const serverClient = axios.create({ baseURL });
