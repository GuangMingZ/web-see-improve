import { createApp } from 'vue';
import websee from '@websee/core';
import performance from '@websee/performance';
import './style.css';
import App from './App.vue';

const app = createApp(App);

console.log('websee = ', websee);
console.log('performance = ', performance);

app.use(websee, {
  dsn: 'https://text.com/reportData',
  apikey: 'project1',
  userId: '89757',
  silentXhr: true,
  silentFetch: true,
  silentClick: true,
  silentError: true,
  silentUnhandledrejection: true,
  silentHistory: true,
  silentHashchange: true,
  silentWhiteScreen: true,
});

websee.use(performance, {
  silentLongTask: true,
  silentResourceList: true,
  silentMemory: true,
  slientFID: true,
  slientFCP: true,
  slientLCP: true,
  slientCLS: true,
  slientTTFB: true,
  slientFSP: false,
});

app.mount('#app');
