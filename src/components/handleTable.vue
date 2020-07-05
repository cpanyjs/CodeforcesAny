<template>
  <b-table
    :data="source"
    :columns="source.length === 0 ? columns : []"
    default-sort="rating"
    default-sort-direction="desc"
  >
    <template slot-scope="props">
      <b-table-column label="Handle">
        <a
          :href="'http://codeforces.com/profile/' + props.row.handle"
          :style="props.row.rating | rankColor"
          class="has-text-weight-bold"
        >
          {{ props.row.handle }}
        </a>
      </b-table-column>
      <b-table-column label="姓名">
        <span>
          {{ props.row.name }}
        </span>
      </b-table-column>
      <b-table-column field="rating" label="Rating" numeric sortable="">
        <span
          :style="props.row.rating | rankColor"
          class="has-text-weight-bold"
        >
          {{ props.row.rating }}
        </span>
      </b-table-column>
      <b-table-column field="maxRating" label="历史最高 Rating" numeric>
        <span
          :style="props.row.maxRating | rankColor"
          class="has-text-weight-bold"
        >
          {{ props.row.maxRating }}
        </span>
      </b-table-column>
    </template>

    <template slot="empty">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon icon="emoticon-sad" size="is-large"></b-icon>
          </p>
          <p>没有数据</p>
        </div>
      </section>
    </template>
  </b-table>
</template>

<script>
export default {
  name: 'HandleTable',
  props: {
    source: Array
  },
  data: () => ({
    columns: [
      {
        field: 'handle',
        label: 'Handle'
      },
      {
        field: 'name',
        label: '姓名'
      },
      {
        field: 'rating',
        label: 'Rating',
        numeric: true
      },
      {
        field: 'maxRating',
        label: '历史最高 Rating',
        numeric: true
      }
    ]
  })
};
</script>

<style></style>
