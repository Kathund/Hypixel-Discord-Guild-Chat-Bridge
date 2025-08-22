/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import Embed from '../../src/Discord/Private/Embed';
import ReplaceVariables from '../../src/Private/ReplaceVariables';
import Translate from '../../src/Private/Translate';
import { Request, Response } from 'express';

console.warn('Test');
console.warn(Translate('console'));
console.warn(ReplaceVariables(Translate(Translate('console')), {}));

const embed = new Embed().setTitle('fu');

new Embed().setTitle('fu');
new Embed().setTitle(Translate('console'));
new Embed().setTitle(ReplaceVariables(Translate('console'), {}));
new Embed().setTitle(ReplaceVariables(Translate('console'), {})).setDescription('fu');
new Embed().setTitle(ReplaceVariables(Translate('console'), {})).setDescription(Translate('console'));
new Embed()
  .setTitle(ReplaceVariables(Translate('console'), {}))
  .setDescription(ReplaceVariables(Translate('console'), {}));

new Embed().setDescription('fu');
new Embed().setDescription(Translate('console'));
new Embed().setDescription(ReplaceVariables(Translate('console'), {})).setTitle('fu');
new Embed().setDescription(ReplaceVariables(Translate('console'), {})).setTitle(Translate('console'));
new Embed()
  .setDescription(ReplaceVariables(Translate('console'), {}))
  .setTitle(ReplaceVariables(Translate('console'), {}));

(req: Request, res: Response) => {
  res.send({ message: 'fail' });
  res.send({ message: Translate('console') });
  res.send({ message: null });
  res.send({ success: true, message: null });

  res.status(200).send({ message: 'fail' });
  res.status(200).send({ message: Translate('console') });
  res.status(200).send({ message: null });

  res.status(200).send({ success: true, message: null });

  return res.status(500).send({ success: false, data: null, message: "Client isn't ready. Please try again latter" });
};
