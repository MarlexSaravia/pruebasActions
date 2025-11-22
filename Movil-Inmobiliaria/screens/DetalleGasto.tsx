import React from "react";
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView } from "react-native";
import { base } from "../styles/base";
import { Gasto } from "./Inicio";

const DetalleGasto = ({ route, navigation }: any) => {
  // Recibe el gasto específico sobre el que se hizo clic
  const { gasto }: { gasto: Gasto } = route.params;

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case "Aprobado": return base.Aprobado;
      case "Pendiente": return base.Pendiente;
      case "Rechazado": return base.Rechazado;
      default: return {};
    }
  };

  return (
    <SafeAreaView style={base.container}>
      <ScrollView>
        <View style={base.containerInterno}>
          <Text style={base.titulos}>Detalle del Gasto</Text>
          <View style={base.linea} />

          <View style={{ backgroundColor: '#0e1628', padding: 20, borderRadius: 15, marginTop: 15 }}>
            <View style={base.detalleRow}>
              <Text style={base.detalleLabel}>Descripción:</Text>
              <Text style={base.detalleValor}>{gasto.descripcion}</Text>
            </View>

            <View style={base.detalleRow}>
              <Text style={base.detalleLabel}>Monto:</Text>
              <Text style={[base.detalleValor, { fontSize: 20, fontWeight: 'bold' }]}>S/ {gasto.monto}</Text>
            </View>

            <View style={base.detalleRow}>
              <Text style={base.detalleLabel}>Fecha:</Text>
              <Text style={base.detalleValor}>{gasto.fecha}</Text>
            </View>

            <View style={base.detalleRow}>
              <Text style={base.detalleLabel}>Estado:</Text>
              <View style={[getEstadoStyle(gasto.estado), { paddingVertical: 5, paddingHorizontal: 15, borderRadius: 20 }]}>
                <Text style={base.textoSimpleBlanco}>{gasto.estado}</Text>
              </View>
            </View>
            
            <View style={base.linea} />

            <Text style={[base.subtitulos, { textAlign: 'center', marginBottom: 10 }]}>Comprobante:</Text>
            {gasto.comprobante ? (
              <Image
                source={{ uri: gasto.comprobante }}
                style={{ width: '100%', height: 240, alignSelf: "center", borderRadius: 10, resizeMode: 'contain' }}
              />
            ) : (
              <Text style={base.textoSimple}>No se adjuntó comprobante.</Text>
            )}
          </View>

          <TouchableOpacity
            style={[base.botones_Principal, { marginTop: 30, backgroundColor: '#1f2937' }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={base.textoSimpleBlanco}> ← Volver al Historial</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetalleGasto;
