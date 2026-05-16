import { useState, useEffect } from 'react';
import api from '../../api';
import './AdministrativeSelector.css';

export default function AdministrativeSelector({ onChange }) {
  const [regions, setRegions] = useState([]);
  const [villes, setVilles] = useState([]);
  const [arrondissements, setArrondissements] = useState([]);
  const [secteurs, setSecteurs] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedVille, setSelectedVille] = useState('');
  const [selectedArrondissement, setSelectedArrondissement] = useState('');
  const [selectedSecteur, setSelectedSecteur] = useState('');

  // Charger régions au montage
  useEffect(() => {
    api.get('/regions')
      .then(res => setRegions(res.data))
      .catch(console.error);
  }, []);

  // Charger villes quand une région est choisie
  useEffect(() => {
    if (!selectedRegion) {
      setVilles([]);
      setSelectedVille('');
      return;
    }
    api.get(`/villes/${selectedRegion}`)
      .then(res => setVilles(res.data))
      .catch(console.error);
  }, [selectedRegion]);

  // Charger arrondissements quand une ville est choisie
  useEffect(() => {
    if (!selectedVille) {
      setArrondissements([]);
      setSelectedArrondissement('');
      return;
    }
    api.get(`/arrondissements/${selectedVille}`)
      .then(res => setArrondissements(res.data))
      .catch(console.error);
  }, [selectedVille]);

  // Charger secteurs quand un arrondissement est choisi
  useEffect(() => {
    if (!selectedArrondissement) {
      setSecteurs([]);
      setSelectedSecteur('');
      return;
    }
    api.get(`/secteurs/${selectedArrondissement}`)
      .then(res => setSecteurs(res.data))
      .catch(console.error);
  }, [selectedArrondissement]);

  // Notifier le parent
  useEffect(() => {
    if (onChange) {
      const region = regions.find(r => r.id == selectedRegion);
      const ville = villes.find(v => v.id == selectedVille);
      const arrondissement = arrondissements.find(a => a.id == selectedArrondissement);
      const secteur = secteurs.find(s => s.id == selectedSecteur);
      onChange({ region, ville, arrondissement, secteur });
    }
  }, [selectedRegion, selectedVille, selectedArrondissement, selectedSecteur, regions, villes, arrondissements, secteurs]);

  return (
    <div className="admin-selector">
      <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}>
        <option value="">-- Région --</option>
        {regions.map(r => <option key={r.id} value={r.id}>{r.nom}</option>)}
      </select>
      <select value={selectedVille} onChange={e => setSelectedVille(e.target.value)} disabled={!selectedRegion}>
        <option value="">-- Ville --</option>
        {villes.map(v => <option key={v.id} value={v.id}>{v.nom}</option>)}
      </select>
      <select value={selectedArrondissement} onChange={e => setSelectedArrondissement(e.target.value)} disabled={!selectedVille}>
        <option value="">-- Arrondissement --</option>
        {arrondissements.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
      </select>
      <select value={selectedSecteur} onChange={e => setSelectedSecteur(e.target.value)} disabled={!selectedArrondissement}>
        <option value="">-- Secteur --</option>
        {secteurs.map(s => <option key={s.id} value={s.id}>{s.nom} ({s.numero})</option>)}
      </select>
    </div>
  );
}