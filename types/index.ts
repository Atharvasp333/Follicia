/**
 * Follicia — Global TypeScript Interfaces
 * Shared types used across the entire application.
 */

// ─── User ─────────────────────────────────────────────────
export interface User {
    id: string;
    clerkId: string;
    email: string;
    name?: string | null;
    imageUrl?: string | null;
    hairType?: string | null;
    porosity?: string | null;
    scalpCondition?: string | null;
    porosityScore?: number | null;
    scalpHealth?: number | null;
    primaryConcern?: string | null;
    hairAnalysis?: string | null;
    targetTags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

// ─── Hair Analysis ────────────────────────────────────────
export interface HairAnalysisInput {
    texture: number;
    porosityChecks: string[];
    scalp: string;
    chemicalHistory: string[];
    clinicalNotes: string;
}

export interface HairAnalysisResult {
    porosityScore: number;
    scalpHealth: number;
    primaryConcern: string;
    analysis: string;
    targetTags: string[];
}

// ─── Product ──────────────────────────────────────────────
export interface Product {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    category?: string | null;
    stock: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Order ────────────────────────────────────────────────
export type OrderStatus =
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    product: Product;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    userId: string;
    user: User;
    status: OrderStatus;
    totalAmount: number;
    razorpayOrderId?: string | null;
    razorpayPaymentId?: string | null;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}

// ─── API Responses ────────────────────────────────────────
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

// ─── Cart ─────────────────────────────────────────────────
export interface CartItem {
    product: Product;
    quantity: number;
}
