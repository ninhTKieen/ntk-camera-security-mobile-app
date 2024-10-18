/* eslint-disable prefer-rest-params */
import { XMLParser } from 'fast-xml-parser';

const numberRE = /^-?([1-9]\d*|0)(\.\d*)?$/,
  dateRE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z$/,
  prefixMatch = /(?!xmlns)^.*:/;
/**
 * Parse SOAP object to pretty JS-object
 * @param {object} xml
 * @returns {object}
 */
export const linerase: any = (xml: any) => {
  if (Array.isArray(xml)) {
    if (xml.length > 1) {
      return xml.map(linerase);
    } else {
      xml = xml[0];
    }
  }
  if (typeof xml === 'object') {
    const obj: any = {};
    Object.keys(xml).forEach(function (key) {
      obj[key] = linerase(xml[key]);
    });
    return obj;
  } else {
    if (xml === 'true') {
      return true;
    }
    if (xml === 'false') {
      return false;
    }
    if (numberRE.test(xml)) {
      return parseFloat(xml);
    }
    if (dateRE.test(xml)) {
      return new Date(xml);
    }
    return xml;
  }
};

export const parseSOAPString = async (xml: any): Promise<any> => {
  return new Promise(function (resolve, reject) {
    try {
      xml = xml.replace(/<\?xml [\w\d=\\.\-"\\?\s]+>/gm, '');
      xml = xml.replace(/ xmlns([^=]*?)=(".*?")/gm, '');
      xml = xml.replace(
        /<([\w-]+:?\w+)\s*(\w+="[\w\d\\/:\\.-]+"\s*)*\/?>|<\/([\w-]+:?\w+)>/gm,
        function (match: any) {
          let tagName = '';
          for (let i = 1; i < arguments.length - 2; i++) {
            if (arguments[i]) {
              tagName = arguments[i];
              break;
            }
          }
          let tagNameRes = tagName.replace(prefixMatch, '');
          const secondLetter = tagNameRes.charAt(1);
          if (secondLetter && secondLetter.toUpperCase() !== secondLetter) {
            tagNameRes =
              tagNameRes.charAt(0).toLowerCase() + tagNameRes.slice(1);
          }
          return match.replace(tagName, tagNameRes);
        },
      );

      const parser = new XMLParser({
        ignoreAttributes: false,
        trimValues: true,
        attributeNamePrefix: '',
        isArray: () => {
          return true;
        },
      });

      const result = linerase(parser.parse(xml));
      if (
        !result.hasOwnProperty('envelope') ||
        !result.envelope.hasOwnProperty('body')
      ) {
        reject(new Error('This method may not be supported for this device'));
      }
      resolve(result.envelope.body);
    } catch (error) {
      reject(error);
    }
  });
};

export const randomString = (length = 16) => {
  const models =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += models.charAt(Math.floor(Math.random() * models.length));
  }
  return result;
};

export const deepLog = (data: any) => {
  console.dir(data, { depth: null, colors: true });
};
