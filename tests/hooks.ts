import { Done } from 'mocha';
import app from '../src/app';

export const mochaHooks = {
    beforeAll: (done: Done) => {
        app.on('started', () => { done(); });
    }
};
