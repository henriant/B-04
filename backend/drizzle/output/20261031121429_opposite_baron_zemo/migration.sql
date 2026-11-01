CREATE TABLE `game` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `library` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `library_game` (
	`library_id` integer NOT NULL,
	`game_id` integer NOT NULL,
	`status` text DEFAULT 'planned' NOT NULL,
	`addedAt` text DEFAULT (current_timestamp) NOT NULL,
	`playtime` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `library_game_pk` PRIMARY KEY(`library_id`, `game_id`),
	CONSTRAINT `fk_library_game_library_id_library_id_fk` FOREIGN KEY (`library_id`) REFERENCES `library`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_library_game_game_id_game_id_fk` FOREIGN KEY (`game_id`) REFERENCES `game`(`id`) ON DELETE CASCADE,
	CONSTRAINT "status_check" CHECK("status" IN ('planned', 'playing', 'finished'))
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`library_id` integer,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	CONSTRAINT `fk_user_library_id_library_id_fk` FOREIGN KEY (`library_id`) REFERENCES `library`(`id`)
);
