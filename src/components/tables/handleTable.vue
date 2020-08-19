<template>
  <b-table
    :data="source"
    :columns="source.length === 0 ? columns : undefined"
    default-sort="rating"
    default-sort-direction="desc"
  >
    <template slot-scope="props">
      <b-table-column label="序号" numeric :visible="showID">
        <span class="has-text-weight-bold">
          {{ props.index + 1 }}
        </span>
      </b-table-column>
      <b-table-column label="Handle">
        <CodeforcesHandle
          :handle="props.row.handle"
          :rating="props.row.rating"
        ></CodeforcesHandle>
      </b-table-column>
      <b-table-column label="姓名">
        <router-link :to="{ name: 'Profile', query: { name: props.row.name } }">
          {{ props.row.name }}
        </router-link>
      </b-table-column>
      <b-table-column field="rating" label="Rating" numeric sortable>
        <span
          :style="props.row.rating | rankColor"
          class="has-text-weight-bold"
        >
          {{ props.row.rating }}
        </span>
      </b-table-column>
      <b-table-column
        field="maxRating"
        label="历史最高 Rating"
        numeric
        sortable
      >
        <span
          :style="props.row.maxRating | rankColor"
          class="has-text-weight-bold"
        >
          {{ props.row.maxRating }}
        </span>
      </b-table-column>
      <b-table-column field="acNum" label="题数" numeric sortable>
        <span>
          {{ props.row.acNum }}
        </span>
      </b-table-column>
      <b-table-column field="contestNum" label="参加比赛数" numeric sortable>
        <span>
          {{ props.row.contestNum }}
        </span>
      </b-table-column>
      <b-table-column label="操作" :visible="showAction" centered>
        <div>
          <b-button
            size="is-small"
            icon-left="delete"
            type="is-danger"
            style="margin-right: 0.5rem"
            @click="removeHandle(props.row)"
          ></b-button>
          <b-button
            size="is-small"
            icon-left="refresh"
            type="is-info"
            @click="refreshHandle(props.row)"
          ></b-button>
        </div>
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
    source: Array,
    showID: Boolean,
    showAction: Boolean
  },
  data: () => ({
    columns: [
      {
        field: 'id',
        label: '序号',
        numeric: true
      },
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
      },
      {
        field: 'acNum',
        label: '题数',
        numeric: true
      },
      {
        field: 'contestNum',
        label: '参加比赛数',
        numeric: true
      }
    ]
  }),
  methods: {
    async removeHandle({ name, handle }) {
      await this.$store.dispatch('removeHandle', { name, handle });
      this.$buefy.toast.open({
        message: `${name}的账号 ${handle} 已被删除`,
        type: 'is-info',
        duration: 3000
      });
    },
    async refreshHandle({ name, handle }) {
      await this.$store.dispatch('removeHandle', { name, handle });
      await this.$store.dispatch('addHandle', { name, handle });
      this.$buefy.toast.open({
        message: `${name}的账号 ${handle} 成功刷新`,
        type: 'is-info',
        duration: 3000
      });
    }
  }
};
</script>

<style></style>
