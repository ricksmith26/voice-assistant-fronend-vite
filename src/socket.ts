import { io } from 'socket.io-client';
import {API_URL} from './config/config'

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : `${API_URL}`;
const socket = io(URL, { transports: ["websocket"] }) as any;

export default socket;