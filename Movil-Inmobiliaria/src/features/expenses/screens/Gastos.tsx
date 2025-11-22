import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { base } from "../../../shared/styles/base";
import { Gasto } from "../../dashboard/screens/Inicio";

interface Props {
  gastos?: Gasto[];
  onAddPress?: () => void;
}

const Gastos = ({ gastos = [], onAddPress }: Props) => {
  // Calcular totales
  const totalReciente = gastos
    .reduce((acc, g) => acc + Number(g.monto || 0), 0)
    .toFixed(2);
  const pendientes = gastos.filter((g) => g.estado === "Pendiente").length;

  // Emojis para cada tipo de gasto
  const getEmoji = (desc: string) => {
    const d = desc.toLowerCase();
    if (d.includes("transporte")) return "🚗";
    if (d.includes("aliment")) return "🍔";
    if (d.includes("manten")) return "🛠️";
    if (d.includes("sumin")) return "📦";
    return "💸";
  };

  // Colores de estado
  const getEstadoStyle = (estado: Gasto["estado"]) => {
    switch (estado) {
      case "Aprobado":
        return base.Aprobado;
      case "Pendiente":
        return base.Pendiente;
      case "Rechazado":
        return base.Rechazado;
      default:
        return base.Pendiente;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingBottom: 100,
        }}
      >
        {/* ─── GASTOS RECIENTES ─── */}
        <View
          style={[
            base.containerInterno,
            {
              padding: 20,
              borderRadius: 15,
              marginTop: 10,
              marginBottom: 15,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text
              style={[
                base.textoSimple,
                { color: "#9ca3af", fontSize: 13, marginBottom: 5 },
              ]}
            >
              Gastos recientes
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#172139",
                  borderRadius: 20,
                  paddingVertical: 5,
                  paddingHorizontal: 12,
                }}
              >
                <Text style={[base.textoSimpleBlanco, { fontSize: 12 }]}>
                  Semana
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#172139",
                  borderRadius: 20,
                  paddingVertical: 5,
                  paddingHorizontal: 12,
                }}
              >
                <Text style={[base.textoSimpleBlanco, { fontSize: 12 }]}>
                  {pendientes} pendientes
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text
            style={[
              base.textoSimpleBlanco,
              { fontSize: 28, fontWeight: "bold" },
            ]}
          >
            S/ {totalReciente}
          </Text>
        </View>

        {/* ─── HISTORIAL RECIENTE ─── */}
        <Text
          style={[
            base.subtitulos,
            { color: "#9ca3af", fontSize: 14, marginBottom: 8 },
          ]}
        >
          Historial reciente
        </Text>

        <FlatList
          data={gastos}
          keyExtractor={(it) => it.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#0e1628",
                borderRadius: 18,
                paddingVertical: 22,
                paddingHorizontal: 18,
                marginBottom: 14,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#172139",
              }}
            >
              {/* Emoji */}
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 14,
                  backgroundColor: "#172139",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 18,
                }}
              >
                <Text style={{ fontSize: 32 }}>{getEmoji(item.descripcion)}</Text>
              </View>

              {/* Información */}
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    base.textoSimpleBlanco,
                    { fontWeight: "700", fontSize: 18 },
                  ]}
                >
                  S/ {item.monto}
                </Text>
                <Text
                  style={[
                    base.textoSimple,
                    {
                      color: "#9ca3af",
                      marginTop: 5,
                      fontSize: 13,
                      flexShrink: 1,
                    },
                  ]}
                >
                  {item.descripcion} • {item.fecha}
                </Text>
              </View>

              {/* Estado */}
              <View
                style={[
                  getEstadoStyle(item.estado),
                  {
                    width: 100,
                    height: 36,
                    borderRadius: 25,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text
                  style={[base.textoSimpleBlanco, { fontSize: 13 }]}
                  numberOfLines={1}
                >
                  {item.estado}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text
              style={{
                color: "#707e90",
                textAlign: "center",
                marginTop: 30,
              }}
            >
              No hay gastos
            </Text>
          }
        />
      </ScrollView>

      {/* ─── BOTÓN + ─── */}
      <TouchableOpacity
        onPress={onAddPress}
      >
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Gastos;
