export const getGalleryItemsURL: string = (
  location.hostname === "localhost" ?
  "https://ld7cjn7mag.execute-api.us-east-1.amazonaws.com/dev/gallery/" :
  "https://ld7cjn7mag.execute-api.us-east-1.amazonaws.com/prod/gallery/"
)