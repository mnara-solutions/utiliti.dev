import Copy from "~/components/copy";
import ReadOnlyTextArea from "~/components/read-only-textarea";
import Box, { BoxContent, BoxTitle } from "~/components/box";

interface Props {
  readonly output: string;
  readonly title?: string;
}

export default function SimpleOutput({ output, title }: Props) {
  return (
    <Box>
      <BoxTitle title={title ?? "Output"}>
        <div>
          <Copy content={output} />
        </div>
      </BoxTitle>
      <BoxContent isLast={true}>
        <ReadOnlyTextArea value={output} />
      </BoxContent>
    </Box>
  );
}
