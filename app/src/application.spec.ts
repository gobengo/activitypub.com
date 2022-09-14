import test from 'ava';
import { createActivityPubComApplication } from './application.js';
import { DidWebTest } from './test-did-web.js';

test('application is resolvable via did:web', new DidWebTest(() => createActivityPubComApplication().listen(0)).test)
