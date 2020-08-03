<template>
  <b-navbar shadow spaced>
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ name: 'Home' }">
        <span class="logo has-text-black">Codeforces 统计</span>
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item tag="router-link" :to="{ name: 'Team' }"
        >成员</b-navbar-item
      >
      <b-navbar-item tag="router-link" :to="{ name: 'Tool' }"
        >工具</b-navbar-item
      >
    </template>

    <template slot="end">
      <b-navbar-item tag="div"> </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {
  name: 'NavBar',
  data: () => ({})
};
</script>

<style>
.logo {
  user-select: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.2rem;
}
</style>
