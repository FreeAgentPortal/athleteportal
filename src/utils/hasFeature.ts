export const FEATURES = {
  TEXT_NOTIFICATIONS: '68a3643e21efeb4bc4d75d31',
};

/**
 * Check if a user has specific feature(s)
 * @param userFeatures - Array of feature IDs that the user has
 * @param featuresToCheck - Single feature ID string or array of feature IDs to check
 * @returns true if user has the feature(s), false otherwise
 *
 * For single feature: returns true if the feature exists in userFeatures
 * For array of features: returns true only if ALL features exist in userFeatures
 */
export const hasFeature = (userFeatures: string[] | undefined | null, featuresToCheck: string | string[]): boolean => {
  // Return false if no user features provided
  if (!userFeatures || !Array.isArray(userFeatures)) {
    return false;
  }

  // Return false if no features to check
  if (!featuresToCheck) {
    return false;
  }

  try {
    // Handle single feature check
    if (typeof featuresToCheck === 'string') {
      return userFeatures.includes(featuresToCheck);
    }

    // Handle array of features - ALL must be present
    if (Array.isArray(featuresToCheck)) {
      return featuresToCheck.every((feature) => userFeatures.includes(feature));
    }

    return false;
  } catch (error) {
    console.error('Error checking feature:', error);
    return false;
  }
};
