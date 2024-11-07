import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string
    }
});

export async function AwsUploadService(file:Buffer,key:string){
    const fileBuffer = file;
    
    try{
        if(file){
            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key,
                Body: fileBuffer,
                ContentType: "image/png"
            }

            const command = new PutObjectCommand(params);
            await s3Client.send(command);
        }

        return true;
    }
    catch(e){
        console.error("This is error: ", e);
        return false
    }
}