<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">添加 Codeforces 账户</p>
    </header>
    <section class="modal-card-body">
      <b-field label="姓名">
        <b-input type="text" v-model="name" required></b-input>
      </b-field>
      <b-field label="Handle">
        <b-input type="text" v-model="handle" required></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-primary" @click="onSubmit">提交</button>
      <button class="button" type="button" @click="$parent.close()">
        关闭
      </button>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'AddHandle',
  data: () => ({
    name: '',
    handle: ''
  }),
  methods: {
    async onSubmit() {
      await this.$store.dispatch('addHandle', {
        name: this.name,
        handle: this.handle
      });
      this.$parent.close();
    }
  }
};
</script>

<style></style>
