import { getGalleryItemsURL } from "../Conf/api";
import { parseString as parseXML, convertableToString } from "xml2js";

export type AssetData = {
  id: string | undefined, // uuid
  assetLink: string | undefined,
  thumbLink: string | undefined,
};

export const initAssetData = (): AssetData => ({
  id: undefined,
  assetLink: undefined,
  thumbLink: undefined,
});

const allowedExtensions = [
  "jpg", "jpeg", "png",
];

const validatUrlToAsset = (assetUrl: string): boolean => {
  const extension: string | undefined = assetUrl.split(".").pop();
  return allowedExtensions.includes(extension || "");
};

const S3Prefix = "https://s3.amazonaws.com/"

const constructUrlFromS3 = (bucket: string, key: string): string => (
  `${S3Prefix}${bucket}/${key}`
);

const createAssetDataList = (assetLinks: string[]) => (
  assetLinks.map((assetLink: string) => {
    const bucket = assetLink.split("https://s3.amazonaws.com/")[1].split("/")[0];
    const id = /((\w{4,12}-?)){5}/.exec(assetLink)![0] || assetLink;
    return {
      id,
      assetLink,
      thumbLink: assetLink.replace(bucket, `${bucket}-thumb`),
    };
  }
));

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
  .then((imageList: string[]): string[] => imageList.filter(validatUrlToAsset))
  .then((filteredImageList: string[]): AssetData[] => (createAssetDataList(filteredImageList)))
};

