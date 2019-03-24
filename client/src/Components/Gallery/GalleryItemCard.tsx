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
        href={props.asset.assetLink} 
        target="_blank"
      >
        <img 
          alt={props.asset.thumbLink}
          src={props.asset.thumbLink}
        />
      </a>
    </AssetDisplay>
  )

};

export default GalleryItemCard;