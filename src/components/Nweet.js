import React, { useState } from 'react';
import { deleteObject, ref } from '@firebase/storage';
import { dbService, storageService } from '../firebase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nwitObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNwit, setNewNwit] = useState(nwitObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm('정말 이 nwitter를 삭제하시겠습니까?');
    if (ok) {
      //delete nwitter
      await dbService.doc(`nweets/${nwitObj.id}`).delete();
      await deleteObject(ref(storageService, nwitObj.attachmentUrl));
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    //console.log(nwitObj, newNwit);
    await dbService.doc(`nweets/${nwitObj.id}`).update({
      text: newNwit,
    });
    setEditing(false);
  };

  return (
    <div className='nweet'>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form className='container nweetEdit' onSubmit={onSubmit}>
                <input
                  className='formInput'
                  type="text"
                  value={newNwit}
                  placeholder="Edit your nwitter"
                  onChange={(event) => setNewNwit(event.target.value)}
                  required
                />
                <input className='formBtn' type="submit" value="Update Nwitter" />
              </form>
              <button className='formBtn cancelBtn' onClick={toggleEditing}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nwitObj.text}</h4>
          {nwitObj.attachmentUrl && <img src={nwitObj.attachmentUrl} alt="" />}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
