import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { base } from "../../../shared/styles/base";
import InformacionPersonal from "../components/InformacionPersonal";
import Notificaciones from "../../../shared/components/Notificaciones";
import CambiarFotoPerfil from "../components/CambiarFotoPerfil";
import { useUser } from "../../auth/context/UserContext";
import { Gasto } from "../../dashboard/screens/Inicio";

interface PerfilProps {
  gastos: Gasto[];
}

export default function Perfil({ gastos }: PerfilProps) {
  const [vistaActual, setVistaActual] = useState<
    "perfil" | "informacion" | "notificaciones"
  >("perfil");
  const [modalFotoVisible, setModalFotoVisible] = useState(false);
  const { userData, logout } = useUser();


  if (!userData) {
    return (
      <View style={base.container}>
        <Text
          style={[
            base.textoSimpleBlanco,
            { textAlign: "center", marginTop: 100 },
          ]}
        >
          Cargando perfil...
        </Text>
      </View>
    );
  }

  const handleCerrarSesion = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, cerrar sesión",
          style: "destructive",
          onPress: () => {
            logout(); 
          },
        },
      ]
    );
  };

  const totalGastos = gastos.reduce((sum, g) => sum + parseFloat(g.monto), 0);
  const cantidadRegistros = gastos.length;

  if (vistaActual === "informacion") {
    return <InformacionPersonal onVolver={() => setVistaActual("perfil")} />;
  }

  if (vistaActual === "notificaciones") {
    return <Notificaciones onVolver={() => setVistaActual("perfil")} />;
  }

  return (
    <View style={base.container}>
      <ScrollView style={base.containerInterno}>
        <Text style={[base.titulos, { textAlign: "left" }]}>Perfil</Text>
        <View style={base.linea} />

        {/* Sección de foto de perfil */}
        <View style={styles.perfilHeader}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => setModalFotoVisible(true)}
          >
            <Image
              source={{ uri: userData.fotoPerfil }}
              style={styles.avatar}
            />
            <View style={styles.editIconContainer}>
              <Text style={styles.editIcon}>✏️</Text>
            </View>
          </TouchableOpacity>

          {/* Campos actualizados */}
          <Text style={styles.nombreUsuario}>{userData.nombre}</Text>
          <Text style={styles.cargoUsuario}>{userData.rol}</Text>

          {/* Estadísticas */}
          <View style={styles.estadisticasContainer}>
            <View style={styles.estadisticaItem}>
              <Text style={styles.estadisticaValor}>
                S/.{totalGastos.toFixed(2)}
              </Text>
              <Text style={styles.estadisticaLabel}>Gastos del Mes</Text>
            </View>
            <View style={styles.separadorVertical} />
            <View style={styles.estadisticaItem}>
              <Text style={styles.estadisticaValor}>{cantidadRegistros}</Text>
              <Text style={styles.estadisticaLabel}>Total de Registros</Text>
            </View>
          </View>
        </View>

        <View style={base.linea} />

        {/* Opciones */}
        <View style={styles.opcionesContainer}>
          <TouchableOpacity
            style={styles.opcionBoton}
            onPress={() => setVistaActual("informacion")}
          >
            <View style={styles.iconoContainer}>
              <Text style={styles.icono}>👤</Text>
            </View>
            <Text style={styles.textoOpcion}>Información Personal</Text>
            <Text style={styles.flecha}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.opcionBoton}
            onPress={() => setVistaActual("notificaciones")}
          >
            <View style={styles.iconoContainer}>
              <Text style={styles.icono}>🔔</Text>
            </View>
            <Text style={styles.textoOpcion}>Notificaciones</Text>
            <Text style={styles.flecha}>›</Text>
          </TouchableOpacity>

          <View style={base.linea} />

          <TouchableOpacity
            style={[styles.opcionBoton, styles.cerrarSesionBoton]}
            onPress={handleCerrarSesion}
          >
            <View style={styles.iconoContainer}>
              <Text style={styles.icono}>🚪</Text>
            </View>
            <Text
              style={[styles.textoOpcion, styles.textoCerrarSesion]}
            >
              Cerrar Sesión
            </Text>
            <Text
              style={[styles.flecha, styles.textoCerrarSesion]}
            >
              ›
            </Text>
          </TouchableOpacity>
        </View>

        <CambiarFotoPerfil
          visible={modalFotoVisible}
          onClose={() => setModalFotoVisible(false)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  perfilHeader: { alignItems: "center", paddingVertical: 20 },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#172139",
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#0da3a4",
    position: "relative",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#0da3a4",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0b1220",
  },
  editIcon: { fontSize: 14 },
  avatar: { width: "100%", height: "100%", borderRadius: 50 },
  nombreUsuario: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 5 },
  cargoUsuario: { fontSize: 14, color: "#707e90", marginBottom: 20 },
  estadisticasContainer: {
    flexDirection: "row",
    backgroundColor: "#172139",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    width: "90%",
  },
  estadisticaItem: { flex: 1, alignItems: "center" },
  estadisticaValor: { fontSize: 20, fontWeight: "bold", color: "#0da3a4", marginBottom: 5 },
  estadisticaLabel: { fontSize: 12, color: "#707e90", textAlign: "center" },
  separadorVertical: { width: 1, backgroundColor: "#0b1220", marginHorizontal: 15 },
  opcionesContainer: { paddingHorizontal: 10, paddingTop: 10 },
  opcionBoton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#172139",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  iconoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0b1220",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  icono: { fontSize: 20 },
  textoOpcion: { flex: 1, fontSize: 16, color: "#fff", fontWeight: "500" },
  flecha: { fontSize: 24, color: "#707e90", fontWeight: "bold" },
  cerrarSesionBoton: { backgroundColor: "#921b1b", marginTop: 10 },
  textoCerrarSesion: { color: "#fff" },
});
