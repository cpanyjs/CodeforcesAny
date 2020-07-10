import Vue from 'vue';
import Vuex from 'vuex';

import { UserDTO, HandleDTO } from '../codeforces/type';
import { addHandle, clearDB, removeHandle } from '../codeforces/store';
import { Member } from '@/codeforces/member';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    handles: [] as HandleDTO[],
    members: [] as Member[]
  },
  mutations: {
    initStore(
      state,
      { handles, members }: { handles: HandleDTO[]; members: Member[] }
    ) {
      state.handles.push(...handles);
      state.members.push(...members);
    },
    pushHandle(state, user: UserDTO) {
      state.handles.push(user);
    },
    removeHandle(state, { handle }: { handle: string }) {
      const id = state.handles.findIndex(value => value.handle === handle);
      if (id !== -1) {
        state.handles.splice(id, 1);
      }
    },
    removeMember(state, { name }: { name: string }) {
      const id = state.members.findIndex(value => value.name === name);
      if (id !== -1) {
        state.handles.splice(id, 1);
      }
    },
    updateMember(state, member: Member) {
      const id = state.members.findIndex(value => value.name === member.name);
      if (id == -1) {
        state.members.push(member);
      } else {
        state.members.splice(id, 1, member);
      }
    },
    clearAllSync(state) {
      state.handles.splice(0);
      state.members.splice(0);
    }
  },
  actions: {
    async addHandle(
      { commit },
      { name, handle }: { name: string; handle: string }
    ) {
      const result = await addHandle(name, handle);
      if (result) {
        commit('pushHandle', result[0]);
        commit('updateMember', result[1]);
      }
    },
    async removeHandle(
      { commit },
      { name, handle }: { name: string; handle: string }
    ) {
      const result = await removeHandle(name, handle);
      if (result) {
        commit('removeHandle', { handle });
        if (result[1]) {
          commit('updateMember', result[1]);
        } else {
          commit('removeMember', { name });
        }
      }
    },
    async clearAll({ commit }) {
      await clearDB();
      commit('clearAllSync');
    }
  },
  modules: {}
});
