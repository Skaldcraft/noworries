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
  'for-someone-who-has-everything': 'quien_lo_tiene_todo'
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
  quien_lo_tiene_todo: 'Para quien lo tiene todo'
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