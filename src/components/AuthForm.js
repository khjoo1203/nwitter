import React, {useState} from 'react';
import { authService } from '../firebase';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        //create account
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        //log in
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    <>
      <form className='container' onSubmit={onSubmit}>
        <input
          className='authInput'
          name={email}
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className='authInput'
          name={password}
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <input
          className='authInput authSubmit'
          type="submit"
          value={newAccount ? 'Create Account' : 'Sign In'}
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span className='authSwitch' onClick={toggleAccount}>
        {newAccount ? 'Sign In' : 'Create Account'}
      </span>
    </>
  );
};

export default AuthForm;
