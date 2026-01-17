-- CreateTable
CREATE TABLE "MovementStock" (
    "id_movementStock" TEXT NOT NULL,
    "id_store" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_product" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "MovementStock_pkey" PRIMARY KEY ("id_movementStock")
);

-- AddForeignKey
ALTER TABLE "MovementStock" ADD CONSTRAINT "MovementStock_id_store_fkey" FOREIGN KEY ("id_store") REFERENCES "Store"("id_store") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovementStock" ADD CONSTRAINT "MovementStock_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovementStock" ADD CONSTRAINT "MovementStock_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "Product"("id_product") ON DELETE RESTRICT ON UPDATE CASCADE;
