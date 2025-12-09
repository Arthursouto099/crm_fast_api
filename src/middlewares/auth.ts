import {  FastifyReply, FastifyRequest} from "fastify";
import jwt from "jsonwebtoken";
import { Payload } from "../@token-configs/token";
import { StatusCodes } from "http-status-codes";



export default async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
    try {
        const auth = req.headers.authorization
        if (!auth) {return reply.status(StatusCodes.UNAUTHORIZED).send({warning: "Token não fornecido"})}

        const [_, token] = auth.split(" ")
        if (!token) {return reply.status(StatusCodes.UNAUTHORIZED).send({warning: "Token inválido"})}

        const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "default_key") as Payload
        if (!decoded) {return reply.status(StatusCodes.UNAUTHORIZED).send({warning: "Token inválido"}) }

        req.signUser = decoded
        
    }
    catch (err: any) {
        reply.status(StatusCodes.UNAUTHORIZED).send({ error: "Não autorizado", message: err.message });
    }



}