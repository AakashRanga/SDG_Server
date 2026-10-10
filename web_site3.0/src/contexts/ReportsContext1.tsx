import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://180.235.121.250:8006/api/sustainability-reports';
export interface ReportItem {
  id: string;
  title: string;
  description: string;
  year: string;
  category: string;
  files?: {
    name: string;
    url: string;
    size: string;
  }[];
  coverImage?: string;
  images?: string[];
  videos?: string[];
  metrics?: {
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'stable';
  }[];
}
interface ReportsContextType {
  annualReports: ReportItem[];
  impactReports: ReportItem[];
  sustainabilityMetrics: ReportItem[];
  addReport: (category: 'annualReports' | 'impactReports' | 'sustainabilityMetrics', item: Omit<ReportItem, 'id'>) => Promise<void>;
  updateReport: (category: 'annualReports' | 'impactReports' | 'sustainabilityMetrics', id: string, item: Partial<ReportItem>) => Promise<void>;
  deleteReport: (category: 'annualReports' | 'impactReports' | 'sustainabilityMetrics', id: string) => Promise<void>;
}
const ReportsContext = createContext<ReportsContextType | undefined>(undefined);
export function ReportsProvider({
  children
}: {
  children: ReactNode;
}) {
  const [annualReports, setAnnualReports] = useState<ReportItem[]>([{
    id: '1',
    title: 'Annual Sustainability Report 2024',
    description: 'Comprehensive overview of our sustainability achievements, challenges, and future goals for the year 2024.',
    year: '2024',
    category: 'Annual Report',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    metrics: [{
      label: 'Carbon Reduction',
      value: '45%',
      change: '+12%',
      trend: 'up'
    }, {
      label: 'Renewable Energy',
      value: '78%',
      change: '+15%',
      trend: 'up'
    }, {
      label: 'Water Conservation',
      value: '2.5M gal',
      change: '+8%',
      trend: 'up'
    }, {
      label: 'Waste Diverted',
      value: '85%',
      change: '+5%',
      trend: 'up'
    }]
  }]);
  const [impactReports, setImpactReports] = useState<ReportItem[]>([{
    id: '1',
    title: 'Climate Action Impact Report 2024',
    description: 'Detailed analysis of our climate action initiatives and their measurable environmental impact.',
    year: '2024',
    category: 'Impact Assessment',
    coverImage: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop',
    metrics: [{
      label: 'CO2 Avoided',
      value: '12,500 tons',
      trend: 'up'
    }, {
      label: 'Trees Equivalent',
      value: '580,000',
      trend: 'up'
    }, {
      label: 'Cost Savings',
      value: '$2.8M',
      trend: 'up'
    }]
  }]);
  const [sustainabilityMetrics, setSustainabilityMetrics] = useState<ReportItem[]>([{
    id: '1',
    title: 'Q4 2024 Sustainability Dashboard',
    description: 'Real-time metrics and KPIs tracking our sustainability performance across all categories.',
    year: '2024',
    category: 'Quarterly Metrics',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    metrics: [{
      label: 'Energy Efficiency',
      value: '92%',
      change: '+3%',
      trend: 'up'
    }, {
      label: 'Green Space',
      value: '45 acres',
      change: '+2 acres',
      trend: 'up'
    }, {
      label: 'Bike Usage',
      value: '3,200/day',
      change: '+400',
      trend: 'up'
    }, {
      label: 'Recycling Rate',
      value: '88%',
      change: '+2%',
      trend: 'up'
    }]
  }]);
  // Fetch existing reports on mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [annualRes, impactRes, metricsRes] = await Promise.all([
        axios.get(`${API_BASE}/annual-reports`),
        axios.get(`${API_BASE}/impact-reports`),
        axios.get(`${API_BASE}/sustainability-metrics`),
      ]);

      // Normalize metrics field: backend may return metrics as JSON string, null, or already an array
      const normalizeItem = (it: any): ReportItem => {
        // metrics: may be stored as JSON string or as object/array
        let metrics: any = it?.metrics ?? [];
        if (typeof metrics === 'string') {
          try {
            metrics = JSON.parse(metrics);
          } catch (e) {
            metrics = [];
          }
        }
        if (!Array.isArray(metrics)) metrics = [];

        // additional_images and videos are stored as JSON strings in DB; parse them
        let additional_images: string[] = [];
        try {
          if (typeof it?.additional_images === 'string' && it.additional_images) {
            additional_images = JSON.parse(it.additional_images);
          } else if (Array.isArray(it?.additional_images)) {
            additional_images = it.additional_images;
          }
        } catch (e) {
          additional_images = [];
        }

        let videos: string[] = [];
        try {
          if (typeof it?.videos === 'string' && it.videos) {
            videos = JSON.parse(it.videos);
          } else if (Array.isArray(it?.videos)) {
            videos = it.videos;
          }
        } catch (e) {
          videos = [];
        }

        // map snake_case DB keys to camelCase used by frontend
       const mapped: any = {
            ...it,
            id: it.id ? String(it.id) : it.id,
            title: it.title,
            description: it.description,
            year: it.year,
            category: it.category,
            coverImage: it.cover_image || it.coverImage || null,
            images: additional_images,
            videos,     // overwrite backend
            metrics,    // overwrite backend
          };

        return mapped as ReportItem;
      };

      setAnnualReports((annualRes.data || []).map(normalizeItem));
      setImpactReports((impactRes.data || []).map(normalizeItem));
      setSustainabilityMetrics((metricsRes.data || []).map(normalizeItem));
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const addReport = async (category: 'annualReports' | 'impactReports' | 'sustainabilityMetrics', item: Omit<ReportItem, 'id'>) => {
    try {
      const formData = new FormData();

      // helper: convert data URLs to Blob
      const dataUrlToBlob = async (dataUrl: string) => {
        const res = await fetch(dataUrl);
        return res.blob();
      };

      const appendValueAsync = async (k: string, v: any) => {
        if (v instanceof File || v instanceof Blob) {
          formData.append(k, v);
          return;
        }
        if (typeof v === 'string') {
          if (v.startsWith('data:')) {
            try {
              const blob = await dataUrlToBlob(v);
              const mime = blob.type || 'application/octet-stream';
              const ext = mime.split('/')[1] || 'bin';
              const filename = `${Date.now()}.${ext}`;
              const file = new File([blob], filename, { type: mime });
              formData.append(k, file);
              return;
            } catch (err) {
              formData.append(k, v);
              return;
            }
          }
          formData.append(k, v);
          return;
        }
        if (v && typeof v === 'object') {
          if ('url' in v && typeof v.url === 'string') {
            const urlVal = v.url;
            if (urlVal.startsWith('data:')) {
              try {
                const blob = await dataUrlToBlob(urlVal);
                const mime = blob.type || 'application/octet-stream';
                const ext = mime.split('/')[1] || 'bin';
                const filename = `${Date.now()}.${ext}`;
                const file = new File([blob], filename, { type: mime });
                formData.append(k, file);
                return;
              } catch (err) {
                formData.append(k, urlVal);
                return;
              }
            }
            formData.append(k, urlVal);
            return;
          }
          formData.append(k, JSON.stringify(v));
          return;
        }
        formData.append(k, String(v ?? ''));
      };

      // Map client keys to server multipart field names
      // client: coverImage -> server: cover_image (single)
      // client: images -> additional_images (array)
      // client: videos -> videos (array)
      // client: files -> metrics_data (single file expected)

      for (const [key, value] of Object.entries(item)) {
        // send metrics as a single JSON field (server expects JSON string)
        if (key === 'metrics') {
          const metricsJson = typeof value === 'string' ? value : JSON.stringify(value);
          formData.append('metrics', metricsJson);
          continue;
        }

        const formKey = key === 'coverImage' ? 'cover_image' : key === 'images' ? 'additional_images' : key === 'files' ? 'metrics_data' : key;

        if (Array.isArray(value)) {
          // For metrics_data (single file) if client passed array, append first
          if (formKey === 'metrics_data') {
            if (value.length > 0) await appendValueAsync(formKey, value[0]);
            continue;
          }
          for (const entry of value) {
            await appendValueAsync(formKey, entry);
          }
        } else {
          await appendValueAsync(formKey, value);
        }
      }

      const endpointMap: Record<string, string> = {
        annualReports: 'add-annual-report',
        impactReports: 'add-impact-report',
        sustainabilityMetrics: 'add-sustainability-metric',
      };

      const res = await axios.post(`${API_BASE}/${endpointMap[category]}`, formData);
      // refresh lists after successful add
      await fetchReports();
      console.log('Added report:', res.data);
    } catch (err: any) {
      console.error('Error adding report:', err);
      if (err.response) {
        console.error('Server response status:', err.response.status);
        console.error('Server response data:', err.response.data);
      }
      throw err;
    }
  };
  const updateReport = async (category: 'annualReports' | 'impactReports' | 'sustainabilityMetrics', id: string, item: Partial<ReportItem>) => {
    try {
      const endpointMap: Record<string, string> = {
        annualReports: 'update-annual-report',
        impactReports: 'update-impact-report',
        sustainabilityMetrics: 'update-sustainability-metric',
      };

      // Prepare payload: map client keys to server expected keys
      const payload: any = { ...item };
      if (payload.coverImage) payload.cover_image = payload.coverImage;
      if (payload.images) payload.additional_images = payload.images;
      if (payload.files) payload.metrics_data = payload.files.length > 0 ? payload.files[0].url || payload.files[0] : null;
      if (payload.metrics) payload.metrics = typeof payload.metrics === 'string' ? payload.metrics : JSON.stringify(payload.metrics);

      // send as JSON (server update endpoints accept fields via body)
      await axios.put(`${API_BASE}/${endpointMap[category]}/${id}`, payload);
      await fetchReports();
    } catch (err) {
      console.error('Error updating report:', err);
      throw err;
    }
  };
  const deleteReport = async (category: 'annualReports' | 'impactReports' | 'sustainabilityMetrics', id: string) => {
    try {
      const endpointMap: Record<string, string> = {
        annualReports: 'delete-annual-report',
        impactReports: 'delete-impact-report',
        sustainabilityMetrics: 'delete-sustainability-metric',
      };
      await axios.delete(`${API_BASE}/${endpointMap[category]}/${id}`);
      await fetchReports();
    } catch (err) {
      console.error('Error deleting report:', err);
      throw err;
    }
  };
  return <ReportsContext.Provider value={{
    annualReports,
    impactReports,
    sustainabilityMetrics,
    addReport,
    updateReport,
    deleteReport
  }}>
      {children}
    </ReportsContext.Provider>;
}
export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within ReportsProvider');
  }
  return context;
}