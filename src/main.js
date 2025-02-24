
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// vuetify
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// FireBase
import { VueFire, VueFireAuth  } from 'vuefire';
import {  firebaseApp  } from './config/firebase';


import App from './App.vue';
import router from './router';

import './assets/main.css';
// iconos
import { createVuetify } from 'vuetify';

const app = createApp(App);

// Vuetify
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi', // This is already the default value - only for display purposes
      },
});

// Firebase
app.use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()]
})

app.use(vuetify)
app.use(createPinia())
app.use(router)

app.mount('#app')
