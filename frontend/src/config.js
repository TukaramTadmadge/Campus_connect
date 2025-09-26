// API calls
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// WebSocket
const SOCKET_URL = API_BASE_URL.replace(/^http/, 'ws'); // converts https:// → wss://
const socket = new WebSocket(SOCKET_URL);
