<template>
  <div class="card" v-if="contest">
    <h2 class="card-header">
      <div class="card-header-title is-size-3">
        <span class="is-inline-block" style="margin-right: 0.5rem">{{
          contest.name
        }}</span>
      </div>
    </h2>
    <div class="card-content content">
      <p>举办时间：{{ contest.startTimeSeconds | parseTime }}。</p>
      <p>
        <a :href="`http://codeforces.com/contest/${contestId}`" target="_blank"
          >比赛主页</a
        >&nbsp;
        <a
          :href="`http://codeforces.com/contest/${contestId}/standings`"
          target="_blank"
          >榜单</a
        >
        &nbsp;
        <a
          :href="
            `http://codeforces.com/contest/${contestId}/standings/friends/true`
          "
          target="_blank"
          >好友榜单</a
        >
      </p>
      <p v-if="problems">
        <RankTable
          :contest-id="contestId"
          :problems="problems"
          :rows="rows"
        ></RankTable>
      </p>
    </div>
  </div>
</template>

<script>
import { getContestById, getContestRank } from '../codeforces/store';
import RankTable from '../components/tables/rankTable';

export default {
  name: 'Contest',
  components: {
    RankTable
  },
  props: {
    contestId: Number
  },
  data: () => ({
    contest: null,
    problems: null,
    rows: []
  }),
  async created() {
    this.contest = getContestById(this.contestId);
    if (!this.contest || this.contest.phase === 'BEFORE') {
      this.$router.replace({ name: 'Home' });
    }
    const result = await getContestRank(this.contestId);
    this.problems = result.problems;
    this.rows = result.rows;
  }
};
</script>

<style scoped></style>
