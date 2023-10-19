export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categoria: {
        Row: {
          descricao: string | null
          id: string
          id_usuario: string
          nome: string
        }
        Insert: {
          descricao?: string | null
          id: string
          id_usuario: string
          nome: string
        }
        Update: {
          descricao?: string | null
          id?: string
          id_usuario?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_usuario"
            columns: ["id_usuario"]
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          }
        ]
      }
      marco: {
        Row: {
          data: string
          id: string
          id_meta: string
          valor_obtido: number
        }
        Insert: {
          data: string
          id: string
          id_meta: string
          valor_obtido: number
        }
        Update: {
          data?: string
          id?: string
          id_meta?: string
          valor_obtido?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_meta"
            columns: ["id_meta"]
            referencedRelation: "meta"
            referencedColumns: ["id"]
          }
        ]
      }
      meta: {
        Row: {
          datafinal: string | null
          id: string
          id_usuario: string
          progresso: number
          valor_desejado: number
          valor_obtido: number
        }
        Insert: {
          datafinal?: string | null
          id: string
          id_usuario: string
          progresso?: number
          valor_desejado: number
          valor_obtido?: number
        }
        Update: {
          datafinal?: string | null
          id?: string
          id_usuario?: string
          progresso?: number
          valor_desejado?: number
          valor_obtido?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_usuario"
            columns: ["id_usuario"]
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          }
        ]
      }
      orcamento: {
        Row: {
          id: string
          id_categoria: string
          id_usuario: string
          limite: number
        }
        Insert: {
          id: string
          id_categoria: string
          id_usuario: string
          limite: number
        }
        Update: {
          id?: string
          id_categoria?: string
          id_usuario?: string
          limite?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_categoria"
            columns: ["id_categoria"]
            referencedRelation: "categoria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_usuario"
            columns: ["id_usuario"]
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          }
        ]
      }
      submeta: {
        Row: {
          descricao: string | null
          id: number
          id_meta: string
          nome: string
          valor_desejavel: number
          valor_obtido: number
        }
        Insert: {
          descricao?: string | null
          id: number
          id_meta: string
          nome: string
          valor_desejavel: number
          valor_obtido?: number
        }
        Update: {
          descricao?: string | null
          id?: number
          id_meta?: string
          nome?: string
          valor_desejavel?: number
          valor_obtido?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_meta"
            columns: ["id_meta"]
            referencedRelation: "meta"
            referencedColumns: ["id"]
          }
        ]
      }
      transacao: {
        Row: {
          data: string
          descricao: string | null
          id: string
          id_categoria: string
          id_usuario: string
          tipo: string
          titulo: string
          valor: number
        }
        Insert: {
          data: string
          descricao?: string | null
          id: string
          id_categoria: string
          id_usuario: string
          tipo: string
          titulo: string
          valor: number
        }
        Update: {
          data?: string
          descricao?: string | null
          id?: string
          id_categoria?: string
          id_usuario?: string
          tipo?: string
          titulo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_categoria"
            columns: ["id_categoria"]
            referencedRelation: "categoria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_usuario"
            columns: ["id_usuario"]
            referencedRelation: "usuario"
            referencedColumns: ["id"]
          }
        ]
      }
      usuario: {
        Row: {
          email: string
          id: string
          nome: string
          saldo: number
          senha: string
        }
        Insert: {
          email: string
          id: string
          nome: string
          saldo?: number
          senha: string
        }
        Update: {
          email?: string
          id?: string
          nome?: string
          saldo?: number
          senha?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
