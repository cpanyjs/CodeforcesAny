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
              style="margin-right: 0.5rem"
              :handle="handle.handle"
              :rating="handle.rating"
            ></CodeforcesHandle>
          </span>
        </div>
      </div>
      <div class="columns">
        <div class="column is-half">
          <h3 class="is-size-4 has-text-weight-bold has-text-centered">
            正确率
          </h3>
          <div style="padding-right: 1rem">
            <svg ref="verdict" />
          </div>
        </div>
        <div class="column is-half">
          <h3 class="is-size-4 has-text-weight-bold has-text-centered">
            1A 率
          </h3>
          <div style="padding-right: 1rem">
            <svg ref="1a" />
          </div>
        </div>
      </div>

      <div class="columns is-centered">
        <div class="column">
          <h3
            class="is-size-4 has-text-weight-bold has-text-centered"
            style="margin-bottom: 0.5em"
          >
            频率
          </h3>
          <div
            ref="heatmap"
            id="heatmap"
            class="is-flex"
            style="justify-content: center"
          ></div>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <h3 class="is-size-4 has-text-weight-bold has-text-centered">
            近期参加的比赛
          </h3>
          <ContestTable :source="contests | mapId"></ContestTable>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <h3 class="is-size-4 has-text-weight-bold has-text-centered">
            近期通过的题目
          </h3>
          <SolvedTable :source="submissions | mapId"></SolvedTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CalHeatMap from 'cal-heatmap';
import { Pie, positionType } from '../plugins/chart';
import SolvedTable from '../components/tables/solvedTable';
import ContestTable from '../components/tables/contestTable';
import dayjs from 'dayjs';

export default {
  name: 'Profile',
  components: {
    SolvedTable,
    ContestTable
  },
  props: {
    name: String,
    handle: String
  },
  data: () => ({
    profile: null
  }),
  computed: {
    submissions() {
      if (this.profile) {
        return this.profile.acProblems();
      } else {
        return [];
      }
    },
    contests() {
      if (this.profile) {
        return this.profile.contests();
      } else {
        return [];
      }
    }
  },
  filters: {
    mapId(arr) {
      return arr.map((val, id) => ({ ...val, id: id + 1 }));
    }
  },
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

    this.$nextTick(() => {
      new Pie(this.$refs.verdict, this.profile.analyzeVerdict(), {
        innerRadius: 0.5,
        legendPosition: positionType.upRight,
        dataColors: [
          '#0a0',
          'red',
          '#28a3dd',
          '#ed84b5',
          '#f19839',
          '#f3db52',
          '#8e6d5a',
          '#9179c0',
          '#949494'
        ]
      });
      new Pie(this.$refs['1a'], this.profile.analyze1A(), {
        innerRadius: 0.5,
        legendPosition: positionType.upRight,
        dataColors: [
          '#0a0',
          'red',
          '#28a3dd',
          '#ed84b5',
          '#f19839',
          '#f3db52',
          '#8e6d5a',
          '#9179c0',
          '#949494'
        ]
      });
      const lastYear = dayjs()
        .subtract(1, 'year')
        .add(1, 'month')
        .date(1)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate();
      const cal = new CalHeatMap();
      cal.init({
        itemSelector: '#heatmap',
        data: (() => {
          const result = {};
          for (const submission of this.submissions) {
            const time = submission.creationTimeSeconds;
            if (result[time] === undefined) {
              result[time] = 1;
            } else {
              result[time] = 1 + result[time];
            }
          }
          return result;
        })(),
        domain: 'month',
        subDomain: 'day',
        cellSize: 15,
        start: lastYear,
        range: 12,
        displayLegend: false,
        considerMissingDataAsZero: true,
        legendColors: {
          min: 'rgb(155,233,168)',
          max: 'rgb(33,110,57)',
          empty: 'rgb(235,237,240)',
          base: 'rgb(235,237,240)'
        },
        domainLabelFormat(x) {
          const month = dayjs(x).month();
          return [
            '一月',
            '二月',
            '三月',
            '四月',
            '五月',
            '六月',
            '七月',
            '八月',
            '九月',
            '十月',
            '十一月',
            '十二月'
          ][month];
        }
      });
    });
  }
};
</script>

<style>
.graph > svg > rect {
  fill: none;
}

.graph-label {
  fill: rgb(36, 41, 46) !important;
  font-weight: lighter;
}
</style>
