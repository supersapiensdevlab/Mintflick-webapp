import React, { useEffect, useState } from 'react';
const mql = require('@microlink/mql');

const ChatLinkPreview = ({ linkurl, setShowLinkPreview, setLinkPreviewData }) => {
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
      setLinkPreviewData(data);
    } else {
      setShowLinkPreview(false);
    }
  };
  return (
    <>
      {linkData ? (
        <div className={`py-3 flex `}>
          <div
            className={` items-center rounded-lg w-full max-w-sm h-max md:p-4  bg-dbeats-dark-primary text-white`}
          >
            {linkData.image ? (
              <div className="flex items-center max-h-44 bg-dbeats-dark-alt">
                <img src={linkData.image.url} className="max-h-40 w-full mx-auto" alt="link_image" />
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

export default ChatLinkPreview;
