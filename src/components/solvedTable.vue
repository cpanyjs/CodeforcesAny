<template>
  <b-table
    :data="source"
    :columns="source.length === 0 ? columns : undefined"
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
      <b-table-column field="problem.tags" label="标签" width="400">
        <b-tag
          v-for="tag in props.row.problem.tags"
          :key="tag"
          style="margin-right: 0.1rem"
          >{{ tag }}</b-tag
        >
      </b-table-column>
    </template>

    <template slot="empty">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon icon="emoticon-sad" size="is-large"></b-icon>
          </p>
          <p>快去写题！</p>
        </div>
      </section>
    </template>
  </b-table>
</template>

<script>
export default {
  name: 'SolvedTable',
  props: {
    source: Array
  },
  data: () => ({
    currentPage: 1,
    columns: [
      {
        field: 'creationTimeSeconds',
        label: '时间',
        width: 150
      },
      {
        label: '题目'
      },
      {
        field: 'problem.rating',
        label: '难度',
        width: 80
      },
      {
        field: 'problem.tags',
        label: '标签',
        width: 400
      }
    ]
  })
};
</script>
