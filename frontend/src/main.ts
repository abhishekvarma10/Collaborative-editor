// frontend/src/main.ts

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify' // <-- ADD THIS LINE
import { loadFonts } from './plugins/webfontloader' // <-- ADD THIS LINE

loadFonts() // <-- ADD THIS LINE

createApp(App)
  .use(router)
  .use(vuetify) // <-- ADD THIS LINE
  .mount('#app')