import pool from './db.js';

async function setup() {
  try {
    console.log('🔄 Running setup for ranking FAQ tables...');

    // 1. Create ranking_faq_boxes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ranking_faq_boxes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ranking_slug VARCHAR(100) UNIQUE NOT NULL,
        ranking_name VARCHAR(255) NOT NULL,
        tag_label VARCHAR(255) DEFAULT '',
        box_title VARCHAR(255) NOT NULL,
        description TEXT,
        button_text VARCHAR(100) DEFAULT 'Explore',
        page_title VARCHAR(255) DEFAULT 'SUSTAINABLE DEVELOPMENT GOALS',
        page_eyebrow VARCHAR(255) DEFAULT '',
        survey_name VARCHAR(255) DEFAULT '',
        intro_description TEXT,
        submission_note TEXT,
        table_header_bg VARCHAR(50) DEFAULT '#b6862c',
        accent_color VARCHAR(50) DEFAULT '#10b981',
        icon VARCHAR(50) DEFAULT '🏆',
        display_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    console.log('✅ ranking_faq_boxes table ensured');

    // 2. Check and add extra columns to ranking_data
    const [cols] = await pool.query('SHOW COLUMNS FROM ranking_data');
    const colNames = cols.map(c => c.Field);

    if (!colNames.includes('answer')) {
      await pool.query("ALTER TABLE ranking_data ADD COLUMN answer VARCHAR(255) DEFAULT 'Yes' AFTER question");
      console.log('✅ Added answer column to ranking_data');
    }
    if (!colNames.includes('external_url')) {
      await pool.query('ALTER TABLE ranking_data ADD COLUMN external_url TEXT DEFAULT NULL AFTER file_url');
      console.log('✅ Added external_url column to ranking_data');
    }
    if (!colNames.includes('evidence_label')) {
      await pool.query("ALTER TABLE ranking_data ADD COLUMN evidence_label VARCHAR(100) DEFAULT '[Link 1]' AFTER external_url");
      console.log('✅ Added evidence_label column to ranking_data');
    }

    // 3. Seed default boxes if table is empty
    const [boxes] = await pool.query('SELECT COUNT(*) as cnt FROM ranking_faq_boxes');
    if (boxes[0].cnt === 0) {
      await pool.query(`
        INSERT INTO ranking_faq_boxes 
        (ranking_slug, ranking_name, tag_label, box_title, description, button_text, page_title, page_eyebrow, survey_name, intro_description, submission_note, table_header_bg, accent_color, icon, display_order, is_active)
        VALUES
        (
          'green-metrics',
          'Green Metrics',
          'GREENMETRIC',
          'GREEN METRICS',
          'Campus setting, energy, waste, water & eco-education',
          'Explore',
          'SUSTAINABLE DEVELOPMENT GOALS',
          'WORLD UNIVERSITY RANKINGS',
          'UI GreenMetric Sustainability',
          'The United Nations\\' 17 Sustainable Development Goals (SDGs) are a call for action by all countries - developed and developing - in a global partnership. They are intended to provide a shared blueprint for peace and prosperity for people and the planet, now and into the future. Use the filter to see the evidence provided to UI GreenMetric for the SDG\\'s on their sustainability survey.',
          'If you would like to submit a link containing evidence supporting an SDG please click here. Submitted data will be reviewed by the Sustainability & Ranking Office for next year\\'s submission.',
          '#0f766e',
          '#10b981',
          '🌍',
          1,
          1
        ),
        (
          'qs-sustainability',
          'QS Sustainability',
          'QS RANKINGS',
          'QS SUSTAINABILITY',
          'Environmental, social & governance impact metrics',
          'Explore',
          'SUSTAINABLE DEVELOPMENT GOALS',
          'QS WORLD UNIVERSITY RANKINGS',
          'QS Sustainability',
          'The United Nations\\' 17 Sustainable Development Goals (SDGs) are a call for action by all countries - developed and developing - in a global partnership. They are intended to provide a shared blueprint for peace and prosperity for people and the planet, now and into the future. Use the filter to see the evidence provided to QS for the SDG\\'s on their Sustainability survey.',
          'If you would like to submit a link containing evidence supporting an SDG please click here. Submitted data will be reviewed by the Sustainability & Ranking Office for next year\\'s submission.',
          '#15803d',
          '#22c55e',
          '🌱',
          2,
          1
        ),
        (
          'the-impact-rankings',
          'THE Impact Rankings',
          'TIMES HIGHER EDUCATION',
          'THE IMPACT RANKINGS',
          '17 UN Sustainable Development Goals survey & evidence',
          'Explore',
          'SUSTAINABLE DEVELOPMENT GOALS',
          'TIMES HIGHER EDUCATION',
          'IMPACT',
          'The United Nations\\' 17 Sustainable Development Goals (SDGs) are a call for action by all countries - developed and developing - in a global partnership. They are intended to provide a shared blueprint for peace and prosperity for people and the planet, now and into the future. Use the filter to see the evidence provided to Times Higher Education for the SDG\\'s on their IMPACT survey.',
          'If you would like to submit a link containing evidence supporting an SDG please click here. Submitted data will be reviewed by the Sustainability & Ranking Office for next year\\'s submission.',
          '#b6862c',
          '#f59e0b',
          '🏆',
          3,
          1
        );
      `);
      console.log('✅ Seeded default 3 ranking boxes');
    }

    const [allBoxes] = await pool.query('SELECT id, ranking_slug, ranking_name, box_title FROM ranking_faq_boxes');
    console.log('✅ Current boxes in DB:', allBoxes);
    console.log('🎉 Setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up ranking FAQ tables:', error);
    process.exit(1);
  }
}

setup();
