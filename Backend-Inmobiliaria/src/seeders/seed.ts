import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Project from '../models/Project';
import { UserRole, ProjectStatus } from '../types/enums';

// Cargar variables de entorno
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inmobiliaria-san-felipe');
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('🌱 Iniciando seed de datos...\n');

    // Limpiar datos existentes
    console.log('🗑️  Limpiando datos existentes...');
    await User.deleteMany({});
    await Project.deleteMany({});
    console.log('✅ Datos limpiados\n');

    // Crear usuario MODERADOR (admin)
    console.log('👤 Creando usuario MODERADOR...');
    const moderador = await User.create({
      username: 'admin',
      password: 'Admin123456',
      fullName: 'Administrador Principal',
      role: UserRole.MODERADOR,
      area: 'Dirección General',
      dni: '12345678',
      age: 35,
      gender: 'Masculino',
      phone: '999999999',
      email: 'admin@sanfelipesac.com',
      address: 'Av. Principal 123, Lima',
      profilePhoto: 'https://ui-avatars.com/api/?name=Admin&background=0da3a4&color=fff&size=200',
      isActive: true,
    });
    console.log('✅ Moderador creado:', moderador.username);

    // Crear usuario ADMIN_OBRA
    console.log('\n👤 Creando usuario ADMIN_OBRA...');
    const adminObra = await User.create({
      username: 'jorge',
      password: '123456',
      fullName: 'Castañeda Bardales, Jorge Elias',
      role: UserRole.ADMIN_OBRA,
      area: 'Construcción',
      dni: '72694851',
      age: 21,
      gender: 'Masculino',
      phone: '998321654',
      email: 'jorge.castaneda@sanfelipesac.com',
      address: 'Calle San Marcos 234, San Juan de Lurigancho, Lima',
      profilePhoto: 'https://ui-avatars.com/api/?name=Jorge+Castaneda&background=0da3a4&color=fff&size=200',
      isActive: true,
      createdBy: moderador._id,
    });
    console.log('✅ Admin de Obra creado:', adminObra.username);

    // Crear TRABAJADORES
    console.log('\n👤 Creando TRABAJADORES...');

    const gian = await User.create({
      username: 'gian',
      password: '123456',
      fullName: 'Vilcamiche Chávez, Gian Carlo',
      role: UserRole.TRABAJADOR,
      area: 'Construcción',
      dni: '72654321',
      age: 20,
      gender: 'Masculino',
      phone: '987654321',
      email: 'gian.vilcamiche@sanfelipesac.com',
      address: 'Av. Los Ingenieros 456, San Martín de Porres, Lima',
      profilePhoto: 'https://ui-avatars.com/api/?name=Gian+Vilcamiche&background=0da3a4&color=fff&size=200',
      isActive: true,
      createdBy: adminObra._id,
    });
    console.log('✅ Trabajador creado:', gian.username);

    const javier = await User.create({
      username: 'javier',
      password: '123456',
      fullName: 'Saravia Garcia, Javier Marlex',
      role: UserRole.TRABAJADOR,
      area: 'Logística',
      dni: '74859612',
      age: 26,
      gender: 'Masculino',
      phone: '965874123',
      email: 'javier.saravia@sanfelipesac.com',
      address: 'Av. La Marina 1120, Pueblo Libre, Lima',
      profilePhoto: 'https://ui-avatars.com/api/?name=Javier+Saravia&background=0da3a4&color=fff&size=200',
      isActive: true,
      createdBy: adminObra._id,
    });
    console.log('✅ Trabajador creado:', javier.username);

    // Crear usuario CONTABILIDAD
    console.log('\n👤 Creando usuario CONTABILIDAD...');
    const contabilidad = await User.create({
      username: 'fernando',
      password: '123456',
      fullName: 'Sotelo Afa, Fernando Adrian',
      role: UserRole.CONTABILIDAD,
      area: 'Finanzas',
      dni: '73562145',
      age: 23,
      gender: 'Masculino',
      phone: '912458796',
      email: 'fernando.sotelo@sanfelipesac.com',
      address: 'Jr. Callao 987, Cercado de Lima',
      profilePhoto: 'https://ui-avatars.com/api/?name=Fernando+Sotelo&background=0da3a4&color=fff&size=200',
      isActive: true,
      createdBy: moderador._id,
    });
    console.log('✅ Contabilidad creado:', contabilidad.username);

    // Crear proyecto de ejemplo
    console.log('\n🏗️  Creando proyecto de ejemplo...');
    const proyecto = await Project.create({
      name: 'Edificio San Felipe - Los Olivos',
      code: 'OBR-2025-001',
      location: 'Los Olivos, Lima, Perú',
      description: 'Construcción de edificio residencial de 10 pisos con 40 departamentos',
      budget: 500000,
      currentSpent: 0,
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-12-31'),
      status: ProjectStatus.ACTIVO,
      createdBy: moderador._id,
    });
    console.log('✅ Proyecto creado:', proyecto.name);

    console.log('\n' + '='.repeat(50));
    console.log('✅ SEED COMPLETADO EXITOSAMENTE');
    console.log('='.repeat(50));

    console.log('\n📊 RESUMEN DE USUARIOS CREADOS:');
    console.log('─'.repeat(50));
    console.log(`👑 MODERADOR:     admin / Admin123456`);
    console.log(`🏗️  ADMIN_OBRA:    jorge / 123456`);
    console.log(`👷 TRABAJADOR:    gian / 123456`);
    console.log(`👷 TRABAJADOR:    javier / 123456`);
    console.log(`📊 CONTABILIDAD:  fernando / 123456`);
    console.log('─'.repeat(50));

    console.log('\n🏗️  PROYECTO CREADO:');
    console.log('─'.repeat(50));
    console.log(`📋 Nombre: ${proyecto.name}`);
    console.log(`🔖 Código: ${proyecto.code}`);
    console.log(`💰 Presupuesto: S/ ${proyecto.budget.toLocaleString()}`);
    console.log(`📍 Ubicación: ${proyecto.location}`);
    console.log('─'.repeat(50));

    console.log('\n💡 PRÓXIMOS PASOS:');
    console.log('1. Asignar Jorge como administrador del proyecto');
    console.log('2. Asignar Gian y Javier como trabajadores');
    console.log('3. Registrar gastos y aprobarlos\n');

  } catch (error) {
    console.error('❌ Error al poblar datos:', error);
    throw error;
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
  await mongoose.connection.close();
  console.log('\n👋 Conexión cerrada. Seed finalizado.\n');
  process.exit(0);
};

runSeed();
