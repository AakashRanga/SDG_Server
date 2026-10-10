// DebugComponent.tsx
import React from 'react';
import { useGovernance } from './GovernanceContext';

export function DebugComponent() {
  const { greenOffice, committees, studentCouncil, loading, error } = useGovernance();

  console.log('🔍 Debug Data:', {
    loading,
    error,
    greenOfficeMembers: greenOffice.members,
    committees,
    studentCouncilMembers: studentCouncil.members
  });

  if (loading) {
    return <div>🔄 Loading data...</div>;
  }

  if (error) {
    return <div>❌ Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px', background: '#f5f5f5' }}>
      <h2>🔍 Debug Information</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Green Office Members ({greenOffice.members.length})</h3>
        <pre>{JSON.stringify(greenOffice.members, null, 2)}</pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Committees ({committees.length})</h3>
        <pre>{JSON.stringify(committees, null, 2)}</pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Student Council Members ({studentCouncil.members.length})</h3>
        <pre>{JSON.stringify(studentCouncil.members, null, 2)}</pre>
      </div>
    </div>
  );
}