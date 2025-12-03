import { useEffect, useState } from 'react';
// Si estás usando React Router DOM, usa el hook 'useNavigate'
import { useNavigate } from 'react-router-dom'; 

const ExitPage = () => {
  const [prizeName, setPrizeName] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  // Eliminamos claimLog ya que era solo para depuración y era visible.
  
  // Usar useNavigate si tienes React Router DOM, si no, elimina esta línea
  const navigate = useNavigate(); 

  useEffect(() => {
    // 1. Recuperar datos usando la clave CORRECTA: "prizeName"
    const storedPrize = localStorage.getItem("prizeName");
    const storedPhoto = localStorage.getItem("photoUrl");
    
    // Eliminamos la lectura de "claimResponse"
    // const storedResponse = localStorage.getItem("claimResponse"); 

    // 2. Procesar Premio
    if (storedPrize) {
      setPrizeName(storedPrize);
      // 💡 NOTA: Por ahora, comentamos la eliminación para asegurar que el premio se vea.
      // Si el premio aparece, puedes intentar eliminarlo de nuevo o usar la solución de 'navigate state'.
      // localStorage.removeItem("prizeName"); 
    } else {
      setPrizeName("¡Gracias por participar! Contacta a la tienda para más detalles.");
    }

    // 3. Procesar Foto
    if (storedPhoto) {
      setPhotoUrl(storedPhoto);
      // localStorage.removeItem("photoUrl"); // También lo comentamos
    }
  }, []);

  // Función para volver al inicio usando el router (si usas 'navigate')
  const handleGoHome = () => {
    // Limpieza final antes de salir
    localStorage.removeItem("prizeName");
    localStorage.removeItem("photoUrl");
    
    // Usa navigate o window.location.href dependiendo de tu configuración
    navigate('/'); 
  };

  return (
    // Hemos revertido el estilo a la versión de Coca-Cola que te gustaba para mantener la consistencia
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6 border-4 border-red-600 text-center">
        
        {/* Ícono de Confirmación (Estilo Coca-Cola) */}
        <svg
          className="mx-auto h-16 w-16 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>

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
            {/* Si prizeName es nulo, usará el valor de useState */}
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
        
        {/* Botón de Acción (Rojo Coca-Cola) */}
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