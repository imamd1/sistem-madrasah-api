const db = require('../utils/db')
const {nanoid} = require('nanoid')

async function seed() {
  console.log("Seeding roles...");
  const userId = `user-${nanoid(10)}`
  const createdAt = new Date().toISOString();

  const roles = ['Superadmin', 'Admin', 'Orangtua'];

  const values = roles.map(role => {
    const id = nanoid(4);
    return `('${id}', '${role}', '${createdAt}', '${createdAt}')`;
  }).join(',');

  const query = `
    INSERT INTO roles (id, name, created_at, updated_at)
    VALUES ${values}
    ON CONFLICT (id) DO NOTHING
  `;

  
  await db.query(query);

  console.log("✅ Seeding roles done.");
  process.exit();
}

seed().catch(err => {
  console.error('Seeding Failed: ',err)
  process.exit(1)
})