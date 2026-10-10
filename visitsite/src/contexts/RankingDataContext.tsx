import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

const API = "http://180.235.121.250:8006/api/ranking-data";
const BASE_URL = "http://180.235.121.250:8006";

export interface RankingDataItem {
  id: string;
  rankingName: string;
  sdgNumber: number;
  criteriaName: string;
  question: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  uploadDate: string;
  year: string;
  isVisible: boolean;
  originalFileName?: string;
}

interface RankingDataContextType {
  rankingData: RankingDataItem[];
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
  const [rankingData, setRankingData] = useState<RankingDataItem[]>([]);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const res = await axios.get(`${API}/rankingssite`);
        const rows = res.data || [];
        const formatted = rows.map((r: any) => {
          // Ensure fileUrl uses correct static path
          let fileUrl = r.fileUrl || r.file_url;
          if (!fileUrl || !fileUrl.startsWith('/uploads/ranking-data/')) {
            // Extract just the filename
            const fileName = r.file_name || r.fileName;
            fileUrl = `/uploads/ranking-data/${fileName}`;
          }
          
          return {
            id: String(r.id),
            rankingName: r.rankingName || r.ranking_name || '',
            sdgNumber: Number(r.sdgNumber || r.sdg_number) || 0,
            criteriaName: r.criteriaName || r.criteria_name || '',
            question: r.question || '',
            fileName: r.fileName || r.file_name || '',
            fileUrl: fileUrl,
            fileSize: r.fileSize || r.file_size || '',
            uploadDate: r.uploadDate || r.upload_date || '',
            year: r.year || '2025',
            isVisible: Boolean(r.isVisible !== undefined ? r.isVisible : r.is_visible),
            originalFileName: r.originalFileName || r.original_file_name || ''
          };
        });
        setRankingData(formatted);
      } catch (error) {
        console.error('Error fetching ranking data:', error);
      }
    };

    fetchRankingData();
  }, []);

  const addRankingData = async (data: any) => {
    const formData = new FormData();
    
    formData.append('rankingName', data.rankingName);
    formData.append('sdgNumber', String(data.sdgNumber));
    formData.append('criteriaName', data.criteriaName);
    formData.append('question', data.question);
    formData.append('year', data.year || '2025');
    
    if (data.file) {
      formData.append('file', data.file);
    }

    await axios.post(`${API}/add-ranking-data`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    // Refresh data
    await fetchRankingData();
  };

  const editRankingData = async (id: string, data: any) => {
    const formData = new FormData();
    
    if (data.rankingName) formData.append('rankingName', data.rankingName);
    if (data.sdgNumber !== undefined) formData.append('sdgNumber', String(data.sdgNumber));
    if (data.criteriaName) formData.append('criteriaName', data.criteriaName);
    if (data.question) formData.append('question', data.question);
    if (data.year) formData.append('year', data.year);
    if (data.isVisible !== undefined) formData.append('isVisible', String(data.isVisible));
    
    if (data.file) {
      formData.append('file', data.file);
    }

    await axios.put(`${API}/update-ranking-site/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    // Refresh data
    await fetchRankingData();
  };

  const deleteRankingData = async (id: string) => {
    await axios.delete(`${API}/delete-ranking-site/${id}`);
    
    // Refresh data
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
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = originalName || filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      throw new Error('Failed to download file');
    }
  };

  const viewFile = (fileUrl: string) => {
    console.log('View file URL:', fileUrl);
    
    // Ensure the URL is properly formatted
    let finalUrl = fileUrl;
    
    if (!fileUrl.startsWith('http')) {
      // If it's a relative path, prepend the base URL
      finalUrl = fileUrl.startsWith('/') 
        ? `${BASE_URL}${fileUrl}`
        : `${BASE_URL}/${fileUrl}`;
    }
    
    console.log('Final view URL:', finalUrl);
    window.open(finalUrl, '_blank');
  };

  const previewFile = async (fileUrlOrName: string) => {
    try {
      // If given a full URL or relative path, extract filename
      const parts = fileUrlOrName.split('/');
      const filename = parts[parts.length - 1];

      // Attempt to download via API (returns blob)
      const response = await axios.get(`${API}/download/${filename}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // Open blob URL in a new tab to allow viewer to render
      window.open(url, '_blank');

      // Revoke object URL after a short delay to allow the new tab to load
      setTimeout(() => {
        try { window.URL.revokeObjectURL(url); } catch (e) { /* ignore */ }
      }, 10000);
    } catch (error) {
      console.error('Preview error, falling back to direct open:', error);
      // Fallback: open the static file URL via viewFile which will prepend BASE_URL
      const fallback = fileUrlOrName.startsWith('/') ? fileUrlOrName : `/uploads/ranking-data/${fileUrlOrName}`;
      viewFile(fallback);
    }
  };

  const getStaticFileUrl = (fileName: string) => {
    // Extract just the filename if it contains path
    const cleanFileName = fileName.includes('/') 
      ? fileName.split('/').pop() 
      : fileName;
    
    return `${BASE_URL}/uploads/ranking-data/${cleanFileName}`;
  };

  // Return ranking data items for a specific SDG number
  const getRankingDataBySDG = (sdgNumber: number) => {
    return rankingData.filter(item => Number(item.sdgNumber) === Number(sdgNumber));
  };

  // Helper function to refresh data
  const fetchRankingData = async () => {
    try {
      const res = await axios.get(`${API}/rankingssite`);
      const rows = res.data || [];
      const formatted = rows.map((r: any) => {
        let fileUrl = r.fileUrl || r.file_url;
        if (!fileUrl || !fileUrl.startsWith('/uploads/ranking-data/')) {
          const fileName = r.file_name || r.fileName;
          fileUrl = `/uploads/ranking-data/${fileName}`;
        }
        
        return {
          id: String(r.id),
          rankingName: r.rankingName || r.ranking_name || '',
          sdgNumber: Number(r.sdgNumber || r.sdg_number) || 0,
          criteriaName: r.criteriaName || r.criteria_name || '',
          question: r.question || '',
          fileName: r.fileName || r.file_name || '',
          fileUrl: fileUrl,
          fileSize: r.fileSize || r.file_size || '',
          uploadDate: r.uploadDate || r.upload_date || '',
          year: r.year || '2025',
          isVisible: Boolean(r.isVisible !== undefined ? r.isVisible : r.is_visible),
          originalFileName: r.originalFileName || r.original_file_name || ''
        };
      });
      setRankingData(formatted);
    } catch (error) {
      console.error('Error fetching ranking data:', error);
    }
  };

  return (
    <RankingDataContext.Provider value={{ 
      rankingData, 
      addRankingData, 
      editRankingData, 
      deleteRankingData, 
      toggleVisibility,
      downloadFile,
      viewFile,
      previewFile,
      getStaticFileUrl,
      getRankingDataBySDG
    }}>
      {children}
    </RankingDataContext.Provider>
  );
};

export const useRankingData = () => {
  const context = useContext(RankingDataContext);
  if (!context) throw new Error("useRankingData must be inside RankingDataProvider");
  return context;
};