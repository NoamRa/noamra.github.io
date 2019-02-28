export const uploadToGalleryAPI = (
  location.hostname === "localhost" ?
  "https://sgs8pws2o0.execute-api.us-east-1.amazonaws.com/dev/gallery/item" :
  "https://sgs8pws2o0.execute-api.us-east-1.amazonaws.com/prod/gallery/item"
)