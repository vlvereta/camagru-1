const issetMediaDevices = () => navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

const initializeMakePhoto = () => {

    document.getElementById("snap").addEventListener("click", () => {
        context.drawImage(video, 0, 0, 640, 480);
    });
};

window.onload = (event) => {
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    let video = document.getElementById('video');

    let makePhoto = document.getElementById('make-photo');
    let loadPicture = document.getElementById('load-picture');

    makePhoto.onclick = () => {
        if (!issetMediaDevices()) {
            //TODO: create pop-up
            return;
        }
        document.getElementById("snap").addEventListener("click", () => {
            context.drawImage(video, 0, 0, 640, 480);
        });
    };

    loadPicture.onclick = () => {
        let body = document.querySelector('.make-photo-container');
        body.innerHTML += '<input type="file" value="Load file">';
    };

    if (issetMediaDevices()) {

        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                //video.src = window.URL.createObjectURL(stream);
                video.srcObject = stream;
                video.play();
            });
    }
};

/* Legacy code below: getUserMedia
else if(navigator.getUserMedia) { // Standard
    navigator.getUserMedia({ video: true }, function(stream) {
        video.src = stream;
        video.play();
    }, errBack);
} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia({ video: true }, function(stream){
        video.src = window.webkitURL.createObjectURL(stream);
        video.play();
    }, errBack);
} else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
    navigator.mozGetUserMedia({ video: true }, function(stream){
        video.srcObject = stream;
        video.play();
    }, errBack);
}
*/
