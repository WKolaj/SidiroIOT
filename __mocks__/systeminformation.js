const { snooze } = require("../utilities/utilities");

module.exports._currentLoadData = {
  avgload: 0.17,
  currentload: 11.246941761408309,
  currentload_user: 9.236942873508756,
  currentload_system: 1.9879633300731656,
  currentload_nice: 0.02103555782638756,
  currentload_idle: 88.7540582385917,
  currentload_irq: 0,
  raw_currentload: 87249300,
  raw_currentload_user: 71662900,
  raw_currentload_system: 15423200,
  raw_currentload_nice: 163200,
  raw_currentload_idle: 688579900,
  raw_currentload_irq: 0,
  cpus: [
    {
      load: 11.21567690679275,
      load_user: 9.288497259094822,
      load_system: 1.903291969209606,
      load_nice: 0.02388767848832181,
      load_idle: 88.78432309320725,
      load_irq: 0,
      raw_load: 10892800,
      raw_load_user: 9021100,
      raw_load_system: 1848500,
      raw_load_nice: 23200,
      raw_load_idle: 86228400,
      raw_load_irq: 0,
    },
    {
      load: 11.385055147229057,
      load_user: 9.501436945710925,
      load_system: 1.8782675980832493,
      load_nice: 0.005350603434881613,
      load_idle: 88.61494485277093,
      load_irq: 0,
      raw_load: 11064600,
      raw_load_user: 9234000,
      raw_load_system: 1825400,
      raw_load_nice: 5200,
      raw_load_idle: 86120700,
      raw_load_irq: 0,
    },
    {
      load: 11.215319609499343,
      load_user: 9.36148060202699,
      load_system: 1.84941506178606,
      load_nice: 0.0044239456862928675,
      load_idle: 88.78468039050065,
      load_irq: 0,
      raw_load: 10901100,
      raw_load_user: 9099200,
      raw_load_system: 1797600,
      raw_load_nice: 4300,
      raw_load_idle: 86297200,
      raw_load_irq: 0,
    },
    {
      load: 11.594483496602932,
      load_user: 9.49899082005369,
      load_system: 2.01398799393347,
      load_nice: 0.08150468261576944,
      load_idle: 88.40551650339708,
      load_irq: 0,
      raw_load: 11138600,
      raw_load_user: 9125500,
      raw_load_system: 1934800,
      raw_load_nice: 78300,
      raw_load_idle: 84929500,
      raw_load_irq: 0,
    },
    {
      load: 11.0597863852786,
      load_user: 8.717436623343199,
      load_system: 2.3368935786900016,
      load_nice: 0.0054561832453995625,
      load_idle: 88.9402136147214,
      load_irq: 0,
      raw_load: 10743200,
      raw_load_user: 8467900,
      raw_load_system: 2270000,
      raw_load_nice: 5300,
      raw_load_idle: 86394300,
      raw_load_irq: 0,
    },
    {
      load: 11.070547923271528,
      load_user: 9.02982014117229,
      load_system: 2.010357042137852,
      load_nice: 0.030370739961385774,
      load_idle: 88.92945207672848,
      load_irq: 0,
      raw_load: 10716700,
      raw_load_user: 8741200,
      raw_load_system: 1946100,
      raw_load_nice: 29400,
      raw_load_idle: 86087000,
      raw_load_irq: 0,
    },
    {
      load: 11.136842256874107,
      load_user: 9.215579562908879,
      load_system: 1.9086085942941329,
      load_nice: 0.012654099671096288,
      load_idle: 88.86315774312588,
      load_irq: 0,
      raw_load: 10825200,
      raw_load_user: 8957700,
      raw_load_system: 1855200,
      raw_load_nice: 12300,
      raw_load_idle: 86376500,
      raw_load_irq: 0,
    },
    {
      load: 11.293086227029432,
      load_user: 9.28430062174736,
      load_system: 2.003431040412549,
      load_nice: 0.00535456486952367,
      load_idle: 88.70691377297057,
      load_irq: 0,
      raw_load: 10967100,
      raw_load_user: 9016300,
      raw_load_system: 1945600,
      raw_load_nice: 5200,
      raw_load_idle: 86146300,
      raw_load_irq: 0,
    },
  ],
};

module.exports._currentTemperatureData = { main: 44, cores: [], max: 45 };

module.exports._currentMemoryData = {
  total: 16690659328,
  free: 5266665472,
  used: 11423993856,
  active: 6383902720,
  available: 10306756608,
  buffers: 1465044992,
  cached: 4042739712,
  slab: 851005440,
  buffcache: 6358790144,
  swaptotal: 2147479552,
  swapused: 0,
  swapfree: 2147479552,
};

module.exports._currentFSData = [
  {
    fs: "/dev/nvme0n1p6",
    type: "ext4",
    size: 166041890816,
    used: 65114808320,
    use: 39.22,
    mount: "/",
  },
  {
    fs: "/dev/nvme0n1p1",
    type: "vfat",
    size: 310378496,
    used: 32661504,
    use: 10.52,
    mount: "/boot/efi",
  },
];

module.exports.currentLoad = async () => {
  await snooze(10);
  return module.exports._currentLoadData;
};

module.exports.cpuTemperature = async () => {
  await snooze(10);
  return module.exports._currentTemperatureData;
};

module.exports.mem = async () => {
  await snooze(10);
  return module.exports._currentMemoryData;
};

module.exports.fsSize = async () => {
  await snooze(10);
  return module.exports._currentFSData;
};
