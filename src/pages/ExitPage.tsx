import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 

interface ExitState {
  prizeName: string;
  photoUrl: string;
}

const ExitPage = () => {
  const navigate = useNavigate(); 
  const location = useLocation();
  
  // Leemos el estado de navegación. Si no existe, será 'null'.
  const state = location.state as ExitState | null;

  const [prizeName, setPrizeName] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // 💡 useEffect para establecer los datos y manejar la persistencia
  useEffect(() => {
    let finalPrizeName = null;
    let finalPhotoUrl = null;

    // 1. Intentar leer del estado de navegación (primera carga)
    if (state && state.prizeName) {
      finalPrizeName = state.prizeName;
      finalPhotoUrl = state.photoUrl;
    } else {
      // 2. Si el estado no existe (ej: recarga F5), leer de localStorage
      const storedPrize = localStorage.getItem("prizeName");
      const storedPhoto = localStorage.getItem("photoUrl");

      if (storedPrize) {
        finalPrizeName = storedPrize;
        finalPhotoUrl = storedPhoto;
      }
    }
    
    // 3. Establecer el estado del componente
    if (finalPrizeName) {
      setPrizeName(finalPrizeName);
      setPhotoUrl(finalPhotoUrl);
    } else {
      // Si no hay datos en ningún lado
      setPrizeName("¡Gracias por participar! Contacta a la tienda para más detalles.");
    }
  }, [location.state]); // Dependencia del state para reaccionar a la navegación

  // Función para volver al inicio
  const handleGoHome = () => {
    // 4. Limpiar los datos persistentes ANTES de salir
    localStorage.removeItem("prizeName");
    localStorage.removeItem("photoUrl");
    
    navigate('/'); 
  };

  return (
    // ... Tu JSX con {prizeName} y {photoUrl} queda perfecto aquí
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6 border-4 border-red-600 text-center">
        
        {/* Ícono de Confirmación */}
        {/* ... (SVG de confirmación) ... */}

        <h1 className="text-4xl font-black text-red-600">
          ¡Felicidades!
        </h1>
        <p className="text-lg text-gray-700 font-semibold">
          Tu registro ha sido completado con éxito.
        </p>

        {/* Bloque del Premio Destacado */}
        <div className="p-5 bg-red-100/50 rounded-xl border border-red-300 shadow-inner">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest">
            Has ganado:
          </h2>
          <p className="text-4xl font-extrabold text-red-700 mt-1">
            {/* Mostrar el estado actualizado */}
            {prizeName} 
          </p>
          
          {/* Foto Registrada */}
          {photoUrl && (
            <img 
              src={photoUrl} 
              alt="Foto registrada" 
              className="mt-6 mx-auto rounded-lg shadow-xl border-2 border-red-400 max-h-56 object-cover w-full" 
            />
          )}
        </div>
        
        <p className="text-sm text-gray-600 pt-2">
          ¡Un encargado de la tienda te contactará pronto para coordinar la entrega de tu premio!
        </p>
        
        {/* Botón de Acción */}
        <button
          onClick={handleGoHome}
          className="bg-red-600 text-white font-bold p-3 w-full rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md transform hover:scale-[1.01]"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};


export default ExitPage;