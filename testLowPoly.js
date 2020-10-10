var refreshDur = 7000;
var refreshTimeout;
var pointsX;
var pointsY;
var uWidth;
var uHeight;
var points;

function onLoad()
{
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width',window.innerWidth);
    svg.setAttribute('height',window.innerHeight);
    document.querySelector('.bg').appendChild(svg);

    var unitSize = (window.innerWidth+window.innerHeight)/30;
    pointsX = Math.ceil(window.innerWidth/unitSize)+1;
    pointsY = Math.ceil(window.innerHeight/unitSize)+1;
    uWidth = Math.ceil(window.innerWidth/(pointsX-1));
    uHeight = Math.ceil(window.innerHeight/(pointsY-1));

    points = [];

    for(var y = 0; y < pointsY; y++) {
        for(var x = 0; x < pointsX; x++) {
            points.push({x:uWidth*x, y:uHeight*y, originX:uWidth*x, originY:uHeight*y});
        }
    }

    randomize();

    for(var i = 0; i < points.length; i++) {
        if(points[i].originX != uWidth*(pointsX-1) && points[i].originY != uHeight*(pointsY-1)) {
            var topLeftX = points[i].x;
            var topLeftY = points[i].y;
            var topRightX = points[i+1].x;
            var topRightY = points[i+1].y;
            var bottomLeftX = points[i+pointsX].x;
            var bottomLeftY = points[i+pointsX].y;
            var bottomRightX = points[i+pointsX+1].x;
            var bottomRightY = points[i+pointsX+1].y;

            var rando = Math.floor(Math.random()*2);

            for(var n = 0; n < 2; n++) {
                var polygon = document.createElementNS(svg.namespaceURI, 'polygon');

                if(rando==0) {
                    if(n==0) {
                        polygon.point1 = i;
                        polygon.point2 = i+pointsX;
                        polygon.point3 = i+pointsX+1;
                        polygon.setAttribute('points',topLeftX+','+topLeftY+' '+bottomLeftX+','+bottomLeftY+' '+bottomRightX+','+bottomRightY);
                    } else if(n==1) {
                        polygon.point1 = i;
                        polygon.point2 = i+1;
                        polygon.point3 = i+pointsX+1;
                        polygon.setAttribute('points',topLeftX+','+topLeftY+' '+topRightX+','+topRightY+' '+bottomRightX+','+bottomRightY);
                    }
                } else if(rando==1) {
                    if(n==0) {
                        polygon.point1 = i;
                        polygon.point2 = i+pointsX;
                        polygon.point3 = i+1;
                        polygon.setAttribute('points',topLeftX+','+topLeftY+' '+bottomLeftX+','+bottomLeftY+' '+topRightX+','+topRightY);
                    } else if(n==1) {
                        polygon.point1 = i+pointsX;
                        polygon.point2 = i+1;
                        polygon.point3 = i+pointsX+1;
                        polygon.setAttribute('points',bottomLeftX+','+bottomLeftY+' '+topRightX+','+topRightY+' '+bottomRightX+','+bottomRightY);
                    }
                }
                polygon.setAttribute('fill','rgba(0,0,0,'+(Math.random()/1.5)+')');
                var animate = document.createElementNS('http://www.w3.org/2000/svg','animate');
                animate.setAttribute('fill','freeze');
                animate.setAttribute('attributeName','points');
                animate.setAttribute('dur',refreshDur+'ms');
                animate.setAttribute('calcMode','linear');
                //animate.setAttribute('repeatCount', 30);
                polygon.appendChild(animate);
                svg.appendChild(polygon);
            }
        }
    }

    refresh();
    /*var canv = document.getElementsByClassName("bg");
     var img = canv[0].toDataURL("image/png");
    var svg1 = document.getElementsByClassName("bg");
    var serializer = new XMLSerializer();
    var svg_blob = new Blob([serializer.serializeToString(svg1[0])],
                            {'type': "image/svg+xml"});
    var img = svg_blob.toDataURL("image/svg");*/
    //var url = URL.createObjectURL(svg_blob);


/*var svg = document.querySelector('svg');
var img = document.querySelector('img');
var canvas = document.querySelector('canvas');

// get svg data
var xml = new XMLSerializer().serializeToString(svg);

// make it base64
var svg64 = btoa(xml);
var b64Start = 'data:image/svg+xml;base64,';

// prepend a "header"
var image64 = b64Start + svg64;

// set it as the source of the img element
img.onload = function() {
    // draw the image onto the canvas
    canvas.getContext('2d').drawImage(img, 0, 0);
}
img.src = image64;

svg, img, canvas {
  display: block;
}*/


}

function randomize() {
    for(var i = 0; i < points.length; i++) {
        if(points[i].originX != 0 && points[i].originX != uWidth*(pointsX-1)) {
            points[i].x = points[i].originX + Math.random()*uWidth-uWidth/2;
        }
        if(points[i].originY != 0 && points[i].originY != uHeight*(pointsY-1)) {
            points[i].y = points[i].originY + Math.random()*uHeight-uHeight/2;
        }
    }
}

function refresh() {
    randomize();
    for(var i = 0; i < document.querySelector('.bg svg').childNodes.length; i++) {
        var polygon = document.querySelector('.bg svg').childNodes[i];
        var animate = polygon.childNodes[0];
        if(animate.getAttribute('to')) {
            animate.setAttribute('from',animate.getAttribute('to'));
        }
        animate.setAttribute('to',points[polygon.point1].x+','+points[polygon.point1].y+' '+points[polygon.point2].x+','+points[polygon.point2].y+' '+points[polygon.point3].x+','+points[polygon.point3].y);
        animate.beginElement();
    }
    refreshTimeout =  setTimeout(function() {refresh();}, refreshDur);
}

function onResize() {
    document.querySelector('.bg svg').remove();
    clearTimeout(refreshTimeout);
    onLoad();
}

window.onload = onLoad;
window.onresize = onResize;