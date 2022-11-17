import { Web3Storage } from "web3.storage";
import React, { useEffect } from "react";

function testConnect() {
  async function upload(filesInput) {
    console.log("UPLOADING...");
    // Construct with token and endpoint
    const client = new Web3Storage({
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBhNzk3MkY3QTRDNUNkZDJlOENBQzE1RDJCZjJBRUFlQTg1QmM3MzEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Mjc1MTY1MTgyMjUsIm5hbWUiOiJEQmVhdHMifQ.16-okZlX7RmNcszqLq06lvzDkZ-Z8CHnmAIRXjQ2q5Q",
    });

    // Pack files into a CAR and send to web3.storage
    const rootCid = await client.put(filesInput); // Promise<CIDString>
    console.log(rootCid);

    // Get info on the Filecoin deals that the CID is stored in
    const info = await client.status(rootCid); // Promise<Status | undefined>
    console.log(info);

    // Fetch and verify files from web3.storage
    const res = await client.get(rootCid); // Promise<Web3Response | null>
    console.log(res);

    const files = await res.files(); // Promise<Web3File[]>
    console.log(files);
    for (const file of files) {
      console.log(`${file.cid} ${file.name} ${file.size}`);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <input
          type="file"
          onChange={(e) => upload(e.target.files)}
          id="avatar"
          name="avatar"
          accept="image/png, image/jpeg"
        ></input>
      </header>
    </div>
  );
}

export default testConnect;
