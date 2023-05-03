"use client";
import { useState } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import TextInput from "@/components/molecules/TextInput";
import TextareaInput from "@/components/molecules/TextareaInput";
import SearchBar from "@/components/molecules/SearchBar";
import Divider from "@/components/molecules/Divider";
import CheckBox from "@/components/molecules/CheckBox";
import Switch from "@/components/molecules/Switch";
import Avatar from "@/components/molecules/Avatar";
import Pill from "@/components/molecules/Pill";
import Tick from "@/components/molecules/Tick";
import Radio from "@/components/molecules/Radio";
import Toast from "@/components/molecules/Toast";
import Notification from "@/components/molecules/Notification";
import Button from "@/components/molecules/Button";
import Loader from "@/components/molecules/Loader";
import Fab from "@/components/molecules/Fab";
import Modal from "@/components/molecules/Modal";
import ImageInput from "@/components/molecules/ImageInput";
import VideoInput from "@/components/molecules/VideoInput";
import Header from "@/components/molecules/Header";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [first, setfirst] = useState("");
  const [check, setcheck] = useState(false);
  const [second, setsecond] = useState("");
  const [image, setImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  return (
    <main className="flex flex-col items-center justify-start min-h-screen gap-4 p-2">
      <SearchBar
        onChange={(e) => setfirst(e.target.value)}
        onClear={() => setfirst("")}
        value={first}
        placeholder={"Search here"}
      />
      <Header
        text="Back"
        title="home"
        rightSection={
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
              />
            </svg>{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
              />
            </svg>
          </>
        }
      />
      <CheckBox
        text={"terms"}
        checked={check}
        onChange={() => setcheck(!check)}
      />
      <Switch kind="danger" on={check} onChange={() => setcheck(!check)} />
      <Tick color="green" />
      <Avatar size="sm" kind="luxury" />
      <Button
        handleClick={() => console.log("adsfasf")}
        kind="info"
        type="solid"
        size="base"
      >
        click me
      </Button>
      <Button
        handleClick={() => console.log("adsfasf")}
        kind="info"
        type="outlined"
        size="base"
      >
        click me
      </Button>
      <Radio
        flex="row"
        value={second}
        onChange={setsecond}
        options={[
          { color: "default", option: "react" },
          { color: "default", option: "next" },
          { color: "luxury", option: "python" },
        ]}
      />
      <Pill type="filled" kind="luxury">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>

        <span>text</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Pill>
      <Toast
        onCancel={() => console.log("canceled")}
        message={"hello"}
        kind="info"
      />
      <Loader progress={99} />
      <Divider kind="center" size={1}></Divider>
      <Notification
        onCancel={() => console.log("canceled")}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
            />
          </svg>
        }
        message={"hello"}
        description={"thius is m,e"}
        kind="success"
      />
      <TextInput
        title="name"
        // error="something"
        onChange={(e) => setfirst(e.target.value)}
        value={first}
        placeholder={"type here"}
        count={32}
      />
      <TextareaInput
        title="NAME"
        error="something"
        onChange={(e) => setfirst(e.target.value)}
        value={first}
        placeholder={"type here"}
        count={32}
      />
      <Fab
        size="small"
        onClick={() => console.log("aljbsdufaisv")}
        kind="luxury"
        text="new event"
        showText={check}
      />
      <ImageInput
        setImage={setImage}
        label="select photo"
        aspect={1 / 1}
        cropShape="round"
        showGrid={true}
        compression={1}
      />
      <VideoInput
        label={"select your favorite video"}
        selectedVideo={selectedVideo}
        setSelectedVideo={setSelectedVideo}
      />
      {check && (
        <Modal
          title={"Sahil"}
          description={
            "Vaporwave is a microgenre of electronic music, visual art style, and Internet meme "
          }
          onCancel={() => setcheck(false)}
        >
          <span className="text-black"></span>
        </Modal>
      )}
    </main>
  );
}
