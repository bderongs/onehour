export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      client_requests: {
        Row: {
          client_id: string
          created_at: string
          id: string
          message: string | null
          spark_id: string
          status: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          message?: string | null
          spark_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          message?: string | null
          spark_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_requests_spark_id_fkey"
            columns: ["spark_id"]
            isOneToOne: false
            referencedRelation: "sparks"
            referencedColumns: ["id"]
          },
        ]
      }
      consultant_missions: {
        Row: {
          company: string
          consultant_id: string
          created_at: string
          description: string
          duration: string
          id: string
          is_highlighted: boolean | null
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          company: string
          consultant_id: string
          created_at?: string
          description: string
          duration: string
          id?: string
          is_highlighted?: boolean | null
          start_date?: string
          title: string
          updated_at?: string
        }
        Update: {
          company?: string
          consultant_id?: string
          created_at?: string
          description?: string
          duration?: string
          id?: string
          is_highlighted?: boolean | null
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultant_missions_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consultant_reviews: {
        Row: {
          consultant_id: string
          created_at: string
          id: string
          is_verified: boolean | null
          rating: number
          review_text: string
          reviewer_company: string | null
          reviewer_image_url: string | null
          reviewer_name: string
          reviewer_role: string | null
          updated_at: string
        }
        Insert: {
          consultant_id: string
          created_at?: string
          id?: string
          is_verified?: boolean | null
          rating: number
          review_text: string
          reviewer_company?: string | null
          reviewer_image_url?: string | null
          reviewer_name: string
          reviewer_role?: string | null
          updated_at?: string
        }
        Update: {
          consultant_id?: string
          created_at?: string
          id?: string
          is_verified?: boolean | null
          rating?: number
          review_text?: string
          reviewer_company?: string | null
          reviewer_image_url?: string | null
          reviewer_name?: string
          reviewer_role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultant_reviews_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          average_rating: number | null
          bio: string | null
          booking_url: string | null
          company: string | null
          company_title: string | null
          created_at: string
          email: string
          facebook: string | null
          first_name: string
          id: string
          instagram: string | null
          is_verified: boolean | null
          key_competencies: string[] | null
          languages: string[] | null
          last_name: string
          linkedin: string | null
          location: string | null
          medium: string | null
          profile_image_url: string | null
          review_count: number | null
          roles: Database["public"]["Enums"]["user_role"][]
          slug: string | null
          substack: string | null
          title: string | null
          twitter: string | null
          updated_at: string
          verification_date: string | null
          website: string | null
          youtube: string | null
        }
        Insert: {
          average_rating?: number | null
          bio?: string | null
          booking_url?: string | null
          company?: string | null
          company_title?: string | null
          created_at?: string
          email: string
          facebook?: string | null
          first_name: string
          id: string
          instagram?: string | null
          is_verified?: boolean | null
          key_competencies?: string[] | null
          languages?: string[] | null
          last_name: string
          linkedin?: string | null
          location?: string | null
          medium?: string | null
          profile_image_url?: string | null
          review_count?: number | null
          roles?: Database["public"]["Enums"]["user_role"][]
          slug?: string | null
          substack?: string | null
          title?: string | null
          twitter?: string | null
          updated_at?: string
          verification_date?: string | null
          website?: string | null
          youtube?: string | null
        }
        Update: {
          average_rating?: number | null
          bio?: string | null
          booking_url?: string | null
          company?: string | null
          company_title?: string | null
          created_at?: string
          email?: string
          facebook?: string | null
          first_name?: string
          id?: string
          instagram?: string | null
          is_verified?: boolean | null
          key_competencies?: string[] | null
          languages?: string[] | null
          last_name?: string
          linkedin?: string | null
          location?: string | null
          medium?: string | null
          profile_image_url?: string | null
          review_count?: number | null
          roles?: Database["public"]["Enums"]["user_role"][]
          slug?: string | null
          substack?: string | null
          title?: string | null
          twitter?: string | null
          updated_at?: string
          verification_date?: string | null
          website?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      sparks: {
        Row: {
          benefits: string[] | null
          consultant: string | null
          created_at: string
          deliverables: string[] | null
          description: string | null
          detailed_description: string | null
          duration: unknown
          expert_profile: Json | null
          faq: Json[] | null
          highlight: string | null
          id: string
          methodology: string[] | null
          next_steps: string[] | null
          prefill_text: string
          prerequisites: string[] | null
          price: number | null
          social_image_url: string | null
          target_audience: string[] | null
          testimonials: Json[] | null
          title: string
          updated_at: string
          slug: string
        }
        Insert: {
          benefits?: string[] | null
          consultant?: string | null
          created_at?: string
          deliverables?: string[] | null
          description?: string | null
          detailed_description?: string | null
          duration: unknown
          expert_profile?: Json | null
          faq?: Json[] | null
          highlight?: string | null
          id?: string
          methodology?: string[] | null
          next_steps?: string[] | null
          prefill_text: string
          prerequisites?: string[] | null
          price?: number | null
          social_image_url?: string | null
          target_audience?: string[] | null
          testimonials?: Json[] | null
          title: string
          updated_at?: string
          slug: string
        }
        Update: {
          benefits?: string[] | null
          consultant?: string | null
          created_at?: string
          deliverables?: string[] | null
          description?: string | null
          detailed_description?: string | null
          duration?: unknown
          expert_profile?: Json | null
          faq?: Json[] | null
          highlight?: string | null
          id?: string
          methodology?: string[] | null
          next_steps?: string[] | null
          prefill_text?: string
          prerequisites?: string[] | null
          price?: number | null
          social_image_url?: string | null
          target_audience?: string[] | null
          testimonials?: Json[] | null
          title?: string
          updated_at?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "sparks_consultant_fkey"
            columns: ["consultant"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      user_role: "client" | "consultant" | "admin"
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
