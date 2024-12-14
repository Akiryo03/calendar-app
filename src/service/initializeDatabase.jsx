// initializeDatabase.js
import { ref, set } from 'firebase/database';
import { database } from '../firebase';

export const initializeGroupStructure = async (groupId, name, creatorId) => {
  await set(ref(database, `groups/${groupId}`), {
    name: name,
    createdBy: creatorId,
    members: {
      [creatorId]: true
    },
    events: {}
  });
};