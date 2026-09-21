const util = require('node:util');
if (!util.styleText) {
  util.styleText = (format, text) => text;
}

const Module = require('node:module');
const origLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (
    request.includes('@exodus/bytes') ||
    (parent && parent.filename && parent.filename.includes('html-encoding-sniffer'))
  ) {
    return {
      decode: (buf, encoding) => new TextDecoder(encoding || 'utf-8').decode(buf),
      encode: (str) => new TextEncoder().encode(str),
      labelToEncoding: (label) => label,
      isEncodingSupported: () => true,
    };
  }
  return origLoad.apply(this, arguments);
};
