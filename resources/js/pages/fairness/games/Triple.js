import Seed from "../utils/Seed";

/**
 * Verifies a triple game.
 * @class
 */
export default class Triple {

    /**
     * Verifies a triple roll by returning the numbers of icons for a given seed_data object.
     * @param {Object} seed_data
     * @param {string} seed_data.serverSeed
     * @param {string} seed_data.clientSeed
     * @param {integer} seed_data.nonce
     * @return {float} the float
     */
    verify(seed_data) {
        const icons = [0,1,2];
        const max_gems = 36;
        const str = Seed.extractFloats(seed_data, max_gems).map((cardIndex) => icons[Math.floor(cardIndex * 3)]);
		const string = str.toString().replace(/0/g,"orange").replace(/1/g,"blue").replace(/2/g,"purple");
		return string.split(',');
    }

}
