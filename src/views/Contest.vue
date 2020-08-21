<template>
  <div class="card" v-if="contest">
    <h2 class="card-header">
      <div class="card-header-title is-size-3">
        <span class="is-inline-block" style="margin-right: 0.5rem">{{
          contest.name
        }}</span>
      </div>
    </h2>
    <div class="card-content">
      <p>
        <a :href="`http://codeforces.com/contest/${contestId}`" target="_blank"
          >比赛主页</a
        >&nbsp;
        <a
          :href="`http://codeforces.com/contest/${contestId}/standings`"
          target="_blank"
          >榜单</a
        >
      </p>
    </div>
  </div>
</template>

<script>
import { getContestById } from '../codeforces/store';

export default {
  name: 'Contest',
  props: {
    contestId: Number
  },
  data: () => ({
    contest: null
  }),
  created() {
    this.contest = getContestById(this.contestId);
    if (!this.contest || this.contest.phase === 'BEFORE') {
      this.$router.replace({ name: 'Home' });
    }
  }
};
</script>

<style scoped></style>
