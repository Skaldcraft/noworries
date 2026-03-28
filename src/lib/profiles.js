export const idToProfileMap = {
  'for-couple': 'pareja',
  'for-mom': 'mama',
  'for-dad': 'papa',
  'for-babies': 'bebes',
  'for-kids': 'ninos',
  'for-teens': 'adolescentes',
  'for-grandparents': 'abuelos',
  'for-best-friend': 'mejor_amigo',
  'for-coworker': 'companeros',
  'for-birthday': 'cumpleanios',
  'for-selfcare': 'cuidarse',
  'for-fitness': 'deportistas',
  'for-traveler': 'viajeros',
  'for-petowner': 'mascotas',
  'for-techies': 'gente_tecnologica',
  'for-diy': 'manitas',
  'for-newparents': 'nuevos_papis',
  'new-home': 'nuevo_hogar',
  'new-job': 'nuevo_trabajo',
  'for-cooks': 'cocinillas',
  'for-creative-persons': 'creativos',
  'for-readers': 'lectores',
  'for-eco-friendly': 'ecologistas',
  'for-homebodies': 'gente_casera',
  'for-invisible-friend': 'amigo_invisible',
  'farewell': 'despedida',
  'small-gift': 'detalle',
  'just-because': 'solo_porque_si',
  'for-someone-who-has-everything': 'quien_lo_tiene_todo',
  'basicos-utiles': 'basicos_utiles'
};

export const profileDisplayLabels = {
  pareja: 'Para tu pareja',
  mama: 'Para mamá',
  papa: 'Para papá',
  bebes: 'Para bebés',
  ninos: 'Para niños (5-12 años)',
  adolescentes: 'Para adolescentes',
  abuelos: 'Para los abuelos',
  mejor_amigo: 'Para tu mejor amigo/a',
  companeros: 'Para compañero/a',
  cumpleanios: 'Para cumpleañeros',
  cuidarse: 'Para quienes se cuidan',
  deportistas: 'Para deportistas',
  viajeros: 'Para gente viajera',
  mascotas: 'Para amantes de mascotas',
  gente_tecnologica: 'Gente Tecnológica / Gamers',
  manitas: 'Para manitas',
  nuevos_papis: 'Para nuevos papás y mamás',
  nuevo_hogar: 'Nuevo hogar',
  nuevo_trabajo: 'Nuevo trabajo / ascenso',
  cocinillas: 'Para cocinillas',
  creativos: 'Para creativos',
  lectores: 'Para lectores',
  ecologistas: 'Para ecologistas',
  gente_casera: 'Para gente casera',
  amigo_invisible: 'Para amigo invisible',
  despedida: 'Despedida',
  detalle: 'El detalle',
  solo_porque_si: 'Solo porque sí',
  quien_lo_tiene_todo: 'Para quien lo tiene todo',
  basicos_utiles: 'Básicos útiles'
};

export const getProfileIdFromGiftId = (giftId) => {
  const baseId = Object.keys(idToProfileMap).find((prefix) => giftId.startsWith(prefix));
  return baseId ? idToProfileMap[baseId] : null;
};

export const getOrderedProfilesFromGifts = (gifts) => {
  const seenProfiles = new Set();
  const orderedProfiles = [];

  gifts.forEach((gift) => {
    const profileId = getProfileIdFromGiftId(gift.id);
    if (profileId && !seenProfiles.has(profileId)) {
      seenProfiles.add(profileId);
      orderedProfiles.push(profileId);
    }
  });

  return orderedProfiles;
};

const toSentenceCase = (text) => {
  if (!text || typeof text !== 'string') return '';
  const lowered = text.toLowerCase();
  return lowered.charAt(0).toUpperCase() + lowered.slice(1);
};

export const getOrderedProfileOptionsFromGifts = (gifts) => {
  const seenProfiles = new Set();
  const options = [];

  gifts.forEach((gift) => {
    const profileId = getProfileIdFromGiftId(gift.id);
    if (!profileId || seenProfiles.has(profileId)) return;

    seenProfiles.add(profileId);
    options.push({
      id: profileId,
      label: toSentenceCase(gift.recipient) || profileDisplayLabels[profileId] || profileId
    });
  });

  return options;
};

const PRICE_ORDER = {
  under15: 0,
  '15-35': 1,
  '35-70': 2,
  '70-150': 3,
};

export const PRICE_LABELS = {
  under15: 'Rango bajo',
  '15-35': 'Rango medio-bajo',
  '35-70': 'Rango medio-alto',
  '70-150': 'Rango alto',
};

export const PRICE_COLORS = {
  under15: '#f4d35a',
  '15-35': '#95d1a5',
  '35-70': '#779fcb',
  '70-150': '#a88fd5',
};

const getPriceRank = (priceRange) => PRICE_ORDER[priceRange] ?? 99;
const normalizePriceRange = (priceRange) => {
  if (priceRange === 'under-15') return 'under15';
  return priceRange;
};

const getProfileOrderFromGifts = (gifts) => {
  const order = [];
  const seen = new Set();

  gifts.forEach((gift) => {
    const profileId = getProfileIdFromGiftId(gift.id);
    if (!profileId || seen.has(profileId)) return;
    seen.add(profileId);
    order.push(profileId);
  });

  return order;
};

export const getSortedUniqueGifts = (gifts) => {
  const latestByKey = new Map();

  gifts.forEach((gift, index) => {
    const profileId = getProfileIdFromGiftId(gift.id) || gift.recipient;
    const normalizedPriceRange = normalizePriceRange(gift.price_range);
    const key = `${profileId}::${normalizedPriceRange}`;
    latestByKey.set(key, {
      gift,
      index,
      profileId,
      priceRank: getPriceRank(normalizedPriceRange),
    });
  });

  const profileOrder = getProfileOrderFromGifts(gifts);

  return [...latestByKey.values()]
    .map(({ gift, index, profileId, priceRank }) => ({
      ...gift,
      __sourceIndex: index,
      __profileId: profileId,
      __priceRank: priceRank,
    }))
    .sort((a, b) => {
      const profileDiff = profileOrder.indexOf(a.__profileId) - profileOrder.indexOf(b.__profileId);
      if (profileDiff !== 0) return profileDiff;

      const priceDiff = a.__priceRank - b.__priceRank;
      if (priceDiff !== 0) return priceDiff;

      return a.__sourceIndex - b.__sourceIndex;
    });
};

export const getPriceLabel = (range) => PRICE_LABELS[normalizePriceRange(range)] || range;

export const getPriceColor = (range) => PRICE_COLORS[normalizePriceRange(range)] || '#008000';

export const getProfileGiftCollections = (gifts, profileId) => {
  const profileGifts = gifts.filter((gift) => getProfileIdFromGiftId(gift.id) === profileId);
  const latestByPrice = new Map();
  const displaced = [];

  profileGifts.forEach((gift, index) => {
    const normalizedPriceRange = normalizePriceRange(gift.price_range);
    const key = normalizedPriceRange;
    const entry = {
      ...gift,
      __sourceIndex: index,
      __priceRank: getPriceRank(normalizedPriceRange),
    };

    if (latestByPrice.has(key)) {
      displaced.push(latestByPrice.get(key));
    }

    latestByPrice.set(key, entry);
  });

  const primary = [...latestByPrice.values()].sort((a, b) => {
    const priceDiff = a.__priceRank - b.__priceRank;
    if (priceDiff !== 0) return priceDiff;
    return a.__sourceIndex - b.__sourceIndex;
  });

  displaced.sort((a, b) => a.__priceRank - b.__priceRank || a.__sourceIndex - b.__sourceIndex);

  return { primary, displaced };
};
