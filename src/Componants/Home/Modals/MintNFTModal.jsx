import React, { useContext } from "react";
import { useState } from "react";
import { Award, Share, X } from "tabler-icons-react";
import { UserContext } from "../../../Store";
import {
  mintNFTOnSolana,
  signTransaction,
  partialSignWithWallet,
} from "../../../Helper/mintOnSolana";
import axios from "axios";
import useUserActions from "../../../Hooks/useUserActions";
import {
  mintNFTOnSolana2,
  signTransactionWithWallet,
  signWithRelayer,
} from "../../../Helper/mintOnSolana2";
import { toPng } from "html-to-image";
import { uploadFile } from "../../../Helper/uploadHelper";
import { upload } from "@testing-library/user-event/dist/upload";

function MintNFTModal({
  mintModalOpen,
  setMintModalOpen,
  setTokenId,
  setOwner,
  content,
  videoImage,
  name,
  id,
  contentType,
}) {
  const State = useContext(UserContext);
  const [successMessage, setSuccessMessage] = useState(
    "Please confirm to mint this post as an NFT"
  );
  const [minting, setMinting] = useState(false);
  const [loadFeed, loadUser] = useUserActions();
  // console.log(content);
  const uploadToServer = (mintId) => {
    let data = {
      tokenId: mintId,
      contentId: id,
      contentType: contentType, //`post` or `video`
    };
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/user/add_tokenid`, data, {
        headers: {
          "content-type": "application/json",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
      })
      .then(async (res) => {
        State.toast("success", "Nft Minted successfully!");
        await loadFeed();
        await loadUser();
      })
      .catch((err) => {
        State.toast("error", "Oops!somthing went wrong uplaoding photo!");
        console.log(err);
        clearData();
      });
  };

  const nftMinted = (mintId) => {
    uploadToServer(mintId);
    setMinting(false);
    // setSuccessMessage("NFT minted successfully!");
  };

  const clearData = () => {
    setMinting(false);
    setSuccessMessage("Please confirm to mint this post as an NFT");
  };

  const postsNft = async (content, file) => {
    {
      let name2 = State.database.userData?.data?.user?.name - name.slice(0, 5);
      const mintRequest = await mintNFTOnSolana2(
        State.database.walletAddress,
        name2,
        name,
        content,
        file
      );

      const signedTx =
        mintRequest &&
        (await signTransactionWithWallet(
          mintRequest.data.result.encoded_transaction,
          State.database.provider
        ));

      const finalTx =
        signedTx &&
        (await signWithRelayer(signedTx).catch((error) =>
          State.toast("error", error)
        ));
      console.log(finalTx);
      finalTx.success === true
        ? State.toast("success", "NFT Minted successfully")
        : State.toast("error", finalTx.message);
      console.log(mintRequest);
      finalTx.success && nftMinted(mintRequest.data.result.mint);
      finalTx.success && setTokenId(mintRequest.data.result.mint);
      finalTx.success && setOwner(State.database.walletAddress);
      setMintModalOpen(false);
      loadFeed();
    }
  };

  const thoughtNft = (file) => {
    uploadFile([file])
      .then(async (cid) => {
        let name2 =
          State.database.userData?.data?.user?.name - name.slice(0, 5);
        let url = "https://ipfs.io/ipfs/" + cid + "/" + "meta.png";
        const mintRequest = await mintNFTOnSolana2(
          State.database.walletAddress,
          name2,
          name,
          url,
          file
        );

        const signedTx =
          mintRequest &&
          (await signTransactionWithWallet(
            mintRequest.data.result.encoded_transaction,
            State.database.provider
          ));

        const finalTx =
          signedTx &&
          (await signWithRelayer(signedTx).catch((error) =>
            State.toast("error", error)
          ));
        console.log(finalTx);
        finalTx.success === true
          ? State.toast("success", "NFT Minted successfully")
          : State.toast("error", finalTx.message);
        console.log(mintRequest);
        finalTx.success && nftMinted(mintRequest.data.result.mint);
        finalTx.success && setTokenId(mintRequest.data.result.mint);
        finalTx.success && setOwner(State.database.walletAddress);
        setMintModalOpen(false);
        loadFeed();
      })
      .catch((err) => {
        console.log(err);
        State.toast("error", "Error minting NFT. Please try again!");
      });
  };

  const handleMinting = async () => {
    setMinting(true);

    const response = content && (await fetch(content));
    // here image is url/location of image
    const blob = content
      ? await response.blob()
      : await (
          await fetch(
            toPng(document.getElementById("my-nft"), { cacheBust: true }).then(
              async (dataUrl) => {
                return dataUrl;
              }
            )
          )
        ).blob();
    const file = content
      ? new File([blob], "image.jpg", { type: blob.type })
      : new File([blob], "meta.png", {
          type: "image/jpeg",
          lastModified: new Date(),
        });
    console.log(file);
    content ? postsNft(content, file) : thoughtNft(file);
  };
  return (
    <div
      className={`${
        mintModalOpen && "modal-open"
      } modal  modal-bottom sm:modal-middle`}
    >
      <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
          <div className="flex justify-between items-center p-2">
            <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
              <Award />
              Mint as NFT
            </h3>
            <X
              onClick={() => {
                setMintModalOpen(false);
                clearData();
              }}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>

        <div className="flex flex-wrap p-4 w-full space-y-4 justify-center text-white">
          {(videoImage || content) && (
            <img
              src={videoImage ? videoImage : content}
              className="h-96 w-full object-cover rounded-lg"
            />
          )}
          {!videoImage && !content && (
            <div className="mx-auto w-fit m-4">
              <div
                id="my-nft"
                class=" flex w-96 flex-col rounded-xl border-t-8 border-transparent bg-gradient-to-tr from-[#A36CFC] via-[#2C6EE8] to-[#2ce8e5] p-4"
              >
                <span class="text-2xl font-bold text-white">
                  {State.database.userData.data.user.name}
                </span>
                <span class="text-xs font-medium text-white/60">
                  @{State.database.userData.data.user.username}
                </span>
                <span class="text-base font-medium text-white mt-2">
                  {name}
                </span>
                <span className="text-2xl text-white/20 font-bold mx-auto mt-4 flex items-center gap-2">
                  <svg
                    width="34"
                    height="42"
                    viewBox="0 0 47 58"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M37.3062 7.57049H33.4494C33.3028 6.95439 33.0119 6.38192 32.6008 5.90021C32.2833 5.52545 31.9004 5.2115 31.4706 4.97366L30.6397 4.50987L30.4428 5.44473C30.3536 5.87554 30.1787 6.28404 29.9286 6.64602C30.0268 5.31754 29.6099 4.00223 28.7644 2.97287C27.9189 1.94351 26.7096 1.27908 25.3873 1.11738L24.4416 1L24.6088 1.93849C24.7807 2.91165 24.6393 3.91426 24.2051 4.80195C23.7708 5.68965 23.066 6.41661 22.1922 6.87818C21.8179 6.14939 21.2318 5.55096 20.511 5.16161C19.7901 4.77226 18.9683 4.61024 18.1536 4.69684L17.2104 4.80072L17.5828 5.67325C17.8387 6.271 17.9127 6.93089 17.7958 7.57049H9.49578C4.8111 7.57049 1 11.3826 1 16.0678V41.9094C1 46.5951 4.8111 50.4072 9.49578 50.4072H13.1495C14.0066 52.2715 15.3527 53.8689 17.0448 55.0296C18.9159 56.3131 21.1317 57 23.4007 57C25.6698 57 27.8856 56.3131 29.7567 55.0296C31.4489 53.869 32.795 52.2716 33.652 50.4072H37.3036C41.9883 50.4072 45.7994 46.5951 45.7994 41.9094V16.0689C45.802 11.3837 41.9909 7.57049 37.3062 7.57049ZM18.3878 8.29137C18.4174 8.2036 18.4481 8.10959 18.4725 8.01351C18.6979 7.16062 18.639 6.25748 18.3047 5.44109C18.6815 5.40884 19.0611 5.44205 19.4266 5.53925C19.98 5.68655 20.486 5.97434 20.8954 6.37472C21.3049 6.7751 21.604 7.27449 21.7637 7.82446L21.7793 7.8764L21.8312 7.8577C23.0272 7.43182 24.0358 6.59983 24.6814 5.5067C25.3269 4.41356 25.5685 3.12859 25.3639 1.87565C25.8721 1.94627 26.3641 2.10442 26.8182 2.34308C28.9372 3.46127 29.7843 6.11107 28.7071 8.2493L28.6692 8.32461H29.1579L29.1699 8.31838C29.6694 8.04074 30.1051 7.66127 30.4486 7.20453C30.7922 6.74779 31.036 6.22398 31.1642 5.66702C31.4902 5.8572 31.7812 6.10171 32.0248 6.38997C32.477 6.92118 32.7476 7.58303 32.7971 8.2789L32.8002 8.32669H37.3062C41.5744 8.32669 45.0448 11.8002 45.0448 16.0689V41.9094C45.0448 46.1785 41.5723 49.6521 37.3062 49.6521H33.1586L33.1456 49.6843C31.5127 53.6683 27.6876 56.2428 23.4013 56.2428C19.1149 56.2428 15.2914 53.6683 13.6585 49.6843L13.6455 49.6521H9.49578C5.22763 49.6521 1.75723 46.1785 1.75723 41.9094V16.0689C1.75723 11.8002 5.22971 8.32669 9.49578 8.32669H18.3769L18.3878 8.29137Z"
                      fill="#ffffff20"
                      stroke="#ffffff20"
                    />
                    <path
                      d="M30.1407 21.7009C27.648 21.6982 25.2442 22.6269 23.4009 24.305C21.5587 22.6266 19.1554 21.6977 16.6632 21.7009C11.1158 21.7009 6.61866 26.2142 6.61866 31.7823C6.61627 33.9357 7.30352 36.0333 8.57973 37.7677C9.85593 39.5021 11.654 40.7823 13.7106 41.4207C14.532 39.5336 15.8866 37.9274 17.608 36.7993C19.3294 35.6712 21.3428 35.0702 23.4009 35.0702C25.459 35.0702 27.4724 35.6712 29.1938 36.7993C30.9152 37.9274 32.2698 39.5336 33.0912 41.4207C35.1482 40.7827 36.9467 39.5027 38.2233 37.7682C39.4999 36.0337 40.1875 33.936 40.1852 31.7823C40.1852 26.2158 35.6881 21.7009 30.1407 21.7009ZM18.925 34.857H15.6416V27.2223H18.925V34.857ZM31.9891 34.857H28.7057V27.2223H31.9891V34.857Z"
                      fill="#ffffff20"
                    />
                    <path
                      d="M31.4795 42.3582C30.1743 39.1683 27.0493 36.9236 23.4018 36.9236C19.7543 36.9236 16.6288 39.1683 15.3241 42.3582C14.8932 43.4134 14.6722 44.5424 14.6733 45.6822C14.6733 45.7585 14.6733 45.8323 14.677 45.9081C14.677 45.9564 14.677 46.0031 14.6827 46.0494C14.6884 46.0956 14.6863 46.1532 14.69 46.2052C14.6888 46.2225 14.6888 46.2398 14.69 46.2571C14.6936 46.3371 14.7009 46.4129 14.7087 46.4929C14.7165 46.5729 14.7232 46.6523 14.7346 46.7318C14.7455 46.845 14.7622 46.9562 14.7788 47.0673C14.799 47.1972 14.8214 47.327 14.8494 47.4527C14.8624 47.5233 14.8769 47.5939 14.8956 47.6641C14.9143 47.7342 14.9273 47.8048 14.9476 47.8754C14.9943 48.0572 15.0462 48.2348 15.1034 48.4109C15.1351 48.5075 15.1683 48.6041 15.2036 48.6986C15.2275 48.7651 15.2519 48.8316 15.2794 48.8986C15.307 48.9656 15.3277 49.0248 15.3558 49.0856C15.3594 49.0949 15.3631 49.1043 15.3688 49.1157C15.3927 49.1749 15.4207 49.2341 15.4446 49.2918C15.5685 49.5689 15.7072 49.8392 15.8601 50.1014C15.884 50.144 15.912 50.1866 15.9359 50.2292C16.0211 50.3705 16.1104 50.5076 16.2029 50.6447C16.2288 50.6816 16.2548 50.7205 16.2829 50.7579C16.2903 50.7694 16.2982 50.7805 16.3067 50.7912C16.3457 50.8467 16.3867 50.9044 16.4293 50.9579C16.4755 51.0207 16.5238 51.082 16.5716 51.1433L16.6495 51.2399L16.7996 51.4196C16.8645 51.4939 16.9279 51.5661 16.9944 51.6362C17.0609 51.7063 17.1279 51.779 17.1964 51.8476C17.2556 51.9088 17.3169 51.968 17.3782 52.0272C17.467 52.1124 17.5558 52.194 17.6488 52.276C17.7137 52.3332 17.7786 52.3887 17.8451 52.4443C17.9173 52.5035 17.9895 52.5612 18.0638 52.6183C18.2248 52.7429 18.3878 52.8613 18.5587 52.9746C18.6382 53.0265 18.7182 53.0784 18.7976 53.1304C18.8771 53.1823 18.9664 53.2343 19.0516 53.2826C19.1274 53.3251 19.2017 53.3677 19.2796 53.4103L19.439 53.4939C19.4962 53.5235 19.5538 53.5511 19.611 53.5791C19.7076 53.6253 19.8057 53.6716 19.9059 53.7142C19.9579 53.7386 20.0098 53.7588 20.0618 53.7811C20.1895 53.8331 20.3214 53.885 20.4513 53.9312C20.525 53.9588 20.6014 53.9832 20.6772 54.0091C20.7717 54.0403 20.8683 54.0699 20.9644 54.098C21.048 54.1218 21.1311 54.1463 21.2148 54.1665C21.3352 54.1982 21.4557 54.2257 21.5783 54.2517C21.6541 54.2683 21.7341 54.2834 21.8084 54.2964C21.8381 54.3038 21.8683 54.3093 21.8988 54.313C21.9673 54.326 22.0379 54.3369 22.1065 54.3483C22.1506 54.3535 22.1932 54.3613 22.2379 54.3665C22.3122 54.3758 22.3844 54.3852 22.4586 54.3924C22.5474 54.4018 22.6363 54.4111 22.7256 54.4169C22.7604 54.4205 22.7957 54.422 22.8331 54.4241C22.898 54.4298 22.9609 54.4314 23.0258 54.4335C23.0663 54.4371 23.1089 54.4392 23.152 54.4392C23.2335 54.4392 23.3151 54.4428 23.3966 54.4428C23.4781 54.4428 23.5597 54.4428 23.6412 54.4392C23.6838 54.4392 23.7264 54.4392 23.7669 54.4335C23.8318 54.4335 23.8952 54.4298 23.9601 54.4241C23.9949 54.4241 24.0323 54.4205 24.0676 54.4169C24.1564 54.4111 24.2452 54.4018 24.3341 54.3924C24.4083 54.3852 24.4805 54.3758 24.5548 54.3665C24.5995 54.3613 24.642 54.3535 24.6867 54.3483C24.7719 54.3353 24.8571 54.3202 24.9422 54.3057C25.0368 54.2886 25.1297 54.2704 25.2222 54.2496C25.2378 54.2477 25.2532 54.2448 25.2684 54.2408C25.3354 54.2257 25.4039 54.2112 25.4704 54.1925C25.5057 54.1852 25.5426 54.1759 25.5779 54.1665C25.6616 54.1463 25.7447 54.1218 25.8283 54.098C25.9249 54.0699 26.021 54.0403 26.1155 54.0091C26.21 53.978 26.3066 53.9458 26.3991 53.911C26.5029 53.8715 26.6125 53.8294 26.7179 53.7863C26.7844 53.7588 26.8514 53.7308 26.9163 53.7012C27.1184 53.6124 27.3183 53.5142 27.5131 53.4103C27.5889 53.3677 27.6689 53.3251 27.7411 53.2826C27.8263 53.2343 27.9114 53.1823 27.9951 53.1304C28.0787 53.0784 28.1545 53.0265 28.234 52.9746C28.4029 52.8613 28.5679 52.7426 28.7289 52.6183C28.8032 52.5612 28.8754 52.5035 28.9476 52.4443C29.0141 52.3887 29.079 52.3332 29.1439 52.276C29.2363 52.194 29.3257 52.1124 29.4145 52.0272C29.4758 51.968 29.5371 51.9088 29.5963 51.8476C29.6555 51.7863 29.711 51.7307 29.7666 51.6694C29.898 51.5307 30.0227 51.3879 30.1432 51.2399C30.1686 51.2082 30.1951 51.175 30.2205 51.1433C30.2688 51.082 30.3171 51.0207 30.3634 50.9579C30.406 50.9059 30.447 50.8467 30.4859 50.7912C30.4945 50.7805 30.5024 50.7694 30.5098 50.7579C30.5379 50.7205 30.5618 50.6816 30.5898 50.6447C30.6823 50.5076 30.7711 50.3705 30.8562 50.2292C30.8826 50.1866 30.908 50.144 30.9326 50.1014C31.0854 49.8392 31.2241 49.5689 31.3481 49.2918C31.3756 49.2341 31.4 49.1749 31.4239 49.1157C31.4296 49.1043 31.4333 49.0949 31.4369 49.0856C31.4649 49.0248 31.4888 48.9614 31.5127 48.8986C31.5366 48.8357 31.5647 48.7651 31.5891 48.6986C31.6244 48.6041 31.6576 48.5075 31.6893 48.4109C31.7241 48.3034 31.7579 48.1959 31.7875 48.0847C31.8098 48.0089 31.8301 47.9346 31.8482 47.8588C31.8654 47.7939 31.882 47.729 31.895 47.6641C31.908 47.5991 31.9282 47.5233 31.9412 47.4527C31.9687 47.3249 31.9931 47.1972 32.0118 47.0673C32.0285 46.9562 32.0451 46.845 32.056 46.7318C32.0674 46.6523 32.0762 46.5724 32.0819 46.4929C32.0877 46.4134 32.097 46.3371 32.1006 46.2571C32.1006 46.2405 32.1006 46.2239 32.1006 46.2052C32.1048 46.1532 32.1084 46.1013 32.1084 46.0494C32.1084 45.9974 32.1136 45.9564 32.1136 45.9081C32.1136 45.8323 32.1178 45.7585 32.1178 45.6822C32.1227 44.5433 31.9059 43.4143 31.4795 42.3582V42.3582ZM22.8263 40.1431C22.8076 40.153 22.7905 40.1639 22.7744 40.1743C22.7332 40.1966 22.6907 40.2164 22.6472 40.2335L22.6118 40.2465C22.5812 40.2579 22.55 40.2683 22.5178 40.2771L22.4737 40.2886C22.4425 40.2958 22.4103 40.3015 22.3781 40.3067L22.3361 40.3135C22.2893 40.3191 22.2424 40.322 22.1953 40.3223C21.8742 40.3223 21.5663 40.1948 21.3393 39.9677C21.1122 39.7407 20.9847 39.4328 20.9847 39.1117C20.9847 38.7906 21.1122 38.4827 21.3393 38.2556C21.5663 38.0286 21.8742 37.901 22.1953 37.901C22.2424 37.9012 22.2894 37.9044 22.3361 37.9104L22.3781 37.9166C22.4103 37.9218 22.4425 37.9275 22.4737 37.9353C22.4888 37.9384 22.5033 37.9426 22.5178 37.9467C22.55 37.9556 22.5812 37.9654 22.6118 37.9769L22.6472 37.9898C22.6901 38.0073 22.7321 38.027 22.7728 38.0491C22.7905 38.0594 22.8076 38.0703 22.8248 38.0802C23.0012 38.176 23.1987 38.2262 23.3995 38.2262C23.6002 38.2262 23.7977 38.176 23.9741 38.0802C23.9944 38.0698 24.0141 38.0579 24.0313 38.047C24.038 38.0433 24.0453 38.0407 24.052 38.0376C24.0842 38.021 24.117 38.0054 24.1507 37.9914C24.1653 37.9852 24.1808 37.9805 24.1954 37.9748C24.2234 37.9649 24.2515 37.9556 24.28 37.9473C24.2967 37.9426 24.3128 37.9384 24.332 37.9348C24.3616 37.9275 24.3922 37.9218 24.4229 37.9171C24.4379 37.9171 24.453 37.9119 24.4681 37.9104C24.5147 37.9044 24.5617 37.9012 24.6088 37.901C24.9299 37.901 25.2378 38.0286 25.4649 38.2556C25.6919 38.4827 25.8194 38.7906 25.8194 39.1117C25.8194 39.4328 25.6919 39.7407 25.4649 39.9677C25.2378 40.1948 24.9299 40.3223 24.6088 40.3223C24.5618 40.322 24.5148 40.3191 24.4681 40.3135L24.4229 40.3062C24.3922 40.3015 24.3616 40.2958 24.332 40.2891L24.28 40.2761C24.2515 40.2678 24.2234 40.2589 24.1954 40.2486C24.1808 40.2434 24.1653 40.2382 24.1507 40.2319C24.117 40.2183 24.0841 40.2029 24.052 40.1857C24.0453 40.1826 24.038 40.18 24.0313 40.1764C24.0141 40.1655 23.9944 40.154 23.9741 40.1431C23.7977 40.0474 23.6002 39.9972 23.3995 39.9972C23.1987 39.9972 23.0012 40.0474 22.8248 40.1431H22.8263ZM23.2034 51.3152L23.1582 49.9815C26.6037 49.8641 27.1417 45.6744 27.1469 45.6323L28.4713 45.7881C28.2506 47.6464 26.8654 51.19 23.2034 51.3152Z"
                      fill="#ffffff20"
                    />
                  </svg>
                  Mintflick
                </span>
              </div>

              <span
                onClick={() =>
                  toPng(document.getElementById("my-nft"), {
                    quality: 2,
                  }).then(function (dataUrl) {
                    var link = document.createElement("a");
                    link.download = "my-thought-nft.png";
                    link.href = dataUrl;
                    link.click();
                  })
                }
                className="link link-primary"
              >
                Download as image
              </span>
            </div>
          )}
          <p>{successMessage}</p>
          <button
            onClick={handleMinting}
            className={`btn  
                    btn-brand
                  w-full ${minting ? "loading" : ""} `}
          >
            confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default MintNFTModal;
