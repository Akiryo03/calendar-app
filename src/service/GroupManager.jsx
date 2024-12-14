import { useState, useEffect } from 'react';
import { database, auth } from '../firebase';
import { ref, push, set, onValue } from 'firebase/database';

function GroupManager({ onGroupSelect }) {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');

  // グループ一覧の取得
  useEffect(() => {
    const groupsRef = ref(database, 'groups');
    const unsubscribe = onValue(groupsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const groupArray = Object.entries(data).map(([id, group]) => ({
          id,
          ...group
        }));
        setGroups(groupArray);
      }
    });

    return () => unsubscribe();
  }, []);

  // グループ作成
  const createGroup = async () => {
    if (!newGroupName.trim() || !auth.currentUser) return;

    const groupRef = ref(database, 'groups');
    const newGroupRef = push(groupRef);
    
    await set(newGroupRef, {
      name: newGroupName,
      createdBy: auth.currentUser.uid,
      members: {
        [auth.currentUser.uid]: true
      }
    });

    setNewGroupName('');
  };

  // グループ選択時の処理
  const handleGroupSelect = (groupId) => {
    setSelectedGroupId(groupId);
    onGroupSelect(groupId);
  };

  return (
    <div className="group-manager">
      <div className="group-creator">
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="新しいグループ名"
        />
        <button onClick={createGroup}>グループを作成</button>
      </div>

      <div className="group-selector">
        <select 
          value={selectedGroupId} 
          onChange={(e) => handleGroupSelect(e.target.value)}
        >
          <option value="">個人カレンダー</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default GroupManager;