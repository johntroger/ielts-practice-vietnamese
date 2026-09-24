/**
 * APP_FEATURES & SKILL_DEFINITIONS (Delegation Adapter)
 * File này đóng vai trò cầu nối tương thích ngược (Backward Compatibility Adapter).
 * Nguồn dữ liệu duy nhất hiện được quản lý tại: src/core/featureRegistry.js
 */

export { 
  SKILL_DEFINITIONS, 
  FEATURE_CATEGORIES, 
  FEATURE_REGISTRY, 
  FEATURE_REGISTRY as APP_FEATURES,
  getAllFeatures,
  getFeatureById,
  searchFeatures,
  getFeaturesBySkill,
  getRecentChangelog,
  getContextualFeatures,
  dispatchFeatureAction
} from '../core/featureRegistry';
