var startTime;

var msg = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();
msg.voice = voices[0]; // Note: some voices don't support altering params
msg.voiceURI = 'native';
msg.volume = 1; // 0 to 1
msg.rate = 1; // 0.1 to 10

msg.lang = 'en-US';

msg.onstart = () => {
  startTime = performance.now();
};

var speak = (word, cb) => {
  msg.text = word;
  speechSynthesis.speak(msg);

  msg.onend = event => {
    cb(performance.now() - startTime);
  };
};

module.exports = {
  speak : speak
};