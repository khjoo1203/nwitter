import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, dbService } from '../firebase';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from '@firebase/firestore';

//1. 로그인한 유저정보 prop으로 받기
const Profile = ({refreshUser, userObj }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    authService.signOut();
    // authService.currentUser.uid
    navigate('/');
  };
  //2. 내 nweets 얻는 function 생성
  const getMyNweets = async () => {
    //3. 트윗 불러오기
    //3-1. dbService의 컬렉션 중 "nweets" Docs에서 userObj의 uid와 동일한 creatorID를 가진 모든 문서를 내림차순으로 가져오는 쿼리(요청) 생성
    const q = query(
      collection(dbService, 'nweets'),
      where('creatorId', '==', `${userObj.uid}`),
      orderBy('createAt', 'desc')
    );
    //console.log('userObj', userObj);
    //3-2.getDocs()메서드로 쿼리 결과 값 가져오기
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, ' => ', doc.data());
    });
  };
  //4. 내 nweets 얻는 function 호출
  useEffect(() => {
    getMyNweets();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      // console.log('콘솔', userObj.updateProfile);
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  
  return (
    <div className="container">
      <form className='profileForm' onSubmit={onSubmit}>
        <input className='formInput' type="text" autoFocus placeholder='Display name' value={newDisplayName} onChange={(event) => setNewDisplayName(event.target.value)} />
        <input className='formBtn' style={{marginTop: 10}} type="submit" value="Update Profile" />
      </form>
      <span className='formBtn cancelBtn logOut' onClick={onLogOutClick}>Log Out</span>
    </div>
  );
};

export default Profile;
