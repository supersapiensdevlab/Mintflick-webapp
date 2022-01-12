// import { Fragment } from 'react';
// import { Listbox, Transition } from '@headlessui/react';
// import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
//import React from 'react';

//import Emoji from "a11y-react-emoji";

//const Dropdown = ({ data, setSelected, getSelected }) => {
//   const [selectedItem, setSelectedItem] = useState(getSelected);
//   return (
//     <div classNameName="w-full">
//       <Listbox value={selectedItem} onChange={() => setSelected(selectedItem)}>
//         <div classNameName="relative mt-1">
//           <Listbox.Button classNameName="  border-0 py-2 px-3 text-left dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary  ring-0   flex-1 block w-full rounded-md sm:text-sm lg:text-xs 2xl:text-sm  ">
//             <span classNameName="block truncate">{getSelected}</span>
//             <span classNameName="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
//               <SelectorIcon classNameName="w-5 h-5 text-gray-400" aria-hidden="true" />
//             </span>
//           </Listbox.Button>
//           <Transition
//             as={Fragment}
//             enter="transition ease-in-out duration-800"
//             enterFrom="transform opacity-0  -translate-y-1/3 "
//             enterTo="transform opacity-100   translate-y-0 "
//             leave="transition ease-in-out duration-800"
//             leaveFrom="transform opacity-100   translate-y-0"
//             leaveTo="transform   opacity-0 -translate-y-1/3"
//           >
//             <Listbox.Options classNameName="z-50 absolute w-full py-2 mt-1 overflow-auto text-base bg-white dark:bg-dbeats-dark-primary dark:text-gray-100 rounded-md shadow  max-h-60  focus:outline-none sm:text-sm lg:text-xs 2xl:text-sm">
//               {data.map((person, personIdx) => (
//                 <Listbox.Option
//                   key={personIdx}
//                   onClick={() => setSelectedItem(person.name)}
//                   classNameName={({ active }) =>
//                     `${
//                       active
//                         ? 'text-white bg-gradient-to-r from-green-400 to-blue-500 dark:to-dbeats-dark-secondary dark:from-dbeats-dark-alt rounded-md shadow  cursor-pointer mx-2'
//                         : 'dark:text-gray-100 text-gray-900'
//                     }
//                           cursor-default select-none relative py-2 pl-10 pr-4`
//                   }
//                   value={selectedItem}
//                 >
//                   {({ selected, active }) => (
//                     <>
//                       <span
//                         classNameName={`${selected ? 'font-medium' : 'font-normal'} block truncate`}
//                       >
//                         {person.name}
//                         {selectedItem}
//                       </span>
//                       {getSelected === person.name ? (
//                         <span
//                           classNameName={`${active ? 'text-amber-600' : 'text-amber-600'}
//                                 absolute inset-y-0 left-0 flex items-center pl-3`}
//                         >
//                           <CheckIcon classNameName="w-5 h-5" aria-hidden="true" />
//                         </span>
//                       ) : null}
//                     </>
//                   )}
//                 </Listbox.Option>
//               ))}
//             </Listbox.Options>
//           </Transition>
//         </div>
//       </Listbox>
//     </div>
//   );
// };

import React, { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Dropdown = ({ data, setSelected, getSelected }) => {
  const [selectedItem, setSelectedItem] = useState(getSelected);
  useEffect(() => {
    setSelected(selectedItem);
    // eslint-disable-next-line
  }, [selectedItem]);

  return (
    <Listbox value={selectedItem} onChange={setSelectedItem}>
      {({ open }) => (
        <>
          <div className="mt-1 relative w-full">
            <Listbox.Button className="relative w-full text-black dark:text-white bg-white dark:bg-dbeats-dark-primary  rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm lg:text-xs 2xl:text-sm">
              <span className="flex items-center">
                <span className="ml-3 block truncate">{selectedItem}</span>
              </span>
              <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full dark:text-white  bg-white dark:bg-dbeats-dark-primary shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm lg:text-xs 2xl:text-sm">
                {data.map((value, id) => (
                  <Listbox.Option
                    key={id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'dark:text-white',
                        'cursor-default select-none relative py-2 pl-3 pr-9',
                      )
                    }
                    value={value}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'ml-3 block truncate',
                            )}
                          >
                            {value}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default Dropdown;
