<template>
  <div class="home columns">
    <div class="column">
      <div class="box">
        <h2 class="subtitle has-text-weight-bold">近期比赛</h2>
        <b-table
          :data="recentContests"
          default-sort="startTimeSeconds"
          default-sort-direction="desc"
        >
          <template slot-scope="props">
            <b-table-column label="状态" width="60" centered>
              <b-icon
                :type="props.row | state | stateColor"
                :icon="props.row | state | stateIcon"
              ></b-icon>
            </b-table-column>
            <b-table-column label="比赛">
              <router-link
                v-if="props.row.phase !== 'BEFORE'"
                :to="{ name: 'Contest', query: { id: props.row.id } }"
                >{{ props.row.name }}</router-link
              >
              <span v-else>
                {{ props.row.name }}
              </span>
            </b-table-column>
            <b-table-column label="时间">{{
              props.row.startTimeSeconds | parseTime
            }}</b-table-column>
          </template>
        </b-table>
      </div>
    </div>
    <div class="column is-two-fifths">
      <div class="box">
        <article class="media">
          <div class="media-left">
            <figure class="image is-64x64">
              <img
                src="https://bulma.io/images/placeholders/128x128.png"
                alt="Image"
              />
            </figure>
          </div>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>John Smith</strong>
                <small>@johnsmith</small>
                <small>31m</small>
                <br />Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Aenean efficitur sit amet massa fringilla egestas. Nullam
                condimentum luctus turpis.
              </p>
            </div>
            <nav class="level is-mobile">
              <div class="level-left">
                <a class="level-item" aria-label="reply">
                  <span class="icon is-small">
                    <i class="fas fa-reply" aria-hidden="true"></i>
                  </span>
                </a>
                <a class="level-item" aria-label="retweet">
                  <span class="icon is-small">
                    <i class="fas fa-retweet" aria-hidden="true"></i>
                  </span>
                </a>
                <a class="level-item" aria-label="like">
                  <span class="icon is-small">
                    <i class="fas fa-heart" aria-hidden="true"></i>
                  </span>
                </a>
              </div>
            </nav>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import { getRecentContests } from '../codeforces/store';

function getContestState({ phase }) {
  if (phase === 'BEFORE') {
    return -1;
  } else if (phase === 'FINISHED') {
    return 1;
  } else {
    return 0;
  }
}

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      recentContests: getRecentContests()
    };
  },
  filters: {
    state(time) {
      return getContestState(time);
    },
    stateIcon(state) {
      if (state === -1) {
        return 'check';
      } else if (state === 0) {
        return 'bird';
      } else {
        return 'calendar-blank';
      }
    },
    stateColor(state) {
      if (state === -1) {
        return 'is-success';
      } else if (state === 0) {
        return 'is-primary';
      } else {
        return 'is-info';
      }
    }
  }
};
</script>
