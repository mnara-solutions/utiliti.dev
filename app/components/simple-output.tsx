import Copy from "~/components/copy";
import ReadOnlyTextArea from "~/components/read-only-textarea";
import Box, { BoxContent, BoxTitle } from "~/components/box";

interface Props {
  readonly output: string;
}

export function SimpleOutput({ output }: Props) {
  return (
    <Box>
      <BoxTitle title="Output">
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
