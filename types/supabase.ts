export type Database = {
  public: {
    Tables: {
      brokerage: {
        Row: {
          contribution_fixed_amount: number | null
          contribution_percentage: number | null
          contribution_strategy: "fixed" | "percentage_of_income" | "max" | null
          created_at: string | null
          creator: string | null
          edited_at: string | null
          editor: string | null
          growth_rate: number
          id: number
          initial_balance: number
          name: string
        }
        Insert: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?:
            | "fixed"
            | "percentage_of_income"
            | "max"
            | null
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          growth_rate: number
          id?: number
          initial_balance: number
          name: string
        }
        Update: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?:
            | "fixed"
            | "percentage_of_income"
            | "max"
            | null
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          growth_rate?: number
          id?: number
          initial_balance?: number
          name?: string
        }
        Relationships: []
      }
      brokerage_template: {
        Row: {
          contribution_fixed_amount: number | null
          contribution_percentage: number | null
          contribution_strategy: "fixed" | "percentage_of_income" | "max" | null
          created_at: string | null
          creator: string | null
          description: string | null
          edited_at: string | null
          editor: string | null
          growth_rate: number
          id: number
          initial_balance: number
          name: string
        }
        Insert: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?:
            | "fixed"
            | "percentage_of_income"
            | "max"
            | null
          created_at?: string | null
          creator?: string | null
          description?: string | null
          edited_at?: string | null
          editor?: string | null
          growth_rate: number
          id?: number
          initial_balance: number
          name: string
        }
        Update: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?:
            | "fixed"
            | "percentage_of_income"
            | "max"
            | null
          created_at?: string | null
          creator?: string | null
          description?: string | null
          edited_at?: string | null
          editor?: string | null
          growth_rate?: number
          id?: number
          initial_balance?: number
          name?: string
        }
        Relationships: []
      }
      cash_reserve: {
        Row: {
          cash_reserve_strategy: "fixed" | "variable"
          created_at: string | null
          creator: string | null
          edited_at: string | null
          editor: string | null
          id: number
          initial_amount: number
          name: string
          reserve_amount: number | null
          reserve_months: number | null
        }
        Insert: {
          cash_reserve_strategy: "fixed" | "variable"
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          id?: number
          initial_amount: number
          name: string
          reserve_amount?: number | null
          reserve_months?: number | null
        }
        Update: {
          cash_reserve_strategy?: "fixed" | "variable"
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          id?: number
          initial_amount?: number
          name?: string
          reserve_amount?: number | null
          reserve_months?: number | null
        }
        Relationships: []
      }
      cash_reserve_template: {
        Row: {
          cash_reserve_strategy: "fixed" | "variable"
          created_at: string | null
          creator: string | null
          description: string | null
          edited_at: string | null
          editor: string | null
          id: number
          initial_amount: number
          name: string
          reserve_amount: number | null
          reserve_months: number | null
        }
        Insert: {
          cash_reserve_strategy: "fixed" | "variable"
          created_at?: string | null
          creator?: string | null
          description?: string | null
          edited_at?: string | null
          editor?: string | null
          id?: number
          initial_amount: number
          name: string
          reserve_amount?: number | null
          reserve_months?: number | null
        }
        Update: {
          cash_reserve_strategy?: "fixed" | "variable"
          created_at?: string | null
          creator?: string | null
          description?: string | null
          edited_at?: string | null
          editor?: string | null
          id?: number
          initial_amount?: number
          name?: string
          reserve_amount?: number | null
          reserve_months?: number | null
        }
        Relationships: []
      }
      command: {
        Row: {
          action: string
          created_at: string | null
          creator: string | null
          edited_at: string | null
          editor: string | null
          id: number
          object_id: number
          object_table:
            | "brokerage"
            | "brokerage_template"
            | "cash_reserve"
            | "cash_reserve_template"
            | "debt"
            | "debt_template"
            | "expense"
            | "expense_template"
            | "income"
            | "income_template"
            | "ira"
            | "ira_template"
            | "roth_ira"
            | "roth_ira_template"
            | "tax_deferred"
            | "tax_deferred_template"
            | "plan"
            | "plan_template"
        }
        Insert: {
          action: string
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          id?: number
          object_id: number
          object_table:
            | "brokerage"
            | "brokerage_template"
            | "cash_reserve"
            | "cash_reserve_template"
            | "debt"
            | "debt_template"
            | "expense"
            | "expense_template"
            | "income"
            | "income_template"
            | "ira"
            | "ira_template"
            | "roth_ira"
            | "roth_ira_template"
            | "tax_deferred"
            | "tax_deferred_template"
            | "plan"
            | "plan_template"
        }
        Update: {
          action?: string
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          id?: number
          object_id?: number
          object_table?:
            | "brokerage"
            | "brokerage_template"
            | "cash_reserve"
            | "cash_reserve_template"
            | "debt"
            | "debt_template"
            | "expense"
            | "expense_template"
            | "income"
            | "income_template"
            | "ira"
            | "ira_template"
            | "roth_ira"
            | "roth_ira_template"
            | "tax_deferred"
            | "tax_deferred_template"
            | "plan"
            | "plan_template"
        }
        Relationships: []
      }
      command_sequence: {
        Row: {
          created_at: string | null
          creator: string | null
          edited_at: string | null
          editor: string | null
          id: number
          name: string
          ordering_type: "predefined" | "custom" | null
          plan_id: number | null
        }
        Insert: {
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          id?: number
          name: string
          ordering_type?: "predefined" | "custom" | null
          plan_id?: number | null
        }
        Update: {
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          id?: number
          name?: string
          ordering_type?: "predefined" | "custom" | null
          plan_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "command_sequence_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
        ]
      }
      command_sequence_command: {
        Row: {
          command_id: number
          id: number
          is_active: boolean | null
          order: number
          sequence_id: number
        }
        Insert: {
          command_id: number
          id?: number
          is_active?: boolean | null
          order: number
          sequence_id: number
        }
        Update: {
          command_id?: number
          id?: number
          is_active?: boolean | null
          order?: number
          sequence_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "command_sequence_command_command_id_fkey"
            columns: ["command_id"]
            isOneToOne: false
            referencedRelation: "command"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "command_sequence_command_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "command_sequence"
            referencedColumns: ["id"]
          },
        ]
      }
      debt: {
        Row: {
          created_at: string | null
          creator: string | null
          edited_at: string | null
          editor: string | null
          frequency:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
          id: number
          interest_rate: number
          name: string
          payment_fixed_amount: number | null
          payment_minimum: number | null
          payment_percentage: number | null
          payment_strategy:
            | "fixed"
            | "minimum_payment"
            | "maximum_payment"
            | "percentage_of_debt"
          principal: number
        }
        Insert: {
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          frequency:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
          id?: number
          interest_rate: number
          name: string
          payment_fixed_amount?: number | null
          payment_minimum?: number | null
          payment_percentage?: number | null
          payment_strategy:
            | "fixed"
            | "minimum_payment"
            | "maximum_payment"
            | "percentage_of_debt"
          principal: number
        }
        Update: {
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          frequency?:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
          id?: number
          interest_rate?: number
          name?: string
          payment_fixed_amount?: number | null
          payment_minimum?: number | null
          payment_percentage?: number | null
          payment_strategy?:
            | "fixed"
            | "minimum_payment"
            | "maximum_payment"
            | "percentage_of_debt"
          principal?: number
        }
        Relationships: []
      }
      debt_template: {
        Row: {
          created_at: string | null
          creator: string | null
          description: string | null
          edited_at: string | null
          editor: string | null
          frequency:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
          id: number
          interest_rate: number
          name: string
          payment_fixed_amount: number | null
          payment_minimum: number | null
          payment_percentage: number | null
          payment_strategy:
            | "fixed"
            | "minimum_payment"
            | "maximum_payment"
            | "percentage_of_debt"
          principal: number
        }
        Insert: {
          created_at?: string | null
          creator?: string | null
          description?: string | null
          edited_at?: string | null
          editor?: string | null
          frequency:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
          id?: number
          interest_rate: number
          name: string
          payment_fixed_amount?: number | null
          payment_minimum?: number | null
          payment_percentage?: number | null
          payment_strategy:
            | "fixed"
            | "minimum_payment"
            | "maximum_payment"
            | "percentage_of_debt"
          principal: number
        }
        Update: {
          created_at?: string | null
          creator?: string | null
          description?: string | null
          edited_at?: string | null
          editor?: string | null
          frequency?:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
          id?: number
          interest_rate?: number
          name?: string
          payment_fixed_amount?: number | null
          payment_minimum?: number | null
          payment_percentage?: number | null
          payment_strategy?:
            | "fixed"
            | "minimum_payment"
            | "maximum_payment"
            | "percentage_of_debt"
          principal?: number
        }
        Relationships: []
      }
      expense: {
        Row: {
          amount: number
          created_at: string | null
          creator: string | null
          edited_at: string | null
          editor: string | null
          expense_type: "fixed" | "variable"
          frequency:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
          grows_with_inflation: boolean | null
          growth_rate: number
          id: number
          is_essential: boolean | null
          is_tax_deductible: boolean | null
          name: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          expense_type: "fixed" | "variable"
          frequency:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
          grows_with_inflation?: boolean | null
          growth_rate: number
          id?: number
          is_essential?: boolean | null
          is_tax_deductible?: boolean | null
          name: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          expense_type?: "fixed" | "variable"
          frequency?:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
          grows_with_inflation?: boolean | null
          growth_rate?: number
          id?: number
          is_essential?: boolean | null
          is_tax_deductible?: boolean | null
          name?: string
        }
        Relationships: []
      }
      expense_template: {
        Row: {
          amount: number
          created_at: string | null
          creator: string | null
          description: string | null
          edited_at: string | null
          editor: string | null
          expense_type: "fixed" | "variable"
          frequency:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
          grows_with_inflation: boolean | null
          growth_rate: number
          id: number
          is_essential: boolean | null
          is_tax_deductible: boolean | null
          name: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          creator?: string | null
          description?: string | null
          edited_at?: string | null
          editor?: string | null
          expense_type: "fixed" | "variable"
          frequency:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
          grows_with_inflation?: boolean | null
          growth_rate: number
          id?: number
          is_essential?: boolean | null
          is_tax_deductible?: boolean | null
          name: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          creator?: string | null
          description?: string | null
          edited_at?: string | null
          editor?: string | null
          expense_type?: "fixed" | "variable"
          frequency?:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
          grows_with_inflation?: boolean | null
          growth_rate?: number
          id?: number
          is_essential?: boolean | null
          is_tax_deductible?: boolean | null
          name?: string
        }
        Relationships: []
      }
      income: {
        Row: {
          created_at: string | null
          creator: string | null
          edited_at: string | null
          editor: string | null
          frequency:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
            | null
          gross_income: number
          growth_rate: number
          id: number
          income_type: "ordinary" | null
          name: string
        }
        Insert: {
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          frequency?:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
            | null
          gross_income: number
          growth_rate: number
          id?: number
          income_type?: "ordinary" | null
          name: string
        }
        Update: {
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          frequency?:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
            | null
          gross_income?: number
          growth_rate?: number
          id?: number
          income_type?: "ordinary" | null
          name?: string
        }
        Relationships: []
      }
      income_template: {
        Row: {
          created_at: string | null
          creator: string | null
          description: string | null
          edited_at: string | null
          editor: string | null
          frequency:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
            | null
          gross_income: number
          growth_rate: number
          id: number
          income_type: "ordinary" | null
          name: string
        }
        Insert: {
          created_at?: string | null
          creator?: string | null
          description?: string | null
          edited_at?: string | null
          editor?: string | null
          frequency?:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
            | null
          gross_income: number
          growth_rate: number
          id?: number
          income_type?: "ordinary" | null
          name: string
        }
        Update: {
          created_at?: string | null
          creator?: string | null
          description?: string | null
          edited_at?: string | null
          editor?: string | null
          frequency?:
            | "monthly"
            | "weekly"
            | "biweekly"
            | "quarterly"
            | "annual"
            | "one_time"
            | null
          gross_income?: number
          growth_rate?: number
          id?: number
          income_type?: "ordinary" | null
          name?: string
        }
        Relationships: []
      }
      ira: {
        Row: {
          contribution_fixed_amount: number | null
          contribution_percentage: number | null
          contribution_strategy: "fixed" | "percentage_of_income" | "max" | null
          created_at: string | null
          creator: string | null
          edited_at: string | null
          editor: string | null
          growth_rate: number
          id: number
          income_id: number | null
          initial_balance: number
          name: string
        }
        Insert: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?:
            | "fixed"
            | "percentage_of_income"
            | "max"
            | null
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          growth_rate: number
          id?: number
          income_id?: number | null
          initial_balance: number
          name: string
        }
        Update: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?:
            | "fixed"
            | "percentage_of_income"
            | "max"
            | null
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          growth_rate?: number
          id?: number
          income_id?: number | null
          initial_balance?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "ira_income_id_fkey"
            columns: ["income_id"]
            isOneToOne: false
            referencedRelation: "income"
            referencedColumns: ["id"]
          },
        ]
      }
      ira_template: {
        Row: {
          contribution_fixed_amount: number | null
          contribution_percentage: number | null
          contribution_strategy: "fixed" | "percentage_of_income" | "max" | null
          created_at: string | null
          creator: string | null
          description: string | null
          edited_at: string | null
          editor: string | null
          growth_rate: number
          id: number
          initial_balance: number
          name: string
        }
        Insert: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?:
            | "fixed"
            | "percentage_of_income"
            | "max"
            | null
          created_at?: string | null
          creator?: string | null
          description?: string | null
          edited_at?: string | null
          editor?: string | null
          growth_rate: number
          id?: number
          initial_balance: number
          name: string
        }
        Update: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?:
            | "fixed"
            | "percentage_of_income"
            | "max"
            | null
          created_at?: string | null
          creator?: string | null
          description?: string | null
          edited_at?: string | null
          editor?: string | null
          growth_rate?: number
          id?: number
          initial_balance?: number
          name?: string
        }
        Relationships: []
      }
      plan: {
        Row: {
          age: number | null
          created_at: string | null
          creator: string | null
          edited_at: string | null
          editor: string | null
          growth_application_strategy: "start" | "end" | null
          growth_rate: number
          id: number
          inflation_rate: number
          insufficient_funds_strategy: "none" | "minimum_only" | "full" | null
          life_expectancy: number
          name: string
          retirement_age: number | null
          retirement_income_adjusted_for_inflation: boolean | null
          retirement_income_goal: number | null
          retirement_savings_amount: number | null
          retirement_strategy:
            | "debt_free"
            | "age"
            | "percent_rule"
            | "target_savings"
            | null
          retirement_withdrawal_rate: number | null
          tax_rate: number
          tax_strategy: "simple" | null
          year: number | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          growth_application_strategy?: "start" | "end" | null
          growth_rate: number
          id?: number
          inflation_rate: number
          insufficient_funds_strategy?: "none" | "minimum_only" | "full" | null
          life_expectancy: number
          name: string
          retirement_age?: number | null
          retirement_income_adjusted_for_inflation?: boolean | null
          retirement_income_goal?: number | null
          retirement_savings_amount?: number | null
          retirement_strategy?:
            | "debt_free"
            | "age"
            | "percent_rule"
            | "target_savings"
            | null
          retirement_withdrawal_rate?: number | null
          tax_rate: number
          tax_strategy?: "simple" | null
          year?: number | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          growth_application_strategy?: "start" | "end" | null
          growth_rate?: number
          id?: number
          inflation_rate?: number
          insufficient_funds_strategy?: "none" | "minimum_only" | "full" | null
          life_expectancy?: number
          name?: string
          retirement_age?: number | null
          retirement_income_adjusted_for_inflation?: boolean | null
          retirement_income_goal?: number | null
          retirement_savings_amount?: number | null
          retirement_strategy?:
            | "debt_free"
            | "age"
            | "percent_rule"
            | "target_savings"
            | null
          retirement_withdrawal_rate?: number | null
          tax_rate?: number
          tax_strategy?: "simple" | null
          year?: number | null
        }
        Relationships: []
      }
      plan_brokerages: {
        Row: {
          brokerage_id: number
          plan_id: number
        }
        Insert: {
          brokerage_id: number
          plan_id: number
        }
        Update: {
          brokerage_id?: number
          plan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_brokerages_brokerage_id_fkey"
            columns: ["brokerage_id"]
            isOneToOne: false
            referencedRelation: "brokerage"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_brokerages_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_cash_reserves: {
        Row: {
          cashreserve_id: number
          plan_id: number
        }
        Insert: {
          cashreserve_id: number
          plan_id: number
        }
        Update: {
          cashreserve_id?: number
          plan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_cash_reserves_cashreserve_id_fkey"
            columns: ["cashreserve_id"]
            isOneToOne: false
            referencedRelation: "cash_reserve"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_cash_reserves_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_debts: {
        Row: {
          debt_id: number
          plan_id: number
        }
        Insert: {
          debt_id: number
          plan_id: number
        }
        Update: {
          debt_id?: number
          plan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_debts_debt_id_fkey"
            columns: ["debt_id"]
            isOneToOne: false
            referencedRelation: "debt"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_debts_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_expenses: {
        Row: {
          expense_id: number
          plan_id: number
        }
        Insert: {
          expense_id: number
          plan_id: number
        }
        Update: {
          expense_id?: number
          plan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_expenses_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expense"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_expenses_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_incomes: {
        Row: {
          income_id: number
          plan_id: number
        }
        Insert: {
          income_id: number
          plan_id: number
        }
        Update: {
          income_id?: number
          plan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_incomes_income_id_fkey"
            columns: ["income_id"]
            isOneToOne: false
            referencedRelation: "income"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_incomes_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_iras: {
        Row: {
          ira_id: number
          plan_id: number
        }
        Insert: {
          ira_id: number
          plan_id: number
        }
        Update: {
          ira_id?: number
          plan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_iras_ira_id_fkey"
            columns: ["ira_id"]
            isOneToOne: false
            referencedRelation: "ira"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_iras_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_roth_iras: {
        Row: {
          plan_id: number
          rothira_id: number
        }
        Insert: {
          plan_id: number
          rothira_id: number
        }
        Update: {
          plan_id?: number
          rothira_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_roth_iras_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_roth_iras_rothira_id_fkey"
            columns: ["rothira_id"]
            isOneToOne: false
            referencedRelation: "roth_ira"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_tax_deferreds: {
        Row: {
          plan_id: number
          taxdeferred_id: number
        }
        Insert: {
          plan_id: number
          taxdeferred_id: number
        }
        Update: {
          plan_id?: number
          taxdeferred_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_tax_deferreds_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_tax_deferreds_taxdeferred_id_fkey"
            columns: ["taxdeferred_id"]
            isOneToOne: false
            referencedRelation: "tax_deferred"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_template: {
        Row: {
          age: number | null
          cash_reserve_templates: number | null
          created_at: string | null
          creator: string | null
          edited_at: string | null
          editor: string | null
          id: number
          inflation_rate: number | null
          insufficient_funds_strategy: "none" | "minimum_only" | "full" | null
          name: string
          year: number | null
        }
        Insert: {
          age?: number | null
          cash_reserve_templates?: number | null
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          id?: number
          inflation_rate?: number | null
          insufficient_funds_strategy?: "none" | "minimum_only" | "full" | null
          name: string
          year?: number | null
        }
        Update: {
          age?: number | null
          cash_reserve_templates?: number | null
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          id?: number
          inflation_rate?: number | null
          insufficient_funds_strategy?: "none" | "minimum_only" | "full" | null
          name?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_template_cash_reserve_templates_fkey"
            columns: ["cash_reserve_templates"]
            isOneToOne: false
            referencedRelation: "cash_reserve_template"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_template_brokerage_investment_templates: {
        Row: {
          brokerage_template_id: number
          plan_template_id: number
        }
        Insert: {
          brokerage_template_id: number
          plan_template_id: number
        }
        Update: {
          brokerage_template_id?: number
          plan_template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_template_brokerage_investment_t_brokerage_template_id_fkey"
            columns: ["brokerage_template_id"]
            isOneToOne: false
            referencedRelation: "brokerage_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_template_brokerage_investment_templa_plan_template_id_fkey"
            columns: ["plan_template_id"]
            isOneToOne: false
            referencedRelation: "plan_template"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_template_debt_templates: {
        Row: {
          debt_template_id: number
          plan_template_id: number
        }
        Insert: {
          debt_template_id: number
          plan_template_id: number
        }
        Update: {
          debt_template_id?: number
          plan_template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_template_debt_templates_debt_template_id_fkey"
            columns: ["debt_template_id"]
            isOneToOne: false
            referencedRelation: "debt_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_template_debt_templates_plan_template_id_fkey"
            columns: ["plan_template_id"]
            isOneToOne: false
            referencedRelation: "plan_template"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_template_expense_templates: {
        Row: {
          expense_template_id: number
          plan_template_id: number
        }
        Insert: {
          expense_template_id: number
          plan_template_id: number
        }
        Update: {
          expense_template_id?: number
          plan_template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_template_expense_templates_expense_template_id_fkey"
            columns: ["expense_template_id"]
            isOneToOne: false
            referencedRelation: "expense_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_template_expense_templates_plan_template_id_fkey"
            columns: ["plan_template_id"]
            isOneToOne: false
            referencedRelation: "plan_template"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_template_income_templates: {
        Row: {
          income_template_id: number
          plan_template_id: number
        }
        Insert: {
          income_template_id: number
          plan_template_id: number
        }
        Update: {
          income_template_id?: number
          plan_template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_template_income_templates_income_template_id_fkey"
            columns: ["income_template_id"]
            isOneToOne: false
            referencedRelation: "income_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_template_income_templates_plan_template_id_fkey"
            columns: ["plan_template_id"]
            isOneToOne: false
            referencedRelation: "plan_template"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_template_ira_investment_templates: {
        Row: {
          ira_template_id: number
          plan_template_id: number
        }
        Insert: {
          ira_template_id: number
          plan_template_id: number
        }
        Update: {
          ira_template_id?: number
          plan_template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_template_ira_investment_templates_ira_template_id_fkey"
            columns: ["ira_template_id"]
            isOneToOne: false
            referencedRelation: "ira_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_template_ira_investment_templates_plan_template_id_fkey"
            columns: ["plan_template_id"]
            isOneToOne: false
            referencedRelation: "plan_template"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_template_roth_ira_investment_templates: {
        Row: {
          plan_template_id: number
          roth_ira_template_id: number
        }
        Insert: {
          plan_template_id: number
          roth_ira_template_id: number
        }
        Update: {
          plan_template_id?: number
          roth_ira_template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_template_roth_ira_investment_tem_roth_ira_template_id_fkey"
            columns: ["roth_ira_template_id"]
            isOneToOne: false
            referencedRelation: "roth_ira_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_template_roth_ira_investment_templat_plan_template_id_fkey"
            columns: ["plan_template_id"]
            isOneToOne: false
            referencedRelation: "plan_template"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_template_tax_deferred_investment_templates: {
        Row: {
          plan_template_id: number
          tax_deferred_template_id: number
        }
        Insert: {
          plan_template_id: number
          tax_deferred_template_id: number
        }
        Update: {
          plan_template_id?: number
          tax_deferred_template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_template_tax_deferred_invest_tax_deferred_template_id_fkey"
            columns: ["tax_deferred_template_id"]
            isOneToOne: false
            referencedRelation: "tax_deferred_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_template_tax_deferred_investment_tem_plan_template_id_fkey"
            columns: ["plan_template_id"]
            isOneToOne: false
            referencedRelation: "plan_template"
            referencedColumns: ["id"]
          },
        ]
      }
      roth_ira: {
        Row: {
          contribution_fixed_amount: number | null
          contribution_percentage: number | null
          contribution_strategy: "fixed" | "percentage_of_income" | "max" | null
          created_at: string | null
          creator: string | null
          edited_at: string | null
          editor: string | null
          growth_rate: number
          id: number
          income_id: number | null
          initial_balance: number
          name: string
        }
        Insert: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?:
            | "fixed"
            | "percentage_of_income"
            | "max"
            | null
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          growth_rate: number
          id?: number
          income_id?: number | null
          initial_balance: number
          name: string
        }
        Update: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?:
            | "fixed"
            | "percentage_of_income"
            | "max"
            | null
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          growth_rate?: number
          id?: number
          income_id?: number | null
          initial_balance?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "roth_ira_income_id_fkey"
            columns: ["income_id"]
            isOneToOne: false
            referencedRelation: "income"
            referencedColumns: ["id"]
          },
        ]
      }
      roth_ira_template: {
        Row: {
          contribution_fixed_amount: number | null
          contribution_percentage: number | null
          contribution_strategy: "fixed" | "percentage_of_income" | "max" | null
          created_at: string | null
          creator: string | null
          description: string | null
          edited_at: string | null
          editor: string | null
          growth_rate: number
          id: number
          initial_balance: number
          name: string
        }
        Insert: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?:
            | "fixed"
            | "percentage_of_income"
            | "max"
            | null
          created_at?: string | null
          creator?: string | null
          description?: string | null
          edited_at?: string | null
          editor?: string | null
          growth_rate: number
          id?: number
          initial_balance: number
          name: string
        }
        Update: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?:
            | "fixed"
            | "percentage_of_income"
            | "max"
            | null
          created_at?: string | null
          creator?: string | null
          description?: string | null
          edited_at?: string | null
          editor?: string | null
          growth_rate?: number
          id?: number
          initial_balance?: number
          name?: string
        }
        Relationships: []
      }
      tax_deferred: {
        Row: {
          created_at: string | null
          creator: string | null
          edited_at: string | null
          editor: string | null
          elective_contribution_fixed_amount: number | null
          elective_contribution_percentage: number | null
          elective_contribution_strategy:
            | "none"
            | "until_company_match"
            | "percentage_of_income"
            | "fixed"
            | "max"
          employer_compensation_match_percentage: number | null
          employer_contributes: boolean | null
          employer_contribution_fixed_amount: number | null
          employer_contribution_strategy:
            | "none"
            | "percentage_of_contribution"
            | "percentage_of_compensation"
            | "fixed"
            | null
          employer_match_percentage: number | null
          employer_match_percentage_limit: number | null
          growth_rate: number
          id: number
          income_id: number | null
          initial_balance: number
          name: string
        }
        Insert: {
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          elective_contribution_fixed_amount?: number | null
          elective_contribution_percentage?: number | null
          elective_contribution_strategy:
            | "none"
            | "until_company_match"
            | "percentage_of_income"
            | "fixed"
            | "max"
          employer_compensation_match_percentage?: number | null
          employer_contributes?: boolean | null
          employer_contribution_fixed_amount?: number | null
          employer_contribution_strategy?:
            | "none"
            | "percentage_of_contribution"
            | "percentage_of_compensation"
            | "fixed"
            | null
          employer_match_percentage?: number | null
          employer_match_percentage_limit?: number | null
          growth_rate: number
          id?: number
          income_id?: number | null
          initial_balance: number
          name: string
        }
        Update: {
          created_at?: string | null
          creator?: string | null
          edited_at?: string | null
          editor?: string | null
          elective_contribution_fixed_amount?: number | null
          elective_contribution_percentage?: number | null
          elective_contribution_strategy?:
            | "none"
            | "until_company_match"
            | "percentage_of_income"
            | "fixed"
            | "max"
          employer_compensation_match_percentage?: number | null
          employer_contributes?: boolean | null
          employer_contribution_fixed_amount?: number | null
          employer_contribution_strategy?:
            | "none"
            | "percentage_of_contribution"
            | "percentage_of_compensation"
            | "fixed"
            | null
          employer_match_percentage?: number | null
          employer_match_percentage_limit?: number | null
          growth_rate?: number
          id?: number
          income_id?: number | null
          initial_balance?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_deferred_income_id_fkey"
            columns: ["income_id"]
            isOneToOne: false
            referencedRelation: "income"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_deferred_template: {
        Row: {
          created_at: string | null
          creator: string | null
          description: string | null
          edited_at: string | null
          editor: string | null
          elective_contribution_fixed_amount: number | null
          elective_contribution_percentage: number | null
          elective_contribution_strategy:
            | "none"
            | "until_company_match"
            | "percentage_of_income"
            | "fixed"
            | "max"
          employer_compensation_match_percentage: number | null
          employer_contributes: boolean | null
          employer_contribution_fixed_amount: number | null
          employer_contribution_strategy:
            | "none"
            | "percentage_of_contribution"
            | "percentage_of_compensation"
            | "fixed"
            | null
          employer_match_percentage: number | null
          employer_match_percentage_limit: number | null
          growth_rate: number
          id: number
          initial_balance: number
          name: string
        }
        Insert: {
          created_at?: string | null
          creator?: string | null
          description?: string | null
          edited_at?: string | null
          editor?: string | null
          elective_contribution_fixed_amount?: number | null
          elective_contribution_percentage?: number | null
          elective_contribution_strategy:
            | "none"
            | "until_company_match"
            | "percentage_of_income"
            | "fixed"
            | "max"
          employer_compensation_match_percentage?: number | null
          employer_contributes?: boolean | null
          employer_contribution_fixed_amount?: number | null
          employer_contribution_strategy?:
            | "none"
            | "percentage_of_contribution"
            | "percentage_of_compensation"
            | "fixed"
            | null
          employer_match_percentage?: number | null
          employer_match_percentage_limit?: number | null
          growth_rate: number
          id?: number
          initial_balance: number
          name: string
        }
        Update: {
          created_at?: string | null
          creator?: string | null
          description?: string | null
          edited_at?: string | null
          editor?: string | null
          elective_contribution_fixed_amount?: number | null
          elective_contribution_percentage?: number | null
          elective_contribution_strategy?:
            | "none"
            | "until_company_match"
            | "percentage_of_income"
            | "fixed"
            | "max"
          employer_compensation_match_percentage?: number | null
          employer_contributes?: boolean | null
          employer_contribution_fixed_amount?: number | null
          employer_contribution_strategy?:
            | "none"
            | "percentage_of_contribution"
            | "percentage_of_compensation"
            | "fixed"
            | null
          employer_match_percentage?: number | null
          employer_match_percentage_limit?: number | null
          growth_rate?: number
          id?: number
          initial_balance?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      cash_reserve_strategy: "fixed" | "variable"
      command_object_table:
        | "brokerage"
        | "brokerage_template"
        | "cash_reserve"
        | "cash_reserve_template"
        | "debt"
        | "debt_template"
        | "expense"
        | "expense_template"
        | "income"
        | "income_template"
        | "ira"
        | "ira_template"
        | "roth_ira"
        | "roth_ira_template"
        | "tax_deferred"
        | "tax_deferred_template"
        | "plan"
        | "plan_template"
      command_sequence_ordering_type: "predefined" | "custom"
      contribution_strategy: "fixed" | "percentage_of_income" | "max"
      debt_payment_strategy:
        | "fixed"
        | "minimum_payment"
        | "maximum_payment"
        | "percentage_of_debt"
      employer_contribution_strategy:
        | "none"
        | "percentage_of_contribution"
        | "percentage_of_compensation"
        | "fixed"
      expense_type: "fixed" | "variable"
      frequency:
        | "monthly"
        | "weekly"
        | "biweekly"
        | "quarterly"
        | "annual"
        | "one_time"
      growth_application_strategy: "start" | "end"
      income_tax_strategy: "simple"
      income_type: "ordinary"
      insufficient_funds_strategy: "none" | "minimum_only" | "full"
      ira_contribution_strategy: "fixed" | "percentage_of_income" | "max"
      retirement_strategy:
        | "debt_free"
        | "age"
        | "percent_rule"
        | "target_savings"
      roth_ira_contribution_strategy: "fixed" | "percentage_of_income" | "max"
      tax_deferred_contribution_strategy:
        | "none"
        | "until_company_match"
        | "percentage_of_income"
        | "fixed"
        | "max"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
