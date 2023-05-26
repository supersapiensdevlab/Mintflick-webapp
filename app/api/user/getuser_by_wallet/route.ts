import { MIDDLEWARE_CONFIG, LIVEPEER_CONFIG } from "@/services/config.service";
import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne } from "@/utils/user/user";
import * as jose from "jose";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const wallet_id: string = req.walletId;
    const evm_wallet_id: string = req.evmWalletId;

    if (wallet_id) {
      const { success, user, error } = await findOne({ wallet_id: wallet_id });
      if (!success) {
        return NextResponse.json({
          success: false,
          status: "400",
          message: error,
          data: {},
        });
      }
      if (success && user) {
        const data = {
          user_id: user._id,
        };
        // const authtoken = jwt.sign(data, MIDDLEWARE_CONFIG.JWT_SECRET);
        const secret = new TextEncoder().encode(MIDDLEWARE_CONFIG.JWT_SECRET);
        const alg = "HS256";

        const authtoken = await new jose.SignJWT(data)
          .setProtectedHeader({ alg })

          .sign(secret);

        let loginData = {
          user: user,
          jwtToken: authtoken,
        };
        return NextResponse.json({
          success: true,
          message: "User fetched successfully using solana wallet",
          data: loginData,
          status: 200,
        });
      }
    }

    if (evm_wallet_id) {
      const { success, user, error } = await findOne({
        evm_wallet_id: evm_wallet_id,
      });
      if (!success) {
        return NextResponse.json({
          success: false,
          status: "400",
          message: error,
          data: {},
        });
      }
      if (success && user) {
        const data = {
          user_id: user._id,
        };
        // const authtoken = jwt.sign(data, MIDDLEWARE_CONFIG.JWT_SECRET);
        const secret = new TextEncoder().encode(MIDDLEWARE_CONFIG.JWT_SECRET);
        const alg = "HS256";

        const authtoken = await new jose.SignJWT(data)
          .setProtectedHeader({ alg })

          .sign(secret);

        let loginData = {
          user: user,
          jwtToken: authtoken,
        };
        return NextResponse.json({
          success: true,
          message: "User fetched successfully using polygon wallet",
          data: loginData,
          status: 200,
        });
      }
    }
    return NextResponse.json({
      success: false,
      message: "User not found",
      data: {},
      status: 404,
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
