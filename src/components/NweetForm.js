import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL } from '@firebase/storage';
import { storageService, dbService } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const NweetForm = ({ userObj }) => {
  const [nwit, setNwit] = useState('');
  const [attachment, setAttachment] = useState('');
  //console.log(nwits);
  const onFileChange = (event) => {
    //console.log(event.target.files);
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    //console.log(theFile);
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      //console.log("finished event", finishedEvent);
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onSubmit = async (event) => {
    if (nwit === '') {
      return;
    }
    event.preventDefault();
    let attachmentUrl = '';

    if (attachment !== '') {
      //파일 경로 참조 만들기
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      //storage 참조 경로로 파일 업로드 하기
      const response = await uploadString(
        attachmentRef,
        attachment,
        'data_url'
      );
      //storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl변수에 넣어서 업데이트
      attachmentUrl = await getDownloadURL(response.ref);
    }
    //트윗 오브젝트
    const nweet = {
      text: nwit,
      createAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    //console.log('응답', response);
    //트윗하기 누르면 nweet형태로 새로운 document 생성하여 nweets 콜렉션에 넣기
    await dbService.collection('nweets').add(nweet);
    //state 비워서 form 비우기
    setNwit('');
    //파일 미리보기 img src 비워주기
    setAttachment('');
  };

  const onClearAttachment = () => setAttachment(''); //null에서 빈값('')으로 수정, 트윗할 때 텍스트만 입력시 이미지 url""로 비워두기 위함
  return (
    <form className="factoryForm" onSubmit={onSubmit}>
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nwit}
          onChange={(event) => setNwit(event.target.value)}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input className='factoryInput__arrow' type="submit" value="Nwitter" />
      </div>
      <label for="attach-file" className='factoryInput__label'>
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input style={{opacity: 0,}} id="attach-file" type="file" accept="image/*" onChange={onFileChange} />
      {attachment && (
        <div className='factoryForm__attachment'>
          <img style={{backgroundImage: attachment,}} src={attachment} alt="" />
          <div className='factoryForm__clear' onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetForm;
