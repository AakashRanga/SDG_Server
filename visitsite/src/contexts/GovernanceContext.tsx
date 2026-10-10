// GovernanceContext.tsx
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
  // Image helper function
  getImageUrl: (filename: string) => string;
  // Green Office functions
  addGreenOfficeMember: (memberData: Omit<Member, 'id'>, imageFile?: File) => Promise<void>;
  updateGreenOfficeMember: (id: string, memberData: Partial<Member>, imageFile?: File) => Promise<void>;
  deleteGreenOfficeMember: (id: string) => Promise<void>;
  addGreenOfficeMission: (mission: Omit<Mission, 'id'>) => Promise<void>;
  updateGreenOfficeMission: (id: string, mission: Partial<Mission>) => Promise<void>;
  deleteGreenOfficeMission: (id: string) => Promise<void>;
  addGreenOfficeCommitment: (commitment: Omit<Commitment, 'id'>) => Promise<void>;
  updateGreenOfficeCommitment: (id: string, commitment: Partial<Commitment>) => Promise<void>;
  deleteGreenOfficeCommitment: (id: string) => Promise<void>;
  addGreenOfficeMilestone: (milestone: Omit<Milestone, 'id'>) => Promise<void>;
  updateGreenOfficeMilestone: (id: string, milestone: Partial<Milestone>) => Promise<void>;
  deleteGreenOfficeMilestone: (id: string) => Promise<void>;
  // Committee functions
  addCommittee: (committee: Omit<Committee, 'id' | 'members' | 'meetingMinutes'>) => Promise<void>;
  updateCommittee: (id: string, committee: Partial<Committee>) => Promise<void>;
  deleteCommittee: (id: string) => Promise<void>;
  addCommitteeMember: (committeeId: string, memberData: Omit<Member, 'id'>, imageFile?: File) => Promise<void>;
  updateCommitteeMember: (committeeId: string, memberId: string, memberData: Partial<Member>, imageFile?: File) => Promise<void>;
  deleteCommitteeMember: (committeeId: string, memberId: string) => Promise<void>;
  addCommitteeMinutes: (committeeId: string, minutes: Omit<MeetingMinutes, 'id'>) => Promise<void>;
  updateCommitteeMinutes: (committeeId: string, minutesId: string, minutes: Partial<MeetingMinutes>) => Promise<void>;
  deleteCommitteeMinutes: (committeeId: string, minutesId: string) => Promise<void>;
  // Student Council functions
  addStudentCouncilMember: (memberData: Omit<Member, 'id'>, imageFile?: File) => Promise<void>;
  updateStudentCouncilMember: (id: string, memberData: Partial<Member>, imageFile?: File) => Promise<void>;
  deleteStudentCouncilMember: (id: string) => Promise<void>;
  addStudentCouncilMinutes: (minutes: Omit<MeetingMinutes, 'id'>) => Promise<void>;
  updateStudentCouncilMinutes: (id: string, minutes: Partial<MeetingMinutes>) => Promise<void>;
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

  // Helper function to get proper image URL
  const getImageUrl = (filename: string): string => {
    if (!filename) return '/default-avatar.png';
    
    // If it's already a full URL, return as is
    if (filename.startsWith('http')) return filename;
    
    // If it starts with /uploads, make it a full URL
    if (filename.startsWith('/uploads')) {
      return `http://180.235.121.250:8006${filename}`;
    }
    
    // If it's just a filename, construct the full path
    return `http://180.235.121.250:8006/uploads/${filename}`;
  };

  // Helper function to ensure proper image URL (for internal use)
  const ensureImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    return getImageUrl(imagePath);
  };

  // Fetch all data on component mount
  useEffect(() => {
    //console.log('🚀 GovernanceProvider mounted');
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      //console.log('🔄 Starting to fetch all governance data...');

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
          //console.log(`🔍 Fetching: ${endpoint.url}`);
          const response = await fetch(endpoint.url);
          
          if (!response.ok) {
            throw new Error(`http ${response.status} for ${endpoint.url}`);
          }
          
          const data = await response.json();
          //console.log(`✅ Success from ${endpoint.url}:`, Array.isArray(data) ? `${data.length} items` : data);
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
        //console.log(`📥 Processing ${category}.${key}:`, parsedData.length, 'items');
        
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

      //console.log('✅ All governance data processed successfully');

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
        //console.log('📤 Uploading green office member with image file:', imageFile.name, imageFile.type);
        
        const formData = new FormData();
        formData.append('name', memberData.name);
        formData.append('position', memberData.position);
        formData.append('email', memberData.email);
        formData.append('phone', memberData.phone || '');
        formData.append('image', imageFile);

        //console.log('📦 Green Office Member FormData entries:');
        for (let [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
        }

        const response = await fetch(`${API_BASE_URL}/green-office/members`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`http ${response.status}: ${errorText}`);
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
          throw new Error(`http ${response.status}: ${errorText}`);
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

  const updateGreenOfficeMember = async (id: string, memberData: Partial<Member>, imageFile?: File) => {
    try {
      console.log(`📤 Updating green office member ${id}:`, memberData);
      
      const formData = new FormData();
      formData.append('name', memberData.name || '');
      formData.append('position', memberData.position || '');
      formData.append('email', memberData.email || '');
      formData.append('phone', memberData.phone || '');

      if (imageFile) {
        formData.append('image', imageFile);
        console.log('📷 Image file included in update');
      }

      console.log('📦 Green Office Member Update FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }

      const response = await fetch(`${API_BASE_URL}/green-office/members/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`http ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Green office member updated:', result);
      
      await refreshData();
    } catch (error) {
      console.error('❌ Error updating green office member:', error);
      throw error;
    }
  };

  const deleteGreenOfficeMember = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/green-office/members/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  const addGreenOfficeMission = async (mission: Omit<Mission, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/green-office/missions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mission),
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  const updateGreenOfficeMission = async (id: string, mission: Partial<Mission>) => {
    const response = await fetch(`${API_BASE_URL}/green-office/missions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mission),
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  const deleteGreenOfficeMission = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/green-office/missions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  const addGreenOfficeCommitment = async (commitment: Omit<Commitment, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/green-office/commitments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commitment),
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  const updateGreenOfficeCommitment = async (id: string, commitment: Partial<Commitment>) => {
    try {
      console.log('📤 Updating commitment:', { id, commitment });
      
      // Ensure the date is in the correct format for the backend
      const payload = {
        ...commitment,
        // If targetDate exists, ensure it's properly formatted
        targetDate: commitment.targetDate ? new Date(commitment.targetDate).toISOString().split('T')[0] : undefined
      };
      
      console.log('📦 Sending payload:', payload);

      const response = await fetch(`${API_BASE_URL}/green-office/commitments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Get more detailed error information
        const errorText = await response.text();
        console.error('❌ Backend error response:', errorText);
        throw new Error(`http ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Commitment updated successfully:', result);
      await refreshData();
    } catch (error) {
      console.error('❌ Error in updateGreenOfficeCommitment:', error);
      throw error;
    }
  };

  const deleteGreenOfficeCommitment = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/green-office/commitments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  const addGreenOfficeMilestone = async (milestone: Omit<Milestone, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/green-office/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(milestone),
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  const updateGreenOfficeMilestone = async (id: string, milestone: Partial<Milestone>) => {
    const response = await fetch(`${API_BASE_URL}/green-office/milestones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(milestone),
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  const deleteGreenOfficeMilestone = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/green-office/milestones/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  // Committee functions
  const addCommittee = async (committee: Omit<Committee, 'id' | 'members' | 'meetingMinutes'>) => {
    const response = await fetch(`${API_BASE_URL}/committees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(committee),
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  const updateCommittee = async (id: string, committee: Partial<Committee>) => {
    const response = await fetch(`${API_BASE_URL}/committees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(committee),
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  const deleteCommittee = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/committees/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

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
          throw new Error(`http ${response.status}: ${errorText}`);
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
          throw new Error(`http ${response.status}: ${errorText}`);
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

  const updateCommitteeMember = async (committeeId: string, memberId: string, memberData: Partial<Member>, imageFile?: File) => {
    try {
      console.log(`📤 Updating committee member ${memberId} in committee ${committeeId}:`, memberData);
      
      const formData = new FormData();
      formData.append('name', memberData.name || '');
      formData.append('position', memberData.position || '');
      formData.append('email', memberData.email || '');
      formData.append('phone', memberData.phone || '');

      if (imageFile) {
        formData.append('image', imageFile);
        console.log('📷 Image file included in update');
      }

      const response = await fetch(`${API_BASE_URL}/committees/${committeeId}/members/${memberId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`http ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Committee member updated:', result);
      
      await refreshData();
    } catch (error) {
      console.error('❌ Error updating committee member:', error);
      throw error;
    }
  };

  const deleteCommitteeMember = async (committeeId: string, memberId: string) => {
    const response = await fetch(`${API_BASE_URL}/committees/${committeeId}/members/${memberId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  const addCommitteeMinutes = async (committeeId: string, minutes: Omit<MeetingMinutes, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/committees/${committeeId}/meeting-minutes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(minutes),
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  const updateCommitteeMinutes = async (committeeId: string, minutesId: string, minutes: Partial<MeetingMinutes>) => {
    const response = await fetch(`${API_BASE_URL}/committees/${committeeId}/meeting-minutes/${minutesId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(minutes),
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  const deleteCommitteeMinutes = async (committeeId: string, minutesId: string) => {
    const response = await fetch(`${API_BASE_URL}/committees/${committeeId}/meeting-minutes/${minutesId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
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
          throw new Error(`http ${response.status}: ${errorText}`);
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
          throw new Error(`http ${response.status}: ${errorText}`);
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

  const updateStudentCouncilMember = async (id: string, memberData: Partial<Member>, imageFile?: File) => {
    try {
      console.log(`📤 Updating student council member ${id}:`, memberData);
      
      const formData = new FormData();
      formData.append('name', memberData.name || '');
      formData.append('position', memberData.position || '');
      formData.append('email', memberData.email || '');
      formData.append('phone', memberData.phone || '');

      if (imageFile) {
        formData.append('image', imageFile);
        console.log('📷 Image file included in update');
      }

      const response = await fetch(`${API_BASE_URL}/student-council/members/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`http ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Student council member updated:', result);
      
      await refreshData();
    } catch (error) {
      console.error('❌ Error updating student council member:', error);
      throw error;
    }
  };

  const deleteStudentCouncilMember = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/student-council/members/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  const addStudentCouncilMinutes = async (minutes: Omit<MeetingMinutes, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/student-council/meeting-minutes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(minutes),
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  const updateStudentCouncilMinutes = async (id: string, minutes: Partial<MeetingMinutes>) => {
    const response = await fetch(`${API_BASE_URL}/student-council/meeting-minutes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(minutes),
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  const deleteStudentCouncilMinutes = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/student-council/meeting-minutes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`http ${response.status}`);
    await refreshData();
  };

  const value: GovernanceContextType = {
    greenOffice,
    committees,
    studentCouncil,
    loading,
    error,
    // Image helper function
    getImageUrl,
    // Green Office functions
    addGreenOfficeMember,
    updateGreenOfficeMember,
    deleteGreenOfficeMember,
    addGreenOfficeMission,
    updateGreenOfficeMission,
    deleteGreenOfficeMission,
    addGreenOfficeCommitment,
    updateGreenOfficeCommitment,
    deleteGreenOfficeCommitment,
    addGreenOfficeMilestone,
    updateGreenOfficeMilestone,
    deleteGreenOfficeMilestone,
    // Committee functions
    addCommittee,
    updateCommittee,
    deleteCommittee,
    addCommitteeMember,
    updateCommitteeMember,
    deleteCommitteeMember,
    addCommitteeMinutes,
    updateCommitteeMinutes,
    deleteCommitteeMinutes,
    // Student Council functions
    addStudentCouncilMember,
    updateStudentCouncilMember,
    deleteStudentCouncilMember,
    addStudentCouncilMinutes,
    updateStudentCouncilMinutes,
    deleteStudentCouncilMinutes,
    // Refresh function
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