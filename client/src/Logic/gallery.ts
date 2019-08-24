import { getGalleryItemsURL, galleryAssets, galleryThumbs } from "../Conf/api";

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
  id: string | undefined;
  collectionId: string | undefined;
  height: number | undefined;
  width: number | undefined;
  created: string | undefined;
  labels: string[] | undefined;
  exif: FormattedExif | undefined;
  assetLink: string | undefined;
  thumbLink: string | undefined;
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

export const getAllImages = () => {
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
