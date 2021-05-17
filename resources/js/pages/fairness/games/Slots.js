import Seed from "../utils/Seed";

/**
 * Verifies a slots game.
 * @class
 */
export default class Slots {

    /**
     * @param {Object} seed_data
     * @param {string} seed_data.serverSeed
     * @param {string} seed_data.clientSeed
     * @param {integer} seed_data.nonce
     * @return {object}
     */
    verify(seed_data) {
								for (
                                var result = [], 
								icons = ['apple', 'bananas', 'cherry', 'grapes', 'orange', 'pineapple', 'strawberry', 'watermelon', 'lemon', 'kiwi', 'raspberry', 'wild', 'scatter'],
								floats = Seed.extractFloats(seed_data, 15), 
								total = 0, 
								z = 0;
                                z < 5;
                                z++
                                ) 
							{
                                for (var i = [], s = 0; s < 3; s++) 
								i.push(icons[Math.floor(floats[total] * icons.length)]), total++;
                                result.push(i);
                            }
                            return result;
    }

}