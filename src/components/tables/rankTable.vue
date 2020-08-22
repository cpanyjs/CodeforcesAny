<template>
  <b-table
    :columns="
      rows.length === 0
        ? [
            { label: '#', centered: true, numeric: true, width: 24 },
            { label: 'Handle' },
            { label: '解决', centered: true, width: 72 },
            { label: '罚时', centered: true, width: 100 }
          ]
        : []
    "
    :data="rows"
    default-sort="rank"
    default-sort-direction="asc"
    :loading="loading"
  >
    <template slot-scope="props">
      <b-table-column
        label="#"
        numeric
        centered
        width="24"
        class="has-text-weight-bold"
        style="line-height: 3;"
      >
        {{ props.row.rank }}</b-table-column
      >
      <b-table-column label="Handle" style="line-height: 3;"
        ><CodeforcesHandle
          :handle="props.row.handle.handle"
          :rating="props.row.handle.rating"
        ></CodeforcesHandle
      ></b-table-column>
      <b-table-column
        label="解决"
        width="72"
        class="has-text-weight-bold"
        centered
        style="line-height: 3;"
        >{{ props.row.problemResults | solvedNum }}</b-table-column
      >
      <b-table-column
        label="罚时"
        width="100"
        centered
        style="line-height: 3;"
        >{{ props.row.problemResults | penalty }}</b-table-column
      >
      <b-table-column
        v-for="(problem, i) in problems"
        :key="problem.index"
        :label="problem.index"
        width="72"
        centered
      >
        <template v-slot:header="{ column }">
          <a
            :href="
              `http://codeforces.com/contest/${contestId}/problem/${problem.index}`
            "
            target="_blank"
            class="has-text-black"
            >{{ column.label }}</a
          >
        </template>
        <ProblemResult :result="props.row.problemResults[i]"></ProblemResult>
      </b-table-column>
    </template>

    <template slot="empty">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon
              v-if="!loading"
              icon="emoticon-sad"
              size="is-large"
            ></b-icon>
            <b-icon v-else icon="emoticon-happy" size="is-large"></b-icon>
          </p>
          <p v-if="!loading">无人参加本场比赛</p>
        </div>
      </section>
    </template>
  </b-table>
</template>

<script>
import dayjs from 'dayjs';
import ProblemResult from '../ProblemResult';

export default {
  name: 'RankTable',
  components: {
    ProblemResult
  },
  props: {
    loading: Boolean,
    contestId: Number,
    problems: Array,
    rows: Array
  },
  filters: {
    solvedNum(problemResults) {
      return problemResults.reduce(
        (acc, result) => acc + (result.points > 0 ? 1 : 0),
        0
      );
    },
    penalty(problemResults) {
      const time = problemResults.reduce(
        (acc, result) =>
          acc +
          (result.points > 0
            ? result.bestSubmissionTimeSeconds +
              result.rejectedAttemptCount * 1200
            : 0),
        16 * 3600
      );
      return dayjs(time * 1000).format('HH:mm:ss');
    }
  }
};
</script>

<style scoped></style>
