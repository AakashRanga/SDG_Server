import db from './db.js';

async function setupRankingFAQs() {
  console.log('🚀 Creating dedicated ranking_faqs table...');

  try {
    // 1. Create ranking_faqs table
    await db.query(`
      CREATE TABLE IF NOT EXISTS ranking_faqs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ranking_slug VARCHAR(100) NOT NULL DEFAULT 'the-impact-rankings',
        ranking_name VARCHAR(255) NOT NULL,
        sdg_number INT NOT NULL,
        criteria_name VARCHAR(255) NOT NULL,
        question TEXT NOT NULL,
        answer VARCHAR(255) DEFAULT 'Yes',
        file_name VARCHAR(255) DEFAULT NULL,
        file_url TEXT DEFAULT NULL,
        file_size VARCHAR(50) DEFAULT NULL,
        external_url TEXT DEFAULT NULL,
        evidence_label VARCHAR(255) DEFAULT '[Link 1]',
        year VARCHAR(20) DEFAULT '2026',
        is_visible TINYINT(1) DEFAULT 1,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_ranking_slug (ranking_slug),
        INDEX idx_sdg_number (sdg_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✅ Table ranking_faqs created or already exists.');

    // 2. Check if ranking_faqs has data. If empty, seed from ranking_data
    const [faqCount] = await db.query('SELECT COUNT(*) as count FROM ranking_faqs');
    if (faqCount[0].count === 0) {
      console.log('📦 Seeding initial data into ranking_faqs from ranking_data...');
      await db.query(`
        INSERT INTO ranking_faqs (
          ranking_slug, ranking_name, sdg_number, criteria_name, question,
          answer, file_name, file_url, file_size, external_url, evidence_label,
          year, is_visible
        )
        SELECT 
          CASE 
            WHEN LOWER(ranking_name) LIKE '%green%' OR LOWER(ranking_name) LIKE '%ui%' THEN 'green-metrics'
            WHEN LOWER(ranking_name) LIKE '%qs%' THEN 'qs-sustainability'
            ELSE 'the-impact-rankings'
          END as ranking_slug,
          ranking_name, sdg_number, criteria_name, question,
          COALESCE(answer, 'Yes'), file_name,
          COALESCE(file_url, CONCAT('/uploads/ranking-data/', file_name)),
          file_size, external_url, COALESCE(evidence_label, '[Link 1]'),
          year, is_visible
        FROM ranking_data;
      `);
      const [newCount] = await db.query('SELECT COUNT(*) as count FROM ranking_faqs');
      console.log(`✅ Seeded ${newCount[0].count} records into ranking_faqs.`);
    } else {
      console.log(`ℹ️ ranking_faqs already has ${faqCount[0].count} records.`);
    }

    console.log('🎉 Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up ranking_faqs:', error);
    process.exit(1);
  }
}

setupRankingFAQs();
