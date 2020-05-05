const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const util = require('util');
const cheerio = require('cherio')

exports.lambdaHandler = async (event, context,callback) => {

    console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));

    const srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey    = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    const dstBucket = srcBucket + "-resized";
    const dstKey    = srcKey.split(".")[0] + ".json";

    try {
      const params = {
          Bucket: srcBucket,
          Key: srcKey
      };
      var origimage = await s3.getObject(params).promise();

    } catch (error) {
        console.log(error);
        return;
    }

    const $ = cheerio.load(origimage.Body.toString('utf-8'));
    const myScript = $(".module--detail script").html();
    let jsonBody = (()=>{
      let body = myScript.toString().split('var __DetailProp__ =')[1].trim();
      body = (new Function("return " + body))();
      console.log(body);
      return JSON.stringify(body);
    })();

    try {
      const destparams = {
          Bucket: dstBucket,
          Key: dstKey,
          Body: jsonBody,
          ContentType: "application/json"
      };

      await s3.putObject(destparams).promise(); 
        
    } catch (error) {
        console.log(error);
        return;
    } 
      
    callback(null,{
      statusCode: 200,
      body: JSON.stringify({
        message: "ok"
      })
    });



};
