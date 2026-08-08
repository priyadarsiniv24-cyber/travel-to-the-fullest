export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      expenses: {
        Row: {
          actual_amount: number | null
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          currency: string
          description: string | null
          estimated_amount: number | null
          id: string
          spent_on: string | null
          trip_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_amount?: number | null
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          currency?: string
          description?: string | null
          estimated_amount?: number | null
          id?: string
          spent_on?: string | null
          trip_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_amount?: number | null
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          currency?: string
          description?: string | null
          estimated_amount?: number | null
          id?: string
          spent_on?: string | null
          trip_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          home_city: string | null
          id: string
          preferred_currency: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          home_city?: string | null
          id: string
          preferred_currency?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          home_city?: string | null
          id?: string
          preferred_currency?: string
          updated_at?: string
        }
        Relationships: []
      }
      trip_days: {
        Row: {
          created_at: string
          day_date: string | null
          day_index: number
          id: string
          location: string | null
          notes: string | null
          trip_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day_date?: string | null
          day_index: number
          id?: string
          location?: string | null
          notes?: string | null
          trip_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day_date?: string | null
          day_index?: number
          id?: string
          location?: string | null
          notes?: string | null
          trip_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_days_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_items: {
        Row: {
          created_at: string
          currency: string | null
          data_status: Database["public"]["Enums"]["data_status"]
          day_id: string | null
          description: string | null
          duration_minutes: number | null
          estimated_cost: number | null
          id: string
          kind: Database["public"]["Enums"]["trip_item_kind"]
          location: string | null
          metadata: Json
          sort_order: number
          source_url: string | null
          start_time: string | null
          title: string
          transport_mode: string | null
          travel_minutes: number | null
          trip_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          data_status?: Database["public"]["Enums"]["data_status"]
          day_id?: string | null
          description?: string | null
          duration_minutes?: number | null
          estimated_cost?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["trip_item_kind"]
          location?: string | null
          metadata?: Json
          sort_order?: number
          source_url?: string | null
          start_time?: string | null
          title: string
          transport_mode?: string | null
          travel_minutes?: number | null
          trip_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          data_status?: Database["public"]["Enums"]["data_status"]
          day_id?: string | null
          description?: string | null
          duration_minutes?: number | null
          estimated_cost?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["trip_item_kind"]
          location?: string | null
          metadata?: Json
          sort_order?: number
          source_url?: string | null
          start_time?: string | null
          title?: string
          transport_mode?: string | null
          travel_minutes?: number | null
          trip_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_items_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "trip_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_items_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          accessibility_notes: string | null
          accommodation_preference: string | null
          activity_intensity: string
          adults: number
          brief: string | null
          budget_amount: number | null
          budget_currency: string
          children: number
          created_at: string
          destination: string
          display_currency: string
          end_date: string | null
          food_preferences: string[]
          id: string
          interests: string[]
          origin: string
          start_date: string | null
          status: Database["public"]["Enums"]["trip_status"]
          title: string
          transportation_preference: string | null
          travel_styles: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          accessibility_notes?: string | null
          accommodation_preference?: string | null
          activity_intensity?: string
          adults?: number
          brief?: string | null
          budget_amount?: number | null
          budget_currency?: string
          children?: number
          created_at?: string
          destination: string
          display_currency?: string
          end_date?: string | null
          food_preferences?: string[]
          id?: string
          interests?: string[]
          origin: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["trip_status"]
          title: string
          transportation_preference?: string | null
          travel_styles?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          accessibility_notes?: string | null
          accommodation_preference?: string | null
          activity_intensity?: string
          adults?: number
          brief?: string | null
          budget_amount?: number | null
          budget_currency?: string
          children?: number
          created_at?: string
          destination?: string
          display_currency?: string
          end_date?: string | null
          food_preferences?: string[]
          id?: string
          interests?: string[]
          origin?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["trip_status"]
          title?: string
          transportation_preference?: string | null
          travel_styles?: string[]
          updated_at?: string
          user_id?: string
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
      data_status: "live" | "verified" | "estimated" | "ai_recommendation"
      expense_category:
        | "flights"
        | "trains"
        | "buses"
        | "local_transport"
        | "hotels"
        | "food"
        | "activities"
        | "tickets"
        | "shopping"
        | "buffer"
        | "other"
      trip_item_kind:
        | "activity"
        | "meal"
        | "stay"
        | "transport"
        | "flight"
        | "note"
      trip_status: "draft" | "planned" | "active" | "completed" | "archived"
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
  public: {
    Enums: {
      data_status: ["live", "verified", "estimated", "ai_recommendation"],
      expense_category: [
        "flights",
        "trains",
        "buses",
        "local_transport",
        "hotels",
        "food",
        "activities",
        "tickets",
        "shopping",
        "buffer",
        "other",
      ],
      trip_item_kind: [
        "activity",
        "meal",
        "stay",
        "transport",
        "flight",
        "note",
      ],
      trip_status: ["draft", "planned", "active", "completed", "archived"],
    },
  },
} as const
