import React from 'react';
import styled from "styled-components";
// import { Card } from 'antd';
import { AssetData } from "../../Logic/gallery";

const AssetDisplay = styled.section`
  margin: 1em;
`;

type GalleryItemCard = {
  asset: AssetData,
}

const GalleryItemCard = (props: GalleryItemCard): JSX.Element => {
  return (
    <AssetDisplay>
      <a 
        href={props.asset.src} 
        target="_blank"
        rel="noopener noreferrer"
      >
        <img 
          alt={props.asset.thumbnail}
          src={props.asset.thumbnail}
        />
      </a>
    </AssetDisplay>
  )

};

export default GalleryItemCard;