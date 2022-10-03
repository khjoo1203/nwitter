import React, { useEffect, useState } from 'react';
import Router from './Router';
import { authService } from '../firebase';

const App = () => {
  //console.log(authService.currentUser);
  const [init, setInit] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        //setUserObj(user)
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: ((args) => user.updateProfile(args)),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, [])

  const refreshUser = () => {
    //console.log("이름", authService.currentUser.displayName);
    const user = authService.currentUser;
    //setUserObj(Object.assign({},user))
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: ((args) => user.updateProfile(args)),
    });
  }
  return (
    <>
      {init? <Router refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Initializing..."}
    </>
  );
};

export default App;
