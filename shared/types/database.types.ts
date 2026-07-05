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
          plan_id: number
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
          plan_id: number
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
          plan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "brokerage_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
        ]
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
          plan_id: number
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
          plan_id: number
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
          plan_id?: number
          reserve_amount?: number | null
          reserve_months?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_reserve_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
        ]
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
          model_id: number
          model_name: Database["public"]["Enums"]["model_name"]
        }
        Insert: {
          action: string
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          id?: never
          is_active?: boolean
          model_id: number
          model_name: Database["public"]["Enums"]["model_name"]
        }
        Update: {
          action?: string
          created_at?: string
          creator_id?: string | null
          edited_at?: string
          editor_id?: string | null
          id?: never
          is_active?: boolean
          model_id?: number
          model_name?: Database["public"]["Enums"]["model_name"]
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
          plan_id: number
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
          plan_id: number
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
          plan_id?: number
          principal?: number
        }
        Relationships: [
          {
            foreignKeyName: "debt_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
        ]
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
          is_retirement_only: boolean
          is_tax_deductible: boolean
          name: string
          plan_id: number
          retirement_spending_percentage: number
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
          is_retirement_only?: boolean
          is_tax_deductible?: boolean
          name: string
          plan_id: number
          retirement_spending_percentage?: number
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
          is_retirement_only?: boolean
          is_tax_deductible?: boolean
          name?: string
          plan_id?: number
          retirement_spending_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "expense_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
        ]
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
          plan_id: number
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
          plan_id: number
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
          plan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "hsa_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
        ]
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
          plan_id: number
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
          plan_id: number
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
          plan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "income_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
        ]
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
          income_id: number | null
          initial_balance: number
          name: string
          plan_id: number
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
          income_id?: number | null
          initial_balance: number
          name: string
          plan_id: number
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
          income_id?: number | null
          initial_balance?: number
          name?: string
          plan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ira_income_id_fkey"
            columns: ["income_id"]
            isOneToOne: false
            referencedRelation: "income"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ira_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
        ]
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
          income_id: number | null
          initial_balance: number
          name: string
          plan_id: number
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
          income_id?: number | null
          initial_balance: number
          name: string
          plan_id: number
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
          income_id?: number | null
          initial_balance?: number
          name?: string
          plan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "roth_ira_income_id_fkey"
            columns: ["income_id"]
            isOneToOne: false
            referencedRelation: "income"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roth_ira_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
        ]
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
          income_id: number | null
          initial_balance: number
          name: string
          plan_id: number
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
          income_id?: number | null
          initial_balance: number
          name: string
          plan_id: number
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
          income_id?: number | null
          initial_balance?: number
          name?: string
          plan_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tax_deferred_income_id_fkey"
            columns: ["income_id"]
            isOneToOne: false
            referencedRelation: "income"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_deferred_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
        ]
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
      model_name:
        | "brokerage"
        | "cash_reserve"
        | "debt"
        | "expense"
        | "hsa"
        | "income"
        | "ira"
        | "roth_ira"
        | "tax_deferred"
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
      model_name: [
        "brokerage",
        "cash_reserve",
        "debt",
        "expense",
        "hsa",
        "income",
        "ira",
        "roth_ira",
        "tax_deferred",
      ],
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

