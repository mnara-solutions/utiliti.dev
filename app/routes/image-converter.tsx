import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import { Routes } from "~/routes";
import Box, { BoxButtons, BoxContent, BoxTitle } from "~/components/box";
import { useEffect, useState } from "react";
import { createZip } from "~/utils/jszip.client";
import ContentWrapper from "~/components/content-wrapper";
import ReadFile from "~/components/read-file";
import Button from "~/components/button";
import FadeIn from "~/components/fade-in";
import Dropdown from "~/components/dropdown";

import { convertToFileFormat } from "~/utils/convert-image-file";
import {
  ArrowDownOnSquareIcon,
  CloudArrowUpIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "~/common";
import { useFileDrop } from "~/hooks/use-file-drop";

export const meta = metaHelper(
  utilities.imageConverter.name,
  "Convert images between JPG, PNG, and WebP formats privately. All processing happens in your browser—your images never leave your device.",
  Routes.IMAGE_CONVERTER,
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

  const { ref: drop, isOver } = useFileDrop({
    onDrop: (droppedFiles) => {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...droppedFiles.filter(
          (it) => it.size < 10 * 1024 * 1024 && it.type.startsWith("image/"),
        ),
      ]);
    },
    accept: "image/*",
  });

  // materialized state - we need each file as a data url
  useEffect(() => {
    Promise.all(
      files.map((it) => convertToFileFormat(it, format, parseInt(quality, 10))),
    ).then(setDataUrls);
  }, [files]);

  const onDownloadZip = async () => {
    const zip = await createZip();

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
  };

  const onDownloadImage = (index: number) => {
    const link = document.createElement("a");
    link.href = dataUrls[index];
    link.download = renameFile(files[index], format);
    link.click();
  };

  const isActive = isOver;

  return (
    <ContentWrapper>
      <h1>Image Converter</h1>

      <p>
        Convert images between formats instantly and privately. All processing
        happens in your browser—your images never touch our servers.
      </p>

      <Box>
        <BoxTitle title="Images"></BoxTitle>

        <BoxContent isLast={false} className="max-h-max">
          <div className="flex items-center justify-center w-full" ref={drop}>
            <label
              htmlFor="file-input"
              className={cn(
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
                        className="w-full h-full aspect-square object-cover rounded-sm cursor-pointer"
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
                          setFiles(files.filter((_, i) => i !== index));
                        }}
                        className="absolute top-1 right-1 text-red-600 hover:text-red-800"
                      >
                        <XCircleIcon className="h-6 w-6" />
                        <span className="sr-only">Remove Image</span>
                      </button>

                      <button
                        className="absolute bottom-1 right-1 text-orange-600 hover:text-orange-800"
                        onClick={(e) => {
                          e.preventDefault();
                          onDownloadImage(index);
                        }}
                      >
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
              onError={setError}
              multiple={true}
            />
          </div>
          <div className="flex gap-x-2">
            <Button onClick={onDownloadZip} label="Download As Zip" />
          </div>
        </BoxButtons>
      </Box>

      <FadeIn show={error != null} className="mt-6">
        <Box>
          <BoxTitle title="Error" />
          <BoxContent isLast={true} className="px-3 py-2 text-red-400">
            {error}
          </BoxContent>
        </Box>
      </FadeIn>

      <h2>Why Use Utiliti&apos;s Image Converter?</h2>
      <p>
        Images often contain sensitive content—personal photos, confidential
        documents, proprietary designs, or screenshots with private information.
        Many online image converters upload your files to their servers for
        processing, where they could be stored, analyzed, or exposed.
      </p>
      <p>
        Utiliti&apos;s Image Converter runs{" "}
        <strong>entirely in your browser</strong> using the Canvas API. Your
        images never leave your device, making it safe to convert:
      </p>
      <ul>
        <li>
          <strong>Personal Photos</strong>: Convert family photos without
          uploading them to unknown servers
        </li>
        <li>
          <strong>Confidential Documents</strong>: Process scanned documents and
          screenshots privately
        </li>
        <li>
          <strong>Client Work</strong>: Handle client assets without violating
          NDAs or privacy agreements
        </li>
        <li>
          <strong>Proprietary Designs</strong>: Convert mockups and designs
          without exposure risk
        </li>
      </ul>

      <h2>Features</h2>
      <ul>
        <li>
          <strong>Batch Processing</strong>: Convert multiple images at once and
          download them all as a ZIP file
        </li>
        <li>
          <strong>Quality Control</strong>: Adjust compression levels from 25%
          to 100% for the perfect balance of quality and file size
        </li>
        <li>
          <strong>Drag & Drop</strong>: Simply drag images onto the converter
          for quick processing
        </li>
        <li>
          <strong>Individual Downloads</strong>: Download converted images one
          at a time or all together
        </li>
        <li>
          <strong>Preview</strong>: See thumbnails of your converted images
          before downloading
        </li>
      </ul>

      <h2>How to Use</h2>
      <ol>
        <li>
          <strong>Upload images</strong>: Click to browse or drag and drop
          images onto the upload area (max 10MB per image)
        </li>
        <li>
          <strong>Select output format</strong>: Choose between JPEG, PNG, or
          WebP from the dropdown
        </li>
        <li>
          <strong>Adjust quality</strong>: For JPEG and WebP, select your
          preferred compression level
        </li>
        <li>
          <strong>Download</strong>: Click individual images to download them,
          or use &quot;Download As Zip&quot; for batch downloads
        </li>
      </ol>

      <h2>Supported Formats</h2>
      <ul>
        <li>
          <strong>JPEG</strong>: Best for photographs and complex images.
          Supports quality adjustment for smaller file sizes.
        </li>
        <li>
          <strong>PNG</strong>: Best for graphics, screenshots, and images
          requiring transparency. Lossless compression.
        </li>
        <li>
          <strong>WebP</strong>: Modern format with superior compression.
          Supports both lossy and lossless modes. Ideal for web use.
        </li>
      </ul>

      <h2>Common Use Cases</h2>
      <ul>
        <li>
          <strong>Web Optimization</strong>: Convert images to WebP for faster
          website loading times
        </li>
        <li>
          <strong>Compatibility</strong>: Convert WebP images to JPEG/PNG for
          older applications that don&apos;t support WebP
        </li>
        <li>
          <strong>Transparency</strong>: Convert to PNG when you need to
          preserve transparent backgrounds
        </li>
        <li>
          <strong>File Size Reduction</strong>: Use JPEG or WebP with quality
          adjustment to reduce image sizes for email or storage
        </li>
        <li>
          <strong>Batch Conversion</strong>: Convert entire folders of images to
          a consistent format
        </li>
      </ul>

      <h2>Quality vs File Size</h2>
      <p>
        The quality setting affects the trade-off between image fidelity and
        file size:
      </p>
      <ul>
        <li>
          <strong>100% (Full)</strong>: Maximum quality, largest file size
        </li>
        <li>
          <strong>80-90% (High)</strong>: Excellent quality, good compression.
          Recommended for most uses.
        </li>
        <li>
          <strong>60-75% (Medium)</strong>: Good quality, significant size
          reduction. Great for web thumbnails.
        </li>
        <li>
          <strong>25-50% (Low)</strong>: Noticeable quality loss but very small
          files. Use for previews only.
        </li>
      </ul>
    </ContentWrapper>
  );
}
