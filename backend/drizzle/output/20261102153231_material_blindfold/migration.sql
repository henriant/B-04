CREATE TABLE `account` (
	`id` text PRIMARY KEY,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL UNIQUE,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	CONSTRAINT `fk_session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `library` ADD `user_id` text NOT NULL REFERENCES user(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `user` ADD `email_verified` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `image` text;--> statement-breakpoint
ALTER TABLE `user` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `updated_at` integer NOT NULL;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_library` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`user_id` text NOT NULL UNIQUE,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL,
	CONSTRAINT `fk_library_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_library`(`id`, `createdAt`) SELECT `id`, `createdAt` FROM `library`;--> statement-breakpoint
DROP TABLE `library`;--> statement-breakpoint
ALTER TABLE `__new_library` RENAME TO `library`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`role` text DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`(`id`, `name`, `email`, `role`) SELECT `id`, `name`, `email`, `role` FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_game` (
	`id` integer PRIMARY KEY,
	`name` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_game`(`id`, `name`) SELECT `id`, `name` FROM `game`;--> statement-breakpoint
DROP TABLE `game`;--> statement-breakpoint
ALTER TABLE `__new_game` RENAME TO `game`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_library_game` (
	`library_id` integer NOT NULL,
	`game_id` integer NOT NULL,
	`status` text DEFAULT 'planned' NOT NULL,
	`addedAt` text DEFAULT (current_timestamp) NOT NULL,
	`playtime` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `library_game_pk` PRIMARY KEY(`library_id`, `game_id`),
	CONSTRAINT `fk_library_game_library_id_library_id_fk` FOREIGN KEY (`library_id`) REFERENCES `library`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_library_game_game_id_game_id_fk` FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON DELETE CASCADE,
	CONSTRAINT "status_check" CHECK("status" IN ('planned', 'playing', 'completed'))
);
--> statement-breakpoint
INSERT INTO `__new_library_game`(`library_id`, `game_id`, `status`, `addedAt`, `playtime`) SELECT `library_id`, `game_id`, `status`, `addedAt`, `playtime` FROM `library_game`;--> statement-breakpoint
DROP TABLE `library_game`;--> statement-breakpoint
ALTER TABLE `__new_library_game` RENAME TO `library_game`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);