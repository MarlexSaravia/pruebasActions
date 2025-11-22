import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { base } from "../../../shared/styles/base";
import { useUser } from "../context/UserContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";

type RegisterNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

interface RegisterProps {
  navigation: RegisterNavigationProp;
}

export default function Register({ navigation }: RegisterProps) {
  const { register } = useUser();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");

  const handleRegister = () => {
    if (!usuario || !password || !nombre) {
      Alert.alert("Error", "Por favor complete todos los campos");
      return;
    }

    const exito = register({
      usuario,
      password,
      nombre,
      rol: "Empleado Temporal",
      area: "General",
      correo: `${usuario}@temporal.com`,
      telefono: "000000000",
      direccion: "Sin dirección",
      edad: 0,
      genero: "No especificado",
      dni: "00000000",
    });

    if (exito) {
      Alert.alert("Registro exitoso", "Ahora puede iniciar sesión", [
        { text: "Ir al login", onPress: () => navigation.navigate("Login") },
      ]);
    } else {
      Alert.alert("Error", "El usuario ya existe");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={base.container}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 80,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Título principal */}
        <Text style={[base.titulos, { textAlign: "center", marginBottom: 5 }]}>
          Inmobiliaria San Felipe S.A.C.
        </Text>
        <Text style={[base.textoSimple, { color: "#9ca3af", marginBottom: 25 }]}>
          Complete los datos para crear una cuenta
        </Text>

        {/* Contenedor del formulario */}
        <View style={base.inputContainer}>
          <Text style={[base.subtitulos, { paddingLeft: 0 }]}>Usuario</Text>
          <TextInput
            style={base.textInput}
            placeholder="Ingrese su usuario"
            placeholderTextColor="#707e90"
            value={usuario}
            onChangeText={setUsuario}
          />

          <Text style={[base.subtitulos, { paddingLeft: 0, marginTop: 10 }]}>
            Nombre completo
          </Text>
          <TextInput
            style={base.textInput}
            placeholder="Ingrese su nombre completo"
            placeholderTextColor="#707e90"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={[base.subtitulos, { paddingLeft: 0, marginTop: 10 }]}>
            Contraseña
          </Text>
          <TextInput
            style={base.textInput}
            placeholder="Ingrese su contraseña"
            placeholderTextColor="#707e90"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Botón principal */}
        <TouchableOpacity
          style={[
            base.botones_Principal,
            { marginTop: 25, width: "80%", borderRadius: 10 },
          ]}
          onPress={handleRegister}
        >
          <Text style={[base.textoSimpleBlanco, { fontSize: 16 }]}>
            Registrar usuario
          </Text>
        </TouchableOpacity>

        {/* Botón secundario */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={{ color: "#0da3a4", marginTop: 15 }}>
            ¿Ya tienes cuenta? Inicia sesión aquí
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
