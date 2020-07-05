import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import './plugins/buefy';
import { loadDB } from './codeforces/store';
import { rankColor } from './utils';

Vue.config.productionTip = false;

Vue.filter(rankColor[0], rankColor[1]);

new Vue({
  router,
  store,
  render: h => h(App),
  data: {
    loading: true
  },
  async created() {
    const [handles, members] = await loadDB();
    store.commit('initStore', { handles, members });
    this.loading = false;
  }
}).$mount('#app');
