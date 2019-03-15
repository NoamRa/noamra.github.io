const async = require("async");
const AWS = require("aws-sdk");
const gm = require("gm").subClass({ imageMagick: true }); // Enable ImageMagick integration.
const util = require("util");
const uuidv4 = require('uuid/v4');

// constants
const MAX_ASSET_WIDTH = 1920;
const MAX_ASSET_HEIGHT = 1080;
const MAX_THUMB_WIDTH = 300;
const MAX_THUMB_HEIGHT = 300;

const CACHE_MAX_AGE = 365 * 24 * 60 * 60;

const ASSET_BUCKET = "noamr-web-gallery";
const THUMB_BUCKET = "noamr-web-gallery-thumb";
const ITEMS_PREFIX = "items";

// get reference to S3 client 
const s3 = new AWS.S3();

const insertUUIDtoPath = (path) => {
  let splitedPath = path.split(".");
  const extension = splitedPath.pop();
  const pathUpToExtension = splitedPath.join(".");
  return `${pathUpToExtension}-${uuidv4()}.${extension}`;
};
 
exports.handler = function(event, context) {
	// Read options from the event.
  console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
  
  // Object key may have spaces or unicode non-ASCII characters.
  const srcBucket = event.Records[0].s3.bucket.name;
  const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
	const dstKey = `${ITEMS_PREFIX}/${insertUUIDtoPath(srcKey)}`;

	// Infer the image type.
	const typeMatch = srcKey.match(/\.([^.]*)$/);
	if (!typeMatch) {
		console.error(`unable to infer image type for key ${srcKey}`);
		return;
	}
	const imageType = typeMatch[1];
	if (imageType.toLowerCase() !== "jpg" && imageType.toLowerCase() !== "png") {
		console.log(`skipping non-image ${srcKey}`);
		return;
	}

	console.log(
		"Done preperations: \n",
		`Found asset at ${srcBucket}/${srcKey} \n`,
		`About to upload asset to ${ASSET_BUCKET}/${dstKey} \n`,
		`About to upload thumbnail to ${THUMB_BUCKET}/${dstKey}`
		);

	// Download the image from S3, transform, and upload to a different S3 bucket.
	async.waterfall([
		function download(next) {
			// Download the image from S3 into a buffer.
			const s3Location = {
				Bucket: srcBucket,
				Key: srcKey
			};
			s3.getObject(s3Location, next);
		},
		function tranformAsset(response, next) {
			const origBuffer = response.Body;
			const contentType = response.ContentType;
			gm(origBuffer)
			.size(function(err, size) {
				// Infer the scaling factor to avoid stretching the image unnaturally.
				const scalingFactor = Math.min(
					MAX_ASSET_WIDTH / size.width,
					MAX_ASSET_HEIGHT / size.height
				);
				const width = scalingFactor * size.width;
				const height = scalingFactor * size.height;

				// Transform the image buffer in memory.
				this.resize(width, height)
					.toBuffer(imageType, function(err, assetBuffer) {
						if (err) {
							next(err);
						} else {
							next(null, { assetBuffer, contentType });
						}
					});
			});
		},
    function uploadAsset({ assetBuffer, contentType }, next) {
			// Stream the original image to a different S3 bucket.
			const s3Asset = {
				Bucket: ASSET_BUCKET,
				Key: dstKey,
				Body: assetBuffer,
				ContentType: contentType,
				CacheControl: `max-age=${CACHE_MAX_AGE}`,
				ACL: 'public-read',
			};
			console.log("uploadOrig", s3Asset);
			s3.putObject(s3Asset ,next);
		},
	], 
	function (err) {
		let msg;
		if (err) {
			msg = `Unable to resize ${srcBucket}/${srcKey}`,
				`and upload to ${ASSET_BUCKET}/${dstKey}`,
				`due to an error: ${err}`;
		} else {
			msg = `Successfully resized ${srcBucket}/${srcKey}`, 
			`and uploaded to ${ASSET_BUCKET}/${dstKey}`;
		}
	});

	// create thumbnail
	async.waterfall([
		function download(next) {
			// Download the image from S3 into a buffer.
			const s3Location = {
				Bucket: srcBucket,
				Key: srcKey
			};
			s3.getObject(s3Location, next);
		},
		function tranformThumb(response, next) {
			const origBuffer = response.Body;
			const contentType = response.ContentType;
			gm(origBuffer)
			.noProfile()
			.size(function(err, size) {
				// Infer the scaling factor to avoid stretching the image unnaturally.
				const scalingFactor = Math.min(
					MAX_THUMB_WIDTH / size.width,
					MAX_THUMB_HEIGHT / size.height
				);
				const width = scalingFactor * size.width;
				const height = scalingFactor * size.height;

				// Transform the image buffer in memory.
				this.resize(width, height)
					.toBuffer(imageType, function(err, thumbBuffer) {
						if (err) {
							next(err);
						} else {
							next(null, { thumbBuffer, contentType });
						}
					});
			});
		},
		function uploadThumb({ thumbBuffer, contentType }, next) {
			// Stream the transformed image to a different S3 bucket.
			const s3Thumb = {
				Bucket: THUMB_BUCKET,
				Key: dstKey,
				Body: thumbBuffer,
				ContentType: contentType,
				CacheControl: `max-age=${CACHE_MAX_AGE}`,
				ACL: 'public-read',
			};
			console.log("uploadThumb", s3Thumb);
			s3.putObject(s3Thumb, next);
    }
	], 
	function (err) {
		let msg;
		if (err) {
			msg = `Unable to resize ${srcBucket}/${srcKey}`,
				`and upload to ${THUMB_BUCKET}/${dstKey}`,
				`due to an error: ${err}`;
		} else {
			msg = `Successfully resized ${srcBucket}/${srcKey}`, 
			`and uploaded to ${THUMB_BUCKET}/${dstKey}`;
		}

		// context.done(err, msg);
	});
};