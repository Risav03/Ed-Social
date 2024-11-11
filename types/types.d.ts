import { Document } from 'mongoose';

type UserDocument = {
    email: string;
    pwd: string;
    salt: string;
    username: string;
    userhandle: number;
    role: 'USER' | 'ADMIN';
    createdAt: Date;
    updatedAt: Date;
  }


type UserType = {
    _id:string;
    username: string;
    userhandle:string;
    email:string;
    pwd:string;
    salt:string;
    profileImage:string;
    website:string;
    banner:string;
    bio:string;
    followers:number;
    following:number;
    searchHistory:Array<string>;
    role:string;
    createdAt:Date;
    updatedAt:Date;
}

type PostType = {
    _id:string;
    createdBy:ObjectId;
    content:string;
    media:string;
    likes:number;
    comments:number;
    createdAt:Date;
    updatedAt:Date;
}