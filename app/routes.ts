export default class Routes {
  static readonly PRIVATE_NOTES = "/private-note/";
  static readonly PRIVATE_NOTE_CREATE = "/private-note/create";
  static readonly PRIVATE_NOTE = (id: string = ":id", hash = ":hash") =>
    `/private-note/${id}#${hash}`;
  static readonly JSON = "/json";
  static readonly URL = "/url";
  static readonly BASE64 = "/base64";
  static readonly DATAURL = "/dataurl";
  static readonly WORD_COUNTER = "/word-counter";
  static readonly LOREM_IPSUM = "/lorem-ipsum";
  static readonly UUID = "/uuid";
  static readonly CUID = "/cuid";
  static readonly NS_LOOKUP = "/ns-lookup";
  static readonly WHOIS = "/whois";
}
