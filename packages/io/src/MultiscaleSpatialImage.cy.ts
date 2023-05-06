import { Image, setPipelineWorkerUrl, setPipelinesBaseUrl } from 'itk-wasm';
import { ZarrMultiscaleSpatialImage } from './ZarrMultiscaleSpatialImage.js';

const SAMPLE_SIZE = 33;
const takeSnapshot = ({ data, metadata, ...rest }: Image) => {
  if (!data) return '';
  const innerOffset = data.length / 2;
  const baseline = {
    ...rest,
    data: [
      ...data.slice(0, SAMPLE_SIZE),
      ...data.slice(innerOffset, innerOffset + SAMPLE_SIZE),
      ...data.slice(-SAMPLE_SIZE),
    ],
  };
  return JSON.stringify(baseline);
};

const IMAGE_BASELINES = [
  [
    '/astronaut.zarr',
    [
      Number.MAX_VALUE,
      -Number.MAX_VALUE, // X
      Number.MAX_VALUE,
      -Number.MAX_VALUE, // Y
      Number.MAX_VALUE,
      -Number.MAX_VALUE, // Z
    ],
    '{"imageType":{"dimension":2,"pixelType":"VariableLengthVector","componentType":"float32","components":3},"origin":[0,0],"spacing":[8,8],"direction":{"0":1,"1":0,"2":0,"3":1},"size":[256,256],"ranges":[[0,0.9763471484184265],[0,0.9741398692131042],[0,0.9760480523109436]],"data":[0.6908552050590515,0.6688187122344971,0.674207329750061,0.27221277356147766,0.2442161589860916,0.30864495038986206,0.04838373512029648,0.021947167813777924,0.11139355599880219,0.12586522102355957,0.08368028700351715,0.2073654979467392,0.29955506324768066,0.26995500922203064,0.3033413887023926,0.4970903694629669,0.46638235449790955,0.4774773120880127,0.6510546803474426,0.6293986439704895,0.6291141510009766,0.652686595916748,0.6369064450263977,0.6407243609428406,0.6563014984130859,0.645758330821991,0.6505763530731201,0.6664388179779053,0.6574797630310059,0.6628299951553345,0.6745269298553467,0.6657060384750366,0.6709856390953064,0.702728271484375,0.6728822588920593,0.6759136915206909,0.3145504593849182,0.27835237979888916,0.33366164565086365,0.12892097234725952,0.08835494518280029,0.16398540139198303,0.18125581741333008,0.09787159413099289,0.20692530274391174,0.32659101486206055,0.250407338142395,0.27853235602378845,0.5059590339660645,0.4235151708126068,0.41403526067733765,0.64797443151474,0.5656358003616333,0.5444427728652954,0.650419294834137,0.5713972449302673,0.5587600469589233,0.6266179084777832,0.5702376365661621,0.5665257573127747,0.6173701882362366,0.57239830493927,0.5740906596183777,0.6674000024795532,0.6029467582702637,0.594350278377533,1.0168959424516899e-11,1.3201037485366385e-11,7.667253984489086e-12,6.150961359176199e-13,6.375242673183068e-13,1.862368982988305e-12,2.6472281398209896e-13,2.687519803055982e-13,1.9147365442305497e-13,8.121141834103313e-15,7.599267894640993e-15,1.278036429805526e-14,1.6719174311674578e-7,1.4385383906301286e-7,1.528643451820244e-7,0.0015648636035621166,0.0013919497141614556,0.0013295512180775404,0.10193789750337601,0.09551996737718582,0.08835914731025696,0.20549945533275604,0.19322900474071503,0.15210646390914917,0.15297368168830872,0.13750818371772766,0.10394243896007538,0.22972600162029266,0.21356536448001862,0.18998141586780548,0.17018358409404755,0.15841108560562134,0.15074452757835388]}',
  ],
  [
    '/astronaut.zarr',
    [
      100,
      -Number.MAX_VALUE, // X
      Number.MAX_VALUE,
      200, // Y
      Number.MAX_VALUE,
      -Number.MAX_VALUE, // Z
    ],
    '{"imageType":{"dimension":2,"pixelType":"VariableLengthVector","componentType":"float32","components":3},"origin":[0,200],"spacing":[8,8],"direction":{"0":1,"1":0,"2":0,"3":1},"size":[14,231],"ranges":[[0.027741413563489914,0.9305924773216248],[0.009815634228289127,0.8219987154006958],[0.03106931783258915,0.8618532419204712]],"data":[0.8434163331985474,0.8005973696708679,0.8331800699234009,0.7815706133842468,0.7346546649932861,0.7513733506202698,0.6643561124801636,0.6075320243835449,0.5917041301727295,0.6853213310241699,0.6227045059204102,0.6025393605232239,0.6865707039833069,0.6216851472854614,0.6030192971229553,0.6473481059074402,0.5493790507316589,0.5326882004737854,0.4837162494659424,0.21639575064182281,0.23379985988140106,0.4325582981109619,0.05030425265431404,0.11512165516614914,0.4712345004081726,0.052832502871751785,0.11249638348817825,0.5143463015556335,0.06659615784883499,0.09130306541919708,0.4708518385887146,0.0675983726978302,0.10576199740171432,0.6128345131874084,0.5687515735626221,0.5649264454841614,0.6761928796768188,0.6405994892120361,0.616477906703949,0.7017715573310852,0.6674644947052002,0.6350312829017639,0.7152020335197449,0.6786738038063049,0.6512665748596191,0.7224043011665344,0.684797465801239,0.6600486636161804,0.727691113948822,0.6899614334106445,0.666928231716156,0.7366620898246765,0.6999374032020569,0.677337646484375,0.43325045704841614,0.38873860239982605,0.527625560760498,0.1498635858297348,0.09285452961921692,0.3016122281551361,0.1429762840270996,0.08937985450029373,0.3059288561344147,0.08375998586416245,0.03814108297228813,0.1900119036436081,0.4801272451877594,0.11964694410562515,0.1514689326286316,0.46954914927482605,0.082619309425354,0.0762876570224762,0.5867084860801697,0.1747123748064041,0.034656163305044174,0.614237904548645,0.16455063223838806,0.033633943647146225,0.6534176468849182,0.19214867055416107,0.07890287041664124,0.5566028952598572,0.1690547615289688,0.08912341296672821,0.4563755393028259,0.13142666220664978,0.07666008919477463,0.5841031670570374,0.20222604274749756,0.11976894736289978,0.7241355180740356,0.29688942432403564,0.1723022609949112,0.6470702886581421,0.2434939593076706,0.12110405415296555,0.346635103225708,0.11826460063457489,0.09175870567560196]}',
  ],
  [
    '/ome-ngff-prototypes/single_image/v0.4/zyx.ome.zarr',
    [
      1000,
      2000, // X
      1000,
      2000, // Y
      Number.MAX_VALUE,
      -Number.MAX_VALUE, // Z
    ],
    '{"imageType":{"dimension":3,"pixelType":"Scalar","componentType":"uint8","components":1},"name":"zyx","origin":[768,768,0],"spacing":[256,256,256],"direction":{"0":1,"1":0,"2":0,"3":0,"4":1,"5":0,"6":0,"7":0,"8":1},"size":[6,6,151],"ranges":[[0,199]],"data":[0,0,0,0,0,0,4,8,7,13,28,15,15,26,41,38,106,85,49,70,68,60,116,109,78,101,91,102,164,117,123,140,116,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}',
  ],
] as const;

describe(`MultiscaleSpatialImage`, () => {
  const pipelineWorkerUrl = '/itk/web-workers/bundles/pipeline.worker.js';
  setPipelineWorkerUrl(pipelineWorkerUrl);
  const pipelineBaseUrl = '/itk/pipelines';
  setPipelinesBaseUrl(pipelineBaseUrl);
  for (const [path, bounds, baseline] of IMAGE_BASELINES) {
    it(`Assembles chunks into world bounded ItkImage ZarrMultiscaleSpatialImage`, () => {
      const storeURL = new URL(path, document.location.origin);
      cy.wrap(ZarrMultiscaleSpatialImage.fromUrl(storeURL))
        .then((zarrImage) =>
          zarrImage.getImage(zarrImage.scaleInfos.length - 1, bounds)
        )
        .then((itkImage) =>
          expect(takeSnapshot(itkImage)).to.deep.equal(baseline)
        );
    });
  }
});
