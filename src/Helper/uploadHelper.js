import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";

export function makeStorageClient() {
  return new Web3Storage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBhNzk3MkY3QTRDNUNkZDJlOENBQzE1RDJCZjJBRUFlQTg1QmM3MzEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Mjc1MTY1MTgyMjUsIm5hbWUiOiJEQmVhdHMifQ.16-okZlX7RmNcszqLq06lvzDkZ-Z8CHnmAIRXjQ2q5Q",
  });
}

export async function uploadFile(files) {
  console.log(files);
  // show the root cid as soon as it's ready
  const onRootCidReady = (cid) => {
    console.log(cid);
  };
  const file = [files[0] || files];
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
  console.log(client);

  // client.put will invoke our callbacks during the upload
  // and return the root cid when the upload completes
  return client.put(file, { onRootCidReady });
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
