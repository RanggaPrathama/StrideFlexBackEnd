-- CreateTable
CREATE TABLE `brand` (
    `id_brand` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_brand` VARCHAR(45) NOT NULL,
    `gambar_brand` VARCHAR(100) NOT NULL,
    `url_gambar` VARCHAR(300) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_brand`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart` (
    `id_cart` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id_user` INTEGER NOT NULL,
    `stok_id_stok` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `status` TINYINT NOT NULL DEFAULT 1,

    INDEX `user_cart_idx`(`user_id_user`),
    INDEX `stok_cart_idx`(`stok_id_stok`),
    PRIMARY KEY (`id_cart`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategori_sepatu` (
    `idkategori_sepatu` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kategori` VARCHAR(45) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`idkategori_sepatu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ukuran` (
    `id_ukuran` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_ukuran` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_ukuran`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_sepatu` (
    `idDetail_sepatu` INTEGER NOT NULL AUTO_INCREMENT,
    `sepatu_id_sepatu` INTEGER NOT NULL,
    `harga_sepatu` INTEGER NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `Timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `warna` VARCHAR(100) NOT NULL,

    INDEX `fk_detail_sepatu_idx`(`sepatu_id_sepatu`),
    PRIMARY KEY (`idDetail_sepatu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_user` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `gambar_profile` VARCHAR(100) NULL DEFAULT '',
    `urlProfile` VARCHAR(300) NULL DEFAULT '',
    `phoneNumber` VARCHAR(191) NULL,
    `refresh_token` VARCHAR(191) NULL DEFAULT '',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `role` TINYINT NOT NULL DEFAULT 1,
    `statusAktif` TINYINT NOT NULL DEFAULT 1,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sepatu_version` (
    `id_sepatu` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_sepatu` VARCHAR(45) NOT NULL,
    `brand_id_brand` INTEGER NOT NULL,
    `kategori_id_kategori` INTEGER NOT NULL,
    `jenis_kelamin` TINYINT NOT NULL,
    `deskripsi_sepatu` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fk_sepatu_Brand_idx`(`brand_id_brand`),
    INDEX `fk_sepatu_kategori_idx`(`kategori_id_kategori`),
    PRIMARY KEY (`id_sepatu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alamat_user` (
    `id_alamat` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id_user` INTEGER NOT NULL,
    `alamat` TEXT NULL,
    `status` TINYINT NOT NULL DEFAULT 0,

    INDEX `fk_User_address_idx`(`user_id_user`),
    PRIMARY KEY (`id_alamat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sepatu_gambar` (
    `idsepatu_gambar` INTEGER NOT NULL AUTO_INCREMENT,
    `gambar_sepatu` VARCHAR(100) NOT NULL,
    `url_gambar` VARCHAR(300) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `detail_sepatu_idDetail_sepatu` INTEGER NOT NULL,

    INDEX `fk_sepatu_gambar_detail_sepatu1_idx`(`detail_sepatu_idDetail_sepatu`),
    PRIMARY KEY (`idsepatu_gambar`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stok` (
    `id_stok` INTEGER NOT NULL AUTO_INCREMENT,
    `stock` INTEGER NOT NULL,
    `ukuran_id_ukuran` INTEGER NOT NULL,
    `detail_sepatu_idDetail_sepatu` INTEGER NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,

    INDEX `fk_stok_detail_sepatu1_idx`(`detail_sepatu_idDetail_sepatu`),
    INDEX `fk_stok_ukuran_idx`(`ukuran_id_ukuran`),
    PRIMARY KEY (`id_stok`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pemesanan` (
    `id_pemesanan` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id_user` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `total_nilai` INTEGER NOT NULL,

    INDEX `pemesanan_user_idx`(`user_id_user`),
    PRIMARY KEY (`id_pemesanan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_pemesanan` (
    `idDetail_pemesanan` INTEGER NOT NULL AUTO_INCREMENT,
    `pemesanan_id_pemesanan` INTEGER NOT NULL,
    `stok_id_stok` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `harga_sepatu` INTEGER NOT NULL,
    `subtotal` INTEGER NOT NULL,

    INDEX `pemesanan_detail_idx`(`pemesanan_id_pemesanan`),
    INDEX `detail_stok_idx`(`stok_id_stok`),
    PRIMARY KEY (`idDetail_pemesanan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id_payment` INTEGER NOT NULL AUTO_INCREMENT,
    `atas_nama` VARCHAR(100) NOT NULL,
    `no_rekening` INTEGER NOT NULL,
    `nama_bank` VARCHAR(100) NOT NULL,
    `gambar_bank` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_payment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jenis_ongkir` (
    `id_ongkir` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_ongkir` VARCHAR(100) NOT NULL,
    `harga_ongkir` INTEGER NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id_ongkir`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pembayaran` (
    `id_pembayaran` INTEGER NOT NULL AUTO_INCREMENT,
    `payment_id_payment` INTEGER NOT NULL,
    `ongkir_id_ongkir` INTEGER NOT NULL,
    `pemesanan_id_pemesanan` INTEGER NOT NULL,
    `total_pembayaran` INTEGER NOT NULL,
    `bukti_pembayaran` VARCHAR(255) NULL,
    `status` TINYINT NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `pembayaran_payment_idx`(`payment_id_payment`),
    INDEX `pembayaran_ongkir_idx`(`ongkir_id_ongkir`),
    INDEX `pemesanan_pembayaran_idx`(`pemesanan_id_pemesanan`),
    PRIMARY KEY (`id_pembayaran`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favorite` (
    `id_favorit` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id_user` INTEGER NOT NULL,
    `detail_sepatu_idDetail_sepatu` INTEGER NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `fk_favorite_detail_sepatu`(`detail_sepatu_idDetail_sepatu`),
    INDEX `fk_user_favorite_`(`user_id_user`),
    PRIMARY KEY (`id_favorit`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `fk_user_cart` FOREIGN KEY (`user_id_user`) REFERENCES `user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `fk_stok_cart` FOREIGN KEY (`stok_id_stok`) REFERENCES `stok`(`id_stok`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_sepatu` ADD CONSTRAINT `fk_detail_sepatu` FOREIGN KEY (`sepatu_id_sepatu`) REFERENCES `sepatu_version`(`id_sepatu`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sepatu_version` ADD CONSTRAINT `fk_sepatu_Brand` FOREIGN KEY (`brand_id_brand`) REFERENCES `brand`(`id_brand`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sepatu_version` ADD CONSTRAINT `fk_sepatu_Kategori` FOREIGN KEY (`kategori_id_kategori`) REFERENCES `kategori_sepatu`(`idkategori_sepatu`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alamat_user` ADD CONSTRAINT `fk_User_address` FOREIGN KEY (`user_id_user`) REFERENCES `user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sepatu_gambar` ADD CONSTRAINT `fk_sepatu_gambar_detail_sepatu1` FOREIGN KEY (`detail_sepatu_idDetail_sepatu`) REFERENCES `detail_sepatu`(`idDetail_sepatu`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stok` ADD CONSTRAINT `fk_stok_detail_sepatu1` FOREIGN KEY (`detail_sepatu_idDetail_sepatu`) REFERENCES `detail_sepatu`(`idDetail_sepatu`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stok` ADD CONSTRAINT `fk_stok_ukuran` FOREIGN KEY (`ukuran_id_ukuran`) REFERENCES `ukuran`(`id_ukuran`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pemesanan` ADD CONSTRAINT `pemesanan_user_fk` FOREIGN KEY (`user_id_user`) REFERENCES `user`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_pemesanan` ADD CONSTRAINT `detail_stok_fk` FOREIGN KEY (`stok_id_stok`) REFERENCES `stok`(`id_stok`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_pemesanan` ADD CONSTRAINT `pemesanan_detail_fk` FOREIGN KEY (`pemesanan_id_pemesanan`) REFERENCES `pemesanan`(`id_pemesanan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_pemesanan_fk` FOREIGN KEY (`pemesanan_id_pemesanan`) REFERENCES `pemesanan`(`id_pemesanan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_ongkir_fk` FOREIGN KEY (`ongkir_id_ongkir`) REFERENCES `jenis_ongkir`(`id_ongkir`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_payment_fk` FOREIGN KEY (`payment_id_payment`) REFERENCES `payments`(`id_payment`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `fk_user_favorite` FOREIGN KEY (`user_id_user`) REFERENCES `user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `fk_favorite_detail_sepatu1` FOREIGN KEY (`detail_sepatu_idDetail_sepatu`) REFERENCES `detail_sepatu`(`idDetail_sepatu`) ON DELETE CASCADE ON UPDATE CASCADE;
