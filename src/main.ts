import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import './plugins/buefy';
import { loadDB } from './codeforces/store';
import { rankColor, parseTime } from './filters';
import CodeforcesHandle from './components/CodeforcesHandle.vue';

Vue.config.productionTip = process.env.NODE_ENV === 'production';

Vue.component('CodeforcesHandle', CodeforcesHandle);

Vue.filter('rankColor', rankColor);
Vue.filter('parseTime', parseTime);

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
