import webWorkerPromiseWorkerPool from './webWorkerPromiseWorkerPool';
import { createRangeHelper } from './createRangeHelper';

const haveSharedArrayBuffer =
  typeof globalThis.SharedArrayBuffer === 'function';

const numberOfWorkers =
  navigator.hardwareConcurrency != undefined
    ? Math.min(navigator.hardwareConcurrency, 8)
    : 4;

const computeRangeWorkerPool = webWorkerPromiseWorkerPool(
  numberOfWorkers,
  () =>
    new Worker(new URL('./ComputeRanges.worker.js', import.meta.url), {
      type: 'module',
    }),
  'computeRanges',
);

export async function computeRanges(values, numberOfComponents = 1) {
  const numberOfSplits = numberOfWorkers;

  const taskArgs = new Array(numberOfSplits);
  if (haveSharedArrayBuffer && values.buffer instanceof SharedArrayBuffer) {
    for (let split = 0; split < numberOfSplits; split++) {
      taskArgs[split] = [
        {
          split,
          numberOfSplits,
          values,
          numberOfComponents,
        },
      ];
    }
  } else {
    let arrayStride = Math.floor(values.length / numberOfSplits) || 1;
    // include all components of last pixel
    arrayStride += numberOfComponents - (arrayStride % numberOfComponents);
    let arrayIndex = 0;
    for (let split = 0; split < numberOfSplits; split++) {
      const arrayStart = arrayIndex;
      const arrayEnd = Math.min(arrayIndex + arrayStride, values.length);
      const subArray = values.slice(arrayStart, arrayEnd);
      taskArgs[split] = [
        {
          split: 0, // 0 because array already split
          numberOfSplits: 1,
          values: subArray,
          numberOfComponents,
        },
        [subArray.buffer],
      ];
      arrayIndex += arrayStride;
    }
  }

  const rangesBySplit = await computeRangeWorkerPool.runTasks(taskArgs).promise;

  const helpers = [...Array(numberOfComponents)].map(createRangeHelper);
  rangesBySplit.forEach(({ result: ranges }) => {
    ranges.forEach(({ min, max }, compIdx) => {
      helpers[compIdx].add(min);
      helpers[compIdx].add(max);
    });
  });

  return helpers.map((h) => h.getRange());
}
