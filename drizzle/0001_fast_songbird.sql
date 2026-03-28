CREATE TABLE `ai_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` int NOT NULL,
	`classification` varchar(100),
	`confidence` int,
	`generatedResponse` text,
	`sentResponse` text,
	`status` enum('pending','sent','approved','rejected') NOT NULL DEFAULT 'pending',
	`feedback` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ai_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `whatsapp_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`citizenName` text,
	`department` varchar(100),
	`status` enum('active','resolved','pending','escalated') NOT NULL DEFAULT 'active',
	`protocolId` varchar(20),
	`lastMessageAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `whatsapp_conversations_id` PRIMARY KEY(`id`),
	CONSTRAINT `whatsapp_conversations_phoneNumber_unique` UNIQUE(`phoneNumber`)
);
--> statement-breakpoint
CREATE TABLE `whatsapp_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`sender` enum('citizen','ai','agent') NOT NULL,
	`content` text NOT NULL,
	`messageType` enum('text','image','document','audio','video') NOT NULL DEFAULT 'text',
	`whatsappMessageId` varchar(100),
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `whatsapp_messages_id` PRIMARY KEY(`id`)
);
