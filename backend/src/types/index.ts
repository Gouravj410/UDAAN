export interface User {
  id: string;
  uuid: string;
  email: string;
  keycloakId?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  role: UserRole;
  status: UserStatus;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CitizenProfile {
  id: string;
  uuid: string;
  userId: string;
  aadharNumber?: string;
  dateOfBirth?: Date;
  gender?: string;
  category?: string;
  familyIncome?: number;
  documents?: Document[];
  auditLogs?: AuditLog[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Document {
  id: string;
  uuid: string;
  citizenProfileId: string;
  documentType: string;
  documentUrl: string;
  verificationStatus: VerificationStatus;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  uuid: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  userId: string;
  changes: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

export enum UserRole {
  CITIZEN = 'CITIZEN',
  OFFICER = 'OFFICER',
  ADMIN = 'ADMIN',
  SYSTEM = 'SYSTEM',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  VERIFY = 'VERIFY',
  REJECT = 'REJECT',
}

export interface JwtPayload {
  sub: string;
  email: string;
  givenName: string;
  familyName: string;
  roles: string[];
  iat: number;
  exp: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ApplicationError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApplicationError';
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}
