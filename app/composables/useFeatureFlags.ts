import { FEATURE_FLAGS } from '#shared/features/featureFlags'

export const useFeatureFlags = () => {
  type FeatureKey = keyof typeof FEATURE_FLAGS

  const isFeatureEnabled = (feature: FeatureKey): boolean => {
    return FEATURE_FLAGS[feature]
  }

  const getAllFlags = () => FEATURE_FLAGS

  return { isFeatureEnabled, getAllFlags }
}
