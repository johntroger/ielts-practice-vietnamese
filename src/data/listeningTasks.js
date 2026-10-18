/**
 * IELTS Listening Practice Tasks Dataset (Standard Cambridge Academic / General Training Format)
 * Full 4 Parts, 40 Questions, Exact Answer Keys, Evidence Locators & Audio Timestamps.
 */

import { cambridge20Test1 } from './listening/cambridge20Test1.js';
import { cambridge19Test1 } from './listening/cambridge19Test1.js';
import { cambridge18Test1 } from './listening/cambridge18Test1.js';
import { cambridge17Test1 } from './listening/cambridge17Test1.js';
import { cambridge8Test1 } from './listening/cambridge8Test1.js';
import { cambridge8Test2 } from './listening/cambridge8Test2.js';
import { cambridge8Test3 } from './listening/cambridge8Test3.js';
import { track2FlatDescriptions } from './listening/track2FlatDescriptions.js';
import { track3PropertyEnquiry } from './listening/track3PropertyEnquiry.js';
import { track4NumbersMeasurements } from './listening/track4NumbersMeasurements.js';
import { track5PropertyViewing } from './listening/track5PropertyViewing.js';
import { track6OfferProcess } from './listening/track6OfferProcess.js';
import { track7EnsuiteMicroDrill } from './listening/track7EnsuiteMicroDrill.js';
import { track8StudentAccommodation } from './listening/track8StudentAccommodation.js';
import { track9HometownSentences } from './listening/track9HometownSentences.js';
import { track10WordStressPronunciation } from './listening/track10WordStressPronunciation.js';
import { track11MapDirections } from './listening/track11MapDirections.js';
import { track12SportsCentreMap } from './listening/track12SportsCentreMap.js';
import { track13SportsAndSkills } from './listening/track13SportsAndSkills.js';
import { track14RoomSchedule } from './listening/track14RoomSchedule.js';
import { track15EquipmentPrep } from './listening/track15EquipmentPrep.js';
import { track16EventDuties } from './listening/track16EventDuties.js';
import { track17SportsBenefits } from './listening/track17SportsBenefits.js';
import { track18SportsAchievements } from './listening/track18SportsAchievements.js';
import { track19SportsPreferences } from './listening/track19SportsPreferences.js';
import { track20Discussions } from './listening/track20Discussions.js';
import { track21ModernArtAndClimate } from './listening/track21ModernArtAndClimate.js';
import { track22SpaceExpeditions } from './listening/track22SpaceExpeditions.js';
import { track23PublicOpinions } from './listening/track23PublicOpinions.js';
import { track24SpaceComparison } from './listening/track24SpaceComparison.js';
import { track25MarsContingency } from './listening/track25MarsContingency.js';
import { track26PsychologicalCrisis } from './listening/track26PsychologicalCrisis.js';
import { track27EnvironmentalEngineer } from './listening/track27EnvironmentalEngineer.js';
import { track28MarsProjectReview } from './listening/track28MarsProjectReview.js';
import { track29IntonationAttitude } from './listening/track29IntonationAttitude.js';
import { track30TransportConversations } from './listening/track30TransportConversations.js';
import { track31UrbanTransportProject } from './listening/track31UrbanTransportProject.js';
import { track32UrbanTrafficHotspots } from './listening/track32UrbanTrafficHotspots.js';
import { track33TransportProposalsEvaluation } from './listening/track33TransportProposalsEvaluation.js';
import { track34TransportProjectCostAnalysis } from './listening/track34TransportProjectCostAnalysis.js';
import { track35TransportBenefitsRecommendations } from './listening/track35TransportBenefitsRecommendations.js';
import { track36AgreementDisagreementIntonation } from './listening/track36AgreementDisagreementIntonation.js';
import { track37AshtownUrbanTransformation } from './listening/track37AshtownUrbanTransformation.js';
import { track38SpeakingPart2ExaminerPrompt } from './listening/track38SpeakingPart2ExaminerPrompt.js';
import { track39SpeakingPart2CandidateSample } from './listening/track39SpeakingPart2CandidateSample.js';
import { track40ComplexSentencesConnectors } from './listening/track40ComplexSentencesConnectors.js';
import { track41TravelExperiencesFollowUp } from './listening/track41TravelExperiencesFollowUp.js';
import { track42UKBusinessStructures } from './listening/track42UKBusinessStructures.js';
import { track43SoleTraderProsCons } from './listening/track43SoleTraderProsCons.js';
import { track44PartnershipsSimpleLLP } from './listening/track44PartnershipsSimpleLLP.js';
import { track45LimitedLiabilityCompanyLtd } from './listening/track45LimitedLiabilityCompanyLtd.js';
import { track46BusinessStructuresSummary } from './listening/track46BusinessStructuresSummary.js';
import { track47BusinessStructuresCaseStudies } from './listening/track47BusinessStructuresCaseStudies.js';

// Cambridge IELTS Listening Raw Score to Band Score Conversion Table
export function calculateListeningBandScore(rawScore) {
  const score = Math.max(0, Math.min(40, Number(rawScore) || 0));
  if (score >= 39) return 9.0;
  if (score >= 37) return 8.5;
  if (score >= 35) return 8.0;
  if (score >= 32) return 7.5;
  if (score >= 30) return 7.0;
  if (score >= 26) return 6.5;
  if (score >= 23) return 6.0;
  if (score >= 18) return 5.5;
  if (score >= 16) return 5.0;
  if (score >= 13) return 4.5;
  if (score >= 10) return 4.0;
  if (score >= 6) return 3.5;
  if (score >= 4) return 3.0;
  return 2.5;
}

// Master collection of pre-loaded official Cambridge simulation tests
export const INITIAL_LISTENING_TESTS = [
  track47BusinessStructuresCaseStudies,
  track46BusinessStructuresSummary,
  track45LimitedLiabilityCompanyLtd,
  track44PartnershipsSimpleLLP,
  track43SoleTraderProsCons,
  track42UKBusinessStructures,
  track41TravelExperiencesFollowUp,
  track40ComplexSentencesConnectors,
  track39SpeakingPart2CandidateSample,
  track38SpeakingPart2ExaminerPrompt,
  track37AshtownUrbanTransformation,
  track36AgreementDisagreementIntonation,
  track35TransportBenefitsRecommendations,
  track34TransportProjectCostAnalysis,
  track33TransportProposalsEvaluation,
  track32UrbanTrafficHotspots,
  track31UrbanTransportProject,
  track30TransportConversations,
  track29IntonationAttitude,
  track28MarsProjectReview,
  track27EnvironmentalEngineer,
  track26PsychologicalCrisis,
  track25MarsContingency,
  track24SpaceComparison,
  track23PublicOpinions,
  track22SpaceExpeditions,
  track21ModernArtAndClimate,
  track20Discussions,
  track19SportsPreferences,
  track18SportsAchievements,
  track17SportsBenefits,
  track16EventDuties,
  track15EquipmentPrep,
  track14RoomSchedule,
  track13SportsAndSkills,
  track12SportsCentreMap,
  track11MapDirections,
  track10WordStressPronunciation,
  track9HometownSentences,
  track8StudentAccommodation,
  track7EnsuiteMicroDrill,
  track6OfferProcess,
  track5PropertyViewing,
  track4NumbersMeasurements,
  track3PropertyEnquiry,
  track2FlatDescriptions,
  cambridge20Test1,
  cambridge19Test1,
  cambridge18Test1,
  cambridge17Test1,
  cambridge8Test1,
  cambridge8Test2,
  cambridge8Test3
];

