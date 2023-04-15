import {Request, Response, NextFunction} from 'express';
import aws from "aws-sdk";
import UploadedSchema from './Schema';

// interface MyArray extends Array<Record<string, any>> {}

interface UploadInterface{
    name: string,
    discription: string,
    price: string,
    currency: string,
    link: string,

}

// CatchAsync
const s3 = new aws.S3();

export const getUploads = (async(req:Request, res:Response, next:NextFunction) => {

try {
  const { name, description, price, currency } = req.body;
  console.log(req.body)
  const uploadedFiles = req.files as Express.Multer.File[];
  const fileUploadPromises = uploadedFiles.map(async (file) => {
    const uploadParams: any = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
    };
    const uploadedObject = await s3.upload(uploadParams).promise();
    return {
      name: file.originalname,
      url: uploadedObject.Location,
      size: (uploadedObject as any).Size,
      mimetype: file.mimetype,
    };
  });
  const uploadedData = await Promise.all(fileUploadPromises);
  const data = await UploadedSchema.create({
    name: name,
    discription: description,
    price: price,
    currency: currency,
    link: uploadedData[0].url,
});
console.log(data)
  res.status(200).json(uploadedData);
} catch (error) {
  console.error(error);
  res.status(500).send("Error uploading files.");
}

});

export const getData = (async(req:Request, res:Response, next:NextFunction) => {

  const data = await UploadedSchema.find()
  res.status(200).json({status:'Success', results: data.length, data: data});
  
});




/*
data {
  ETag: '"50144ec9244526f497c161563f449d25"',
  ServerSideEncryption: 'AES256',
  VersionId: 'E9rLKolNOdTcOvp1RZtk0NiyP8a5ftMT',
  Location: 'https://jeevan-khata-test.s3.amazonaws.com/cbc1.jpeg',
  key: 'cbc1.jpeg',
  Key: 'cbc1.jpeg',
  Bucket: 'jeevan-khata-test'
}
*/