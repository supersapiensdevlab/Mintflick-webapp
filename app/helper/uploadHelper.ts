import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';

export function makeStorageClient(): Web3Storage {
  return new Web3Storage({
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEVFNjNCNEU2NkFCQTljYzg5Q2IyQjliNDExMUY3NDk5Mjc3YjU0NmQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Mjc5MzkxODU4MDksIm5hbWUiOiJkYmVhdHMifQ.FtSaoUWl1cimU0beIVbakmvpGaE_U6LVFDpw2Pja2po',
  });
}

export async function storeWithProgress(files: File[]): Promise<string> {
  // show the root cid as soon as it's ready
  const onRootCidReady = (cid: string) =>
    console.log('uploading files with cid ->', cid);
  const file = files[0];
  const totalSize = file.size;
  let uploaded = 0;
  const onStoredChunk = (size: number) => {
    uploaded += size;
    const pct = (totalSize / uploaded) * 100;
    console.log(`Uploading... ${pct}% complete`);
  };

  // makeStorageClient returns an authorized Web3.Storage client instance
  const client = makeStorageClient();

  // client.put will invoke our callbacks during the upload
  // and return the root cid when the upload completes
  const cid = await client.put(files, { onRootCidReady, onStoredChunk });
  console.log('stored files with cid:', cid);
  return cid;
}
