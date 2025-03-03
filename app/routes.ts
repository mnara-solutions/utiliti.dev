import { type RouteConfig, index, route } from "@react-router/dev/routes";

export class Routes {
  static readonly PRIVATE_NOTES = "/private-note/";
  static readonly PRIVATE_NOTE_CREATE = "/private-note/create";
  static readonly PRIVATE_NOTE = (id: string = ":id", hash = ":hash") =>
    `/private-note/${id}#${hash}`;
  static readonly JSON = "/json";
  static readonly PRETTIER = "/prettier";
  static readonly URL = "/url";
  static readonly BASE64 = "/base64";
  static readonly DATAURL = "/dataurl";
  static readonly IMAGE_CONVERTER = "/image-converter";
  static readonly WORD_COUNTER = "/word-counter";
  static readonly MARKDOWN_TO_HTML = "/markdown-to-html";
  static readonly LOREM_IPSUM = "/lorem-ipsum";
  static readonly PASSWORD_GENERATOR = "/password-generator";
  static readonly UUID = "/uuid";
  static readonly CUID = "/cuid";
  static readonly NS_LOOKUP = "/ns-lookup";
  static readonly WHOIS = "/whois";
  static readonly UNIX_TIMESTAMP = "/unix-timestamp";
  static readonly SQL_FORMATTER = "/sql-formatter";
  static readonly QR_CODE = "/qr-code";
  static readonly HASHING = "/hashing";
}

export default [
  index("./routes/index.tsx"),
  route("private-note", "./routes/private-note/layout.tsx", [
    index("./routes/private-note/index.tsx"),
    route(":id", "./routes/private-note/read.tsx"),
    route("create", "./routes/private-note/create.tsx"),
  ]),
  route(Routes.JSON, "./routes/json.tsx"),
  route(Routes.PRETTIER, "./routes/prettier.tsx"),
  route(Routes.URL, "./routes/url.tsx"),
  route(Routes.BASE64, "./routes/base64.tsx"),
  route(Routes.DATAURL, "./routes/dataurl.tsx"),
  route(Routes.IMAGE_CONVERTER, "./routes/image-converter.tsx"),
  route(Routes.WORD_COUNTER, "./routes/word-counter.tsx"),
  route(Routes.MARKDOWN_TO_HTML, "./routes/markdown-to-html.tsx"),
  route(Routes.LOREM_IPSUM, "./routes/lorem-ipsum.tsx"),
  route(Routes.PASSWORD_GENERATOR, "./routes/password-generator.tsx"),
  route(Routes.UUID, "./routes/uuid.tsx"),
  route(Routes.CUID, "./routes/cuid.tsx"),
  route(Routes.NS_LOOKUP, "./routes/ns-lookup.tsx"),
  route(Routes.WHOIS, "./routes/whois.tsx"),
  route(Routes.UNIX_TIMESTAMP, "./routes/unix-timestamp.tsx"),
  route(Routes.SQL_FORMATTER, "./routes/sql-formatter.tsx"),
  route(Routes.QR_CODE, "./routes/qr-code.tsx"),
  route(Routes.HASHING, "./routes/hashing.tsx"),
] satisfies RouteConfig;
