import { getGalleryItemsURL, galleryAssets, galleryThumbs } from "../Conf/api";

export const MAX_THUMB_WIDTH = 300;
const MAX_THUMB_HEIGHT = MAX_THUMB_WIDTH;

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

export type GalleryData = {
  assetsData: AssetData[];
  collectionMetadata: CollectionMetadata;
};

export type AssetData = {
  id: string | undefined;
  collectionId: string | undefined;
  height: number | undefined;
  width: number | undefined;
  created: string | undefined;
  labels: string[] | undefined;
  exif: FormattedExif | undefined;
  src: string | undefined;
  thumbnail: string | undefined;
  thumbnailWidth: number | undefined;
  thumbnailHeight: number | undefined;
};

export type Dimentions = {
  width: number;
  height: number;
};

const calcThumbDimentions = (size: Dimentions): Dimentions => {
  const scalingFactor: number = Math.min(
    MAX_THUMB_WIDTH / size.width,
    MAX_THUMB_HEIGHT / size.height
  );
  const width = scalingFactor * size.width;
  const height = scalingFactor * size.height;

  return { width, height };
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

  const src: string = `https://${galleryAssets}/${assetItem.assetKey}`;
  const thumbnail: string = `https://${galleryThumbs}/${assetItem.assetKey}`;
  const {
    width: thumbnailWidth,
    height: thumbnailHeight
  } = calcThumbDimentions(assetItem);

  return {
    id: assetItem.assetId,
    collectionId: assetItem.collectionId,
    height: assetItem.height,
    width: assetItem.width,
    created: assetItem.created,
    labels: assetItem.labels,
    exif,
    src,
    thumbnail,
    thumbnailWidth,
    thumbnailHeight
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
