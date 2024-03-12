import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
    constructor () {
        this.client = createClient();
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.client.on("error", (err) => {
            console.log(err);
        });
        this.client.on("connect", () => {});
    }

    isAlive() {
        return this.client.connected;
    }

    async get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, value) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(value);
                }
            });
        });
    }

    async set(key, value, duration) {
        return new Promise((resolve, reject) => {
            this.client.set(key, value, 'EX', duration, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    }

    async del(key) {
        return new Promise((resolve, reject) => {
            this.client.del(key, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }
}

const redisClient = new RedisClient();

export default redisClient;