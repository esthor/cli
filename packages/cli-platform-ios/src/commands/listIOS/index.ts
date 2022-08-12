/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {execFileSync} from 'child_process';
import {logger} from '@react-native-community/cli-tools';
import {Device} from '../../types';

function findAvailableDevices(devices: {[index: string]: Array<Device>}) {
  // TODO -- It would be cool to separate out the Apple Watch, iOS, iPad, TV, and others...
  let availableDevices = [];
  for (const key of Object.keys(devices)) {
    for (const device of devices[key]) {
      if (
        device.availability === '(available)' ||
        device.isAvailable === true
      ) {
        availableDevices.push(device.name);
      }
    }
  }
  return availableDevices;
}

async function listIOS() {
  const rawDevices = execFileSync(
    'xcrun',
    ['simctl', 'list', 'devices', '--json'],
    {encoding: 'utf8'},
  );

  const {devices} = JSON.parse(rawDevices) as {
    devices: {[index: string]: Array<Device>};
  };

  const availableDevices = findAvailableDevices(devices);
  if (availableDevices === null) {
    logger.error('No available iOS devices found');
    return;
  }
  logger.info(JSON.stringify(availableDevices));
}

export default {
  name: 'list-ios',
  description: 'lists available iOS devices',
  func: listIOS,
};
