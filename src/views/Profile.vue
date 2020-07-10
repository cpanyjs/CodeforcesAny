<template>
  <div class="box" v-if="profile">
    <h2 class="is-size-3 has-text-weight-bold">
      <span>{{ name }}</span>
      <CodeforcesHandle
        :handle="profile.handle"
        :rating="profile.rating"
      ></CodeforcesHandle>
    </h2>
    <div style="width: 50%; height: 50%;">
      <svg ref="verdict"></svg>
    </div>
  </div>
</template>

<script>
import { Pie, positionType } from '../plugins/chart';

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

    this.$nextTick(() => {
      new Pie(this.$refs.verdict, this.profile.analyzeVerdict(), {
        innerRadius: 0.5,
        legendPosition: positionType.upRight,
        dataColors: [
          '#0a0',
          'red',
          '#9179c0',
          '#28a3dd',
          '#f3db52',
          '#ed84b5',
          '#8e6d5a',
          '#f19839',
          '#949494'
        ]
      });
    });
  }
};
</script>

<style></style>
