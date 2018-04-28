var fs = require('fs')
  , gm = require('gm');

gm('./test-in.jpg')
.resize(240, 240)
.noProfile()
.autoOrient()
.write('./test-out.jpg', function (err) {
  if (!err) {
    console.log('done');
  }
  else {
    console.log(err)
  }
});