/** One entry in the administrative audit trail. */
export interface AuditEntry {
  id: string;
  actor_id?: string;
  actor_email?: string;
  actor_role?: string;
  action: string;
  resource: string;
  resource_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
