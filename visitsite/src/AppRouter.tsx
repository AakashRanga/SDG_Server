import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App } from "./App";
//import HomePage from "./pages/HomePage";
import { GovernanceData } from "./pages/GovernanceData";
import { GreenOffice } from "./pages/GreenOffice";
import { Committees } from "./pages/Committees";
import { StudentGreenCouncil } from "./pages/StudentGreenCouncil";
import { GovernanceSite } from "./pages/GovernanceSite";
import { EnvironmentData } from "./pages/EnvironmentData";
import { EnergyClimate } from "./pages/EnergyClimate";
import { WaterConservation } from "./pages/WaterConservation";
import { Transportation } from "./pages/Transportation";
import { Biodiversity } from "./pages/Biodiversity";
import { WasteManagement } from "./pages/WasteManagement";
import { EnvironmentSite } from "./pages/EnvironmentSite";
import { ResearchData } from "./pages/ResearchData";
import { ResearchFunding } from "./pages/ResearchFunding";
import { ResearchPublications } from "./pages/ResearchPublications";
import { ResearchPatents } from "./pages/ResearchPatents";
import { ResearchCourses } from "./pages/ResearchCourses";
import { ResearchStudentResearch } from "./pages/ResearchStudentResearch";
import { ResearchCollaborations } from "./pages/ResearchCollaborations";
import { ResearchOutreach } from "./pages/ResearchOutreach";
import { ResearchStartups } from "./pages/ResearchStartups";
import { ResearchGraduates } from "./pages/ResearchGraduates";
import { ResearchInnovations } from "./pages/ResearchInnovations";
import { ResearchSite } from "./pages/ResearchSite";
import { InfrastructureData } from "./pages/InfrastructureData";
import { InfrastructureGreenSpaces } from "./pages/InfrastructureGreenSpaces";
import { InfrastructureAccessibility } from "./pages/InfrastructureAccessibility";
import { InfrastructureWellness } from "./pages/InfrastructureWellness";
import { InfrastructureSmartBuildings } from "./pages/InfrastructureSmartBuildings";
import { InfrastructureBudget } from "./pages/InfrastructureBudget";
import { InfrastructurePlanning } from "./pages/InfrastructurePlanning";
import { InfrastructureSite } from "./pages/InfrastructureSite";
import { AchievementData } from "./pages/AchievementData";
import { AchievementSite } from "./pages/AchievementSite";
import { ReportsData } from "./pages/ReportsData";
import { ReportsSite } from "./pages/ReportsSite";
import { SDGData } from "./pages/SDGData";
import { SDGDetailData } from "./pages/SDGDetailData";
import { SDGSite } from "./pages/SDGSite";
import { GovernanceProvider } from "./contexts/GovernanceContext";
import { EnvironmentProvider } from "./contexts/EnvironmentContext";
import { ResearchProvider } from "./contexts/ResearchContext";
import { InfrastructureProvider } from "./contexts/InfrastructureContext";
import { AchievementProvider } from "./contexts/AchievementContext";
import { ReportsProvider } from "./contexts/ReportsContext";
import { SDGProvider } from "./contexts/SDGContext";
import { HomePage } from "./pages/HomePage";
import { WhitepapersPage } from "./pages/WhitepapersPage";
import { RankingData } from "./pages/RankingData";
import { RankingSite } from "./pages/RankingSite";
import { RankingDataProvider } from "./contexts/RankingDataContext";
import { SDGConsolidatedView } from "./pages/SDGConsolidatedView";

export function AppRouter() {
  return (
    <BrowserRouter>
      <GovernanceProvider>
        <EnvironmentProvider>
          <ResearchProvider>
            <InfrastructureProvider>
              <AchievementProvider>
                <ReportsProvider>
                  <SDGProvider>
                    <RankingDataProvider>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/governance" element={<GovernanceData />} />
                        <Route
                          path="/governance/green-office"
                          element={<GreenOffice />}
                        />
                        <Route
                          path="/governance/committees"
                          element={<Committees />}
                        />
                        <Route
                          path="/governance/student-council"
                          element={<StudentGreenCouncil />}
                        />
                        <Route
                          path="/governance/site"
                          element={<GovernanceSite />}
                        />
                        <Route
                          path="/whitepapers"
                          element={<WhitepapersPage />}
                        />
                        <Route
                          path="/environment"
                          element={<EnvironmentData />}
                        />
                        <Route
                          path="/environment/energy-climate"
                          element={<EnergyClimate />}
                        />
                        <Route
                          path="/environment/water"
                          element={<WaterConservation />}
                        />
                        <Route
                          path="/environment/transportation"
                          element={<Transportation />}
                        />
                        <Route
                          path="/environment/biodiversity"
                          element={<Biodiversity />}
                        />
                        <Route
                          path="/environment/waste-management"
                          element={<WasteManagement />}
                        />
                        <Route
                          path="/environment/site"
                          element={<EnvironmentSite />}
                        />
                        <Route path="/research" element={<ResearchData />} />
                        <Route
                          path="/research/funding"
                          element={<ResearchFunding />}
                        />
                        <Route
                          path="/research/publications"
                          element={<ResearchPublications />}
                        />
                        <Route
                          path="/research/patents"
                          element={<ResearchPatents />}
                        />
                        <Route
                          path="/research/courses"
                          element={<ResearchCourses />}
                        />
                        <Route
                          path="/research/student-research"
                          element={<ResearchStudentResearch />}
                        />
                        <Route
                          path="/research/collaborations"
                          element={<ResearchCollaborations />}
                        />
                        <Route
                          path="/research/outreach"
                          element={<ResearchOutreach />}
                        />
                        <Route
                          path="/research/startups"
                          element={<ResearchStartups />}
                        />
                        <Route
                          path="/research/graduates"
                          element={<ResearchGraduates />}
                        />
                        <Route
                          path="/research/innovations"
                          element={<ResearchInnovations />}
                        />
                        <Route path="/research/site" element={<ResearchSite />} />
                        <Route
                          path="/infrastructure"
                          element={<InfrastructureData />}
                        />
                        <Route
                          path="/infrastructure/green-spaces"
                          element={<InfrastructureGreenSpaces />}
                        />
                        <Route
                          path="/infrastructure/accessibility"
                          element={<InfrastructureAccessibility />}
                        />
                        <Route
                          path="/infrastructure/wellness"
                          element={<InfrastructureWellness />}
                        />
                        <Route
                          path="/infrastructure/smart-buildings"
                          element={<InfrastructureSmartBuildings />}
                        />
                        <Route
                          path="/infrastructure/budget"
                          element={<InfrastructureBudget />}
                        />
                        <Route
                          path="/infrastructure/planning"
                          element={<InfrastructurePlanning />}
                        />
                        <Route
                          path="/infrastructure/site"
                          element={<InfrastructureSite />}
                        />
                        <Route
                          path="/achievements"
                          element={<AchievementData />}
                        />
                        <Route
                          path="/achievements/site"
                          element={<AchievementSite />}
                        />
                        <Route path="/reports" element={<ReportsData />} />
                        <Route path="/reports/site" element={<ReportsSite />} />
                        <Route path="/sdg" element={<SDGData />} />
                        <Route
                          path="/sdg/:goalNumber"
                          element={<SDGDetailData />}
                        />
                        <Route
                          path="/sdg/consolidated/:goalNumber"
                          element={<SDGConsolidatedView />}
                        />
                        <Route path="/sdg/site" element={<SDGSite />} />
                        
                        <Route path="/ranking-data" element={<RankingData />} />
                        <Route
                          path="/ranking-data/site"
                          element={<RankingSite />}
                        />
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
    </BrowserRouter>
  );
}
