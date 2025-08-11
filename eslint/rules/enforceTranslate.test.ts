import Embed from '../../src/Discord/Private/Embed';
import ReplaceVariables from '../../src/Private/ReplaceVariables';
import Translate from '../../src/Private/Translate';

console.warn('Test');
console.warn(Translate('console'));
console.warn(ReplaceVariables(Translate(Translate('console')), {}));

new Embed().setTitle('fu');
new Embed().setTitle(Translate('console'));
new Embed().setTitle(ReplaceVariables(Translate('console'), {}));

new Embed().setDescription('fu');
new Embed().setDescription(Translate('console'));
new Embed().setDescription(ReplaceVariables(Translate('console'), {}));
