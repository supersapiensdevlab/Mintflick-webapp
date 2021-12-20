import React from 'react';
// import { Menu, Transition } from '@headlessui/react';
// import { Fragment } from 'react';
import Popup from 'reactjs-popup';

export default function PopUp() {
  return (
    // <div className=" text-right  ">
    //   <Menu as="div" className=" text-left" style={{ zIndex: 100 }}>
    //     <div style={{ zIndex: 50 }}>
    //       <Menu.Button className=" dark:hover:bg-dbeats-dark-secondary px-2 transition-all  justify-center w-full  py-2 text-sm font-medium hover:text-white   text-gray-600  rounded-full bg-opacity-20 hover:bg-opacity-30  ">
    // <svg
    //   height="25"
    //   width="25"
    //   xmlns="http://www.w3.org/2000/svg"
    //   className="h-6 w-6"
    //   fill="none"
    //   viewBox="0 0 24 24"
    //   stroke="currentColor"
    // >
    //   <path
    //     strokeLinecap="round"
    //     strokeLinejoin="round"
    //     strokeWidth={2}
    //     d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
    //   />
    // </svg>
    //       </Menu.Button>
    //     </div>
    //     <Transition
    //       as={Fragment}
    //       enter="transition ease-out duration-100"
    //       enterFrom="transform opacity-0 scale-95"
    //       enterTo="transform opacity-100 scale-100"
    //       leave="transition ease-in duration-75"
    //       leaveFrom="transform opacity-100 scale-100"
    //       leaveTo="transform opacity-0 scale-95"
    //     >
    //       <Menu.Items className=" fixed w-56  origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
    //         <div className="px-1 py-1 ">
    //           <Menu.Item>
    //             {({ active }) => (
    //               <button
    //                 className={`${
    //                   active ? 'bg-violet-500 text-white' : 'text-gray-900'
    //                 } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
    //               >
    //                 {active ? (
    //                   <EditActiveIcon className="w-5 h-5 mr-2" aria-hidden="true" />
    //                 ) : (
    //                   <EditInactiveIcon className="w-5 h-5 mr-2" aria-hidden="true" />
    //                 )}
    //                 Edit
    //               </button>
    //             )}
    //           </Menu.Item>
    //           <Menu.Item>
    //             {({ active }) => (
    //               <button
    //                 className={`${
    //                   active ? 'bg-violet-500 text-white' : 'text-gray-900'
    //                 } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
    //               >
    //                 {active ? (
    //                   <DuplicateActiveIcon className="w-5 h-5 mr-2" aria-hidden="true" />
    //                 ) : (
    //                   <DuplicateInactiveIcon className="w-5 h-5 mr-2" aria-hidden="true" />
    //                 )}
    //                 Duplicate
    //               </button>
    //             )}
    //           </Menu.Item>
    //         </div>
    //         <div className="px-1 py-1">
    //           <Menu.Item>
    //             {({ active }) => (
    //               <button
    //                 className={`${
    //                   active ? 'bg-violet-500 text-white' : 'text-gray-900'
    //                 } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
    //               >
    //                 {active ? (
    //                   <ArchiveActiveIcon className="w-5 h-5 mr-2" aria-hidden="true" />
    //                 ) : (
    //                   <ArchiveInactiveIcon className="w-5 h-5 mr-2" aria-hidden="true" />
    //                 )}
    //                 Archive
    //               </button>
    //             )}
    //           </Menu.Item>
    //           <Menu.Item>
    //             {({ active }) => (
    //               <button
    //                 className={`${
    //                   active ? 'bg-violet-500 text-white' : 'text-gray-900'
    //                 } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
    //               >
    //                 {active ? (
    //                   <MoveActiveIcon className="w-5 h-5 mr-2" aria-hidden="true" />
    //                 ) : (
    //                   <MoveInactiveIcon className="w-5 h-5 mr-2" aria-hidden="true" />
    //                 )}
    //                 Move
    //               </button>
    //             )}
    //           </Menu.Item>
    //         </div>
    //         <div className="px-1 py-1">
    //           <Menu.Item>
    //             {({ active }) => (
    //               <button
    //                 className={`${
    //                   active ? 'bg-violet-500 text-white' : 'text-gray-900'
    //                 } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
    //               >
    //                 {active ? (
    //                   <DeleteActiveIcon
    //                     className="w-5 h-5 mr-2 text-violet-400"
    //                     aria-hidden="true"
    //                   />
    //                 ) : (
    //                   <DeleteInactiveIcon
    //                     className="w-5 h-5 mr-2 text-violet-400"
    //                     aria-hidden="true"
    //                   />
    //                 )}
    //                 Delete
    //               </button>
    //             )}
    //           </Menu.Item>
    //         </div>
    //       </Menu.Items>
    //     </Transition>
    //   </Menu>
    // </div>
    <Popup
      trigger={
        <div className=" dark:hover:bg-dbeats-dark-secondary px-2 transition-all  justify-center w-full  py-2 text-sm font-medium hover:text-white   text-gray-600  rounded-full bg-opacity-20 hover:bg-opacity-30  ">
          {' '}
          <svg
            height="25"
            width="25"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            />
          </svg>
        </div>
      }
      position="bottom left"
      on="click"
      closeOnDocumentClick
      mouseLeaveDelay={300}
      mouseEnterDelay={0}
      contentStyle={{ padding: '0px', border: 'none' }}
      arrow={false}
    >
      <div className="  w-56  bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
        <div className="menu-item">
          <button
            className={`
               bg-violet-500 text-black
               group flex rounded-md items-center w-full px-2 py-2 text-sm`}
          >
            <EditActiveIcon className="w-5 h-5 mr-2" aria-hidden="true" />
            Edit
          </button>
        </div>
        <div className="menu-item">
          <button
            className={`
               bg-violet-500 text-black
               group flex rounded-md items-center w-full px-2 py-2 text-sm`}
          >
            <DuplicateActiveIcon className="w-5 h-5 mr-2" aria-hidden="true" />
            Duplicate
          </button>
        </div>
        <div className="menu-item">
          <button
            className={`
               bg-violet-500 text-black
               group flex rounded-md items-center w-full px-2 py-2 text-sm`}
          >
            <ArchiveActiveIcon className="w-5 h-5 mr-2" aria-hidden="true" />
            Archive
          </button>
        </div>
        <div className="menu-item">
          <button
            className={`
               bg-violet-500 text-black
               group flex rounded-md items-center w-full px-2 py-2 text-sm`}
          >
            <MoveActiveIcon className="w-5 h-5 mr-2" aria-hidden="true" />
            Move
          </button>
        </div>
        <div className="menu-item">
          <button
            className={`
               bg-violet-500 text-black
               group flex rounded-md items-center w-full px-2 py-2 text-sm`}
          >
            <DeleteActiveIcon className="w-5 h-5 mr-2 text-violet-400" aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>
    </Popup>
  );
}

function EditInactiveIcon(props) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 13V16H7L16 7L13 4L4 13Z" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function EditActiveIcon(props) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 13V16H7L16 7L13 4L4 13Z" fill="#8B5CF6" stroke="#C4B5FD" strokeWidth="2" />
    </svg>
  );
}

function DuplicateInactiveIcon(props) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4H12V12H4V4Z" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="2" />
      <path d="M8 8H16V16H8V8Z" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function DuplicateActiveIcon(props) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4H12V12H4V4Z" fill="#8B5CF6" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M8 8H16V16H8V8Z" fill="#8B5CF6" stroke="#C4B5FD" strokeWidth="2" />
    </svg>
  );
}

function ArchiveInactiveIcon(props) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="8" width="10" height="8" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="2" />
      <rect x="4" y="4" width="12" height="4" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="2" />
      <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function ArchiveActiveIcon(props) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="8" width="10" height="8" fill="#8B5CF6" stroke="#C4B5FD" strokeWidth="2" />
      <rect x="4" y="4" width="12" height="4" fill="#8B5CF6" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function MoveInactiveIcon(props) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4H16V10" stroke="#A78BFA" strokeWidth="2" />
      <path d="M16 4L8 12" stroke="#A78BFA" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function MoveActiveIcon(props) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4H16V10" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M16 4L8 12" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" stroke="#C4B5FD" strokeWidth="2" />
    </svg>
  );
}

function DeleteInactiveIcon(props) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="6" width="10" height="10" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="2" />
      <path d="M3 6H17" stroke="#A78BFA" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function DeleteActiveIcon(props) {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="6" width="10" height="10" fill="#8B5CF6" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M3 6H17" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#C4B5FD" strokeWidth="2" />
    </svg>
  );
}
