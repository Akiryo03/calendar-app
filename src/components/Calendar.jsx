import Calendar from 'react-calendar';
import {useState, useEffect,useRef} from 'react';
import './Calendar.css';
import PulldownMenu from './PulldownMenu';
import {database,auth} from '../firebase'
import { ref, onValue, push, set } from 'firebase/database';
import { createGroup, addGroupMember, } from '../service/groupService';
import { initializeGroupStructure } from '../service/initializeDatabase';
import { signOut } from 'firebase/auth';
import GroupManager from '../service/GroupManager';


function CalendarComponent(){
    const [date, setDate] = useState(new Date());
    const [events,setEvents] =useState([]);
    const [eventTitle,setEventTitle] =useState('');
    const [assignee,setAssignee] = useState('');
     const [currentGroupId, setCurrentGroupId] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');

    useEffect(() => {
        const eventsRef = ref(database, 'events');
        
        onValue(eventsRef, (snapshot) => {
            const data = snapshot.val();
            const eventsArray = data ? Object.values(data) : [];
            setEvents(eventsArray);
        });
    }, []);

    useEffect(() => {
      const eventsPath = currentGroupId 
        ? `groups/${currentGroupId}/events`
        : `users/${auth.currentUser.uid}/events`;
      
      const eventsRef = ref(database, eventsPath);
      const unsubscribe = onValue(eventsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const eventsArray = Object.values(data);
          setEvents(eventsArray);
        } else {
          setEvents([]);
        }
      });
  
      return () => unsubscribe();
    }, [currentGroupId]);
  
    
      // メンバー招待ハンドラ
      const handleInviteMember = async () => {
        if (!inviteEmail.trim() || !currentGroupId) return;
        await addGroupMember(currentGroupId, inviteEmail);
        setInviteEmail('');
      };
      

      const handleAddEvent = async () => {
        if (eventTitle.trim() === '') return;
    
        const newEvent = {
          id: Date.now(),
          date: date.toISOString(),
          title: eventTitle,
          assignee: assignee,
          isCompleted: false,
          createdBy: auth.currentUser.uid
        };
    
        const eventsPath = currentGroupId 
          ? `groups/${currentGroupId}/events`
          : `users/${auth.currentUser.uid}/events`;
        
        const newEventRef = push(ref(database, eventsPath));
        await set(newEventRef, newEvent);
    
        setEventTitle('');
        setAssignee('');
      };

      const getEventsForDate = (selectedDate) => {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === selectedDate.toDateString();
        });
    };

    const exportEvents = () => {
        const dataStr = JSON.stringify(events);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'calendar-events.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const importEvents = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const importedEvents = JSON.parse(e.target.result);
            setEvents([...events, ...importedEvents]);  // 既存のイベントに追加
        };
        
        reader.readAsText(file);
    };

    const changeIsCompleted = (id) =>   {
        const newEvents =[...events];
        const events = newEvents.find((events)=>events.id === id);
        events.isCompleted = !events.isCompleted;
        setEvents(newEvents);
    }

    const handleLogout = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error(error);
      }
    };

    return(
        
     <div className='calendar-container'> 
       {/* グループ作成UI */}
       <div className="calendar-container">
       <GroupManager onGroupSelect={setCurrentGroupId} />

      {/* メンバー招待UI */}
      {currentGroupId && (
        <div className="invite-controls">
          <input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="招待するメールアドレス"
          />
          <button onClick={handleInviteMember}>招待する</button>
        </div>
       )}
    <div> 
    <button onClick={handleLogout} className="button">Logout</button>  
    <button className='button'
     onClick={exportEvents}>export</button>
    <input 
        type="file" 
        accept=".json" 
        onChange={importEvents}
        style={{ margin: '0 10px' }}
        />
        </div>
        <Calendar
        value={date}
        onChange={setDate}
        />
        <div>
        <h2>
            Add Events
        </h2>
        </div>
        <div>
            <input className='input'
             type = 'text'
             placeholder='イベントタイトル'
             value = {eventTitle}
             onChange={(e)=>setEventTitle(e.target.value)}
            />
             <PulldownMenu onSelect={(selectedEvent) => {
            setEventTitle(selectedEvent);
        }} /> 
        <select 
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="event-select"
        >
            <option value="">担当者を選択</option>
            <option value="秋山">秋山</option>
            <option value="安田">安田</option>
        </select>
            <button onClick={handleAddEvent} className='button'>
                Add</button> 
        </div>
        <div>
    <h2>Events at {date.toLocaleDateString()}</h2>
    <ul>
    {getEventsForDate(date).map((event) => (
        <li key={event.id} className="event-item">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    type="checkbox"
                    checked={event.isCompleted}
                    onChange={() => {
                        const newEvents = events.map(e => {
                            if (e.id === event.id) {
                                return { ...e, isCompleted: !e.isCompleted };
                            }
                            return e;
                        });
                        setEvents(newEvents);
                    }}
                />
                <span style={{
                    marginLeft: '10px',
                    textDecoration: event.isCompleted ? 'line-through' : 'none'
                }}>
                    {event.title}
                    {event.assignee} && <span className="assignee-tag">担当:</span>
                </span>
            </div>
            <button 
                onClick={() => {
                    const newEvents = events.filter(e => e.id !== event.id);
                    setEvents(newEvents);
                }}
                className="button"
            >
                Delete
            </button>
        </li>
        
    ))}
</ul>
</div>
        </div>
        </div>
        
    )
    };


export default CalendarComponent;    