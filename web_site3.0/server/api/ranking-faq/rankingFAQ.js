import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from '../../db.js';
import { runUnifyMigration } from '../../migrations/unify_migration.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload storage configuration - UNIFIED to single uploads/ranking-data folder
const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads', 'ranking-data');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// Auto-ensure ranking FAQ tables exist on live server boot & unify with ranking_data
async function initRankingFAQDB() {
  try {
    // 0. Ensure ranking_data table schema is unified
    await runUnifyMigration();
    // 1. Ensure ranking_faq_boxes
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
        table_header_bg VARCHAR(50) DEFAULT '#b6862c',
        accent_color VARCHAR(50) DEFAULT '#10b981',
        icon VARCHAR(50) DEFAULT '🏆',
        display_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Ensure ranking_sdg_goals
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ranking_sdg_goals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sdg_number INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        color VARCHAR(50) DEFAULT '#0f766e',
        display_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_sdg_number (sdg_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Ensure ranking_faqs
    await pool.query(`
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
        evidence_links TEXT DEFAULT NULL,
        year VARCHAR(20) DEFAULT '2026',
        is_visible TINYINT(1) DEFAULT 1,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_ranking_slug (ranking_slug),
        INDEX idx_sdg_number (sdg_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Seed default SDG goals if empty
    const [sdgCount] = await pool.query('SELECT COUNT(*) as count FROM ranking_sdg_goals');
    if (sdgCount[0].count === 0) {
      const defaultGoals = [
        [1, 'No Poverty', '#E5243B', 1, 1],
        [2, 'Zero Hunger', '#DDA63A', 2, 1],
        [3, 'Good Health and Well-Being', '#4C9F38', 3, 1],
        [4, 'Quality Education', '#C5192D', 4, 1],
        [5, 'Gender Equality', '#FF3A21', 5, 1],
        [6, 'Clean Water and Sanitation', '#26BDE2', 6, 1],
        [7, 'Affordable and Clean Energy', '#FCC30B', 7, 1],
        [8, 'Decent Work and Economic Growth', '#A21942', 8, 1],
        [9, 'Industry, Innovation and Infrastructure', '#FD6925', 9, 1],
        [10, 'Reduced Inequalities', '#DD1367', 10, 1],
        [11, 'Sustainable Cities and Communities', '#FD9D24', 11, 1],
        [12, 'Responsible Consumption and Production', '#BF8B2E', 12, 1],
        [13, 'Climate Action', '#3F7E44', 13, 1],
        [14, 'Life Below Water', '#0A97D9', 14, 1],
        [15, 'Life on Land', '#56C02B', 15, 1],
        [16, 'Peace, Justice and Strong Institutions', '#00689D', 16, 1],
        [17, 'Partnerships for the Goals', '#19486A', 17, 1]
      ];
      for (const [num, title, color, order, active] of defaultGoals) {
        await pool.query(
          'INSERT INTO ranking_sdg_goals (sdg_number, title, color, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
          [num, title, color, order, active]
        );
      }
      console.log('✅ Auto-seeded default 17 SDG goals in ranking_sdg_goals');
    }

    // 5. Seed default 3 ranking boxes if empty
    const [boxCount] = await pool.query('SELECT COUNT(*) as count FROM ranking_faq_boxes');
    if (boxCount[0].count === 0) {
      await pool.query(`
        INSERT INTO ranking_faq_boxes 
        (ranking_slug, ranking_name, tag_label, box_title, description, button_text, page_title, page_eyebrow, table_header_bg, accent_color, icon, display_order, is_active)
        VALUES
        ('green-metrics', 'Green Metrics', 'GREENMETRIC', 'GREEN METRICS', 'Campus setting, energy, waste, water & eco-education', 'Explore', 'SUSTAINABLE DEVELOPMENT GOALS', 'WORLD UNIVERSITY RANKINGS', '#0f766e', '#10b981', '🌍', 1, 1),
        ('qs-sustainability', 'QS Sustainability', 'QS RANKINGS', 'QS SUSTAINABILITY', 'Environmental, social & governance impact metrics', 'Explore', 'SUSTAINABLE DEVELOPMENT GOALS', 'QS WORLD UNIVERSITY RANKINGS', '#15803d', '#22c55e', '🌱', 2, 1),
        ('the-impact-rankings', 'THE Impact Rankings', 'TIMES HIGHER EDUCATION', 'THE IMPACT RANKINGS', '17 UN Sustainable Development Goals survey & evidence', 'Explore', 'SUSTAINABLE DEVELOPMENT GOALS', 'TIMES HIGHER EDUCATION', '#b6862c', '#f59e0b', '🏆', 3, 1)
      `);
      console.log('✅ Auto-seeded default 3 ranking boxes in ranking_faq_boxes');
    }
  } catch (err) {
    console.error('⚠️ [rankingFAQ auto-init warning]:', err.message);
  }
}
initRankingFAQDB();

// ==========================================
// 1. RANKING FAQ BOXES (Templates) CRUD
// ==========================================

// GET /boxes - Fetch all active boxes (or all if ?all=1)
router.get('/boxes', async (req, res) => {
  try {
    const { all } = req.query;
    let sql = 'SELECT * FROM ranking_faq_boxes ORDER BY display_order ASC, id ASC';
    if (!all) {
      sql = 'SELECT * FROM ranking_faq_boxes WHERE is_active = 1 ORDER BY display_order ASC, id ASC';
    }
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching ranking FAQ boxes:', err);
    res.status(500).json({ message: 'Error fetching ranking FAQ boxes: ' + err.message });
  }
});

// GET /boxes/:idOrSlug - Fetch single box by ID or slug
router.get('/boxes/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let sql = 'SELECT * FROM ranking_faq_boxes WHERE id = ? LIMIT 1';
    let params = [idOrSlug];
    if (isNaN(idOrSlug)) {
      sql = 'SELECT * FROM ranking_faq_boxes WHERE ranking_slug = ? LIMIT 1';
      params = [idOrSlug];
    }
    const [rows] = await pool.query(sql, params);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Box not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Error fetching box:', err);
    res.status(500).json({ message: 'Error fetching box: ' + err.message });
  }
});

// POST /boxes - Create a new ranking box
router.post('/boxes', async (req, res) => {
  try {
    const {
      ranking_slug,
      ranking_name,
      tag_label,
      box_title,
      description,
      button_text,
      page_title,
      page_eyebrow,
      survey_name,
      intro_description,
      submission_note,
      table_header_bg,
      accent_color,
      icon,
      display_order,
      is_active
    } = req.body;

    if (!ranking_name && !box_title) {
      return res.status(400).json({ message: 'Ranking name or Box title is required' });
    }

    const titleVal = box_title || ranking_name;
    const nameVal = ranking_name || box_title;
    const slug = (ranking_slug || nameVal)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const sql = `
      INSERT INTO ranking_faq_boxes 
      (ranking_slug, ranking_name, tag_label, box_title, description, button_text, page_title, page_eyebrow, table_header_bg, accent_color, icon, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      slug,
      nameVal,
      tag_label || nameVal.toUpperCase(),
      titleVal,
      description || '',
      button_text || 'Explore',
      page_title || 'SUSTAINABLE DEVELOPMENT GOALS',
      page_eyebrow || 'WORLD UNIVERSITY RANKINGS',
      table_header_bg || '#b6862c',
      accent_color || '#10b981',
      icon || '🏆',
      display_order ? parseInt(display_order) : 0,
      is_active !== undefined ? (is_active ? 1 : 0) : 1
    ];

    const [result] = await pool.query(sql, params);
    res.status(201).json({
      success: true,
      message: '✅ Ranking box created successfully',
      id: result.insertId
    });
  } catch (err) {
    console.error('❌ Error creating ranking box:', err);
    res.status(500).json({ message: 'Error creating ranking box: ' + err.message });
  }
});

// PUT /boxes/:id - Update an existing ranking box
router.put('/boxes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ranking_slug,
      ranking_name,
      tag_label,
      box_title,
      description,
      button_text,
      page_title,
      page_eyebrow,
      table_header_bg,
      accent_color,
      icon,
      display_order,
      is_active
    } = req.body;

    const sql = `
      UPDATE ranking_faq_boxes SET
        ranking_slug = COALESCE(?, ranking_slug),
        ranking_name = COALESCE(?, ranking_name),
        tag_label = COALESCE(?, tag_label),
        box_title = COALESCE(?, box_title),
        description = COALESCE(?, description),
        button_text = COALESCE(?, button_text),
        page_title = COALESCE(?, page_title),
        page_eyebrow = COALESCE(?, page_eyebrow),
        table_header_bg = COALESCE(?, table_header_bg),
        accent_color = COALESCE(?, accent_color),
        icon = COALESCE(?, icon),
        display_order = COALESCE(?, display_order),
        is_active = COALESCE(?, is_active)
      WHERE id = ?
    `;

    const params = [
      ranking_slug !== undefined ? ranking_slug : null,
      ranking_name !== undefined ? ranking_name : null,
      tag_label !== undefined ? tag_label : null,
      box_title !== undefined ? box_title : null,
      description !== undefined ? description : null,
      button_text !== undefined ? button_text : null,
      page_title !== undefined ? page_title : null,
      page_eyebrow !== undefined ? page_eyebrow : null,
      table_header_bg !== undefined ? table_header_bg : null,
      accent_color !== undefined ? accent_color : null,
      icon !== undefined ? icon : null,
      display_order !== undefined ? parseInt(display_order) : null,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      id
    ];

    await pool.query(sql, params);
    res.json({ success: true, message: '✅ Ranking box updated successfully' });
  } catch (err) {
    console.error('❌ Error updating ranking box:', err);
    res.status(500).json({ message: 'Error updating ranking box: ' + err.message });
  }
});

// ==========================================
// 1.5 DYNAMIC SDG GOALS CRUD
// ==========================================

// GET /sdg-goals - Fetch all dynamic SDG goals
router.get('/sdg-goals', async (req, res) => {
  try {
    const { all } = req.query;
    let sql = 'SELECT * FROM ranking_sdg_goals ORDER BY display_order ASC, sdg_number ASC';
    if (!all) {
      sql = 'SELECT * FROM ranking_sdg_goals WHERE is_active = 1 ORDER BY display_order ASC, sdg_number ASC';
    }
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching SDG goals:', err);
    res.status(500).json({ message: 'Error fetching SDG goals: ' + err.message });
  }
});

// POST /sdg-goals - Add new SDG goal
router.post('/sdg-goals', async (req, res) => {
  try {
    const { sdg_number, title, color, is_active, display_order } = req.body;
    if (!sdg_number || !title) {
      return res.status(400).json({ message: 'SDG number and title are required' });
    }
    const sql = `
      INSERT INTO ranking_sdg_goals (sdg_number, title, color, is_active, display_order)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      parseInt(sdg_number),
      title.trim(),
      color || '#0f766e',
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
      display_order !== undefined ? parseInt(display_order) : parseInt(sdg_number)
    ];
    const [result] = await pool.query(sql, params);
    res.status(201).json({
      success: true,
      message: '✅ SDG goal added successfully',
      id: result.insertId
    });
  } catch (err) {
    console.error('❌ Error creating SDG goal:', err);
    res.status(500).json({ message: 'Error creating SDG goal: ' + err.message });
  }
});

// PUT /sdg-goals/:id - Update existing SDG goal
router.put('/sdg-goals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sdg_number, title, color, is_active, display_order } = req.body;

    const sql = `
      UPDATE ranking_sdg_goals SET
        sdg_number = COALESCE(?, sdg_number),
        title = COALESCE(?, title),
        color = COALESCE(?, color),
        is_active = COALESCE(?, is_active),
        display_order = COALESCE(?, display_order)
      WHERE id = ?
    `;
    const params = [
      sdg_number !== undefined ? parseInt(sdg_number) : null,
      title !== undefined ? title.trim() : null,
      color !== undefined ? color : null,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      display_order !== undefined ? parseInt(display_order) : null,
      id
    ];
    await pool.query(sql, params);
    res.json({ success: true, message: '✅ SDG goal updated successfully' });
  } catch (err) {
    console.error('❌ Error updating SDG goal:', err);
    res.status(500).json({ message: 'Error updating SDG goal: ' + err.message });
  }
});

// DELETE /sdg-goals/:id - Delete SDG goal
router.delete('/sdg-goals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM ranking_sdg_goals WHERE id = ?', [id]);
    res.json({ success: true, message: '✅ SDG goal deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting SDG goal:', err);
    res.status(500).json({ message: 'Error deleting SDG goal: ' + err.message });
  }
});

// DELETE /boxes/:id - Delete ranking box
router.delete('/boxes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM ranking_faq_boxes WHERE id = ?', [id]);
    res.json({ success: true, message: '✅ Ranking box deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting ranking box:', err);
    res.status(500).json({ message: 'Error deleting ranking box: ' + err.message });
  }
});

// ==========================================
// 2. DEDICATED RANKING FAQS TABLE CRUD
// ==========================================

// Helper to parse multiple evidence links
function parseEvidenceLinks(row) {
  let list = [];
  if (row.evidence_links) {
    try {
      list = typeof row.evidence_links === 'string' ? JSON.parse(row.evidence_links) : row.evidence_links;
    } catch (e) {
      list = [];
    }
  }

  if (!Array.isArray(list) || list.length === 0) {
    if (row.external_url) {
      list = [{ type: 'url', url: row.external_url, label: row.evidence_label || '[Link 1]' }];
    } else if (row.file_url) {
      let u = row.file_url;
      if (u.includes('/uploads/ranking-faq/')) {
        u = u.replace('/uploads/ranking-faq/', '/uploads/ranking-data/');
      }
      list = [{ type: 'file', url: u, label: row.evidence_label || '[Link 1]', fileName: row.file_name }];
    } else if (row.file_name) {
      list = [{ type: 'file', url: `/uploads/ranking-data/${row.file_name}`, label: row.evidence_label || '[Link 1]', fileName: row.file_name }];
    }
  }

  return list;
}

// GET /faqs - Fetch all FAQ criteria & evidence items from ranking_faqs
router.get('/faqs', async (req, res) => {
  try {
    const { isVisible, rankingName, rankingSlug, sdgNumber } = req.query;
    let whereClauses = [];
    let params = [];

    if (isVisible === 'true') {
      whereClauses.push('is_visible = 1');
    }
    if (rankingSlug) {
      whereClauses.push('ranking_slug = ?');
      params.push(rankingSlug);
    }
    if (rankingName) {
      whereClauses.push('ranking_name = ?');
      params.push(rankingName);
    }
    if (sdgNumber) {
      whereClauses.push('sdg_number = ?');
      params.push(parseInt(sdgNumber));
    }

    const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const sql = `SELECT * FROM ranking_data ${whereStr} ORDER BY display_order ASC, id DESC`;

    const [results] = await pool.query(sql, params);
    const normalizedData = results.map((row) => {
      let fileUrl = row.file_url;
      if (fileUrl && fileUrl.includes('/uploads/ranking-faq/')) {
        fileUrl = fileUrl.replace('/uploads/ranking-faq/', '/uploads/ranking-data/');
      }
      if (!fileUrl && row.file_name) {
        fileUrl = `/uploads/ranking-data/${row.file_name}`;
      } else if (!fileUrl && row.external_url) {
        fileUrl = row.external_url;
      }

      const evidenceLinks = parseEvidenceLinks(row);
      const primaryUrl = evidenceLinks.find(l => l.type === 'url')?.url || row.external_url || '';
      const primaryFileUrl = evidenceLinks.find(l => l.type === 'file')?.url || fileUrl || '';
      const primaryLabel = evidenceLinks[0]?.label || row.evidence_label || '[Link 1]';

      return {
        id: String(row.id),
        rankingSlug: row.ranking_slug || 'the-impact-rankings',
        rankingName: row.ranking_name || '',
        sdgNumber: Number(row.sdg_number) || 0,
        criteriaName: row.criteria_name || '',
        question: row.question || '',
        answer: row.answer || 'Yes',
        fileName: row.file_name || '',
        fileUrl: primaryFileUrl,
        externalUrl: primaryUrl,
        evidenceLabel: primaryLabel,
        evidenceLinks: evidenceLinks,
        fileSize: row.file_size || '0 MB',
        uploadDate: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : (row.upload_date ? new Date(row.upload_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
        year: row.year || '2026',
        isVisible: Boolean(row.is_visible),
        displayOrder: row.display_order || 0
      };
    });

    res.status(200).json(normalizedData);
  } catch (err) {
    console.error('❌ Error fetching ranking_data in FAQ API:', err);
    res.status(500).json({ message: 'Error fetching ranking FAQs: ' + err.message });
  }
});

// Helper to assemble incoming multiple links & uploaded files
function resolveIncomingLinks(req) {
  let links = [];
  if (req.body.evidenceLinks) {
    try {
      links = typeof req.body.evidenceLinks === 'string'
        ? JSON.parse(req.body.evidenceLinks)
        : req.body.evidenceLinks;
    } catch (e) {
      links = [];
    }
  }

  // Handle uploaded files if any
  const uploadedFiles = req.files || [];
  if (req.file) uploadedFiles.push(req.file);

  // If links array was provided, merge files
  if (Array.isArray(links) && links.length > 0) {
    let fileCursor = 0;
    links = links.map((link, idx) => {
      // Check if file attached specifically for this link index e.g. file_0 or file_1
      const specificFile = uploadedFiles.find(f => f.fieldname === `file_${idx}`);
      if (specificFile) {
        return {
          type: 'file',
          url: `/uploads/ranking-data/${specificFile.filename}`,
          fileName: specificFile.originalname,
          label: link.label || `[Link ${idx + 1}]`
        };
      }
      if (link.type === 'file' && !link.url && uploadedFiles[fileCursor]) {
        const f = uploadedFiles[fileCursor++];
        return {
          type: 'file',
          url: `/uploads/ranking-data/${f.filename}`,
          fileName: f.originalname,
          label: link.label || `[Link ${idx + 1}]`
        };
      }
      return link;
    });
  } else {
    // Single fallback if externalUrl or uploaded file passed directly
    if (uploadedFiles.length > 0) {
      const f = uploadedFiles[0];
      links = [{
        type: 'file',
        url: `/uploads/ranking-data/${f.filename}`,
        fileName: f.originalname,
        label: req.body.evidenceLabel || '[Link 1]'
      }];
    } else if (req.body.externalUrl) {
      links = [{
        type: 'url',
        url: req.body.externalUrl,
        label: req.body.evidenceLabel || '[Link 1]'
      }];
    }
  }

  return links;
}

// POST /faqs - Add new FAQ item into ranking_data
router.post('/faqs', upload.any(), async (req, res) => {
  try {
    const {
      rankingName,
      rankingSlug,
      sdgNumber,
      criteriaName,
      question,
      answer,
      year
    } = req.body;

    if (!rankingName || !sdgNumber || !criteriaName || !question) {
      return res.status(400).json({
        message: 'Required fields: rankingName, sdgNumber, criteriaName, question'
      });
    }

    const links = resolveIncomingLinks(req);
    const linksJson = links.length > 0 ? JSON.stringify(links) : null;
    const primaryUrl = links.find(l => l.type === 'url')?.url || req.body.externalUrl || null;
    const primaryFile = links.find(l => l.type === 'file');
    const primaryLabel = links[0]?.label || req.body.evidenceLabel || '[Link 1]';

    const slugVal = rankingSlug || rankingName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const answerVal = answer || 'Yes';
    const yearVal = year || '2026';
    const fileName = primaryFile ? (primaryFile.fileName || 'document.pdf') : (primaryUrl ? primaryUrl.split('/').pop() : 'link');
    const fileUrl = primaryFile ? primaryFile.url : (primaryUrl || '');

    const sql = `
      INSERT INTO ranking_data 
      (ranking_slug, ranking_name, sdg_number, criteria_name, question, answer, file_name, file_url, external_url, evidence_label, evidence_links, file_size, year, is_visible)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '0 MB', ?, 1)
    `;

    const params = [
      slugVal,
      rankingName,
      parseInt(sdgNumber),
      criteriaName,
      question,
      answerVal,
      fileName,
      fileUrl,
      primaryUrl,
      primaryLabel,
      linksJson,
      yearVal
    ];

    const [result] = await pool.query(sql, params);
    res.status(201).json({
      success: true,
      message: '✅ FAQ item added to unified ranking_data table successfully',
      id: result.insertId,
      evidenceLinks: links
    });
  } catch (err) {
    console.error('❌ Error adding FAQ item to ranking_data:', err);
    res.status(500).json({ message: 'Error adding FAQ item: ' + err.message });
  }
});

// PUT /faqs/:id - Update FAQ item in ranking_data
router.put('/faqs/:id', upload.any(), async (req, res) => {
  const { id } = req.params;
  const {
    rankingName,
    rankingSlug,
    sdgNumber,
    criteriaName,
    question,
    answer,
    year,
    isVisible
  } = req.body;

  try {
    const links = resolveIncomingLinks(req);
    const hasIncomingLinks = links.length > 0;
    const linksJson = hasIncomingLinks ? JSON.stringify(links) : undefined;
    const primaryUrl = hasIncomingLinks ? (links.find(l => l.type === 'url')?.url || null) : req.body.externalUrl;
    const primaryFile = hasIncomingLinks ? links.find(l => l.type === 'file') : null;
    const primaryLabel = hasIncomingLinks ? (links[0]?.label || '[Link 1]') : req.body.evidenceLabel;

    let visibilityVal = null;
    if (typeof isVisible !== 'undefined' && isVisible !== null) {
      const v = String(isVisible).toLowerCase();
      if (v === 'true' || v === '1' || v === 'yes' || v === 'on') visibilityVal = 1;
      else if (v === 'false' || v === '0' || v === 'no' || v === 'off') visibilityVal = 0;
    }

    const sql = `
      UPDATE ranking_data SET
        ranking_slug = COALESCE(?, ranking_slug),
        ranking_name = COALESCE(?, ranking_name),
        sdg_number = COALESCE(?, sdg_number),
        criteria_name = COALESCE(?, criteria_name),
        question = COALESCE(?, question),
        answer = COALESCE(?, answer),
        external_url = COALESCE(?, external_url),
        evidence_label = COALESCE(?, evidence_label),
        evidence_links = COALESCE(?, evidence_links),
        file_name = COALESCE(?, file_name),
        file_url = COALESCE(?, file_url),
        year = COALESCE(?, year),
        is_visible = COALESCE(?, is_visible)
      WHERE id = ?
    `;

    const params = [
      rankingSlug !== undefined ? rankingSlug : null,
      rankingName !== undefined ? rankingName : null,
      sdgNumber !== undefined ? parseInt(sdgNumber) : null,
      criteriaName !== undefined ? criteriaName : null,
      question !== undefined ? question : null,
      answer !== undefined ? answer : null,
      primaryUrl !== undefined ? primaryUrl : null,
      primaryLabel !== undefined ? primaryLabel : null,
      linksJson !== undefined ? linksJson : null,
      primaryFile ? primaryFile.fileName : null,
      primaryFile ? primaryFile.url : null,
      year !== undefined ? year : null,
      visibilityVal,
      id
    ];

    await pool.query(sql, params);
    res.json({
      success: true,
      message: '✅ FAQ item updated in unified ranking_data table successfully',
      evidenceLinks: links
    });
  } catch (err) {
    console.error('❌ Error updating FAQ item in ranking_data:', err);
    res.status(500).json({ message: 'Error updating FAQ item: ' + err.message });
  }
});

// DELETE /faqs/:id - Delete FAQ item from ranking_data
router.delete('/faqs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM ranking_data WHERE id = ?', [id]);
    res.json({ success: true, message: '✅ FAQ item deleted successfully from unified ranking_data' });
  } catch (err) {
    console.error('❌ Error deleting FAQ item:', err);
    res.status(500).json({ message: 'Error deleting FAQ item: ' + err.message });
  }
});

// PATCH or POST /toggle-visibility/:id - Toggle visibility
const handleToggleVisibility = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE ranking_data SET is_visible = NOT is_visible WHERE id = ?', [id]);
    const [rows] = await pool.query('SELECT is_visible FROM ranking_data WHERE id = ?', [id]);
    res.json({ success: true, isVisible: Boolean(rows[0]?.is_visible) });
  } catch (err) {
    console.error('❌ Error toggling visibility in FAQ route:', err);
    res.status(500).json({ message: 'Error toggling visibility: ' + err.message });
  }
};
router.patch('/toggle-visibility/:id', handleToggleVisibility);
router.post('/toggle-visibility/:id', handleToggleVisibility);

// GET /download/:filename - File download endpoint for FAQ evidence
router.get('/download/:filename', async (req, res) => {
  const filename = req.params.filename;
  let filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(filePath)) {
    const candidateDirs = [
      path.join(__dirname, "../../../uploads/ranking-data"),
      path.join(__dirname, "../../../../visitsite/uploads/ranking-faq"),
      path.join(__dirname, "../../../../visitsite/uploads/ranking-data"),
      path.join(__dirname, "../../../../web_site3.0/uploads/ranking-faq"),
      path.join(__dirname, "../../../../web_site3.0/uploads/ranking-data"),
    ];
    for (const cDir of candidateDirs) {
      const candidatePath = path.join(cDir, filename);
      if (fs.existsSync(candidatePath)) {
        filePath = candidatePath;
        break;
      }
    }
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found on server' });
  }

  try {
    const [results] = await pool.query('SELECT file_name, original_file_name FROM ranking_data WHERE file_name = ? LIMIT 1', [filename]);
    let downloadName = filename;
    if (results && results.length > 0 && results[0].original_file_name) {
      downloadName = results[0].original_file_name;
    } else if (results && results.length > 0 && results[0].file_name) {
      downloadName = results[0].file_name;
    }
    res.download(filePath, downloadName);
  } catch (error) {
    res.download(filePath, filename);
  }
});

export default router;
