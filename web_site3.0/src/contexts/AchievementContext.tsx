import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import axios from "axios";

const API_BASE = "http://180.235.121.250:8006/api/achievements";
const IMAGE_BASE = "http://180.235.121.250:8006";

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  images?: string[];
  videos?: string[];
  files?: { name: string; url: string; size: string }[];
  documents?: string[];
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
  refreshAchievements: () => Promise<void>;
}

type TabType = "awards" | "certifications" | "rankings" | "recognition";

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

// ✅ Helper function to check if a string is base64
function isBase64Data(str: string): boolean {
  return str && typeof str === 'string' && str.startsWith('data:');
}

// ✅ Helper to get displayable image URL
export function getImageUrl(image: string): string {
  if (!image) return '';
  
  // If it's already a base64 string, return as is (but warn if too long)
  if (isBase64Data(image)) {
    if (image.length > 1000) {
      console.warn('⚠️ Base64 image is very long, might cause performance issues');
    }
    return image;
  }
  
  // If it's a path starting with /uploads/, prepend base URL
  if (image.startsWith('/uploads/')) {
    return `${IMAGE_BASE}${image}`;
  }
  
  // If it's a full URL, use as is
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  
  // Default: treat as path
  return `${IMAGE_BASE}${image}`;
}

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
        axios.get(`${API_BASE}/recognition`)
      ]);

      // ✅ Process images to ensure they're displayable
      const processItems = (items: any[]): AchievementItem[] => {
        return items.map((item: any) => ({
          ...item,
          images: item.images?.map((img: string) => {
            // If it's base64 and very long, it might be corrupted
            if (isBase64Data(img) && img.length > 1000) {
              console.warn(`⚠️ Long base64 image found for award ${item.id}`);
            }
            return img;
          }) || [],
          videos: item.videos || [],
          documents: item.documents || [],
        }));
      };

      setAwards(processItems(awardsRes.data));
      setCertifications(processItems(certRes.data));
      setRankings(processItems(rankRes.data));
      setRecognition(processItems(recogRes.data));
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  // ✅ Add Achievement
  const addAchievement = async (category: TabType, item: Omit<AchievementItem, "id">) => {
    try {
      console.log("📤 Adding achievement:", category, item);

      const payload: any = { ...item };
      
      // ✅ Process files - convert File objects to base64
      if (payload.images && Array.isArray(payload.images)) {
        const processedImages = await Promise.all(
          payload.images.map(async (img: any) => {
            if (img instanceof File) {
              return await fileToBase64(img);
            }
            return img;
          })
        );
        payload.images = processedImages;
      }

      if (payload.videos && Array.isArray(payload.videos)) {
        const processedVideos = await Promise.all(
          payload.videos.map(async (video: any) => {
            if (video instanceof File) {
              return await fileToBase64(video);
            }
            return video;
          })
        );
        payload.videos = processedVideos;
      }

      if (payload.files && Array.isArray(payload.files)) {
        const processedFiles = await Promise.all(
          payload.files.map(async (file: any) => {
            if (file instanceof File) {
              return await fileToBase64(file);
            }
            if (typeof file === 'object' && file.url) {
              return file.url;
            }
            return file;
          })
        );
        payload.documents = processedFiles;
        delete payload.files;
      }

      if (!payload.images) payload.images = [];
      if (!payload.videos) payload.videos = [];
      if (!payload.documents) payload.documents = [];

      if (payload.rank && !payload.score) {
        payload.score = payload.rank;
      }

      const endpointMap = {
        awards: "add-award",
        certifications: "add-certificate",
        rankings: "add-ranking",
        recognition: "add-recognition",
      };

      console.log("📦 Sending payload:", payload);

      const res = await axios.post(`${API_BASE}/${endpointMap[category]}`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      await fetchAchievements();
      console.log("✅ Added:", res.data);
    } catch (error: any) {
      console.error("❌ Error adding achievement:", error);
      if (error.response) {
        console.error("Server response status:", error.response.status);
        console.error("Server response data:", error.response.data);
      }
      throw error;
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
      console.log("📝 Updating achievement:", category, id, item);

      const endpointMap = {
        awards: 'update-award',
        certifications: 'update-certificate',
        rankings: 'update-ranking',
        recognition: 'update-recognition',
      } as const;

      const payload: any = { ...item };

      if (payload.files && Array.isArray(payload.files)) {
        const processedFiles = await Promise.all(
          payload.files.map(async (file: any) => {
            if (file instanceof File) {
              return await fileToBase64(file);
            }
            if (typeof file === 'object' && file.url) {
              return file.url;
            }
            return file;
          })
        );
        payload.documents = processedFiles;
        delete payload.files;
      }

      if (payload.images === undefined) payload.images = [];
      if (payload.videos === undefined) payload.videos = [];
      if (payload.documents === undefined) payload.documents = [];

      console.log("📦 Update payload:", payload);

      const response = await axios.put(`${API_BASE}/${endpointMap[category]}/${id}`, payload);
      await fetchAchievements();
      console.log("✅ Updated:", response.data);
    } catch (error: any) {
      console.error('❌ Error updating achievement:', error);
      if (error.response) {
        console.error('Server response status:', error.response.status);
        console.error('Server response data:', error.response.data);
      }
      throw error;
    }
  };

  const refreshAchievements = async () => {
    await fetchAchievements();
  };

  return (
    <AchievementContext.Provider
      value={{ 
        awards, 
        certifications, 
        rankings, 
        recognition, 
        addAchievement, 
        updateAchievement, 
        deleteAchievement,
        refreshAchievements
      }}
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