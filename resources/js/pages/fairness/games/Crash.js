import Seed from "../utils/Seed";

/**
 * Verifies a crash game.
 * @class
 */
export default class Crash {

    /**
     * Verifies a Crash game by returning the stoppage for a given hash and a client seed.
     * @param {Object} seed_data
     * @param {string} seed_data.serverSeed
     * @param {string} seed_data.clientSeed
     * @param {string} seed_data.nonce
     * @return {float} The result
     */
    verify(seed_data) {
        const max_multiplier = 350, house_edge = 0.99;
        const float_point = max_multiplier / (Seed.extractFloat(seed_data) * max_multiplier) * house_edge;
        return (Math.floor(float_point * 100) / 100).toFixed(2);
    }

}
