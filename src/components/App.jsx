import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import Card from './Card';
import FolderCard from './FolderCard';
import DataMenu from '../data/DataMenu';
import '../css/App.css';
import '../css/customAntd.css';
import { Skeleton } from 'antd'; // Importar Skeleton de Ant Design

const App = () => {
  const [selectedContent, setSelectedContent] = useState(''); // Inicialmente vacío
  const [displayedItems, setDisplayedItems] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(DataMenu[0]); // Estado para la carpeta seleccionada
  const [loading, setLoading] = useState(true); // Estado para controlar la carga

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setLoading(false); // Cambiar a no cargando después de 5 segundos
    }, 5000);

    return () => clearTimeout(timer); // Limpiar el timer al desmontar
  }, []);

  useEffect(() => {
    if (loading) {
      setSelectedContent(''); // Cuando está cargando, establecer como vacío
    } else {
      // Cuando no está cargando
      if (currentFolder) {
        const { type, name, subfolders } = currentFolder;

        // Mapeo de tipos de carpetas
        const contentMap = {
          home: () => {
            setSelectedContent('Bienvenido a la página principal');
            setDisplayedItems(DataMenu.filter(item => item.type === 'folder' || item.type === 'card'));
          },
          folder: () => {
            setDisplayedItems(subfolders || []);
            setSelectedContent(subfolders && subfolders.length > 0 ? name : `${name} se encuentra vacía`);
          },
          card: () => {
            setDisplayedItems([currentFolder]);
            setSelectedContent(currentFolder.content || currentFolder.content2 || '');
          },
        };

        // Ejecutar la función correspondiente según el tipo
        contentMap[type]?.();
      }
    }
  }, [currentFolder, loading]); // Agregar loading como dependencia

  const handleSelect = (item) => {
    // Aplicar el nuevo elemento seleccionado
    setCurrentFolder(item);
  };

  // Función recursiva para calcular el nivel de anidación
  const getNestedLevel = (folder) => {
    let level = 0;
    let current = folder;
    while (current && current.parent) {
      level++;
      current = current.parent;
    }
    return level;
  };

  return (
    <div className="app-container">
      <div className="menu-container">
        <Menu 
          folders={DataMenu} // Usar el contenido importado
          onFolderSelect={handleSelect} // Usar el manejador unificado
          currentFolder={currentFolder} // Pasar el objeto de la carpeta actual
        />
      </div>
      <div className="content-container">
        <h1>Contenido</h1>
        <p>{selectedContent}</p>
        <div className="card-container">
          {loading ? (
            // Mostrar Skeleton que se asemeje a una Card
            <>
              <Skeleton active className="skeleton-card" />
              <Skeleton active className="skeleton-card" />
              <Skeleton active className="skeleton-card" />
              <Skeleton active className="skeleton-card" />
              <Skeleton active className="skeleton-card" />
              <Skeleton active className="skeleton-card" />
              <Skeleton active className="skeleton-card" />
              <Skeleton active className="skeleton-card" />
              <Skeleton active className="skeleton-card" />
            </>
          ) : (
            displayedItems.map(item => {
              const level = getNestedLevel(item); // Obtener el nivel de anidación
              const paddingLeft = `${(level + 1) * 16}px`; // Calcular el padding

              if (item.type === 'folder') {
                return (
                  <FolderCard 
                    key={item.id} 
                    title={item.name} 
                    onClick={() => handleSelect(item)}
                    style={{ paddingLeft }} 
                  />
                );
              } else if (item.type === 'card') {
                return (
                  <Card
                    key={item.id}
                    title={item.name}
                    content={item.content}
                    content2={item.content2}
                    backgroundColor={item.backgroundColor}
                    click={item.click}
                    style={{ paddingLeft }}
                  />
                );
              }
              return null;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default App;