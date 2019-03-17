import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GalleryItemCard from "./GalleryItemCard";
import { getAllImages, AssetData, CollectionAggregation } from "../../Logic/gallery";

type GalleryProps = {
  // assetsData?: AssetData[]
}

type GalleryState = { 
  assetsData: AssetData[], 
  collectionStats: CollectionAggregation 
}

const AssetWapper = styled.section`
  display: flex;
  flex-wrap: wrap;
`;

const Gallery: React.FunctionComponent<GalleryProps> = (): JSX.Element => {
  const initState = () => ({
    assetsData: [],
    collectionStats: {},
  });

  const [ { assetsData, collectionStats }, setImages ] = useState<GalleryState>(initState());
  const fetchImages = async () => {
    const assetsData = await getAllImages();
    setImages(assetsData);
  };

  useEffect(() => { fetchImages() }, []);

  return (
    <React.Fragment>
      Gallery
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