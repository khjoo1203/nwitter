import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Profile from '../routes/Profile';
import Navigation from './Navigation';

const Router = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <BrowserRouter>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <div className='home'>
        <Routes>
          {isLoggedIn ? (
            <>
              <Route exact path="/" element={<Home userObj={userObj} />} />
              <Route
                exact
                path="/profile"
                element={
                  <Profile userObj={userObj} refreshUser={refreshUser} />
                }
              />
            </>
          ) : (
            <Route exact path="/" element={<Auth />} />
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Router;
