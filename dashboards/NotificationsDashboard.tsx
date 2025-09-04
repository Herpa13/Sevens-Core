import React, { useState, useEffect, useMemo } from 'react';
import { ProductNotification, Product, Country } from '../types';
import { Icon } from '../components/common/Icon';

interface NotificationsDashboardProps {
  notifications: ProductNotification[];
  products: Product[];
  countries: Country[];
  onStatusChange: (productId: number, countryId: number, status: ProductNotification['status']) => void;
  onEditDetails: (notification: ProductNotification) => void;
}

const statusConfig: Record<ProductNotification['status'], { color: string; icon: string }> = {
    'Pendiente': { color: 'yellow', icon: 'hourglass-start' },
    'En proceso': { color: 'blue', icon: 'cogs' },
    'Notificado': { color: 'green', icon: 'check-circle' },
    'No necesario': { color: 'gray', icon: 'minus-circle' },
    'Espera de decision': { color: 'purple', icon: 'pause-circle' },
    'No Notificable': { color: 'gray', icon: 'ban' },
    'Pendiente nueva notificación': { color: 'yellow', icon: 'sync-alt' }
};

const colorVariants = {
    yellowBg: 'bg-yellow-500/10 text-yellow-300',
    blueBg: 'bg-blue-500/10 text-blue-300',
    greenBg: 'bg-green-500/10 text-green-300',
    grayBg: 'bg-slate-500/20 text-slate-400',
    purpleBg: 'bg-purple-500/10 text-purple-300',
};

const STATUS_OPTIONS: ProductNotification['status'][] = ['Pendiente', 'En proceso', 'Notificado', 'No necesario', 'Espera de decision', 'No Notificable', 'Pendiente nueva notificación'];

export const NotificationsDashboard: React.FC<NotificationsDashboardProps> = ({ notifications, products, countries, onStatusChange, onEditDetails }) => {
  
  const [dropdown, setDropdown] = useState<{
    open: boolean;
    productId: number | null;
    countryId: number | null;
    x: number;
    y: number;
  }>({ open: false, productId: null, countryId: null, x: 0, y: 0 });
  
  const [countryOrder, setCountryOrder] = useState(countries.map(c => c.id as number));

  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdown.open) {
        setDropdown({ open: false, productId: null, countryId: null, x: 0, y: 0 });
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdown.open]);
  
  const orderedCountries = useMemo(() => {
    return countryOrder.map(id => countries.find(c => c.id === id)).filter(Boolean) as Country[];
  }, [countryOrder, countries]);


  const handleDragStart = (e: React.DragEvent<HTMLTableCellElement>, countryId: number) => {
      e.dataTransfer.setData('countryId', String(countryId));
  };
  
  const handleDrop = (e: React.DragEvent<HTMLTableCellElement>, targetCountryId: number) => {
      e.preventDefault();
      const draggedCountryId = Number(e.dataTransfer.getData('countryId'));
      if (draggedCountryId !== targetCountryId) {
          const newOrder = [...countryOrder];
          const draggedIndex = newOrder.indexOf(draggedCountryId);
          const targetIndex = newOrder.indexOf(targetCountryId);

          // Swap elements
          const temp = newOrder[draggedIndex];
          newOrder.splice(draggedIndex, 1);
          newOrder.splice(targetIndex, 0, temp);

          setCountryOrder(newOrder);
      }
      e.currentTarget.classList.remove('bg-cyan-500/20');
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>) => {
      e.preventDefault();
      e.currentTarget.classList.add('bg-cyan-500/20');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLTableCellElement>) => {
      e.currentTarget.classList.remove('bg-cyan-500/20');
  };

  const handleCellClick = (e: React.MouseEvent, productId: number, countryId: number) => {
    e.stopPropagation();
    setDropdown({
      open: true,
      productId: productId,
      countryId: countryId,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleStatusSelect = (status: ProductNotification['status']) => {
    if (dropdown.productId !== null && dropdown.countryId !== null) {
        onStatusChange(dropdown.productId, dropdown.countryId, status);
    }
    setDropdown({ open: false, productId: null, countryId: null, x: 0, y: 0 });
  };
  
  const handleEditDetailsClick = () => {
      if (dropdown.productId === null || dropdown.countryId === null) return;
      
      let notification = notifications.find(n => n.productId === dropdown.productId && n.countryId === dropdown.countryId);
      
      if (!notification) {
        notification = {
          id: 'new',
          productId: dropdown.productId,
          countryId: dropdown.countryId,
          status: 'Pendiente',
          notifiedBy: '',
        };
      }
      
      onEditDetails(notification);
      setDropdown({ open: false, productId: null, countryId: null, x: 0, y: 0 });
  }

  const StatusDropdown = () => {
    if (!dropdown.open) return null;

    return (
        <div
          className="fixed z-10 bg-slate-700 border border-slate-600 rounded-md shadow-lg py-1"
          style={{ top: dropdown.y + 10, left: dropdown.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {STATUS_OPTIONS.map(status => (
            <button
              key={status}
              onClick={() => handleStatusSelect(status)}
              className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 flex items-center"
            >
              <Icon name={statusConfig[status].icon} className={`mr-2 ${colorVariants[(statusConfig[status].color + 'Bg') as keyof typeof colorVariants].split(' ')[1]}`} />
              {status}
            </button>
          ))}
           <div className="border-t border-slate-600 my-1"></div>
            <button
              onClick={handleEditDetailsClick}
              className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 flex items-center"
            >
              <Icon name="pencil-alt" className="mr-2 text-slate-400" />
              Editar Detalles
            </button>
        </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-200 mb-6">Matriz de Notificaciones Regulatorias</h1>
      <StatusDropdown />
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700 border-collapse">
            <thead className="bg-slate-700/50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4 whitespace-nowrap border-r border-slate-700">
                  Producto
                </th>
                {orderedCountries.map(country => (
                  <th 
                    key={country.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, country.id as number)}
                    onDrop={(e) => handleDrop(e, country.id as number)}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap cursor-grab active:cursor-grabbing transition-colors"
                  >
                    {country.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {products.map(product => (
                <tr key={product.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-200 border-r border-slate-700">
                    {product.name}
                  </td>
                  {orderedCountries.map(country => {
                    const notification = notifications.find(n => n.productId === product.id && n.countryId === country.id);
                    const status = notification?.status;
                    const config = status ? statusConfig[status] : null;

                    return (
                      <td key={country.id} className="px-4 py-3 whitespace-nowrap text-center text-sm border-l border-slate-700/50">
                        <button 
                            onClick={(e) => handleCellClick(e, product.id as number, country.id as number)}
                            className={`w-full h-full inline-flex items-center justify-center px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors duration-200 
                            ${config ? colorVariants[(config.color + 'Bg') as keyof typeof colorVariants] : 'bg-slate-700/50 hover:bg-slate-600 text-slate-500'}`}
                        >
                          {config && <Icon name={config.icon} className="mr-1.5" />}
                          {status || 'N/A'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};