"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
exports.Mutation = {
    addUser: (parent, args, { user }, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error("You are not authenticated!");
        }
        else {
            try {
                var hashedPassword = bcrypt.hashSync(args.input.password, Number(10));
                var token = "";
                const user = yield prisma.user.create({
                    data: {
                        username: args.input.username,
                        email: args.input.email,
                        password: hashedPassword,
                    },
                });
                token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "6d" });
                return user;
            }
            catch (error) {
                console.log(error);
                return error;
            }
        }
    }),
    updateUser: (parent, args, { user }, info) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('req is update ', user);
        if (!user) {
            throw new Error("You are not authenticated!");
        }
        else {
            const userId = Number(args.id);
            var hashedPassword = bcrypt.hashSync(args.input.password, Number(10));
            const user = yield prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    username: args.input.username,
                    email: args.input.email,
                    password: hashedPassword,
                }
            });
            return user;
        }
    }),
    deleteUser: (parent, args, { user }, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error("You are not authenticated!");
        }
        else {
            const userId = Number(args.id);
            const user = yield prisma.user.delete({
                where: {
                    id: userId
                }
            });
            return user;
        }
    }),
    login: (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
        var email = args.input.email;
        var password = args.input.password;
        const user = yield prisma.user.findFirst({
            where: { email: email },
        });
        if (user !== null) {
            if ((yield bcrypt.compare(password, user.password)) === true) {
                var token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "6d" });
                return token;
            }
            else {
                return "invalid Password";
            }
        }
        else {
            return "user does no exit";
        }
    }),
};
