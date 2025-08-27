import React, { useState } from 'react';
import { Car, Plus, Trash2, Edit, Bell, AlertCircle, CheckCircle, Eye, X, FileText, Calendar, MapPin, CreditCard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

export default function VehicleManagement() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [vehicleFPS, setVehicleFPS] = useState<any[]>([]);
  const [showFPSModal, setShowFPSModal] = useState(false);
  const [loadingFPS, setLoadingFPS] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    licensePlate: '',
    brand: '',
    model: '',
    year: '',
    chassisNumber: '',
    notifications: true
  });

  // Charger les véhicules depuis Supabase
  React.useEffect(() => {
    if (user) {
      loadVehicles();
    }
  }, [user]);

  const loadVehicles = async () => {
    if (!user) return;
    
    setLoadingVehicles(true);
    setError(''); // Reset error state
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading vehicles:', error);
        setError('Erreur lors du chargement des véhicules');
        return;
      }

      console.log('Loaded vehicles from Supabase:', data);

      // Transformer les données pour correspondre au format attendu
      const transformedVehicles = data.map(vehicle => ({
        id: vehicle.id,
        licensePlate: vehicle.license_plate,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color || '',
        notifications: vehicle.notifications_enabled,
        lastFPS: null, // À implémenter avec la table fps_records
        totalFPS: 0, // À implémenter avec la table fps_records
        isActive: vehicle.is_active
      }));

      setVehicles(transformedVehicles);
      console.log('Transformed vehicles:', transformedVehicles);
    } catch (err: any) {
      console.error('Error loading vehicles:', err);
      setError('Une erreur est survenue lors du chargement des véhicules');
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleAddVehicle = async () => {
    if (!newVehicle.licensePlate || !newVehicle.brand || !newVehicle.model || !newVehicle.chassisNumber) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!user) {
      setError('Vous devez être connecté pour ajouter un véhicule');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data, error: insertError } = await supabase
        .from('vehicles')
        .insert({
          user_id: user.id,
          license_plate: newVehicle.licensePlate,
          brand: newVehicle.brand,
          model: newVehicle.model,
          year: newVehicle.year ? parseInt(newVehicle.year) : null,
          color: '', // Peut être ajouté plus tard
          notifications_enabled: newVehicle.notifications,
          is_active: true
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Ajouter le véhicule à la liste locale
      const vehicle = {
        id: data.id,
        licensePlate: data.license_plate,
        brand: data.brand,
        model: data.model,
        year: data.year,
        color: data.color || '',
        notifications: data.notifications_enabled,
        lastFPS: null,
        totalFPS: 0,
        isActive: data.is_active
      };
      
      // Recharger la liste pour s'assurer de la cohérence
      await loadVehicles();
      
      setNewVehicle({
        licensePlate: '',
        brand: '',
        model: '',
        year: '',
        chassisNumber: '',
        notifications: true
      });
      setShowAddVehicle(false);
    } catch (err: any) {
      console.error('Error adding vehicle:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'ajout du véhicule');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error deleting vehicle:', error);
        setError('Erreur lors de la suppression du véhicule');
        return;
      }

      // Recharger la liste
      await loadVehicles();
    } catch (err: any) {
      console.error('Error deleting vehicle:', err);
      setError('Une erreur est survenue lors de la suppression du véhicule');
    }
  };

  const toggleNotifications = async (id: string) => {
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return;

    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ notifications_enabled: !vehicle.notifications })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error updating notifications:', error);
        setError('Erreur lors de la mise à jour des notifications');
        return;
      }

      // Recharger la liste
      await loadVehicles();
    } catch (err: any) {
      console.error('Error updating notifications:', err);
      setError('Une erreur est survenue lors de la mise à jour');
    }
  };

  const toggleActive = async (id: string) => {
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return;

    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ is_active: !vehicle.isActive })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error updating active status:', error);
        setError('Erreur lors de la mise à jour du statut');
        return;
      }

      // Recharger la liste
      await loadVehicles();
    } catch (err: any) {
      console.error('Error updating active status:', err);
      setError('Une erreur est survenue lors de la mise à jour');
    }
  };

  const handleViewFPS = async (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setShowFPSModal(true);
    setLoadingFPS(true);
    
    try {
      // Simuler des données FPS pour ce véhicule
      // Dans une vraie application, vous feriez un appel à Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockFPS = [
        {
          id: 'FPS-2024-001234',
          date: '2024-01-20',
          amount: 35,
          status: 'paid',
          location: 'Paris 15ème - Rue de Vaugirard',
          paymentMethod: 'Klarna 3x'
        },
        {
          id: 'FPS-2024-001235',
          date: '2024-01-18',
          amount: 50,
          status: 'pending',
          location: 'Lyon Centre - Place Bellecour',
          paymentMethod: 'En attente'
        },
        {
          id: 'FPS-2024-001236',
          date: '2024-01-15',
          amount: 25,
          status: 'paid',
          location: 'Marseille - Vieux Port',
          paymentMethod: 'Paiement immédiat'
        }
      ].filter(() => Math.random() > 0.3); // Simuler des données variables
      
      setVehicleFPS(mockFPS);
    } catch (err) {
      console.error('Error loading FPS:', err);
      setVehicleFPS([]);
    } finally {
      setLoadingFPS(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-orange-100 text-orange-800',
      failed: 'bg-red-100 text-red-800'
    };
    const labels = {
      paid: 'Payé',
      pending: 'En attente',
      failed: 'Échec'
    };
    return {
      style: styles[status as keyof typeof styles],
      label: labels[status as keyof typeof labels]
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Mes véhicules</h2>
              <p className="text-gray-600 mt-1">Gérez vos véhicules et activez la détection automatique des FPS</p>
            </div>
            <button
              onClick={() => setShowAddVehicle(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter un véhicule
            </button>
          </div>
        </div>

        {/* API Detection Info */}
        <div className="p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Détection automatique des FPS</h3>
              <p className="text-sm text-blue-700 mb-3">
                Nous surveillons automatiquement l'apparition de nouveaux FPS pour vos véhicules enregistrés. 
                Vous recevrez une notification dès qu'un nouveau FPS est détecté.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Surveillance 24h/24
                </span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Notifications instantanées
                </span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Paiement facilité
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicles List */}
        <div className="divide-y divide-gray-200">
          {loadingVehicles ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des véhicules...</p>
            </div>
          ) : (
            <>
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{vehicle.licensePlate}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        vehicle.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {vehicle.isActive ? 'Surveillance active' : 'Surveillance désactivée'}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {vehicle.brand} {vehicle.model} ({vehicle.year}) - {vehicle.color}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{vehicle.totalFPS} FPS détectés</span>
                      {vehicle.lastFPS && (
                        <span>Dernier FPS: {new Date(vehicle.lastFPS).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleNotifications(vehicle.id)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      vehicle.notifications 
                        ? 'text-blue-600 bg-blue-100 hover:bg-blue-200' 
                        : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    title={vehicle.notifications ? 'Désactiver les notifications' : 'Activer les notifications'}
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleActive(vehicle.id)}
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      vehicle.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {vehicle.isActive ? 'Actif' : 'Inactif'}
                  </button>
                  <button 
                    onClick={() => handleViewFPS(vehicle)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    title="Voir les FPS de ce véhicule"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
            </>
          )}
        </div>

        {vehicles.length === 0 && (
          !loadingVehicles && (
          <div className="p-12 text-center">
            <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun véhicule enregistré</h3>
            <p className="text-gray-600 mb-4">
              Ajoutez vos véhicules pour activer la détection automatique des FPS
            </p>
            <button
              onClick={() => setShowAddVehicle(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Ajouter mon premier véhicule
            </button>
          </div>
          )
        )}
      </div>

      {/* Statistics */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Véhicules surveillés</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {vehicles.filter(v => v.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">FPS détectés ce mois</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Notifications actives</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {vehicles.filter(v => v.notifications).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un véhicule</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plaque d'immatriculation *
                </label>
                <input
                  type="text"
                  placeholder="AB-123-CD"
                  value={newVehicle.licensePlate}
                  onChange={(e) => setNewVehicle({...newVehicle, licensePlate: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marque *
                  </label>
                  <input
                    type="text"
                    placeholder="Renault"
                    value={newVehicle.brand}
                    onChange={(e) => setNewVehicle({...newVehicle, brand: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modèle *
                  </label>
                  <input
                    type="text"
                    placeholder="Clio"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Année
                  </label>
                  <input
                    type="number"
                    placeholder="2020"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de châssis *
                  </label>
                  <input
                    type="text"
                    placeholder="VF1RG260F62123456"
                    value={newVehicle.chassisNumber}
                    onChange={(e) => setNewVehicle({...newVehicle, chassisNumber: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    maxLength={17}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={newVehicle.notifications}
                  onChange={(e) => setNewVehicle({...newVehicle, notifications: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="notifications" className="text-sm text-gray-700">
                  Activer les notifications pour ce véhicule
                </label>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddVehicle(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleAddVehicle}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Ajout...
                  </>
                ) : (
                  'Ajouter'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FPS Modal */}
      {showFPSModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      FPS du véhicule {selectedVehicle.licensePlate}
                    </h3>
                    <p className="text-gray-600">
                      {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.year})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowFPSModal(false);
                    setSelectedVehicle(null);
                    setVehicleFPS([]);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {loadingFPS ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600">Chargement des FPS...</span>
                </div>
              ) : vehicleFPS.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {vehicleFPS.length} FPS trouvé{vehicleFPS.length > 1 ? 's' : ''}
                    </h4>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-xl font-bold text-gray-900">
                          {vehicleFPS.reduce((sum, fps) => sum + fps.amount, 0)}€
                        </p>
                      </div>
                    </div>
                  </div>

                  {vehicleFPS.map((fps) => {
                    const statusBadge = getStatusBadge(fps.status);
                    return (
                      <div key={fps.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <h5 className="font-semibold text-gray-900">{fps.id}</h5>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusBadge.style}`}>
                                  {statusBadge.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(fps.date).toLocaleDateString('fr-FR')}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {fps.location}
                                </div>
                              </div>
                              <p className="text-sm text-gray-500">
                                Payé via {fps.paymentMethod}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">{fps.amount}€</p>
                            </div>
                            {fps.status === 'pending' && (
                              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Payer
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun FPS trouvé</h4>
                  <p className="text-gray-600">
                    Ce véhicule n'a pas encore de FPS enregistrés dans notre système.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>Surveillance automatique : <span className="font-medium text-green-600">Active</span></p>
                  <p>Dernière vérification : Il y a 2 minutes</p>
                </div>
                <button
                  onClick={() => {
                    setShowFPSModal(false);
                    setSelectedVehicle(null);
                    setVehicleFPS([]);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
