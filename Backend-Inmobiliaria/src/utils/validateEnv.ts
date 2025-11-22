import dotenv from 'dotenv';

dotenv.config();

export const validateEnv = (): void => {
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
  ];

  const missingVars: string[] = [];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error('❌ ERROR: Faltan las siguientes variables de entorno:');
    missingVars.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error('\n💡 Asegúrate de crear un archivo .env basado en .env.example');
    process.exit(1);
  }

  // Validar formato de MongoDB URI
  const mongoUri = process.env.MONGODB_URI || '';
  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    console.error('❌ ERROR: MONGODB_URI debe comenzar con mongodb:// o mongodb+srv://');
    process.exit(1);
  }

  console.log('✅ Variables de entorno validadas correctamente');
};
