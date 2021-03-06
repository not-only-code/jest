/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 * @flow
 */

'use strict';

import runJest from '../runJest';
import os from 'os';
import path from 'path';
const {cleanup, writeFiles} = require('../utils');

const skipOnWindows = require('../../scripts/skip_on_windows');
const DIR = path.resolve(os.tmpdir(), 'jest_path_pattern_reporter_message');

skipOnWindows.suite();

beforeEach(() => cleanup(DIR));
afterEach(() => cleanup(DIR));

test('prints a message with path pattern at the end', () => {
  writeFiles(DIR, {
    '.watchmanconfig': '',
    '__tests__/a.test.js': `test('a', () => {});`,
    '__tests__/b.test.js': `test('b', () => {});`,
    'package.json': '{}',
  });
  let stderr;

  ({stderr} = runJest(DIR, ['a']));
  expect(stderr).toMatch('Ran all test suites matching /a/i');

  ({stderr} = runJest(DIR, ['a', 'b']));
  expect(stderr).toMatch('Ran all test suites matching /a|b/i');

  ({stderr} = runJest(DIR, ['--testPathPattern', 'a']));
  expect(stderr).toMatch('Ran all test suites matching /a/i');

  ({stderr} = runJest(DIR, ['--testPathPattern', 'a|b']));
  expect(stderr).toMatch('Ran all test suites matching /a|b/i');
});
