import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { base } from "../../../shared/styles/base";
import { useUser } from "../context/UserContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;
interface LoginProps {
  navigation: LoginNavigationProp;
}

export default function Login({ navigation }: LoginProps) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();

  const handleLogin = () => {
    const success = login(usuario, password);
    if (!success) {
      Alert.alert("Error", "Usuario o contraseña incorrectos");
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
        

        {/* Títulos */}
        <Text style={[base.titulos, { textAlign: "center", marginBottom: 5 }]}>
          Inmobiliaria San Felipe S.A.C.
        </Text>
        <Text style={[base.textoSimple, { color: "#9ca3af", marginBottom: 25 }]}>
          Inicie sesión para continuar
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
          onPress={handleLogin}
        >
          <Text style={[base.textoSimpleBlanco, { fontSize: 16 }]}>
            Acceder al sistema
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={{ color: "#0da3a4", marginTop: 15 }}>
            ¿No tienes cuenta? Regístrate aquí
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
