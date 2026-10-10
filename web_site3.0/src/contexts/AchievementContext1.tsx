import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import axios from "axios";

const API_BASE = "http://180.235.121.250:8006/api/achievements";

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  images?: string[];
  videos?: string[];
  files?: { name: string; url: string; size: string }[];
  organization?: string;
  rank?: string;
  score?: string;
}

interface AchievementContextType {
  awards: AchievementItem[];
  certifications: AchievementItem[];
  rankings: AchievementItem[];
  recognition: AchievementItem[];
  addAchievement: (category: TabType, item: Omit<AchievementItem, "id">) => Promise<void>;
  updateAchievement: (category: TabType, id: string, item: Partial<AchievementItem>) => Promise<void>;
  deleteAchievement: (category: TabType, id: string) => Promise<void>;
}

type TabType = "awards" | "certifications" | "rankings" | "recognition";

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [awards, setAwards] = useState<AchievementItem[]>([]);
  const [certifications, setCertifications] = useState<AchievementItem[]>([]);
  const [rankings, setRankings] = useState<AchievementItem[]>([]);
  const [recognition, setRecognition] = useState<AchievementItem[]>([]);

  // ✅ Fetch all achievements once on load
  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const [awardsRes, certRes, rankRes, recogRes] = await Promise.all([
        axios.get(`${API_BASE}/awards`),
        axios.get(`${API_BASE}/certificates`),
        axios.get(`${API_BASE}/rankings`),
        // server exposes the recognitions GET on /recognition (singular)
        axios.get(`${API_BASE}/recognition`)
      ]);

      setAwards(awardsRes.data);
      setCertifications(certRes.data);
      setRankings(rankRes.data);
      setRecognition(recogRes.data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  // ✅ Add Achievement
  const addAchievement = async (category: TabType, item: Omit<AchievementItem, "id">) => {
    try {
      const formData = new FormData();

      // helper: convert data URLs (base64) to Blob
      const dataUrlToBlob = async (dataUrl: string) => {
        const res = await fetch(dataUrl);
        return res.blob();
      };

      // append value, handling async conversion for data URLs
      const appendValueAsync = async (k: string, v: any) => {
        // File or Blob: append directly
        if (v instanceof File || v instanceof Blob) {
          formData.append(k, v as File | Blob);
          return;
        }

        // string
        if (typeof v === "string") {
          // data URL (large base64 preview) -> convert to Blob and append as file
          if (v.startsWith("data:")) {
            try {
              const blob = await dataUrlToBlob(v);
              // try to infer extension from mime type
              const mime = blob.type || "application/octet-stream";
              const ext = mime.split("/")[1] || "bin";
              const filename = `${Date.now()}.${ext}`;
              const file = new File([blob], filename, { type: mime });
              formData.append(k, file);
              return;
            } catch (err) {
              // fallback: append as string if conversion fails
              formData.append(k, v);
              return;
            }
          }

          // regular string (including existing server upload urls like /uploads/...)
          formData.append(k, v);
          return;
        }

        // object with url property -> if url is data: convert, else append url string
        if (v && typeof v === "object") {
          if ("url" in v && typeof v.url === "string") {
            const urlVal = v.url;
            if (urlVal.startsWith("data:")) {
              try {
                const blob = await dataUrlToBlob(urlVal);
                const mime = blob.type || "application/octet-stream";
                const ext = mime.split("/")[1] || "bin";
                const filename = `${Date.now()}.${ext}`;
                const file = new File([blob], filename, { type: mime });
                formData.append(k, file);
                return;
              } catch (err) {
                formData.append(k, urlVal);
                return;
              }
            }

            // non-data URL (likely already uploaded path) -> send URL string
            formData.append(k, urlVal);
            return;
          }

          // fallback: stringify small objects
          formData.append(k, JSON.stringify(v));
          return;
        }

        // fallback for numbers/booleans/null/undefined
        formData.append(k, String(v ?? ""));
      };

      // iterate entries and await any async conversions
      for (const [key, value] of Object.entries(item)) {
        // map client-side key names to server-expected multipart field names
        const formKey = key === "files" ? "documents" : key;

        if (Array.isArray(value)) {
          for (const entry of value) {
            // await conversion/appending per entry
            await appendValueAsync(formKey, entry);
          }
        } else {
          await appendValueAsync(formKey, value);
        }
      }

      const endpointMap = {
        awards: "add-award",
        certifications: "add-certificate",
        rankings: "add-ranking",
        recognition: "add-recognition",
      };

      // Let axios set the Content-Type (including boundary) for multipart/form-data
      const res = await axios.post(`${API_BASE}/${endpointMap[category]}`, formData);

      // ✅ Refresh the list after successful addition
      await fetchAchievements();
      console.log("Added:", res.data);
    } catch (error: any) {
      // Log useful server response body when available (helps debug 500s)
      console.error("Error adding achievement:", error);
      if (error.response) {
        console.error("Server response status:", error.response.status);
        console.error("Server response data:", error.response.data);
      }
      throw error;
    }
  };

  // ✅ Delete Achievement
  const deleteAchievement = async (category: TabType, id: string) => {
    try {
      const endpointMap = {
        awards: "delete-award",
        certifications: "delete-certificate",
        rankings: "delete-ranking",
        recognition: "delete-recognition",
      };

      await axios.delete(`${API_BASE}/${endpointMap[category]}/${id}`);
      await fetchAchievements();
    } catch (error) {
      console.error("Error deleting achievement:", error);
    }
  };

  // ✅ Update Achievement
  const updateAchievement = async (category: TabType, id: string, item: Partial<AchievementItem>) => {
    try {
      const endpointMap = {
        awards: 'update-award',
        certifications: 'update-certificate',
        rankings: 'update-ranking',
        recognition: 'update-recognition',
      } as const;

      // map client 'files' to server 'documents'
      const payload: any = { ...item };
      if ((payload as any).files) {
        payload.documents = (payload as any).files.map((f: any) => (typeof f === 'string' ? f : f.url || f));
        delete payload.files;
      }

      // Ensure arrays are present for images/videos/documents
      payload.images = payload.images || [];
      payload.videos = payload.videos || [];
      payload.documents = payload.documents || [];

      await axios.put(`${API_BASE}/${endpointMap[category]}/${id}`, payload);
      await fetchAchievements();
    } catch (error: any) {
      console.error('Error updating achievement:', error);
      if (error.response) {
        console.error('Server response status:', error.response.status);
        console.error('Server response data:', error.response.data);
      }
      throw error;
    }
  };

  return (
    <AchievementContext.Provider
      value={{ awards, certifications, rankings, recognition, addAchievement, updateAchievement, deleteAchievement }}
    >
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievement() {
  const context = useContext(AchievementContext);
  if (!context) throw new Error("useAchievement must be used within AchievementProvider");
  return context;
}
