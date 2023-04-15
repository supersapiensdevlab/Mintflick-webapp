import React, { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Photo } from "tabler-icons-react";
import { sanitizeFilename } from "../functions/sanitizeFilename";

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
function rotateSize(width, height, rotation) {
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
  imageSrc,
  pixelCrop,
  rotation = 0,
  compression,
  flip = { horizontal: false, vertical: false }
) {
  const image = await createImage(imageSrc);
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
      (file) => {
        resolve(URL.createObjectURL(file));
      },
      "image/webp",
      compression
    );
  });
}

function CustomImageInput({
  image,
  setImage,
  label,
  aspect,
  cropShape,
  showGrid,
  compression,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const hiddenFileInput = useRef(null);
  const [selectedFile, setselectedFile] = useState(null);

  const onCropComplete = useCallback(
    async (croppedArea, croppedAreaPixels) => {
      try {
        const croppedImage = await getCroppedImg(
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
      } catch (e) {
        console.error(e);
      }
    },
    [croppedAreaPixels, rotation, selectedFile]
  );

  const onClose = useCallback(() => {
    setImage(null);
  }, []);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleImageChange = (event) => {
    // Update the state

    const file = sanitizeFilename(event.target.files[0]);
    console.log(file);
    setselectedFile({
      file: [file],
      localurl: URL.createObjectURL(event.target.files[0]),
    });
  };
  return (
    <>
      <div className="flex flex-col items-start w-full gap-2 border-2 border-dashed rounded-lg border-slate-400 dark:border-slate-600 text-brand4">
        {selectedFile?.localurl && (
          <div className="relative w-full h-96">
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
                containerStyle: { height: "100%" },
              }}
            />
          </div>
        )}
        <label
          onClick={handleClick}
          className="flex items-center w-full gap-2 p-2 cursor-pointer "
        >
          <Photo />
          {selectedFile ? (
            selectedFile.file && (
              <div className="flex items-center truncate ">
                <span className="flex-grow truncate text-brand2">
                  Choose another file
                </span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-1">{label}</div>
          )}
        </label>
        <input
          ref={hiddenFileInput}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="sr-only"
          onClick={(event) => {
            event.target.value = null;
            setselectedFile(null);
            console.log("setting null");
          }}
        />
      </div>
      {selectedFile && selectedFile.file[0]?.size > 2000000 && (
        <span className="ml-2 font-semibold text-error">
          File size must be less than 2MB.
        </span>
      )}
    </>
  );
}

export default CustomImageInput;
