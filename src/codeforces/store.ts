import localforage from 'localforage';

import { getUser, getContestList } from './api';
import { UserDTO, ContestDTO } from './type';
import { Member } from './member';

const handleStore = localforage.createInstance({
  name: 'Handle'
});

const memberStore = new Map<string, Member>();

const contestStore = new Map<number, ContestDTO>();

const recentContestNum = 10;
const recentContests: ContestDTO[] = [];

export async function loadDB() {
  const handles: UserDTO[] = [];
  const members: Member[] = [];
  await handleStore.iterate((value: UserDTO) => {
    handles.push(value);
    const name = value.name;
    const member = new Member(value);
    const srcMember = memberStore.get(name);
    if (srcMember !== undefined && srcMember !== null) {
      member.merge(srcMember);
    }
    memberStore.set(name, member);
  });
  memberStore.forEach((value: Member) => {
    members.push(value);
  });
  for (const contest of await getContestList()) {
    if (recentContests.length < recentContestNum) {
      recentContests.push(contest);
    }
    contestStore.set(contest.id, contest);
  }
  return [handles, members];
}

export async function clearDB() {
  await handleStore.clear();
  memberStore.clear();
}

export function getRecentContests() {
  return recentContests;
}

export async function addHandle(
  name: string,
  handle: string
): Promise<[UserDTO, Member] | undefined> {
  if (await handleStore.getItem(handle)) {
    return undefined;
  }
  const user = await getUser(handle, name);
  const member = new Member(user);
  const srcMember: Member | undefined = memberStore.get(name);
  if (srcMember !== undefined && srcMember !== null) {
    member.merge(srcMember);
  }
  await handleStore.setItem(handle, user);
  memberStore.set(name, member);
  return [user, member];
}

export async function removeHandle(name: string, handle: string) {
  const member = memberStore.get(name);
  if (member === undefined) {
    return undefined;
  }
  await handleStore.removeItem(handle);
  member.remove(handle);
  if (member.handles.length === 0) {
    memberStore.delete(name);
    return [undefined, undefined];
  } else {
    return [undefined, member];
  }
}

export function getContestById(id: number) {
  return contestStore.get(id);
}
