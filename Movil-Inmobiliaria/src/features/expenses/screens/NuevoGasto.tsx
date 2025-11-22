import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { base } from "../../../shared/styles/base";
import { Gasto } from "../../dashboard/screens/Inicio";

interface Props {
  onGuardar: (gasto: Gasto) => void;
}

const NuevoGasto = ({ onGuardar }: Props) => {
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");

  const guardar = () => {
    if (!descripcion || !monto) return;
    const nuevo: Gasto = {
      id: Date.now().toString(),
      fecha: new Date().toISOString().split("T")[0],
      descripcion,
      monto,
      estado: "Pendiente",
    };
    onGuardar(nuevo);
    setDescripcion("");
    setMonto("");
    setCategoria("");
  };

  return (
    <View>
      <Text style={base.subtitulos}>Descripción</Text>
      <TextInput
        style={base.textoSimpleBlanco}
        placeholder="Ej: Almuerzo con cliente"
        placeholderTextColor="#707e90"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <Text style={base.subtitulos}>Monto</Text>
      <TextInput
        style={base.textoSimpleBlanco}
        placeholder="Ej: 45.00"
        placeholderTextColor="#707e90"
        keyboardType="numeric"
        value={monto}
        onChangeText={setMonto}
      />

      <Text style={base.subtitulos}>Categoría</Text>
      <TextInput
        style={base.textoSimpleBlanco}
        placeholder="Transporte / Alimentación / Compras"
        placeholderTextColor="#707e90"
        value={categoria}
        onChangeText={setCategoria}
      />

      <TouchableOpacity style={[base.botones_Principal, { marginTop: 15 }]} onPress={guardar}>
        <Text style={base.textoSimpleBlanco}>Guardar Gasto</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NuevoGasto;
