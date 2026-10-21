const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  try {
    const c = await p.church.count();
    const u = await p.user.count();
    const g = await p.group.count();
    console.log('DB OK -> churches:', c, ' users:', u, ' groups:', g);
  } catch (e) {
    console.log('DB ERROR:', String(e.message).split('\n')[0]);
  } finally {
    await p.$disconnect();
  }
})();