CREATE TABLE `daily_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`totalMessages` int DEFAULT 0,
	`totalResponses` int DEFAULT 0,
	`avgResponseTime` decimal(10,2) DEFAULT '0',
	`escalations` int DEFAULT 0,
	`resolutions` int DEFAULT 0,
	`avgSatisfaction` decimal(3,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `daily_stats_id` PRIMARY KEY(`id`),
	CONSTRAINT `daily_stats_date_unique` UNIQUE(`date`)
);
--> statement-breakpoint
CREATE TABLE `whatsapp_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`metricType` enum('message_received','response_sent','response_time','escalation','resolution') NOT NULL,
	`urgency` enum('low','medium','high','critical'),
	`requiresReview` int DEFAULT 0,
	`responseTime` int,
	`satisfaction` int,
	`notes` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `whatsapp_metrics_id` PRIMARY KEY(`id`)
);
