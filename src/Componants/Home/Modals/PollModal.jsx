import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { ChartBar, Send, X } from "tabler-icons-react";
import PolygonToken from "../../../Assets/logos/PolygonToken";
import useUserActions from "../../../Hooks/useUserActions";

function PollModal({ setPollModalOpen }) {
  const [options, setoptions] = useState([]);
  const [option, setoption] = useState("");
  const [isNFT, setIsNFT] = useState(false);
  const [nftPrice, setNFTPrice] = useState(1);
  const [uploadingPoll, setUploadingPoll] = useState(false);
  const [question, setQuestion] = useState('');
  const [loadFeed] = useUserActions();


  const clearState = async () => {
    setUploadingPoll(false)
    setPollModalOpen(false);
    setoptions([])
    setoption("");
    setQuestion("");
    setIsNFT(false)
    setNFTPrice(1)
    await loadFeed();
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setUploadingPoll(true)
    if (options.length > 1 && !isNFT) {
      let data = {
        question: question,
        options: options
      }
      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/user/addpoll`, data, {
          headers: {
            'content-type': 'application/json',
            'auth-token': JSON.stringify(localStorage.getItem('authtoken')),
          },
        })
        .then(async (res) => {
          await clearState()
        })
        .catch((err) => {
          console.log(err);
          clearState()
        });
    }
  }

  useEffect(()=>{
    console.log(JSON.stringify(options))
  },[options])

  return (
    <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
      <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
        <div className="flex justify-between items-center p-2">
          <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
            <ChartBar />
            Take Poll
          </h3>
          <X
            onClick={() => setPollModalOpen(false)}
            className="text-brand2 cursor-pointer"
          ></X>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
      >
        <div className="w-full p-4 space-y-3">
          <input
            type="text"
            placeholder="Ask a question..."
            className="input w-full "
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <div className="w-full flex flex-col gap-1">
            {options.map((option, i) => (
              <div
                key={i}
                className="flex gap-2 p-2 border-2 rounded-lg border-slate-200 dark:border-slate-700"
              >
                <span className="w-full text-brand2 ">{option.option}</span>
                <button
                  onClick={() => {
                    setoptions(
                      options.filter((item, index) => {
                        return index !== i;
                      })
                    );
                  }}
                  className="btn  btn-error btn-xs text-slate-50"
                >
                  remove
                </button>
              </div>
            ))}
          </div>
          {options.length < 4 &&
            <div className="flex gap-2">
              <input
                type="text"
                onChange={(e) => setoption(e.target.value)}
                value={option}
                placeholder="Add option"
                className="input w-full "
              />

              <button
                type={"button"}
                onClick={() => {
                  if (option != '') {
                    setoptions([...options, { option, selectedBy: [] }]);
                    setoption("");
                  }
                }}
                className={`btn  btn-primary btn-outline`}
              >
                Add
              </button>
            </div>
          }

          <div className="w-fit flex space-x-2">
            <label className="flex items-center cursor-pointer gap-2">
              <input
                type="checkbox"
                value={isNFT}
                onChange={() => setIsNFT(!isNFT)}
                className="checkbox checkbox-primary"
              />
              <span className="label-text text-brand3">Mint as NFT</span>
            </label>
            {isNFT && (
              <div className="form-control">
                <label className="input-group">
                  <input
                    min={1}
                    type="number"
                    placeholder="1"
                    className="input input-bordered input-sm w-24"
                    value={nftPrice}
                    onChange={(e) => setNFTPrice(e.target.value)}
                    required={true}
                  />
                  <span className="text-brand3 bg-slate-300 dark:bg-slate-600 ">
                    <PolygonToken></PolygonToken> &nbsp; Matic
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* While minting NFT */}
          {/* <div className="flex flex-col text-center">
                        <div
                            className={`${minting === true ? 'block' : 'hidden'} mx-3 text-white my-5 `}
                        >
                            👻 Confirm NFT Mint on the next Popup
                        </div>
                        {minting === 'token created' ? (
                            <div className={`  mx-3 text-white my-5 `}>
                                ✅ NFT Token Created Successfully. Confirm Market Listing on the Popup
                            </div>
                        ) : null}

                        <div
                            className={`${mintingProgress === 66 ? 'block' : 'hidden'
                                } text-center flex mx-3 my-5`}
                        >
                            <p className="no-underline  text-white">Wrapping Up Things &nbsp;</p>
                            <p className="no-underline  text-white"> Please Wait...</p>
                        </div>

                        <div
                            className={`${minting !== null &&
                                minting !== true &&
                                mintingProgress === 100 &&
                                minting !== 'token created'
                                ? 'block'
                                : 'hidden'
                                } text-center flex mx-3 my-5`}
                        >
                            <p className="no-underline  text-dbeats-light">🚀 NFT Minted &nbsp;</p>
                            <a
                                target={'_blank'}
                                rel="noopener noreferrer "
                                className="dark:text-dbeats-light cursor-pointer underline  "
                                href={`https://polygonscan.com/tx/${minting}`}
                            >
                                Check on Polygonscan
                            </a>
                        </div>
                        <ProgressBar
                            className="w-full mx-auto"
                            percent={mintingProgress}
                            transitionDuration={1000}
                            filledBackground="linear-gradient(to right,  #31c48D, #3f83f8)"
                        >
                            <Step transition="scale">
                                {({ accomplished }) => (
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        className="w-6"
                                        src={icon3}
                                    />
                                )}
                            </Step>
                            <Step transition="scale">
                                {({ accomplished }) => (
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        className="w-8"
                                        src={icon2}
                                    />
                                )}
                            </Step>
                            <Step transition="scale">
                                {({ accomplished }) => (
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        className="w-6"
                                        src={icon1}
                                    />
                                )}
                            </Step>
                            <Step transition="scale">
                                {({ accomplished }) => (
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        width="30"
                                        src={icon1}
                                    />
                                )}
                            </Step>
                        </ProgressBar>
                    </div> */}

          <button
            type={"submit"}
            className={`btn  w-full ${uploadingPoll ? "loading" : "btn-brand"}`}
          >
            Take poll
          </button>
        </div>
      </form>
    </div>
  );
}

export default PollModal;
