import { FastifyReply, FastifyRequest } from "fastify";



export interface IUserController {
    create: (req: FastifyRequest, reply: FastifyReply) => Promise<void>
}