import type { MetaFunction } from "@remix-run/cloudflare";
import Copy from "~/components/copy";
import ReadFile from "~/components/read-file";
import Button from "~/components/button";
import { Transition } from "@headlessui/react";
import { useCallback, useState } from "react";
import { JSONTree } from "react-json-tree";
import Code from "~/components/code";
import { noop } from "~/common";

export const meta: MetaFunction = () => ({
  title: "JSON | Utiliti",
});

async function encode(text: string): Promise<string> {
  try {
    return JSON.stringify(text);
  } catch (e) {
    return Promise.reject({ message: (e as SyntaxError).message });
  }
}

async function decode(text: string): Promise<string> {
  try {
    return JSON.parse(text);
  } catch (e) {
    return Promise.reject({ message: (e as SyntaxError).message });
  }
}

interface Output {
  readonly type: "text" | "json";
  readonly data: any;
}

export default function JSONEncoder() {
  const [json, setJson] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<Output | null>(null);

  const minify = useCallback(async () => {
    decode(json)
      .then((it) => encode(it))
      .then((it) => {
        setOutput({ type: "text", data: it });
        setError(null);
      })
      .catch((e) => {
        setError(e.message);
        setOutput(null);
      });
  }, [json]);

  const format = useCallback(async () => {
    decode(json)
      .then((it) => JSON.stringify(it, null, 2))
      .then((it) => {
        setOutput({ type: "text", data: it });
        setError(null);
      })
      .catch((e) => {
        setError(e.message);
        setOutput(null);
      });
  }, [json]);

  const view = useCallback(async () => {
    decode(json)
      .then((it) => {
        setOutput({ type: "json", data: it });
        setError(null);
      })
      .catch((e) => {
        setError(e.message);
        setOutput(null);
      });
  }, [json]);

  return (
    <>
      <h1>JSON</h1>

      <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-600">
          <div className="font-bold">Input</div>
          <div>
            <Copy content={json} />
          </div>
        </div>
        <div className="px-4 py-2 bg-zinc-800 max-h-96 overflow-auto">
          <Code
            value={json}
            setValue={setJson}
            minHeight="12rem"
            readonly={false}
          />
        </div>

        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-600">
          <div>
            <ReadFile accept="text/plain,application/JSON" onLoad={setJson} />
          </div>
          <div className="flex gap-x-2">
            <Button onClick={() => view()} label="View" />
            <Button onClick={() => format()} label="Format" />
            <Button onClick={() => minify()} label="Minify" />
          </div>
        </div>
      </div>

      <div className="h-4" />

      <Transition
        show={output != null || error != null}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        {error ? (
          <div
            className="p-4 mb-4 text-sm rounded-lg bg-zinc-700 text-red-500"
            role="alert"
          >
            <span className="font-medium">Error: </span> {error}
          </div>
        ) : (
          <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-600 font-bold">
              <div>Output</div>
              <div>
                <Copy content={output?.data || ""} />
              </div>
            </div>
            <div className="px-4 py-2 bg-zinc-800 rounded-b-lg">
              <label htmlFor="input" className="sr-only">
                Your output
              </label>
              {output?.type === "json" ? (
                <JSONTree
                  data={output?.data}
                  hideRoot={true}
                  shouldExpandNodeInitially={(keyPath, data, level) =>
                    level < 3
                  }
                  theme={{
                    base00: "#27272a", // background
                    base0D: "#9876aa", // label + arrow
                    base09: "#6897bb", // number + boolean
                    base0B: "#6a8759", // string + date + item string
                    base03: "#6a8759", // item string expanded
                  }}
                />
              ) : (
                <Code value={output?.data} setValue={noop} readonly={true} />
              )}
            </div>
          </div>
        )}
      </Transition>
    </>
  );
}
