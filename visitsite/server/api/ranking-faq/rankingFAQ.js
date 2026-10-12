import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from '../../db.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload storage configuration for FAQ evidence files
const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads', 'ranking-faq');
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
      list = [{ type: 'file', url: row.file_url, label: row.evidence_label || '[Link 1]', fileName: row.file_name }];
    } else if (row.file_name) {
      list = [{ type: 'file', url: `/uploads/ranking-faq/${row.file_name}`, label: row.evidence_label || '[Link 1]', fileName: row.file_name }];
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
    const sql = `SELECT * FROM ranking_faqs ${whereStr} ORDER BY id DESC`;

    const [results] = await pool.query(sql, params);
    const normalizedData = results.map((row) => {
      let fileUrl = row.file_url;
      if (!fileUrl && row.file_name) {
        fileUrl = `/uploads/ranking-faq/${row.file_name}`;
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
        uploadDate: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        year: row.year || '2026',
        isVisible: Boolean(row.is_visible),
        displayOrder: row.display_order || 0
      };
    });

    res.status(200).json(normalizedData);
  } catch (err) {
    console.error('❌ Error fetching ranking_faqs:', err);
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
          url: `/uploads/ranking-faq/${specificFile.filename}`,
          fileName: specificFile.originalname,
          label: link.label || `[Link ${idx + 1}]`
        };
      }
      if (link.type === 'file' && !link.url && uploadedFiles[fileCursor]) {
        const f = uploadedFiles[fileCursor++];
        return {
          type: 'file',
          url: `/uploads/ranking-faq/${f.filename}`,
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
        url: `/uploads/ranking-faq/${f.filename}`,
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

// POST /faqs - Add new FAQ item into ranking_faqs
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
      INSERT INTO ranking_faqs 
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
      message: '✅ FAQ item added with multiple evidence links successfully',
      id: result.insertId,
      evidenceLinks: links
    });
  } catch (err) {
    console.error('❌ Error adding FAQ item:', err);
    res.status(500).json({ message: 'Error adding FAQ item: ' + err.message });
  }
});

// PUT /faqs/:id - Update FAQ item in ranking_faqs
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
      UPDATE ranking_faqs SET
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
      message: '✅ FAQ item updated with multiple evidence links successfully',
      evidenceLinks: links
    });
  } catch (err) {
    console.error('❌ Error updating FAQ item:', err);
    res.status(500).json({ message: 'Error updating FAQ item: ' + err.message });
  }
});

// DELETE /faqs/:id - Delete FAQ item from ranking_faqs
router.delete('/faqs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM ranking_faqs WHERE id = ?', [id]);
    res.json({ success: true, message: '✅ FAQ item deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting FAQ item:', err);
    res.status(500).json({ message: 'Error deleting FAQ item: ' + err.message });
  }
});

export default router;
