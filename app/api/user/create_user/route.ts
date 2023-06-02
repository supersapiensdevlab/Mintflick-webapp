import { MIDDLEWARE_CONFIG, LIVEPEER_CONFIG } from "@/services/config.service";
import { NextResponse } from "next/server";
import { conn } from "@/services/mongo.service";
import { addUser, findOne, findOneAndUpdate } from "@/utils/user/user";
import { Str } from "@supercharge/strings/dist";
import axios from "axios";
import * as jose from "jose";

export async function POST(request: Request) {
  try {
    await conn();
    const req = await request.json();
    const wallet_id: string = req.walletId;
    const evm_wallet_id: string = req.evmWalletId;
    const name: string = req.name;
    const email: string = req.email;
    const profileImage = req.profileImage;
    const referrer = req.referrer;

    if (email != "" && email != null && email != undefined) {
      let userName = email.substring(0, email.lastIndexOf("@"));
       const userId = Str.random(8);
       let unique = true;
      let not_unique = "";
      let user_emailcheck = await findOne({
        email: email,
      });
       if (user_emailcheck.user) {
        unique = false;
        not_unique = "Email";
      }
      let user_usernamecheck = await findOne({
        username: userName,
      });
      if (user_usernamecheck.user) {
        // unique = false;
        // not_unique = 'Username';
        userName = userName + userId;
      }
       let user_idcheck = await findOne({ id: userId });
      if (user_idcheck.user) {
        unique = false;
        not_unique = "ID";
      }
       if (unique) {
        try {
          const AuthStr = "Bearer ".concat(LIVEPEER_CONFIG.livepeerkey);

          let streamData = {
            name: `${name}`,
            profiles: [
              {
                name: "720p",
                bitrate: 2000000,
                fps: 30,
                width: 1280,
                height: 720,
              },
              {
                name: "480p",
                bitrate: 1000000,
                fps: 30,
                width: 854,
                height: 480,
              },
              {
                name: "360p",
                bitrate: 500000,
                fps: 30,
                width: 640,
                height: 360,
              },
            ],
          };

          const value = await axios({
            method: "post",
            url: "https://livepeer.com/api/stream",
            data: streamData,
            headers: {
              "content-type": "application/json",
              Authorization: AuthStr,
            },
          });

          const newUser = await addUser({
            username: userName,
            id: userId,
            name: name,
            email: email,
            wallet_id: wallet_id,
            evm_wallet_id: evm_wallet_id,
            livepeer_data: value.data,
            profile_image: profileImage,
            refer: {
              referrer_id: referrer,
              clicks: 0,
              verified_referrals: 0,
              unverified_referrals: 0,
            },
          });

          newUser
            .save()
            .then(async () => {
              const data = {
                user_id: newUser._id,
              };
              const secret = new TextEncoder().encode(
                MIDDLEWARE_CONFIG.JWT_SECRET
              );
              const alg = "HS256";

              const authtoken = await new jose.SignJWT(data)
                .setProtectedHeader({ alg })

                .sign(secret);
              let loginData = {
                user: newUser,
                jwtToken: authtoken,
              };

              const updateRererals = await findOneAndUpdate(
                { username: referrer },
                { $inc: { "refer.unverified_referrals": 1 } },
                { upsert: true }
              );
              if (!updateRererals.success) {
                return NextResponse.json({
                  status: "error",
                  message: updateRererals.error,
                });
              }
              let user2;
              if (wallet_id) {
                user2 = await findOne({
                  wallet_id: wallet_id,
                });
              } else if (evm_wallet_id) {
                user2 = await findOne({
                  evm_wallet_id: evm_wallet_id,
                });
              } else {
                return NextResponse.json({
                  status: "error",
                  message: "wallet id missing",
                });
              }

              if (user2?.user) {
                const data = {
                  user_id: user2.user._id,
                };
                const secret = new TextEncoder().encode(
                  MIDDLEWARE_CONFIG.JWT_SECRET
                );
                const alg = "HS256";

                const authtoken = await new jose.SignJWT(data)
                  .setProtectedHeader({ alg })

                  .sign(secret);
                let loginData = {
                  user: user2.user,
                  jwtToken: authtoken,
                };
                return NextResponse.json({
                  status: "success",
                  data: loginData,
                });
              }
            })
            .catch((err: any) => {
              console.log(err);
              return NextResponse.json({ status: "error", data: err });
            });
        } catch (err) {
          console.log(err);
          return NextResponse.json({ status: "error", data: err });
        }
      } else {
        return NextResponse.json({ status: "error", data: not_unique });
      }
    } else {
      return NextResponse.json({ status: "error", data: "No user found" });
    }
  } catch (err) {
    return NextResponse.json({ status: "error", message: err });
  }
}
