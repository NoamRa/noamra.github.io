import { getGalleryItemsURL, galleryAssets, galleryThumbs } from "../Conf/api";
import { number } from "prop-types";

type Exif = {
  ExposureTime: string;
  FNumber: string;
  FocalLengthIn35mmFilm: string;
  ISOSpeedRatings: string;
};

type FormattedExif = {
  "Focal length": string;
  "Shutter speed": string;
  Aperture: string;
  ISO: string;
};

type AssetItem = {
  assetBucket: string;
  assetId: string;
  assetKey: string;
  collectionId: string;
  created: string;
  height: number;
  labels: string[];
  properties: {
    exif: Exif;
  };
  width: number;
};

type DynamoDBResp = {
  Count: number;
  Items: AssetItem[];
  ScannedCount: number;
};

export type LabelReference = {
  [label: string]: string[];
};

export type CollectionIds = {
  [collectionId: string]: number;
};

export type CollectionMetadata = {
  labelRefrences: LabelReference;
  collectionIds: CollectionIds;
};

export type AssetData = {
  id: string;
  collectionId: string;
  height: number;
  width: number;
  created: string;
  labels: string[];
  exif: FormattedExif;
  assetLink: string;
  thumbLink: string;
};

export type GalleryData = {
  assetsData: AssetData[];
  collectionMetadata: CollectionMetadata;
};

const aggragateCollection = (items: AssetItem[]): CollectionMetadata => {
  let collectionIds: CollectionIds = {};
  let labelRefrences: LabelReference = {};
  items.forEach((item: AssetItem) => {
    const { collectionId } = item;
    if (collectionIds.hasOwnProperty(collectionId)) {
      collectionIds[collectionId] += 1;
    } else {
      collectionIds[collectionId] = 1;
    }

    item.labels.forEach(lbl => {
      if (labelRefrences.hasOwnProperty(lbl)) {
        labelRefrences[lbl].push(item.assetId);
      } else {
        labelRefrences[lbl] = [item.assetId];
      }
    });
  });

  return {
    collectionIds,
    labelRefrences
  };
};

const transformAssetData = (assetItem: AssetItem): AssetData => {
  const exif: FormattedExif = {
    "Focal length": assetItem.properties.exif.ExposureTime,
    "Shutter speed": assetItem.properties.exif.ExposureTime,
    Aperture: assetItem.properties.exif.FNumber,
    ISO: assetItem.properties.exif.ISOSpeedRatings
  };

  const assetLink: string = `https://${galleryAssets}/${assetItem.assetKey}`;
  const thumbLink: string = `https://${galleryThumbs}/${assetItem.assetKey}`;

  return {
    id: assetItem.assetId,
    collectionId: assetItem.collectionId,
    height: assetItem.height,
    width: assetItem.width,
    created: assetItem.created,
    labels: assetItem.labels,
    exif,
    assetLink,
    thumbLink
  };
};

export const getAllImages = (): Promise<GalleryData> => {
  const options: object = {
    method: "GET"
  };
  return fetch(getGalleryItemsURL, options)
    .then(response => response.json())
    .then((data: DynamoDBResp) => {
      const collectionMetadata: CollectionMetadata = aggragateCollection(
        data.Items
      );
      const transformedAssetsData: AssetData[] = data.Items.map(
        transformAssetData
      );
      return {
        collectionMetadata: collectionMetadata,
        assetsData: transformedAssetsData
      };
    })
    .catch(err => {
      throw err;
    });
};

const calcThumbDimensions = (width: number, height: number) => {
  const MAX_EDGE = 300;
  const scalingFactor: number = Math.min(MAX_EDGE / width, MAX_EDGE / height);
  const thumbWidth: number = scalingFactor * width;
  const thumbHeight: number = scalingFactor * height;
  return {
    scalingFactor,
    thumbWidth,
    thumbHeight,
    ratio: thumbWidth / thumbHeight
  };
};

type MinMax = { max: number; min: number };
const getRowHeight = (row: AssetData[]): MinMax =>
  row.reduce(
    (acc: MinMax, curr: AssetData) => ({
      max: Math.max(acc.max, curr.height),
      min: Math.min(acc.min, curr.height)
    }),
    { max: 0, min: 0 }
  );

export const calcJustifiedGallery = (
  collectionMeta: AssetData[],
  viewportWidth: number = 1000
) => {
  let rows: AssetData[][] = [];
  let row: AssetData[] = [];
  let currentWidth: number = 0;

  collectionMeta.forEach((asset: AssetData) => {
    let currentPhoto = calcThumbDimensions(asset.width, asset.height);
    row.push(asset);
    currentWidth += Math.round(
      (300 / currentPhoto.thumbHeight) * currentPhoto.thumbWidth
    );
    if (currentWidth >= viewportWidth) {
      rows.push(row);
      row = [];
      currentWidth = 0;
    }
  });
  row.length && rows.push(row); // add last row

  return rows;
};
