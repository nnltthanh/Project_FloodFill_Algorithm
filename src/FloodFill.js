
var canvas = document.getElementById("canvas")
var context = canvas.getContext('2d', { willReadFrequently: true })
var canvas_display = document.getElementById("canvas-display")
const uploader = document.querySelector('#uploader');
canvas.setAttribute('width', '800');
canvas.setAttribute('height', '600');
// canvas_display.setAttribute('width', '400');
// canvas_display.setAttribute('height', '300');
// var m = 0, n = 0;
// m = canvas.width/5;
// n = canvas.height/5;

function getElementPosition(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        }
        while (obj = obj.offsetParent);
        return {x: curleft , y: curtop};
    }

    return undefined;
}


function getElementLocation(element, event) {
    var pos = getElementPosition(element);

    return {
        x: (event.pageX - pos.x),
        y: (event.pageY - pos.y)
    };
}

function rgbToHex(r, g, b) {
    var hex = ((r << 16) | (g << 8) | b).toString(16);
    return "#" + ("000000" + hex).slice(-6);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


function drawImageFromWebUrl() {
    // const canvas = document.querySelector('#canvas');
    
    pixelImg = []
    // const uploader = document.querySelector('#uploader');
    uploader.addEventListener('change',(e)=>{
        context.clearRect(0,0,canvas.width,canvas.height)
        init()
        const myFile = uploader.files[0];
        const img = new Image();
        img.src = URL.createObjectURL(myFile);
        img.onload = function(){        
            context.drawImage(img,0,0,canvas.width,canvas.height);
    }
    })
}



// uploader.addEventListener('change', function(e) {
//     // uploader.remove()
//     drawImageFromWebUrl();
// })

function getPixelColor (canvas,e) {
    let eventLocation = getElementLocation(canvas, e);
    let coord = "x = " + eventLocation.x + ", y = " + eventLocation.y;

    let pixelData = context.getImageData(eventLocation.x, eventLocation.y,1,1).data;
    let hex = "#00000000";
    if(
        (pixelData[0] == 0) &&
        (pixelData[1] == 0) &&
        (pixelData[2] == 0) &&
        (pixelData[3] == 0))
        {
            coord += " (Transparent, cannot convert)";
            
        }

    else hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);

    document.getElementById("status").innerHTML = coord;
    document.getElementById("color").style.backgroundColor = hex;
    document.getElementById("color-code").innerHTML = pixelData[0] +' ' + pixelData[1] +' ' + pixelData[2];
    
    return {x: eventLocation.x , y: eventLocation.y, color: hex}
}

canvas.addEventListener("mousemove", function(e) {
    getPixelColor (this, e);
}, false);

canvas.addEventListener("click", function(e) {
    var coor = getPixelColor (this, e);
    console.log(coor.y,coor.x , coor.color)
    queue = []
    mark = []
    pixelImg = []
    init()
    floodFill(pixelImg, coor.y, coor.x, newColor)
}, false);

const imgSrc = document.querySelector('input[type="file"]')

let ORIGINAL_IMAGE_DATA

const cacheImageData = () => {
    const original = context.getImageData(0, 0, canvas.width, canvas.height).data
    ORIGINAL_IMAGE_DATA = new Uint8ClampedArray(original.length)
    for (let i = 0; i < original.length; i += 1) {
        ORIGINAL_IMAGE_DATA[i] = original[i]
    }
    

}

const drawImage = img => {
    // canvas.height = img.height
    // canvas.width = img.width
    context.drawImage(img, 0, 0, canvas.width, canvas.height)
    cacheImageData()
}
const loadImage = e => {
    const img = new Image()
    img.src = e.target.result
    img.addEventListener('load', () => {
        drawImage(img)
        
        pixelImg = []
        init();
    
    })
}
const detectImageInput = e => {
const file = e.target.files[0]
    , fr = new FileReader()
if (!file.type.includes("image")) return
fr.addEventListener('load', loadImage)
fr.readAsDataURL(file)
}
imgSrc.addEventListener('change', detectImageInput)



//get color from colorpicker
var newColor = document.getElementById("colorpicker").value;

    document.getElementById("colorpicker").onchange = function() {
    newColor = this.value;
}

var pixelImg = []
let pixelHeight = []
var mark = []
var queue = []

//5 pixel -> 1 element
//Get matrix from canvas
// canvas_display.addEventListener("click", function() {
    
//     context = canvas.getContext('2d');
//     const imgData = context.getImageData(0, 0, canvas.width, canvas.height)
  
//     let count = 0;
//     for (let i = 0; i < canvas.height; i ++) {
//         let arrJ = [];
//         let arrH = [];
//         let markJ = [];
//         for (let j = 0; j < canvas.width; j ++) {
//             const r = imgData.data[count]
//                 , g = imgData.data[count+1]
//                 , b = imgData.data[count+2];
//                 count += 4;
//             arrJ.push(rgbToHex(r,g,b));
//             markJ.push(false)

//             arrH.push(getHeightValueFromColor(r,g,b));  
//         }
        
//         pixelImg.push(arrJ)
//         pixelHeight.push(arrH)
//         mark.push(markJ)
//     }
    
//     var ctx = this.getContext("2d");
//     for (let i = 0; i < pixelImg.length; i ++) {
        
//         for (let j = 0; j < pixelImg[i].length; j ++) {
//             ctx.fillStyle = pixelImg[i][j];
//             ctx.fillRect(j, i, 1, 1);
//         }                
//     }
// }, false);

function init() {

    const imgData = context.getImageData(0, 0, canvas.width, canvas.height)
  
    let count = 0;
    for (let i = 0; i < canvas.height; i ++) {
        let arrJ = [];
        let arrH = [];
        let markJ = [];
        for (let j = 0; j < canvas.width; j ++) {
            const r = imgData.data[count]
                , g = imgData.data[count+1]
                , b = imgData.data[count+2];
                count += 4;
            arrJ.push(rgbToHex(r,g,b));
            markJ.push(false)

            arrH.push(getHeightValueFromColor(r,g,b));  
        }
        
        pixelImg.push(arrJ)
        pixelHeight.push(arrH)
        mark.push(markJ)
    }
   
};


function showImg(pixelImg, x, y, newColor) {
    setTimeout(function() {
        // var ctx = canvas_display.getContext("2d");

        context.clearRect(x,y,1,1)
        context.fillStyle = newColor;
        context.fillRect(x, y, 1, 1);  
        // console.log(newColor)
    }, 100)
}

async function floodFill(image, sr, sc, newColor) {
    queue = [];
    queue.push([sr, sc]);

    while(queue.length > 0) {
        var temp = queue.shift();
 
        var tempX = temp.shift();
        var tempY = temp.shift();
       
        var current = image[tempX][tempY];
        // if (mark[tempX][tempY] == true)
        //     continue;
        
        // mark[tempX][tempY] = true;
        await showImg(image, tempY, tempX, newColor);
        
        const isValid = function(sr, sc) {
            if(sr < 0 || sc < 0 || sr > image.length - 1 || sc > image[sr].length - 1 || (image[sr][sc] !== current) || (mark[sr][sc]))
                {                     
                    return false;
                }
            else {
                mark[sr][sc] = true;
                return true;
            }
        }

        if (isValid(tempX - 1, tempY)) {
            queue.push([tempX - 1, tempY]);
        }

        if (isValid(tempX + 1, tempY)) {
            queue.push([tempX + 1, tempY]);
        }

        if (isValid(tempX, tempY - 1)) {
            queue.push([tempX, tempY - 1]);
        }

        if (isValid(tempX, tempY + 1)) {
            queue.push([tempX, tempY + 1]);
        }

        // 8 -directions
        if (isValid(tempX - 1, tempY - 1)) {
            queue.push([tempX - 1, tempY - 1]);
        }

        if (isValid(tempX + 1, tempY - 1)) {
            queue.push([tempX + 1, tempY - 1]);
        }

        if (isValid(tempX + 1, tempY + 1)) {
            queue.push([tempX + 1, tempY + 1]);
        }

        if (isValid(tempX - 1, tempY + 1)) {
            queue.push([tempX - 1, tempY + 1]);
        }
    }
}

// const FFA = document.querySelector('input[value="FFA"]')


function getHeightValueFromColor(r,g,b) {
    // Chuyển đổi giá trị màu sang độ cao bằng hàm sin
    // return Math.sin(color.r + color.g + color.b) * 100;
    return Math.sin(r + g + b) * 100;
  }

////////////////////////
// let paused = false;

// function pause() {
//     paused = true;
//     // Lưu trữ thời điểm tạm dừng
//     pauseTime = new Date().getTime();
// }

// function start() {
//     paused = false;
//     // Cập nhật thời gian bắt đầu hoạt động
//     startTime += new Date().getTime() - pauseTime;
//     continueFrom(currentPosition());
// }

// function continueProcess() {
//     paused = false;
//     continueFrom(currentPosition());
// }

// ///////////////////////////////
// let isPaused = false;
// function pauseSimulation() {
//     isPaused = true;
// }

// function startSimulation() {
//     isPaused = false;
//     // Cập nhật thời gian bắt đầu mô phỏng
//     startTime = new Date().getTime();
//     // Tiếp tục hoạt động từ vị trí hiện tại
//     continueFrom(currentPosition);
// }

// function continueSimulation() {
//     isPaused = false;
//     continueFrom(currentPosition);
// }

// function updateSimulation() {
//     if (!isPaused) {
//         // Tính toán vị trí mới
//         newPosition = calculateNewPosition();
//         // Cập nhật vị trí hiện tại
//         currentPosition = newPosition;
//         // Hiển thị hoạt động tại vị trí hiện tại
//         displaySimulation(currentPosition);
//     }
// }

// document.getElementById("pauseButton").addEventListener("click", pause);
// document.getElementById("startButton").addEventListener("click", start);
// document.getElementById("continueButton").addEventListener("click", continueProcess);
