/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
import ConfigInstance from '../../src/Config/Private/ConfigInstance';

class validConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('valid', update);
  }
}

class notValidConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('notValid', update);
  }
}

class not_ValidConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('not_Valid', update);
  }
}
