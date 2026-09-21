// Retire gemini-2.5-flash and promote gemini-3.6-flash / gemini-3.7-flash
import type { Db } from '../types.js';

export function up(db: Db): void {
  // Disable deprecated gemini-2.5-flash and gemini-2.5-flash-lite
  db.prepare(`
    UPDATE models 
    SET enabled = 0 
    WHERE platform = 'google' AND model_id IN ('gemini-2.5-flash', 'gemini-2.5-flash-lite')
  `).run();

  // Insert gemini-3.6-flash and gemini-3.7-flash if they don't already exist
  db.prepare(`
    INSERT OR IGNORE INTO models (
      platform, model_id, display_name, intelligence_rank, speed_rank,
      size_label, rpm_limit, rpd_limit, tpm_limit, tpd_limit,
      monthly_token_budget, context_window, supports_vision, supports_tools, enabled
    ) VALUES 
      ('google', 'gemini-3.6-flash', 'Gemini 3.6 Flash', 2, 1, 'Large', 10, 20, 250000, null, '~3M', 1048576, 1, 1, 1),
      ('google', 'gemini-3.7-flash', 'Gemini 3.7 Flash', 2, 1, 'Frontier', 10, 20, 250000, null, '~3M', 1048576, 1, 1, 1)
  `).run();

  // Ensure gemini-3.6-flash and gemini-3.7-flash are enabled and top-tier
  db.prepare(`
    UPDATE models 
    SET enabled = 1, intelligence_rank = 2, speed_rank = 1, supports_vision = 1, supports_tools = 1
    WHERE platform = 'google' AND model_id IN ('gemini-3.6-flash', 'gemini-3.7-flash')
  `).run();

  // Disable deprecated models in fallback_config & profile_models
  const retired = db.prepare(`SELECT id FROM models WHERE platform = 'google' AND model_id IN ('gemini-2.5-flash', 'gemini-2.5-flash-lite')`).all() as { id: number }[];
  for (const row of retired) {
    db.prepare(`UPDATE fallback_config SET enabled = 0 WHERE model_db_id = ?`).run(row.id);
    db.prepare(`UPDATE profile_models SET enabled = 0 WHERE model_db_id = ?`).run(row.id);
  }

  // Promote gemini-3.6-flash and gemini-3.7-flash priority in fallback_config and profile_models
  const m36 = db.prepare(`SELECT id FROM models WHERE platform = 'google' AND model_id = 'gemini-3.6-flash'`).get() as { id: number } | undefined;
  const m37 = db.prepare(`SELECT id FROM models WHERE platform = 'google' AND model_id = 'gemini-3.7-flash'`).get() as { id: number } | undefined;

  if (m36) {
    db.prepare(`INSERT OR IGNORE INTO fallback_config (model_db_id, priority, enabled) VALUES (?, 10, 1)`).run(m36.id);
    db.prepare(`UPDATE fallback_config SET priority = 10, enabled = 1 WHERE model_db_id = ?`).run(m36.id);
    db.prepare(`INSERT OR IGNORE INTO profile_models (profile_id, model_db_id, priority, enabled) VALUES (1, ?, 10, 1)`).run(m36.id);
    db.prepare(`UPDATE profile_models SET priority = 10, enabled = 1 WHERE model_db_id = ?`).run(m36.id);
  }

  if (m37) {
    db.prepare(`INSERT OR IGNORE INTO fallback_config (model_db_id, priority, enabled) VALUES (?, 11, 1)`).run(m37.id);
    db.prepare(`UPDATE fallback_config SET priority = 11, enabled = 1 WHERE model_db_id = ?`).run(m37.id);
    db.prepare(`INSERT OR IGNORE INTO profile_models (profile_id, model_db_id, priority, enabled) VALUES (1, ?, 11, 1)`).run(m37.id);
    db.prepare(`UPDATE profile_models SET priority = 11, enabled = 1 WHERE model_db_id = ?`).run(m37.id);
  }
}

export function down(db: Db): void {
  db.prepare(`
    UPDATE models 
    SET enabled = 1 
    WHERE platform = 'google' AND model_id IN ('gemini-2.5-flash', 'gemini-2.5-flash-lite')
  `).run();
}
