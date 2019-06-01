import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GalleryItemCard from "./GalleryItemCard";
import {
  getAllImages,
  AssetData,
  CollectionMetadata,
  GalleryData,
  calcJustifiedGallery
} from "../../Logic/gallery";

type GalleryProps = {};

const AssetWapper = styled.section`
  display: flex;
  flex-wrap: wrap;
`;

const Row = styled.section`
  display: flex;
`;

const Gallery: React.FC<GalleryProps> = (): JSX.Element => {
  const initState = () => ({
    assetsData: [],
    collectionMetadata: {
      labelRefrences: {},
      collectionIds: {}
    }
  });

  const [{ assetsData, collectionMetadata }, setImages] = useState<GalleryData>(
    initState()
  );
  const fetchImages = async () => {
    const assetsData = await getAllImages();
    setImages(assetsData);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <React.Fragment>
      <h4>Gallery</h4>
      {calcJustifiedGallery(assetsData).map((row: AssetData[], idx: number) => (
        <div key={idx} style={{ display: "flex", flexDirection: "row" }}>
          {row.map((asset: AssetData) => (
            <span key={asset.id}>
              <GalleryItemCard asset={asset} />
            </span>
          ))}
        </div>
      ))}
    </React.Fragment>
  );
};

export default Gallery;
