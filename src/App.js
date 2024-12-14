import logo from './logo.svg';
import './App.css'; 
import Calendar from './components/Calendar';
import { useEffect, useState } from 'react';
import Login from './service/Login';
import { auth } from   './firebase';


function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return user ? <Calendar /> : <Login />;
  }


export default App;
