import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";

/**
 * Script para popular o banco de dados com dados de teste
 * Uso: node seed-db.mjs
 */

const DATABASE_URL = process.env.DATABASE_URL || "mysql://root:@localhost:3306/q7gov";

async function seedDatabase() {
  console.log("🌱 Iniciando seed do banco de dados...\n");

  try {
    // Conectar ao banco de dados
    const connection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(connection);

    // Dados do usuário admin
    const adminUser = {
      openId: "kenenaraujo-admin-001",
      name: "Kener Araújo",
      email: "kenenaraujo@gmail.com",
      loginMethod: "admin",
      role: "admin",
    };

    // Verificar se usuário já existe
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, adminUser.email))
      .limit(1);

    if (existingUser.length > 0) {
      console.log("✅ Usuário admin já existe!");
      console.log(`   Email: ${existingUser[0].email}`);
      console.log(`   Nome: ${existingUser[0].name}`);
      console.log(`   Role: ${existingUser[0].role}\n`);
    } else {
      // Inserir usuário admin
      await db.insert(users).values({
        ...adminUser,
        lastSignedIn: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("✅ Usuário admin criado com sucesso!\n");
      console.log("📋 Dados de Acesso:");
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Nome: ${adminUser.name}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   OpenID: ${adminUser.openId}\n`);
    }

    // Criar dados de teste adicionais (conversas WhatsApp, sentimentos, etc)
    console.log("📊 Criando dados de teste adicionais...\n");

    // Dados de exemplo para WhatsApp
    const testConversations = [
      {
        phoneNumber: "5511999999999",
        citizenName: "João Silva",
        department: "Saúde",
        status: "active",
      },
      {
        phoneNumber: "5511988888888",
        citizenName: "Maria Santos",
        department: "Educação",
        status: "active",
      },
      {
        phoneNumber: "5511977777777",
        citizenName: "Pedro Oliveira",
        department: "Obras",
        status: "closed",
      },
    ];

    console.log(`✅ ${testConversations.length} conversas de teste preparadas`);
    console.log("   (Inserção de conversas requer tabela whatsapp_conversations)\n");

    console.log("🎉 Seed concluído com sucesso!\n");
    console.log("📍 Próximos passos:");
    console.log("   1. Inicie o servidor: pnpm dev");
    console.log("   2. Acesse: http://localhost:3000");
    console.log("   3. Faça login com o usuário admin criado\n");

    await connection.end();
  } catch (error) {
    console.error("❌ Erro ao fazer seed do banco de dados:");
    console.error(error);
    process.exit(1);
  }
}

seedDatabase();
