import { FastifyInstance } from "fastify";
import UserRoutes from "./users";

export default function RootRouter(fastify: FastifyInstance) {
    fastify.register(UserRoutes, {prefix: "/user"})
}