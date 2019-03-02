import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GalleryItemCard from "./GalleryItemCard";
import { getAllImages, AssetData, initAssetData } from "../../Logic/gallery";

type GalleryProps = {
  assetsData?: AssetData[]
}

const AssetWapper = styled.section`
  display: flex;
  flex-wrap: wrap;
`;

const Gallery: React.FunctionComponent<GalleryProps> = (): JSX.Element => {

  const [ assetsData, setImages ] = useState<AssetData[]>([initAssetData()]);
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
  )

};

export default Gallery;