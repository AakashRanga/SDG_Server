import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

// Dynamically use localhost when running locally, fallback to server IP
const getBaseUrl = () => {
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:8006";
  }
  return "http://180.235.121.250:8006";
};

// Static asset base URL:
// In live server (e.g. sdg.saveetha.com or 180.235.121.250 on port 80/443),
// static uploads are served directly by IIS/Nginx without port 8006.
// In local development, fall back to backend port 8006.
export const getAssetBaseUrl = () => {
  if (typeof window === "undefined") {
    return "http://localhost:8006";
  }
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:8006";
  }
  return window.location.origin;
};

const BASE_URL = getBaseUrl();
const API = `${BASE_URL}/api/ranking-data`;
const FAQ_API = `${BASE_URL}/api/ranking-faq`;

export interface RankingBoxItem {
  id: number;
  ranking_slug: string;
  ranking_name: string;
  tag_label: string;
  box_title: string;
  description: string;
  button_text: string;
  page_title: string;
  page_eyebrow: string;
  table_header_bg: string;
  accent_color: string;
  icon: string;
  display_order: number;
  is_active: boolean | number;
  created_at?: string;
  updated_at?: string;
}

export interface SDGGoalItem {
  id: number;
  sdg_number: number;
  title: string;
  color: string;
  is_active?: boolean | number;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_SDG_GOALS: SDGGoalItem[] = [
  { id: 1, sdg_number: 1, title: 'No Poverty', color: '#E5243B', display_order: 1 },
  { id: 2, sdg_number: 2, title: 'Zero Hunger', color: '#DDA63A', display_order: 2 },
  { id: 3, sdg_number: 3, title: 'Good Health and Well-Being', color: '#4C9F38', display_order: 3 },
  { id: 4, sdg_number: 4, title: 'Quality Education', color: '#C5192D', display_order: 4 },
  { id: 5, sdg_number: 5, title: 'Gender Equality', color: '#FF3A21', display_order: 5 },
  { id: 6, sdg_number: 6, title: 'Clean Water and Sanitation', color: '#26BDE2', display_order: 6 },
  { id: 7, sdg_number: 7, title: 'Affordable and Clean Energy', color: '#FCC30B', display_order: 7 },
  { id: 8, sdg_number: 8, title: 'Decent Work and Economic Growth', color: '#A21942', display_order: 8 },
  { id: 9, sdg_number: 9, title: 'Industry, Innovation and Infrastructure', color: '#FD6925', display_order: 9 },
  { id: 10, sdg_number: 10, title: 'Reduced Inequalities', color: '#DD1367', display_order: 10 },
  { id: 11, sdg_number: 11, title: 'Sustainable Cities and Communities', color: '#FD9D24', display_order: 11 },
  { id: 12, sdg_number: 12, title: 'Responsible Consumption and Production', color: '#BF8B2E', display_order: 12 },
  { id: 13, sdg_number: 13, title: 'Climate Action', color: '#3F7E44', display_order: 13 },
  { id: 14, sdg_number: 14, title: 'Life Below Water', color: '#0A97D9', display_order: 14 },
  { id: 15, sdg_number: 15, title: 'Life on Land', color: '#56C02B', display_order: 15 },
  { id: 16, sdg_number: 16, title: 'Peace, Justice and Strong Institutions', color: '#00689D', display_order: 16 },
  { id: 17, sdg_number: 17, title: 'Partnerships for the Goals', color: '#19486A', display_order: 17 },
];

export interface EvidenceLinkItem {
  type: 'url' | 'file';
  url: string;
  label: string;
  fileName?: string;
  file?: File | null;
}

export interface RankingDataItem {
  id: string;
  rankingSlug?: string;
  rankingName: string;
  sdgNumber: number;
  criteriaName: string;
  question: string;
  answer?: string;
  fileName: string;
  fileUrl: string;
  externalUrl?: string;
  evidenceLabel?: string;
  evidenceLinks?: EvidenceLinkItem[];
  fileSize: string;
  uploadDate: string;
  year: string;
  isVisible: boolean;
  originalFileName?: string;
}

interface RankingDataContextType {
  rankingBoxes: RankingBoxItem[];
  fetchRankingBoxes: () => Promise<void>;
  addRankingBox: (data: Partial<RankingBoxItem>) => Promise<any>;
  updateRankingBox: (id: number, data: Partial<RankingBoxItem>) => Promise<any>;
  deleteRankingBox: (id: number) => Promise<any>;
  sdgGoals: SDGGoalItem[];
  fetchSDGGoals: () => Promise<void>;
  addSDGGoal: (data: Partial<SDGGoalItem>) => Promise<any>;
  updateSDGGoal: (id: number, data: Partial<SDGGoalItem>) => Promise<any>;
  deleteSDGGoal: (id: number) => Promise<any>;
  rankingFAQs: RankingDataItem[];
  fetchRankingFAQs: () => Promise<void>;
  addRankingFAQ: (data: any) => Promise<any>;
  editRankingFAQ: (id: string, data: any) => Promise<any>;
  deleteRankingFAQ: (id: string) => Promise<any>;
  rankingData: RankingDataItem[];
  fetchRankingData: () => Promise<void>;
  addRankingData: (data: any) => Promise<void>;
  editRankingData: (id: string, data: any) => Promise<void>;
  deleteRankingData: (id: string) => Promise<void>;
  toggleVisibility: (id: string) => Promise<void>;
  downloadFile: (filename: string, originalName?: string) => Promise<void>;
  viewFile: (fileUrl: string) => void;
  previewFile: (fileUrlOrName: string) => Promise<void>;
  getStaticFileUrl: (fileName: string) => string;
  getRankingDataBySDG: (sdgNumber: number) => RankingDataItem[];
}

const RankingDataContext = createContext<RankingDataContextType | undefined>(undefined);

export const RankingDataProvider = ({ children }: { children: ReactNode }) => {
  const [rankingBoxes, setRankingBoxes] = useState<RankingBoxItem[]>([]);
  const [rankingFAQs, setRankingFAQs] = useState<RankingDataItem[]>([]);
  const [rankingData, setRankingData] = useState<RankingDataItem[]>([]);
  const [sdgGoals, setSdgGoals] = useState<SDGGoalItem[]>(DEFAULT_SDG_GOALS);

  // 1. Fetch ranking framework boxes from dedicated table
  const fetchRankingBoxes = async () => {
    try {
      const res = await axios.get(`${FAQ_API}/boxes?all=1`);
      setRankingBoxes(res.data || []);
    } catch (error) {
      console.error("Error fetching ranking boxes:", error);
    }
  };

  // 2. Fetch FAQ criteria & evidence from dedicated ranking_faqs table
  const fetchRankingFAQs = async () => {
    try {
      const res = await axios.get(`${FAQ_API}/faqs`);
      const rows = res.data || [];
      const formatted = rows.map((r: any) => {
        let fileUrl = r.fileUrl || r.file_url;
        if (fileUrl && fileUrl.includes("/uploads/ranking-faq/")) {
          fileUrl = fileUrl.replace("/uploads/ranking-faq/", "/uploads/ranking-data/");
        }
        if (fileUrl && !fileUrl.startsWith("http") && !fileUrl.startsWith("/uploads/")) {
          const clean = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
          fileUrl = clean.startsWith("uploads/") ? `/${clean}` : `/uploads/ranking-data/${clean}`;
        } else if (!fileUrl && (r.fileName || r.file_name)) {
          const raw = r.fileName || r.file_name;
          const clean = raw.startsWith("/") ? raw.slice(1) : raw;
          fileUrl = clean.startsWith("uploads/") ? `/${clean}` : `/uploads/ranking-data/${clean}`;
        } else if (!fileUrl && (r.externalUrl || r.external_url)) {
          fileUrl = r.externalUrl || r.external_url;
        }

        let evidenceLinks = r.evidenceLinks;
        if (Array.isArray(evidenceLinks)) {
          evidenceLinks = evidenceLinks.map((lnk: any) => {
            if (lnk.type === 'file' || (lnk.fileName && !lnk.url?.startsWith('http'))) {
              let u = lnk.url || '';
              if (u && u.includes('/uploads/ranking-faq/')) {
                u = u.replace('/uploads/ranking-faq/', '/uploads/ranking-data/');
              }
              if (u && !u.startsWith('http') && !u.startsWith('/uploads/')) {
                const clean = u.startsWith('/') ? u.slice(1) : u;
                u = clean.startsWith('uploads/') ? `/${clean}` : `/uploads/ranking-data/${clean}`;
              } else if (!u && lnk.fileName) {
                u = `/uploads/ranking-data/${lnk.fileName}`;
              }
              return { ...lnk, url: u };
            }
            return lnk;
          });
        }

        return {
          id: String(r.id),
          rankingSlug: r.rankingSlug || r.ranking_slug || 'the-impact-rankings',
          rankingName: r.rankingName || r.ranking_name || "",
          sdgNumber: Number(r.sdgNumber || r.sdg_number) || 0,
          criteriaName: r.criteriaName || r.criteria_name || "",
          question: r.question || "",
          answer: r.answer || "Yes",
          fileName: r.fileName || r.file_name || "",
          fileUrl: fileUrl || "",
          externalUrl: r.externalUrl || r.external_url || "",
          evidenceLabel: r.evidenceLabel || r.evidence_label || "[Link 1]",
          evidenceLinks: evidenceLinks || (r.externalUrl ? [{ type: 'url', url: r.externalUrl, label: r.evidenceLabel || '[Link 1]' }] : (fileUrl ? [{ type: 'file', url: fileUrl, label: r.evidenceLabel || '[Link 1]', fileName: r.fileName }] : [])),
          fileSize: r.fileSize || r.file_size || "0 MB",
          uploadDate: r.uploadDate || r.upload_date || "",
          year: r.year || "2026",
          isVisible: Boolean(r.isVisible !== undefined ? r.isVisible : r.is_visible)
        };
      });
      setRankingFAQs(formatted);
    } catch (error) {
      console.error("Error fetching ranking FAQs:", error);
    }
  };

  // 2. Fetch ranking criteria questions & evidence
  const fetchRankingData = async () => {
    try {
      const res = await axios.get(`${API}/rankingssite`);
      const rows = res.data || [];
      const formatted = rows.map((r: any) => {
        let fileUrl = r.fileUrl || r.file_url;
        if (fileUrl && !fileUrl.startsWith("http") && !fileUrl.startsWith("/uploads/")) {
          const clean = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
          fileUrl = clean.startsWith("uploads/") ? `/${clean}` : `/uploads/ranking-data/${clean}`;
        } else if (!fileUrl && (r.file_name || r.fileName)) {
          const raw = r.file_name || r.fileName;
          const clean = raw.startsWith("/") ? raw.slice(1) : raw;
          fileUrl = clean.startsWith("uploads/") ? `/${clean}` : `/uploads/ranking-data/${clean}`;
        } else if (!fileUrl && (r.external_url || r.externalUrl)) {
          fileUrl = r.external_url || r.externalUrl;
        }

        return {
          id: String(r.id),
          rankingName: r.rankingName || r.ranking_name || "",
          sdgNumber: Number(r.sdgNumber || r.sdg_number) || 0,
          criteriaName: r.criteriaName || r.criteria_name || "",
          question: r.question || "",
          answer: r.answer || "Yes",
          fileName: r.fileName || r.file_name || "",
          fileUrl: fileUrl || "",
          externalUrl: r.externalUrl || r.external_url || "",
          evidenceLabel: r.evidenceLabel || r.evidence_label || "[Link 1]",
          fileSize: r.fileSize || r.file_size || "0 MB",
          uploadDate: r.uploadDate || r.upload_date || "",
          year: r.year || "2026",
          isVisible: Boolean(r.isVisible !== undefined ? r.isVisible : r.is_visible),
          originalFileName: r.originalFileName || r.original_file_name || ""
        };
      });
      setRankingData(formatted);
    } catch (error) {
      console.error("Error fetching ranking data:", error);
    }
  };

  // 3. Fetch dynamic SDG goals
  const fetchSDGGoals = async () => {
    try {
      const res = await axios.get(`${FAQ_API}/sdg-goals?all=1`);
      if (res.data && res.data.length > 0) {
        setSdgGoals(res.data);
      }
    } catch (error) {
      console.error("Error fetching dynamic SDG goals:", error);
    }
  };

  useEffect(() => {
    fetchRankingBoxes();
    fetchRankingFAQs();
    fetchRankingData();
    fetchSDGGoals();
  }, []);

  // SDG Goals CRUD
  const addSDGGoal = async (data: Partial<SDGGoalItem>) => {
    const res = await axios.post(`${FAQ_API}/sdg-goals`, data);
    await fetchSDGGoals();
    return res.data;
  };

  const updateSDGGoal = async (id: number, data: Partial<SDGGoalItem>) => {
    const res = await axios.put(`${FAQ_API}/sdg-goals/${id}`, data);
    await fetchSDGGoals();
    return res.data;
  };

  const deleteSDGGoal = async (id: number) => {
    const res = await axios.delete(`${FAQ_API}/sdg-goals/${id}`);
    await fetchSDGGoals();
    return res.data;
  };

  // Box CRUD (Dedicated to ranking_faq_boxes)
  const addRankingBox = async (data: Partial<RankingBoxItem>) => {
    const res = await axios.post(`${FAQ_API}/boxes`, data);
    await fetchRankingBoxes();
    return res.data;
  };

  const updateRankingBox = async (id: number, data: Partial<RankingBoxItem>) => {
    const res = await axios.put(`${FAQ_API}/boxes/${id}`, data);
    await fetchRankingBoxes();
    return res.data;
  };

  const deleteRankingBox = async (id: number) => {
    const res = await axios.delete(`${FAQ_API}/boxes/${id}`);
    await fetchRankingBoxes();
    return res.data;
  };

  // Dedicated FAQ CRUD (Dedicated to ranking_faqs)
  const addRankingFAQ = async (data: any) => {
    const formData = new FormData();
    formData.append("rankingName", data.rankingName);
    if (data.rankingSlug) formData.append("rankingSlug", data.rankingSlug);
    formData.append("sdgNumber", String(data.sdgNumber));
    formData.append("criteriaName", data.criteriaName);
    formData.append("question", data.question);
    formData.append("answer", data.answer || "Yes");
    formData.append("year", data.year || "2026");
    if (data.externalUrl) formData.append("externalUrl", data.externalUrl);
    if (data.evidenceLabel) formData.append("evidenceLabel", data.evidenceLabel);
    if (data.file) formData.append("file", data.file);

    if (data.evidenceLinks && Array.isArray(data.evidenceLinks)) {
      formData.append("evidenceLinks", JSON.stringify(data.evidenceLinks.map((l: any) => ({
        type: l.type,
        url: l.url,
        label: l.label,
        fileName: l.fileName
      }))));
      data.evidenceLinks.forEach((link: any, idx: number) => {
        if (link.file) {
          formData.append(`file_${idx}`, link.file);
        }
      });
    }

    const res = await axios.post(`${FAQ_API}/faqs`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    await fetchRankingFAQs();
    return res.data;
  };

  const editRankingFAQ = async (id: string, data: any) => {
    const formData = new FormData();
    if (data.rankingName) formData.append("rankingName", data.rankingName);
    if (data.rankingSlug) formData.append("rankingSlug", data.rankingSlug);
    if (data.sdgNumber) formData.append("sdgNumber", String(data.sdgNumber));
    if (data.criteriaName) formData.append("criteriaName", data.criteriaName);
    if (data.question) formData.append("question", data.question);
    if (data.answer) formData.append("answer", data.answer);
    if (data.year) formData.append("year", data.year);
    if (data.externalUrl !== undefined) formData.append("externalUrl", data.externalUrl);
    if (data.evidenceLabel !== undefined) formData.append("evidenceLabel", data.evidenceLabel);
    if (data.isVisible !== undefined) formData.append("isVisible", String(data.isVisible));
    if (data.file) formData.append("file", data.file);

    if (data.evidenceLinks && Array.isArray(data.evidenceLinks)) {
      formData.append("evidenceLinks", JSON.stringify(data.evidenceLinks.map((l: any) => ({
        type: l.type,
        url: l.url,
        label: l.label,
        fileName: l.fileName
      }))));
      data.evidenceLinks.forEach((link: any, idx: number) => {
        if (link.file) {
          formData.append(`file_${idx}`, link.file);
        }
      });
    }

    const res = await axios.put(`${FAQ_API}/faqs/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    await fetchRankingFAQs();
    return res.data;
  };

  const deleteRankingFAQ = async (id: string) => {
    const res = await axios.delete(`${FAQ_API}/faqs/${id}`);
    await fetchRankingFAQs();
    return res.data;
  };

  // Ranking Criteria FAQ CRUD
  const addRankingData = async (data: any) => {
    const formData = new FormData();
    formData.append("rankingName", data.rankingName);
    formData.append("sdgNumber", String(data.sdgNumber));
    formData.append("criteriaName", data.criteriaName);
    formData.append("question", data.question);
    formData.append("answer", data.answer || "Yes");
    formData.append("year", data.year || "2026");

    if (data.externalUrl) {
      formData.append("externalUrl", data.externalUrl);
    }
    if (data.evidenceLabel) {
      formData.append("evidenceLabel", data.evidenceLabel);
    }
    if (data.file) {
      formData.append("file", data.file);
    }

    await axios.post(`${API}/add-ranking-data`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    await fetchRankingData();
  };

  const editRankingData = async (id: string, data: any) => {
    const formData = new FormData();
    if (data.rankingName) formData.append("rankingName", data.rankingName);
    if (data.sdgNumber !== undefined) formData.append("sdgNumber", String(data.sdgNumber));
    if (data.criteriaName) formData.append("criteriaName", data.criteriaName);
    if (data.question) formData.append("question", data.question);
    if (data.answer) formData.append("answer", data.answer);
    if (data.externalUrl !== undefined) formData.append("externalUrl", data.externalUrl);
    if (data.evidenceLabel) formData.append("evidenceLabel", data.evidenceLabel);
    if (data.year) formData.append("year", data.year);
    if (data.isVisible !== undefined) formData.append("isVisible", String(data.isVisible));

    if (data.file) {
      formData.append("file", data.file);
    }

    await axios.put(`${API}/update-ranking-site/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    await fetchRankingData();
  };

  const deleteRankingData = async (id: string) => {
    await axios.delete(`${API}/delete-ranking-site/${id}`);
    await fetchRankingData();
  };

  const toggleVisibility = async (id: string) => {
    const item = rankingData.find((x) => x.id === id);
    if (!item) return;
    await editRankingData(id, { isVisible: !item.isVisible });
  };

  const downloadFile = async (filename: string, originalName?: string) => {
    try {
      const response = await axios.get(`${API}/download/${filename}`, {
        responseType: "blob"
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = originalName || filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      throw new Error("Failed to download file");
    }
  };

  const viewFile = (fileUrl: string) => {
    if (!fileUrl) return;
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      window.open(fileUrl, "_blank");
      return;
    }
    let path = fileUrl.trim();
    if (!path.startsWith("/")) {
      if (path.startsWith("uploads/")) {
        path = `/${path}`;
      } else {
        path = `/uploads/ranking-data/${path}`;
      }
    }
    const assetBase = getAssetBaseUrl();
    const finalUrl = `${assetBase}${path}`;
    window.open(finalUrl, "_blank");
  };

  const previewFile = async (fileUrlOrName: string) => {
    if (!fileUrlOrName) return;
    if (fileUrlOrName.startsWith("http://") || fileUrlOrName.startsWith("https://")) {
      window.open(fileUrlOrName, "_blank");
      return;
    }
    let path = fileUrlOrName.trim();
    if (path.includes("/uploads/ranking-faq/")) {
      path = path.replace("/uploads/ranking-faq/", "/uploads/ranking-data/");
    }
    if (!path.startsWith("/")) {
      if (path.startsWith("uploads/")) {
        path = `/${path}`;
      } else {
        path = `/uploads/ranking-data/${path}`;
      }
    }
    viewFile(path);
  };

  const getStaticFileUrl = (fileName: string) => {
    const cleanFileName = fileName.includes("/") ? fileName.split("/").pop() : fileName;
    const assetBase = getAssetBaseUrl();
    return `${assetBase}/uploads/ranking-data/${cleanFileName}`;
  };

  const getRankingDataBySDG = (sdgNumber: number) => {
    return rankingData.filter((item) => item.sdgNumber === sdgNumber);
  };

  return (
    <RankingDataContext.Provider
      value={{
        rankingBoxes,
        fetchRankingBoxes,
        addRankingBox,
        updateRankingBox,
        deleteRankingBox,
        sdgGoals,
        fetchSDGGoals,
        addSDGGoal,
        updateSDGGoal,
        deleteSDGGoal,
        rankingFAQs,
        fetchRankingFAQs,
        addRankingFAQ,
        editRankingFAQ,
        deleteRankingFAQ,
        rankingData,
        fetchRankingData,
        addRankingData,
        editRankingData,
        deleteRankingData,
        toggleVisibility,
        downloadFile,
        viewFile,
        previewFile,
        getStaticFileUrl,
        getRankingDataBySDG
      }}
    >
      {children}
    </RankingDataContext.Provider>
  );
};

export const useRankingData = () => {
  const context = useContext(RankingDataContext);
  if (!context) {
    throw new Error("useRankingData must be used within a RankingDataProvider");
  }
  return context;
};