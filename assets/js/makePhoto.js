const enableNavigator = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                //video.src = window.URL.createObjectURL(stream);
                video.srcObject = stream;
                video.play();
            });
    }
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
};

window.onload = (event) => {
    let makePhoto = document.getElementById('make-photo');
    let loadPicture = document.getElementById('load-picture');

    makePhoto.onclick = () => {
        // `{ audio: true }`
        let photoContainer = document.querySelector('.make-photo-container');
        photoContainer.innerHTML = '\n' +
            '<video id="video" width="640" height="480" autoplay></video>\n' +
            '<button id="snap">Snap Photo</button>\n' +
            '<canvas id="canvas" width="640" height="480"></canvas>';
        enableNavigator();
        let canvas = document.getElementById('canvas');
        let context = canvas.getContext('2d');
        let video = document.getElementById('video');
        document.getElementById("snap").addEventListener("click", () => {
            context.drawImage(video, 0, 0, 640, 480);
        });
    };

    loadPicture.onclick = () => {
        let body = document.querySelector('.make-photo-container');
        body.innerHTML =
            '<input id="file-input" type="file" value="Load file">' +
            // '<canvas id="canvas" width="640" height="480"></canvas>' +
            '<canvas id="c1" width="200" height="200"></canvas>' +
            '<canvas id="c2" width="200" height="200"></canvas>' +
            '<button id="snap">Snap Photo</button>';
        let canvas = document.getElementById('canvas');
        let context = canvas.getContext('2d');
        document.getElementById('file-input').onchange = (ev) => {
            var file = ev.target.files[0];
            var fr = new FileReader();
            fr.onload = () => {
                img = new Image();
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img,0,0);
                };
                img.src = fr.result;
                // canvas.toDataURL("image/png");  // get the data URL
            };
            fr.readAsDataURL(file);
        };
    };
};
