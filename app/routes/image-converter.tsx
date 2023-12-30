import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Box, { BoxButtons, BoxContent, BoxTitle } from "~/components/box";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import ContentWrapper from "~/components/content-wrapper";
import ReadFile from "~/components/read-file";
import Button from "~/components/button";
import { Transition } from "@headlessui/react";
import Dropdown from "~/components/dropdown";
import JSZip from "jszip";
import { convertToFileFormat } from "~/utils/convert-image-file";
import { NativeTypes } from "react-dnd-html5-backend";
import type { DropTargetMonitor } from "react-dnd";
import { useDrop } from "react-dnd";
import {
  ArrowDownOnSquareIcon,
  CloudArrowUpIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "~/common";

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

  // cache computation for files
  // the only reason we need this is that removing a file changes `files`, which causes dataUrls to be re-calculated
  const convertFile = useCallback(
    (file: File) => {
      return convertToFileFormat(file, format, parseInt(quality, 10));
    },
    [format, quality],
  );

  // materialized state - we need each file as a data url
  useEffect(() => {
    Promise.all(files.map(convertFile)).then(setDataUrls);
  }, [files, convertFile]);

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

    // TODO: come up with a better name...
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

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item: { files: File[] }) {
        setFiles([
          ...files,
          ...item.files.filter(
            (it) => it.size < 10 * 1024 * 1024 && it.type.startsWith("image/"),
          ),
        ]);
      },

      collect: (monitor: DropTargetMonitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    }),
    [files],
  );

  const isActive = canDrop && isOver;

  return (
    <ContentWrapper>
      <h1>Image Converter</h1>

      <Box>
        <BoxTitle title="Images"></BoxTitle>

        <BoxContent isLast={false} className="max-h-max">
          <div className="flex items-center justify-center w-full" ref={drop}>
            <label
              htmlFor="file-input"
              className={classNames(
                "flex flex-col m-2 items-center justify-center w-full h-full border-2 border-dashed rounded-lg bg-zinc-800",
                isActive ? "border-green-700" : "border-gray-600",
                files.length === 0 && "cursor-pointer hover:bg-zinc-700",
              )}
            >
              {files.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <CloudArrowUpIcon className="w-8 h-8 mb-4" />

                  <p className="mb-2 text-sm">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs">JPG, PNG or WEBP (MAX. 10mb)</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4 p-2">
                  {files.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        className="w-full h-full aspect-square object-cover rounded cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          onDownloadImage(index);
                        }}
                        src={dataUrls[index]}
                        key={index}
                        alt={file.name}
                      />

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onRemoveImage(index);
                        }}
                        className="absolute top-1 right-1 text-red-600 hover:text-red-800"
                      >
                        <XCircleIcon className="h-6 w-6" />
                        <span className="sr-only">Remove Image</span>
                      </button>

                      <button className="absolute bottom-1 right-1 text-orange-600 hover:text-orange-800">
                        <ArrowDownOnSquareIcon className="h-6 w-6" />
                        <span className="sr-only">Download Image</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </label>
          </div>
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
              onLoad={(it) => setFiles([...files, ...it])}
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
