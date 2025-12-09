import { FastifyBaseLogger, FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { PrismaClient, User } from "../../generated/client";


export type FastifyInstanceTyped = FastifyInstance<
RawServerDefault,
RawRequestDefaultExpression,
RawReplyDefaultExpression,
FastifyBaseLogger,
ZodTypeProvider
> & {
    db: PrismaClient
}

export type SafeUser = Omit<User, 'password'>