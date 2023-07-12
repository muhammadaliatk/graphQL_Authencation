import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


exports.Query = {
    userList: async (parent: any,  args : any, context: any, info: any) => {
        let users = await prisma.user.findMany();
        return users;
    },
    getUser: async (parent:any,args:any,context:any,info:any)=>{
        const userId = Number(args.id);
        const user = await prisma.user.findUnique({
            where : {id:userId}
        })
        return user;
    }
    }