import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, Animated, Image } from "react-native";
import { base } from "../styles/base";
import Gastos from "./Gastos";
import NuevoGasto from "./NuevoGasto";

export interface Gasto {
  id: string;
  fecha: string;
  descripcion: string;
  monto: string;
  estado: "Aprobado" | "Pendiente" | "Rechazado";
  comprobante?: string;
}

interface InicioProps {
  gastos: Gasto[];
  agregarGasto: (gasto: Gasto) => Gasto;
}

export default function Inicio({ gastos, agregarGasto }: InicioProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmacionVisible, setConfirmacionVisible] = useState(false);
  const [animacion] = useState(new Animated.Value(0));
  const [ultimoGasto, setUltimoGasto] = useState<Gasto | null>(null);

  const handleAgregarGasto = (nuevoGasto: Gasto) => {
    const gastoAgregado = agregarGasto(nuevoGasto);
    setUltimoGasto(gastoAgregado);
    setModalVisible(false);
    mostrarConfirmacion();
  };

  const mostrarConfirmacion = () => {
    setConfirmacionVisible(true);
    Animated.timing(animacion, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    setTimeout(() => {
      Animated.timing(animacion, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setConfirmacionVisible(false);
      });
    }, 3000);
  };

  return (
    <View style={base.container}>
        <View style={base.containerInterno}>
            <Text style={base.titulos}>Mis Gastos</Text>
            <View style={base.linea} />

            <Gastos gastos={gastos.slice(0, 3)} onAddPress={() => setModalVisible(true)} />
            
            <TouchableOpacity style={[ base.contenedorNaranja, { position: "absolute", bottom: 25, right: 25, borderRadius: 50, width: 55, height: 55, alignItems: "center", justifyContent: "center", } ]} onPress={() => setModalVisible(true)} >
                 <Text style={{ color: "#fff", fontSize: 30, textAlign: "center"}}>+</Text>
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" }}>
                <View style={[ base.containerInterno, { width: "90%", padding: 20, backgroundColor: "#0b1220", borderRadius: 15, maxHeight: "85%" } ]}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={base.titulos}>Registrar Gasto</Text>
                    <NuevoGasto onGuardar={handleAgregarGasto} />
                    <TouchableOpacity style={[base.botones_Principal, { marginTop: 20, backgroundColor: '#374151' }]} onPress={() => setModalVisible(false)}>
                      <Text style={base.textoSimpleBlanco}>Cerrar</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>
            </Modal>
            
            {confirmacionVisible && ultimoGasto && (
                <Animated.View style={{ position: "absolute", bottom: 100, left: 0, right: 0, alignItems: "center", opacity: animacion, transform: [ { translateY: animacion.interpolate({ inputRange: [0, 1], outputRange: [50, 0], }), }, ], }} >
                    <View style={[ base.containerInterno, { width: "85%", backgroundColor: "#034b38", borderRadius: 20, padding: 15, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 5, }, ]} >
                        <Text style={[base.subtitulos, { color: "#fff" }]}>✅ Gasto Registrado</Text>
                        <Text style={base.textoSimpleBlanco}>{ultimoGasto.descripcion}</Text>
                        <Text style={base.textoSimpleBlanco}>Monto: S/ {ultimoGasto.monto}</Text>
                        <View style={{ marginTop: 8, backgroundColor: "#ab7640", borderRadius: 20, paddingHorizontal: 15, paddingVertical: 5, }} >
                            <Text style={base.textoSimpleBlanco}>{ultimoGasto.estado}</Text>
                        </View>
                        {ultimoGasto.comprobante && <Image source={{ uri: ultimoGasto.comprobante }} style={{ width: 180, height: 110, borderRadius: 10, marginTop: 10, }} />}
                    </View>
                </Animated.View>
            )}
        </View>
    </View>
  );
}