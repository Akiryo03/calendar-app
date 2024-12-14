import { ref, push, set, get, update } from 'firebase/database';
import { database, auth } from   '../firebase';

// グループ作成
export const createGroup = async (groupName) => {
  const groupRef = push(ref(database, 'groups'));
  await set(groupRef, {
    name: groupName,
    createdBy: auth.currentUser.uid,
    members: {
      [auth.currentUser.uid]: true
    }
  });
  return groupRef.key;
};

// メンバー追加
export const addGroupMember = async (groupId, userEmail) => {
  const userRef = ref(database, `users`);
  const userSnapshot = await get(userRef);
  const users = userSnapshot.val();
  
  const userId = Object.keys(users).find(key => users[key].email === userEmail);
  if (!userId) throw new Error('ユーザーが見つかりません');

  await update(ref(database, `groups/${groupId}/members`), {
    [userId]: true
  });
};