import { StyleSheet } from "react-native";

/**
 * 🎨 Estilos globales base
 * Proyecto: Inmobiliaria San Felipe S.A.C.
 * Tema: Oscuro con acentos turquesa
 */

export const base = StyleSheet.create({
  // =========================
  // 🧱 CONTENEDORES
  // =========================
  container: {
    flex: 1,
    backgroundColor: "#0e1628", // Fondo principal
  },
  containerInterno: {
    flex: 1,
    backgroundColor: "#0b1220", // Fondo interno más oscuro
    borderRadius: 10,
    margin: 5,
    padding: 5,
  },

  contenedorNaranja: {
    backgroundColor: "#d97706",
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  // =========================
  // ✍️ TEXTOS
  // =========================
  titulos: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    paddingTop: 20,
    textAlign: "center",
    paddingLeft: 20,
  },
  subtitulos: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    paddingTop: 10,
    paddingLeft: 20,
  },
  textoSimple: {
    fontSize: 12,
    color: "#707e90",
  },
  textoSimpleBlanco: {
    fontSize: 12,
    color: "#fff",
  },

  // =========================
  // ➖ LÍNEAS Y DIVISORES
  // =========================
  linea: {
    borderBottomColor: "#172139",
    borderBottomWidth: 1,
    marginVertical: 10,
  },

  // =========================
  // 🔘 BOTONES
  // =========================
  botones_Principal: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    backgroundColor: "#0da3a4",
    borderRadius: 10,
    padding: 5,
  },
  botonActivo: {
    backgroundColor: "#0ea4a3", // Turquesa activo
    borderWidth: 1,
    borderColor: "#0ea4a3",
  },
  botonInactivo: {
    backgroundColor: "#172139", // Oscuro inactivo
    borderWidth: 1,
    borderColor: "transparent",
  },

  // =========================
  // 🧾 DETALLES DE GASTO
  // =========================
  detalleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },
  detalleLabel: {
    color: "#9ca3af",
    fontSize: 16,
  },
  detalleValor: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
    marginLeft: 10,
  },

  // =========================
  // 📥 INPUTS / FORMULARIOS
  // =========================
  inputContainer: {
    width: "85%",
    backgroundColor: "#0e1628",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginTop: 10,
  },
  textInput: {
    color: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 15,
  },

  // =========================
  // 🧩 ESTADOS DE GASTO
  // =========================
  Aprobado: {
    backgroundColor: "#034b38",
    borderRadius: 30,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 90,
  },
  Pendiente: {
    backgroundColor: "#ab7640",
    borderRadius: 30,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 90,
  },
  Rechazado: {
    backgroundColor: "#921b1b",
    borderRadius: 30,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 90,
  },

  // =========================
  // 🔽 BOTONES DESPLEGABLES
  // =========================
  botonDesplegable: {
    backgroundColor: "#172139",
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textoDesplegableActivo: {
    color: "#0ea4a3",
    fontWeight: "bold",
    fontSize: 14,
  },

  // =========================
  // 🪟 MODALES
  // =========================
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#1f2937",
    borderRadius: 15,
    padding: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOpcion: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  modalTextoOpcion: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  // =========================
  // 👤 PERFIL
  // =========================
  perfilHeader: {
    alignItems: "center",
    paddingVertical: 20,
  },
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
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
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
  editIcon: {
    fontSize: 14,
  },
  nombreUsuario: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  cargoUsuario: {
    fontSize: 14,
    color: "#707e90",
    marginBottom: 20,
  },
  estadisticasContainer: {
    flexDirection: "row",
    backgroundColor: "#172139",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    width: "90%",
  },
  estadisticaItem: {
    flex: 1,
    alignItems: "center",
  },
  estadisticaValor: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0da3a4",
    marginBottom: 5,
  },
  estadisticaLabel: {
    fontSize: 12,
    color: "#707e90",
    textAlign: "center",
  },
  separadorVertical: {
    width: 1,
    backgroundColor: "#0b1220",
    marginHorizontal: 15,
  },

  opcionesContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
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
  icono: {
    fontSize: 20,
  },
  textoOpcion: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  flecha: {
    fontSize: 24,
    color: "#707e90",
    fontWeight: "bold",
  },
  cerrarSesionBoton: {
    backgroundColor: "#921b1b",
    marginTop: 10,
  },
  textoCerrarSesion: {
    color: "#fff",
  },
  // =========================
  // 💰 DETALLE DE GASTO
  // =========================
  detalleContainer: {
    backgroundColor: "#0e1628",
    padding: 20,
    borderRadius: 15,
    marginTop: 15,
  },
  detalleTitulo: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  comprobanteImagen: {
    width: "100%",
    height: 240,
    alignSelf: "center",
    borderRadius: 10,
    resizeMode: "contain",
  },
  comprobanteTexto: {
    textAlign: "center",
    color: "#707e90",
    fontStyle: "italic",
    marginTop: 5,
  },
  volverBoton: {
    marginTop: 30,
    backgroundColor: "#1f2937",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
    // =========================
  // 📋 HISTORIAL DE GASTOS
  // =========================
  historialCard: {
    backgroundColor: "#172139",
    borderRadius: 10,
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historialInfo: {
    flex: 1,
  },
  historialDescripcion: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  historialFecha: {
    color: "#9ca3af",
    fontSize: 12,
  },
  historialMonto: {
    color: "#0da3a4",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  historialEstado: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  historialBoton: {
    marginTop: 15,
    alignSelf: "center",
    backgroundColor: "#0da3a4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
    // =========================
  // 🏠 INICIO
  // =========================
  inicioHeader: {
    alignItems: "center",
    marginBottom: 15,
  },
  inicioTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  inicioResumenCard: {
    backgroundColor: "#172139",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  inicioResumenTexto: {
    color: "#9ca3af",
    fontSize: 14,
  },
  inicioResumenValor: {
    color: "#0da3a4",
    fontSize: 22,
    fontWeight: "bold",
  },
  inicioBotonAgregar: {
    backgroundColor: "#0da3a4",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 15,
    width: "85%",
    alignSelf: "center",
  },
  inicioBotonTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },


});
