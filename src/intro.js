const container = document.querySelector('.container')
const sizeEl = document.querySelector('#size')
const speedEl = document.querySelector('#speed')
let size = sizeEl.value
let speed = speedEl.value
const resetBtn = document.querySelector('#reset')
const uploadBtn = document.querySelector('#upload')
var sizeNumber = document.querySelector('#sizeNumber')
var speedNumber = document.querySelector('#speedNumber')
const indexC = document.querySelector('#index-c')
const indexR = document.querySelector('#index-r')
const play = document.querySelector('#play')
const pause = document.querySelector('#pause')
const xy = document.querySelector('#xy-re')
const showcode = document.querySelector('#showcode')
const code = document.querySelector('#code')
const color = document.querySelector('#colorpicker')
const displayCt = document.querySelector('#main-content')
const text = document.querySelector('#a')

var newColor = color.value;

    color.onchange = function() {
    newColor = (this.value);
    setMark(mark)
}

var currentColor 

let draw = false
let initMaze = false

var wall = 0;
var path = 1;
var start = 0;
var selected = 1
var step
var display = false


var isPlay = false

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

color.addEventListener('change', function() {
    this.parentNode.style.backgroundColor = this.value;
  });

function populate(size) {
  container.style.setProperty('--size', size)
  indexC.style.setProperty('--size', size)
  indexR.style.setProperty('--size', size)

  for (let i=0; i < size; i++) {
    var div = document.createElement('div')
    div.setAttribute('width', container.offsetWidth / size);
    div.setAttribute('height', container.offsetHeight / size);
    div.classList.add("column")
    div.id = `column-${i+1}`
    div.innerHTML = i + 1
    indexC.appendChild(div)
  }

  for (let i=0; i < size; i++) {
    var div = document.createElement('div')
    div.setAttribute('width', container.offsetWidth / size);
    div.setAttribute('height', container.offsetHeight / size);
    div.classList.add("row")
    div.id = `row-${i+1}`
    div.innerHTML = i + 1
    indexR.appendChild(div)
  }


  for (let i = 0; i <= size * size; i++) {

    var div = document.createElement('div')
    div.setAttribute('width', container.offsetWidth / size);
    div.setAttribute('height', container.offsetHeight / size);
    
    div.id =`${i+1}`
    div.style.backgroundColor = 'rgb(238, 231, 231)';
    div.setAttribute("onclick", `getCoor(${div.id}); startPixel(${div.id})`);

    //////
    // div.addEventListener('mouseover', function(){
    //     if(!draw) return
    //     div.style.backgroundColor = color.value
    // })
    // div.addEventListener('mousedown', function(){
    //     div.style.backgroundColor = color.value
    // })
    ////
    
    // div.classList.add("pixel")
    container.appendChild(div)
  }
}

populate(size)

/////
// window.addEventListener("mousedown", function(){
//     initMaze = true
//     // if (!initMaze) 
//     draw = true
// })

// window.addEventListener("mouseup", function(){
//     // if (!initMaze)
//      draw = false
// })
////

function reset(){
    initMaze = false
    start = 0;
    mazeArr = []

    initofMaze(size)
    // console.clear()
    step.classList.remove('select')
    selected = 1
        step = document.getElementById(`code-${selected}`)
        step.classList.add('select')

    container.innerHTML = ''

    document.getElementById('stt').innerHTML = ''
    document.getElementById('x-coor').innerHTML = ''
    document.getElementById('y-coor').innerHTML = ''
    indexC.innerHTML = ''
    indexR.innerHTML = ''
    populate(size)
    setMark(mark)
}

selected = 1
        step = document.getElementById(`code-${selected}`)
        step.classList.add('select')

resetBtn.addEventListener('click', reset)

sizeEl.addEventListener('input', function(){
    size = sizeEl.value
    sizeNumber.innerHTML = size
    reset()
})

speedEl.addEventListener('input', function(){
    speed = speedEl.value
    speedNumber.innerHTML = "x" + speed 
    // reset()
})

play.addEventListener('click', () => {
    isPlay = true
    play.style.display = "none"
    pause.style.display = ""

    floodFill(start, 4, currentColor,newColor)
        
})

pause.addEventListener('click', () => {
    isPlay = false
    play.style.display = ""
    pause.style.display = "none"
    // floodFill(start, 4, currentColor, newColor)
})

code.style.display = 'none'  
showcode.addEventListener('click', () => {
    showcode.style.transform = 'rotate(0deg)'
    if(display) {
        code.style.display = 'none'  
    }
    else {
        code.style.display = ''    
        showcode.style.transform = 'rotate(180deg)'
    }
    display = !display
})

var mazeArr = new Array(size); // 0: road ; -1: wall ; 1: begin ; 2 = end;

function initofMaze(size) {
    for (let i = 1; i <= size; i++){
        mazeArr[i] = [];
        for (let j = 1; j <= size; j++) {
            mazeArr[i][j] = 0;
        }
    }
}

function maze() {
    reset()
    
    initMaze = true
    //random sinh mê cung k = số ô là mê cung
    let maxWall = Math.round(size*size*0.4);
    for (let k = 0; k < maxWall ; k++){
        var index = Math.floor(Math.random() * (size*size) + 1);
        var wall = document.getElementById(index);       

        //Wall mới sinh ra không trùng wall đã tạo
        while (wall.getAttribute('class') === "pixel wall") {
            index = Math.floor(Math.random() * (size*size) + 1);
            wall = document.getElementById(index);
        }
        wall.style.backgroundColor = 'rgb(85, 40, 8)'
        // wall.classList.add("wall")

        let j = (index % size) % size == 0 ? size : (index % size)  
        let i = (index % size) % size == 0 ? Math.floor(index  / size) : Math.floor(index  / size) + 1

        mazeArr[j];
        mazeArr[i][j] = -1;         
    }
}

function getCoor(id) {
    let y = (id % size) % size == 0 ? size : (id % size)  
    let x = (id % size) % size == 0 ? Math.floor(id  / size) : Math.floor(id  / size) + 1
    // startPixel(x, y, id)
    
    return { x , y}
}

function getID(y , x) {
    return parseInt(x) + (parseInt(y) - 1)*size
}

    //chose start pixel
function startPixel(id) {
    // initofMaze(size)
  if (initMaze && mazeArr[getCoor(id).x][getCoor(id).y] == 0) {
        currentColor = getColor(id)
        start = id;

        var element = document.getElementById(id)
        element.style.backgroundColor = newColor
    }
}

function setMark(arr) {
    for(let i = 1; i <= size*size; i ++){
        arr[i] = false;
    }
}

const sleep = (delay) => {
    return new Promise(resolve => setTimeout(resolve, delay));
  }

 function codeDisplay() {
    step.classList.remove('select')
    step = document.getElementById(`code-${selected}`)
    step.classList.add('select')     
}

function getColor(id) {
    return document.getElementById(id).style.getPropertyValue("background-color")
}

let queue = [];
let mark = [];

//direction = 4 || 8
async function floodFill(start, direction, currentColor, newColor) {

    queue.push(start);
    await sleep (100/(10*speed))
    
    selected=2
    codeDisplay()
    var temp

    while(queue.length > 0 && (isPlay === true) ) {
        selected=3
        codeDisplay()

        ////if (isPlay === false) break
        temp = queue.shift();
        text.innerHTML = `temp = ${temp}`
        // document.getElementById('queue').innerHTML = queue
        await sleep(2000/(5*speed))

        selected=4
        codeDisplay()
        await sleep (2000/(10*speed))
        
        ////if (isPlay === false) break
        var tempX = parseInt(getCoor(temp).x);
        text.innerHTML = `tempX = ${tempX}`
        var divx = document.getElementById(`row-${getCoor(temp).x}`);
        selected=5
        codeDisplay()
        await sleep (2000/(10*speed))

        var divy = document.getElementById(`column-${getCoor(temp).y}`);
        
        var tempY = parseInt(getCoor(temp).y);
        text.innerHTML = `tempY = ${tempY}`
        selected=6
        codeDisplay()
        await sleep (2000/(10*speed))

        
        document.getElementById('queue').innerHTML = queue
        document.getElementById('stt').innerHTML = temp
        document.getElementById('x-coor').innerHTML = tempX
        document.getElementById('y-coor').innerHTML = tempY

        ////if (isPlay === false) break
        if (mark[temp] == true){
            selected=7
            codeDisplay()
            divy.style.color = 'whitesmoke';
            divx.style.color = 'whitesmoke';
            text.innerHTML = `continue`
            await sleep (2000/(10*speed))
            selected=3
            codeDisplay()
            continue;        
        }            
        ////if (isPlay === false) break
        mark[temp] = true;
        text.innerHTML = `mark[${temp}] = true`
        selected=8
        codeDisplay()

        var element = document.getElementById(temp)
        // text.innerHTML = `element = document.getElementById(${temp})`
        selected=9
        codeDisplay()
        element.style.backgroundColor = '#66cc00'
       
        await sleep (2000/(10*speed))
        
        // element.classList.add('begin')
        
        ////if (isPlay === false) break
        element.style.backgroundColor = ((newColor))
        text.innerHTML = `element.style.backgroundColor = ${newColor}`
        // divy.style.color = newColor;
        // divx.style.color = newColor;
        // element.style.transform = 'scale(1.2)'
        // await sleep(10)
        // element.style.transform = 'scale(1.1)'
        // await sleep(10)
        // element.style.transform = 'scale(1.0)'

        await sleep (2000/(10*speed))

        selected=10
        codeDisplay()
        

        const isValid = function(sr, sc) {
            if(sr <= 0 || sc <= 0 || sr > size || sc > size || mazeArr[sr][sc] != 0)
                {               
                    
                    return false;
                }
            else if (getColor(getID(sr,sc)) === currentColor && mark[getID(sr,sc)] == false){
                return true;
            }
        }
        //////if c break
        if (isValid(tempX - 1, tempY)) {
            
            queue.push(getID(tempX - 1, tempY));
            document.getElementById('queue').innerHTML = queue
            text.innerHTML = `isValid(${tempX - 1}, ${tempY}) = true`
            await sleep (2000/(10*speed))
        }

        selected=11
        codeDisplay()
        ////if (isPlay === false) break
        if (isValid(tempX + 1, tempY) ) {
            queue.push(getID(tempX + 1, tempY));
            document.getElementById('queue').innerHTML = queue
            text.innerHTML = `isValid(${tempX + 1}, ${tempY}) = true`
            await sleep (2000/(10*speed))
        }

        selected=12
        codeDisplay()
        ////if (isPlay === false) break
        if (isValid(tempX, tempY - 1) ) {
            queue.push(getID(tempX, tempY - 1));
            document.getElementById('queue').innerHTML = queue
            text.innerHTML = `isValid(${tempX }, ${tempY - 1}) = true`
            await sleep (2000/(10*speed))
        }

        selected=13  
        codeDisplay()
        ////if (isPlay === false) break
        if (isValid(tempX, tempY + 1) ) {
            queue.push(getID(tempX, tempY + 1));
            document.getElementById('queue').innerHTML = queue
            text.innerHTML = `isValid(${tempX}, ${tempY + 1}) = true`
            await sleep (2000/(10*speed))
        }

        selected=14
        codeDisplay()

        if (direction == 8){
            if (isValid(tempX - 1, tempY - 1) && getColor(temp) == currentColor) {
                queue.push(getID(tempX - 1, tempY - 1));
            }

            if (isValid(tempX + 1, tempY - 1) && getColor(temp) == currentColor) {
                queue.push(getID(tempX + 1, tempY - 1));
            }
            
    
            if (isValid(tempX + 1, tempY + 1) && getColor(temp) == currentColor) {
                queue.push(getID(tempX + 1, tempY + 1));
            }
    
            
            if (isValid(tempX - 1, tempY + 1) && getColor(temp) == currentColor) {
                queue.push(getID(tempX - 1, tempY + 1));
            }       
        }

        divy.style.color = 'whitesmoke';
            divx.style.color = 'whitesmoke';
    }
    
    if (queue.length == 0) {
        play.style.display = ""
        pause.style.display = "none"
    }
}

function drawMap(mazeArr) {
    
    size = 10
    
    sizeNumber.innerHTML = size

    reset()
    initMaze = true
    initofMaze(size)
    for(let i = 1; i < mazeArr.length; i++) {
        for(let j = 1; j < mazeArr.length; j++) {
            var id = getID(i,j)
            var element = document.getElementById(id)

            
            if (mazeArr[i][j] == -1) {
                element.style.backgroundColor = 'rgb(85, 40, 8)'
                // element.classList.add('wall')
            }
        }
    }
    initMaze = true
    return mazeArr
}

let heart = [
        [],
        [null,0,0,-1,-1,0,0,-1,-1,0,0],
        [null,0,-1,-1,0,-1,-1,0,-1,-1,0],
        [null,-1,-1,0,0,0,0,0,0,-1,-1],
        [null,-1,0,0,0,0,0,0,0,0,-1],
        [null,-1,0,0,0,0,0,0,0,0,-1],
        [null,-1,0,0,0,0,0,0,0,0,-1],
        [null,0,-1,0,0,0,0,0,0,-1,0],
        [null,0,0,-1,0,0,0,0,-1,0,0],
        [null,0,0,0,-1,0,0,-1,0,0,0,0],
        [null,0,0,0,0,-1,-1,0,0,0,0],
    ]

// mazeArr = drawMap(heart)

let smile = [
        [],
        [null,0,0,-1,-1,-1,-1,-1,-1,0,0],
        [null,0,-1,-1,0,0,0,0,-1,-1,0],
        [null,-1,-1,0,0,0,0,0,0,-1,-1],
        [null,-1,0,0,-1,0,0,-1,0,0,-1],
        [null,-1,0,0,-1,0,0,-1,0,0,-1],
        [null,-1,0,0,0,0,0,0,0,0,-1],
        [null,-1,0,0,-1,0,0,-1,0,0,-1],
        [null,-1,-1,0,0,-1,-1,0,0,-1,-1],
        [null,0,-1,-1,0,0,0,0,-1,-1,0,0],
        [null,0,0,-1,-1,-1,-1,-1,-1,0,0],
    
]


////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////FLOOD FILL WITH CANVAS /////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

// var canvas = document.getElementById("canvas")
// var canvas_div = document.getElementById("left")
// var context = canvas.getContext('2d', { willReadFrequently: true })
// var canvas_display = document.getElementById("canvas-display")
// const uploader = document.querySelector('#uploader');
// canvas.setAttribute('width', '800');
// canvas.setAttribute('height', '600');
// canvas_div.style.display = "none";

// function getElementPosition(obj) {
//     var curleft = 0, curtop = 0;
//     if (obj.offsetParent) {
//         do {
//             curleft += obj.offsetLeft;
//             curtop += obj.offsetTop;
//         }
//         while (obj = obj.offsetParent);
//         return {x: curleft , y: curtop};
//     }

//     return undefined;
// }


// function getElementLocation(element, event) {
//     var pos = getElementPosition(element);

//     return {
//         x: (event.pageX - pos.x),
//         y: (event.pageY - pos.y)
//     };
// }

// function rgbToHex(r, g, b) {
//     var hex = ((r << 16) | (g << 8) | b).toString(16);
//     return "#" + ("000000" + hex).slice(-6);
// }

// function hexToRgb(hex) {
//     var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//     return result ? {
//         r: parseInt(result[1], 16),
//         g: parseInt(result[2], 16),
//         b: parseInt(result[3], 16)
//     } : null;
// }


// function drawImageFromWebUrl() {
//     // const canvas = document.querySelector('#canvas');
    
//     pixelImg = []
//     // const uploader = document.querySelector('#uploader');
//     uploadBtn.addEventListener('click',() =>{
//         canvas_div.style.display = "";
//         container.style.display = "none";
//         indexC.style.display = "none";
//         indexR.style.display = "none";
//         displayCt.style.display = "none";
//     })

//     uploader.addEventListener('change',(e)=>{
        
//         context.clearRect(0,0,canvas.width,canvas.height)
//         init()
//         const myFile = uploader.files[0];
//         const img = new Image();
//         img.src = URL.createObjectURL(myFile);
//         img.onload = function(){        
//             context.drawImage(img,0,0,canvas.width,canvas.height);
//     }
//     })
// }



// // uploader.addEventListener('change', function(e) {
// //     // uploader.remove()
// //     drawImageFromWebUrl();
// // })

// function getPixelColor (canvas,e) {
//     let eventLocation = getElementLocation(canvas, e);
//     let coord = "x = " + eventLocation.x + ", y = " + eventLocation.y;

//     let pixelData = context.getImageData(eventLocation.x, eventLocation.y,1,1).data;
//     let hex = "#00000000";
//     if(
//         (pixelData[0] == 0) &&
//         (pixelData[1] == 0) &&
//         (pixelData[2] == 0) &&
//         (pixelData[3] == 0))
//         {
//             coord += " (Transparent, cannot convert)";
            
//         }

//     else hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);

//     document.getElementById("status").innerHTML = coord;
//     document.getElementById("color").style.backgroundColor = hex;
//     document.getElementById("color-code").innerHTML = pixelData[0] +' ' + pixelData[1] +' ' + pixelData[2];
    
//     return {x: eventLocation.x , y: eventLocation.y, color: hex}
// }

// canvas.addEventListener("mousemove", function(e) {
//     getPixelColor (this, e);
// }, false);

// canvas.addEventListener("click", function(e) {
//     var coor = getPixelColor (this, e);
//     console.log(coor.y,coor.x , coor.color)
//     queue = []
//     mark = []
//     pixelImg = []
//     init()
//     floodFill(pixelImg, coor.y, coor.x, newColor)
// }, false);

// const imgSrc = document.querySelector('input[type="file"]')

// let ORIGINAL_IMAGE_DATA

// const cacheImageData = () => {
//     const original = context.getImageData(0, 0, canvas.width, canvas.height).data
//     ORIGINAL_IMAGE_DATA = new Uint8ClampedArray(original.length)
//     for (let i = 0; i < original.length; i += 1) {
//         ORIGINAL_IMAGE_DATA[i] = original[i]
//     }
    

// }

// const drawImage = img => {
//     // canvas.height = img.height
//     // canvas.width = img.width
//     context.drawImage(img, 0, 0, canvas.width, canvas.height)
//     cacheImageData()
// }
// const loadImage = e => {
//     const img = new Image()
//     img.src = e.target.result
//     img.addEventListener('load', () => {
//         drawImage(img)
        
//         pixelImg = []
//         init();
    
//     })
// }
// const detectImageInput = e => {
// const file = e.target.files[0]
//     , fr = new FileReader()
// if (!file.type.includes("image")) return
// fr.addEventListener('load', loadImage)
// fr.readAsDataURL(file)
// }
// imgSrc.addEventListener('change', detectImageInput)



// //get color from colorpicker
// var newColor = document.getElementById("colorpicker").value;

//     document.getElementById("colorpicker").onchange = function() {
//     newColor = this.value;
// }

// function init() {

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
//         mark.push(markJ)
//     }
   
// };


// function showImg(pixelImg, x, y, newColor) {
//     setTimeout(function() {
//         // var ctx = canvas_display.getContext("2d");

//         context.clearRect(x,y,1,1)
//         context.fillStyle = newColor;
//         context.fillRect(x, y, 1, 1);  
//         // console.log(newColor)
//     }, 100)
// }

// async function floodFill(image, sr, sc, newColor) {
//     queue = [];
//     queue.push([sr, sc]);

//     while(queue.length > 0) {
//         var temp = queue.shift();
 
//         var tempX = temp.shift();
//         var tempY = temp.shift();
       
//         var current = image[tempX][tempY];
//         // if (mark[tempX][tempY] == true)
//         //     continue;
        
//         // mark[tempX][tempY] = true;
//         await showImg(image, tempY, tempX, newColor);
        
//         const isValid = function(sr, sc) {
//             if(sr < 0 || sc < 0 || sr > image.length - 1 || sc > image[sr].length - 1 || (image[sr][sc] !== current) || (mark[sr][sc]))
//                 {                     
//                     return false;
//                 }
//             else {
//                 mark[sr][sc] = true;
//                 return true;
//             }
//         }

//         if (isValid(tempX - 1, tempY)) {
//             queue.push([tempX - 1, tempY]);
//         }

//         if (isValid(tempX + 1, tempY)) {
//             queue.push([tempX + 1, tempY]);
//         }

//         if (isValid(tempX, tempY - 1)) {
//             queue.push([tempX, tempY - 1]);
//         }

//         if (isValid(tempX, tempY + 1)) {
//             queue.push([tempX, tempY + 1]);
//         }

//         // 8 -directions
//         if (isValid(tempX - 1, tempY - 1)) {
//             queue.push([tempX - 1, tempY - 1]);
//         }

//         if (isValid(tempX + 1, tempY - 1)) {
//             queue.push([tempX + 1, tempY - 1]);
//         }

//         if (isValid(tempX + 1, tempY + 1)) {
//             queue.push([tempX + 1, tempY + 1]);
//         }

//         if (isValid(tempX - 1, tempY + 1)) {
//             queue.push([tempX - 1, tempY + 1]);
//         }
//     }
// }

// // const FFA = document.querySelector('input[value="FFA"]')


// function getHeightValueFromColor(r,g,b) {
//     // Chuyển đổi giá trị màu sang độ cao bằng hàm sin
//     // return Math.sin(color.r + color.g + color.b) * 100;
//     return Math.sin(r + g + b) * 100;
//   }
