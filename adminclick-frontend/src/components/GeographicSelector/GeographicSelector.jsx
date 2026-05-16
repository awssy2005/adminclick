import { useState, useEffect } from 'react';
import api from '../../api';

export default function GeographicSelector({ onChange }) {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');

  // Charger les régions au montage
  useEffect(() => {
    api.get('/regions')
      .then(res => setRegions(res.data))
      .catch(err => console.error('Erreur chargement régions', err));
  }, []);

  // Quand une région est choisie, charger ses provinces
  useEffect(() => {
    if (!selectedRegion) {
      setProvinces([]);
      setSelectedProvince('');
      return;
    }
    api.get(`/provinces/${selectedRegion}`)
      .then(res => setProvinces(res.data))
      .catch(err => console.error('Erreur chargement provinces', err));
  }, [selectedRegion]);

  // Quand une province est choisie, charger ses communes
  useEffect(() => {
    if (!selectedProvince) {
      setCommunes([]);
      setSelectedCommune('');
      return;
    }
    api.get(`/communes/${selectedProvince}`)
      .then(res => setCommunes(res.data))
      .catch(err => console.error('Erreur chargement communes', err));
  }, [selectedProvince]);

  // Notifier le parent à chaque changement complet
  useEffect(() => {
    if (onChange) {
      const region = regions.find(r => r.id == selectedRegion);
      const province = provinces.find(p => p.id == selectedProvince);
      const commune = communes.find(c => c.id == selectedCommune);
      onChange({
        region: region || null,
        province: province || null,
        commune: commune || null,
      });
    }
  }, [selectedRegion, selectedProvince, selectedCommune, regions, provinces, communes]);

  return (
    <div>
      <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}>
        <option value="">-- Région --</option>
        {regions.map(r => (
          <option key={r.id} value={r.id}>{r.nom}</option>
        ))}
      </select>

      <select value={selectedProvince} onChange={e => setSelectedProvince(e.target.value)} disabled={!selectedRegion}>
        <option value="">-- Province --</option>
        {provinces.map(p => (
          <option key={p.id} value={p.id}>{p.nom}</option>
        ))}
      </select>

      <select value={selectedCommune} onChange={e => setSelectedCommune(e.target.value)} disabled={!selectedProvince}>
        <option value="">-- Commune --</option>
        {communes.map(c => (
          <option key={c.id} value={c.id}>{c.nom}</option>
        ))}
      </select>
    </div>
  );
}