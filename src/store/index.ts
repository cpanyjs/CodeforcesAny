import Vue from 'vue';
import Vuex from 'vuex';

import { UserDTO, HandleDTO } from '../codeforces/type';
import { addHandle, clearDB } from '../codeforces/store';
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
    async clearAll({ commit }) {
      await clearDB();
      commit('clearAllSync');
    }
  },
  modules: {}
});
