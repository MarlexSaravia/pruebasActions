import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../../auth/context/UserContext';

interface CambiarFotoPerfilProps {
  visible: boolean;
  onClose: () => void;
}

export default function CambiarFotoPerfil({ visible, onClose }: CambiarFotoPerfilProps) {
  const { updateProfilePhoto } = useUser();
  const [urlFoto, setUrlFoto] = useState('');

  const handleSeleccionarDesdeGaleria = async () => {
    try {
      // Solicitar permisos
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permiso denegado', 'Necesitas dar permiso para acceder a la galería');
        return;
      }

      // Abrir galería
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Usar directamente la URI local de la imagen
        updateProfilePhoto(result.assets[0].uri);
        Alert.alert('Éxito', 'Foto de perfil actualizada correctamente');
        onClose();
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'Ocurrió un error al seleccionar la imagen');
    }
  };

  const handleTomarFoto = async () => {
    try {
      // Solicitar permisos
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permiso denegado', 'Necesitas dar permiso para usar la cámara');
        return;
      }

      // Abrir cámara
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Usar directamente la URI local de la imagen
        updateProfilePhoto(result.assets[0].uri);
        Alert.alert('Éxito', 'Foto de perfil actualizada correctamente');
        onClose();
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'Ocurrió un error al tomar la foto');
    }
  };

  const handleUsarURL = () => {
    if (!urlFoto.trim()) {
      Alert.alert('Error', 'Por favor ingresa una URL válida');
      return;
    }

    updateProfilePhoto(urlFoto);
    Alert.alert('Éxito', 'Foto de perfil actualizada correctamente');
    setUrlFoto('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitulo}>Cambiar Foto de Perfil</Text>

          {/* Opción: Desde Galería */}
          <TouchableOpacity
            style={styles.opcionBoton}
            onPress={handleSeleccionarDesdeGaleria}
          >
            <Text style={styles.iconoOpcion}>🖼️</Text>
            <Text style={styles.textoOpcion}>Seleccionar desde galería</Text>
          </TouchableOpacity>

          {/* Opción: Tomar Foto */}
          <TouchableOpacity
            style={styles.opcionBoton}
            onPress={handleTomarFoto}
          >
            <Text style={styles.iconoOpcion}>📷</Text>
            <Text style={styles.textoOpcion}>Tomar foto</Text>
          </TouchableOpacity>

          {/* Opción: URL */}
          <View style={styles.urlContainer}>
            <Text style={styles.urlLabel}>O ingresa una URL:</Text>
            <TextInput
              style={styles.urlInput}
              placeholder="https://ejemplo.com/imagen.jpg"
              placeholderTextColor="#707e90"
              value={urlFoto}
              onChangeText={setUrlFoto}
              autoCapitalize="none"
              keyboardType="url"
            />
            <TouchableOpacity
              style={styles.urlBoton}
              onPress={handleUsarURL}
            >
              <Text style={styles.urlBotonTexto}>Usar URL</Text>
            </TouchableOpacity>
          </View>

          {/* Botón Cancelar */}
          <TouchableOpacity
            style={styles.cancelarBoton}
            onPress={onClose}
          >
            <Text style={styles.cancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#0b1220',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#172139',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  opcionBoton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#172139',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  iconoOpcion: {
    fontSize: 24,
    marginRight: 15,
  },
  textoOpcion: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  urlContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  urlLabel: {
    fontSize: 14,
    color: '#707e90',
    marginBottom: 8,
  },
  urlInput: {
    backgroundColor: '#172139',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  urlBoton: {
    backgroundColor: '#0da3a4',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  urlBotonTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelarBoton: {
    backgroundColor: '#707e90',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
