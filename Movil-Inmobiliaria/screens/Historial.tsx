import React, { useState, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Modal } from "react-native";
import { base } from "../styles/base";
import { Gasto } from "./Inicio";
import { useNavigation } from '@react-navigation/native';

// --- Componente GastoItem (sin cambios) ---
const GastoItem = ({ item }: { item: Gasto }) => {
    const navigation = useNavigation<any>();
    const getEmoji = (desc: string) => {
        const d = desc.toLowerCase();
        if (d.includes("transporte")) return "🚗";
        if (d.includes("almuerzo") || d.includes("comida")) return "🍔";
        if (d.includes("compra") || d.includes("tornillos")) return "🛠️";
        if (d.includes("suministros")) return "📦";
        if (d.includes("mantenimiento")) return "🔧";
        return "💸";
    };
    const getEstadoStyle = (estado: Gasto["estado"]) => {
        switch (estado) {
            case "Aprobado": return base.Aprobado;
            case "Pendiente": return base.Pendiente;
            case "Rechazado": return base.Rechazado;
            default: return {};
        }
    };
    return (
        <TouchableOpacity onPress={() => navigation.navigate('DetalleGasto', { gasto: item })}>
            <View style={{ backgroundColor: "#0e1628", borderRadius: 18, paddingVertical: 22, paddingHorizontal: 18, marginBottom: 14, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#172139", }}>
                <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: "#172139", alignItems: "center", justifyContent: "center", marginRight: 18, }}>
                    <Text style={{ fontSize: 24 }}>{getEmoji(item.descripcion)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[base.textoSimpleBlanco, { fontWeight: "700", fontSize: 16 }]}>S/ {item.monto}</Text>
                    <Text style={[base.textoSimple, { color: "#9ca3af", marginTop: 5, fontSize: 13, flexShrink: 1, }]}>
                        {item.descripcion} • {item.fecha}
                    </Text>
                </View>
                <View style={[getEstadoStyle(item.estado), { height: 36, borderRadius: 25, alignItems: "center", justifyContent: "center", paddingHorizontal: 15 }]}>
                    <Text style={[base.textoSimpleBlanco, { fontSize: 13 }]} numberOfLines={1}>{item.estado}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};


// --- Componente Principal Historial (con cambios) ---
interface HistorialProps {
  gastos: Gasto[];
}
type FiltroEstado = "Todos" | "Aprobado" | "Pendiente" | "Rechazado";
// Nuevas opciones para el filtro de tiempo
type FiltroTiempo = "Siempre" | "Últimos 7 días" | "Últimos 30 días" | "Últimos 3 meses" | "Este Año";

export default function Historial({ gastos }: HistorialProps) {
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("Todos");
  const [filtroTiempo, setFiltroTiempo] = useState<FiltroTiempo>("Siempre");
  // Nuevo estado para controlar la visibilidad del modal
  const [modalVisible, setModalVisible] = useState(false);
  
  const gastosFiltrados = useMemo(() => {
    const ahora = new Date();
    
    // Lógica de filtrado de tiempo actualizada
    const gastosPorTiempo = gastos.filter(gasto => {
      const fechaGasto = new Date(gasto.fecha);
      
      switch (filtroTiempo) {
        case 'Últimos 7 días':
          const hace7Dias = new Date();
          hace7Dias.setDate(ahora.getDate() - 7);
          return fechaGasto >= hace7Dias;
        
        case 'Últimos 30 días':
          const hace30Dias = new Date();
          hace30Dias.setDate(ahora.getDate() - 30);
          return fechaGasto >= hace30Dias;

        case 'Últimos 3 meses':
          const hace3Meses = new Date();
          hace3Meses.setMonth(ahora.getMonth() - 3);
          return fechaGasto >= hace3Meses;

        case 'Este Año':
          return fechaGasto.getFullYear() === ahora.getFullYear();
        
        case 'Siempre':
        default:
          return true;
      }
    });

    if (filtroEstado === "Todos") return gastosPorTiempo;
    return gastosPorTiempo.filter(gasto => gasto.estado === filtroEstado);

  }, [gastos, filtroEstado, filtroTiempo]);

  const filtrosDeEstado: FiltroEstado[] = ["Todos", "Aprobado", "Pendiente", "Rechazado"];
  const filtrosDeTiempo: FiltroTiempo[] = ["Siempre", "Últimos 7 días", "Últimos 30 días", "Últimos 3 meses", "Este Año"];

  const seleccionarFiltroTiempo = (filtro: FiltroTiempo) => {
    setFiltroTiempo(filtro);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={base.container}>
      <View style={base.containerInterno}>
        <Text style={base.titulos}>Historial Completo</Text>
        <View style={base.linea} />

        {/* --- Botón para abrir el Modal de Filtro de Tiempo --- */}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={base.botonDesplegable}>
            <Text style={base.textoSimpleBlanco}>Filtrar por tiempo: </Text>
            <Text style={base.textoDesplegableActivo}>{filtroTiempo}</Text>
        </TouchableOpacity>

        {/* --- Filtros de Estado (sin cambios) --- */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 }}>
          {filtrosDeEstado.map((filtro) => (
            <TouchableOpacity
              key={filtro}
              onPress={() => setFiltroEstado(filtro)}
              style={[{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, }, filtroEstado === filtro ? base.botonActivo : base.botonInactivo]}
            >
              <Text style={base.textoSimpleBlanco}>{filtro}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <FlatList
            data={gastosFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <GastoItem item={item} />}
            contentContainerStyle={{ paddingBottom: 150 }}
            ListEmptyComponent={
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                    <Text style={{ color: '#707e90', fontSize: 16 }}>No hay gastos que coincidan.</Text>
                </View>
            }
        />
      </View>

      {/* --- Modal con las opciones de filtro --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={base.modalOverlay} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
            <View style={base.modalContainer}>
                {filtrosDeTiempo.map((filtro) => (
                    <TouchableOpacity key={filtro} style={base.modalOpcion} onPress={() => seleccionarFiltroTiempo(filtro)}>
                        <Text style={base.modalTextoOpcion}>{filtro}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}