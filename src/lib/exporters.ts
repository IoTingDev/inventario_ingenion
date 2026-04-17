import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { InventoryItem } from "@/data/inventory";
import { fmtCurrency, fmtDate } from "./format";

export function exportToExcel(items: InventoryItem[], filename = "inventario-ioting.xlsx") {
  const rows = items.map((i) => ({
    Código: i.codigo,
    Módulo: i.modulo,
    Nombre: i.nombre,
    Categoría: i.categoria,
    Subcategoría: i.subcategoria,
    Marca: i.marca,
    Modelo: i.modelo,
    "N° Serie": i.numeroSerie,
    Voltaje: i.voltaje ?? "",
    Potencia: i.potencia ?? "",
    Comunicación: i.comunicacion ?? "",
    Proveedor: i.proveedor,
    "Costo Unit.": i.costoUnitario,
    Cantidad: i.cantidad,
    "Stock Mín.": i.stockMinimo,
    Ubicación: i.ubicacion,
    Responsable: i.responsable,
    Estado: i.estado,
    Proyecto: i.proyectoAsignado ?? "",
    Área: i.areaAsignada ?? "",
    "Fecha Compra": i.fechaCompra,
    "Fecha Ingreso": i.fechaIngreso,
    "Última Act.": i.fechaActualizacion,
    Observaciones: i.observaciones ?? "",
    Etiquetas: i.etiquetas.join(", "),
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inventario");
  XLSX.writeFile(wb, filename);
}

export function exportToPDF(items: InventoryItem[], filename = "inventario-ioting.pdf") {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  doc.setFontSize(16);
  doc.setTextColor(20, 60, 130);
  doc.text("IoTing — Reporte de Inventario", 40, 40);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado: ${new Date().toLocaleString("es-MX")}`, 40, 58);
  doc.text(`Total registros: ${items.length}`, 40, 72);

  autoTable(doc, {
    startY: 90,
    head: [["Código", "Nombre", "Categoría", "Marca/Modelo", "Cant.", "Stock Mín.", "Estado", "Ubicación", "Costo"]],
    body: items.map((i) => [
      i.codigo,
      i.nombre,
      `${i.categoria} / ${i.subcategoria}`,
      `${i.marca} ${i.modelo}`,
      i.cantidad,
      i.stockMinimo,
      i.estado,
      i.ubicacion,
      fmtCurrency(i.costoUnitario * i.cantidad),
    ]),
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [20, 80, 180], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 246, 252] },
    margin: { left: 40, right: 40 },
  });

  doc.save(filename);
}
