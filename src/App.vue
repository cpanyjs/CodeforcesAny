<template>
  <div id="app">
    <NavBar />
    <section class="section main-body">
      <b-loading :active.sync="$root.loading"></b-loading>
      <router-view v-if="!$root.loading" />
    </section>
    <footer class="footer" v-if="!$root.loading">
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

html,
body,
#app {
  height: 100%;
  min-height: 100%;
}

.main-body {
  min-height: calc(100% - 160px);
}

::-webkit-selection {
  background-color: #cce2ff;
}
::-moz-selection {
  background-color: #cce2ff;
}
::selection {
  background-color: #cce2ff;
}
input::-webkit-selection,
textarea::-webkit-selection {
  background-color: rgba(100, 100, 100, 0.4);
  color: rgba(0, 0, 0, 0.87);
}
input::-moz-selection,
textarea::-moz-selection {
  background-color: rgba(100, 100, 100, 0.4);
  color: rgba(0, 0, 0, 0.87);
}
input::selection,
textarea::selection {
  background-color: rgba(100, 100, 100, 0.4);
  color: rgba(0, 0, 0, 0.87);
}
body ::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
}
body ::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0;
}
body ::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.25);
  transition: color 0.2s ease;
}
body ::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(0, 0, 0, 0.15);
}
body ::-webkit-scrollbar-thumb:hover {
  background: rgba(128, 135, 139, 0.8);
}
</style>
