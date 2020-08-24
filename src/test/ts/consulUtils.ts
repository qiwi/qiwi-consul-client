import {
  ConsulDiscoveryService
} from '../../main/ts'
import { promiseFactory } from '../../main/ts/util'
import * as Bluebird from 'bluebird'
import cxt from '../../main/ts/ctx'
import { ConsulUtils } from '../../main/ts/consulUtils'
import { ConsulClientFactory, testParams } from '../stub/mocks'

describe('ConsulUtils', () => {
  describe('static', () => {
    describe('#normalizeKvValue', () => {
      it('normalize kv value', async () => {
        const value = {
          CreateIndex: 1,
          ModifyIndex: 2,
          LockIndex: 3,
          Key: 'string',
          Flags: 4,
          Value: 'string'
        }

        expect(ConsulUtils.normalizeKvValue(value)).toMatchObject({
          createIndex: 1,
          modifyIndex: 2,
          lockIndex: 3,
          key: 'string',
          flags: 4,
          value: 'string'
        })
      })
    })
    describe('#handleKvValue', () => {
      it('handle kv value', async () => {
        const value = {
          createIndex: 1,
          modifyIndex: 2,
          lockIndex: 3,
          key: 'string',
          flags: 4,
          value: 'string'
        }
        const { resolve, reject, promise } = promiseFactory()

        ConsulUtils.handleKvValue(value, { service: {} },
          // @ts-ignore
          { type: 'kv', data: {}, name: 'service', promise, sequentialErrorCount: 0, watcher: {} }, resolve, reject)
        expect(await promise).toMatchObject({})
      })
    })
    describe('#promisify', () => {
      it('handle kv value', async () => {
        const value = {
          createIndex: 1,
          modifyIndex: 2,
          lockIndex: 3,
          key: 'string',
          flags: 4,
          value: 'string'
        }
        const { resolve, reject, promise } = promiseFactory()

        ConsulUtils.handleKvValue(value, { service: {} },
          // @ts-ignore
          { type: 'kv', data: {}, name: 'service', promise, sequentialErrorCount: 0, watcher: {} }, resolve, reject)
        expect(await promise).toMatchObject({})
      })
    })
    describe('#configure', async () => {
      it('reject on error', async () => {
        const method = (opts, fn) => {
          fn('test reject', null)
        }
        try {
          await ConsulUtils.promisify(method, 'test')
        } catch (e) {
          expect(e).toBe('test reject')
        }
      })

      it('supports custom Promises', async () => {
        ConsulUtils.configure({ Promise: Bluebird })

        const res = new ConsulDiscoveryService(testParams).ready('bar', 'discovery')

        // tslint:disable-next-line:no-floating-promises
        expect(res).toBeInstanceOf(Bluebird)
        expect(cxt.Promise).toBe(Bluebird)
        // tslint:disable-next-line:no-floating-promises
        expect(res).resolves.toEqual(undefined)
      })

      it('supports custom consul client factory', () => {
        ConsulUtils.configure({ Consul: ConsulClientFactory })

        expect(cxt.Consul).toBe(ConsulClientFactory)
      })
    })
  })

})
