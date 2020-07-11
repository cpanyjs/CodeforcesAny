<template>
  <b-table
    :data="source"
    :columns="source.length === 0 ? columns : undefined"
    :paginated="true"
    :per-page="10"
    :current-page.sync="currentPage"
    default-sort="startTimeSeconds"
    default-sort-direction="desc"
  >
    <template slot-scope="props">
      <b-table-column
        field="startTimeSeconds"
        label="时间"
        width="150"
        sortable
      >
        <a
          :href="`https://codeforces.com/contest/${props.row.contestId}`"
          target="_blank"
          rel="noopener noreferrer"
          >{{ props.row.startTimeSeconds | parseTime }}</a
        >
      </b-table-column>
      <b-table-column label="比赛">
        <a
          :href="`http://codeforces.com/contest/${props.row.contestId}`"
          target="_blank"
          rel="noopener noreferrer"
          >{{ props.row.contestName }}</a
        >
      </b-table-column>
      <b-table-column field="rank" label="排名" width="100" numeric>
        <span>{{ props.row.rank }}</span>
      </b-table-column>
      <!-- <b-table-column field="ratingChange" label="积分变化" width="100" numeric>
        <b-tooltip type="is-light" :label="'Rating: ' + props.row.newRating">
          <span
            class="has-text-weight-bold"
            :style="{ color: props.row.ratingChange > 0 ? '#008000' : '#808080' }"
          >{{ props.row.ratingChange > 0 ? '+' : '' }}{{ props.row.ratingChange }}</span>
        </b-tooltip>
      </b-table-column> -->
      <b-table-column field="type" label="类型" width="100" sortable>
        {{ props.row.type | parseType }}
      </b-table-column>
    </template>
  </b-table>
</template>

<script>
import dayjs from 'dayjs';

export default {
  name: 'ContestTable',
  props: {
    source: Array
  },
  data: () => ({
    currentPage: 1,
    columns: [
      {
        field: 'creationTimeSeconds',
        label: '时间',
        sortable: true,
        width: 150
      },
      {
        label: '比赛'
      },
      {
        field: 'rank',
        label: '排名',
        numeric: true
      },
      {
        field: 'type',
        label: '类型',
        width: 100
      }
    ]
  }),
  filters: {
    parseTime(val) {
      return dayjs(val * 1000).format('YYYY-MM-DD HH:mm');
    },
    parseType(val) {
      if (val === 'CONTESTANT') {
        return '正式参赛';
      } else if (val === 'VIRTUAL') {
        return '虚拟参赛';
      } else {
        return '其他';
      }
    }
  }
};
</script>
