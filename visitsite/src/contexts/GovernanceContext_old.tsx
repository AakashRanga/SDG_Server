import React, { useState, createContext, useContext, useEffect } from 'react';
import { Member, Mission, Commitment, Milestone } from '../pages/GreenOffice';
import { MeetingMinutes } from '../components/MeetingMinutesCard';

interface Committee {
  id: string;
  name: string;
  description: string;
  members: Member[];
  meetingMinutes: MeetingMinutes[];
  image?: string;
}

interface GovernanceContextType {
  greenOffice: {
    members: Member[];
    missions: Mission[];
    commitments: Commitment[];
    milestones: Milestone[];
  };
  committees: Committee[];
  studentCouncil: {
    members: Member[];
    meetingMinutes: MeetingMinutes[];
  };
  loading: boolean;
  error: string | null;
  // Green Office functions
  addGreenOfficeMember: (memberData: Omit<Member, 'id'>, imageFile?: File) => Promise<void>;
  deleteGreenOfficeMember: (id: string) => Promise<void>;
  addGreenOfficeMission: (mission: Omit<Mission, 'id'>) => Promise<void>;
  deleteGreenOfficeMission: (id: string) => Promise<void>;
  addGreenOfficeCommitment: (commitment: Omit<Commitment, 'id'>) => Promise<void>;
  deleteGreenOfficeCommitment: (id: string) => Promise<void>;
  addGreenOfficeMilestone: (milestone: Omit<Milestone, 'id'>) => Promise<void>;
  deleteGreenOfficeMilestone: (id: string) => Promise<void>;
  // Committee functions
  addCommittee: (committee: Omit<Committee, 'id' | 'members' | 'meetingMinutes'>) => Promise<void>;
  deleteCommittee: (id: string) => Promise<void>;
  addCommitteeMember: (committeeId: string, memberData: Omit<Member, 'id'>, imageFile?: File) => Promise<void>;
  deleteCommitteeMember: (committeeId: string, memberId: string) => Promise<void>;
  addCommitteeMinutes: (committeeId: string, minutes: Omit<MeetingMinutes, 'id'>) => Promise<void>;
  deleteCommitteeMinutes: (committeeId: string, minutesId: string) => Promise<void>;
  // Student Council functions
  addStudentCouncilMember: (memberData: Omit<Member, 'id'>, imageFile?: File) => Promise<void>;
  deleteStudentCouncilMember: (id: string) => Promise<void>;
  addStudentCouncilMinutes: (minutes: Omit<MeetingMinutes, 'id'>) => Promise<void>;
  deleteStudentCouncilMinutes: (id: string) => Promise<void>;
  // Refresh function
  refreshData: () => Promise<void>;
}

const GovernanceContext = createContext<GovernanceContextType | undefined>(undefined);

const API_BASE_URL = 'http://180.235.121.250:8006/api';

export function GovernanceProvider({ children }: { children: React.ReactNode }) {
  const [greenOffice, setGreenOffice] = useState({
    members: [] as Member[],
    missions: [] as Mission[],
    commitments: [] as Commitment[],
    milestones: [] as Milestone[]
  });
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [studentCouncil, setStudentCouncil] = useState({
    members: [] as Member[],
    meetingMinutes: [] as MeetingMinutes[]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to ensure proper image URL
  const ensureImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it starts with /uploads, make it a full URL
    if (imagePath.startsWith('/uploads')) {
      return `http://180.235.121.250:8006${imagePath}`;
    }
    
    // If it's just a filename, construct the full path
    return `http://180.235.121.250:8006/uploads/${imagePath}`;
  };

  // Fetch all data on component mount
  useEffect(() => {
    console.log('🚀 GovernanceProvider mounted');
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Starting to fetch all governance data...');

      const endpoints = [
        { url: `${API_BASE_URL}/green-office/members`, key: 'members', category: 'greenOffice' },
        { url: `${API_BASE_URL}/green-office/missions`, key: 'missions', category: 'greenOffice' },
        { url: `${API_BASE_URL}/green-office/commitments`, key: 'commitments', category: 'greenOffice' },
        { url: `${API_BASE_URL}/green-office/milestones`, key: 'milestones', category: 'greenOffice' },
        { url: `${API_BASE_URL}/committees`, key: 'committees', category: 'committees' },
        { url: `${API_BASE_URL}/student-council/members`, key: 'members', category: 'studentCouncil' },
        { url: `${API_BASE_URL}/student-council/meeting-minutes`, key: 'meetingMinutes', category: 'studentCouncil' }
      ];

      const fetchPromises = endpoints.map(async (endpoint) => {
        try {
          console.log(`🔍 Fetching: ${endpoint.url}`);
          const response = await fetch(endpoint.url);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} for ${endpoint.url}`);
          }
          
          const data = await response.json();
          console.log(`✅ Success from ${endpoint.url}:`, Array.isArray(data) ? `${data.length} items` : data);
          return { key: endpoint.key, category: endpoint.category, data, success: true };
        } catch (error) {
          console.error(`❌ Error fetching ${endpoint.url}:`, error);
          return { 
            key: endpoint.key, 
            category: endpoint.category, 
            data: [],
            error: error instanceof Error ? error.message : 'Unknown error',
            success: false
          };
        }
      });

      const results = await Promise.all(fetchPromises);

      // Process results
      const extractData = (response: any) => {
        // If it's already an array, return it with image URL transformation
        if (Array.isArray(response)) {
          return response.map(item => ({
            ...item,
            id: item.id?.toString(),
            image: ensureImageUrl(item.image)
          }));
        }
        
        // If response has data property that's an array
        if (response && Array.isArray(response.data)) {
          return response.data.map((item: any) => ({
            ...item,
            id: item.id?.toString(),
            image: ensureImageUrl(item.image)
          }));
        }
        
        console.warn('❓ Unexpected response format:', response);
        return [];
      };

      // Initialize data containers
      const greenOfficeData: any = {
        members: [],
        missions: [],
        commitments: [],
        milestones: []
      };
      let committeesData: Committee[] = [];
      const studentCouncilData: any = {
        members: [],
        meetingMinutes: []
      };

      results.forEach(({ key, category, data, success }) => {
        if (!success) {
          console.warn(`⚠️ Skipping ${key} due to fetch error`);
          return;
        }

        const parsedData = extractData(data);
        console.log(`📥 Processing ${category}.${key}:`, parsedData.length, 'items');
        
        if (category === 'greenOffice') {
          greenOfficeData[key] = parsedData;
        } else if (category === 'committees') {
          committeesData = parsedData.map((committee: any) => ({
            ...committee,
            id: committee.id?.toString(),
            members: committee.members ? committee.members.map((member: any) => ({
              ...member,
              id: member.id?.toString(),
              image: ensureImageUrl(member.image)
            })) : [],
            meetingMinutes: committee.meetingMinutes ? committee.meetingMinutes.map((minutes: any) => ({
              ...minutes,
              id: minutes.id?.toString()
            })) : []
          }));
        } else if (category === 'studentCouncil') {
          studentCouncilData[key] = parsedData;
        }
      });

      // Update state
      setGreenOffice(greenOfficeData);
      setCommittees(committeesData);
      setStudentCouncil(studentCouncilData);

      console.log('✅ All governance data processed successfully');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('💥 Error in fetchAllData:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('🏁 Loading set to false');
    }
  };

  const refreshData = async () => {
    console.log('🔄 Manual refresh triggered');
    await fetchAllData();
  };

  // Green Office functions
  const addGreenOfficeMember = async (memberData: Omit<Member, 'id'>, imageFile?: File) => {
    try {
      if (imageFile) {
        console.log('📤 Uploading green office member with image file:', imageFile.name, imageFile.type);
        
        const formData = new FormData();
        formData.append('name', memberData.name);
        formData.append('position', memberData.position);
        formData.append('email', memberData.email);
        formData.append('phone', memberData.phone || '');
        formData.append('image', imageFile);

        console.log('📦 Green Office Member FormData entries:');
        for (let [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
        }

        const response = await fetch(`${API_BASE_URL}/green-office/members`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Green office member created with image:', result);
      } else {
        console.log('📤 Uploading green office member without image');
        const response = await fetch(`${API_BASE_URL}/green-office/members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(memberData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Green office member created without image:', result);
      }
      
      await refreshData();
    } catch (error) {
      console.error('❌ Error creating green office member:', error);
      throw error;
    }
  };

  const deleteGreenOfficeMember = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/green-office/members/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await refreshData();
  };

  const addGreenOfficeMission = async (mission: Omit<Mission, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/green-office/missions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mission),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await refreshData();
  };

  const deleteGreenOfficeMission = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/green-office/missions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await refreshData();
  };

  const addGreenOfficeCommitment = async (commitment: Omit<Commitment, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/green-office/commitments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commitment),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await refreshData();
  };

  const deleteGreenOfficeCommitment = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/green-office/commitments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await refreshData();
  };

  const addGreenOfficeMilestone = async (milestone: Omit<Milestone, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/green-office/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(milestone),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await refreshData();
  };

  const deleteGreenOfficeMilestone = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/green-office/milestones/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await refreshData();
  };

  // Committee functions
  const addCommittee = async (committee: Omit<Committee, 'id' | 'members' | 'meetingMinutes'>) => {
    const response = await fetch(`${API_BASE_URL}/committees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(committee),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await refreshData();
  };

  const deleteCommittee = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/committees/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await refreshData();
  };

  // FIXED: Committee Member function with proper image upload
  const addCommitteeMember = async (committeeId: string, memberData: Omit<Member, 'id'>, imageFile?: File) => {
    try {
      if (imageFile) {
        console.log('📤 Uploading committee member with image file:', imageFile.name, imageFile.type);
        console.log('🏛️ Committee ID:', committeeId);
        
        const formData = new FormData();
        formData.append('name', memberData.name);
        formData.append('position', memberData.position);
        formData.append('email', memberData.email);
        formData.append('phone', memberData.phone || '');
        formData.append('image', imageFile);

        console.log('📦 Committee Member FormData entries:');
        for (let [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
        }

        const response = await fetch(`${API_BASE_URL}/committees/${committeeId}/members`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Committee member created with image:', result);
      } else {
        console.log('📤 Uploading committee member without image');
        console.log('🏛️ Committee ID:', committeeId);
        
        const response = await fetch(`${API_BASE_URL}/committees/${committeeId}/members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(memberData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Committee member created without image:', result);
      }
      
      await refreshData();
    } catch (error) {
      console.error('❌ Error creating committee member:', error);
      throw error;
    }
  };

  const deleteCommitteeMember = async (committeeId: string, memberId: string) => {
    const response = await fetch(`${API_BASE_URL}/committees/${committeeId}/members/${memberId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await refreshData();
  };

  const addCommitteeMinutes = async (committeeId: string, minutes: Omit<MeetingMinutes, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/committees/${committeeId}/meeting-minutes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(minutes),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await refreshData();
  };

  const deleteCommitteeMinutes = async (committeeId: string, minutesId: string) => {
    const response = await fetch(`${API_BASE_URL}/committees/${committeeId}/meeting-minutes/${minutesId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await refreshData();
  };

  // Student Council functions
  const addStudentCouncilMember = async (memberData: Omit<Member, 'id'>, imageFile?: File) => {
    try {
      if (imageFile) {
        console.log('📤 Uploading student council member with image file:', imageFile.name, imageFile.type);
        
        const formData = new FormData();
        formData.append('name', memberData.name);
        formData.append('position', memberData.position);
        formData.append('email', memberData.email);
        formData.append('phone', memberData.phone || '');
        formData.append('image', imageFile);

        console.log('📦 Student Council Member FormData entries:');
        for (let [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
        }

        const response = await fetch(`${API_BASE_URL}/student-council/members`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Student council member created with image:', result);
      } else {
        console.log('📤 Uploading student council member without image');
        const response = await fetch(`${API_BASE_URL}/student-council/members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(memberData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Student council member created without image:', result);
      }
      
      await refreshData();
    } catch (error) {
      console.error('❌ Error creating student council member:', error);
      throw error;
    }
  };

  const deleteStudentCouncilMember = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/student-council/members/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await refreshData();
  };

  const addStudentCouncilMinutes = async (minutes: Omit<MeetingMinutes, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/student-council/meeting-minutes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(minutes),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await refreshData();
  };

  const deleteStudentCouncilMinutes = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/student-council/meeting-minutes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await refreshData();
  };

  const value: GovernanceContextType = {
    greenOffice,
    committees,
    studentCouncil,
    loading,
    error,
    addGreenOfficeMember,
    deleteGreenOfficeMember,
    addGreenOfficeMission,
    deleteGreenOfficeMission,
    addGreenOfficeCommitment,
    deleteGreenOfficeCommitment,
    addGreenOfficeMilestone,
    deleteGreenOfficeMilestone,
    addCommittee,
    deleteCommittee,
    addCommitteeMember,
    deleteCommitteeMember,
    addCommitteeMinutes,
    deleteCommitteeMinutes,
    addStudentCouncilMember,
    deleteStudentCouncilMember,
    addStudentCouncilMinutes,
    deleteStudentCouncilMinutes,
    refreshData,
  };

  return (
    <GovernanceContext.Provider value={value}>
      {children}
    </GovernanceContext.Provider>
  );
}

export function useGovernance() {
  const context = useContext(GovernanceContext);
  if (context === undefined) {
    throw new Error('useGovernance must be used within a GovernanceProvider');
  }
  return context;
}