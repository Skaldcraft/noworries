import { useState } from 'react';

export function useGiftFilters(initialValues = {}) {
  const [tier, setTier] = useState(initialValues.tier || 'all');
  const [budget, setBudget] = useState(initialValues.budget || 'all');
  const [profileId, setProfileId] = useState(initialValues.profileId || 'all');
  const [searchQuery, setSearchQuery] = useState(initialValues.searchQuery || '');

  return {
    tier,
    budget,
    profileId,
    searchQuery,
    setTier,
    setBudget,
    setProfileId,
    setSearchQuery,
  };
}
