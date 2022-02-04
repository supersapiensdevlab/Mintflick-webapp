import React from 'react';

import { NFTStorage, File } from 'nft.storage';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';

const apiKey =
  process.env.NFT_STORAGE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGQzZWU1Nzc4OTI0MjJCOWZGNzNENDk5ODk1REE1MGU5Y2M4MWFGRUMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MzgzMDM2NzEyMCwibmFtZSI6ImRiZWF0cy10ZXN0In0.ZtXseweUR_nIpa5jvM0gwPl67t1Wb5s0RjOwJuye9J8';
const client = new NFTStorage({ token: apiKey });

export const PictureModal = (props) => {
  const darkMode = useSelector((state) => state.toggleDarkMode);

  const handleChange = async (e) => {
    if (e.target.files.length) {
      await client
        .store({
          name: 'Pinpie',
          description: 'Pin is not delicious beef!',
          image: new File([e.target.files[0]], 'pinpie.jpg', { type: 'image/jpg' }),
        })
        .then(async (res) => {
          console.log(res.url);
        });
      //   setImage({
      //     preview: URL.createObjectURL(e.target.files[0]),
      //     raw: e.target.files[0],
      //   });
    }
  };
  return (
    <>
      <div className={`${darkMode && 'dark'}`}>
        <Modal
          isOpen={props.showPictureModal}
          className={
            darkMode
              ? 'h-max lg:w-max w-96 mx-auto 2xl:mt-32 lg:mt-16 mt-20 bg-dbeats-dark-primary dark:bg-dbeats-dark-secondary rounded-xl'
              : 'h-max lg:w-max   mx-auto 2xl:mt-32 lg:mt-16 mt-20 bg-gray-50 rounded-xl shadow-2xl'
          }
        >
          <div className="modal-overlay">
            <label className="bg-dbeats-light flex items-center text-white font-bold px-5 py-2 rounded-lg cursor-pointer">
              <input type="file" style={{ display: 'none' }} onChange={handleChange} />
              Select File to Upload
            </label>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default PictureModal;

// ipfs://bafyreib4pff766vhpbxbhjbqqnsh5emeznvujayjj4z2iu533cprgbz23m/metadata.json
