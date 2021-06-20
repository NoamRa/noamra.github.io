import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getAllImages,
  AssetData,
  CollectionMetadata,
  MAX_THUMB_WIDTH,
  GalleryData,
  LabelReference
} from "../../Logic/gallery";
import GridGallery from "react-grid-gallery";
import { Switch, Button } from "antd";
import Tags from "./GalleryTags";

export type LabelAndAmount = { label: string; amount: number };

type GalleryProps = {};

const Gallery: React.FunctionComponent<GalleryProps> = (): JSX.Element => {
  const initGalleryData = (): GalleryData => ({
    assetsData: [],
    collectionMetadata: {
      labelRefrences: {},
      collectionIds: {}
    }
  });

  const [allLabels, setAllLabels] = useState<LabelAndAmount[]>([]);
  const sortLables = (labelRefrences: LabelReference): LabelAndAmount[] => {
    const sorted: LabelAndAmount[] = Object.entries(labelRefrences)
      .map(([label, imageIds]) => ({
        label,
        amount: imageIds.length
      }))
      .sort((a, b) => b.amount - a.amount || a.label.localeCompare(b.label));
    return sorted;
  };

  const checkIncluded = (
    asset: AssetData,
    includedLabels: Set<string>
  ): boolean => asset.labels!.some(label => includedLabels.has(label));

  const [{ assetsData, collectionMetadata }, setImages] = useState<GalleryData>(
    initGalleryData()
  );
  const [lightboxEnabled, setLightboxEnabled] = useState<boolean>(true);
  const [includedLabels, setIncludedLabels] = useState<Set<string>>(
    new Set([])
  );

  const clearLables = () => {
    setIncludedLabels(new Set(allLabels.map(({ label }) => label)));
  };

  const includeAllLabels = () => {
    setIncludedLabels(new Set([]));
  };

  const toggleLable = (shouldRemove: boolean, label: string): void => {
    const updatedLabels = new Set(includedLabels);
    if (shouldRemove) {
      updatedLabels.add(label);
    } else {
      updatedLabels.delete(label);
    }
    setIncludedLabels(updatedLabels);
  };

  const fetchImages = async (): Promise<void> => {
    const galleryData = await getAllImages();

    const allLabels = sortLables(galleryData.collectionMetadata.labelRefrences);
    const includedLabels = new Set(allLabels.map(({ label }) => label));
    setAllLabels(allLabels);
    setIncludedLabels(includedLabels);
    setImages(galleryData);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <>
      <h4>Gallery</h4>
      <div>
        <div>Labels by AWS Rekognition, sorted by quantity</div>
        <div>
          <Button
            type="primary"
            onClick={includedLabels.size === 0 ? clearLables : includeAllLabels}
          >
            {includedLabels.size === 0 ? "use all labels" : "clear all labels"}
          </Button>
        </div>
      </div>
      <div>
        <Tags
          allTags={allLabels}
          includedTags={includedLabels}
          toggleTag={toggleLable}
        />
      </div>
      <div>
        <Switch checked={lightboxEnabled} onChange={setLightboxEnabled} /> show
        images with lightbox
      </div>
      <GridGallery
        images={assetsData.filter(assetData =>
          checkIncluded(assetData, includedLabels)
        )}
        enableImageSelection={false}
        rowHeight={MAX_THUMB_WIDTH}
        enableLightbox={lightboxEnabled}
      />
    </>
  );
};

export default Gallery;
