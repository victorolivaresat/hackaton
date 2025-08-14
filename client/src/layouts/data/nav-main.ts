
import { 
  PieChart, 
  Settings2, 
} from "lucide-react";

const navMain = [

  {
    title: "Dashboard",
    icon: PieChart,
    url: "/dashboard",
    isActive: true,
    items: [
      { title: "Resumen General", url: "/dashboard" },
    ],
  },

  {
    title: "Administración",
    icon: Settings2,
    url: "/users",
    items: [
      { title: "Gestión de Usuarios", url: "/users" },
      { title: "Roles y Accesos", url: "/roles" },
      { title: "Permisos del Sistema", url: "/permissions" },
      { title: "Módulos de Sistema", url: "/modules" },
    ],
  },

];

export default navMain;
