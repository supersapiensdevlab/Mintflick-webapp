import { random } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
//import Confetti from './Confetti';
import { useSelector } from 'react-redux';
import useWindowSize from 'react-use-window-size';

function Referral() {
  const user = useSelector((state) => state.User.user);

  const [clicks, setClicks] = useState(0);
  const [referrals, setReferrals] = useState(0);
  const [verifiedReferrals, setVerifiedReferrals] = useState(0);
  const [milestone, setMilestone] = useState('-');
  useEffect(() => {
    if (user) {
      setClicks(user.refer.clicks);
      setReferrals(user.refer.unverified_referrals);
      setVerifiedReferrals(user.refer.verified_referrals);
    }
  }, [user]);

  return (
    <>
      <div className="mx-auto w-full  ">
        <table className="border-collapse border border-slate-500 text-white mx-auto  place-self-center mt-20">
          <thead>
            <tr>
              <th className="border border-slate-700 px-3">Type</th>
              <th className="border border-slate-700 px-3">Details</th>
              <th className="border border-slate-700 px-3 text-center">Stats</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-100 px-3">Referral Clicks</td>
              <td className="border border-slate-100 px-3">
                No. of time your link has been clicked
              </td>
              <td className="border border-slate-100 px-3 text-center">{clicks}</td>
            </tr>
            <tr>
              <td className="border border-slate-100 px-3">Free Referrals</td>
              <td className="border border-slate-100 px-3">All Accounts created using your link</td>
              <td className="border border-slate-100 px-3 text-center">{referrals}</td>
            </tr>
            <tr>
              <td className="border border-slate-100 px-3">Verified Referrals</td>
              <td className="border border-slate-100 px-3">
                The referral accounts our system marked as legit
              </td>
              <td className="border border-slate-100 px-3 text-center">{verifiedReferrals}</td>
            </tr>
            <tr>
              <td className="border border-slate-100 px-3">Upcoming Milestone</td>
              <td className="border border-slate-100 px-3">
                Prizes you await to win on your next milestone
              </td>
              <td className="border border-slate-100 px-3 text-center">{milestone}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Referral;
