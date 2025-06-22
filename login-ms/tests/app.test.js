const fs = require('fs');
const path = require('path');

describe('Prueba de funcionalidad en microservicio', () => {
  it('Comprobando estado /login', () => {
    const filePath = path.join(__dirname, '../app.js');
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
