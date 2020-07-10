<template>
  <div id="app">
    <NavBar />
    <section class="section">
      <b-loading :active.sync="$root.loading"></b-loading>
      <router-view v-if="!$root.loading" />
    </section>
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>Codeforces Any</strong> by <a href="https://xlor.cn">XLor</a>.
          The source code is hosted on
          <a href="https://github.com/yjl9903/CodeforcesAny">Github</a> and is
          licensed
          <a href="https://github.com/yjl9903/CodeforcesAny/blob/master/LICENSE"
            >MIT</a
          >.
        </p>
      </div>
    </footer>
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

$footer-padding: 2rem 1.5rem 2rem;

@import '~bulma';
@import '~buefy/src/scss/buefy';
</style>
