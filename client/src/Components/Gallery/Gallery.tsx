import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GalleryItemCard from "./GalleryItemCard";
import { getAllImages, AssetData, CollectionMetadata } from "../../Logic/gallery";
import Gallery from "react-photo-gallery";


type GalleryProps = {};

type GalleryState = { 
  assetsData: AssetData[], 
  collectionMetadata: CollectionMetadata, 
};

const AssetWapper = styled.section`
  display: flex;
  flex-wrap: wrap;
`;

const GalleryContainer: React.FC<GalleryProps> = (): JSX.Element => {
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

  const photos = assetsData.map((asset: AssetData) => ({
    src: asset.thumbLink as string,
    width: asset.width as number,
    height: asset.height as number,
  }));

  return (
    <React.Fragment>
      <h4>Gallery</h4>
      <Gallery 
        photos={photos}
        columns={10}
      />
    </React.Fragment>
  );
};

export default GalleryContainer;