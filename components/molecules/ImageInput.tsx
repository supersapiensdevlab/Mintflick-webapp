import React, { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import FullScreenOverlay from "./FullScreenOverlay";
import Button from "./Button";

function sanitizeFilename(file: any) {
  const newFilename = file.name.replace(/[^a-zA-Z0-9\.]/g, "_");
  const renamedFile = new File([file], newFilename, { type: file.type });
  return renamedFile;
}

const createImage = (url: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: any,
  rotation = 0,
  compression: number,
  flip = { horizontal: false, vertical: false }
) {
  const image: any = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (file: any) => {
        resolve(URL.createObjectURL(file));
      },
      "image/webp",
      compression
    );
  });
}

function ImageInput({
  image,
  setImage,
  label,
  aspect,
  cropShape,
  showGrid,
  compression,
}: {
  image?: string;
  setImage: Function;
  label?: string;
  aspect?: number;
  cropShape?: "rect" | "round";
  showGrid?: boolean;
  compression: number;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const hiddenFileInput = useRef<any>(null);
  const [cropperOpen, setcropperOpen] = useState(false);
  const [selectedFile, setselectedFile] = useState<any>(null);
  const [imageUrl, setimageUrl] = useState("");

  const onCropComplete = useCallback(
    async (croppedArea: any, croppedAreaPixels: any) => {
      try {
        const croppedImage: any = await getCroppedImg(
          selectedFile?.localurl,
          croppedAreaPixels,
          rotation,
          compression
        );
        console.log("donee", { croppedImage });
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        const myNewFile = new File([blob], "image", {
          type: blob.type,
        });

        console.log("Compressed Image", myNewFile);

        setImage(myNewFile);
        setimageUrl(croppedImage);
      } catch (e) {
        console.error(e);
      }
    },
    [croppedAreaPixels, rotation, selectedFile]
  );

  // const onClose = useCallback(async () => {}, []);
  const handleClick = () => {
    hiddenFileInput?.current.click();
  };
  const handleImageChange = (event: any) => {
    // Update the state

    const file = sanitizeFilename(event.target.files[0]);
    console.log(file);

    setselectedFile({
      file: [file],
      localurl: URL.createObjectURL(event.target.files[0]),
    });

    event.target.files[0]?.size < 2000000 && setcropperOpen(true);
  };
  return (
    <>
      <div className="flex flex-col items-center w-full gap-2 p-1 border-2 border-dashed rounded-lg border-vapormintBlack-200 text-brand4">
        {selectedFile?.localurl && cropperOpen && (
          <FullScreenOverlay
            title={"Crop Image"}
            onClose={() => {
              setcropperOpen(false);
            }}>
            <div className="flex flex-col items-center justify-start w-full h-full max-w-lg gap-2 p-1 overflow-hidden">
              <div className="relative flex-grow w-full overflow-hidden rounded-lg">
                <Cropper
                  image={selectedFile?.localurl}
                  crop={crop}
                  rotation={rotation}
                  zoom={zoom}
                  aspect={aspect}
                  cropShape={cropShape}
                  showGrid={showGrid}
                  onCropChange={setCrop}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  style={{
                    containerStyle: {
                      height: "100%",
                      width: "100%",
                      backgroundColor: "transparent",
                    },
                    mediaStyle: {
                      backgroundColor: "transparent",
                    },
                    cropAreaStyle: {
                      width: "100%",
                      backgroundColor: "transparent",
                    },
                  }}
                />
              </div>{" "}
              <Button
                handleClick={() => setcropperOpen(false)}
                kind="success"
                type="solid"
                size="base">
                Done
              </Button>
            </div>
          </FullScreenOverlay>
        )}
        {selectedFile && selectedFile.file[0]?.size > 2000000 && (
          <span className="text-base font-semibold tracking-wider text-vapormintError-500 ">
            File size must be less than 2MB.
          </span>
        )}
        {imageUrl && <img className="w-full max-w-lg rounded" src={imageUrl} />}
        <label className="flex items-start w-full gap-2 p-2 cursor-pointer ">
          {selectedFile ? (
            selectedFile.file && (
              <Button
                handleClick={handleClick}
                kind="warning"
                type="ghost"
                size="small">
                Choose another photo
              </Button>
            )
          ) : (
            <div
              onClick={handleClick}
              className="flex items-center w-full gap-2 text-base font-semibold capitalize text-vapormintWhite-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 ">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {label}
            </div>
          )}
        </label>
        <input
          ref={hiddenFileInput}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="sr-only"
          onClick={(event: any) => {
            event.target.value = null;
            setselectedFile(null);
            console.log("setting null");
          }}
        />
      </div>
    </>
  );
}

export default ImageInput;
