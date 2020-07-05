<template>
  <div>
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <b-button
            :disabled="current !== null"
            @click="isFullScreen = true"
            type="is-primary"
            icon-left="fullscreen"
            >全屏</b-button
          >
        </div>
        <div class="level-item">
          <b-switch
            :disabled="current !== null"
            v-model="mode"
            true-value="Member"
            false-value="Handle"
          >
            {{ mode === 'Member' ? '成员模式' : '账户模式' }}
          </b-switch>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <b-button type="is-success" icon-left="plus" />
        </div>
        <div class="level-item">
          <b-upload
            v-model="file"
            drag-drop
            accept=".csv"
            @input="onFileUpload"
          >
            <a class="button is-success">
              <b-icon icon="upload"></b-icon>
              <span>批量添加</span>
            </a>
          </b-upload>
        </div>
      </div>
    </div>

    <div v-if="current !== null">
      <b-progress
        type="is-success"
        show-value
        format="percent"
        :value="percent"
      >
        {{ current }} - {{ percent }} %
      </b-progress>
    </div>

    <component :is="tableComponent" :source="tableSource"></component>

    <b-modal :active.sync="isFullScreen" full-screen can-cancel destroy-on-hide>
      <div style="padding: 2rem 2rem">
        <component :is="tableComponent" :source="tableSource"></component>
      </div>
    </b-modal>
  </div>
</template>

<script>
import HandleTable from '../components/handleTable';
import { sleep } from '../utils';

export default {
  name: 'Team',
  data: () => ({
    mode: 'Handle',
    file: null,
    percent: -1,
    current: null,
    isFullScreen: false
  }),
  computed: {
    tableComponent() {
      if (this.mode === 'Handle') {
        return HandleTable;
      } else if (this.mode === 'Member') {
        return HandleTable;
      } else {
        return HandleTable;
      }
    },
    tableSource() {
      if (this.mode === 'Handle') {
        return this.$store.state.handles;
      } else if (this.mode === 'Member') {
        return this.$store.state.members;
      } else {
        return this.$store.state.handles;
      }
    }
  },
  methods: {
    async onFileUpload(file) {
      const data = (
        await new Promise(res => {
          const reader = new FileReader();
          reader.readAsText(file, 'utf-8');
          reader.addEventListener('load', e => {
            res(e.target.result);
          });
        })
      )
        .split('\n')
        .map(s => s.split(',').map(s => s.trim()))
        .filter(s => s.length === 2);
      this.mode = 'Handle';
      this.percent = 0;
      let cnt = 0;
      for (const [name, handle] of data) {
        this.current = '正在查询 ' + handle;
        await this.$store.dispatch('addHandle', { name, handle });
        this.percent = Number(((++cnt / data.length) * 100.0).toFixed(2));
        await sleep(500);
      }
      this.current = '完成';
      this.file = null;
      setTimeout(() => (this.current = null), 3000);
    }
  }
};
</script>

<style></style>
