export interface PubInfo {
  tipoPublicacion?: string;
  tipoInmueble?: string;
  ubicacion?: {
    municipio?: string;
    direccion?: string;
    distancia?: string;
  };
  area?: {
    valor?: string;
  };
  precio?: string;
  detalles?: string;
  imagenes?: File[];
}
