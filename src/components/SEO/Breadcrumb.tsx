import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  url: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (page: string) => void;
}

export default function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <nav aria-label="Fil d'Ariane" className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 py-3 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center text-gray-500 hover:text-blue-600 transition-colors duration-200"
              aria-label="Retour à l'accueil"
              itemProp="item"
            >
              <Home className="w-4 h-4" />
              <span className="sr-only" itemProp="name">Accueil</span>
            </button>
            <meta itemProp="position" content="1" />
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              {item.current ? (
                <span className="text-gray-900 font-medium" aria-current="page" itemProp="name">
                  {item.name}
                </span>
              ) : (
                <button
                  onClick={() => onNavigate(item.url)}
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                  itemProp="item"
                >
                  <span itemProp="name">{item.name}</span>
                </button>
              )}
              <meta itemProp="position" content={index + 2} />
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
