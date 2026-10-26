import pool from '../db.js';

export async function runUnifyMigration() {
  console.log('🔄 Starting ranking_data table unification migration...');

  // 1. Check existing columns of ranking_data
  const [cols] = await pool.query('DESCRIBE ranking_data');
  const existingFields = new Set(cols.map(c => c.Field.toLowerCase()));

  const columnsToAdd = [
    { name: 'ranking_slug', type: "VARCHAR(100) DEFAULT 'the-impact-rankings'" },
    { name: 'answer', type: "VARCHAR(255) DEFAULT 'Yes'" },
    { name: 'external_url', type: 'TEXT DEFAULT NULL' },
    { name: 'evidence_label', type: "VARCHAR(255) DEFAULT '[Link 1]'" },
    { name: 'evidence_links', type: 'TEXT DEFAULT NULL' },
    { name: 'display_order', type: 'INT DEFAULT 0' },
    { name: 'created_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
    { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
  ];

  for (const col of columnsToAdd) {
    if (!existingFields.has(col.name.toLowerCase())) {
      console.log(`➕ Adding column ${col.name} to ranking_data...`);
      await pool.query(`ALTER TABLE ranking_data ADD COLUMN ${col.name} ${col.type}`);
    }
  }

  // 2. Add indexes if missing
  try {
    const [indexes] = await pool.query('SHOW INDEX FROM ranking_data');
    const indexNames = new Set(indexes.map(i => i.Key_name));
    if (!indexNames.has('idx_ranking_slug')) {
      await pool.query('ALTER TABLE ranking_data ADD INDEX idx_ranking_slug (ranking_slug)');
      console.log('✅ Added index idx_ranking_slug');
    }
    if (!indexNames.has('idx_sdg_number')) {
      await pool.query('ALTER TABLE ranking_data ADD INDEX idx_sdg_number (sdg_number)');
      console.log('✅ Added index idx_sdg_number');
    }
  } catch (err) {
    console.warn('Index check warning:', err.message);
  }

  // 3. Backfill ranking_slug based on ranking_name if empty or default
  console.log('🔄 Backfilling ranking_slug in ranking_data...');
  await pool.query(`
    UPDATE ranking_data 
    SET ranking_slug = 'green-metrics' 
    WHERE LOWER(ranking_name) LIKE '%green%' AND (ranking_slug IS NULL OR ranking_slug = '' OR ranking_slug = 'the-impact-rankings')
  `);
  await pool.query(`
    UPDATE ranking_data 
    SET ranking_slug = 'qs-sustainability' 
    WHERE LOWER(ranking_name) LIKE '%qs%' AND (ranking_slug IS NULL OR ranking_slug = '' OR ranking_slug = 'the-impact-rankings')
  `);
  await pool.query(`
    UPDATE ranking_data 
    SET ranking_slug = 'the-impact-rankings' 
    WHERE (LOWER(ranking_name) LIKE '%impact%' OR LOWER(ranking_name) LIKE '%times%') AND (ranking_slug IS NULL OR ranking_slug = '')
  `);

  // 4. Backfill evidence_links JSON for existing rows if NULL
  console.log('🔄 Backfilling evidence_links JSON in ranking_data...');
  const [rowsNeedingLinks] = await pool.query(`
    SELECT id, file_name, file_url, external_url, evidence_label 
    FROM ranking_data 
    WHERE evidence_links IS NULL OR evidence_links = ''
  `);

  for (const row of rowsNeedingLinks) {
    let links = [];
    const label = row.evidence_label || '[Link 1]';
    if (row.file_url || row.file_name) {
      let fUrl = row.file_url;
      if (!fUrl && row.file_name) {
        fUrl = `/uploads/ranking-data/${row.file_name}`;
      } else if (fUrl && !fUrl.startsWith('http') && !fUrl.startsWith('/uploads/')) {
        fUrl = `/uploads/ranking-data/${fUrl.replace(/^uploads\//, '')}`;
      }
      links.push({
        type: 'file',
        url: fUrl,
        fileName: row.file_name || 'document.pdf',
        label
      });
    } else if (row.external_url) {
      links.push({
        type: 'url',
        url: row.external_url,
        label
      });
    }

    if (links.length > 0) {
      await pool.query('UPDATE ranking_data SET evidence_links = ? WHERE id = ?', [JSON.stringify(links), row.id]);
    }
  }

  // 5. Migrate any rows in ranking_faqs that do not exist in ranking_data
  try {
    const [faqTables] = await pool.query("SHOW TABLES LIKE 'ranking_faqs'");
    if (faqTables.length > 0) {
      console.log('🔄 Checking for missing rows in ranking_faqs to merge into ranking_data...');
      const [missingFaqs] = await pool.query(`
        SELECT f.*
        FROM ranking_faqs f
        LEFT JOIN ranking_data d ON 
          (d.ranking_name COLLATE utf8mb4_general_ci = f.ranking_name COLLATE utf8mb4_general_ci)
          AND d.sdg_number = f.sdg_number 
          AND (d.criteria_name COLLATE utf8mb4_general_ci = f.criteria_name COLLATE utf8mb4_general_ci)
          AND (SUBSTRING(d.question, 1, 50) COLLATE utf8mb4_general_ci = SUBSTRING(f.question, 1, 50) COLLATE utf8mb4_general_ci)
        WHERE d.id IS NULL
      `);

      console.log(`Found ${missingFaqs.length} rows in ranking_faqs to import into ranking_data`);
      for (const f of missingFaqs) {
        await pool.query(`
          INSERT INTO ranking_data 
          (ranking_slug, ranking_name, sdg_number, criteria_name, question, answer, file_name, file_url, file_size, external_url, evidence_label, evidence_links, year, is_visible, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          f.ranking_slug || 'the-impact-rankings',
          f.ranking_name,
          f.sdg_number,
          f.criteria_name,
          f.question,
          f.answer || 'Yes',
          f.file_name,
          f.file_url,
          f.file_size || '0 MB',
          f.external_url,
          f.evidence_label || '[Link 1]',
          f.evidence_links,
          f.year || '2026',
          f.is_visible !== undefined ? f.is_visible : 1,
          f.display_order || 0
        ]);
        console.log(`✅ Merged missing item: "${f.criteria_name}" - "${f.question.slice(0, 30)}..." into ranking_data`);
      }
    }
  } catch (err) {
    console.warn('Warning during ranking_faqs import:', err.message);
  }

  // 6. Verify total rows
  const [count] = await pool.query('SELECT COUNT(*) as count FROM ranking_data');
  console.log(`🎉 SUCCESS: Unified table ranking_data now has ${count[0].count} total rows!`);
}

// Run immediately if executed directly
if (process.argv[1]?.endsWith('unify_migration.js')) {
  runUnifyMigration()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
