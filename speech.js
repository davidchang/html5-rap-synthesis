var timings = [
  ["Look,", 32915.070999995805],
  ["if", 35594.36899999855],
  ["you", 35737.790999992285],
  ["had", 35946.15099998191],
  ["one", 38058.45599999884],
  ["shot,", 38216.986000014],
  ["or", 40106.07500001788],
  ["one", 40250.127999985125],
  ["opportunity", 40505.83199999528],
  ["To", 42674.43299997831],
  ["seize", 42785.18200002145],
  ["everything", 43025.81299998565],
  ["you", 43442.46900000144],
  ["ever", 43689.67300001532],
  ["wanted.", 43825.80400002189],
  ["one", 45602.052000002004],
  ["moment", 45753.44800000312],
  ["Would", 47937.90800002171],
  ["you", 48105.17400002573],
  ["capture", 48233.80799998995],
  ["it", 48674.27499999758],
  ["or", 50089.68699997058],
  ["just", 50193.534999969415],
  ["let", 50329.965999990236],
  ["it", 50457.91699999245],
  ["slip?", 51010.22799999919],
  ["Yo", 52081.80200000061],
  ["His", 52506.185000005644],
  ["palms", 52914.14700000314],
  ["are", 53113.13399998471],
  ["sweaty,", 53329.724000010174],
  ["knees", 53697.80000002356],
  ["weak,", 54274.228999973275],
  ["arms", 54498.497000022326],
  ["are", 54697.86199997179],
  ["heavy", 54842.15599996969],
  ["There's", 55185.736000014],
  ["vomit", 55738.409999990836],
  ["on", 56026.27899998333],
  ["his", 56202.283999999054],
  ["sweater", 56378.464000008535],
  ["already,", 56570.06300002104],
  ["mom's", 57121.214999991935],
  ["spaghetti", 57458.10099999653],
  ["He's", 57802.02699999791]
];

var debug = false;

var startPoint = 33000;

var i = 0;

var calibrationPhrase = true;

var queueNext, doItForReal;

var msg = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();
msg.voice = voices[0]; // Note: some voices don't support altering params
msg.voiceURI = 'native';
msg.volume = 1; // 0 to 1
msg.rate = 1; // 0.1 to 10

msg.lang = 'en-US';

var allTimes = [];

var time, offset;

msg.onstart = function(event) {
  time = performance.now();

  console.log('offset from "speak" to onstart', time - offset);
};

msg.onend = function(event) {
  time = performance.now() - time;

  if ((i + 1) >= timings.length) {
    debug && console.log('allTimes', allTimes);
    if (calibrationPhrase) {
      return doItForReal();
    }
  }
  allTimes.push(time);
  queueNext();
};

var speak = function(index) {

  offset = performance.now();

  if (!calibrationPhrase) {
    var duration = timings[index + 1][1] - timings[index][1] - 30;
    var originalDuration = allTimes[index];

    if (debug) {
      console.info('word', timings[index][0]);
      console.log('desired duration', duration);
      console.log('original duration', originalDuration);
    }

    if (originalDuration < duration) {
      msg.rate = 1;
    } else {
      debug && console.log('rate', (originalDuration / duration).toFixed(1));

      var rate = (originalDuration / duration).toFixed(1);
      if (rate > 10) {
        rate = 10;
      }

      msg.rate = rate;
    }
  }

  msg.text = timings[index][0];
  speechSynthesis.speak(msg);
};

queueNext = function() {
  speak(i++);
};

doItForReal = function() {
  calibrationPhrase = false;

  console.log('for real now');

  i = 0;
  queueNext();
};

var getVoicesInterval = setInterval(function() {
  voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    return;
  }
  clearInterval(getVoicesInterval);
  msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Fred'; })[0];

  queueNext();
}, 500);