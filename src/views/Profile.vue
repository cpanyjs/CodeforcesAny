<template>
  <div class="card" v-if="profile">
    <h2 class="card-header">
      <div class="card-header-title is-size-3">
        <span class="is-inline-block" style="margin-right: 0.5rem">{{
          name
        }}</span>
        <CodeforcesHandle
          :handle="profile.handle"
          :rating="profile.rating"
        ></CodeforcesHandle>
      </div>
    </h2>
    <div class="card-content">
      <div v-if="name" class="columns">
        <div class="column">
          Codeforces 账号：
          <span v-for="handle in profile.handles" :key="handle.handle">
            <CodeforcesHandle
              :handle="handle.handle"
              :rating="handle.rating"
            ></CodeforcesHandle>
          </span>
          。
        </div>
      </div>
      <div class="columns">
        <div class="column is-half">
          <h3 class="is-size-4 has-text-weight-bold">正确率</h3>
          <div style="padding-right: 1rem">
            <svg ref="verdict" />
          </div>
        </div>
        <div class="column is-half">
          <h3 class="is-size-4 has-text-weight-bold">1A 率</h3>
          <div style="padding-right: 1rem">
            <svg ref="1a" />
          </div>
        </div>
      </div>
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
    console.log(this.profile);
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
      new Pie(this.$refs['1a'], this.profile.analyze1A(), {
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
