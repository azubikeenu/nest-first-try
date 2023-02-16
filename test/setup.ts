import { rm } from 'fs/promises';
import { join } from 'path';
global.beforeEach(async () => {
  try {
    const fileLocation = join(__dirname, '..', 'test.sqlite')
    await rm(fileLocation);
  } catch (err) {

  }
});
