class ArrayHelper {
    static chunkArray(array: Array<any>, chunkSize: number): Array<Array<any>> {
        const chunkedArray = [];

        while (array.length) {
            chunkedArray.push(array.splice(0, chunkSize));
        }

        return chunkedArray;
    }

    static flatArray(array: Array<Array<any>>): Array<any> {
        return ([] as any[]).concat(...array);
    }
}

export default ArrayHelper;