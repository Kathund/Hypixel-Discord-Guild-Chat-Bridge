/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import BooleanOption from '../../src/Config/Options/Boolean.js';
import ConfigInstance from '../../src/Config/Private/ConfigInstance.js';

// @ts-expect-error
class validConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('valid', update);
  }
}

// @ts-expect-error
class notValidConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('notValid', update);
  }
}

// @ts-expect-error
class is_validConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('is_valid', update);
  }
}

// @ts-expect-error
class is_not_VALIDConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('is_not_VALID', update);
  }
}

// @ts-expect-error
class is_not_VALID_Config extends ConfigInstance {
  constructor(update: boolean = false) {
    super('is_not_valid_', update);
  }
}

// @ts-expect-error
class validKeyConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('valid', update);
    this.setValue('valid', new BooleanOption(true));
  }
}

// @ts-expect-error
class notValidKeyConfig extends ConfigInstance {
  constructor(update: boolean = false) {
    super('not_valid', update);
    this.setValue('NOT_valid', new BooleanOption(true));
  }
}
