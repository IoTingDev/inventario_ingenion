export type ModuleKey =
  | "laboratorio"
  | "componentes"
  | "herramientas"
  | "activos"
  | "proyectos";

export type EstadoItem = "Disponible" | "En uso" | "Mantenimiento" | "Dañado";

export interface InventoryItem {
  id: string;
  codigo: string;
  modulo: ModuleKey;
  nombre: string;
  categoria: string;
  subcategoria: string;
  descripcion: string;
  imagen?: string;
  // técnico
  marca: string;
  modelo: string;
  numeroSerie: string;
  especificaciones: string;
  voltaje?: string;
  potencia?: string;
  comunicacion?: string;
  compatibilidad?: string;
  // administrativo
  proveedor: string;
  fechaCompra: string;
  costoUnitario: number;
  cantidad: number;
  stockMinimo: number;
  ubicacion: string;
  responsable: string;
  estado: EstadoItem;
  // operativo
  proyectoAsignado?: string;
  areaAsignada?: string;
  fechaIngreso: string;
  fechaActualizacion: string;
  observaciones?: string;
  etiquetas: string[];
  proximoMantenimiento?: string;
}

export const MODULES: { key: ModuleKey; label: string; categorias: string[] }[] = [
  {
    key: "laboratorio",
    label: "Equipos de Laboratorio",
    categorias: ["Medición", "Fuentes", "Análisis", "Soldadura"],
  },
  {
    key: "componentes",
    label: "Componentes Electrónicos",
    categorias: ["Microcontroladores", "Sensores", "Actuadores", "Comunicación", "Pasivos"],
  },
  {
    key: "herramientas",
    label: "Herramientas",
    categorias: ["Manuales", "Eléctricas", "Precisión"],
  },
  {
    key: "activos",
    label: "Activos Tecnológicos",
    categorias: ["Cómputo", "Redes", "Servidores", "Periféricos"],
  },
  {
    key: "proyectos",
    label: "Proyectos en Desarrollo",
    categorias: ["IoT Industrial", "Smart City", "Manufactura 4.0", "I+D"],
  },
];

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const past = (days: number) => iso(new Date(today.getTime() - days * 86400000));
const future = (days: number) => iso(new Date(today.getTime() + days * 86400000));

export const SEED_INVENTORY: InventoryItem[] = [
  {
    id: "1", codigo: "LAB-OSC-001", modulo: "laboratorio", nombre: "Osciloscopio Digital 100MHz",
    categoria: "Medición", subcategoria: "Osciloscopio",
    descripcion: "Osciloscopio digital de 4 canales, ancho de banda 100 MHz, pantalla táctil 7\".",
    marca: "Rigol", modelo: "DS1104Z-Plus", numeroSerie: "RGL-2024-00187",
    especificaciones: "4 canales, 100 MHz, 1 GSa/s, memoria 24 Mpts",
    voltaje: "100-240 VAC", potencia: "50 W", comunicacion: "USB, LAN", compatibilidad: "UltraScope, LabVIEW",
    proveedor: "Tektronix MX", fechaCompra: past(420), costoUnitario: 18500, cantidad: 2, stockMinimo: 1,
    ubicacion: "Lab A — Mesa 3", responsable: "Ing. Laura Mendoza", estado: "En uso",
    proyectoAsignado: "Smart Grid Monitor", areaAsignada: "I+D Hardware",
    fechaIngreso: past(420), fechaActualizacion: past(7),
    observaciones: "Calibración anual programada", etiquetas: ["crítico", "calibrado"],
    proximoMantenimiento: future(45),
  },
  {
    id: "2", codigo: "COM-MCU-014", modulo: "componentes", nombre: "ESP32-WROOM-32E",
    categoria: "Microcontroladores", subcategoria: "WiFi/BLE",
    descripcion: "Módulo SoC con WiFi y Bluetooth dual-core 240 MHz para aplicaciones IoT.",
    marca: "Espressif", modelo: "ESP32-WROOM-32E", numeroSerie: "Lote-EW32E-2410",
    especificaciones: "Dual-core Xtensa LX6 240MHz, 520KB SRAM, 4MB Flash",
    voltaje: "3.3 V", potencia: "0.5 W", comunicacion: "WiFi, BT, I2C, SPI, UART, CAN",
    compatibilidad: "Arduino, ESP-IDF, MicroPython",
    proveedor: "Mouser Electronics", fechaCompra: past(60), costoUnitario: 145, cantidad: 8, stockMinimo: 20,
    ubicacion: "Almacén B — Estante 2", responsable: "Téc. Carlos Ruiz", estado: "Disponible",
    proyectoAsignado: "Sensor Network v2", areaAsignada: "Producción",
    fechaIngreso: past(60), fechaActualizacion: past(2),
    observaciones: "Stock por debajo del mínimo — reordenar", etiquetas: ["IoT", "wifi", "stock-bajo"],
  },
  {
    id: "3", codigo: "COM-SEN-027", modulo: "componentes", nombre: "Sensor BME280",
    categoria: "Sensores", subcategoria: "Ambiental",
    descripcion: "Sensor de temperatura, humedad y presión barométrica.",
    marca: "Bosch", modelo: "BME280", numeroSerie: "Lote-BME-0925",
    especificaciones: "T: -40 a 85°C, HR: 0-100%, P: 300-1100 hPa",
    voltaje: "3.3 V", potencia: "0.01 W", comunicacion: "I2C, SPI", compatibilidad: "Arduino, ESP32, RPi",
    proveedor: "Digi-Key", fechaCompra: past(90), costoUnitario: 85, cantidad: 45, stockMinimo: 15,
    ubicacion: "Almacén B — Gaveta 7", responsable: "Téc. Carlos Ruiz", estado: "Disponible",
    proyectoAsignado: "Smart City Air", areaAsignada: "I+D",
    fechaIngreso: past(90), fechaActualizacion: past(14),
    etiquetas: ["sensor", "ambiental"],
  },
  {
    id: "4", codigo: "LAB-FUE-003", modulo: "laboratorio", nombre: "Fuente DC Programable 60V/5A",
    categoria: "Fuentes", subcategoria: "DC Programable",
    descripcion: "Fuente de alimentación DC programable de doble canal.",
    marca: "Siglent", modelo: "SPD3303X-E", numeroSerie: "SGL-2023-09921",
    especificaciones: "2x 0-32V/3.2A + 1x 2.5/3.3/5V",
    voltaje: "100-240 VAC", potencia: "220 W", comunicacion: "USB, LAN",
    proveedor: "Tektronix MX", fechaCompra: past(640), costoUnitario: 9800, cantidad: 1, stockMinimo: 1,
    ubicacion: "Lab A — Mesa 1", responsable: "Ing. Laura Mendoza", estado: "Mantenimiento",
    proyectoAsignado: "—", areaAsignada: "I+D Hardware",
    fechaIngreso: past(640), fechaActualizacion: past(3),
    observaciones: "Ventilador con ruido — en revisión", etiquetas: ["mantenimiento"],
    proximoMantenimiento: future(10),
  },
  {
    id: "5", codigo: "HER-SOL-002", modulo: "herramientas", nombre: "Estación de Soldadura",
    categoria: "Eléctricas", subcategoria: "Soldadura",
    descripcion: "Estación de soldado con control digital de temperatura.",
    marca: "Hakko", modelo: "FX-888D", numeroSerie: "HK-FX-44120",
    especificaciones: "70W, 50-480°C, ESD safe",
    voltaje: "120 VAC", potencia: "70 W",
    proveedor: "Steren", fechaCompra: past(300), costoUnitario: 3200, cantidad: 3, stockMinimo: 2,
    ubicacion: "Lab B — Mesa Soldado", responsable: "Téc. Pablo Ortiz", estado: "Disponible",
    fechaIngreso: past(300), fechaActualizacion: past(20),
    etiquetas: ["esd", "soldadura"],
  },
  {
    id: "6", codigo: "ACT-PC-009", modulo: "activos", nombre: "Workstation Dell Precision",
    categoria: "Cómputo", subcategoria: "Workstation",
    descripcion: "Estación de trabajo para simulación CAD/EDA.",
    marca: "Dell", modelo: "Precision 5860", numeroSerie: "DLL-PRC-558721",
    especificaciones: "Xeon W5-2445, 64GB RAM, RTX A4000, 2TB NVMe",
    voltaje: "120 VAC", potencia: "750 W", comunicacion: "Ethernet 2.5G, WiFi 6E",
    proveedor: "Dell B2B", fechaCompra: past(180), costoUnitario: 68000, cantidad: 4, stockMinimo: 2,
    ubicacion: "Oficina Ingeniería", responsable: "Ing. Sofía León", estado: "En uso",
    proyectoAsignado: "PCB Design Hub", areaAsignada: "Ingeniería",
    fechaIngreso: past(180), fechaActualizacion: past(5),
    etiquetas: ["workstation", "cad"],
  },
  {
    id: "7", codigo: "ACT-RED-002", modulo: "activos", nombre: "Switch Industrial PoE+ 24p",
    categoria: "Redes", subcategoria: "Switch",
    descripcion: "Switch gestionado L2+ para entornos industriales.",
    marca: "Cisco", modelo: "IE-3300-24T2X", numeroSerie: "CSC-IE-887412",
    especificaciones: "24x GbE PoE+, 2x 10G SFP+, DIN rail",
    voltaje: "24 VDC", potencia: "370 W", comunicacion: "Ethernet, SNMP",
    proveedor: "CDW", fechaCompra: past(220), costoUnitario: 42000, cantidad: 2, stockMinimo: 1,
    ubicacion: "Rack Principal — U12", responsable: "Ing. Daniel Vega", estado: "En uso",
    proyectoAsignado: "Planta Piloto 4.0", areaAsignada: "Infraestructura",
    fechaIngreso: past(220), fechaActualizacion: past(1),
    etiquetas: ["red", "industrial", "poe"],
  },
  {
    id: "8", codigo: "PRY-IOT-011", modulo: "proyectos", nombre: "Plataforma OEE Industrial",
    categoria: "Manufactura 4.0", subcategoria: "Software + Edge",
    descripcion: "Sistema de monitoreo OEE con gateways edge y dashboard cloud.",
    marca: "Interno", modelo: "OEE-Edge v1.2", numeroSerie: "PRY-OEE-001",
    especificaciones: "Gateways ESP32 + Node-RED + InfluxDB + Grafana",
    comunicacion: "MQTT, OPC-UA, Modbus TCP",
    proveedor: "—", fechaCompra: past(120), costoUnitario: 250000, cantidad: 1, stockMinimo: 1,
    ubicacion: "Cliente: Planta Querétaro", responsable: "Ing. Andrea Salas", estado: "En uso",
    proyectoAsignado: "OEE Querétaro", areaAsignada: "Servicios",
    fechaIngreso: past(120), fechaActualizacion: past(2),
    observaciones: "Fase 2: integración SAP", etiquetas: ["proyecto", "OEE", "edge"],
  },
  {
    id: "9", codigo: "COM-ACT-005", modulo: "componentes", nombre: "Relé de Estado Sólido 40A",
    categoria: "Actuadores", subcategoria: "Relé",
    descripcion: "SSR para control de cargas industriales.",
    marca: "Fotek", modelo: "SSR-40DA", numeroSerie: "Lote-SSR-0824",
    especificaciones: "Entrada 3-32 VDC, salida 24-380 VAC, 40A",
    voltaje: "3-32 VDC / 24-380 VAC", potencia: "—",
    proveedor: "Steren", fechaCompra: past(150), costoUnitario: 220, cantidad: 12, stockMinimo: 5,
    ubicacion: "Almacén B — Estante 4", responsable: "Téc. Carlos Ruiz", estado: "Disponible",
    fechaIngreso: past(150), fechaActualizacion: past(30),
    etiquetas: ["actuador", "industrial"],
  },
  {
    id: "10", codigo: "HER-MAN-018", modulo: "herramientas", nombre: "Multímetro de Precisión",
    categoria: "Precisión", subcategoria: "Multímetro",
    descripcion: "Multímetro RMS verdadero, 6.5 dígitos.",
    marca: "Fluke", modelo: "8846A", numeroSerie: "FLK-8846-22019",
    especificaciones: "6.5 dígitos, V/A/Ω/Hz/Cap, 1000V",
    voltaje: "100-240 VAC", potencia: "25 W", comunicacion: "USB, LAN, RS-232",
    proveedor: "Fluke MX", fechaCompra: past(900), costoUnitario: 28500, cantidad: 1, stockMinimo: 1,
    ubicacion: "Lab A — Cabina Cal.", responsable: "Ing. Laura Mendoza", estado: "Disponible",
    fechaIngreso: past(900), fechaActualizacion: past(60),
    etiquetas: ["calibrado", "precisión"],
    proximoMantenimiento: future(120),
  },
  {
    id: "11", codigo: "COM-COM-031", modulo: "componentes", nombre: "Módulo LoRa SX1276",
    categoria: "Comunicación", subcategoria: "LoRa",
    descripcion: "Módulo LoRa 915 MHz para comunicación de largo alcance.",
    marca: "HopeRF", modelo: "RFM95W", numeroSerie: "Lote-LRA-0125",
    especificaciones: "868/915 MHz, -148 dBm sensibilidad",
    voltaje: "3.3 V", potencia: "0.5 W", comunicacion: "SPI, LoRa",
    proveedor: "Mouser Electronics", fechaCompra: past(45), costoUnitario: 320, cantidad: 3, stockMinimo: 10,
    ubicacion: "Almacén B — Gaveta 12", responsable: "Téc. Carlos Ruiz", estado: "Disponible",
    proyectoAsignado: "AgroSense", areaAsignada: "I+D",
    fechaIngreso: past(45), fechaActualizacion: past(4),
    observaciones: "Stock crítico", etiquetas: ["lora", "stock-bajo"],
  },
  {
    id: "12", codigo: "ACT-SRV-001", modulo: "activos", nombre: "Servidor Rack Edge",
    categoria: "Servidores", subcategoria: "Edge",
    descripcion: "Servidor edge para procesamiento local IoT.",
    marca: "HPE", modelo: "EL8000 ProLiant", numeroSerie: "HPE-EL-99812",
    especificaciones: "Xeon Silver 4314, 128GB RAM, 4TB SSD",
    voltaje: "200-240 VAC", potencia: "1100 W", comunicacion: "10GbE, iLO",
    proveedor: "HPE Partner", fechaCompra: past(75), costoUnitario: 185000, cantidad: 1, stockMinimo: 1,
    ubicacion: "Datacenter — Rack 2", responsable: "Ing. Daniel Vega", estado: "En uso",
    proyectoAsignado: "Edge Cluster", areaAsignada: "Infraestructura",
    fechaIngreso: past(75), fechaActualizacion: past(6),
    etiquetas: ["edge", "servidor"],
    proximoMantenimiento: future(20),
  },
  {
    id: "13", codigo: "LAB-ANA-007", modulo: "laboratorio", nombre: "Analizador Lógico 16ch",
    categoria: "Análisis", subcategoria: "Lógico",
    descripcion: "Analizador lógico USB de 16 canales para depuración digital.",
    marca: "Saleae", modelo: "Logic Pro 16", numeroSerie: "SAL-LP16-3318",
    especificaciones: "16 canales digitales, 500 MS/s, 100 MHz",
    voltaje: "5 V (USB)", potencia: "2.5 W", comunicacion: "USB 3.0",
    proveedor: "Saleae", fechaCompra: past(380), costoUnitario: 22000, cantidad: 1, stockMinimo: 1,
    ubicacion: "Lab A — Mesa 2", responsable: "Ing. Laura Mendoza", estado: "Disponible",
    fechaIngreso: past(380), fechaActualizacion: past(15),
    etiquetas: ["depuración", "digital"],
  },
  {
    id: "14", codigo: "PRY-CTY-004", modulo: "proyectos", nombre: "Smart City Lighting",
    categoria: "Smart City", subcategoria: "Iluminación",
    descripcion: "Red de luminarias inteligentes con telemetría LoRaWAN.",
    marca: "Interno", modelo: "SCL-v2", numeroSerie: "PRY-SCL-002",
    especificaciones: "LoRaWAN, dimming PWM, dashboard web",
    comunicacion: "LoRaWAN, MQTT",
    proveedor: "—", fechaCompra: past(200), costoUnitario: 480000, cantidad: 1, stockMinimo: 1,
    ubicacion: "Cliente: Municipio Norte", responsable: "Ing. Andrea Salas", estado: "En uso",
    proyectoAsignado: "Smart Lighting Norte", areaAsignada: "Servicios",
    fechaIngreso: past(200), fechaActualizacion: past(10),
    etiquetas: ["smart-city", "lora"],
  },
  {
    id: "15", codigo: "HER-PRE-005", modulo: "herramientas", nombre: "Microscopio Digital USB",
    categoria: "Precisión", subcategoria: "Microscopía",
    descripcion: "Microscopio para inspección de PCB.",
    marca: "Andonstar", modelo: "AD409", numeroSerie: "AND-409-7712",
    especificaciones: "10.1\" pantalla, 10-300x, 1080p",
    voltaje: "5 V", potencia: "5 W", comunicacion: "USB, HDMI",
    proveedor: "Amazon Business", fechaCompra: past(95), costoUnitario: 4500, cantidad: 1, stockMinimo: 1,
    ubicacion: "Lab B — Inspección", responsable: "Téc. Pablo Ortiz", estado: "Dañado",
    fechaIngreso: past(95), fechaActualizacion: past(8),
    observaciones: "Pantalla con líneas — pendiente reemplazo", etiquetas: ["dañado", "inspección"],
  },
];
