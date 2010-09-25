// Animated Lines Icons
// niko 2010

var cos=[], sin=[];
for(var r,a=0;a<360;++a) {
	r=(Math.PI/180)*a;
	cos[a]=Math.cos(r);
	sin[a]=Math.sin(r);
}

/* opt={
 *   fg: foregroundcolor
 *   bg: backgroundcolor
 *   id: canvasid
 *   zoom: 1,
 *   lines: [
 *   	[[x1,y1,z1],[x2,y2,z2],...],
 *   	[[x1,y1,z1],....]
 *   ],
 * }
 */

var anicon=function(opt){
	var can=document.getElementById(opt.id);
	if(!can || !can.getContext) return false;

	var o=opt;
	if(!o.fg) o.fg="rgb(255,255,255)";
	o.zoom=(typeof(o.zoom)=='undefined')?1:o.zoom;
	o.pers=(typeof(o.pers)=='undefined')?false:o.pers;
	if(!o.fps) o.fps=20;
	if(!o.linewidth) o.linewidth=1;

	var ctx=can.getContext('2d');
	var cw=can.width, ch=can.height;
	var ox=o.ox||(cw>>1), oy=o.oy||(ch>>1);
	var sr=ox>oy?oy-2:ox-2;
	var nbl=o.lines?o.lines.length:0;
	var pcf=0.5;

	this.draw=function(){
		ctx.save();
		//cls
		if(o.bg) {
			ctx.fillStyle=o.bg;
			ctx.fillRect(0,0,cw,ch);
		} else {
			ctx.clearRect(0,0,cw,ch);
		}
		ctx.translate(ox-0.5,oy-0.5);
		var x,y,c,c2,r;
		//draw lines (zorder?)
		ctx.strokeStyle=o.fg;
		ctx.lineWidth=o.linewidth;
		for(var n=0,l=o.lines[0]; n<nbl; l=o.lines[++n]) {
			var d=l[0];
			ctx.beginPath();
			r=o.pers?o.zoom*(oy/(oy-(d[2]*pcf))):o.zoom;
			ctx.moveTo(Math.round(d[0]*r),Math.round(d[1]*r));
			//c=100+Math.round(155*(z+sr)/(sr*2));
			for(var m=1; m<l.length; m++) {
				d=l[m];
				x=d[0];
				y=d[1];
				z=d[2]||0;
				r=o.pers?o.zoom*(oy/(oy-(z*pcf))):o.zoom;
				ctx.lineTo(Math.round(x*r),Math.round(y*r));
			}
			ctx.stroke();
		}
		ctx.restore();
	};

	var anorm=function(a){ a=Math.round(a)%360; return a<0?a+360:a; };
	
	this.rotate=function(ax,ay,az) {
		ax=anorm(ax);
		ay=anorm(ay);
		az=anorm(az);
		for(var n=0;n<nbl;++n)
			for(var m=0;m<o.lines[n].length;++m) {
				var d=o.lines[n][m];
				if(ax) {
					var y=d[1], z=d[2];
					d[1]=y*cos[ax]-z*sin[ax];
					d[2]=y*sin[ax]+z*cos[ax];
				}
				if(ay) {
					var x=d[0], z=d[2];
					d[0]=x*cos[ay]-z*sin[ay];
					d[2]=x*sin[ay]+z*cos[ay];
				}
				if(az) {
					var x=d[0], y=d[1];
					d[0]=x*cos[az]-y*sin[az];
					d[1]=x*sin[az]+y*cos[az];
				}
				o.lines[n][m]=d;
			}
	};

	var arx=ary=arz=0;
	var atx=aty=atz=0;
	var bbg=o.bg,bfg=o.fg,blw=o.linewidth,bpe=o.pers;
	var timer=false;

	this.frame=function(){
		atx=anorm(atx+arx);
		aty=anorm(aty+ary);
		atz=anorm(atz+arz);
		this.rotate(arx,ary,arz);
		this.draw(o.zoom);
	};

	this.startanim=function(rx,ry,rz,opt){
		arx=rx;
		ary=ry;
		arz=rz;
		if(opt.bg) o.bg=opt.bg;
		if(opt.fg) o.fg=opt.fg;
		if(opt.linewidth) o.linewidth=opt.linewidth;
		if(typeof(opt.pers)!='undefined') o.pers=opt.pers;
		if(!timer) {
			var self=this;
			timer=setInterval(function(){ self.frame(); },1000/o.fps);
		}
	};
	
	this.stopanim=function(){
		if(timer) {
			clearInterval(timer);
			timer=false;
			o.bg=bbg;
			o.fg=bfg;
			o.linewidth=blw;
			o.pers=bpe;
			this.rotate(-atx,-aty,-atz);
			this.draw();
			atx=aty=atz=0;
		}
	};

	this.draw();
	if(o.idanim) {
		var obj=document.getElementById(o.idanim), self=this;
		obj.onmouseover=function(){ self.startanim(0,5,0,{fg:"#445",bg:"#fff",pers:true}); };
		obj.onmouseout=function(){ self.stopanim(); };
	}
	return true;
};
