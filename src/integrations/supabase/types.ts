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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      account_recovery: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          recovery_type: string
          recovery_value: string
          updated_at: string | null
          user_id: string
          verified: boolean | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          recovery_type: string
          recovery_value: string
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          recovery_type?: string
          recovery_value?: string
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
          verified_at?: string | null
        }
        Relationships: []
      }
      community_questions: {
        Row: {
          author_avatar: string | null
          author_name: string
          category: string
          content: string
          created_at: string
          dislikes: number
          id: string
          is_best_answer: boolean
          likes: number
          replies: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_avatar?: string | null
          author_name: string
          category?: string
          content: string
          created_at?: string
          dislikes?: number
          id?: string
          is_best_answer?: boolean
          likes?: number
          replies?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_avatar?: string | null
          author_name?: string
          category?: string
          content?: string
          created_at?: string
          dislikes?: number
          id?: string
          is_best_answer?: boolean
          likes?: number
          replies?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_replies: {
        Row: {
          author_avatar: string | null
          author_name: string
          content: string
          created_at: string
          dislikes: number
          id: string
          is_best_answer: boolean
          likes: number
          question_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_avatar?: string | null
          author_name: string
          content: string
          created_at?: string
          dislikes?: number
          id?: string
          is_best_answer?: boolean
          likes?: number
          question_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_avatar?: string | null
          author_name?: string
          content?: string
          created_at?: string
          dislikes?: number
          id?: string
          is_best_answer?: boolean
          likes?: number
          question_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_replies_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "community_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      community_votes: {
        Row: {
          created_at: string
          id: string
          question_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_votes_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "community_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      login_history: {
        Row: {
          created_at: string | null
          device_fingerprint: string | null
          failure_reason: string | null
          id: string
          ip_address: string | null
          location: string | null
          login_method: string
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_fingerprint?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          login_method: string
          success: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_fingerprint?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          login_method?: string
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      phone_verification_codes: {
        Row: {
          attempts: number | null
          code: string
          created_at: string | null
          expires_at: string
          id: string
          phone_number: string
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          attempts?: number | null
          code: string
          created_at?: string | null
          expires_at: string
          id?: string
          phone_number: string
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          attempts?: number | null
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          phone_number?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_range: string | null
          area_of_expertise: string | null
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          institution_name: string | null
          institution_size: string | null
          is_kyc_verified: boolean | null
          learning_interests: string[] | null
          phone: string | null
          phone_number: string | null
          phone_verified: boolean | null
          phone_verified_at: string | null
          preferred_auth_method: string | null
          secondary_email: string | null
          secondary_phone: string | null
          updated_at: string | null
          years_of_experience: number | null
        }
        Insert: {
          age_range?: string | null
          area_of_expertise?: string | null
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          institution_name?: string | null
          institution_size?: string | null
          is_kyc_verified?: boolean | null
          learning_interests?: string[] | null
          phone?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          phone_verified_at?: string | null
          preferred_auth_method?: string | null
          secondary_email?: string | null
          secondary_phone?: string | null
          updated_at?: string | null
          years_of_experience?: number | null
        }
        Update: {
          age_range?: string | null
          area_of_expertise?: string | null
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          institution_name?: string | null
          institution_size?: string | null
          is_kyc_verified?: boolean | null
          learning_interests?: string[] | null
          phone?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          phone_verified_at?: string | null
          preferred_auth_method?: string | null
          secondary_email?: string | null
          secondary_phone?: string | null
          updated_at?: string | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          bonus_amount: number
          code: string
          created_at: string
          id: string
          is_active: boolean
          usage_count: number
        }
        Insert: {
          bonus_amount?: number
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          usage_count?: number
        }
        Update: {
          bonus_amount?: number
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          usage_count?: number
        }
        Relationships: []
      }
      reply_votes: {
        Row: {
          created_at: string
          id: string
          reply_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          reply_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          reply_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reply_votes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "community_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      signup_bonuses: {
        Row: {
          base_bonus: number
          claimed: boolean
          created_at: string
          id: string
          referral_bonus: number
          referral_code: string | null
          total_bonus: number | null
          user_id: string
        }
        Insert: {
          base_bonus?: number
          claimed?: boolean
          created_at?: string
          id?: string
          referral_bonus?: number
          referral_code?: string | null
          total_bonus?: number | null
          user_id: string
        }
        Update: {
          base_bonus?: number
          claimed?: boolean
          created_at?: string
          id?: string
          referral_bonus?: number
          referral_code?: string | null
          total_bonus?: number | null
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
          ticket_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject: string
          ticket_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
          ticket_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      trusted_devices: {
        Row: {
          created_at: string | null
          device_fingerprint: string
          device_name: string | null
          device_type: string | null
          expires_at: string | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          last_used_at: string | null
          trusted_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_fingerprint: string
          device_name?: string | null
          device_type?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_used_at?: string | null
          trusted_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_fingerprint?: string
          device_name?: string | null
          device_type?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_used_at?: string | null
          trusted_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_codes: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "learner" | "instructor" | "institution" | "admin"
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
      app_role: ["learner", "instructor", "institution", "admin"],
    },
  },
} as const
