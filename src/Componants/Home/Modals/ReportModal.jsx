import React, { useContext } from "react";
import { useState } from "react";
import { Flag, X } from "tabler-icons-react";
import { UserContext } from "../../../Store";
import axios from "axios";

function ReportModal({ setAlreadyReported, setReportModal, reportData }) {
  const State = useContext(UserContext);

  //report categories
  const categories = [
    {
      value: "Nudity",
      subcategory: [
        "Nudity or pornography",
        "Sexual exploitation",
        "Sharing private images",
      ],
    },
    {
      value: "Violence",
      subcategory: [
        "Violence threat",
        "Animal abuse",
        "Death, severe injury, dangerous",
      ],
    },
    {
      value: "Unauthorised sales",
      subcategory: ["Animals", "Firearms", "Fake health documents"],
    },
  ];

  //reported value
  const [report, setReport] = useState(null);

  //submit report
  const handleReportSubmit = () => {
    if (report != "" && report != null) {
      const data = reportData;
      data.report = report;
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/user/report`,
        headers: {
          "content-type": "application/json",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
        data: data,
      })
        .then((response) => {
          setReportModal(false);
          setAlreadyReported(report);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <div
      className={`modal-open
         modal  modal-bottom sm:modal-middle`}
    >
      <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
          <div className="flex justify-between items-center p-2">
            <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
              <Flag />
              Report
            </h3>
            <X
              onClick={() => setReportModal(false)}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>
        <div className="p-4 space-y-3 w-full">
          <h3 className=" font-semibold text-base text-brand2">
            Why are you reporting this post?
          </h3>
          <div className="space-y-2 w-full">
            {categories.map((value, key) => {
              return (
                <div
                  key={key}
                  tabindex="0"
                  className="collapse collapse-arrow border-2 cursor-pointer  dark:border-slate-600 text-brand3 rounded-lg"
                >
                  <div className="collapse-title text-md font-medium ">
                    {value.value}
                  </div>
                  <div className="collapse-content flex flex-col space-y-1">
                    {value.subcategory.map((subcategory, i) => {
                      return (
                        <span
                          key={i}
                          className={
                            subcategory == report
                              ? "text-red-300"
                              : "text-white"
                          }
                          onClick={() => {
                            setReport(subcategory);
                          }}
                        >
                          {subcategory}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <textarea
            className="textarea w-full"
            placeholder="Issue (optional)"
          ></textarea>
          <button
            onClick={handleReportSubmit}
            className={`btn  w-full 
  text-white  } ${(report !== null && report !== "") ? 'btn-error':'btn-disabled'}`}
          >
            submit report
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportModal;
