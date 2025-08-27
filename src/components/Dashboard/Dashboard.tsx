import React, { useState } from 'react';
import { User, CreditCard, FileText, Car, Bell, Settings, LogOut, Download, Eye, Plus, Trash2, Edit, AlertCircle, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../Logo';
import PaymentMethods from './PaymentMethods';
import FPSHistory from './FPSHistory';
import VehicleManagement from './VehicleManagement';
import Profile from './Profile';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Handle URL parameters for tab navigation
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const setupParam = urlParams.get('setup');
    
    if (tabParam) {
      setActiveTab(tabParam);
    }
    
    // Show success message if card was added successfully
    if (setupParam === 'success') {
      // Refresh payment methods data when returning from successful card addition
      if (activeTab === 'payments') {
        // Trigger a refresh of the PaymentMethods component
        window.dispatchEvent(new CustomEvent('refreshPaymentMethods'));
      }
      // Remove URL parameters after handling
      setTimeout(() => {
        window.history.replaceState({}, '', window.location.pathname + '?page=dashboard&tab=payments');
      }, 100);
    }
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      // Utiliser onNavigate pour mettre à jour l'état de l'application
      onNavigate('home');
    } catch (err) {
      console.error('Unexpected error during sign out:', err);
      // Forcer la navigation même en cas d'erreur
      onNavigate('home');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: User },
    { id: 'fps', label: 'Mes FPS', icon: FileText },
    { id: 'vehicles', label: 'Mes véhicules', icon: Car },
    { id: 'payments', label: 'Moyens de paiement', icon: CreditCard },
    { id: 'profile', label: 'Profil', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview setActiveTab={setActiveTab} />;
      case 'fps':
        return <FPSHistory />;
      case 'vehicles':
        return <VehicleManagement />;
      case 'payments':
        return <PaymentMethods />;
      case 'profile':
        return <Profile user={{
          name: user?.user_metadata?.full_name || '',
          email: user?.email || '',
          phone: user?.user_metadata?.phone || '',
          joinDate: user?.created_at || new Date().toISOString()
        }} />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.location.href = '/?page=home'}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
              >
                <Logo size="md" />
                <span className="text-2xl font-bold text-gray-900">Zenia</span>
              </button>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Espace Client</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">
                  {user?.user_metadata?.full_name || user?.email || 'Utilisateur'}
                </span>
              </div>
              <button 
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                title="Se déconnecter"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

function Overview({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const pendingFPS = [
    {
      id: 'FPS-2024-001235',
      date: '2024-01-18',
      amount: 50,
      status: 'pending',
      vehicle: 'EF-456-GH',
      location: 'Lyon Centre'
    },
    {
      id: 'FPS-2024-001238',
      date: '2024-01-22',
      amount: 45,
      status: 'pending',
      vehicle: 'AB-123-CD',
      location: 'Bordeaux Centre'
    }
  ];

  const totalPending = pendingFPS.reduce((sum, fps) => sum + fps.amount, 0);

  const stats = [
    { label: 'FPS payés', value: '12', color: 'green' },
    { label: 'En attente', value: pendingFPS.length.toString(), color: 'orange' },
    { label: 'Véhicules', value: '3', color: 'blue' },
    { label: 'Économies', value: '245€', color: 'purple' }
  ];

  const recentFPS = [
    {
      id: 'FPS-2024-001234',
      date: '2024-01-20',
      amount: 35,
      status: 'paid',
      vehicle: 'AB-123-CD',
      location: 'Paris 15ème'
    },
    {
      id: 'FPS-2024-001235',
      date: '2024-01-18',
      amount: 50,
      status: 'pending',
      vehicle: 'EF-456-GH',
      location: 'Lyon Centre'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Bienvenue sur votre espace client</h2>
        <p className="text-blue-100">Gérez vos FPS, véhicules et moyens de paiement en toute simplicité</p>
      </div>

      {/* Stats */}
      {/* FPS à payer - Section prioritaire */}
      {pendingFPS.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl">
          <div className="p-6 border-b border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-orange-900">
                    {pendingFPS.length} FPS à payer
                  </h3>
                  <p className="text-orange-700">
                    Vous avez des forfaits post-stationnement en attente de règlement
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-orange-600">Total à payer</p>
                  <p className="text-3xl font-bold text-orange-900">{totalPending}€</p>
                </div>
                <button 
                  onClick={() => setActiveTab('fps')}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <CreditCard className="w-5 h-5" />
                  Payer maintenant
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              {pendingFPS.slice(0, 3).map((fps) => (
                <div key={fps.id} className="bg-white border border-orange-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-gray-900">{fps.id}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(fps.date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="w-3 h-3" />
                            {fps.vehicle}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {fps.location}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-900">{fps.amount}€</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {pendingFPS.length > 3 && (
                <div className="text-center pt-2">
                  <button 
                    onClick={() => setActiveTab('fps')}
                    className="text-orange-600 hover:text-orange-800 font-medium text-sm"
                  >
                    Voir tous les FPS en attente ({pendingFPS.length - 3} de plus)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${stat.color}-100`}>
                <div className={`w-6 h-6 rounded-full bg-${stat.color}-500`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentFPS.map((fps) => (
              <div key={fps.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{fps.id}</p>
                    <p className="text-sm text-gray-600">{fps.location} • {fps.vehicle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{fps.amount}€</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    fps.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {fps.status === 'paid' ? 'Payé' : 'En attente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
