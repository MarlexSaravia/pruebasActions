import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { base } from "../../../shared/styles/base";
import { useUser } from "../../auth/context/UserContext";

interface InformacionPersonalProps {
  onVolver: () => void;
}

export default function InformacionPersonal({ onVolver }: InformacionPersonalProps) {
  const [editando, setEditando] = useState(false);
  const { userData, updateUserData } = useUser();

  if (!userData) {
    return (
      <View style={base.container}>
        <Text style={[base.textoSimpleBlanco, { textAlign: "center", marginTop: 100 }]}>
          Cargando datos del usuario...
        </Text>
      </View>
    );
  }

  const [nombre, setNombre] = useState(userData.nombre);
  const [dni, setDni] = useState(userData.dni);
  const [genero, setGenero] = useState(userData.genero);
  const [edad, setEdad] = useState(String(userData.edad));
  const [telefono, setTelefono] = useState(userData.telefono);
  const [correo, setCorreo] = useState(userData.correo);
  const [direccion, setDireccion] = useState(userData.direccion);

  useEffect(() => {
    setNombre(userData.nombre);
    setDni(userData.dni);
    setGenero(userData.genero);
    setEdad(String(userData.edad));
    setTelefono(userData.telefono);
    setCorreo(userData.correo);
    setDireccion(userData.direccion);
  }, [userData]);

  const handleGuardar = () => {
    updateUserData({
      nombre,
      dni,
      genero,
      edad: Number(edad),
      telefono,
      correo,
      direccion,
    });
    Alert.alert("Éxito", "Los cambios se guardaron correctamente.");
    setEditando(false);
  };

  const handleCancelar = () => {
    setNombre(userData.nombre);
    setDni(userData.dni);
    setGenero(userData.genero);
    setEdad(String(userData.edad));
    setTelefono(userData.telefono);
    setCorreo(userData.correo);
    setDireccion(userData.direccion);
    setEditando(false);
  };

  return (
    <View style={base.container}>
      <View style={base.containerInterno}>
        {/* Encabezado */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}>
          <TouchableOpacity onPress={onVolver} style={{ padding: 10 }}>
            <Text style={{ fontSize: 18, color: "#0da3a4", fontWeight: "bold" }}>‹ Volver</Text>
          </TouchableOpacity>

          <Text style={[base.titulos, { flex: 1, textAlign: "center" }]}>
            Información Personal
          </Text>

          {!editando && (
            <TouchableOpacity
              onPress={() => setEditando(true)}
              style={{
                padding: 10,
                backgroundColor: "#0da3a4",
                borderRadius: 8,
                paddingHorizontal: 15,
              }}
            >
              <Text style={{ fontSize: 14, color: "#fff", fontWeight: "bold" }}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={base.linea} />

        <ScrollView style={{ paddingHorizontal: 10 }} showsVerticalScrollIndicator={false}>
          {/* Sección principal */}
          <View style={{ paddingVertical: 10 }}>
            <Text style={base.subtitulos}>Datos Personales</Text>

            {[
              { label: "Nombre", value: nombre, setter: setNombre },
              { label: "DNI", value: dni, setter: setDni, keyboardType: "numeric" },
              { label: "Género", value: genero, setter: setGenero },
              { label: "Edad", value: edad, setter: setEdad, keyboardType: "numeric" },
              { label: "Teléfono", value: telefono, setter: setTelefono, keyboardType: "phone-pad" },
              { label: "Correo", value: correo, setter: setCorreo, keyboardType: "email-address" },
              { label: "Dirección", value: direccion, setter: setDireccion },
              { label: "Área", value: userData.area },
              { label: "Rol", value: userData.rol },
            ].map((campo, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#172139",
                  borderRadius: 10,
                  padding: 15,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "#707e90",
                    marginBottom: 5,
                    fontWeight: "500",
                  }}
                >
                  {campo.label}
                </Text>

                {editando && campo.setter ? (
                  <TextInput
                    style={{
                      fontSize: 16,
                      color: "#fff",
                      fontWeight: "600",
                      borderBottomWidth: 1,
                      borderBottomColor: "#0da3a4",
                      paddingVertical: 5,
                    }}
                    value={campo.value}
                    onChangeText={campo.setter}
                    keyboardType={campo.keyboardType as any}
                    placeholderTextColor="#707e90"
                  />
                ) : (
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#fff",
                      fontWeight: "600",
                    }}
                  >
                    {campo.value}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Botones */}
          {editando && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
                gap: 10,
              }}
            >
              <TouchableOpacity
                onPress={handleCancelar}
                style={{
                  flex: 1,
                  padding: 15,
                  borderRadius: 10,
                  alignItems: "center",
                  backgroundColor: "#707e90",
                }}
              >
                <Text style={{ fontSize: 16, color: "#fff", fontWeight: "bold" }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleGuardar}
                style={{
                  flex: 1,
                  padding: 15,
                  borderRadius: 10,
                  alignItems: "center",
                  backgroundColor: "#0da3a4",
                }}
              >
                <Text style={{ fontSize: 16, color: "#fff", fontWeight: "bold" }}>
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </View>
  );
}
