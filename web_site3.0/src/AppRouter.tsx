import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { GovernanceData } from './pages/GovernanceData';
import { GreenOffice } from './pages/GreenOffice';
import { Committees } from './pages/Committees';
import { StudentGreenCouncil } from './pages/StudentGreenCouncil';
import { GovernanceSite } from './pages/GovernanceSite';
import { EnvironmentData } from './pages/EnvironmentData';
import { EnergyClimate } from './pages/EnergyClimate';
import { WaterConservation } from './pages/WaterConservation';
import { Transportation } from './pages/Transportation';
import { Biodiversity } from './pages/Biodiversity';
import { WasteManagement } from './pages/WasteManagement';
import { EnvironmentSite } from './pages/EnvironmentSite';
import { ResearchData } from './pages/ResearchData';
import { ResearchFunding } from './pages/ResearchFunding';
import { ResearchPublications } from './pages/ResearchPublications';
import { ResearchPatents } from './pages/ResearchPatents';
import { ResearchCourses } from './pages/ResearchCourses';
import { ResearchStudentResearch } from './pages/ResearchStudentResearch';
import { ResearchCollaborations } from './pages/ResearchCollaborations';
import { ResearchOutreach } from './pages/ResearchOutreach';
import { ResearchStartups } from './pages/ResearchStartups';
import { ResearchGraduates } from './pages/ResearchGraduates';
import { ResearchInnovations } from './pages/ResearchInnovations';
import { ResearchSite } from './pages/ResearchSite';
import { InfrastructureData } from './pages/InfrastructureData';
import { InfrastructureGreenSpaces } from './pages/InfrastructureGreenSpaces';
import { InfrastructureAccessibility } from './pages/InfrastructureAccessibility';
import { InfrastructureWellness } from './pages/InfrastructureWellness';
import { InfrastructureSmartBuildings } from './pages/InfrastructureSmartBuildings';
import { InfrastructureBudget } from './pages/InfrastructureBudget';
import { InfrastructurePlanning } from './pages/InfrastructurePlanning';
import { InfrastructureSite } from './pages/InfrastructureSite';
import { AchievementData } from './pages/AchievementData';
import { AchievementSite } from './pages/AchievementSite';
import { ReportsData } from './pages/ReportsData';
import { ReportsSite } from './pages/ReportsSite';
import { SDGData } from './pages/SDGData';
import { SDGDetailData } from './pages/SDGDetailData';
import { SDGSite } from './pages/SDGSite';
import { GovernanceProvider } from './contexts/GovernanceContext';
import { EnvironmentProvider } from './contexts/EnvironmentContext';
import { ResearchProvider } from './contexts/ResearchContext';
import { InfrastructureProvider } from './contexts/InfrastructureContext';
import { AchievementProvider } from './contexts/AchievementContext';
import { ReportsProvider } from './contexts/ReportsContext';
import { SDGProvider } from './contexts/SDGContext';
// import { WhitepapersPage } from './pages/WhitepapersPage';
import { RankingData } from './pages/RankingData';
import { RankingSite } from './pages/RankingSite';
import { RankingDataProvider } from './contexts/RankingDataContext';
import { SDGConsolidatedView } from "./pages/SDGConsolidatedView";
import { RankingFAQReference } from "./pages/RankingFAQReference";
import { RankingFAQAdmin } from "./pages/RankingFAQAdmin";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GovernanceProvider>
          <EnvironmentProvider>
            <ResearchProvider>
              <InfrastructureProvider>
                <AchievementProvider>
                  <ReportsProvider>
                    <SDGProvider>
                      <RankingDataProvider>
                        <Routes>
                          {/* Authentication Route */}
                          <Route path="/login" element={<LoginPage />} />

                          {/* Protected Admin Dashboard & Management Routes */}
                          <Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>} />
                          <Route path="/governance" element={<ProtectedRoute><GovernanceData /></ProtectedRoute>} />
                          <Route path="/governance/green-office" element={<ProtectedRoute><GreenOffice /></ProtectedRoute>} />
                          <Route path="/governance/committees" element={<ProtectedRoute><Committees /></ProtectedRoute>} />
                          <Route path="/governance/student-council" element={<ProtectedRoute><StudentGreenCouncil /></ProtectedRoute>} />
                          <Route path="/environment" element={<ProtectedRoute><EnvironmentData /></ProtectedRoute>} />
                          <Route path="/environment/energy-climate" element={<ProtectedRoute><EnergyClimate /></ProtectedRoute>} />
                          <Route path="/environment/water" element={<ProtectedRoute><WaterConservation /></ProtectedRoute>} />
                          <Route path="/environment/transportation" element={<ProtectedRoute><Transportation /></ProtectedRoute>} />
                          <Route path="/environment/biodiversity" element={<ProtectedRoute><Biodiversity /></ProtectedRoute>} />
                          <Route path="/environment/waste-management" element={<ProtectedRoute><WasteManagement /></ProtectedRoute>} />
                          <Route path="/research" element={<ProtectedRoute><ResearchData /></ProtectedRoute>} />
                          <Route path="/research/funding" element={<ProtectedRoute><ResearchFunding /></ProtectedRoute>} />
                          <Route path="/research/publications" element={<ProtectedRoute><ResearchPublications /></ProtectedRoute>} />
                          <Route path="/research/patents" element={<ProtectedRoute><ResearchPatents /></ProtectedRoute>} />
                          <Route path="/research/courses" element={<ProtectedRoute><ResearchCourses /></ProtectedRoute>} />
                          <Route path="/research/student-research" element={<ProtectedRoute><ResearchStudentResearch /></ProtectedRoute>} />
                          <Route path="/research/collaborations" element={<ProtectedRoute><ResearchCollaborations /></ProtectedRoute>} />
                          <Route path="/research/outreach" element={<ProtectedRoute><ResearchOutreach /></ProtectedRoute>} />
                          <Route path="/research/startups" element={<ProtectedRoute><ResearchStartups /></ProtectedRoute>} />
                          <Route path="/research/graduates" element={<ProtectedRoute><ResearchGraduates /></ProtectedRoute>} />
                          <Route path="/research/innovations" element={<ProtectedRoute><ResearchInnovations /></ProtectedRoute>} />
                          <Route path="/infrastructure" element={<ProtectedRoute><InfrastructureData /></ProtectedRoute>} />
                          <Route path="/infrastructure/green-spaces" element={<ProtectedRoute><InfrastructureGreenSpaces /></ProtectedRoute>} />
                          <Route path="/infrastructure/accessibility" element={<ProtectedRoute><InfrastructureAccessibility /></ProtectedRoute>} />
                          <Route path="/infrastructure/wellness" element={<ProtectedRoute><InfrastructureWellness /></ProtectedRoute>} />
                          <Route path="/infrastructure/smart-buildings" element={<ProtectedRoute><InfrastructureSmartBuildings /></ProtectedRoute>} />
                          <Route path="/infrastructure/budget" element={<ProtectedRoute><InfrastructureBudget /></ProtectedRoute>} />
                          <Route path="/infrastructure/planning" element={<ProtectedRoute><InfrastructurePlanning /></ProtectedRoute>} />
                          <Route path="/achievements" element={<ProtectedRoute><AchievementData /></ProtectedRoute>} />
                          <Route path="/reports" element={<ProtectedRoute><ReportsData /></ProtectedRoute>} />
                          <Route path="/sdg" element={<ProtectedRoute><SDGData /></ProtectedRoute>} />
                          <Route path="/sdg/:goalNumber" element={<ProtectedRoute><SDGDetailData /></ProtectedRoute>} />
                          <Route path="/sdg/consolidated/:goalNumber" element={<ProtectedRoute><SDGConsolidatedView /></ProtectedRoute>} />
                          <Route path="/ranking-data" element={<ProtectedRoute><RankingData /></ProtectedRoute>} />
                          <Route path="/faq" element={<ProtectedRoute><RankingFAQAdmin /></ProtectedRoute>} />

                          {/* Public Sites & References */}
                          <Route path="/governance/site" element={<GovernanceSite />} />
                          <Route path="/environment/site" element={<EnvironmentSite />} />
                          <Route path="/research/site" element={<ResearchSite />} />
                          <Route path="/infrastructure/site" element={<InfrastructureSite />} />
                          <Route path="/achievements/site" element={<AchievementSite />} />
                          <Route path="/reports/site" element={<ReportsSite />} />
                          <Route path="/sdg/site" element={<SDGSite />} />
                          <Route path="/ranking-data/site" element={<RankingSite />} />
                          <Route path="/ranking-data/site/faq" element={<RankingFAQReference />} />
                          <Route path="/ranking-data/site/faq/:rankingSlug" element={<RankingFAQReference />} />
                          <Route path="/ranking-data/site/:sdgSlug" element={<RankingSite />} />
                        </Routes>
                      </RankingDataProvider>
                    </SDGProvider>
                  </ReportsProvider>
                </AchievementProvider>
              </InfrastructureProvider>
            </ResearchProvider>
          </EnvironmentProvider>
        </GovernanceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}