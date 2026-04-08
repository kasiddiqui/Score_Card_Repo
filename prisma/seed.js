const { createClient } = require('@libsql/client');

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error("TURSO_DATABASE_URL is not set");
  }

  const client = createClient({
    url: url,
    authToken: authToken,
  });

  console.log("Cleaning up existing data...");
  await client.execute("DELETE FROM ApprovalLog;");
  await client.execute("DELETE FROM Opportunity;");
  await client.execute("DELETE FROM User;");

  const users = [
    { id: 'user_1', name: 'John Submitter', role: 'Submitter', sbu: 'Cardiology' },
    { id: 'user_2', name: 'Alice Manager', role: 'SBU_Manager', sbu: 'Cardiology' },
    { id: 'user_3', name: 'Bob PMO', role: 'PMO', sbu: 'All' },
    { id: 'user_4', name: 'CEO Boss', role: 'Top_Management', sbu: 'All' }
  ];

  console.log("Seeding users...");
  for (const u of users) {
    await client.execute({
      sql: "INSERT INTO User (id, name, role, sbu) VALUES (?, ?, ?, ?)",
      args: [u.id, u.name, u.role, u.sbu]
    });
  }

  console.log('Database seeded with mock users.');
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e.message);
    process.exit(1);
  });
