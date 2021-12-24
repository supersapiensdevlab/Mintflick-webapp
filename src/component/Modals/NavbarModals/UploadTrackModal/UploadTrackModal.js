import axios from 'axios';
import { NFTStorage } from 'nft.storage';
import Noty from 'noty';
import React, { useEffect, useState } from 'react';
import Chips from 'react-chips';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Dropdown from '../../../dropdown.component';
import { makeStorageClient } from '../../../uploadHelperFunction';
import { chipTheme, theme } from '../Theme';

const UploadTrackModal = (props) => {
  const user = JSON.parse(window.localStorage.getItem('user'));

  const darkMode = useSelector((state) => state.toggleDarkMode);

  const genre = [
    'EDM',
    'Rock',
    'Jazz',
    'Dubsteps',
    'Rhythm & Blues',
    'Techno',
    'Country Music',
    'Electro',
    'Indies Rock',
    'Pop',
  ];

  const mood = [
    'Happy',
    'Exuberant',
    'Energetic',
    'Frantic',
    'Anxious/Sad',
    'Depression',
    'Calm',
    'Contentment',
  ];

  const attribution = ['No Attribution', 'Allow Attribution'];

  const commercialUse = ['Non Commercial', 'Commercial Use'];

  const derivativeWorks = ['No-Selection', 'No Derivative Works', 'Share-Alike'];

  const suggestions = ['Games', 'Edu', 'Sci-Fi', 'Counter-Strike'];

  const [selectedGenre, setSelectedGenre] = useState(genre[0]);
  const [selectedMood, setSelectedMood] = useState(mood[0]);
  const [selectedAttribution, setSelectedAttribution] = useState(attribution[0]);
  const [selectedCommercialUse, setSelectedCommercialUse] = useState(commercialUse[0]);
  const [selectedDerivativeWorks, setSelectedDerivativeWorks] = useState(derivativeWorks[0]);
  const [tags, setTags] = useState([]);

  const [track, setTrack] = useState({
    trackName: '',
    trackImage: '',
    trackFile: '',
    albumArt: '',
    fileName: '',
    cid: '',
    genre: '',
    mood: '',
    tags: [],
    description: '',
    royalty: 5,
    isrc: '',
    iswc: '',
    allowAttribution: '',
    commercialUse: '',
    derivativeWorks: '',
    tokenId: '',
    mintTrxHash: '',
  });

  const handleVideoTags = (e) => {
    setTags(e);
  };

  let name, value;

  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    setTrack({ ...track, [name]: value });
  };

  const fetchSuggestions = (value) => {
    return new Promise((resolve) => {
      if (value.length >= 1) {
        setTimeout(() => {
          let filtered = suggestions.filter(
            (opt) => opt.toLowerCase().indexOf(value.toLowerCase()) !== -1,
          );
          if (filtered.length === 0) {
            if (filtered[0] !== value) {
              let data = [value];
              resolve(data);
            }
          } else {
            resolve(filtered);
          }
        }, 1000);
      } else {
        resolve([]);
      }
    });
  };

  async function storeWithProgress() {
    const contract_address = process.env.CONTRACT_ADDRESS;
    // show the root cid as soon as it's ready
    const onRootCidReady = async (cid) => {
      //console.log('uploading files with cid:', cid);
      track.cid = cid;

      const apiKey =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhhMzIwRGQxRDBBNTBmMUQyYjNGNmZGZDM0MUI3ODdkNTYzQzBFYjUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzNDQ0ODE3MDg4MCwibmFtZSI6IkRCZWF0cyJ9.wGuicvEMGBKmKxqsiC4YhesIjBF11oP9EZXNYYN6w5k';
      const client = new NFTStorage({ token: apiKey });

      const metadata = await client.store({
        name: track.trackName,
        image: track.trackImage,
        animation_url: 'https://ipfs.io/ipfs/' + cid + '/' + track.trackFile.name,
        description: track.description,
        attributes: [
          {
            trait_type: 'Genre',
            value: track.genre,
          },
          {
            trait_type: 'Mood',
            value: track.mood,
          },
          {
            trait_type: 'Tags',
            value: track.tags,
          },
          {
            display_type: 'boost_percentage',
            trait_type: 'royalty',
            value: track.royalty,
          },
          {
            display_type: 'number',
            trait_type: 'ISRC',
            value: track.isrc,
          },
          {
            display_type: 'number',
            trait_type: 'ISWC',
            value: track.iswc,
          },
          {
            trait_type: 'Allow Attribution',
            value: track.allowAttribution,
          },
          {
            trait_type: 'Commercial Use',
            value: track.commercialUse,
          },
          {
            trait_type: 'Derivative Works',
            value: track.derivativeWorks,
          },
        ],
      });
      // Split ipfs metadata link into two parts
      const ipfsMetadata = metadata.url.split('ipfs://')[1];

      const options = {
        method: 'POST',
        url: 'https://api.nftport.xyz/v0/mints/customizable',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'ad092d8e-feb0-4430-92f7-1fa501b83bec',
        },
        data: {
          chain: 'polygon',
          contract_address: contract_address || '0x03160747B94BE986261D9340D01128d4d5566383',
          metadata_uri: `https://ipfs.io/ipfs/${ipfsMetadata}`,
          mint_to_address: user.wallet_id,
        },
      };
      axios
        .request(options)
        .then(function (response) {
          // //console.log(response.data);
          // //console.log(response.status);
          track.mintTrxHash = response.data.transaction_hash;

          const nftTokenOptions = {
            method: 'GET',
            url: `https://api.nftport.xyz/v0/mints/${response.data.transaction_hash}?chain=polygon`,
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'ad092d8e-feb0-4430-92f7-1fa501b83bec',
            },
          };
          document.getElementById('nftAddress').innerHTML = `Sailing Data from OpenSea...`;
          setTimeout(() => {
            axios
              .request(nftTokenOptions)
              .then(function (tokenIdRes) {
                track.tokenId = tokenIdRes.data.token_id;

                // //console.log('TOKEN ID DATA: ', tokenIdRes.data);
                // //console.log(
                //   'OpenSea Url of nft: ',
                //   `https://opensea.io/assets/matic/0x03160747b94be986261d9340d01128d4d5566383/${tokenIdRes.data.token_id}`,
                // );

                document.getElementById('nftAddress').innerHTML = `Check on OpenSea`;
                document.getElementById(
                  'nftAddress',
                ).href = `https://opensea.io/assets/matic/0x03160747b94be986261d9340d01128d4d5566383/${tokenIdRes.data.token_id}`;
              })
              .catch(function (e) {
                console.error(e);
              });
          }, 10000);
        })

        .catch(function (error) {
          console.error(error);
        });

      // axios.post('https://api.nftport.xyz/v0/mints/customizable', {
      //   "chain": "polygon",
      //   "contract_address": "0x5dbea8eb2b4e407b31663a4148724114178b5494",
      //   "metadata_uri": "https://ipfs.io/ipfs/bafyreidmdlj6xr55taqq6gglmjnjdegqmyn47sqlgqxdxv3ro5vpyyxxti/metadata.json",
      //   "mint_to_address": "0x5d55407a341d96418cEDa98E06C244a502fC9572"
      // });
      ////console.log('Metada.json URL', metadata.url);
    };
    track.albumArt = track.trackImage.name;
    track.fileName = track.trackFile.name;
    ////console.log(track);

    // const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });

    const files = [track.trackFile, track.trackImage];
    const totalSize = track.trackFile.size;
    let uploaded = 0;
    const onStoredChunk = (size) => {
      uploaded += size;
      const pct = totalSize / uploaded;
      console.log(`Uploading... ${pct.toFixed(2)}% complete`);
    };

    // makeStorageClient returns an authorized Web3.Storage client instance
    const client = makeStorageClient();

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    // client.put(files, { onRootCidReady, onStoredChunk });

    return client.put(files, { onRootCidReady, onStoredChunk });
  }

  const onFileChange = (e) => {
    if (e.target.name === 'trackFile') {
      track.trackFile = e.target.files[0];
      var trckName = e.target.files[0].name.replace(/\.[^/.]+$/, '');
      document.getElementById('trackName').value = trckName;
      track.trackName = trckName;
      document.getElementById('audio-label').textContent = trckName;
    } else if (e.target.name === 'trackImage') {
      track.trackImage = e.target.files[0];
      var trcImage = e.target.files[0].name.replace(/\.[^/.]+$/, '');
      document.getElementById('audio-thumbnail-label').textContent = trcImage;
    }
  };

  useEffect(() => {
    setTrack({
      ...track,
      genre: selectedGenre,
      mood: selectedMood,
      allowAttribution: selectedAttribution,
      commercialUse: selectedCommercialUse,
      derivativeWorks: selectedDerivativeWorks,
      tags: tags,
    });
    // eslint-disable-next-line
  }, [
    selectedGenre,
    selectedCommercialUse,
    selectedDerivativeWorks,
    selectedAttribution,
    selectedMood,
    tags,
  ]);

  const PostData = async (e) => {
    props.setLoader(false);
    e.preventDefault();
    let formDatanft = new FormData();
    formDatanft.append('videoFile', track.trackFile);

    // if (document.getElementById('is_nft').checked) {
    //   await mintNFT(
    //     user.wallet_id,
    //     formDatanft,
    //     track.trackFile,
    //     track.trackName,
    //     track.description,
    //   );
    //   const apiKey =
    //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhhMzIwRGQxRDBBNTBmMUQyYjNGNmZGZDM0MUI3ODdkNTYzQzBFYjUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzNDQ0ODE3MDg4MCwibmFtZSI6IkRCZWF0cyJ9.wGuicvEMGBKmKxqsiC4YhesIjBF11oP9EZXNYYN6w5k';
    //   const client = new NFTStorage({ token: apiKey });

    //   const metadata = await client.store({
    //     name: track.trackName,
    //     description: 'Minted at : ' + new Date(),
    //     image: track.trackImage,
    //     properties: { track: track.trackFile },
    //   });
    //   //console.log(metadata.url);
    // }
    const {
      trackName,
      trackImage,
      trackFile,
      genre,
      mood,
      tags,
      description,
      isrc,
      iswc,
      allowAttribution,
      commercialUse,
      derivativeWorks,
    } = track;

    storeWithProgress(e.target.value).then(() => {
      let formData = new FormData(); // Currently empty
      formData.append('userName', user.username);
      formData.append('userImage', user.profile_image);
      formData.append('trackName', trackName);
      formData.append('genre', genre);
      formData.append('mood', mood);

      tags.forEach((tag) => formData.append('tags', tag));

      formData.append('description', description);
      formData.append('isrc', isrc);
      formData.append('iswc', iswc);
      formData.append('allowAttribution', allowAttribution);
      formData.append('commercialUse', commercialUse);
      formData.append('derivativeWorks', derivativeWorks);
      formData.append('trackFile', trackFile, trackFile.name);
      formData.append('trackImage', trackImage, trackImage.name);
      formData.append('trackHash', track.cid);
      if (
        track.trackFile.length !== 0 &&
        track.trackImage.length !== 0 &&
        track.trackName.length !== 0 &&
        track.cid.length !== 0
      ) {
        axios
          .post(`${process.env.REACT_APP_SERVER_URL}/upload_music`, formData, {
            headers: {
              'content-type': 'multipart/form-data',
            },
          })
          .then(function (response) {
            setTrack({
              trackName: '',
              trackImage: '',
              trackFile: '',
              albumArt: '',
              fileName: '',
              cid: '',
              genre: '',
              mood: '',
              tags: [],
              description: '',
              royalty: 5,
              isrc: '',
              iswc: '',
              allowAttribution: '',
              commercialUse: '',
              derivativeWorks: '',
              tokenId: '',
              mintTrxHash: '',
            });
            props.setLoader(true);
            props.handleCloseTrackUpload();
            Noty.closeAll();
            new Noty({
              type: 'success',
              text: response.data,
              theme: 'metroui',
              layout: 'bottomRight',
            }).show();
            // //console.log(response.data);
          })
          .catch((error) => {
            Noty.closeAll();
            new Noty({
              type: 'error',
              text: error.data,
              theme: 'metroui',
              layout: 'bottomRight',
            }).show();
            // console.log(error);
            // //console.log(error.data);
          });
      } else {
        Noty.closeAll();
        new Noty({
          type: 'error',
          text: 'Choose Audio File & Fill other Details',
          theme: 'metroui',
          layout: 'bottomRight',
        }).show();
      }
    });
  };

  return (
    <Modal
      isOpen={props.showTrackUpload}
      className={
        darkMode
          ? 'h-max lg:w-max w-5/6 mt-20 mx-auto 2xl:mt-24 lg:mt-14 bg-dbeats-dark-primary rounded-xl '
          : 'h-max lg:w-max w-5/6 mt-20 mx-auto 2xl:mt-24 lg:mt-14 bg-gray-50 rounded-xl shadow-2xl'
      }
    >
      <div
        className={`${
          darkMode && 'dark'
        } font-proxima-reg z-100  transition duration-1000 ease-in-out mx-auto p-5 lg:p-2 2xl:p-5`}
      >
        <h2 className="grid grid-cols-5 justify-items-center 2xl:text-2xl text-lg 2xl:py-4 py-4 lg:py-2 dark:bg-dbeats-dark-alt bg-white dark:text-white">
          <div className="col-span-4 pl-14">Upload Track</div>
          <div className="mr-7 flex justify-end w-full" onClick={props.handleCloseTrackUpload}>
            <i className="fas fa-times cursor-pointer"></i>
          </div>
        </h2>
        <hr />
        <form method="POST" encType="multipart/formdata">
          <div className=" bg-white text-gray-500  dark:bg-dbeats-dark-alt dark:text-gray-100   shadow-sm rounded-lg  2xl:px-5 2xl:py-5 lg:py-2 lg:px-2 px-2 py-1 mb-5 lg:mb-0 2xl:mb-5 lg:max-h-full  max-h-96  overflow-y-auto overflow-hidden">
            <div className="md:grid md:grid-cols-3 md:gap-6  mt-5 lg:mt-0 2xl:mt-5 ">
              <div className="md:col-span-1  ">
                <div className="lg:mt-0 2xl:mt-5 mt-0 md:col-span-2 2xl:p-5 lg:p-3 p-2  ">
                  <label className="block 2xl:text-sm text-sm lg:text-xs font-medium text-gray-700"></label>
                  <div className=" flex justify-center px-6 2xl:py-6 lg:py-4 py-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center ">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex  text-sm text-gray-600 justify-center ">
                        <label
                          htmlFor="file-upload"
                          className="text-center  relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <p className="text-center px-2 truncate w-32" id="audio-thumbnail-label">
                            Choose Album Art
                          </p>
                          <input
                            id="file-upload"
                            type="file"
                            required
                            name="trackImage"
                            accept=".jpg,.png,.jpeg"
                            onChange={onFileChange}
                            className="sr-only "
                          />
                        </label>
                        <p className="pl-1"> </p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
                <div className="2xl:mt-5 lg:mt-1 mt-0 md:col-span-2 2xl:p-5 lg:p-3 p-2">
                  <label className="block 2xl:text-sm text-sm lg:text-xs font-medium text-gray-700"></label>
                  <div className=" mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center ">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload2"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span className="p-2 truncate w-32" id="audio-label">
                            Choose Audio file
                          </span>
                          <input
                            required
                            id="file-upload2"
                            type="file"
                            accept=".mp3"
                            name="trackFile"
                            onChange={onFileChange}
                            className="sr-only "
                          />
                        </label>
                        <p className="pl-1"></p>
                      </div>
                      <p className="text-xs text-gray-500">MP3 up to 10MB</p>
                    </div>
                  </div>
                </div>
                <div className="2xl:mt-5 mt-0 md:col-span-2 2xl:p-5 lg:p-3 p-2   ">
                  <label className="block 2xl:text-sm text-sm lg:text-xs font-medium text-gray-700"></label>
                  <div className=" mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center ">
                      <div className="flex text-sm text-gray-600">
                        <input
                          id="is_nft"
                          name="isNFT"
                          type="checkbox"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <p className="px-3">Mint NFT</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="2xl:mt-5 lg:mt-1 mt-0 md:col-span-2">
                <div className=" sm:rounded-md  ">
                  <div className="2xl:p-5 lg:p-1.5 p-5  space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
                      <div className="col-span-3 sm:col-span-3">
                        <label
                          htmlFor="trackName"
                          className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                        >
                          Track Name
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="trackName"
                            id="trackName"
                            value={track.trackName}
                            onChange={handleInputs}
                            className="focus:ring-dbeats-dark-primary border-0 dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary  ring-0   flex-1 block w-full rounded-md sm:text-sm  "
                            placeholder=""
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-8">
                      <div className="col-span-4 sm:col-span-4">
                        <label
                          htmlFor="tags"
                          className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                        >
                          Tags
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <Chips
                            theme={theme(darkMode)[0]}
                            chipTheme={chipTheme(darkMode)[0]}
                            value={tags}
                            onChange={handleVideoTags}
                            suggestions={suggestions}
                            fromSuggestionsOnly={false}
                            fetchSuggestions={fetchSuggestions}
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-2 col-span-4 sm:col-span-2">
                        <label
                          htmlFor="company-website"
                          className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                        >
                          Genre
                        </label>
                        <div className="  flex rounded-md shadow-sm">
                          <Dropdown
                            data={genre}
                            setSelected={(genre) => setSelectedGenre(genre)}
                            getSelected={selectedGenre}
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-2 col-span-4 sm:col-span-2">
                        <label
                          htmlFor="company-website"
                          className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                        >
                          Mood
                        </label>
                        <div className="  flex rounded-md shadow-sm">
                          <Dropdown
                            data={mood}
                            setSelected={setSelectedMood}
                            getSelected={selectedMood}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-8">
                      <div className="col-span-4 sm:col-span-4">
                        <label
                          htmlFor="tags"
                          className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                        >
                          Track ISRC
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="isrc"
                            id="isrc"
                            value={track.isrc}
                            onChange={handleInputs}
                            className=" dark:placeholder-dbeats-dark-alt    focus:ring-dbeats-dark-primary border-0 dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary  ring-0   flex-1 block w-full rounded-md sm:text-sm  "
                            placeholder="eg. XX-XXX-YY-ZZZZZ"
                          />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-4">
                        <label
                          htmlFor="iswc"
                          className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                        >
                          Track ISWC
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="iswc"
                            id="iswc"
                            placeholder="eg. T-123.456.789.C"
                            value={track.iswc}
                            onChange={handleInputs}
                            className=" dark:placeholder-dbeats-dark-alt    focus:ring-dbeats-dark-primary border-0 dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary  ring-0   flex-1 block w-full rounded-md sm:text-sm  "
                          />
                        </div>
                      </div>
                    </div>

                    <div className="">
                      <label
                        htmlFor="description"
                        className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                      >
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={track.description}
                          onChange={handleInputs}
                          className="dark:placeholder-dbeats-dark-alt focus:ring-dbeats-dark-primary border-0 dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary  ring-0   flex-1 block w-full rounded-md sm:text-sm  "
                          placeholder="Any Behind the scenes you'll like your Audience to know!"
                        />
                      </div>
                    </div>

                    <div className="grid grid-col-2 gap-6">
                      <div className="grid lg:grid-cols-3 grid-col-1 gap-6">
                        <div className="col-span-2 sm:col-span-1">
                          <label
                            htmlFor="company-website"
                            className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                          >
                            Allow Attribution?
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <Dropdown
                              data={attribution}
                              setSelected={setSelectedAttribution}
                              getSelected={selectedAttribution}
                            />
                          </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                          <label
                            htmlFor="company-website"
                            className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                          >
                            Commercial Use?
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <Dropdown
                              data={commercialUse}
                              setSelected={setSelectedCommercialUse}
                              getSelected={selectedCommercialUse}
                            />
                          </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                          <label
                            htmlFor="company-website"
                            className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                          >
                            Derivative Works?
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <Dropdown
                              data={derivativeWorks}
                              setSelected={setSelectedDerivativeWorks}
                              getSelected={selectedDerivativeWorks}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:px-4 2xl:py-3 lg:py-2 lg:pt-3 lg:text-right text-center flex justify-end items-center">
            <Link
              className="text-sm font-medium dark:text-gray-100 text-gray-700 px-2"
              id="nftAddress"
              target="_blank"
              to="/"
            >
              NFT
            </Link>
            <input
              type="submit"
              onClick={PostData}
              value="Upload Audio"
              className="cursor-pointer inline-flex 
                self-center justify-center 2xl:py-2 py-1 
                lg:px-5 px-3 border border-transparent 
                shadow-sm 2xl:text-lg text-md lg:text-sm 
                font-bold rounded-md text-white bg-gradient-to-r 
                from-green-400 to-blue-500 hover:bg-indigo-700 
                transform transition delay-50 duration-300 
                ease-in-out hover:scale-105 focus:outline-none 
                focus:ring-0 focus:ring-offset-2 
                focus:ring-blue-500"
            ></input>
            <div
              className="animate-spin rounded-full h-7 w-7 ml-3 border-t-2 border-b-2 bg-gradient-to-r from-green-400 to-blue-500 "
              hidden={props.loader}
            ></div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UploadTrackModal;
