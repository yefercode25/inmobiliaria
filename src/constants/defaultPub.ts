import { PubInfo } from '@/types/PubInfo';

export const defaultPub: PubInfo = {
  tipoPublicacion: '',
  tipoInmueble: '',
  ubicacion: {
    municipio: '',
    direccion: '',
    distancia: '',
  },
  area: {
    valor: '',
  },
  precio: '',
  detalles: '',
  imagenes: [],
};
