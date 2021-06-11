import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GalleryItemCard from "./GalleryItemCard";
import { getAllImages, AssetData, CollectionMetadata } from "../../Logic/gallery";

type GalleryProps = {};

type GalleryState = { 
  assetsData: AssetData[], 
  collectionMetadata: CollectionMetadata, 
};

const AssetWapper = styled.section`
  display: flex;
  flex-wrap: wrap;
`;

const Gallery: React.FunctionComponent<GalleryProps> = (): JSX.Element => {
  const initState = () => ({
    assetsData: [],
    collectionMetadata: {
      labelRefrences: {},
      collectionIds: {},
    },
  });

  const [ { assetsData, collectionMetadata }, setImages ] = useState<GalleryState>(initState());
  const fetchImages = async () => {
    const assetsData = await getAllImages();
    setImages(assetsData);
  };

  useEffect(() => { fetchImages() }, []);

  return (
    <React.Fragment>
      <h4>Gallery</h4>
      <AssetWapper>
        {
          assetsData.map((asset: AssetData) => (
            <div
              key={asset.id || "init"}
            >
              <GalleryItemCard asset={asset} />
            </div>
          ))
        }
      </AssetWapper>
    </React.Fragment>
  );
};

export default Gallery;