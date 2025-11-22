import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { base } from "../styles/base";

interface NotificacionesProps {
  onVolver: () => void;
}

interface Notificacion {
  id: number;
  tipo: "aprobado" | "pendiente" | "rechazado" | "info";
  titulo: string;
  mensaje: string;
  fecha: string;
  leido: boolean;
}

export default function Notificaciones({ onVolver }: NotificacionesProps) {
  const notificaciones: Notificacion[] = [
    {
      id: 1,
      tipo: "aprobado",
      titulo: "Gasto Aprobado",
      mensaje: "Tu solicitud de gasto por S/. 150.00 para combustible ha sido aprobada.",
      fecha: "Hace 2 horas",
      leido: false,
    },
    {
      id: 2,
      tipo: "pendiente",
      titulo: "Gasto en Revisión",
      mensaje: "Tu solicitud de gasto por S/. 85.00 está siendo revisada por tu supervisor.",
      fecha: "Hace 5 horas",
      leido: false,
    },
    {
      id: 3,
      tipo: "rechazado",
      titulo: "Gasto Rechazado",
      mensaje: "Tu solicitud de gasto por S/. 200.00 ha sido rechazada. Motivo: Factura ilegible.",
      fecha: "Ayer",
      leido: true,
    },
    {
      id: 4,
      tipo: "info",
      titulo: "Recordatorio",
      mensaje: "Recuerda subir tus gastos de la semana antes del viernes.",
      fecha: "Hace 2 días",
      leido: true,
    },
    {
      id: 5,
      tipo: "aprobado",
      titulo: "Gasto Aprobado",
      mensaje: "Tu solicitud de gasto por S/. 45.00 para materiales ha sido aprobada.",
      fecha: "Hace 3 días",
      leido: true,
    },
  ];

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case "aprobado":
        return "#034b38";
      case "pendiente":
        return "#ab7640ff";
      case "rechazado":
        return "#921b1bff";
      default:
        return "#0da3a4";
    }
  };

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case "aprobado":
        return "✓";
      case "pendiente":
        return "⏱";
      case "rechazado":
        return "✗";
      default:
        return "ℹ";
    }
  };

  return (
    <View style={base.container}>
      <View style={base.containerInterno}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onVolver} style={styles.botonVolver}>
            <Text style={styles.textoVolver}>‹ Volver</Text>
          </TouchableOpacity>
          <Text style={[base.titulos, { flex: 1, textAlign: "center", paddingRight: 60 }]}>
            Notificaciones
          </Text>
        </View>

        <View style={base.linea} />

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {notificaciones.length === 0 ? (
            <View style={styles.sinNotificaciones}>
              <Text style={styles.textoSinNotificaciones}>📭</Text>
              <Text style={styles.textoSecundario}>No tienes notificaciones</Text>
            </View>
          ) : (
            notificaciones.map((notif) => (
              <View key={notif.id}>
                <TouchableOpacity
                  style={[
                    styles.notificacionCard,
                    !notif.leido && styles.notificacionNoLeida,
                  ]}
                >
                  <View style={[styles.iconoNotificacion, { backgroundColor: getColorTipo(notif.tipo) }]}>
                    <Text style={styles.iconoTexto}>{getIconoTipo(notif.tipo)}</Text>
                  </View>

                  <View style={styles.contenidoNotificacion}>
                    <View style={styles.headerNotificacion}>
                      <Text style={styles.tituloNotificacion}>{notif.titulo}</Text>
                      {!notif.leido && <View style={styles.puntito} />}
                    </View>
                    <Text style={styles.mensajeNotificacion}>{notif.mensaje}</Text>
                    <Text style={styles.fechaNotificacion}>{notif.fecha}</Text>
                  </View>
                </TouchableOpacity>
                <View style={base.linea} />
              </View>
            ))
          )}

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  botonVolver: {
    padding: 10,
  },
  textoVolver: {
    fontSize: 18,
    color: "#0da3a4",
    fontWeight: "bold",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  notificacionCard: {
    flexDirection: "row",
    backgroundColor: "#172139",
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
  },
  notificacionNoLeida: {
    backgroundColor: "#1a2847",
  },
  iconoNotificacion: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  iconoTexto: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  contenidoNotificacion: {
    flex: 1,
  },
  headerNotificacion: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  tituloNotificacion: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  puntito: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0da3a4",
  },
  mensajeNotificacion: {
    fontSize: 14,
    color: "#a0aec0",
    marginBottom: 8,
    lineHeight: 20,
  },
  fechaNotificacion: {
    fontSize: 12,
    color: "#707e90",
  },
  sinNotificaciones: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  textoSinNotificaciones: {
    fontSize: 60,
    marginBottom: 10,
  },
  textoSecundario: {
    fontSize: 16,
    color: "#707e90",
  },
});
