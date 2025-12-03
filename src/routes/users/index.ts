import { FastifyInstance } from "fastify";



export default function UserRoutes(fastify: FastifyInstance) {
    fastify.get("/", (req, res) => {res.send({message: "true"})} )
    fastify.post("/create", () =>  {})
}