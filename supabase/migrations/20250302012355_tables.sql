-- ================================================
-- COMPLETE FINANCIAL PLANNING SCHEMA
-- Supersedes the original partial brokerages-schema migration.
-- Designed to apply cleanly on a fresh Supabase instance.
-- ================================================

-- ================================================
-- 1) PROFILES TABLE (extends auth.users)
-- ================================================
CREATE TABLE profiles (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name      TEXT,
    last_name       TEXT,
    birthday        DATE,
    life_expectancy INTEGER,
    is_admin        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    edited_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id)
);

-- ================================================
-- 2) ENUMERATIONS
-- ================================================

CREATE TYPE frequency AS ENUM (
    'monthly',
    'weekly',
    'biweekly',
    'quarterly',
    'annual',
    'one_time'
);

CREATE TYPE contribution_strategy AS ENUM (
    'fixed',
    'percentage_of_income',
    'max'
);

CREATE TYPE cash_reserve_strategy AS ENUM (
    'fixed',
    'variable'
);

CREATE TYPE debt_payment_strategy AS ENUM (
    'fixed',
    'minimum_payment',
    'maximum_payment',
    'percentage_of_debt'
);

CREATE TYPE expense_type AS ENUM (
    'fixed',
    'variable'
);

CREATE TYPE income_type AS ENUM (
    'ordinary'
);

CREATE TYPE ira_contribution_strategy AS ENUM (
    'fixed',
    'percentage_of_income',
    'max'
);

CREATE TYPE roth_ira_contribution_strategy AS ENUM (
    'fixed',
    'percentage_of_income',
    'max'
);

CREATE TYPE employer_contribution_strategy AS ENUM (
    'none',
    'percentage_of_contribution',
    'percentage_of_compensation',
    'fixed'
);

CREATE TYPE tax_deferred_contribution_strategy AS ENUM (
    'none',
    'until_company_match',
    'percentage_of_income',
    'fixed',
    'max'
);

CREATE TYPE insufficient_funds_strategy AS ENUM (
    'none',
    'minimum_only',
    'full'
);

CREATE TYPE growth_application_strategy AS ENUM (
    'start',
    'end'
);

CREATE TYPE retirement_strategy AS ENUM (
    'debt_free',
    'age',
    'percent_rule',
    'target_savings'
);

CREATE TYPE income_tax_strategy AS ENUM (
    'simple'
);

CREATE TYPE command_sequence_ordering_type AS ENUM (
    'predefined',
    'custom'
);

-- Discriminated type for command polymorphic references
CREATE TYPE command_item_type AS ENUM (
    'brokerage',
    'brokerage_template',
    'cash_reserve',
    'cash_reserve_template',
    'debt',
    'debt_template',
    'expense',
    'expense_template',
    'hsa',
    'hsa_template',
    'income',
    'income_template',
    'ira',
    'ira_template',
    'roth_ira',
    'roth_ira_template',
    'tax_deferred',
    'tax_deferred_template',
    'plan',
    'plan_template'
);

-- ================================================
-- 3) FINANCIAL ITEM TABLES
--    All include audit columns referencing auth.users.
--    income_id for IRA/RothIRA/TaxDeferred lives on the
--    junction table (plan-specific), NOT here.
-- ================================================

CREATE TABLE income (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name         TEXT        NOT NULL,
    gross_income NUMERIC     NOT NULL,
    growth_rate  NUMERIC     NOT NULL,
    income_type  income_type NOT NULL DEFAULT 'ordinary',
    frequency    frequency   NOT NULL DEFAULT 'annual',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    edited_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    creator_id   UUID        DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id    UUID        DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE expense (
    id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                 TEXT         NOT NULL,
    amount               NUMERIC      NOT NULL,
    growth_rate          NUMERIC      NOT NULL,
    expense_type         expense_type NOT NULL,
    frequency            frequency    NOT NULL,
    is_essential         BOOLEAN      NOT NULL DEFAULT FALSE,
    grows_with_inflation BOOLEAN      NOT NULL DEFAULT FALSE,
    is_tax_deductible    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
    edited_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
    creator_id           UUID         DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id            UUID         DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE debt (
    id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                 TEXT                  NOT NULL,
    principal            NUMERIC               NOT NULL,
    interest_rate        NUMERIC               NOT NULL,
    payment_minimum      NUMERIC,
    payment_strategy     debt_payment_strategy NOT NULL,
    payment_fixed_amount NUMERIC,
    payment_percentage   NUMERIC,
    frequency            frequency             NOT NULL,
    created_at           TIMESTAMPTZ           NOT NULL DEFAULT now(),
    edited_at            TIMESTAMPTZ           NOT NULL DEFAULT now(),
    creator_id           UUID                  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id            UUID                  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE cash_reserve (
    id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                  TEXT                  NOT NULL,
    initial_amount        NUMERIC               NOT NULL,
    cash_reserve_strategy cash_reserve_strategy NOT NULL,
    reserve_amount        NUMERIC,
    reserve_months        INTEGER,
    created_at            TIMESTAMPTZ           NOT NULL DEFAULT now(),
    edited_at             TIMESTAMPTZ           NOT NULL DEFAULT now(),
    creator_id            UUID                  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id             UUID                  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE brokerage (
    id                        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                      TEXT                  NOT NULL,
    growth_rate               NUMERIC               NOT NULL,
    initial_balance           NUMERIC               NOT NULL,
    contribution_strategy     contribution_strategy NOT NULL DEFAULT 'fixed',
    contribution_percentage   NUMERIC,
    contribution_fixed_amount NUMERIC,
    created_at                TIMESTAMPTZ           NOT NULL DEFAULT now(),
    edited_at                 TIMESTAMPTZ           NOT NULL DEFAULT now(),
    creator_id                UUID                  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id                 UUID                  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE ira (
    id                        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                      TEXT                      NOT NULL,
    growth_rate               NUMERIC                   NOT NULL,
    initial_balance           NUMERIC                   NOT NULL,
    contribution_strategy     ira_contribution_strategy NOT NULL DEFAULT 'fixed',
    contribution_percentage   NUMERIC,
    contribution_fixed_amount NUMERIC,
    created_at                TIMESTAMPTZ               NOT NULL DEFAULT now(),
    edited_at                 TIMESTAMPTZ               NOT NULL DEFAULT now(),
    creator_id                UUID                      DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id                 UUID                      DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE roth_ira (
    id                        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                      TEXT                           NOT NULL,
    growth_rate               NUMERIC                        NOT NULL,
    initial_balance           NUMERIC                        NOT NULL,
    contribution_strategy     roth_ira_contribution_strategy NOT NULL DEFAULT 'fixed',
    contribution_percentage   NUMERIC,
    contribution_fixed_amount NUMERIC,
    created_at                TIMESTAMPTZ                    NOT NULL DEFAULT now(),
    edited_at                 TIMESTAMPTZ                    NOT NULL DEFAULT now(),
    creator_id                UUID                           DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id                 UUID                           DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE hsa (
    id                        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                      TEXT                  NOT NULL,
    growth_rate               NUMERIC               NOT NULL,
    initial_balance           NUMERIC               NOT NULL,
    contribution_strategy     contribution_strategy NOT NULL DEFAULT 'fixed',
    contribution_percentage   NUMERIC,
    contribution_fixed_amount NUMERIC,
    created_at                TIMESTAMPTZ           NOT NULL DEFAULT now(),
    edited_at                 TIMESTAMPTZ           NOT NULL DEFAULT now(),
    creator_id                UUID                  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id                 UUID                  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE tax_deferred (
    id                                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                                TEXT                               NOT NULL,
    growth_rate                         NUMERIC                            NOT NULL,
    initial_balance                     NUMERIC                            NOT NULL,
    elective_contribution_strategy      tax_deferred_contribution_strategy NOT NULL,
    elective_contribution_percentage    NUMERIC,
    elective_contribution_fixed_amount  NUMERIC,
    employer_contributes                BOOLEAN                            NOT NULL DEFAULT FALSE,
    employer_contribution_strategy      employer_contribution_strategy,
    employer_compensation_match_percentage NUMERIC,
    employer_contribution_fixed_amount  NUMERIC,
    employer_match_percentage           NUMERIC,
    employer_match_percentage_limit     NUMERIC,
    created_at                          TIMESTAMPTZ                        NOT NULL DEFAULT now(),
    edited_at                           TIMESTAMPTZ                        NOT NULL DEFAULT now(),
    creator_id                          UUID                               DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id                           UUID                               DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE plan (
    id                                       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                                     TEXT                        NOT NULL,
    age                                      INTEGER                     NOT NULL DEFAULT 30,
    year                                     INTEGER                     NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    inflation_rate                           NUMERIC                     NOT NULL,
    insufficient_funds_strategy              insufficient_funds_strategy NOT NULL DEFAULT 'none',
    growth_rate                              NUMERIC                     NOT NULL,
    growth_application_strategy              growth_application_strategy NOT NULL DEFAULT 'start',
    retirement_strategy                      retirement_strategy,
    retirement_withdrawal_rate               NUMERIC,
    retirement_income_goal                   NUMERIC,
    retirement_age                           INTEGER                     NOT NULL DEFAULT 65,
    retirement_savings_amount                NUMERIC,
    retirement_income_adjusted_for_inflation BOOLEAN                     NOT NULL DEFAULT TRUE,
    tax_strategy                             income_tax_strategy         NOT NULL DEFAULT 'simple',
    tax_rate                                 NUMERIC                     NOT NULL,
    life_expectancy                          INTEGER                     NOT NULL,
    created_at                               TIMESTAMPTZ                 NOT NULL DEFAULT now(),
    edited_at                                TIMESTAMPTZ                 NOT NULL DEFAULT now(),
    creator_id                               UUID                        DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id                                UUID                        DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ================================================
-- 4) JUNCTION TABLES FOR PLANS
--    IRA, RothIRA, and TaxDeferred junctions carry a
--    nullable income_id so the income association is
--    plan-specific rather than global on the item.
-- ================================================

CREATE TABLE plan_incomes (
    plan_id   BIGINT NOT NULL REFERENCES plan(id) ON DELETE CASCADE,
    income_id BIGINT NOT NULL REFERENCES income(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id, income_id)
);

CREATE TABLE plan_expenses (
    plan_id    BIGINT NOT NULL REFERENCES plan(id) ON DELETE CASCADE,
    expense_id BIGINT NOT NULL REFERENCES expense(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id, expense_id)
);

CREATE TABLE plan_debts (
    plan_id BIGINT NOT NULL REFERENCES plan(id) ON DELETE CASCADE,
    debt_id BIGINT NOT NULL REFERENCES debt(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id, debt_id)
);

CREATE TABLE plan_cash_reserves (
    plan_id         BIGINT NOT NULL REFERENCES plan(id) ON DELETE CASCADE,
    cash_reserve_id BIGINT NOT NULL REFERENCES cash_reserve(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id, cash_reserve_id)
);

CREATE TABLE plan_brokerages (
    plan_id      BIGINT NOT NULL REFERENCES plan(id) ON DELETE CASCADE,
    brokerage_id BIGINT NOT NULL REFERENCES brokerage(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id, brokerage_id)
);

CREATE TABLE plan_iras (
    plan_id   BIGINT NOT NULL REFERENCES plan(id) ON DELETE CASCADE,
    ira_id    BIGINT NOT NULL REFERENCES ira(id) ON DELETE CASCADE,
    income_id BIGINT REFERENCES income(id) ON DELETE SET NULL,
    PRIMARY KEY (plan_id, ira_id)
);

CREATE TABLE plan_roth_iras (
    plan_id     BIGINT NOT NULL REFERENCES plan(id) ON DELETE CASCADE,
    roth_ira_id BIGINT NOT NULL REFERENCES roth_ira(id) ON DELETE CASCADE,
    income_id   BIGINT REFERENCES income(id) ON DELETE SET NULL,
    PRIMARY KEY (plan_id, roth_ira_id)
);

CREATE TABLE plan_hsas (
    plan_id BIGINT NOT NULL REFERENCES plan(id) ON DELETE CASCADE,
    hsa_id  BIGINT NOT NULL REFERENCES hsa(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id, hsa_id)
);

CREATE TABLE plan_tax_deferreds (
    plan_id         BIGINT NOT NULL REFERENCES plan(id) ON DELETE CASCADE,
    tax_deferred_id BIGINT NOT NULL REFERENCES tax_deferred(id) ON DELETE CASCADE,
    income_id       BIGINT REFERENCES income(id) ON DELETE SET NULL,
    PRIMARY KEY (plan_id, tax_deferred_id)
);

-- ================================================
-- 5) TEMPLATE TABLES
-- ================================================

CREATE TABLE income_template (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name         TEXT        NOT NULL,
    gross_income NUMERIC     NOT NULL,
    growth_rate  NUMERIC     NOT NULL,
    income_type  income_type NOT NULL DEFAULT 'ordinary',
    frequency    frequency   NOT NULL DEFAULT 'annual',
    description  TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    edited_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    creator_id   UUID        DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id    UUID        DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE expense_template (
    id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                 TEXT         NOT NULL,
    amount               NUMERIC      NOT NULL,
    growth_rate          NUMERIC      NOT NULL,
    expense_type         expense_type NOT NULL,
    frequency            frequency    NOT NULL,
    is_essential         BOOLEAN      NOT NULL DEFAULT FALSE,
    grows_with_inflation BOOLEAN      NOT NULL DEFAULT FALSE,
    is_tax_deductible    BOOLEAN      NOT NULL DEFAULT FALSE,
    description          TEXT,
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
    edited_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
    creator_id           UUID         DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id            UUID         DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE debt_template (
    id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                 TEXT                  NOT NULL,
    principal            NUMERIC               NOT NULL,
    interest_rate        NUMERIC               NOT NULL,
    payment_minimum      NUMERIC,
    payment_strategy     debt_payment_strategy NOT NULL,
    payment_fixed_amount NUMERIC,
    payment_percentage   NUMERIC,
    frequency            frequency             NOT NULL,
    description          TEXT,
    created_at           TIMESTAMPTZ           NOT NULL DEFAULT now(),
    edited_at            TIMESTAMPTZ           NOT NULL DEFAULT now(),
    creator_id           UUID                  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id            UUID                  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE cash_reserve_template (
    id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                  TEXT                  NOT NULL,
    initial_amount        NUMERIC               NOT NULL,
    cash_reserve_strategy cash_reserve_strategy NOT NULL,
    reserve_amount        NUMERIC,
    reserve_months        INTEGER,
    description           TEXT,
    created_at            TIMESTAMPTZ           NOT NULL DEFAULT now(),
    edited_at             TIMESTAMPTZ           NOT NULL DEFAULT now(),
    creator_id            UUID                  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id             UUID                  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE brokerage_template (
    id                        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                      TEXT                  NOT NULL,
    growth_rate               NUMERIC               NOT NULL,
    initial_balance           NUMERIC               NOT NULL,
    contribution_strategy     contribution_strategy NOT NULL DEFAULT 'fixed',
    contribution_percentage   NUMERIC,
    contribution_fixed_amount NUMERIC,
    description               TEXT,
    created_at                TIMESTAMPTZ           NOT NULL DEFAULT now(),
    edited_at                 TIMESTAMPTZ           NOT NULL DEFAULT now(),
    creator_id                UUID                  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id                 UUID                  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE ira_template (
    id                        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                      TEXT                      NOT NULL,
    growth_rate               NUMERIC                   NOT NULL,
    initial_balance           NUMERIC                   NOT NULL,
    contribution_strategy     ira_contribution_strategy NOT NULL DEFAULT 'fixed',
    contribution_percentage   NUMERIC,
    contribution_fixed_amount NUMERIC,
    description               TEXT,
    created_at                TIMESTAMPTZ               NOT NULL DEFAULT now(),
    edited_at                 TIMESTAMPTZ               NOT NULL DEFAULT now(),
    creator_id                UUID                      DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id                 UUID                      DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE roth_ira_template (
    id                        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                      TEXT                           NOT NULL,
    growth_rate               NUMERIC                        NOT NULL,
    initial_balance           NUMERIC                        NOT NULL,
    contribution_strategy     roth_ira_contribution_strategy NOT NULL DEFAULT 'fixed',
    contribution_percentage   NUMERIC,
    contribution_fixed_amount NUMERIC,
    description               TEXT,
    created_at                TIMESTAMPTZ                    NOT NULL DEFAULT now(),
    edited_at                 TIMESTAMPTZ                    NOT NULL DEFAULT now(),
    creator_id                UUID                           DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id                 UUID                           DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE hsa_template (
    id                        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                      TEXT                  NOT NULL,
    growth_rate               NUMERIC               NOT NULL,
    initial_balance           NUMERIC               NOT NULL,
    contribution_strategy     contribution_strategy NOT NULL DEFAULT 'fixed',
    contribution_percentage   NUMERIC,
    contribution_fixed_amount NUMERIC,
    description               TEXT,
    created_at                TIMESTAMPTZ           NOT NULL DEFAULT now(),
    edited_at                 TIMESTAMPTZ           NOT NULL DEFAULT now(),
    creator_id                UUID                  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id                 UUID                  DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE tax_deferred_template (
    id                                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                                TEXT                               NOT NULL,
    growth_rate                         NUMERIC                            NOT NULL,
    initial_balance                     NUMERIC                            NOT NULL,
    elective_contribution_strategy      tax_deferred_contribution_strategy NOT NULL,
    elective_contribution_percentage    NUMERIC,
    elective_contribution_fixed_amount  NUMERIC,
    employer_contributes                BOOLEAN                            NOT NULL DEFAULT FALSE,
    employer_contribution_strategy      employer_contribution_strategy,
    employer_compensation_match_percentage NUMERIC,
    employer_contribution_fixed_amount  NUMERIC,
    employer_match_percentage           NUMERIC,
    employer_match_percentage_limit     NUMERIC,
    description                         TEXT,
    created_at                          TIMESTAMPTZ                        NOT NULL DEFAULT now(),
    edited_at                           TIMESTAMPTZ                        NOT NULL DEFAULT now(),
    creator_id                          UUID                               DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id                           UUID                               DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE plan_template (
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                        TEXT                        NOT NULL,
    age                         INTEGER,
    year                        INTEGER,
    inflation_rate              NUMERIC,
    insufficient_funds_strategy insufficient_funds_strategy NOT NULL DEFAULT 'none',
    description                 TEXT,
    created_at                  TIMESTAMPTZ                 NOT NULL DEFAULT now(),
    edited_at                   TIMESTAMPTZ                 NOT NULL DEFAULT now(),
    creator_id                  UUID                        DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id                   UUID                        DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE plan_template_income_templates (
    plan_template_id   BIGINT NOT NULL REFERENCES plan_template(id) ON DELETE CASCADE,
    income_template_id BIGINT NOT NULL REFERENCES income_template(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_template_id, income_template_id)
);

CREATE TABLE plan_template_expense_templates (
    plan_template_id    BIGINT NOT NULL REFERENCES plan_template(id) ON DELETE CASCADE,
    expense_template_id BIGINT NOT NULL REFERENCES expense_template(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_template_id, expense_template_id)
);

CREATE TABLE plan_template_debt_templates (
    plan_template_id BIGINT NOT NULL REFERENCES plan_template(id) ON DELETE CASCADE,
    debt_template_id BIGINT NOT NULL REFERENCES debt_template(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_template_id, debt_template_id)
);

CREATE TABLE plan_template_cash_reserve_templates (
    plan_template_id         BIGINT NOT NULL REFERENCES plan_template(id) ON DELETE CASCADE,
    cash_reserve_template_id BIGINT NOT NULL REFERENCES cash_reserve_template(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_template_id, cash_reserve_template_id)
);

CREATE TABLE plan_template_brokerage_templates (
    plan_template_id      BIGINT NOT NULL REFERENCES plan_template(id) ON DELETE CASCADE,
    brokerage_template_id BIGINT NOT NULL REFERENCES brokerage_template(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_template_id, brokerage_template_id)
);

CREATE TABLE plan_template_ira_templates (
    plan_template_id BIGINT NOT NULL REFERENCES plan_template(id) ON DELETE CASCADE,
    ira_template_id  BIGINT NOT NULL REFERENCES ira_template(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_template_id, ira_template_id)
);

CREATE TABLE plan_template_roth_ira_templates (
    plan_template_id     BIGINT NOT NULL REFERENCES plan_template(id) ON DELETE CASCADE,
    roth_ira_template_id BIGINT NOT NULL REFERENCES roth_ira_template(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_template_id, roth_ira_template_id)
);

CREATE TABLE plan_template_hsa_templates (
    plan_template_id BIGINT NOT NULL REFERENCES plan_template(id) ON DELETE CASCADE,
    hsa_template_id  BIGINT NOT NULL REFERENCES hsa_template(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_template_id, hsa_template_id)
);

CREATE TABLE plan_template_tax_deferred_templates (
    plan_template_id         BIGINT NOT NULL REFERENCES plan_template(id) ON DELETE CASCADE,
    tax_deferred_template_id BIGINT NOT NULL REFERENCES tax_deferred_template(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_template_id, tax_deferred_template_id)
);

-- ================================================
-- 6) COMMAND + COMMAND SEQUENCE
--    Uses discriminated (item_type, item_id) pair
--    instead of Django's ContentType pattern.
-- ================================================

CREATE TABLE command (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    item_type  command_item_type NOT NULL,
    item_id    BIGINT            NOT NULL,
    action     TEXT              NOT NULL,
    created_at TIMESTAMPTZ       NOT NULL DEFAULT now(),
    edited_at  TIMESTAMPTZ       NOT NULL DEFAULT now(),
    creator_id UUID              DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id  UUID              DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    is_active  BOOLEAN           NOT NULL DEFAULT TRUE
);

CREATE TABLE command_sequence (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name          TEXT                           NOT NULL,
    plan_id       BIGINT                         NOT NULL REFERENCES plan(id) ON DELETE CASCADE,
    ordering_type command_sequence_ordering_type NOT NULL DEFAULT 'custom',
    created_at    TIMESTAMPTZ                    NOT NULL DEFAULT now(),
    edited_at     TIMESTAMPTZ                    NOT NULL DEFAULT now(),
    creator_id    UUID                           DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    editor_id     UUID                           DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE command_sequence_command (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sequence_id BIGINT  NOT NULL REFERENCES command_sequence(id) ON DELETE CASCADE,
    command_id  BIGINT  NOT NULL REFERENCES command(id) ON DELETE CASCADE,
    "order"     INTEGER NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (sequence_id, command_id)
);

-- ================================================
-- 7) INDEXES
-- ================================================

CREATE INDEX idx_profiles_user_id        ON profiles(user_id);

CREATE INDEX idx_income_creator_id       ON income(creator_id);
CREATE INDEX idx_income_created_at       ON income(created_at);

CREATE INDEX idx_expense_creator_id      ON expense(creator_id);
CREATE INDEX idx_expense_created_at      ON expense(created_at);

CREATE INDEX idx_debt_creator_id         ON debt(creator_id);
CREATE INDEX idx_debt_created_at         ON debt(created_at);

CREATE INDEX idx_cash_reserve_creator_id ON cash_reserve(creator_id);
CREATE INDEX idx_cash_reserve_created_at ON cash_reserve(created_at);

CREATE INDEX idx_brokerage_creator_id    ON brokerage(creator_id);
CREATE INDEX idx_brokerage_created_at    ON brokerage(created_at);

CREATE INDEX idx_ira_creator_id          ON ira(creator_id);
CREATE INDEX idx_ira_created_at          ON ira(created_at);

CREATE INDEX idx_roth_ira_creator_id     ON roth_ira(creator_id);
CREATE INDEX idx_roth_ira_created_at     ON roth_ira(created_at);

CREATE INDEX idx_hsa_creator_id          ON hsa(creator_id);
CREATE INDEX idx_hsa_created_at          ON hsa(created_at);

CREATE INDEX idx_tax_deferred_creator_id ON tax_deferred(creator_id);
CREATE INDEX idx_tax_deferred_created_at ON tax_deferred(created_at);

CREATE INDEX idx_plan_creator_id         ON plan(creator_id);
CREATE INDEX idx_plan_created_at         ON plan(created_at);

CREATE INDEX idx_command_sequence_plan_id ON command_sequence(plan_id);
CREATE INDEX idx_command_item_type        ON command(item_type);
CREATE INDEX idx_command_item_id          ON command(item_id);
