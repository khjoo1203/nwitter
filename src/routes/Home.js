import React, { useEffect, useState } from 'react';
import Nweet from '../components/Nweet';
import { dbService } from '../firebase';
import NweetForm from '../components/NweetForm';

const Home = ({ userObj }) => {
  console.log('userObj', userObj);
  
  const [nwits, setNwits] = useState([]);
 
  const getNwits = async () => {
    const dbNwits = await dbService.collection('nweets').get();
    dbNwits.forEach((document) => {
      const nwitObject = {
        ...document.data(),
        id: document.id,
      };
      setNwits((prev) => [nwitObject, ...prev]);
    });
  };

  useEffect(() => {
    getNwits();
    dbService.collection('nweets').onSnapshot((snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNwits(nweetArray);
    });
  }, []);

  
  

  return (
    <div className='container'>
      <NweetForm userObj={userObj} />
      <div style={{marginTop: 30}}>
        {nwits.map((nwit) => (
          <Nweet
            key={nwit.id}
            nwitObj={nwit}
            isOwner={nwit.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
