const enableNavigator = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
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

const getStickers = () => {
    let propObj = {
        method: 'GET',
        headers: {
            method: 'GET',
            credentials: 'include',
        }
    };
    fetch('/getStickers', propObj)
        .then(e => {
            return e.text();
        })
        .then(e => {
            let container = document.getElementById('sticker-container');
            container.innerHTML = e;
        })
        .then(e => {
            stickerSelect();
        })
        .catch(e => {
            console.log(e);
        });
};

const stickerSelect = (event) => {
    let stickerDivs = Array.from(document.getElementsByClassName('sticker-div'));
    stickerDivs.map((el) => {
        el.onclick = (ev) => {
            let tmpSticker = document.getElementById('selected-sticker');

            if (tmpSticker !== null && tmpSticker !== undefined) {
                tmpSticker.remove();
            }
            let domImage = ev.currentTarget.children[0];

            let selectedSticker = document.createElement('img');
            selectedSticker.id = 'selected-sticker';
            selectedSticker.src = domImage.src;
            selectedSticker.dataset.id = ev.currentTarget.dataset.id;

            let canvasContainer = document.getElementById('canvas-container');
            canvasContainer.appendChild(selectedSticker);

            document.querySelector('button[id="snap"]').style.display = 'block';
        };
    });
};

const snapInit = () => {
    const snapClick = () => {
        let sticker = document.getElementById('selected-sticker');
        const stikerAttributes = {
            "id" : sticker.dataset.id,
            "position": {
                "x": sticker.x,
                "y": sticker.y,
            }
        };
        let canvas = document.getElementById('canvas');
        let image = canvas.toDataURL("image/png");
        let _csrf = document.querySelector("meta[name='csrf-token']").content;
        const imageObject = {
            userImg: image,
            stickerAttrs: stikerAttributes,
            _csrf: _csrf
        };
        let propObj = {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(imageObject)
        };
        fetch('/savePhoto', propObj)
            .then(e => {
                return e.json();
            })
            .then(e => {
                if (e.res === 'error') {
                    return;
                }
                document.getElementById('make-photo-container').innerHTML = '';
                document.getElementById('sticker-container').innerHTML = '';
                document.getElementById('images-container').innerHTML = e.posts;
                window.onload();
            })
            .catch(e => {
                console.log(e);
            });
    };

    let snap = document.getElementById('snap');
    snap.onclick = snapClick;
};

const delButtonsInit = () => {
    let buttons = Array.from(document.getElementsByClassName('delete-picture'));
    let _csrf = document.querySelector("meta[name='csrf-token']").content;
    buttons.forEach(el => {
        el.onclick = event => {
            let pictureId = event.target.id;
            let propObj = {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    'postId': pictureId,
                    _csrf: _csrf
                })
            };
            fetch('/deletePhoto', propObj)
                .then(e => {
                    return e.json();
                })
                .then(e => {
                    let el = document.querySelector(`.image-container[id='${pictureId}'`);
                    el.remove();
                })
                .catch(e => {
                    console.log(e);
                });
        };
    });
};

window.onload = (event) => {
    let makePhoto = document.getElementById('make-photo');
    let loadPicture = document.getElementById('load-picture');

    makePhoto.onclick = () => {
        let photoContainer = document.querySelector('.make-photo-container');
        photoContainer.innerHTML = '\n' +
            '<video id="video" width="640" height="480" autoplay></video>\n' +
            '<button style="display: none" id="snap" class="waves-effect waves-light btn">Snap Photo</button>\n' +
            '<div id="canvas-container"><canvas style="display: none" id="canvas" width="640" height="480"></canvas></div>\n';
        enableNavigator();
        let canvas = document.getElementById('canvas');
        let context = canvas.getContext('2d');
        let video = document.getElementById('video');
        document.getElementById("snap").addEventListener("click", () => {
            context.drawImage(video, 0, 0, 640, 480);
        });
        getStickers();
        snapInit();
    };

    loadPicture.onclick = () => {
        let body = document.querySelector('.make-photo-container');
        body.innerHTML =
            '<input id="file-input" type="file" value="Load file">' +
            '<div id="canvas-container"><canvas id="canvas" width="640" height="480"></canvas></div>' +
            '<button style="display: none" id="snap" class="waves-effect waves-light btn">Snap Photo</button>';
        let canvas = document.getElementById('canvas');
        let context = canvas.getContext('2d');
        document.getElementById('file-input').onchange = (ev) => {
            let file = ev.target.files[0];
            let fr = new FileReader();
            fr.onload = () => {
                let img = new Image();
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img,0,0);
                };
                img.src = fr.result;
            };
            fr.readAsDataURL(file);
        };
        getStickers();
        snapInit();
    };

    delButtonsInit();
};
