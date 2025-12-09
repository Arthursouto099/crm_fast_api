import { Prisma } from "../../generated/client";
import { SafeUser } from "../types/types";
import { PaginationArgs } from "../utils/pagination";

export interface IUserServices {
    create: (data: Prisma.UserCreateInput) => Promise<SafeUser>
    findAll: (pag: PaginationArgs) => Promise<Array<SafeUser>>
}

