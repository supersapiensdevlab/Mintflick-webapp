import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";

export function makeStorageClient() {
  return new Web3Storage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEVFNjNCNEU2NkFCQTljYzg5Q2IyQjliNDExMUY3NDk5Mjc3YjU0NmQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Mjc5MzkxODU4MDksIm5hbWUiOiJkYmVhdHMifQ.FtSaoUWl1cimU0beIVbakmvpGaE_U6LVFDpw2Pja2po",
  });
}

export async function uploadFile(files) {
  console.log(files);
  // show the root cid as soon as it's ready
  // const onRootCidReady = (cid) => {
  //   console.log(cid);
  // };
  // const file = [files[0]];
  // const totalSize = files[0].size || files.size;
  // let uploaded = 0;
  // const onStoredChunk = (size) => {
  //   uploaded += size;
  //   const pct = totalSize / uploaded;
  //   // setUploading(10 - pct);
  //   console.log(`Uploading... ${pct}% complete`);
  // };

  // makeStorageClient returns an authorized Web3.Storage client instance
  const client = makeStorageClient();
  console.log(files);

  // client.put will invoke our callbacks during the upload
  // and return the root cid when the upload completes
  // return client.put(file, { onRootCidReady });
  const cid = await client.put(files);
  console.log("stored files with cid:", cid);
  return cid;
}

export async function storeWithProgress2(files) {
  // show the root cid as soon as it's ready
  const onRootCidReady = (cid) => {
    console.log("uploading files with cid:", cid);
  };

  // when each chunk is stored, update the percentage complete and display
  const totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0);
  let uploaded = 0;

  const onStoredChunk = (size) => {
    uploaded += size;
    const pct = 100 * (uploaded / totalSize);
    console.log(`Uploading... ${pct.toFixed(2)}% complete`);
  };

  // makeStorageClient returns an authorized web3.storage client instance
  const client = makeStorageClient();

  // client.put will invoke our callbacks during the upload
  // and return the root cid when the upload completes
  return client.put(files, { onRootCidReady, onStoredChunk });
}

export async function storeWithProgress3(files) {
  if (files) {
    let filecid = null;
    // show the root cid as soon as it's ready
    const onRootCidReady = (cid) => {
      console.log("uploading files with cid ->", cid);
      filecid = cid;
    };
    console.log(Object.keys(files).map((f) => files[f]));
    //console.log(Object.keys(files).map((f) => files[f].size));
    // when each chunk is stored, update the percentage complete and display
    const totalSize = Object.keys(files)
      .map((f) => files[f].size)
      .reduce((a, b) => a + b, 0);
    let uploaded = 0;

    const onStoredChunk = (size) => {
      uploaded += size;
      const pct = totalSize / uploaded;
      console.log(pct, size, totalSize, uploaded);
      console.log(`Uploading... ${pct.toFixed(2) * 100}% complete`);
    };

    // makeStorageClient returns an authorized Web3.Storage client instance
    const client = makeStorageClient();

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return client.put(files, { onRootCidReady, onStoredChunk });
  }
}

export let storeWithProgress = async (files) => {
  // show the root cid as soon as it's ready
  const onRootCidReady = (cid) => {};
  const file = [files[0]];
  const totalSize = files[0].size;
  let uploaded = 0;
  const onStoredChunk = (size) => {
    uploaded += size;
    const pct = totalSize / uploaded;
    // setUploading(10 - pct);
    console.log(`Uploading... ${pct}% complete`);
  };

  // makeStorageClient returns an authorized Web3.Storage client instance
  const client = makeStorageClient();

  // client.put will invoke our callbacks during the upload
  // and return the root cid when the upload completes
  return client.put(files, { onRootCidReady, onStoredChunk });
};
