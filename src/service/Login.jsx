import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';  // 追加
import { database } from '../firebase';  // 追加

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        // 新規登録
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await saveUserData(userCredential.user);  // ユーザー情報を保存
      } else {
        // ログイン
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveUserData = async (user) => {
    await set(ref(database, `users/${user.uid}`), {
      email: user.email,
      name: name,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="login-container">
      <h2>{isSignUp ? '新規登録' : 'ログイン'}</h2>
      <form onSubmit={handleSubmit}>
        {isSignUp && (  // 新規登録時のみ表示
          <input
            type="text"
            placeholder="お名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          {isSignUp ? '登録' : 'ログイン'}
        </button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'ログインへ' : '新規登録へ'}
      </button>
    </div>
  );
}

export default Login;