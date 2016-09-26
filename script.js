/* global THREE */
var scene,camera,renderer,mouseX,mouseY;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var startCamRot;
var camParent = new THREE.Object3D();
var lineMat = new THREE.LineBasicMaterial( { color: 0xFFFFFF} );
setup()



function setup(){
	scene = new THREE.Scene();
	var width = 4,height = 4;
	//camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, -1000, 1000 );
	camera = new THREE.PerspectiveCamera(70,window.innerWidth / window.innerHeight,1,-1000,1000);
//	scene.add( camera );
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
	renderer.domElement.style.width = "100%";
	renderer.domElement.style.height = "100%";
	
	
	document.body.appendChild( renderer.domElement );
	camera.position.z = 5;
	startCamRot = camParent.rotation.clone();
	
	
	camParent.add(camera);
	scene.add(camParent);
	
}

var circle = function(radius,segments = 32,start = 0,end = 2*Math.PI,addToScene = true){
	this.radius = radius;
	this.segments = segments;
    var geom = new THREE.CircleGeometry( this.radius, this.segments,start,end );
    geom.vertices.shift();
    THREE.Line.call(this, geom, lineMat );
    if (addToScene) scene.add(this);
}
circle.prototype = Object.create(THREE.Line.prototype);
circle.constructor = THREE.Line;
var crosshair = function(){
	var half1 = new circle(0.2,12,0,Math.PI/2,false);
	var lastPoint = half1.geometry.vertices[0].clone();
	lastPoint.x += .15;
	var lastPoint2 = half1.geometry.vertices[half1.geometry.vertices.length-1].clone();
	lastPoint2.y += .15;
	half1.geometry.vertices.unshift(lastPoint)
	half1.geometry.vertices.push(lastPoint2)
	
	var half2 = new circle(0.2,12,0,Math.PI/2,false);
	var lastPoint = half2.geometry.vertices[0].clone();
	lastPoint.x += .15;
	var lastPoint2 = half2.geometry.vertices[half2.geometry.vertices.length-1].clone();
	lastPoint2.y += .15;
	half2.geometry.vertices.unshift(lastPoint)
	half2.geometry.vertices.push(lastPoint2)
	
	half2.rotateZ(Math.PI);
	
	
	THREE.Object3D.call(this);
	this.add(half1);
	this.add(half2);
	
	scene.add(this);
}
crosshair.prototype = Object.create(THREE.Object3D.prototype);
crosshair.constructor = THREE.Object3D

var ring = function(radius,width, segments,alt = false,start = 0){
	segments = Math.floor(segments /2)*2 +1;
	var geometry = new THREE.RingGeometry( radius, radius + width, 21 ,1,start,Math.PI/3);
	
	if(alt)
	{
			var temp = [];
		for (var i = 0; i < geometry.vertices.length/2; i++) {
			
			
			temp[2*i] = geometry.vertices[i];
			console.log(Math.floor(geometry.vertices.length/2))
			temp[2*i+1] = geometry.vertices[i + Math.floor(geometry.vertices.length/2)];
			
		}
		geometry.vertices = temp.slice();
	}

	
	THREE.LineSegments.call( this,geometry, lineMat );

	scene.add( this );
	
}
ring.prototype = Object.create(THREE.LineSegments.prototype);
ring.constructor = THREE.LineSegments;
var line = function(from,to){
	var geom = new THREE.Geometry();
	geom.vertices.push(from,to)
	THREE.Line.call(this,geom,lineMat);
	scene.add(this);
}
line.prototype = Object.create(THREE.Line.prototype);
line.constructor = THREE.Line;
var brokenCircle = function(maxradius,dl,rot){
	
	var outputGeom = new THREE.Geometry();
	var geomfirstCircle = new THREE.CircleGeometry(maxradius,32);
	var geomsecondCircle = new THREE.CircleGeometry(maxradius - .1,32);
	var dentLength = dl;
	geomfirstCircle.vertices.shift();
	geomsecondCircle.vertices.shift();
	
	var temp = [];
	
	temp = geomfirstCircle.vertices.slice(0,geomfirstCircle.vertices.length -dentLength);
	temp = temp.concat(geomsecondCircle.vertices.slice(geomfirstCircle.vertices.length -dentLength -1,geomfirstCircle.vertices.length));
	temp.push(temp[0]);
	console.log(geomsecondCircle.vertices.length -10);
	
	outputGeom.vertices = temp;
	
	THREE.Line.call(this,outputGeom,lineMat);
	this.rotation.z = rot
	scene.add(this);
	
}
brokenCircle.prototype = Object.create(THREE.Line.prototype);
brokenCircle.constructor = THREE.Line;
var fullRing = function(radius,width,size,rot){
	var geom = new THREE.RingGeometry(radius,radius + width,21,1,0,size);
	var lemat = new THREE.MeshBasicMaterial({color : 0xFFFFFF,side: THREE.DoubleSide})
	THREE.Mesh.call(this,geom,lemat);
	
	this.rotation.z = rot;
	
	scene.add(this);
}
fullRing.prototype = Object.create(THREE.Mesh.prototype);
fullRing.constructor = THREE.Mesh;


var c1,c2,c3,fr1,fr2,fr3,t2,bc;



function create(){
	
	var cross = new crosshair();
	var randomRad = Math.random()*2;
	var bigcirclerad = randomRad + (Math.random())*0.5+0.1;
	c1 = new circle(randomRad);
	c2 = new circle(bigcirclerad);
	c3 = new circle(randomRad - (Math.random())*0.5+0.1);
	
	
	var randomfullRingSize = Math.PI/4 * Math.random() +1;
	
	fr1 = new fullRing(bigcirclerad,.05,randomfullRingSize,Math.random()*2*Math.PI);
	fr2 = new fullRing(bigcirclerad+0.063,.05,randomfullRingSize,Math.random()*2*Math.PI);
	fr3 = new fullRing(bigcirclerad-0.063,.05,randomfullRingSize,Math.random()*2*Math.PI);
	
	
	t2 = new ring(randomRad,bigcirclerad - randomRad,1,true,Math.random()*Math.PI*2);
	
	var circlearray = []
	
	for (var i = 0; i < 5; i++) {
		var c = new circle(.05);
		c.position.set((Math.random()*2-1)*2,(Math.random()*2-1)*2,0);
		
		
		if(true)
		{
			var centerToCircle = c.position.clone().sub(new THREE.Vector3());
			centerToCircle.normalize();
			var centerToCircle2 = centerToCircle.clone().negate();
			centerToCircle.multiplyScalar(randomRad)
			var l = new line(c.position,new THREE.Vector3().add(centerToCircle));
		}
		circlearray.push(c);
	}
	
	var randomcrosslines = Math.floor(Math.random()*3);
	
	for (var i = 0; i < randomcrosslines; i++) {
		var first = circlearray[Math.floor(Math.random()*circlearray.length)];
		var second = circlearray[Math.floor(Math.random()*circlearray.length)];
		var ll = new line(first.position,second.position);
		
	}
	cross.scale.multiplyScalar(.5 * Math.random());
	bc = new brokenCircle(Math.random()+.2,Math.floor(Math.random()*5)+5,Math.random()*Math.PI*2);
}

function reload(){
	for( var i = scene.children.length - 1; i >= 0; i--) { 
		var obj = scene.children[i];
	    scene.remove(obj);
	}
	scene.add(camParent);
	create();
	
	
	setTimeout(reload,Math.random()*1000);
}

reload();


var tick = 0;

(function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );

	//c3.rotateZ(.008);
	camParent.rotation.y =(mouseX | 0)/800;
	camParent.rotation.x =(mouseY | 0)/1000;
	t2.rotation.z = (mouseX | 0)/800;
	
	c2.rotateY(.005 * tick);
	c3.rotateX(.002* tick);
	bc.rotateZ(0.01* tick);
	
	fr1.rotateZ(0.005* tick);
	fr2.rotateZ(-0.005* tick);
	fr3.rotateZ(0.003* tick);

})()


function onMouseMove(e){
	mouseX = e.clientX - windowHalfX;
	mouseY = e.clientY - windowHalfY;
}




window.onmousemove = onMouseMove;

//window.onclick = window.location.reload();