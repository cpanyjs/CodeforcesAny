<template>
  <div>
    <div v-if="mode === 'input'">
      <b-field label="标题">
        <b-input type="text" v-model="title"></b-input>
      </b-field>
      <b-field label="榜单 JSON">
        <b-input type="textarea" v-model="text" rows="15"></b-input>
      </b-field>
      <b-button @click="renderBoard" type="is-success">渲染</b-button>
    </div>
    <div v-else-if="board">
      <h2
        v-if="title.length > 0"
        class="has-text-weight-bold is-size-4"
        style="margin-bottom: 1rem"
      >
        {{ title }}
      </h2>
      <b-table
        :columns="
          board.length === 0
            ? [
                { label: '#', centered: true, numeric: true, width: 24 },
                { label: 'Handle' },
                { label: '解决', centered: true, width: 72 },
                { label: '罚时', centered: true, width: 100 }
              ]
            : []
        "
        :data="board"
        default-sort="rank"
        default-sort-direction="asc"
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
          <b-table-column label="参赛者" style="line-height: 3;">
            <span>{{ props.row.name }}</span>
          </b-table-column>
          <b-table-column
            label="解决"
            width="72"
            class="has-text-weight-bold"
            centered
            style="line-height: 3;"
            >{{ props.row.solved }}</b-table-column
          >
          <b-table-column
            label="罚时"
            width="100"
            centered
            style="line-height: 3;"
            >{{ props.row.penalty }}</b-table-column
          >
          <b-table-column
            v-for="(problem, i) in problems"
            :key="problem.index"
            :label="problem.index"
            width="72"
            centered
          >
            <ProblemResult
              v-if="props.row.problems[i]"
              :result="{
                points: props.row.problems[i].time ? 1 : 0,
                rejectedAttemptCount: -props.row.problems[i].dirty || 0,
                time: props.row.problems[i].time
              }"
            ></ProblemResult>
          </b-table-column>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import ProblemResult from '@/components/ProblemResult';

const TextKey = 'cache/board/text';
const TitleKey = 'cache/board/title';

export default {
  name: 'Board',
  components: {
    ProblemResult
  },
  data: () => ({
    mode: 'input',
    title: localStorage.getItem(TitleKey) || '',
    text: localStorage.getItem(TextKey) || '',
    board: null
  }),
  methods: {
    renderBoard() {
      localStorage.setItem(TextKey, this.text);
      localStorage.setItem(TitleKey, this.title);

      this.board = JSON.parse(this.text);
      this.mode = 'board';
    }
  },
  computed: {
    problems() {
      const problems = this.board[0].problems;
      const result = [];
      let id = 0;
      for (const prob of problems) {
        result.push({ index: String.fromCharCode('A'.charCodeAt(0) + id) });
        id++;
      }
      return result;
    }
  }
};
</script>

<style></style>
