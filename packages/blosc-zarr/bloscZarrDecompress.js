import {
  runPipeline,
  InterfaceTypes,
  WorkerPool,
  getPipelinesBaseUrl,
  getPipelineWorkerUrl,
} from 'itk-wasm';
import { getSize } from '@itk-viewer/wasm-utils/dtypeUtils.js';

const cores = navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4;
const numberOfWorkers = cores + Math.floor(Math.sqrt(cores));
const workerPool = new WorkerPool(numberOfWorkers, runPipeline);

/**
 * Input:
 *
 *   chunkData: An Array of
 *
 *     {
 *       data: chunkArrayBuffer,
 *       metadata: zarrayMetadata
 *     }
 *
 *   objects.
 *
 *
 * Output:
 *
 *   An Array of decompressed ArrayBuffer chunks.
 */
export async function bloscZarrDecompress(chunkData) {
  const options = {
    pipelineBaseUrl: getPipelinesBaseUrl(),
    pipelineWorkerUrl: getPipelineWorkerUrl(),
  };
  const desiredOutputs = [{ type: InterfaceTypes.BinaryStream }];
  const taskArgsArray = [];
  let dtype = null;
  for (let index = 0; index < chunkData.length; index++) {
    const zarrayMetadata = chunkData[index].metadata;
    const compressedChunk = chunkData[index].data;
    dtype = zarrayMetadata.dtype;
    const nElements = zarrayMetadata.chunks.reduce((a, b) => a * b);
    const elementSize = getSize(dtype);
    if (!elementSize) throw Error('Unknown dtype in .zarray metadata');
    const outputSize = nElements * elementSize;
    const inputs = [
      {
        type: InterfaceTypes.BinaryStream,
        data: { data: new Uint8Array(compressedChunk) },
      },
    ];
    const args = [
      '0',
      '0',
      zarrayMetadata.compressor.cname,
      compressedChunk.byteLength.toString(),
      '--output-size',
      outputSize.toString(),
      '--decompress',
      '--memory-io',
    ];
    taskArgsArray.push(['BloscZarr', args, desiredOutputs, inputs, options]);
  }
  const results = await workerPool.runTasks(taskArgsArray).promise;

  return results.map((result) => result.outputs[0].data.data.buffer);
}
