import { MIDDLEWARE_CONFIG, LIVEPEER_CONFIG } from "@/services/config.service";
import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { findOne } from "@/utils/user/user";
import * as jose from "jose";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const email: string = req.email;
    const evm_wallet_id = req.evmWalletId;

    if (email) {
      const { success, user, error } = await findOne({ email: email });
      if (!success) {
        return NextResponse.json({
          success: false,
          status: "400",
          message: error,
          data: {},
        });
      }
      if (success && user) {
        if (evm_wallet_id && !user?.evm_wallet_id) {
          // return NextResponse.json({
          //   success: false,
          //   status: "400",
          //   message: "User already has an evm wallet address",
          //   data: {},
          // });
          user.evm_wallet_id = evm_wallet_id;
          await user.save();
        }  
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
          message: "User fetched successfully using email",
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
