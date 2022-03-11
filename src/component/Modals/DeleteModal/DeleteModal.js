import axios from 'axios';
import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';

function DeleteModal({ show, setShowDelete, data ,type}) {
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);
  const user = JSON.parse(window.localStorage.getItem('user'));

  useEffect(()=>{
    console.log(data);
  },[])
  const handleConfirm = () =>{
    axios({
      method: 'delete',
      url: `${process.env.REACT_APP_SERVER_URL}/user/${type}`,
      data: data,
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('authtoken'),
      },
    }).then((res)=>{
      setShowDelete(false);
      axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${user.username}`).then((value) => {
        window.localStorage.setItem('user', JSON.stringify(value.data));
        location.reload();
      });
    }).catch((error)=>{
      console.log(error);
      setShowDelete(false);
    })
  }
  return (
    <>
      <Modal
        isOpen={show}
        className={`${
          darkMode && 'dark'
        } h-max lg:w-max w-5/6 bg-white mx-auto 2xl:mt-60 lg:mt-36 mt-32 shadow `}
      >
        <div className={``}>
          <h2 className="2xl:text-2xl lg:text-lg py-4 2xl:py-4 lg:py-2 dark:bg-dbeats-dark-primary dark:text-white text-right">
            <span
              className="ml-5 cursor-pointer hover:bg-dbeats-dark-alt px-2.5 py-0.5"
              onClick={() => setShowDelete(false)}
            >
              <i className="fas fa-times"></i>
            </span>
          </h2>
          <hr className="py-2  dark:bg-dbeats-dark-alt" />
          <div className="px-4 py-2 dark:text-white dark:bg-dbeats-dark-alt">
              <p>Are you sure you want to delete it from Dbeats?</p>
              {data.meta_url &&             
              <p>
              Note: Your Content will only be deleted from Dbeats but will be <br /> available on IPFS to anyone
              who has the <a href={data.meta_url} className='text-dbeats-secondary-light'>Link</a>
            </p>}
            <button onClick={handleConfirm} className="mt-3 px-2 py-1 rounded-md bg-red-600 hover:bg-red-400 text-right">
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DeleteModal;
