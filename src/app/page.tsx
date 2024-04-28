import { Plantilla } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generar Publicación | Inmobiliaria",
  description: "Genera publicaciones de inmuebles de forma rápida y sencilla para compartir en redes sociales.",
  openGraph: {
    title: "Generar Publicación | Inmobiliaria",
    description: "Genera publicaciones de inmuebles de forma rápida y sencilla para compartir en redes sociales.",
  },
};

export default function Home() {
  return (
    <div className="container main-page">
      <h1>Crear publicación</h1>
      <Plantilla />
    </div>
  );
}
