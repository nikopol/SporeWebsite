// Sphere of Dots
// niko 2010

var SoD=function(id,bg){
	var can=document.getElementById(id);
	if(!can.getContext) return false;

	var DBC=24, ABD=Math.round(360/DBC);
	var c=can.getContext('2d');
	var cw=can.width, ch=can.height;
	var ox=cw>>1, oy=(ch>>1)-4, sr=ox>oy?oy-2:ox-2;
	var px=[], py=[], pz=[], nbp=0;
	var cos=[], sin=[];

	for(var r,a=0;a<360;++a) {
		r=(Math.PI/180)*a;
		cos[a]=Math.cos(r);
		sin[a]=Math.sin(r);
	}

	var draw=function(cf,blur) {
		c.save();
		//c.fillStyle="rgba(0,0,0,"+(blur||1)+")";
		c.fillStyle=bg;
		c.fillRect(0,0,cw,ch);
		c.translate(ox+0.5,oy);
		for(var n=0,d,x,y,q; n<nbp; n++) {
			d=1;//oy/(oy-(pz[n]*0.7));
			x=Math.round(px[n]*d);
			y=Math.round(py[n]*d);
			//q=(pz[n]+sr)/(sr*2);
			//c.fillStyle="rgba(255,255,255,"+q+")";
			q=100+Math.round(155*(pz[n]+sr)/(sr*2));
			c.fillStyle="rgb("+q+","+q+","+q+")";
			c.fillRect(x*cf,y*cf,1,1);
		}
		c.restore();
	};

	var rotate=function(ax,ay,az) {
		ax=Math.round(ax)%360; if(ax<0) ax+=360;
		ay=Math.round(ay)%360; if(ay<0) ay+=360;
		az=Math.round(az)%360; if(az<0) az+=360;
		for(var n=0; n<nbp; ++n) {
			if(ax) {
				var y=py[n], z=pz[n];
				py[n]=y*cos[ax]-z*sin[ax];
				pz[n]=y*sin[ax]+z*cos[ax];
			}
			if(ay) {
				var x=px[n], z=pz[n];
				px[n]=x*cos[ay]-z*sin[ay];
				pz[n]=x*sin[ay]+z*cos[ay];
			}
			if(az) {
				var x=px[n], y=py[n];
				px[n]=x*cos[az]-y*sin[az];
				py[n]=x*sin[az]+y*cos[az];
			}
		}
	};

	var build=function(r) {
		px=[]; py=[]; pz=[];
		for(var n=0, ay=0; n<DBC/2; ++n, ay+=ABD) {
			for(var p=0,x,y,z; p<360; p+=ABD) {
				if(n==0 || (p!=90 && p!=270)) {
					x=r*cos[p];
					y=r*sin[p];
					px.push(x*cos[ay]);
					py.push(y);
					pz.push(x*sin[ay]);
				}
			}
		}
		nbp=px.length;
	}

	var rx=Math.random()*120, ry=Math.random()*80, rz=0, rd=0.2;
	var timer=false;
	var anim=function(){
		rd=rd<1?rd*1.1:1;
		rotate(rx,ry,rz);
		draw(rd);
		rx*=0.9;
		ry*=0.9;
		rz*=0.9;
		if(Math.abs(rx)+Math.abs(ry)+Math.abs(rz)<1) {
			clearInterval(timer);
			timer=false;
		}
	};

	var mx=0, my=0;
	var mousemove=can.onmousemove=function(e){
		if(!(e.x+e.y)) {
			e.x=e.pageX;
			e.y=e.pageY;
		}
		if(mx+my) {
			ry+=(mx-e.x);
			rx+=(my-e.y);
		}
		mx=e.x;
		my=e.y;
		if(!timer) timer=setInterval(anim,50);
		return false;
	};

	var objs=document.getElementsByClassName('sod');
	for(var n=0; n<objs.length; ++n) objs[n].onmousemove=mousemove;

	build(sr);
	draw(rd);
	timer=setInterval(anim,50);

	return true;
};
