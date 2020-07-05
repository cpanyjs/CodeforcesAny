import localforage from 'localforage';

import { getUser } from './api';
import { UserDTO } from './type';
import { Member } from './member';

const handleStore = localforage.createInstance({
  name: 'Handle'
});

const memberStore = new Map<string, Member>();

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
  return [handles, members];
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
