let mediaRecorder;
let recordedChunks = [];
// audiocontext aanmaken
let audioContext = new AudioContext();
let audioSource;

function startRecording() {
    // opnemen van audio
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = function(event) {
                recordedChunks.push(event.data);
            };
            mediaRecorder.start();
        })
        .catch(function(err) {
            console.error('Error accessing audio stream: ', err);
        });
}
// stop de opname
function stopRecording() {
    mediaRecorder.stop();
}
// afspelen van de opname
function playRecordedAudio() {
    let recordedBlob = new Blob(recordedChunks, { type: 'audio/wav' });
    let fileReader = new FileReader();
    fileReader.onload = function() {
        let arrayBuffer = fileReader.result;
        audioContext.decodeAudioData(arrayBuffer, function(buffer) {
            audioSource = audioContext.createBufferSource();
            audioSource.buffer = buffer;
            audioSource.connect(audioContext.destination);
            audioSource.start(0);
        });
    };
    fileReader.readAsArrayBuffer(recordedBlob);
}