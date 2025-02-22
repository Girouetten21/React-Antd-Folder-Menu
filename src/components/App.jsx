import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import Card from './Card';
import FolderCard from './FolderCard';
import DataMenu from '../data/DataMenu.jsx';
import UserProfile from './UserProfile.jsx';
import profileImage from '../assets/profile_user.jpg';
import '../css/App.css';
import '../css/customAntd.css';

const App = () => {
  const [selectedContent, setSelectedContent] = useState(''); // Inicialmente vacío
  const [displayedItems, setDisplayedItems] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(DataMenu[0]); // Estado para la carpeta seleccionada

  useEffect(() => {
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
          setSelectedContent(currentFolder.content || currentFolder.category || '');
        },
      };

      // Ejecutar la función correspondiente según el tipo
      contentMap[type]?.();
    }
  }, [currentFolder]); // Eliminar loading como dependencia

  const handleSelect = (item) => {
    // Aplicar el nuevo elemento seleccionado
    setCurrentFolder(item);
  };

  const handleCategorySelect = (category) => {
    // Filtrar los elementos según la categoría seleccionada
    const filteredItems = DataMenu.flatMap(folder => 
      folder.subfolders ? folder.subfolders.filter(item => item.category === category.name) : []
    );
    setDisplayedItems(filteredItems); // Actualizar el estado de displayedItems
    setSelectedContent(`Categoría seleccionada: ${category.name}`); // Establecer el contenido seleccionado
    setCurrentFolder(0); // Deseleccionar cualquier carpeta previamente seleccionada
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
      <div className="bar-container">
        <div className='user-container'>
          <UserProfile name="Marcos Pereira" username="girouetten21" imageUrl={profileImage}/>
        </div>
        <div className="content-container-title">
          <h1>Contenido</h1>
          <p>{selectedContent}</p>
        </div>
      </div>
      <div className="menu-container">
        <Menu 
          folders={DataMenu} // Usar el contenido importado
          onFolderSelect={handleSelect} // Usar el manejador unificado
          currentFolder={currentFolder} // Pasar el objeto de la carpeta actual
          onCategorySelect={handleCategorySelect} // Pasar el manejador de selección de categorías
        />
      </div>
      <div className="content-container">
        <div className="card-container">
          {displayedItems.map(item => {
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
                  category={item.category}
                  backgroundColor={item.backgroundColor}
                  click={item.click}
                  style={{ paddingLeft }}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default App;