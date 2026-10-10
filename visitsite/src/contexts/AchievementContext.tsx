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
      const payload: any = { ...item };
      
      // map client 'files' to server 'documents'
      if ((payload as any).files) {
        payload.documents = (payload as any).files.map((f: any) => (typeof f === 'string' ? f : f.url || f));
        delete payload.files;
      }

      // Ensure arrays are present and convert to JSON strings
      payload.images = JSON.stringify(payload.images || []);
      payload.videos = JSON.stringify(payload.videos || []);
      payload.documents = JSON.stringify(payload.documents || []);

      const endpointMap = {
        awards: "add-award",
        certifications: "add-certificate",
        rankings: "add-ranking",
        recognition: "add-recognition",
      };

      // Send as JSON (not FormData) so arrays stay as JSON strings
      const res = await axios.post(`${API_BASE}/${endpointMap[category]}`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

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
