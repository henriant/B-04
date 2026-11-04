import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { createApiClient } from '../packages/api-client/src/index.js'

// Could not figure out how to connect to .env file in root, so its hard coded in for now
let API_URL = "http://localhost:8790/";

describe('Testing user functions against database through API', () => {
    const db = createApiClient(API_URL);

    test.todo('Create user')

    test.todo('Add game to user library')

    test.todo('Read user data')

    test.todo('Delete user profile')
})