import { PrismaClient } from '@prisma/client'
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const prisma = new PrismaClient()
exports.Mutation = {
  addUser: async (parent: any, args: any, {user}:any, info: any) => {
    if (!user) {
      throw new Error("You are not authenticated!");
    }else{
      try {
        var hashedPassword = bcrypt.hashSync(args.input.password, Number(10));
        var token = "";
        const user = await prisma.user.create({
          data: {
            username: args.input.username,
            email: args.input.email,
            password: hashedPassword,
          },
        });
        token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "6d" });
        return user;
      } catch (error) {
        console.log(error);
        return error
      }
    }
     
  },
  updateUser: async (parent: any, args: any,{user}:any, info: any) => {
    console.log('req is update ',user);
    if (!user) {
      throw new Error("You are not authenticated!");
    }else{
    const userId = Number(args.id);
    var hashedPassword = bcrypt.hashSync(args.input.password, Number(10));
    const user = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        username: args.input.username,
        email: args.input.email,
        password: hashedPassword,
      }
    })
    return user;
  }
  },
  deleteUser: async (parent: any, args: any, {user}:any, info: any) => {
    if (!user) {
      throw new Error("You are not authenticated!");
    }else{
    const userId = Number(args.id);
    const user = await prisma.user.delete({
      where: {
        id: userId
      }
    })
    return user;
  }
  },
  login: async (parent: any, args: any, context: any, info: any) => {
    var email = args.input.email;
    var password = args.input.password;
    const user: any = await prisma.user.findFirst({
      where: { email: email },
    });
    if (user !== null) {
      if ((await bcrypt.compare(password, user.password)) === true) {
        var token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "6d" });
        return token;
      } else {
        return "invalid Password";
      }
    } else {
      return "user does no exit";
    }
  },
};
