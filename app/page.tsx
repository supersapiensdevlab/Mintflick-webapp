"use client";
import { useState } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import TextInput from "@/components/TextInput";
import TextareaInput from "@/components/TextareaInput";
import SearchBar from "@/components/SearchBar";
import Divider from "@/components/Divider";
import CheckBox from "@/components/CheckBox";
import Switch from "@/components/Switch";
import Avatar from "@/components/Avatar";
import Pill from "@/components/Pill";
import Tick from "@/components/Tick";
import Radio from "@/components/Radio";
import Toast from "@/components/Toast";
import Notification from "@/components/Notification";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [first, setfirst] = useState("");
  const [check, setcheck] = useState(false);
  const [second, setsecond] = useState("");

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-24">
      <SearchBar
        onChange={(e) => setfirst(e.target.value)}
        onClear={() => setfirst("")}
        value={first}
        placeholder={"Search here"}
      />
      <CheckBox
        text={"terms"}
        checked={check}
        onChange={() => setcheck(!check)}
      />
      <Switch on={check} onChange={() => setcheck(!check)} />
      <Tick />
      <Avatar />
      <Radio
        flex="row"
        value={second}
        onChange={setsecond}
        options={[
          { color: "default", option: "react" },
          { color: "default", option: "next" },
          { color: "default", option: "python" },
        ]}
      />
      <Pill>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>

        <span>text</span>
      </Pill>
      <Toast message={"hello"} />
      <Divider></Divider>
      <Notification
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
            />
          </svg>
        }
        message={"hello"}
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
        // error="something"
        onChange={(e) => setfirst(e.target.value)}
        value={first}
        placeholder={"type here"}
        count={32}
      />
    </main>
  );
}
