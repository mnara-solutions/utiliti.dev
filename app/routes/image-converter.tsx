import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Box, { BoxButtons, BoxContent, BoxTitle } from "~/components/box";
import * as React from "react";
import { type ChangeEvent, useCallback, useEffect, useState } from "react";
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
import NumberInput from "~/components/number-input";

export const meta = metaHelper(
  utilities.imageConverter.name,
  utilities.imageConverter.description,
);

export enum ResizeType {
  none,
  large,
  small,
  square,
  width,
  height,
}

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
  const [resize, setResize] = useState("none");
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState(500);

  // cache computation for files
  // the only reason we need this is that removing a file changes `files`, which causes dataUrls to be re-calculated
  const convertFile = useCallback(
    (file: File) => {
      let resizeType = ResizeType.none;
      switch (resize) {
        case "none":
          resizeType = ResizeType.none;
          break;
        case "large":
          resizeType = ResizeType.large;
          break;
        case "small":
          resizeType = ResizeType.small;
          break;
        case "square":
          resizeType = ResizeType.square;
          break;
        case "width":
          resizeType = ResizeType.width;
          break;
        case "height":
          resizeType = ResizeType.height;
          break;
      }
      return convertToFileFormat(
        file,
        format,
        parseInt(quality, 10),
        resizeType,
        size,
      );
    },
    [format, quality, resize, size],
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

  const onChangeSize = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSize(Math.min(Math.max(parseInt(e.target.value, 10), 1), 500));
    },
    [setSize],
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
                  {files.map((file, index) => {
                    return dataUrls[index] ? (
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
                    ) : null;
                  })}
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
            <div className="flex items-center">Resize</div>
            <Dropdown
              onOptionChange={setResize}
              options={[
                { id: "none", label: "None" },
                { id: "large", label: "Largest Size" },
                { id: "small", label: "Smallest Size" },
                { id: "square", label: "Square" },
                { id: "width", label: "Width" },
                { id: "height", label: "Height" },
              ]}
              defaultValue={format}
            />
            {resize !== "none" ? (
              <NumberInput
                type="number"
                min={1}
                max={500}
                value={size}
                onChange={onChangeSize}
              />
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
