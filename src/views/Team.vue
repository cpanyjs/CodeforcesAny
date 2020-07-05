<template>
  <div>
    <div v-show="showActionBar" class="level">
      <div class="level-left">
        <div class="level-item">
          <b-button
            :disabled="current !== null"
            @click="isFullScreen = true"
            type="is-primary"
            icon-left="fullscreen"
          ></b-button>
        </div>
        <div class="level-item">
          <b-dropdown hoverable :disabled="current !== null">
            <button class="button is-info" slot="trigger">
              <span>更多操作</span>
              <b-icon icon="menu-down"></b-icon>
            </button>
            <b-dropdown-item @click="onToggleAction">隐藏操作</b-dropdown-item>
            <b-dropdown-item @click="onRefresh">刷新信息</b-dropdown-item>
            <b-dropdown-item @click="onClear">清空存储</b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="level-item">
          <b-switch
            :disabled="current !== null"
            v-model="mode"
            true-value="Member"
            false-value="Handle"
            >{{ mode === 'Member' ? '成员模式' : '账户模式' }}</b-switch
          >
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <b-button type="is-success" icon-left="plus" @click="addHanlde" />
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
      <b-progress type="is-success" show-value format="percent" :value="percent"
        >{{ current }} - {{ percent }} %</b-progress
      >
    </div>

    <component
      :is="tableComponent"
      :source="tableSource"
      :showAction="showActionBar && mode === 'Handle'"
    ></component>

    <b-modal :active.sync="isFullScreen" full-screen can-cancel destroy-on-hide>
      <div style="padding: 2rem 2rem">
        <component
          :is="tableComponent"
          :source="tableSource"
          :showAction="false"
        ></component>
      </div>
    </b-modal>
  </div>
</template>

<script>
import HandleTable from '../components/handleTable';
import AddHandleForm from '../components/addHandle';
import { sleep } from '../utils';

export default {
  name: 'Team',
  data: () => ({
    showActionBar: true,
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
        try {
          await this.$store.dispatch('addHandle', { name, handle });
        } catch (err) {
          this.$buefy.snackbar.open({
            message: `${handle} 查询失败！`,
            type: 'is-danger',
            queue: false,
            indefinite: true
          });
        }
        this.percent = Number(((++cnt / data.length) * 100.0).toFixed(2));
        await sleep(500);
      }
      this.current = '完成';
      this.file = null;
      setTimeout(() => (this.current = null), 3000);
    },
    addHanlde() {
      this.$buefy.modal.open({
        parent: this,
        component: AddHandleForm,
        hasModalCard: true,
        trapFocus: true
      });
    },
    onToggleAction() {
      this.showActionBar ^= 1;
    },
    onRefresh() {
      console.log('Refresh');
    },
    onClear() {
      this.$buefy.dialog.confirm({
        title: '清空存储',
        message: '请问确认 <b>清空</b> 所有存储的数据？',
        confirmText: '清空',
        cancelText: '取消',
        type: 'is-danger',
        hasIcon: false,
        onConfirm: async () => {
          await this.$store.dispatch('clearAll');
          this.$buefy.toast.open('清空完成!');
        }
      });
    }
  },
  created() {
    window.addEventListener('keypress', this.onToggleAction);
  },
  destroyed() {
    window.removeEventListener('keypress', this.onToggleAction);
  }
};
</script>

<style></style>
