import React, { useEffect, useState } from 'react';
import classes from './LinkPreview.module.css';

const mql = require('@microlink/mql');

const LinkPreview = ({ linkurl, setShowLinkPreview }) => {
  const [linkData, setLinkData] = useState(null);

  useEffect(() => {
    setLinkData(null);
    fetchData();

    // eslint-disable-next-line
  }, [linkurl]);

  const fetchData = async () => {
    // eslint-disable-next-line no-unused-vars
    const { status, data, response } = await mql(`${linkurl}`, {
      animations: true,
    });

    if (data.title.indexOf('Page Not Found') === -1) {
      setLinkData(data);
    } else {
      setShowLinkPreview(false);
    }
  };
  return (
    <>
      {linkData ? (
        <div className={`${classes.container} w-full h-max py-6 flex`}>
          <div
            className={` items-center rounded-lg w-96 h-max p-4  mx-auto bg-dbeats-dark-primary text-white`}
          >
            {linkData.image ? (
              <div className="flex items-center h-44 bg-dbeats-dark-alt">
                <img src={linkData.image.url} className="h-40 w-auto mx-auto" alt="link_image" />
              </div>
            ) : null}
            <div className="py-2">
              <div className="flex items-center pb-1 ">
                {linkData.logo ? (
                  <img
                    src={linkData.logo.url}
                    alt="logo"
                    height="20px"
                    width="20px"
                    className="rounded-sm"
                  />
                ) : null}

                <div className="font-bold pl-1">{linkData.publisher}</div>
              </div>
              <div>
                <div className="line-clamp-2 font-semibold text-sm">{linkData.title}</div>
                <div className="line-clamp-2 text-xs text-gray-300 break-word">
                  {linkData.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default LinkPreview;
