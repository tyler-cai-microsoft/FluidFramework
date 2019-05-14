export function bsearch<T>(array: Readonly<ArrayLike<T>>, value: T, start = 0, end = array.length) {
    while (start < end) {
        // tslint:disable-next-line:no-bitwise - Bitwise ops ~2x faster than 'mid = start + Math.floor((end - start) / 2)'.
        const mid = (start + end) >> 1;
        if (array[mid] < value) {
            start = mid + 1;
        } else {
            end = mid;
        }
    }
    return start;
}
