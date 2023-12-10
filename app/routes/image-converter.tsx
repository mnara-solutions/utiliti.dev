import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Box, { BoxButtons, BoxContent, BoxTitle } from "~/components/box";
import { useCallback, useState } from "react";
import ContentWrapper from "~/components/content-wrapper";
import ReadFile from "~/components/read-file";
import Button from "~/components/button";
import { Transition } from "@headlessui/react";
import Dropdown from "~/components/dropdown";
import JSZip from "jszip";
import { convertToFileFormat } from "~/utils/convert-image-file";

export const meta = metaHelper(
  utilities.imageConverter.name,
  utilities.imageConverter.description,
);

const formatImage: { [format: string]: string } = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export default function ImageConverter() {
  const [images, setImages] = useState<string[]>([]);
  const [format, setFormat] = useState("jpg");
  const [quality, setQuality] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const onChangeFormat = useCallback(
    (format: string) => {
      // This will loose some quality if we are going from jpeg to webp, in the future consider keeping the old
      // images around to convert from.
      images.forEach((image, index) => {
        convertToFileFormat(image, format, parseFloat(quality))
          .then((dataUrl) => {
            setImages((prevImages) => {
              prevImages[index] = dataUrl;
              return [...prevImages];
            });
          })
          .catch((_) => {
            setError("Something went wrong, please try again.");
            setImages([]);
          });
      });

      setFormat(format);
    },
    [images, setImages, setFormat, quality],
  );

  const onDownloadZip = useCallback(async () => {
    const zip: JSZip = new JSZip();

    // Iterate over each data URL
    for (let i = 0; i < images.length; i++) {
      const response = await fetch(images[i]);
      const arrayBuffer = await response.arrayBuffer();

      // Convert data URL to binary blob
      const blob = new Blob([arrayBuffer], { type: formatImage[format] });

      const fileNameWithoutExtension = fileNames[i].replace(/\.[^.]+$/, "");

      // Add the blob to the zip file with a filename
      zip.file(fileNameWithoutExtension + "." + format, blob);
    }

    // Generate the zip file
    const content = await zip.generateAsync({ type: "blob" });

    // Create a download link for the zip file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);

    // TODO: Come up with a better name...
    link.download = format + "-images.zip";
    document.body.appendChild(link);

    // Trigger a click on the link to initiate the download
    link.click();

    // Remove the link from the DOM
    document.body.removeChild(link);
  }, [images, fileNames, format]);

  const onLoad = useCallback(
    (image: string, fileName: string) => {
      console.log("dataUrl", image);
      setImages((prevImages) => [...prevImages, image]);
      setFileNames((prevFileNames) => [...prevFileNames, fileName]);
    },
    [setImages, setFileNames],
  );

  const onError = useCallback(
    (error: string) => {
      setError(error);
    },
    [setError],
  );

  const onRemoveImage = useCallback(
    (index: number) => {
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
      setFileNames((prevFileNames) =>
        prevFileNames.filter((_, i) => i !== index),
      );
    },
    [setImages, setFileNames],
  );

  const onDownloadImage = useCallback(
    (index: number) => {
      // TODO: Get the real name from ReadFile...
      const link = document.createElement("a");
      link.href = images[index];
      link.download = `image-${index}.${format}`;
      link.click();
    },
    [images, format],
  );

  return (
    <ContentWrapper>
      <h1>Image Converter</h1>

      <Box>
        <BoxTitle title="Images"></BoxTitle>

        <BoxContent isLast={false}>
          {images.length === 0 ? (
            <div className="p-8 font-bold">Upload Some Images</div>
          ) : (
            <div className="flex flex-wrap m-8">
              {images.map((image: string, index: number) => (
                <div key={index} className="relative px-2 mb-4">
                  <img
                    className="w-40 h-40 object-cover rounded cursor-pointer"
                    onClick={() => onDownloadImage(index)}
                    src={image}
                    key={index}
                    alt={fileNames[index]}
                  />
                  <button
                    onClick={() => onRemoveImage(index)}
                    className="absolute top-1 right-3 px-2 bg-red-500 text-white rounded-full"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </BoxContent>

        <BoxButtons>
          <div className="flex gap-x-2">
            <div className="flex items-center">Output Format</div>
            <Dropdown
              onOptionChange={onChangeFormat}
              options={[
                { id: "jpg", label: "Jpeg" },
                { id: "png", label: "Png" },
                { id: "webp", label: "Webp" },
              ]}
              defaultValue={format}
            />
            {format !== "png" ? (
              <>
                <div className="flex items-center">Compression</div>
                <Dropdown
                  onOptionChange={setQuality}
                  options={[
                    { id: "0", label: "Default" },
                    { id: "1", label: "Full (100%)" },
                    { id: ".9", label: "Very High (90%)" },
                    { id: ".8", label: "High (80%)" },
                    { id: ".75", label: "Good (75%)" },
                    { id: ".6", label: "Medium (60%)" },
                    { id: ".5", label: "Low (50%)" },
                    { id: ".25", label: "Poor (25%)" },
                  ]}
                  defaultValue={quality.toString()}
                />
              </>
            ) : null}
            <ReadFile
              accept="image/*"
              onLoad={onLoad}
              onError={onError}
              multiple={true}
              type="dataURL"
              format={format}
              quality={quality}
            />
          </div>
          <div className="flex gap-x-2">
            <Button onClick={onDownloadZip} label="Download As Zip" />
          </div>
        </BoxButtons>
      </Box>

      <Transition
        show={error != null}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        className="mt-6"
      >
        <Box>
          <BoxTitle title="Error" />
          <BoxContent isLast={true} className="px-3 py-2 text-red-400">
            {error}
          </BoxContent>
        </Box>
      </Transition>
    </ContentWrapper>
  );
}