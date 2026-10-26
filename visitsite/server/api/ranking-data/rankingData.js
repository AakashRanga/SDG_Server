import express from 'express';
import pool from '../../db.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// UPLOAD PATH - store ranking PDFs in frontend uploads folder
const uploadFolder = path.join(__dirname, "../../../uploads/ranking-data");
fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 400 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// GET /api/ranking-data - API Documentation
router.get("/", (req, res) => {
  res.json({
    message: "Ranking Data & FAQ Boxes API is operational",
    endpoints: {
      "GET /boxes": "Get all dynamic ranking boxes and page configurations",
      "GET /boxes/:idOrSlug": "Get a specific box configuration",
      "POST /boxes": "Create a new ranking framework box",
      "PUT /boxes/:id": "Update ranking framework box and its reference page",
      "DELETE /boxes/:id": "Delete ranking framework box",
      "POST /add-ranking-data": "Add ranking FAQ criteria/question (with PDF or external link)",
      "GET /rankingssite": "Get all criteria FAQ questions and evidence",
      "PUT /update-ranking-site/:id": "Update criteria FAQ question",
      "DELETE /delete-ranking-site/:id": "Delete criteria question",
      "PATCH /toggle-visibility/:id": "Toggle question visibility",
      "GET /download/:filename": "Download PDF",
      "GET /view/:filename": "View PDF"
    }
  });
});

// ==========================================
// DYNAMIC RANKING FAQ BOXES & PAGE CONFIGS
// ==========================================

// GET /boxes - Fetch all ranking boxes
router.get('/boxes', async (req, res) => {
  try {
    const showAll = req.query.all === '1' || req.query.all === 'true' || req.query.admin === 'true';
    const sql = showAll
      ? 'SELECT * FROM ranking_faq_boxes ORDER BY display_order ASC, id ASC'
      : 'SELECT * FROM ranking_faq_boxes WHERE is_active = 1 ORDER BY display_order ASC, id ASC';
    const [results] = await pool.query(sql);
    res.json(results);
  } catch (err) {
    console.error('❌ Error fetching ranking boxes:', err);
    res.status(500).json({ message: 'Error fetching ranking boxes: ' + err.message });
  }
});

// GET /boxes/:idOrSlug - Fetch single box by ID or Slug
router.get('/boxes/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const isNumeric = /^\d+$/.test(idOrSlug);
    const sql = isNumeric
      ? 'SELECT * FROM ranking_faq_boxes WHERE id = ?'
      : 'SELECT * FROM ranking_faq_boxes WHERE ranking_slug = ?';
    const [results] = await pool.query(sql, [idOrSlug]);
    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Ranking box not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error('❌ Error fetching ranking box:', err);
    res.status(500).json({ message: 'Error fetching ranking box' });
  }
});

// POST /boxes - Create new ranking box & page template
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
      (ranking_slug, ranking_name, tag_label, box_title, description, button_text, page_title, page_eyebrow, survey_name, intro_description, submission_note, table_header_bg, accent_color, icon, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      survey_name || nameVal,
      intro_description || '',
      submission_note || '',
      table_header_bg || '#b6862c',
      accent_color || '#10b981',
      icon || '🏆',
      display_order ? parseInt(display_order) : 0,
      is_active !== undefined ? (is_active ? 1 : 0) : 1
    ];

    const [result] = await pool.query(sql, params);
    res.status(201).json({
      success: true,
      message: '✅ Ranking box template created successfully',
      id: result.insertId,
      slug
    });
  } catch (err) {
    console.error('❌ Error creating ranking box:', err);
    res.status(500).json({ message: 'Error creating ranking box: ' + err.message });
  }
});

// PUT /boxes/:id - Update ranking box and reference page settings
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
      survey_name,
      intro_description,
      submission_note,
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
        survey_name = COALESCE(?, survey_name),
        intro_description = COALESCE(?, intro_description),
        submission_note = COALESCE(?, submission_note),
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
      survey_name !== undefined ? survey_name : null,
      intro_description !== undefined ? intro_description : null,
      submission_note !== undefined ? submission_note : null,
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
// FAQ QUESTIONS & EVIDENCE CRUD
// ==========================================

// Helper to parse evidence links
function parseEvidenceLinks(row) {
  if (row.evidence_links) {
    try {
      const parsed = typeof row.evidence_links === 'string'
        ? JSON.parse(row.evidence_links)
        : row.evidence_links;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((lnk, idx) => {
          let u = lnk.url || '';
          if (u.includes('/uploads/ranking-faq/')) {
            u = u.replace('/uploads/ranking-faq/', '/uploads/ranking-data/');
          }
          if (lnk.type === 'file' && u && !u.startsWith('http') && !u.startsWith('/uploads/')) {
            u = `/uploads/ranking-data/${u.replace(/^uploads\//, '')}`;
          }
          return {
            type: lnk.type || 'url',
            url: u,
            label: lnk.label || `[Link ${idx + 1}]`,
            fileName: lnk.fileName || ''
          };
        });
      }
    } catch (e) {}
  }

  let fallback = [];
  if (row.file_url || row.file_name) {
    let fUrl = row.file_url;
    if (fUrl && fUrl.includes('/uploads/ranking-faq/')) {
      fUrl = fUrl.replace('/uploads/ranking-faq/', '/uploads/ranking-data/');
    }
    if (!fUrl && row.file_name) {
      fUrl = `/uploads/ranking-data/${row.file_name}`;
    } else if (fUrl && !fUrl.startsWith('http') && !fUrl.startsWith('/uploads/')) {
      fUrl = `/uploads/ranking-data/${fUrl.replace(/^uploads\//, '')}`;
    }
    fallback.push({
      type: 'file',
      url: fUrl,
      fileName: row.file_name || 'document.pdf',
      label: row.evidence_label || '[Link 1]'
    });
  } else if (row.external_url) {
    fallback.push({
      type: 'url',
      url: row.external_url,
      label: row.evidence_label || '[Link 1]'
    });
  }
  return fallback;
}

// POST /add-ranking-data - Add ranking FAQ question with file or external URL
router.post('/add-ranking-data', upload.single('file'), async (req, res) => {
  try {
    const {
      rankingName,
      rankingSlug,
      sdgNumber,
      criteriaName,
      question,
      answer,
      externalUrl,
      evidenceLabel,
      year
    } = req.body;

    if (!rankingName || !sdgNumber || !criteriaName || !question) {
      return res.status(400).json({
        message: 'Required fields: rankingName, sdgNumber, criteriaName, question'
      });
    }

    let fileName = '';
    let fileUrl = '';
    let fileSize = '0 MB';
    let originalName = '';

    if (req.file) {
      if (!fs.existsSync(req.file.path)) {
        return res.status(500).json({ message: 'File storage failed' });
      }
      fileName = req.file.filename;
      fileUrl = `/uploads/ranking-data/${req.file.filename}`;
      fileSize = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;
      originalName = req.file.originalname;
    } else if (externalUrl) {
      fileUrl = externalUrl;
      fileName = externalUrl.split('/').pop() || 'external-link';
    } else {
      return res.status(400).json({ message: 'Either a PDF file upload or an External URL link is required' });
    }

    const answerVal = answer || 'Yes';
    const extUrlVal = externalUrl || null;
    const evLabelVal = evidenceLabel || '[Link 1]';
    const yearVal = year || '2026';
    const slugVal = rankingSlug || rankingName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    let evidenceLinksJson = null;
    if (fileUrl) {
      evidenceLinksJson = JSON.stringify([{
        type: 'file',
        url: fileUrl,
        fileName: originalName || fileName,
        label: evLabelVal
      }]);
    } else if (extUrlVal) {
      evidenceLinksJson = JSON.stringify([{
        type: 'url',
        url: extUrlVal,
        label: evLabelVal
      }]);
    }

    const sql = `
      INSERT INTO ranking_data 
      (ranking_slug, ranking_name, sdg_number, criteria_name, question, answer, file_name, file_url, external_url, evidence_label, evidence_links, file_size, original_file_name, upload_date, year, is_visible)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, 1)
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
      extUrlVal,
      evLabelVal,
      evidenceLinksJson,
      fileSize,
      originalName,
      yearVal
    ];

    const [result] = await pool.query(sql, params);
    res.status(201).json({
      success: true,
      message: '✅ Ranking FAQ criteria & evidence added successfully to unified table',
      id: result.insertId,
      fileUrl
    });
  } catch (error) {
    console.error('❌ Add ranking error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// GET /rankingssite - Get all criteria FAQ items (public & admin)
router.get('/rankingssite', async (req, res) => {
  const onlyVisible = req.query.visible === '1' || String(req.query.visible).toLowerCase() === 'true';
  const { rankingName, rankingSlug, sdgNumber } = req.query;

  let whereClauses = [];
  let params = [];

  if (onlyVisible) {
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

  try {
    const [results] = await pool.query(sql, params);
    const normalizedData = results.map((row) => {
      let fileUrl = row.file_url;
      if (!fileUrl || fileUrl.includes('...')) {
        fileUrl = row.file_name ? `/uploads/ranking-data/${row.file_name}` : row.external_url || '';
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
        uploadDate: row.upload_date ? new Date(row.upload_date).toISOString().split('T')[0] : (row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
        year: row.year || '2026',
        isVisible: Boolean(row.is_visible),
        originalFileName: row.original_file_name || row.file_name || '',
        displayOrder: row.display_order || 0
      };
    });

    res.status(200).json(normalizedData);
  } catch (err) {
    console.error('❌ Error fetching rankings:', err);
    return res.status(500).json({ message: 'Error fetching rankings' });
  }
});

// PUT /update-ranking-site/:id - Update FAQ question & evidence
router.put('/update-ranking-site/:id', upload.single('file'), async (req, res) => {
  const { id } = req.params;
  const {
    rankingName,
    rankingSlug,
    sdgNumber,
    criteriaName,
    question,
    answer,
    externalUrl,
    evidenceLabel,
    year,
    isVisible
  } = req.body;

  let newFileInfo = null;
  if (req.file) {
    newFileInfo = {
      fileName: req.file.filename,
      fileUrl: `/uploads/ranking-data/${req.file.filename}`,
      fileSize: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
      originalName: req.file.originalname
    };
  }

  let visibilityVal = null;
  if (typeof isVisible !== 'undefined' && isVisible !== null) {
    const v = String(isVisible).toLowerCase();
    if (v === 'true' || v === '1' || v === 'yes' || v === 'on') visibilityVal = 1;
    else if (v === 'false' || v === '0' || v === 'no' || v === 'off') visibilityVal = 0;
  }

  let updatedEvidenceLinks = null;
  if (newFileInfo) {
    updatedEvidenceLinks = JSON.stringify([{
      type: 'file',
      url: newFileInfo.fileUrl,
      fileName: newFileInfo.originalName,
      label: evidenceLabel || '[Link 1]'
    }]);
  } else if (externalUrl) {
    updatedEvidenceLinks = JSON.stringify([{
      type: 'url',
      url: externalUrl,
      label: evidenceLabel || '[Link 1]'
    }]);
  }

  const slugVal = rankingSlug || (rankingName ? rankingName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : null);

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
      file_size = COALESCE(?, file_size),
      year = COALESCE(?, year),
      is_visible = COALESCE(?, is_visible)
    WHERE id = ?
  `;

  try {
    if (newFileInfo) {
      const [results] = await pool.query('SELECT file_name FROM ranking_data WHERE id = ?', [id]);
      if (results && results.length > 0 && results[0].file_name) {
        const oldFilePath = path.join(uploadFolder, results[0].file_name);
        if (fs.existsSync(oldFilePath)) {
          try { fs.unlinkSync(oldFilePath); } catch (e) {}
        }
      }
    }

    const params = [
      slugVal,
      rankingName !== undefined ? rankingName : null,
      sdgNumber ? parseInt(sdgNumber) : null,
      criteriaName !== undefined ? criteriaName : null,
      question !== undefined ? question : null,
      answer !== undefined ? answer : null,
      externalUrl !== undefined ? externalUrl : null,
      evidenceLabel !== undefined ? evidenceLabel : null,
      updatedEvidenceLinks,
      newFileInfo ? newFileInfo.fileName : null,
      newFileInfo ? newFileInfo.fileUrl : (externalUrl ? externalUrl : null),
      newFileInfo ? newFileInfo.fileSize : null,
      year !== undefined ? year : null,
      visibilityVal,
      id
    ];

    await pool.query(sql, params);
    res.status(200).json({ success: true, message: '✅ Ranking FAQ criteria updated successfully in unified table' });
  } catch (err) {
    console.error('❌ Error updating ranking:', err);
    res.status(500).json({ message: 'Error updating ranking: ' + err.message });
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
    console.error('❌ Error toggling visibility:', err);
    res.status(500).json({ message: 'Error toggling visibility: ' + err.message });
  }
};
router.patch('/toggle-visibility/:id', handleToggleVisibility);
router.post('/toggle-visibility/:id', handleToggleVisibility);

// DELETE /delete-ranking-site/:id
router.delete('/delete-ranking-site/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query('SELECT file_name FROM ranking_data WHERE id = ?', [id]);
    if (results.length === 0) return res.status(404).json({ message: 'Not found' });

    const fileName = results[0].file_name;
    if (fileName) {
      const fullPath = path.join(uploadFolder, fileName);
      if (fs.existsSync(fullPath)) {
        try { fs.unlinkSync(fullPath); } catch (e) {}
      }
    }

    await pool.query('DELETE FROM ranking_data WHERE id = ?', [id]);
    res.status(200).json({ message: '✅ Ranking FAQ item deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting ranking item:', err);
    res.status(500).json({ message: 'Error deleting ranking item' });
  }
});

// File download endpoint
router.get('/download/:filename', async (req, res) => {
  const filename = req.params.filename;
  let filePath = path.join(uploadFolder, filename);

  if (!fs.existsSync(filePath)) {
    const candidateDirs = [
      path.join(__dirname, "../../../uploads/ranking-faq"),
      path.join(__dirname, "../../../../visitsite/uploads/ranking-data"),
      path.join(__dirname, "../../../../visitsite/uploads/ranking-faq"),
      path.join(__dirname, "../../../../web_site3.0/uploads/ranking-data"),
      path.join(__dirname, "../../../../web_site3.0/uploads/ranking-faq"),
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
    const [results] = await pool.query('SELECT original_file_name FROM ranking_data WHERE file_name = ?', [filename]);
    let downloadName = filename;
    if (results && results.length > 0 && results[0].original_file_name) {
      downloadName = results[0].original_file_name;
    }
    res.download(filePath, downloadName);
  } catch (error) {
    res.download(filePath, filename);
  }
});

export default router;