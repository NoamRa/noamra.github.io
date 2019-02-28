import { getGalleryItemsURL } from "../Conf/api";
import { parseString as parseXML, convertableToString } from "xml2js";

const constructUrlFromS3 = (bucket: string, key: string): string => (
  `https://s3.amazonaws.com/${bucket}/${key}`
)

export const getAllImages = () => {
  const options: object = {
    method: "GET",
  }
  return fetch(getGalleryItemsURL, options)
  .then(response => response.text())
  .then((imageListXML: string) => {
    let out: any;
    parseXML(imageListXML, (err, res) => { out = res })
    return out;
  })
  .then(parsedBucketData => {
    const bucket: string = parsedBucketData.ListBucketResult.Name;
    return parsedBucketData.ListBucketResult.Contents.map((image: {[Key: string]: string[]}): string => (
      constructUrlFromS3(bucket, image.Key[0])
    ))
  })
};

