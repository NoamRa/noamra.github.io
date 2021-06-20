export const getGalleryItemsURL: string = (
  window.location.hostname === "localhost" ?
  "https://ld7cjn7mag.execute-api.us-east-1.amazonaws.com/dev/gallery" :
  "https://ld7cjn7mag.execute-api.us-east-1.amazonaws.com/prod/gallery"
);

export const galleryAssets: string = "dcz2v9kr60o99.cloudfront.net";
export const galleryThumbs: string = "d3m52nf35y4xqo.cloudfront.net";