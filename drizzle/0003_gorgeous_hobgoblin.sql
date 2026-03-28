CREATE TABLE `message_sentiments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` int NOT NULL,
	`conversationId` int NOT NULL,
	`sentiment` enum('positive','neutral','negative') NOT NULL,
	`confidence` decimal(3,2) NOT NULL,
	`score` decimal(4,3) NOT NULL,
	`emotions` text,
	`keywords` text,
	`summary` text,
	`requiresReview` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `message_sentiments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `negative_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` int NOT NULL,
	`conversationId` int NOT NULL,
	`sentiment` enum('negative') NOT NULL,
	`confidence` decimal(3,2) NOT NULL,
	`message` text,
	`status` enum('pending','reviewed','resolved') DEFAULT 'pending',
	`assignedTo` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`resolvedAt` timestamp,
	CONSTRAINT `negative_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sentiment_summary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`totalMessages` int DEFAULT 0,
	`positiveCount` int DEFAULT 0,
	`neutralCount` int DEFAULT 0,
	`negativeCount` int DEFAULT 0,
	`avgSentimentScore` decimal(4,3) DEFAULT '0',
	`satisfactionRate` decimal(5,2) DEFAULT '0',
	`topEmotions` text,
	`topKeywords` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sentiment_summary_id` PRIMARY KEY(`id`),
	CONSTRAINT `sentiment_summary_date_unique` UNIQUE(`date`)
);
