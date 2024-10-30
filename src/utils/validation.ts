export const validatePublication = (pub) => {
  const newErrors = [];
  if (!pub.tipoPublicacion) newErrors.push('Selecciona una opción en el campo "¿Qué desea hacer?"');
  if (!pub.tipoInmueble) newErrors.push('Selecciona una opción en el campo "¿Qué tipo de inmueble es?"');
  if (!pub.ubicacion.municipio) newErrors.push('Ingresa el municipio en el campo "¿En qué municipio se encuentra?"');
  if (!pub.ubicacion.direccion) newErrors.push('Ingresa la dirección en el campo "¿Cuál es la dirección?"');
  if (!pub.area.valor || pub.area.valor === '0') newErrors.push('Ingresa el área en el campo "¿Cuál es el área del inmueble?"');
  if (!pub.precio || pub.precio === '0') newErrors.push('Ingresa el precio en el campo "¿Cuál es el precio del inmueble?"');
  if (!pub.detalles || pub.detalles.length < 10) newErrors.push('Ingresa una descripción adicional de al menos 10 caracteres');
  if (!pub.imagenes.length) newErrors.push('Debes seleccionar al menos una imagen del inmueble');

  return newErrors;
};
