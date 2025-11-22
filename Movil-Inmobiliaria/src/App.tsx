import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { base } from "./shared/styles/base";
import { useUser, UserProvider } from "./features/auth/context/UserContext";

import Inicio, { Gasto } from "./features/dashboard/screens/Inicio";
import Historial from "./features/expenses/screens/Historial";
import Perfil from "./features/profile/screens/Perfil";
import DetalleGasto from "./features/expenses/screens/DetalleGasto";
import Login from "./features/auth/screens/Login";
import Register from "./features/auth/screens/Register";

import InicioIcono from "./shared/components/icons/InicioIcon";
import UserIcono from "./shared/components/icons/UserIcon";
import ListIcono from "./shared/components/icons/ListIcon";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
};

function HistorialStack({ gastos }: { gastos: Gasto[] }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistorialList">
        {(props) => <Historial {...props} gastos={gastos} />}
      </Stack.Screen>
      <Stack.Screen name="DetalleGasto" component={DetalleGasto} />
    </Stack.Navigator>
  );
}

function MainTabs({ gastos, agregarGasto }: { gastos: Gasto[]; agregarGasto: (g: Gasto) => Gasto }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0e1628",
          borderTopWidth: 0,
        },
        tabBarActiveBackgroundColor: "#0ea4a3",
        tabBarInactiveBackgroundColor: "#0e1628",
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#888",
      }}
    >
      <Tab.Screen
        name="Inicio"
        options={{
          tabBarIcon: ({ color, size }) => <InicioIcono color={color} size={size} />,
        }}
      >
        {(props) => <Inicio {...props} gastos={gastos} agregarGasto={agregarGasto} />}
      </Tab.Screen>

      <Tab.Screen
        name="Historial"
        options={{
          tabBarIcon: ({ color, size }) => <ListIcono color={color} size={size} />,
        }}
      >
        {() => <HistorialStack gastos={gastos} />}
      </Tab.Screen>

      <Tab.Screen
        name="Perfil"
        options={{
          tabBarIcon: ({ color, size }) => <UserIcono color={color} size={size} />,
        }}
      >
        {(props) => <Perfil {...props} gastos={gastos} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function MainApp() {
  const { isLoggedIn } = useUser();

  const [gastos, setGastos] = React.useState<Gasto[]>([
    {
      id: "1",
      fecha: "2025-10-15",
      descripcion: "Almuerzo con proveedor",
      monto: "45.00",
      estado: "Aprobado",
      comprobante: "https://placehold.co/400x240/0ea4a3/ffffff?text=Comprobante",
    },
  ]);

  const agregarGasto = (nuevoGasto: Gasto) => {
    const gastoConImagen = {
      ...nuevoGasto,
      comprobante:
        nuevoGasto.comprobante ||
        "https://placehold.co/400x240/64748b/ffffff?text=Sin+Imagen",
    };
    setGastos((prev) => [gastoConImagen, ...prev]);
    return gastoConImagen;
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        ) : (
          <Stack.Screen name="MainTabs">
            {(props) => (
              <View style={base.container}>
                <View style={base.containerInterno}>
                  <MainTabs {...props} gastos={gastos} agregarGasto={agregarGasto} />
                </View>
              </View>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}
