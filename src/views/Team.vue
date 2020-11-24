<template>
  <div ref="team">
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
            <b-dropdown-item @click="showID ^= 1"
              >{{ showID ? '隐藏序号' : '显示序号' }}
            </b-dropdown-item>
            <b-dropdown-item @click="onToggleAction">隐藏操作</b-dropdown-item>
            <hr class="dropdown-divider" />
            <b-dropdown-item @click="onXLorPasteImport"
              >从 XLorPaste 批量添加
            </b-dropdown-item>
            <b-dropdown-item @click="onXLorPasteExport"
              >导出名单到 XLorPaste
            </b-dropdown-item>
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
            >{{ mode === 'Member' ? '成员模式' : '账户模式' }}
          </b-switch>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <b-button
            :disabled="current !== null"
            type="is-success"
            icon-left="plus"
            @click="addHandle"
          />
        </div>
        <div class="level-item">
          <b-tooltip
            label="上传一个 csv 文件，每行包含 <姓名>,<handle>"
            multilined
            size="is-small"
            position="is-top"
            type="is-success"
          >
            <b-upload
              :disabled="current !== null"
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
          </b-tooltip>
        </div>
      </div>
    </div>

    <div v-if="current !== null" style="margin-bottom: 1rem;">
      <b-progress type="is-success" show-value format="percent" :value="percent"
        >{{ current }} - {{ percent }} %
      </b-progress>
    </div>

    <component
      :is="tableComponent"
      :source="tableSource | transform"
      :showAction="showActionBar && current === null && mode === 'Handle'"
      :showID="showID"
    ></component>

    <b-modal :active.sync="isFullScreen" full-screen can-cancel destroy-on-hide>
      <div style="padding: 2rem 2rem">
        <component
          :is="tableComponent"
          :source="tableSource | transform"
          :showAction="false"
          :showID="showID"
        ></component>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { Base64 } from 'js-base64';
import HandleTable from '../components/tables/handleTable';
import AddHandleForm from '../components/addHandle';
import { sleep } from '../utils';
import { filterAC, filterContest } from '../codeforces/utils';

function parseCSV(text) {
  return text
    .split('\n')
    .map(s => s.split(',').map(s => s.trim()))
    .filter(s => s.length === 2);
}

export default {
  name: 'Team',
  data: () => ({
    showID: true,
    showActionBar: true,
    mode: 'Member',
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
      const data = parseCSV(
        await new Promise(res => {
          const reader = new FileReader();
          reader.readAsText(file, 'utf-8');
          reader.addEventListener('load', e => {
            res(e.target.result);
          });
        })
      );
      this.multiAddHandles(data);
    },
    async multiAddHandles(data) {
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
      setTimeout(() => (this.current = null), 2000);
    },
    addHandle() {
      this.$buefy.modal.open({
        parent: this,
        component: AddHandleForm,
        hasModalCard: true,
        trapFocus: true
      });
    },
    onXLorPasteImport() {
      const result = /xlorpaste=([a-z0-9]{6})/.exec(document.cookie);
      const token = result ? result[1] : '';
      this.$buefy.dialog.prompt({
        message: `XLorPaste Token？`,
        inputAttrs: {
          placeholder: '',
          maxlength: 6,
          value: token
        },
        confirmText: '导入',
        cancelText: '取消',
        trapFocus: true,
        onConfirm: async token => {
          document.cookie =
            'xlorpaste=' + token + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
          try {
            const data = parseCSV(
              await (
                await fetch(`https://api.xlorpaste.cn/${token}?raw=true`)
              ).text()
            );
            this.multiAddHandles(data);
          } catch (err) {
            this.$buefy.snackbar.open({
              message: `${token} 导入失败！`,
              type: 'is-danger',
              queue: false,
              indefinite: true
            });
          }
        }
      });
    },
    async onXLorPasteExport() {
      const arr = [];
      for (const [name, handle] of this.$store.getters.allNameHandle) {
        arr.push(`${name},${handle}`);
      }
      const { token } = await (
        await fetch('https://api.xlorpaste.cn/', {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: Base64.encodeURI(
            JSON.stringify({
              body: arr.join('\n'),
              lang: 'text'
            })
          )
        })
      ).json();
      this.$buefy.notification.open({
        message: `导出成功 Token ${token}`,
        type: 'is-info',
        indefinite: true
      });
    },
    onToggleAction() {
      if (this.showActionBar) {
        this.showActionBar = false;
        window.addEventListener('keypress', this.onToggleAction);
        this.$buefy.toast.open({
          message: '按任意键显示操作',
          type: 'is-info'
        });
      } else {
        this.showActionBar = true;
        window.removeEventListener('keypress', this.onToggleAction);
      }
    },
    async onRefresh() {
      const data = this.$store.getters.allNameHandle;
      await this.$store.dispatch('clearAll');
      this.multiAddHandles(data);
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
  filters: {
    transform(data) {
      return data.map(user => {
        return {
          name: user.name,
          handle: user.handle,
          rating: user.rating,
          maxRating: user.maxRating,
          acNum:
            typeof user.acProblems === 'function'
              ? user.acProblems().length
              : filterAC(user.submissions).length,
          contestNum:
            typeof user.contests === 'function'
              ? user.contests().length
              : filterContest(user.ratingChanges).length
        };
      });
    }
  }
};
</script>

<style></style>
