<template>
  <div id="app">
    <NavBar />
    <section class="section">
      <b-loading :active.sync="$root.loading"></b-loading>
      <router-view v-if="!$root.loading" />
    </section>
  </div>
</template>

<script>
import NavBar from './components/NavBar';

export default {
  name: 'App',
  components: {
    NavBar
  }
};
</script>

<style lang="scss">
@import '~bulma/sass/utilities/_all';

$primary: $turquoise;
$primary-invert: findColorInvert($primary);

$navbar-padding-vertical: 0.5rem;

$section-padding: 2rem 2rem;

@import '~bulma';
@import '~buefy/src/scss/buefy';
</style>
