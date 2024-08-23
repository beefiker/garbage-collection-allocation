const type = +process.argv[2] || 0; // 0 = spread, 1 = object store
const count = +process.argv[3] || 1000;
const keyCount = +process.argv[4] || 10;

class ProgressBar {
  constructor() {
    this.total;
    this.current;
    this.barLen = process.stdout.columns - 100;
  }

  init(total) {
    this.total = total;
    this.current = 0;
    this.update(this.current);
  }

  update(current) {
    this.current = current;
    const currentProgress = this.current / this.total;
    this.draw(currentProgress);
  }

  draw(currentProgress) {
    const filledBarLen = (currentProgress * this.barLen).toFixed(0);
    const emptyBarLen = this.barLen - filledBarLen;

    const filledBar = this.fillBar(filledBarLen, "\u2588");
    const emptyBar = this.fillBar(emptyBarLen, "\u2591");
    const percentage = (currentProgress * 100).toFixed(2);

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(
      `Current progress: [${filledBar}${emptyBar}] | ${percentage}%`
    );
  }

  finish() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }

  fillBar(length, char) {
    let str = "";
    for (let i = 0; i < length; i++) {
      str += char;
    }
    return str;
  }
}

function objKey5() {
  return {
    prop1: true,
    prop2: "its a string",
    prop3: 0x123456,
    prop4: null,
    prop5: {},
  };
}

function objKey10() {
  return {
    prop1: true,
    prop2: "its a string",
    prop3: 0x123456,
    prop4: null,
    prop5: {},
    prop6969: [1, 2, 3, 4, 5],
    prop7474: new Date(),
    prop2680: Symbol("gaaaarbage"),
    prop1234: () => {},
    prop1004: NaN,
  };
}

function copy5(prop, prop2) {
  prop2.prop1 = prop.prop1;
  prop2.prop2 = prop.prop2;
  prop2.prop3 = prop.prop3;
  prop2.prop4 = prop.prop4;
  prop2.prop5 = prop.prop5;
}

function copy10(prop, prop2) {
  prop2.prop1 = prop.prop1;
  prop2.prop2 = prop.prop2;
  prop2.prop3 = prop.prop3;
  prop2.prop4 = prop.prop4;
  prop2.prop5 = prop.prop5;
  prop2.prop6969 = prop.prop6969;
  prop2.prop7474 = prop.prop7474;
  prop2.prop2680 = prop.prop2680;
  prop2.prop1234 = prop.prop1234;
  prop2.prop1004 = prop.prop1004;
}

class ObjectStore {
  constructor(factory) {
    this.factory = factory;
    this.pool = [];
    this.len = 0;
  }

  pop() {
    if (this.len > 0) {
      const out = this.pool[this.len - 1];
      this.len--;
      return out;
    }

    return this.factory();
  }

  pushAll(items) {
    for (let i = 0; i < items.length; ++this.len, ++i) {
      this.pool[this.len] = items[i];
    }
  }
}

const store = new ObjectStore(keyCount === 5 ? objKey5 : objKey10);
const copy = keyCount === 5 ? copy5 : copy10;

function copyViaSomething(prop) {
  if (type === 0) {
    // 0 = spread, 1 = object store
    return { ...prop };
  }

  const existingObj = store.pop();
  copy(prop, existingObj);
  return existingObj;
}

const temporaryMemory = [];

const start = Date.now();
let totalCount = 0;

function run() {
  const howMuch = 100;
  const props = keyCount === 5 ? objKey5() : objKey10();
  let collectTime = Date.now() + howMuch;

  while (true) {
    for (let i = 0; i < howMuch; ++i) {
      temporaryMemory.push(copyViaSomething(props));
    }
    totalCount += howMuch;
    const now = Date.now();
    if (collectTime < now) {
      collectTime += howMuch;
      collect();
    }
  }
}

function result() {
  const now = Date.now();
  console.log(
    `Took ${now - start}ms to run ${totalCount} actions. ${Math.floor(
      totalCount / (now - start)
    )} actions per second.`
  );
  console.log(
    `Memory usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
      2
    )}MB`
  );
  process.exit();
}

const Bar = new ProgressBar();
Bar.init(count);

let runCount = 0;

function collect() {
  if (runCount > count) {
    Bar.finish();
    result();
  }
  Bar.update(runCount);
  runCount++;
  store.pushAll(temporaryMemory);
  temporaryMemory.length = 0;
}

run();
