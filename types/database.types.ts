export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      brokerage: {
        Row: {
          contribution_fixed_amount: number | null
          contribution_percentage: number | null
          contribution_strategy: Database["public"]["Enums"]["contribution_strategy"]
          created_at: string
          creator_id: string | null
          edited_at: string
          editor_id: string | null
          growth_rate: number
          id: number
          initial_balance: number
          name: string
        }
        Insert: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?: Database["public"]["Enums"]["contribution_strategy"]
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_rate: number
          id?: never
          initial_balance: number
          name: string
        }
        Update: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?: Database["public"]["Enums"]["contribution_strategy"]
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_rate?: number
          id?: never
          initial_balance?: number
          name?: string
        }
        Relationships: []
      }
      brokerage_template: {
        Row: {
          contribution_fixed_amount: number | null
          contribution_percentage: number | null
          contribution_strategy: Database["public"]["Enums"]["contribution_strategy"]
          created_at: string
          creator_id: string | null
          description: string | null
          edited_at: string
          editor_id: string | null
          growth_rate: number
          id: number
          initial_balance: number
          name: string
        }
        Insert: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?: Database["public"]["Enums"]["contribution_strategy"]
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_rate: number
          id?: never
          initial_balance: number
          name: string
        }
        Update: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?: Database["public"]["Enums"]["contribution_strategy"]
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_rate?: number
          id?: never
          initial_balance?: number
          name?: string
        }
        Relationships: []
      }
      cash_reserve: {
        Row: {
          cash_reserve_strategy: Database["public"]["Enums"]["cash_reserve_strategy"]
          created_at: string
          creator_id: string | null
          edited_at: string
          editor_id: string | null
          id: number
          initial_amount: number
          name: string
          reserve_amount: number | null
          reserve_months: number | null
        }
        Insert: {
          cash_reserve_strategy: Database["public"]["Enums"]["cash_reserve_strategy"]
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          id?: never
          initial_amount: number
          name: string
          reserve_amount?: number | null
          reserve_months?: number | null
        }
        Update: {
          cash_reserve_strategy?: Database["public"]["Enums"]["cash_reserve_strategy"]
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          id?: never
          initial_amount?: number
          name?: string
          reserve_amount?: number | null
          reserve_months?: number | null
        }
        Relationships: []
      }
      cash_reserve_template: {
        Row: {
          cash_reserve_strategy: Database["public"]["Enums"]["cash_reserve_strategy"]
          created_at: string
          creator_id: string | null
          description: string | null
          edited_at: string
          editor_id: string | null
          id: number
          initial_amount: number
          name: string
          reserve_amount: number | null
          reserve_months: number | null
        }
        Insert: {
          cash_reserve_strategy: Database["public"]["Enums"]["cash_reserve_strategy"]
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          id?: never
          initial_amount: number
          name: string
          reserve_amount?: number | null
          reserve_months?: number | null
        }
        Update: {
          cash_reserve_strategy?: Database["public"]["Enums"]["cash_reserve_strategy"]
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          id?: never
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
          created_at: string
          creator_id: string | null
          edited_at: string
          editor_id: string | null
          id: number
          is_active: boolean
          item_id: number
          item_type: Database["public"]["Enums"]["command_item_type"]
        }
        Insert: {
          action: string
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          id?: never
          is_active?: boolean
          item_id: number
          item_type: Database["public"]["Enums"]["command_item_type"]
        }
        Update: {
          action?: string
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          id?: never
          is_active?: boolean
          item_id?: number
          item_type?: Database["public"]["Enums"]["command_item_type"]
        }
        Relationships: []
      }
      command_sequence: {
        Row: {
          created_at: string
          creator_id: string | null
          edited_at: string
          editor_id: string | null
          id: number
          name: string
          ordering_type: Database["public"]["Enums"]["command_sequence_ordering_type"]
          plan_id: number
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          id?: never
          name: string
          ordering_type?: Database["public"]["Enums"]["command_sequence_ordering_type"]
          plan_id: number
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          id?: never
          name?: string
          ordering_type?: Database["public"]["Enums"]["command_sequence_ordering_type"]
          plan_id?: number
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
          is_active: boolean
          order: number
          sequence_id: number
        }
        Insert: {
          command_id: number
          id?: never
          is_active?: boolean
          order: number
          sequence_id: number
        }
        Update: {
          command_id?: number
          id?: never
          is_active?: boolean
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
          created_at: string
          creator_id: string | null
          edited_at: string
          editor_id: string | null
          frequency: Database["public"]["Enums"]["frequency"]
          id: number
          interest_rate: number
          name: string
          payment_fixed_amount: number | null
          payment_minimum: number | null
          payment_percentage: number | null
          payment_strategy: Database["public"]["Enums"]["debt_payment_strategy"]
          principal: number
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          frequency: Database["public"]["Enums"]["frequency"]
          id?: never
          interest_rate: number
          name: string
          payment_fixed_amount?: number | null
          payment_minimum?: number | null
          payment_percentage?: number | null
          payment_strategy: Database["public"]["Enums"]["debt_payment_strategy"]
          principal: number
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          frequency?: Database["public"]["Enums"]["frequency"]
          id?: never
          interest_rate?: number
          name?: string
          payment_fixed_amount?: number | null
          payment_minimum?: number | null
          payment_percentage?: number | null
          payment_strategy?: Database["public"]["Enums"]["debt_payment_strategy"]
          principal?: number
        }
        Relationships: []
      }
      debt_template: {
        Row: {
          created_at: string
          creator_id: string | null
          description: string | null
          edited_at: string
          editor_id: string | null
          frequency: Database["public"]["Enums"]["frequency"]
          id: number
          interest_rate: number
          name: string
          payment_fixed_amount: number | null
          payment_minimum: number | null
          payment_percentage: number | null
          payment_strategy: Database["public"]["Enums"]["debt_payment_strategy"]
          principal: number
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          frequency: Database["public"]["Enums"]["frequency"]
          id?: never
          interest_rate: number
          name: string
          payment_fixed_amount?: number | null
          payment_minimum?: number | null
          payment_percentage?: number | null
          payment_strategy: Database["public"]["Enums"]["debt_payment_strategy"]
          principal: number
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          frequency?: Database["public"]["Enums"]["frequency"]
          id?: never
          interest_rate?: number
          name?: string
          payment_fixed_amount?: number | null
          payment_minimum?: number | null
          payment_percentage?: number | null
          payment_strategy?: Database["public"]["Enums"]["debt_payment_strategy"]
          principal?: number
        }
        Relationships: []
      }
      expense: {
        Row: {
          amount: number
          created_at: string
          creator_id: string | null
          edited_at: string
          editor_id: string | null
          expense_type: Database["public"]["Enums"]["expense_type"]
          frequency: Database["public"]["Enums"]["frequency"]
          grows_with_inflation: boolean
          growth_rate: number
          id: number
          is_essential: boolean
          is_tax_deductible: boolean
          name: string
        }
        Insert: {
          amount: number
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          expense_type: Database["public"]["Enums"]["expense_type"]
          frequency: Database["public"]["Enums"]["frequency"]
          grows_with_inflation?: boolean
          growth_rate: number
          id?: never
          is_essential?: boolean
          is_tax_deductible?: boolean
          name: string
        }
        Update: {
          amount?: number
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          expense_type?: Database["public"]["Enums"]["expense_type"]
          frequency?: Database["public"]["Enums"]["frequency"]
          grows_with_inflation?: boolean
          growth_rate?: number
          id?: never
          is_essential?: boolean
          is_tax_deductible?: boolean
          name?: string
        }
        Relationships: []
      }
      expense_template: {
        Row: {
          amount: number
          created_at: string
          creator_id: string | null
          description: string | null
          edited_at: string
          editor_id: string | null
          expense_type: Database["public"]["Enums"]["expense_type"]
          frequency: Database["public"]["Enums"]["frequency"]
          grows_with_inflation: boolean
          growth_rate: number
          id: number
          is_essential: boolean
          is_tax_deductible: boolean
          name: string
        }
        Insert: {
          amount: number
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          expense_type: Database["public"]["Enums"]["expense_type"]
          frequency: Database["public"]["Enums"]["frequency"]
          grows_with_inflation?: boolean
          growth_rate: number
          id?: never
          is_essential?: boolean
          is_tax_deductible?: boolean
          name: string
        }
        Update: {
          amount?: number
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          expense_type?: Database["public"]["Enums"]["expense_type"]
          frequency?: Database["public"]["Enums"]["frequency"]
          grows_with_inflation?: boolean
          growth_rate?: number
          id?: never
          is_essential?: boolean
          is_tax_deductible?: boolean
          name?: string
        }
        Relationships: []
      }
      hsa: {
        Row: {
          contribution_fixed_amount: number | null
          contribution_percentage: number | null
          contribution_strategy: Database["public"]["Enums"]["contribution_strategy"]
          created_at: string
          creator_id: string | null
          edited_at: string
          editor_id: string | null
          growth_rate: number
          id: number
          initial_balance: number
          name: string
        }
        Insert: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?: Database["public"]["Enums"]["contribution_strategy"]
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_rate: number
          id?: never
          initial_balance: number
          name: string
        }
        Update: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?: Database["public"]["Enums"]["contribution_strategy"]
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_rate?: number
          id?: never
          initial_balance?: number
          name?: string
        }
        Relationships: []
      }
      hsa_template: {
        Row: {
          contribution_fixed_amount: number | null
          contribution_percentage: number | null
          contribution_strategy: Database["public"]["Enums"]["contribution_strategy"]
          created_at: string
          creator_id: string | null
          description: string | null
          edited_at: string
          editor_id: string | null
          growth_rate: number
          id: number
          initial_balance: number
          name: string
        }
        Insert: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?: Database["public"]["Enums"]["contribution_strategy"]
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_rate: number
          id?: never
          initial_balance: number
          name: string
        }
        Update: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?: Database["public"]["Enums"]["contribution_strategy"]
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_rate?: number
          id?: never
          initial_balance?: number
          name?: string
        }
        Relationships: []
      }
      income: {
        Row: {
          created_at: string
          creator_id: string | null
          edited_at: string
          editor_id: string | null
          frequency: Database["public"]["Enums"]["frequency"]
          gross_income: number
          growth_rate: number
          id: number
          income_type: Database["public"]["Enums"]["income_type"]
          name: string
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          frequency?: Database["public"]["Enums"]["frequency"]
          gross_income: number
          growth_rate: number
          id?: never
          income_type?: Database["public"]["Enums"]["income_type"]
          name: string
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          frequency?: Database["public"]["Enums"]["frequency"]
          gross_income?: number
          growth_rate?: number
          id?: never
          income_type?: Database["public"]["Enums"]["income_type"]
          name?: string
        }
        Relationships: []
      }
      income_template: {
        Row: {
          created_at: string
          creator_id: string | null
          description: string | null
          edited_at: string
          editor_id: string | null
          frequency: Database["public"]["Enums"]["frequency"]
          gross_income: number
          growth_rate: number
          id: number
          income_type: Database["public"]["Enums"]["income_type"]
          name: string
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          frequency?: Database["public"]["Enums"]["frequency"]
          gross_income: number
          growth_rate: number
          id?: never
          income_type?: Database["public"]["Enums"]["income_type"]
          name: string
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          frequency?: Database["public"]["Enums"]["frequency"]
          gross_income?: number
          growth_rate?: number
          id?: never
          income_type?: Database["public"]["Enums"]["income_type"]
          name?: string
        }
        Relationships: []
      }
      ira: {
        Row: {
          contribution_fixed_amount: number | null
          contribution_percentage: number | null
          contribution_strategy: Database["public"]["Enums"]["ira_contribution_strategy"]
          created_at: string
          creator_id: string | null
          edited_at: string
          editor_id: string | null
          growth_rate: number
          id: number
          initial_balance: number
          name: string
        }
        Insert: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?: Database["public"]["Enums"]["ira_contribution_strategy"]
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_rate: number
          id?: never
          initial_balance: number
          name: string
        }
        Update: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?: Database["public"]["Enums"]["ira_contribution_strategy"]
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_rate?: number
          id?: never
          initial_balance?: number
          name?: string
        }
        Relationships: []
      }
      ira_template: {
        Row: {
          contribution_fixed_amount: number | null
          contribution_percentage: number | null
          contribution_strategy: Database["public"]["Enums"]["ira_contribution_strategy"]
          created_at: string
          creator_id: string | null
          description: string | null
          edited_at: string
          editor_id: string | null
          growth_rate: number
          id: number
          initial_balance: number
          name: string
        }
        Insert: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?: Database["public"]["Enums"]["ira_contribution_strategy"]
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_rate: number
          id?: never
          initial_balance: number
          name: string
        }
        Update: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?: Database["public"]["Enums"]["ira_contribution_strategy"]
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_rate?: number
          id?: never
          initial_balance?: number
          name?: string
        }
        Relationships: []
      }
      plan: {
        Row: {
          age: number
          created_at: string
          creator_id: string | null
          edited_at: string
          editor_id: string | null
          growth_application_strategy: Database["public"]["Enums"]["growth_application_strategy"]
          growth_rate: number
          id: number
          inflation_rate: number
          insufficient_funds_strategy: Database["public"]["Enums"]["insufficient_funds_strategy"]
          life_expectancy: number
          name: string
          retirement_age: number
          retirement_income_adjusted_for_inflation: boolean
          retirement_income_goal: number | null
          retirement_savings_amount: number | null
          retirement_strategy:
            | Database["public"]["Enums"]["retirement_strategy"]
            | null
          retirement_withdrawal_rate: number | null
          tax_rate: number
          tax_strategy: Database["public"]["Enums"]["income_tax_strategy"]
          year: number
        }
        Insert: {
          age?: number
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_application_strategy?: Database["public"]["Enums"]["growth_application_strategy"]
          growth_rate: number
          id?: never
          inflation_rate: number
          insufficient_funds_strategy?: Database["public"]["Enums"]["insufficient_funds_strategy"]
          life_expectancy: number
          name: string
          retirement_age?: number
          retirement_income_adjusted_for_inflation?: boolean
          retirement_income_goal?: number | null
          retirement_savings_amount?: number | null
          retirement_strategy?:
            | Database["public"]["Enums"]["retirement_strategy"]
            | null
          retirement_withdrawal_rate?: number | null
          tax_rate: number
          tax_strategy?: Database["public"]["Enums"]["income_tax_strategy"]
          year?: number
        }
        Update: {
          age?: number
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_application_strategy?: Database["public"]["Enums"]["growth_application_strategy"]
          growth_rate?: number
          id?: never
          inflation_rate?: number
          insufficient_funds_strategy?: Database["public"]["Enums"]["insufficient_funds_strategy"]
          life_expectancy?: number
          name?: string
          retirement_age?: number
          retirement_income_adjusted_for_inflation?: boolean
          retirement_income_goal?: number | null
          retirement_savings_amount?: number | null
          retirement_strategy?:
            | Database["public"]["Enums"]["retirement_strategy"]
            | null
          retirement_withdrawal_rate?: number | null
          tax_rate?: number
          tax_strategy?: Database["public"]["Enums"]["income_tax_strategy"]
          year?: number
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
          cash_reserve_id: number
          plan_id: number
        }
        Insert: {
          cash_reserve_id: number
          plan_id: number
        }
        Update: {
          cash_reserve_id?: number
          plan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_cash_reserves_cash_reserve_id_fkey"
            columns: ["cash_reserve_id"]
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
      plan_hsas: {
        Row: {
          hsa_id: number
          plan_id: number
        }
        Insert: {
          hsa_id: number
          plan_id: number
        }
        Update: {
          hsa_id?: number
          plan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_hsas_hsa_id_fkey"
            columns: ["hsa_id"]
            isOneToOne: false
            referencedRelation: "hsa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_hsas_plan_id_fkey"
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
          income_id: number | null
          ira_id: number
          plan_id: number
        }
        Insert: {
          income_id?: number | null
          ira_id: number
          plan_id: number
        }
        Update: {
          income_id?: number | null
          ira_id?: number
          plan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_iras_income_id_fkey"
            columns: ["income_id"]
            isOneToOne: false
            referencedRelation: "income"
            referencedColumns: ["id"]
          },
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
          income_id: number | null
          plan_id: number
          roth_ira_id: number
        }
        Insert: {
          income_id?: number | null
          plan_id: number
          roth_ira_id: number
        }
        Update: {
          income_id?: number | null
          plan_id?: number
          roth_ira_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_roth_iras_income_id_fkey"
            columns: ["income_id"]
            isOneToOne: false
            referencedRelation: "income"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_roth_iras_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_roth_iras_roth_ira_id_fkey"
            columns: ["roth_ira_id"]
            isOneToOne: false
            referencedRelation: "roth_ira"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_tax_deferreds: {
        Row: {
          income_id: number | null
          plan_id: number
          tax_deferred_id: number
        }
        Insert: {
          income_id?: number | null
          plan_id: number
          tax_deferred_id: number
        }
        Update: {
          income_id?: number | null
          plan_id?: number
          tax_deferred_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_tax_deferreds_income_id_fkey"
            columns: ["income_id"]
            isOneToOne: false
            referencedRelation: "income"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_tax_deferreds_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_tax_deferreds_tax_deferred_id_fkey"
            columns: ["tax_deferred_id"]
            isOneToOne: false
            referencedRelation: "tax_deferred"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_template: {
        Row: {
          age: number | null
          created_at: string
          creator_id: string | null
          description: string | null
          edited_at: string
          editor_id: string | null
          id: number
          inflation_rate: number | null
          insufficient_funds_strategy: Database["public"]["Enums"]["insufficient_funds_strategy"]
          name: string
          year: number | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          id?: never
          inflation_rate?: number | null
          insufficient_funds_strategy?: Database["public"]["Enums"]["insufficient_funds_strategy"]
          name: string
          year?: number | null
        }
        Update: {
          age?: number | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          id?: never
          inflation_rate?: number | null
          insufficient_funds_strategy?: Database["public"]["Enums"]["insufficient_funds_strategy"]
          name?: string
          year?: number | null
        }
        Relationships: []
      }
      plan_template_brokerage_templates: {
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
            foreignKeyName: "plan_template_brokerage_templates_brokerage_template_id_fkey"
            columns: ["brokerage_template_id"]
            isOneToOne: false
            referencedRelation: "brokerage_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_template_brokerage_templates_plan_template_id_fkey"
            columns: ["plan_template_id"]
            isOneToOne: false
            referencedRelation: "plan_template"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_template_cash_reserve_templates: {
        Row: {
          cash_reserve_template_id: number
          plan_template_id: number
        }
        Insert: {
          cash_reserve_template_id: number
          plan_template_id: number
        }
        Update: {
          cash_reserve_template_id?: number
          plan_template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_template_cash_reserve_templa_cash_reserve_template_id_fkey"
            columns: ["cash_reserve_template_id"]
            isOneToOne: false
            referencedRelation: "cash_reserve_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_template_cash_reserve_templates_plan_template_id_fkey"
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
      plan_template_hsa_templates: {
        Row: {
          hsa_template_id: number
          plan_template_id: number
        }
        Insert: {
          hsa_template_id: number
          plan_template_id: number
        }
        Update: {
          hsa_template_id?: number
          plan_template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_template_hsa_templates_hsa_template_id_fkey"
            columns: ["hsa_template_id"]
            isOneToOne: false
            referencedRelation: "hsa_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_template_hsa_templates_plan_template_id_fkey"
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
      plan_template_ira_templates: {
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
            foreignKeyName: "plan_template_ira_templates_ira_template_id_fkey"
            columns: ["ira_template_id"]
            isOneToOne: false
            referencedRelation: "ira_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_template_ira_templates_plan_template_id_fkey"
            columns: ["plan_template_id"]
            isOneToOne: false
            referencedRelation: "plan_template"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_template_roth_ira_templates: {
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
            foreignKeyName: "plan_template_roth_ira_templates_plan_template_id_fkey"
            columns: ["plan_template_id"]
            isOneToOne: false
            referencedRelation: "plan_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_template_roth_ira_templates_roth_ira_template_id_fkey"
            columns: ["roth_ira_template_id"]
            isOneToOne: false
            referencedRelation: "roth_ira_template"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_template_tax_deferred_templates: {
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
            foreignKeyName: "plan_template_tax_deferred_templa_tax_deferred_template_id_fkey"
            columns: ["tax_deferred_template_id"]
            isOneToOne: false
            referencedRelation: "tax_deferred_template"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_template_tax_deferred_templates_plan_template_id_fkey"
            columns: ["plan_template_id"]
            isOneToOne: false
            referencedRelation: "plan_template"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          birthday: string | null
          created_at: string
          edited_at: string
          first_name: string | null
          id: number
          is_admin: boolean
          last_name: string | null
          life_expectancy: number | null
          user_id: string
        }
        Insert: {
          birthday?: string | null
          created_at?: string
          edited_at?: string
          first_name?: string | null
          id?: never
          is_admin?: boolean
          last_name?: string | null
          life_expectancy?: number | null
          user_id: string
        }
        Update: {
          birthday?: string | null
          created_at?: string
          edited_at?: string
          first_name?: string | null
          id?: never
          is_admin?: boolean
          last_name?: string | null
          life_expectancy?: number | null
          user_id?: string
        }
        Relationships: []
      }
      roth_ira: {
        Row: {
          contribution_fixed_amount: number | null
          contribution_percentage: number | null
          contribution_strategy: Database["public"]["Enums"]["roth_ira_contribution_strategy"]
          created_at: string
          creator_id: string | null
          edited_at: string
          editor_id: string | null
          growth_rate: number
          id: number
          initial_balance: number
          name: string
        }
        Insert: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?: Database["public"]["Enums"]["roth_ira_contribution_strategy"]
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_rate: number
          id?: never
          initial_balance: number
          name: string
        }
        Update: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?: Database["public"]["Enums"]["roth_ira_contribution_strategy"]
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_rate?: number
          id?: never
          initial_balance?: number
          name?: string
        }
        Relationships: []
      }
      roth_ira_template: {
        Row: {
          contribution_fixed_amount: number | null
          contribution_percentage: number | null
          contribution_strategy: Database["public"]["Enums"]["roth_ira_contribution_strategy"]
          created_at: string
          creator_id: string | null
          description: string | null
          edited_at: string
          editor_id: string | null
          growth_rate: number
          id: number
          initial_balance: number
          name: string
        }
        Insert: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?: Database["public"]["Enums"]["roth_ira_contribution_strategy"]
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_rate: number
          id?: never
          initial_balance: number
          name: string
        }
        Update: {
          contribution_fixed_amount?: number | null
          contribution_percentage?: number | null
          contribution_strategy?: Database["public"]["Enums"]["roth_ira_contribution_strategy"]
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          growth_rate?: number
          id?: never
          initial_balance?: number
          name?: string
        }
        Relationships: []
      }
      tax_deferred: {
        Row: {
          created_at: string
          creator_id: string | null
          edited_at: string
          editor_id: string | null
          elective_contribution_fixed_amount: number | null
          elective_contribution_percentage: number | null
          elective_contribution_strategy: Database["public"]["Enums"]["tax_deferred_contribution_strategy"]
          employer_compensation_match_percentage: number | null
          employer_contributes: boolean
          employer_contribution_fixed_amount: number | null
          employer_contribution_strategy:
            | Database["public"]["Enums"]["employer_contribution_strategy"]
            | null
          employer_match_percentage: number | null
          employer_match_percentage_limit: number | null
          growth_rate: number
          id: number
          initial_balance: number
          name: string
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          elective_contribution_fixed_amount?: number | null
          elective_contribution_percentage?: number | null
          elective_contribution_strategy: Database["public"]["Enums"]["tax_deferred_contribution_strategy"]
          employer_compensation_match_percentage?: number | null
          employer_contributes?: boolean
          employer_contribution_fixed_amount?: number | null
          employer_contribution_strategy?:
            | Database["public"]["Enums"]["employer_contribution_strategy"]
            | null
          employer_match_percentage?: number | null
          employer_match_percentage_limit?: number | null
          growth_rate: number
          id?: never
          initial_balance: number
          name: string
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          elective_contribution_fixed_amount?: number | null
          elective_contribution_percentage?: number | null
          elective_contribution_strategy?: Database["public"]["Enums"]["tax_deferred_contribution_strategy"]
          employer_compensation_match_percentage?: number | null
          employer_contributes?: boolean
          employer_contribution_fixed_amount?: number | null
          employer_contribution_strategy?:
            | Database["public"]["Enums"]["employer_contribution_strategy"]
            | null
          employer_match_percentage?: number | null
          employer_match_percentage_limit?: number | null
          growth_rate?: number
          id?: never
          initial_balance?: number
          name?: string
        }
        Relationships: []
      }
      tax_deferred_template: {
        Row: {
          created_at: string
          creator_id: string | null
          description: string | null
          edited_at: string
          editor_id: string | null
          elective_contribution_fixed_amount: number | null
          elective_contribution_percentage: number | null
          elective_contribution_strategy: Database["public"]["Enums"]["tax_deferred_contribution_strategy"]
          employer_compensation_match_percentage: number | null
          employer_contributes: boolean
          employer_contribution_fixed_amount: number | null
          employer_contribution_strategy:
            | Database["public"]["Enums"]["employer_contribution_strategy"]
            | null
          employer_match_percentage: number | null
          employer_match_percentage_limit: number | null
          growth_rate: number
          id: number
          initial_balance: number
          name: string
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          elective_contribution_fixed_amount?: number | null
          elective_contribution_percentage?: number | null
          elective_contribution_strategy: Database["public"]["Enums"]["tax_deferred_contribution_strategy"]
          employer_compensation_match_percentage?: number | null
          employer_contributes?: boolean
          employer_contribution_fixed_amount?: number | null
          employer_contribution_strategy?:
            | Database["public"]["Enums"]["employer_contribution_strategy"]
            | null
          employer_match_percentage?: number | null
          employer_match_percentage_limit?: number | null
          growth_rate: number
          id?: never
          initial_balance: number
          name: string
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          description?: string | null
          edited_at?: string
          editor_id?: string | null
          elective_contribution_fixed_amount?: number | null
          elective_contribution_percentage?: number | null
          elective_contribution_strategy?: Database["public"]["Enums"]["tax_deferred_contribution_strategy"]
          employer_compensation_match_percentage?: number | null
          employer_contributes?: boolean
          employer_contribution_fixed_amount?: number | null
          employer_contribution_strategy?:
            | Database["public"]["Enums"]["employer_contribution_strategy"]
            | null
          employer_match_percentage?: number | null
          employer_match_percentage_limit?: number | null
          growth_rate?: number
          id?: never
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
      command_item_type:
        | "brokerage"
        | "brokerage_template"
        | "cash_reserve"
        | "cash_reserve_template"
        | "debt"
        | "debt_template"
        | "expense"
        | "expense_template"
        | "hsa"
        | "hsa_template"
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      cash_reserve_strategy: ["fixed", "variable"],
      command_item_type: [
        "brokerage",
        "brokerage_template",
        "cash_reserve",
        "cash_reserve_template",
        "debt",
        "debt_template",
        "expense",
        "expense_template",
        "hsa",
        "hsa_template",
        "income",
        "income_template",
        "ira",
        "ira_template",
        "roth_ira",
        "roth_ira_template",
        "tax_deferred",
        "tax_deferred_template",
        "plan",
        "plan_template",
      ],
      command_sequence_ordering_type: ["predefined", "custom"],
      contribution_strategy: ["fixed", "percentage_of_income", "max"],
      debt_payment_strategy: [
        "fixed",
        "minimum_payment",
        "maximum_payment",
        "percentage_of_debt",
      ],
      employer_contribution_strategy: [
        "none",
        "percentage_of_contribution",
        "percentage_of_compensation",
        "fixed",
      ],
      expense_type: ["fixed", "variable"],
      frequency: [
        "monthly",
        "weekly",
        "biweekly",
        "quarterly",
        "annual",
        "one_time",
      ],
      growth_application_strategy: ["start", "end"],
      income_tax_strategy: ["simple"],
      income_type: ["ordinary"],
      insufficient_funds_strategy: ["none", "minimum_only", "full"],
      ira_contribution_strategy: ["fixed", "percentage_of_income", "max"],
      retirement_strategy: [
        "debt_free",
        "age",
        "percent_rule",
        "target_savings",
      ],
      roth_ira_contribution_strategy: ["fixed", "percentage_of_income", "max"],
      tax_deferred_contribution_strategy: [
        "none",
        "until_company_match",
        "percentage_of_income",
        "fixed",
        "max",
      ],
    },
  },
} as const

