// import {
//   StackedCarousel,
//   ResponsiveContainer,
//   StackedCarouselSlideProps,
// } from 'react-stacked-center-carousel';
// import Fab from '@material-ui/core/Fab';
// import ArrowBackIcon from '@material-ui/icons/ArrowBack';
// import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
// import React, { useState, useRef, useEffect } from 'react';
// import ReactPlayer from 'react-player';
// import person from '../assets/images/profile.svg';
// import classes from './Home/Home.module.css';

// const data = [
//   {
//     cover: 'https://coverfiles.alphacoders.com/664/66426.jpg',
//     title: 'Interstaller',
//   },
//   {
//     cover: 'https://coverfiles.alphacoders.com/664/66426.jpg',
//     title: 'Interstaller',
//   },
//   {
//     cover: 'https://coverfiles.alphacoders.com/664/66426.jpg',
//     title: 'Interstaller',
//   },
//   {
//     cover: 'https://coverfiles.alphacoders.com/664/66426.jpg',
//     title: 'Interstaller',
//   },
//   {
//     cover: 'https://coverfiles.alphacoders.com/664/66426.jpg',
//     title: 'Interstaller',
//   },
// ];

// export default function ResponsiveCarousel(props, { UserData }) {
//   // If you want to use a ref to call the method of StackedCarousel, you cannot set the ref directly on the carousel component
//   // This is because ResponsiveContainer will not render the carousel before its parent's width is determined
//   // parentWidth is determined after your parent component mounts. Thus if you set the ref directly it will not work since the carousel is not rendered
//   // Thus you need to pass your ref object to the ResponsiveContainer as the carouselRef prop and in your render function you will receive this ref object

//   const ref = useRef();
//   const [activeStreams, setActiveStreams] = useState(UserData);

//   useEffect(() => {
//     setActiveStreams(UserData);
//   }, [UserData]);
//   return (
//     <>
//       <div style={{ width: '100%', position: 'relative' }}>
//         <ResponsiveContainer
//           carouselRef={ref}
//           render={(parentWidth, carouselRef) => {
//             let currentVisibleSlide = 5;
//             if (parentWidth <= 1440) currentVisibleSlide = 3;
//             else if (parentWidth <= 1080) currentVisibleSlide = 1;
//             return (
//               <StackedCarousel
//                 ref={carouselRef}
//                 data={data}
//                 carouselWidth={parentWidth}
//                 slideWidth={750}
//                 slideComponent={Slide}
//                 maxVisibleSlide={5}
//                 currentVisibleSlide={currentVisibleSlide}
//                 useGrabCursor={true}
//               />
//             );
//           }}
//         />
//         <Fab onClick={() => ref.current.goBack()}>
//           <ArrowBackIcon />
//         </Fab>
//         <Fab onClick={() => ref.current.goNext()}>
//           <ArrowForwardIcon />
//         </Fab>
//       </div>
//     </>
//   );
// }

// // Very important to memoize your component!!!
// // Also very imporant to set draggable to false on your slide if you want to use swipe!!!
// const Slide = React.memo(function (props, { UserData }) {
//   const { data, dataIndex } = props;
//   const { cover } = data[dataIndex];
//   const [playing, setPlaying] = useState(false);

//   const handleMouseMove = () => {
//     setPlaying(true);
//   };

//   const hanldeMouseLeave = () => {
//     setPlaying(false);
//   };

//   const [activeStreams, setActiveStreams] = useState(UserData);

//   useEffect(() => {
//     setActiveStreams(UserData);
//   }, [{ UserData }]);
//   return (
//     <div
//       className="w-full h-auto  "
//       style={{
//         width: '100%',
//         height: 300,
//         userSelect: 'none',
//       }}
//     >
//       {activeStreams ? (
//         activeStreams.map((liveUser, i) => {
//           if (i > 2) {
//             return (
//               <div className=" cursor-pointer ">
//                 <span className="fixed bg-red-600 text-white px-1    mx-1 my-1 rounded-sm font-semibold">
//                   {' '}
//                   Live{' '}
//                 </span>
//                 <ReactPlayer
//                   onClick={() => {
//                     window.location.href = `/live/${liveUser.username}/`;
//                   }}
//                   key={i}
//                   draggable={false}
//                   playing
//                   autoplay={true}
//                   width="100%"
//                   height="auto"
//                   muted={false}
//                   volume={0.5}
//                   url={`https://cdn.livepeer.com/hls/${liveUser.livepeer_data.playbackId}/index.m3u8`}
//                   controls={false}
//                   className={`${classes.cards_videos} `}
//                   onMouseMove={handleMouseMove}
//                   onMouseLeave={hanldeMouseLeave}
//                 />
//                 <div className="col-start-1 row-start-3 pb-2 pt-2  ">
//                   <p className="flex items-center text-black text-sm font-medium  ">
//                     <div>
//                       <span className="text-sm font-semibold">{liveUser.username}</span>
//                       <br />
//                       {/* <span className="text-xs text-gray-500">{props.playbackUserData.videos[props.index].description.slice(0,30)+"..."}</span> */}
//                     </div>
//                   </p>
//                 </div>
//               </div>
//             );
//           }
//         })
//       ) : (
//         <img
//           style={{
//             height: '100%',
//             width: '100%',
//             objectFit: 'cover',
//             borderRadius: 10,
//           }}
//           draggable={false}
//           src={cover}
//         />
//       )}
//     </div>
//   );
// });
