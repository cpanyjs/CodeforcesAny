<template>
  <b-table
    :data="source"
    :paginated="true"
    :per-page="10"
    :current-page.sync="currentPage"
    default-sort="creationTimeSeconds"
    default-sort-direction="desc"
  >
    <template slot-scope="props">
      <b-table-column
        field="creationTimeSeconds"
        label="时间"
        width="150"
        sortable
      >
        <a
          :href="
            `https://codeforces.com/contest/${props.row.problem.contestId}/submission/${props.row.id}`
          "
          target="_blank"
          rel="noopener noreferrer"
          >{{ props.row.creationTimeSeconds | parseTime }}</a
        >
      </b-table-column>
      <b-table-column label="题目">
        <a
          :href="
            `http://codeforces.com/contest/${props.row.problem.contestId}/problem/${props.row.problem.index}`
          "
          target="_blank"
          rel="noopener noreferrer"
          >{{
            props.row.problem.contestId +
              props.row.problem.index +
              ' ' +
              props.row.problem.name
          }}</a
        >
      </b-table-column>
      <b-table-column
        field="problem.rating"
        label="难度"
        width="80"
        numeric
        sortable
      >
        <span>{{ props.row.problem.rating }}</span>
      </b-table-column>
    </template>
  </b-table>
</template>

<script>
import dayjs from 'dayjs';

export default {
  name: 'SolvedTable',
  props: {
    source: Array
  },
  data: () => ({
    currentPage: 1
  }),
  filters: {
    parseTime(val) {
      return dayjs(val * 1000).format('YYYY-MM-DD hh:mm');
    }
  }
};
</script>

<style></style>
