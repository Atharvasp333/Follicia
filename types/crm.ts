// Type definitions for CRM Intelligence Dashboard

export type ChurnStatus = "active" | "at-risk" | "churned" | "new";

export interface UserChurnAnalysis {
  id: string;
  name: string;
  email: string;
  status: ChurnStatus;
  daysSinceLastPurchase: number | null;
  lastPurchaseDate: string | null;
  loyaltyPoints: number;
}

export interface ChurnStats {
  active: number;
  atRisk: number;
  churned: number;
  new: number;
}

export interface HairDNASegmentation {
  scalpTypes: Record<string, number>;
  porosityLevels: Record<string, number>;
  hairTypes: Record<string, number>;
}

export interface CRMIntelligenceData {
  hairDnaSegmentation: HairDNASegmentation;
  churnAnalysis: UserChurnAnalysis[];
  churnStats: ChurnStats;
  totalUsers: number;
}

export interface SegmentData {
  name: string;
  value: number;
  action: string;
}

export interface StatusConfig {
  color: string;
  bg: string;
  label: string;
  pulse: boolean;
}

export type SegmentCategory = "scalp" | "porosity" | "hairType";

export interface RecommendedAction {
  category: SegmentCategory;
  type: string;
  action: string;
}
