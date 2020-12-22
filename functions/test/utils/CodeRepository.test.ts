import CodeRepository from "../../src/utils/CodeRepository";
import {anything, spy, when} from "ts-mockito";
import {expect} from "chai";

describe('CodeRepository tests', () => {
    it('check exists is false', async () => {
        const
            repository = new CodeRepository(),
            codes = ['100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111'],
            spiedRepository = spy(repository);

        when(spiedRepository.existsHashedCodes(anything())).thenReturn(new Promise(resolve => resolve(false)));

        const exists = await repository.exists(codes);

        expect(exists).to.be.eq(false);
    });

    it('check exists is true', async () => {
        const
            repository = new CodeRepository(),
            codes = ['100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111'],
            spiedRepository = spy(repository);

        when(spiedRepository.existsHashedCodes(anything())).thenReturn(new Promise(resolve => resolve(true)));

        const exists = await repository.exists(codes);

        expect(exists).to.be.eq(true);
    });
});
