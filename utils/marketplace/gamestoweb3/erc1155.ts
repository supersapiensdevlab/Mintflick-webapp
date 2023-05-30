import { GAMESTOWEB3_CONGIG } from "@/services/config.service";
import axios from "axios";

type inputMintData = {
  wallet_address: string;
  contract_address: string;
  token_owner: string;
  token_id: number;
  number_of_tokens: number;
  image_uri: string;
  name: string;
  description: string;
  attributes: Array<object>;
  external_uri: string;
};

type returnData = {
  success: boolean;
  nftData: object;
  error: any;
};

type inputListData = {
  token_owner: string;
  contract_address: string;
  token_id: number;
  number_of_tokens: number;
  start_date: string;
  end_date: string;
  per_unit_price: number;
  sign: string;
};

/**
 * Mint a new nft erc1155
 * @param {inputMintData} mintData
 */
export const mintNft1155 = async (
  mintData: inputMintData
): Promise<returnData> => {
  try {
    let nftData: any;
    await axios
      .post(`${GAMESTOWEB3_CONGIG.apiUrl}/nft/mint-1155`, mintData, {
        headers: {
          "X-API-HEADER ": GAMESTOWEB3_CONGIG.xApiKey,
        },
      })
      .then((response) => {
        nftData = response;
      })
      .catch((error) => {
        return { success: false, nftData: {}, error: error };
      });
    return { success: true, nftData: nftData, error: null };
  } catch (error) {
    return { success: false, nftData: {}, error: error };
  }
};

/**
 * List an existing nft erc1155
 * @param {inputListData} listData
 * @returns
 */
export const listNft1155 = async (
  listData: inputListData
): Promise<returnData> => {
  try {
    let nftData: any;
    await axios
      .post(`${GAMESTOWEB3_CONGIG.apiUrl}/nft/create-sale-1155`, listData, {
        headers: {
          "X-API-HEADER ": GAMESTOWEB3_CONGIG.xApiKey,
        },
      })
      .then((response) => {
        nftData = response;
      })
      .catch((error) => {
        return { success: false, nftData: {}, error: error };
      });
    return { success: true, nftData: nftData, error: null };
  } catch (error) {
    return { success: false, nftData: {}, error: error };
  }
};
