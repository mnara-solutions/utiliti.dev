import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Box, { BoxButtons, BoxContent, BoxTitle } from "~/components/box";
import { useCallback, useEffect, useState } from "react";
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

function renameFile(file: File, format: string) {
  const filename = file.name;
  const filenameWithoutExtension = filename.substring(
    0,
    filename.lastIndexOf("."),
  );

  return `${filenameWithoutExtension}.${format}`;
}
export default function ImageConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [dataUrls, setDataUrls] = useState<string[]>([]);
  const [format, setFormat] = useState("jpg");
  const [quality, setQuality] = useState("0");
  const [error, setError] = useState<string | null>(null);

  // materialized state - we need each file as a data url
  useEffect(() => {
    Promise.all(
      files.map((it) => convertToFileFormat(it, format, parseInt(quality, 10))),
    ).then((it) => setDataUrls(it));
  }, [files, format, quality]);

  const onDownloadZip = useCallback(async () => {
    const zip: JSZip = new JSZip();

    for (let i = 0; i < files.length; i++) {
      const f = files[i];

      zip.file(
        renameFile(f, format),
        new Blob([await f.arrayBuffer()], { type: formatImage[format] }),
      );
    }

    // generate the zip file
    const content = await zip.generateAsync({ type: "blob" });

    // create a download link for the zip file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);

    // TODO: Come up with a better name...
    link.download = format + "-images.zip";
    document.body.appendChild(link);

    // trigger a click on the link to initiate the download
    link.click();

    // remove the link from the DOM
    document.body.removeChild(link);
  }, [files, format]);

  const onError = useCallback(
    (error: string) => {
      setError(error);
    },
    [setError],
  );

  const onRemoveImage = useCallback(
    (index: number) => {
      setFiles(files.filter((_, i) => i !== index));
    },
    [files],
  );

  const onDownloadImage = useCallback(
    (index: number) => {
      const link = document.createElement("a");
      link.href = dataUrls[index];
      link.download = renameFile(files[index], format);
      link.click();
    },
    [dataUrls, files, format],
  );

  return (
    <ContentWrapper>
      <h1>Image Converter</h1>

      <Box>
        <BoxTitle title="Images"></BoxTitle>

        <BoxContent isLast={false}>
          {files.length === 0 ? (
            <div className="p-8 font-bold">Upload Some Images</div>
          ) : (
            <div className="flex flex-wrap m-8">
              {files.map((file, index) => (
                <div key={index} className="relative px-2 mb-4">
                  <img
                    className="w-40 h-40 object-cover rounded cursor-pointer"
                    onClick={() => onDownloadImage(index)}
                    src={dataUrls[index]}
                    key={index}
                    alt={file.name}
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
              onOptionChange={setFormat}
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
              onLoad={setFiles}
              onError={onError}
              multiple={true}
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
