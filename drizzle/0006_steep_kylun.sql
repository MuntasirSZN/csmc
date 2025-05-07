ALTER TABLE "questions" ALTER COLUMN "options" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "correct_answer" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "correct_answers" json;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "explanation" text;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "question_type" text DEFAULT 'option' NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "answer_type" text DEFAULT 'single' NOT NULL;