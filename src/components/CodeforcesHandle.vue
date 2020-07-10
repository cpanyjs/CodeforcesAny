<template>
  <a
    :href="'http://codeforces.com/profile/' + handle"
    :style="rating | rankColor"
    class="has-text-weight-bold"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span>{{ handle }}</span>
  </a>
</template>

<script>
export default {
  name: 'CodeforcesHandle',
  props: {
    handle: String,
    rating: Number
  }
};
</script>
