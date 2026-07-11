ALTER TABLE plan
    DROP COLUMN IF EXISTS insufficient_funds_strategy;

ALTER TABLE plan_template
    DROP COLUMN IF EXISTS insufficient_funds_strategy;

DROP TYPE IF EXISTS insufficient_funds_strategy;
