<template>
  <div class="box" v-if="profile">
    <h2 class="is-size-3 has-text-weight-bold">
      <span>{{ name }}</span>
      <CodeforcesHandle
        :handle="profile.handle"
        :rating="profile.rating"
      ></CodeforcesHandle>
    </h2>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  props: {
    name: String,
    handle: String
  },
  data: () => ({
    profile: null
  }),
  mounted() {
    if (this.name) {
      this.profile = this.$store.getters.member(this.name);
    } else if (this.handle) {
      this.profile = null;
      // TODO: get profile from codeforces api
    }
    if (!this.profile) {
      this.$router.replace({ name: 'Home' });
    }
  }
};
</script>

<style></style>
