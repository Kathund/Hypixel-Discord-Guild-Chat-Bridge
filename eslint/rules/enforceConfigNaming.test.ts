/* eslint-disable @typescript-eslint/no-unused-vars */

import BooleanOption from '../../src/Config/Options/Boolean';
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

class is_validConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('is_valid', update);
  }
}

class is_not_VALIDConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('is_not_VALID', update);
  }
}

class is_not_VALID_Config extends ConfigInstance {
  constructor(update: boolean = false) {
    super('is_not_valid_', update);
  }
}

class validKeyConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('valid', update);
    this.setValue('valid', new BooleanOption(true));
  }
}

class notValidKeyConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('not_valid', update);
    this.setValue('NOT_valid', new BooleanOption(true));
  }
}
