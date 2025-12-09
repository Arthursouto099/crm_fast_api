import { FastifyReply, FastifyRequest, HookHandlerDoneFunction} from "fastify";
import { StatusCodes } from "http-status-codes";
import  { ZodType } from "zod";




export default  function validateSchema(schema: ZodType<any>) {
    return (req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {

        const parse = schema.safeParse(req.body)

        if (!parse.success) {
            const issues = parse.error.issues.map((i) => ({
                path: i.path,
                message: i.message
            }))

           return reply.status(StatusCodes.BAD_REQUEST).send({ issues })
        }

        req.body = parse.data
        done()

    }
}