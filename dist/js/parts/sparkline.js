if(!_.sparkline){_.sparkline=1;(function($){var Dfa=function(a,b){return $.ej(Cfa,a,b||"line")},QR=function(a){$.V(this);$.X.call(this);this.xa=a;this.ba(!1)},RR=function(a,b){$.qv.call(this);this.Ta("sparkline");this.zF=this.VY;this.state=new $.ev(this);this.Da=this.yc=this.bb=null;this.dj=[];this.gj=[];this.kj=[];this.pf=null;this.Mh={};this.qw=!0;this.Bn=new $.Fv;this.Bn.ly($.Cn);this.Bn.size(10);this.Bn.anchor("center");this.Bn.offsetX(0);this.Bn.offsetY(0);this.Bn.rotation(0);this.Bn.ob(this);this.Bn.oh=Efa;this.fm=new $.Ms;this.fm.positionFormatter($.Cn);
this.fm.format($.Cn);this.fm.background(null);this.fm.rotation(0);this.fm.width(null);this.fm.height(null);this.fm.fontSize(11);this.fm.minFontSize(8);this.fm.maxFontSize(72);this.fm.ob(this);this.fm.oh=Ffa;this.fm.Ud(!0);this.data(a||null,b);$.rs(this,this,this.Uf,this.Ag,null,this.Uf,null,this.Di);$.R(this.ya,[["seriesType",8192,1,0,function(){this.Da&&(this.Da.Xc(),this.Da=null)}],["pointWidth",0,0,0,function(){this.Da&&this.Da.mo()&&this.Da.u(80,1)}],["connectMissingPoints",0,0,0,function(){this.Da&&
!this.Da.mo()&&this.Da.u(80,1)}]])},SR=function(a,b){var c=a.aa().ka();if($.F(b)){var d=$.Qb("diagonal-brick");c={index:c,sourceHatchFill:d,iterator:a.aa()};c=$.Qb(b.call(c))}else c=$.da(b)?b?$.Qb("diagonal-brick"):null:$.Qb(b);return c},Gfa=function(a){var b=a.aa(),c=b.get("value"),d=b.ka(),e;$.n(b.get("hatchFill"))?e=b.get("hatchFill"):e=d==b.Nb()-1&&$.n(a.Gz())?a.Gz():!d&&$.n(a.cz())?a.cz():c==a.eg("max")&&$.n(a.Mz())?a.Mz():c==a.eg("min")&&$.n(a.Pz())?a.Pz():0>c&&$.n(a.Sz())?a.Sz():a.xc();return SR(a,
e)},TR=function(a,b){for(var c={},d=a.length;d--;){var e=a[d];if(e){var f=!$.L(e,$.X);if(f?e.enabled:e.enabled())for(var h=0,k=b.length;h<k;h++){var l=b[h],m=f?e[l]:e[l]();$.n(m)&&(c[l]=$.L(m,$.Hp)?m.F():m)}}}return c},UR=function(a,b){for(var c={},d=a.length;d--;){var e=a[d];if(e)for(var f=!$.L(e,$.X),h=0,k=b.length;h<k;h++){var l=b[h],m=f?e[l]:e[l]();$.n(m)&&(c[l]=$.L(m,$.Hp)?m.F():m)}}return c},VR=function(a){QR.call(this,a);this.path=$.Xi();this.path.zIndex(1);this.b=null;this.f=[this.path]},
WR=function(a){VR.call(this,a);this.g=$.Xi();this.g.zIndex(1.1);this.f.push(this.g)},XR=function(a){QR.call(this,a)},YR=function(a){VR.call(this,a)},ZR=function(a){QR.call(this,a)},$R=function(a,b){var c=new RR(a,b);c.ea(!0,$.Xk("sparkline"));return c},Cfa={OA:"area",FD:"column",os:"line",gla:"win-loss"};$.I(QR,$.vs);var aS={};$.g=QR.prototype;$.g.ga=null;$.g.ra=$.vs.prototype.ra|20;$.g.pa=$.vs.prototype.pa|976;$.g.Tw=!1;$.g.Ph=0;$.g.aa=function(){return this.xa.aa()};$.g.uc=function(){return this.xa.uc()};
$.g.nc=function(){return this.xa};$.g.wj=function(){return!1};$.g.$A=function(){if(!this.enabled())return null;var a=this.xa.Za(),b=this.xa.Qa(),c=this.aa(),d=!1,e=c.get("x");c=c.get("value");if(!$.n(e)||!$.n(c))return null;a.vj(c)&&(c=window.NaN);b=b.vj(e)?window.NaN:this.ue(b.transform(e,.5),!0);a=this.ue(a.transform(c,.5),!1);if((0,window.isNaN)(b)||(0,window.isNaN)(a))d=!0;return d?null:[b,a]};$.g.mo=function(){return!1};
$.g.xm=function(){this.enabled()&&(this.Tw=this.Tw?this.hE():this.CI())&&this.ag();this.enabled()&&this.Tw&&this.Zo()};$.g.remove=function(){this.xa.Eb().O(null);this.wa&&this.wa.remove();this.xa.labels().O(null);QR.B.remove.call(this)};$.g.hd=function(){this.Tw=!1;this.ga=this.qb();this.wa||(this.wa=$.Vi(),$.ad(this,this.wa));this.Cc();var a=this.xa.fm;$.V(a);a.clear();a.O(this.O());a.ja(this.qb());a=this.xa.Bn;$.V(a);var b=this.Uu();a.yH(b);b=this.Yw();a.zH(b);a.clear();a.O(this.O());a.ja(this.ga)};
$.g.$k=function(){var a=this.xa.Bn;a.Y();var b=$.da(this.xa.clip())?this.xa.clip()?this.xa.qb():"none":this.xa.clip();var c=a.be();c&&c.clip(b);a.ba(!1);a.I(4294967295);a=this.xa.fm;a.Y();(c=a.be())&&c.clip(b);a.ba(!1);a&&a.I(4294967295);this.J(2)?this.I(0):this.I(4294967295)};
$.g.Fc=function(a){if(!this.Qd||a)this.Qd=new $.Cu;a=this.aa();var b={chart:{value:this.nc(),type:""},series:{value:this,type:""},index:{value:a.ka(),type:"number"},value:{value:a.get("value"),type:"number"},x:{value:a.get("x"),type:"string"},seriesName:{value:"Series "+a.ka(),type:"string"}};this.Qd.ng(a).yi([this,this.nc()]).Nl({"%XValue":"x"});return $.nt(this.Qd,b)};$.g.Qj=function(){return this.Fc()};
$.g.Ti=function(a){var b=this.aa(),c=b.j("shape");return c?(b=c.hb(),a=$.ij(a),{value:$.en(b,a)}):{value:{x:b.j("x"),y:b.j("value")}}};$.g.CI=function(){return this.hE()};$.g.ue=function(a,b){if(b){var c=this.ga.left;var d=this.ga.width}else c=this.ga.Na(),d=-this.ga.height;return c+a*d};
$.g.ag=function(){var a=this.xa;var b=a.aa(),c=b.get("value"),d=b.ka();var e=b.get("label");if(d==b.Nb()-1){var f=a.zG();var h=a.Mh.lastLabels}else d||(f=a.oF(),h=a.Mh.firstLabels);if(c==a.eg("max")){var k=a.Bg();var l=a.Mh.maxLabels}else c==a.eg("min")&&(k=a.Cg(),l=a.Mh.minLabels);if(0>c){var m=a.dH();var p=a.Mh.negativeLabels}b=a.labels();h=UR([h,l,p,a.Mh.labels],bS);e=TR([e,f,k,m,b],bS);e=UR([e,h],bS);f=a.fm.Vd(d);k=null;e.enabled?(k=e.position||a.fm.i("position"),k=a.Da.Ti(k),m=a.Da.Fc(),f?(f.Cf(m),
f.vc(k)):f=a.fm.add(m,k,d),f.di(),f.ad(e),k=f):f&&f.clear();(a=k)&&a.Y()};
$.g.Zo=function(){var a=this.xa;var b=a.aa(),c=b.get("value"),d=b.ka();var e=b.get("marker");if(d==b.Nb()-1){var f=a.BG();var h=a.Mh.lastMarkers}else d||(f=a.qF(),h=a.Mh.firstMarkers);if(c==a.eg("max")){var k=a.PG();var l=a.Mh.maxMarkers}else c==a.eg("min")&&(k=a.VG(),l=a.Mh.minMarkers);if(0>c){var m=a.fH();var p=a.Mh.negativeMarkers}b=a.Eb();c=a.Mh.markers;var q=a.Tu(!0);q={fill:q,stroke:$.zk(q)};h=UR([h,l,p,c,q],cS);e=TR([e,f,k,m,b],cS);e=UR([e,h],cS);f=a.Bn.mq(d);k=null;e.enabled?(k=e.position||
a.Bn.position(),k=a.Da.Ti(k),f?f.vc(k):f=a.Bn.add(k,d),f.di(),$.Iv(f,a.Bn),f.ad(e),k=f):f&&f.clear();(a=k)&&a.Y()};$.g.Uu=function(){return $.Mb(this.xa.Ll(this.xa.fill()))};$.g.Yw=function(){return $.zk(this.Uu())};$.g.zr=function(){this.xa.Bn.type("circle").size(1.8).position("center");return{labels:{background:{enabled:!1},position:"center",anchor:"center-bottom"},color:"#4682B4"}};$.I(RR,$.qv);RR.prototype.Ra=function(){return"sparkline"};RR.prototype.pa=$.qv.prototype.pa|28672;var Efa=40,Ffa=40;$.g=RR.prototype;$.g.Mf=function(a){a=RR.B.Mf.call(this,a);var b=this.Da&&this.Da.ga||$.Ol(0,0,0,0),c=a.clientX;var d=b.left+$.Ci(this.O().Ca()).x;b=(c-d)/b.width;b=this.Qa().Wc(b);b=this.data().find("x",b);0>b&&(b=window.NaN);a.pointIndex=b;return a};$.g.xd=function(){};
$.g.Br=function(a){var b=this.Da&&this.Da.ga||$.Ol(0,0,0,0),c=a.clientX;a=a.clientY;var d=$.Ci(this.O().Ca());c-=d.x;a-=d.y;d=b.left;var e=b.top,f=b.width;b=b.height;if(c<d||c>d+f||a<e||a>e+b)return null;b=[];d=(c-d)/f;d=this.Qa().Wc(d);d=$.bq(this.data(),d,$.L(this.Qa(),$.Qr));d=d.length?d[0]:window.NaN;e=this.aa();e.select(d)&&(f=e.j("x"),e=e.j("value"),c=$.Ll(f,e,c,a),(0,window.isNaN)(f)||(0,window.isNaN)(e)||b.push({U:this,cd:[d],Nm:d,Yd:{index:d,Jf:c}}));return b};$.g.Ii=function(){return"none"};
$.g.Fc=function(){this.Qd||(this.Qd=new $.Cu);var a=this.aa();this.Qd.ng(a).yi([this]);a={x:{value:a.get("x"),type:"string"},value:{value:a.get("value"),type:"number"},index:{value:a.ka(),type:"number"},chart:{value:this,type:""}};$.nt(this.Qd,a);return this.Qd};$.g.Qj=function(){return this.Fc()};$.g.Tt=function(){return!0};$.g.Sg=function(a){(a=this.gg(a))&&this.dispatchEvent(a)};
$.g.gg=function(a){var b;"pointIndex"in a?b=a.pointIndex:"labelIndex"in a?b=a.labelIndex:"markerIndex"in a&&(b=a.markerIndex);b=$.O(b);a.pointIndex=b;var c=a.type;switch(c){case "mouseout":c="pointmouseout";break;case "mouseover":c="pointmouseover";break;case "mousemove":c="pointmousemove";break;case "mousedown":c="pointmousedown";break;case "mouseup":c="pointmouseup";break;case "click":c="pointclick";break;case "dblclick":c="pointdblclick";break;default:return null}var d=this.data().aa();d.select(b)||
d.reset();return{type:c,actualTarget:a.target,pie:this,iterator:d,sliceIndex:b,pointIndex:b,target:this,originalEvent:a}};$.g.ei=function(){return this};$.g.ai=function(){return this};$.g.Ie=function(){return[this]};$.g.Jd=$.ha;$.g.el=function(a){return $.n(a)?(a=$.fj(a),a!=this.$h&&(this.$h=a),this):this.$h};$.g.wd=function(){return null};$.g.qg=function(){return!1};$.g.wj=function(){return!1};$.g.mk=$.ha;$.g.Lj=$.ha;$.g.Bl=$.ha;$.g.gp=$.ha;
$.g.rr=function(a){return $.n(a)?(this.tk=a,this):this.tk||{}};var cS="enabled position anchor offsetX offsetY type size fill stroke".split(" "),bS="enabled background padding position anchor offsetX offsetY rotation width height fontSize fontFamily fontColor fontOpacity fontDecoration fontStyle fontVariant fontWeight letterSpacing textDirection lineHeight textIndent vAlign hAlign wordWrap wordBreak textOverflow selectable disablePointerEvents useHtml".split(" ");$.g=RR.prototype;
$.g.Qa=function(a){if($.n(a)){if(a=$.Er(this.bb,a,null,15))this.bb=a,this.bb.ba(!1),this.u(4096,1);return this}this.bb||(this.bb=$.Dr());return this.bb};$.g.Za=function(a){if($.n(a)){if(a=$.Er(this.yc,a,null,15))this.yc=a,this.yc.ba(!1),this.u(4096,1);return this}this.yc||(this.yc=$.Ar());return this.yc};
$.g.Om=function(a,b){var c=$.O(a);if((0,window.isNaN)(c)){c=0;var d=a}else c=a,d=b;var e=this.dj[c];e||(e=new $.zx,this.dj[c]=e,$.ad(this,e),$.U(e,this.zx,this),this.u(16384,1));return $.n(d)?(e.N(d),this):e};$.g.Xm=function(a,b){var c=$.O(a);if((0,window.isNaN)(c)){c=0;var d=a}else c=a,d=b;var e=this.gj[c];e||(e=new $.Cx,this.gj[c]=e,$.ad(this,e),$.U(e,this.zx,this),this.u(16384,1));return $.n(d)?(e.N(d),this):e};
$.g.dn=function(a,b){var c=$.O(a);if((0,window.isNaN)(c)){c=0;var d=a}else c=a,d=b;var e=this.kj[c];e||(e=new $.Fx,this.kj[c]=e,$.ad(this,e),$.U(e,this.zx,this),this.u(16384,1));return $.n(d)?(e.N(d),this):e};$.g.zx=function(){this.u(16384,1)};
$.g.data=function(a,b){return $.n(a)?(this.Nf!==a&&(this.Nf=a,$.$c(this.ze),$.L(a,$.$p)?this.Um=this.ze=a.zl():this.Um=$.L(a,$.jq)?this.ze=a.me():(this.ze=new $.jq($.D(a)||$.z(a)?a:null,b)).me(),$.ad(this,this.ze),this.qa=this.Um,$.U(this.qa,this.Td,this),this.Da&&this.Da.u(16,21),this.u(256,1)),this):this.qa};$.g.mR=function(){var a=this.aa(),b=this.Za();a=a.get("value");return b.vj(a)?null:a};$.g.Td=function(a){$.W(a,16)&&(this.Da&&this.Da.u(16,21),this.u(256,1))};
$.g.aa=function(){return this.Xe||this.uc()};$.g.uc=function(){return this.Xe=this.data().aa()};$.g.xH=function(a){var b=0;$.W(a,32768)&&(b|=256);$.W(a,2048)&&(b=32);$.W(a,1)&&(b=8192);$.W(a,16)&&(b|=8448,this.kv());$.W(a,4)&&(b|=4096);this.u(b,1)};var dS=function(){var a={};$.Oo(a,0,"seriesType",Dfa);$.Oo(a,0,"pointWidth",function(a){return $.Zm(a,this.i("pointWidth"))});$.Oo(a,0,"connectMissingPoints",$.Zo);return a}();$.T(RR,dS);$.g=RR.prototype;
$.g.clip=function(a){return $.n(a)?(null===a&&(a=!1),this.Rf!=a&&(this.Rf=a,this.Da&&this.Da.u(4,9)),this):this.Rf};$.g.Ll=function(a,b){if($.F(a)){var c=1<arguments.length?this.Ll.apply(this,$.Ha(arguments,1)):this.Mh.color;c={index:this.aa().ka(),sourceColor:c,iterator:this.aa()};c=a.call(c)}else c=a;return c};$.g.fill=function(a,b,c,d,e,f,h){if($.n(a)){var k=$.F(a)?a:$.Mb.apply(null,arguments);k!=this.Oc&&(this.Oc=k,this.Da&&this.Da.u(16,1));return this}return this.Oc||this.Mh.fill};
$.g.Rz=function(a,b,c,d,e,f,h){if($.n(a)){var k=$.F(a)?a:$.Mb.apply(null,arguments);k!=this.W_&&(this.W_=k,this.Da&&this.Da.u(16,1));return this}return this.W_||this.Mh.negativeFill};$.g.bz=function(a,b,c,d,e,f,h){if($.n(a)){var k=$.F(a)?a:$.Mb.apply(null,arguments);k!=this.JY&&(this.JY=k,this.Da&&this.Da.u(16,1));return this}return this.JY||this.Mh.firstFill};
$.g.Fz=function(a,b,c,d,e,f,h){if($.n(a)){var k=$.F(a)?a:$.Mb.apply(null,arguments);k!=this.q_&&(this.q_=k,this.Da&&this.Da.u(16,1));return this}return this.q_||this.Mh.lastFill};$.g.Lz=function(a,b,c,d,e,f,h){if($.n(a)){var k=$.F(a)?a:$.Mb.apply(null,arguments);k!=this.F_&&(this.F_=k,this.Da&&this.Da.u(16,1));return this}return this.F_||this.Mh.maxFill};
$.g.Oz=function(a,b,c,d,e,f,h){if($.n(a)){var k=$.F(a)?a:$.Mb.apply(null,arguments);k!=this.M_&&(this.M_=k,this.Da&&this.Da.u(16,1));return this}return this.M_||this.Mh.minFill};$.g.Tu=function(a){var b=this.aa(),c=b.get("value"),d=b.ka(),e;a&&$.n(b.get("fill"))?e=b.get("fill"):e=d==b.Nb()-1&&$.n(this.Fz())?this.Fz():!d&&$.n(this.bz())?this.bz():c==this.eg("max")&&$.n(this.Lz())?this.Lz():c==this.eg("min")&&$.n(this.Oz())?this.Oz():0>c&&$.n(this.Rz())?this.Rz():this.fill();a=this.Ll(e);return $.Mb(a)};
$.g.stroke=function(a,b,c,d,e){if($.n(a)){var f=$.F(a)?a:$.Ob.apply(null,arguments);f!=this.dd&&(this.dd=f,this.Da&&this.Da.u(16,1));return this}return this.dd||this.Mh.stroke};$.g.kq=function(){return $.Ob(this.Ll(this.stroke()))};$.g.xc=function(a,b,c,d){if($.n(a)){var e=$.F(a)||$.da(a)?a:$.Qb.apply(null,arguments);e!=this.Im&&(this.Im=e,this.Da&&this.Da.u(64,1));return this}return $.n(this.Im)?this.Im:this.Mh.hatchFill};
$.g.Sz=function(a,b,c,d){if($.n(a)){var e=$.F(a)||$.da(a)?a:$.Qb.apply(null,arguments);e!=this.rT&&(this.rT=e,this.Da&&this.Da.u(64,1));return this}return $.n(this.rT)?this.rT:this.Mh.negativeHatchFill};$.g.cz=function(a,b,c,d){if($.n(a)){var e=$.F(a)||$.da(a)?a:$.Qb.apply(null,arguments);e!=this.KY&&(this.KY=e,this.Da&&this.Da.u(64,1));return this}return this.KY||this.Mh.firstHatchFill};
$.g.Gz=function(a,b,c,d){if($.n(a)){var e=$.F(a)||$.da(a)?a:$.Qb.apply(null,arguments);e!=this.r_&&(this.r_=e,this.Da&&this.Da.u(64,1));return this}return this.r_||this.Mh.lastHatchFill};$.g.Mz=function(a,b,c,d){if($.n(a)){var e=$.F(a)||$.da(a)?a:$.Qb.apply(null,arguments);e!=this.G_&&(this.G_=e,this.Da&&this.Da.u(64,1));return this}return this.G_||this.Mh.maxHatchFill};
$.g.Pz=function(a,b,c,d){if($.n(a)){var e=$.F(a)||$.da(a)?a:$.Qb.apply(null,arguments);e!=this.N_&&(this.N_=e,this.Da&&this.Da.u(64,1));return this}return this.N_||this.Mh.minHatchFill};$.g.Eb=function(a){this.sd||(this.sd=new $.Gv,$.ad(this,this.sd),$.U(this.sd,this.qo,this));return $.n(a)?(!$.E(a)||"enabled"in a||(a.enabled=!0),this.sd.N(a),this):this.sd};
$.g.fH=function(a){this.gH||(this.gH=new $.Gv,$.ad(this,this.gH),$.U(this.gH,this.qo,this));return $.n(a)?(!$.E(a)||"enabled"in a||(a.enabled=!0),this.gH.N(a),this):this.gH};$.g.qF=function(a){this.rF||(this.rF=new $.Gv,$.ad(this,this.rF),$.U(this.rF,this.qo,this));return $.n(a)?(!$.E(a)||"enabled"in a||(a.enabled=!0),this.rF.N(a),this):this.rF};
$.g.BG=function(a){this.CG||(this.CG=new $.Gv,$.ad(this,this.CG),$.U(this.CG,this.qo,this));return $.n(a)?(!$.E(a)||"enabled"in a||(a.enabled=!0),this.CG.N(a),this):this.CG};$.g.PG=function(a){this.QG||(this.QG=new $.Gv,$.ad(this,this.QG),$.U(this.QG,this.qo,this));return $.n(a)?(!$.E(a)||"enabled"in a||(a.enabled=!0),this.QG.N(a),this):this.QG};
$.g.VG=function(a){this.WG||(this.WG=new $.Gv,$.ad(this,this.WG),$.U(this.WG,this.qo,this));return $.n(a)?(!$.E(a)||"enabled"in a||(a.enabled=!0),this.WG.N(a),this):this.WG};$.g.qo=function(a){$.W(a,1)&&this.Da&&this.Da.u(128,1)};$.g.labels=function(a){this.Ia||(this.Ia=new $.Rs,$.ad(this,this.Ia),$.U(this.Ia,this.ce,this));return $.n(a)?(!$.E(a)||"enabled"in a||(a.enabled=!0),this.Ia.N(a),this):this.Ia};
$.g.dH=function(a){this.eH||(this.eH=new $.Rs,$.ad(this,this.eH),$.U(this.eH,this.ce,this));return $.n(a)?(!$.E(a)||"enabled"in a||(a.enabled=!0),this.eH.N(a),this):this.eH};$.g.oF=function(a){this.pF||(this.pF=new $.Rs,$.ad(this,this.pF),$.U(this.pF,this.ce,this));return $.n(a)?(!$.E(a)||"enabled"in a||(a.enabled=!0),this.pF.N(a),this):this.pF};
$.g.zG=function(a){this.AG||(this.AG=new $.Rs,$.ad(this,this.AG),$.U(this.AG,this.ce,this));return $.n(a)?(!$.E(a)||"enabled"in a||(a.enabled=!0),this.AG.N(a),this):this.AG};$.g.Bg=function(a){this.Dn||(this.Dn=new $.Rs,$.ad(this,this.Dn),$.U(this.Dn,this.ce,this));return $.n(a)?(!$.E(a)||"enabled"in a||(a.enabled=!0),this.Dn.N(a),this):this.Dn};
$.g.Cg=function(a){this.En||(this.En=new $.Rs,$.ad(this,this.En),$.U(this.En,this.ce,this));return $.n(a)?(!$.E(a)||"enabled"in a||(a.enabled=!0),this.En.N(a),this):this.En};$.g.ce=function(a){$.W(a,1)&&this.Da&&this.Da.u(256,1)};
$.g.lb=function(){var a;if(this.J(4096)){this.sH();var b=this.Qa(),c=this.Za();b.tf()&&b.Wf();c.tf()&&c.Wf();for(a=this.uc();a.advance();){var d=a.get("x");var e=a.get("value");$.n(d)&&b.Kc(d);$.n(e)&&c.Kc(e)}a=!1;b.tf()&&(a|=b.cg());c.tf()&&(a|=c.cg());a&&this.kv();b=-window.Infinity;c=window.Infinity;var f=d=0;for(a=this.uc();a.advance();){if(e=this.mR())e=$.O(e),(0,window.isNaN)(e)||(b=Math.max(b,e),c=Math.min(c,e),d+=e);f++}a=d/f;this.za("max",b);this.za("min",c);this.za("sum",d);this.za("average",
a);this.za("pointsCount",f);this.I(4096)}};
$.g.Ui=function(a){if(this.J(8192)&&!this.Da){var b=this.i("seriesType"),c=aS[b];c?(c=new c(this),$.ad(this,c),this.Da=c,c.oh=30,$.U(c,this.xH,this),this.Mh=this.rr()[$.Zk(b)]||this.Da.zr(),this.u(12288,1)):($.Nj(4,null,[b+" series"]),c=null);this.Da=c}this.lb();if(!this.Lf()){$.Vp(this.Da);this.J(4)&&(this.pf=a.clone().round(),this.Da.mo()&&(c=this.Da,a=this.pf,b=c.uc().Nb(),c=c.JF(a),b=(a.width-b*c)%(b-1),0!=a.height%2&&--a.height,0!=b&&(a.left+=Math.floor(b/2),a.width-=b)),this.kv(),this.u(24576));
if(this.J(16384)){a=$.Ea(this.dj,this.gj,this.kj);b=0;for(c=a.length;b<c;b++){var d=a[b];d&&($.V(d),d.Db()?d.scale(this.Za()):d.scale(this.Qa()),d.ja(this.pf),d.O(this.Va),d.Y(),d.ba(!1))}this.I(16384)}if(this.J(8192)){if(a=this.Da){a.O(this.Va);a.ja(this.pf);this.Da.hd();for(a=this.uc();a.advance();)this.Da.xm();this.Da.$k();this.Eb().I(4294967295);this.VG().I(4294967295);this.PG().I(4294967295);this.fH().I(4294967295);this.qF().I(4294967295);this.BG().I(4294967295);this.labels().I(4294967295);this.Cg().I(4294967295);
this.Bg().I(4294967295);this.dH().I(4294967295);this.oF().I(4294967295);this.zG().I(4294967295)}this.I(8192)}$.Xp(this.Da)}};$.g.kv=function(){this.Da&&this.Da.u(80)};$.g.QB=function(){return["x"]};$.g.RB=function(a){return a.get("x")};$.g.PB=function(a){a=a.get("name");return $.z(a)?a:null};$.g.cj=function(){return!this.aa().Nb()||!(this.Da&&this.Da.enabled())};
$.g.$=function(a,b){RR.B.$.call(this,a,b);"defaultSeriesSettings"in a&&this.rr(a.defaultSeriesSettings);var c,d=a.lineAxesMarkers,e=a.rangeAxesMarkers,f=a.textAxesMarkers,h=a.scales;this.data(a.data);$.dp(this,dS,a);this.clip(a.clip);this.data(a.data);var k=this.Ra(),l={};if($.D(h))for(c=0;c<h.length;c++){var m=h[c];$.z(m)&&(m={type:m});m=$.$k(m,c,k);var p=$.yr(m.type,!1);p.N(m);l[c]=p}else if($.E(h))for(c in h)h.hasOwnProperty(c)&&(m=h[c],$.z(m)&&(m={type:m}),m=$.$k(m,c,k),p=$.yr(m.type,!1),p.N(m),
l[c]=p);m=a.xScale;$.B(m)?p=l[m]:$.z(m)?(p=$.yr(m,null))||(p=l[m]):$.E(m)?(p=$.yr(m.type,!0),p.N(m)):p=null;p&&this.Qa(p);m=a.yScale;$.B(m)?p=l[m]:$.z(m)?(p=$.yr(m,null))||(p=l[m]):$.E(m)?(p=$.yr(m.type,!1),p.N(m)):p=null;p&&this.Za(p);if($.D(d))for(c=0;c<d.length;c++)m=d[c],this.Om(c,m),$.E(m)&&"scale"in m&&1<m.scale&&this.Om(c).scale(l[m.scale]);if($.D(e))for(c=0;c<e.length;c++)m=e[c],this.Xm(c,m),$.E(m)&&"scale"in m&&1<m.scale&&this.Xm(c).scale(l[m.scale]);if($.D(f))for(c=0;c<f.length;c++)m=f[c],
this.dn(c,m),$.E(m)&&"scale"in m&&1<m.scale&&this.dn(c).scale(l[m.scale]);this.stroke(a.stroke);this.Fz(a.lastFill);this.bz(a.firstFill);this.Lz(a.maxFill);this.Oz(a.minFill);this.Rz(a.negativeFill);this.fill(a.fill);this.Gz(a.lastHatchFill);this.cz(a.firstHatchFill);this.Mz(a.maxHatchFill);this.Pz(a.minHatchFill);this.Sz(a.negativeHatchFill);this.xc(a.hatchFill);a.lastMarkers&&this.BG().ea(!!b,a.lastMarkers);a.firstMarkers&&this.qF().ea(!!b,a.firstMarkers);a.maxMarkers&&this.PG().ea(!!b,a.maxMarkers);
a.minMarkers&&this.VG().ea(!!b,a.minMarkers);a.negativeMarkers&&this.fH().ea(!!b,a.negativeMarkers);a.markers&&this.Eb().ea(!!b,a.markers);a.firstLabels&&this.oF().ea(!!b,a.firstLabels);a.lastLabels&&this.zG().ea(!!b,a.lastLabels);a.maxLabels&&this.Bg().ea(!!b,a.maxLabels);a.minLabels&&this.Cg().ea(!!b,a.minLabels);a.negativeLabels&&this.dH().ea(!!b,a.negativeLabels);a.labels&&this.labels().ea(!!b,a.labels)};
$.g.F=function(){var a=RR.B.F.call(this),b,c={},d=[],e;c[$.na(this.Qa())]=this.Qa().F();d.push(c[$.na(this.Qa())]);a.xScale=d.length-1;this.Qa()!=this.Za()&&(c[$.na(this.Za())]=this.Za().F(),d.push(c[$.na(this.Za())]));a.yScale=d.length-1;$.pp(this,dS,a);a.clip=$.L(this.Rf,$.K)?this.Rf.F():this.Rf;a.data=this.data().F();$.F(this.lastFill)&&($.F(this.Fz())?$.Pj(8,null,["Series last fill"]):$.n(this.Fz())&&(a.lastFill=$.Ak(this.Fz())));$.F(this.lastHatchFill)&&($.F(this.Gz())?$.Pj(8,null,["Series last hatch fill"]):
$.n(this.Gz())&&(a.lastHatchFill=$.Ak(this.Gz())));a.lastMarkers=this.BG().F();a.lastLabels=this.zG().F();$.F(this.firstFill)&&($.F(this.bz())?$.Pj(8,null,["Series first fill"]):$.n(this.bz())&&(a.firstFill=$.Ak(this.bz())));$.F(this.firstHatchFill)&&($.F(this.cz())?$.Pj(8,null,["Series first hatch fill"]):$.n(this.cz())&&(a.firstHatchFill=$.Ak(this.cz())));a.firstMarkers=this.qF().F();a.firstLabels=this.oF().F();$.F(this.maxFill)&&($.F(this.Lz())?$.Pj(8,null,["Series max fill"]):$.n(this.Lz())&&
(a.maxFill=$.Ak(this.Lz())));$.F(this.maxHatchFill)&&($.F(this.Mz())?$.Pj(8,null,["Series max hatch fill"]):$.n(this.Mz())&&(a.maxHatchFill=$.Ak(this.Mz())));a.maxMarkers=this.PG().F();a.maxLabels=this.Bg().F();$.F(this.minFill)&&($.F(this.Oz())?$.Pj(8,null,["Series min fill"]):$.n(this.Oz())&&(a.minFill=$.Ak(this.Oz())));$.F(this.minHatchFill)&&($.F(this.Pz())?$.Pj(8,null,["Series min hatch fill"]):$.n(this.Pz())&&(a.minHatchFill=$.Ak(this.Pz())));a.minMarkers=this.VG().F();a.minLabels=this.Cg().F();
$.F(this.negativeFill)&&($.F(this.Rz())?$.Pj(8,null,["Series negative fill"]):$.n(this.Rz())&&(a.negativeFill=$.Ak(this.Rz())));$.F(this.negativeHatchFill)&&($.F(this.Sz())?$.Pj(8,null,["Series negative hatch fill"]):$.n(this.Sz())&&(a.negativeHatchFill=$.Ak(this.Sz())));a.negativeMarkers=this.fH().F();a.negativeLabels=this.dH().F();$.F(this.fill)&&($.F(this.fill())?$.Pj(8,null,["Series fill"]):$.n(this.fill())&&(a.fill=$.Ak(this.fill())));$.F(this.hatchFill)&&($.F(this.xc())?$.Pj(8,null,["Series hatch fill"]):
$.n(this.xc())&&(a.hatchFill=$.Ak(this.xc())));a.markers=this.Eb().F();a.labels=this.labels().F();$.F(this.stroke)&&($.F(this.stroke())?$.Pj(8,null,["Series stroke"]):$.n(this.stroke())&&(a.stroke=$.Ak(this.stroke())));var f=[];for(b=0;b<this.dj.length;b++)if(e=this.dj[b]){var h=e.F();if(e=e.scale()){var k=$.na(e);c[k]?h.scale=(0,$.wa)(d,c[k]):(c[k]=e.F(),d.push(c[k]),h.scale=d.length-1)}f.push(h)}f.length&&(a.lineAxesMarkers=f);f=[];for(b=0;b<this.gj.length;b++)if(e=this.gj[b]){h=e.F();if(e=e.scale())k=
$.na(e),c[k]?h.scale=(0,$.wa)(d,c[k]):(c[k]=e.F(),d.push(c[k]),h.scale=d.length-1);f.push(h)}f.length&&(a.rangeAxesMarkers=f);f=[];for(b=0;b<this.kj.length;b++)if(e=this.kj[b]){h=e.F();if(e=e.scale())k=$.na(e),c[k]?h.scale=(0,$.wa)(d,c[k]):(c[k]=e.F(),d.push(c[k]),h.scale=d.length-1);f.push(h)}f.length&&(a.textAxesMarkers=f);a.scales=d;return{chart:a}};$.oo.sparkline=$R;var eS=RR.prototype;$.H("anychart.sparkline",$R);eS.xScale=eS.Qa;eS.yScale=eS.Za;eS.lineMarker=eS.Om;eS.rangeMarker=eS.Xm;
eS.textMarker=eS.dn;eS.data=eS.data;eS.clip=eS.clip;eS.lastFill=eS.Fz;eS.lastHatchFill=eS.Gz;eS.lastMarkers=eS.BG;eS.lastLabels=eS.zG;eS.firstFill=eS.bz;eS.firstHatchFill=eS.cz;eS.firstMarkers=eS.qF;eS.firstLabels=eS.oF;eS.maxFill=eS.Lz;eS.maxHatchFill=eS.Mz;eS.maxMarkers=eS.PG;eS.maxLabels=eS.Bg;eS.minFill=eS.Oz;eS.minHatchFill=eS.Pz;eS.minMarkers=eS.VG;eS.minLabels=eS.Cg;eS.negativeFill=eS.Rz;eS.negativeHatchFill=eS.Sz;eS.negativeMarkers=eS.fH;eS.negativeLabels=eS.dH;eS.fill=eS.fill;
eS.hatchFill=eS.xc;eS.markers=eS.Eb;eS.labels=eS.labels;eS.stroke=eS.stroke;eS.getType=eS.Ra;eS.noData=eS.Tm;$.I(VR,QR);$.g=VR.prototype;$.g.xm=function(){if(this.enabled()){var a;if(a=this.Tw?this.hE():this.CI())this.Zo(),this.ag();this.Tw=this.xa.i("connectMissingPoints")&&this.Tw||a}};
$.g.hd=function(){VR.B.hd.call(this);if(!this.Lf()&&this.enabled()){var a=this.xa.Za().transform(0);(0,window.isNaN)(a)&&(a=0);this.Ph=this.ue($.Xa(a,0,1),!1);var b;a=this.f.length;this.J(8)&&(this.wa.zIndex(this.zIndex()),this.I(8));this.J(4)&&(this.xa.clip()&&($.da(this.xa.clip())?b=this.ga:b=this.xa.clip(),this.wa.clip(b)),this.I(4));if(this.J(16)){for(b=0;b<a;b++)this.f[b].clear();this.OW()}if(this.J(2)){b=this.O();this.wa.parent(b);for(b=0;b<a;b++)this.f[b].parent(this.wa);this.b&&this.b.parent(this.wa);
this.I(2)}this.J(64)&&!this.b&&(this.b=$.Xi(),this.b.parent(this.wa),this.b.zIndex(2),this.b.pd(!0))}};$.g.$k=function(){this.NO();this.IY();VR.B.$k.call(this)};$.g.Ti=function(){var a=this.aa();return{value:{x:a.j("x"),y:a.j("value")}}};$.g.NO=$.ha;$.g.IY=$.ha;$.g.OW=function(){this.path.stroke(this.xa.kq(),1);this.path.fill(null)};$.g.zr=function(){return VR.B.zr.call(this)};$.I(WR,VR);aS.area=WR;$.g=WR.prototype;$.g.hd=function(){WR.B.hd.call(this);this.o=window.NaN};$.g.OW=function(){var a=$.Mb(this.xa.Ll(this.xa.fill()));this.path.stroke(null);this.path.fill(a);this.g.stroke(this.xa.kq());this.g.fill(null)};$.g.IY=function(){this.J(64)&&this.b&&(this.b.Sd(this.path.F()),this.b&&(this.b.stroke(null),this.b.fill(SR(this.xa,this.xa.xc()))))};
$.g.CI=function(){var a=this.$A();if(!a)return!1;if(this.J(16)){var b=a[0];a=a[1];this.NO();this.path.moveTo(b,this.Ph).lineTo(b,a);this.g.moveTo(b,a);this.o=b;this.aa().j("x",b).j("value",a)}return!0};$.g.hE=function(){var a=this.$A();if(!a)return!1;if(this.J(16)){var b=a[0];a=a[1];this.path.lineTo(b,a);this.g.lineTo(b,a);this.o=b;this.aa().j("x",b).j("value",a)}return!0};$.g.NO=function(){(0,window.isNaN)(this.o)||this.path.lineTo(this.o,this.Ph).close()};
$.g.zr=function(){var a=WR.B.zr.call(this);a.stroke={color:"#64b5f6",thickness:1.5};a.fill={color:"#64b5f6",opacity:.5};return a};$.I(XR,QR);aS.column=XR;$.g=XR.prototype;$.g.Va=null;$.g.ct=null;$.g.mo=function(){return!0};$.g.Z0=function(){return $.Ti()};$.g.JF=function(a){a=a||this.ga;a=Math.floor((this.xa.Qa().nK()||1/this.aa().Nb())*a.width);a=Math.floor($.N(this.xa.i("pointWidth"),a));1>a&&(a=1);return a};
$.g.hd=function(){XR.B.hd.call(this);var a=this.xa.Za().transform(0);(0,window.isNaN)(a)&&(a=0);this.Ph=this.ue($.Xa(a,0,1),!1);!this.Lf()&&this.enabled()&&(this.Va||(this.Va=new $.sz(this.Z0,$.ha),this.Va.zIndex(1)),this.J(8)&&(this.wa.zIndex(this.zIndex()),this.I(8)),this.J(4)&&(a=$.da(this.xa.clip())?this.xa.clip()?this.ga:"none":this.xa.clip(),this.wa.clip(a),this.I(4)),this.J(16)&&this.Va.clear(),this.J(64)&&(this.ct||(this.ct=new $.sz(this.Z0,$.ha),this.ct.parent(this.wa),this.ct.zIndex(2),
this.ct.pd(!0)),this.ct.clear()),this.J(2)&&(this.wa.parent(this.O()),this.Va.parent(this.wa),this.ct&&this.ct.parent(this.wa),this.I(2)))};
$.g.hE=function(){var a=this.$A();if(!a)return!1;if(this.J(16)){var b=a[0],c=a[1];c=c<this.Ph?Math.ceil(c):Math.floor(c);a=$.tz(this.Va);var d=this.JF(),e=0==d%2?0:.5;this.aa().j("x",b).j("value",c).j("shape",a);var f=Math.min(this.Ph,c);c=Math.abs(this.Ph-c);a.Hp(Math.ceil(b+e-d/2)).Ip(f).Gp(d).Fp(c);b=this.aa().j("shape");$.n(b)&&(b.fill(this.xa.Tu(!0)),b.stroke(null))}this.J(64)&&(a=this.aa(),b=this.ct?$.tz(this.ct):null,a.j("hatchFillShape",b),a=a.j("shape"),$.n(a)&&b&&b.Sd(a.F()),b=this.aa().j("hatchFillShape"),
null!=b&&b.stroke(null).fill(Gfa(this.xa)));return!0};
$.g.zr=function(){var a=XR.B.zr.call(this);a.markers||(a.markers={});a.markers.position="center-top";a.labels||(a.labels={});a.labels.position="center-top";a.labels.anchor="center-bottom";a.negativeMarkers||(a.negativeMarkers={});a.negativeMarkers.position="center-bottom";a.negativeLabels||(a.negativeLabels={});a.negativeLabels.position="center-bottom";a.negativeLabels.anchor="center-top";a.stroke={color:"#64b5f6",thickness:1.5};a.fill={color:"#64b5f6",opacity:.7};a.negativeFill={color:"#ef6c00",
opacity:.7};return a};$.I(YR,VR);aS.line=YR;$.g=YR.prototype;$.g.CI=function(){var a=this.$A();if(!a)return!1;if(this.J(16)){var b=a[0];a=a[1];this.path.moveTo(b,a);this.aa().j("x",b).j("value",a)}return!0};$.g.hE=function(){var a=this.$A();if(!a)return!1;if(this.J(16)){var b=a[0];a=a[1];this.path.lineTo(b,a);this.aa().j("x",b).j("value",a)}return!0};$.g.Uu=function(){return this.xa.kq()};$.g.Yw=function(){return $.zk(this.xa.kq())};
$.g.zr=function(){var a=YR.B.zr.call(this);a.stroke={color:"#64b5f6",thickness:1.5};a.fill={color:"#64b5f6",opacity:.5};return a};$.I(ZR,XR);aS["win-loss"]=ZR;ZR.prototype.hd=function(){ZR.B.hd.call(this);this.Ph=Math.round(this.ue(.5,!1))};ZR.prototype.$A=function(){if(!this.enabled())return null;var a=this.xa.Za(),b=this.xa.Qa(),c=this.aa(),d=!1,e=c.get("x");c=c.get("value");c=0<c?a.yf()?0:1:0>c?a.yf()?1:0:.5;if(!$.n(e)||!$.n(c))return null;a.vj(c)&&(c=window.NaN);a=b.vj(e)?window.NaN:this.ue(b.transform(e,.5),!0);b=this.ue(c,!1);if((0,window.isNaN)(a)||(0,window.isNaN)(b))d=!0;return d?null:[a,b]};
ZR.prototype.zr=function(){var a=ZR.B.zr.call(this);a.markers||(a.markers={});a.markers.position="center-top";a.markers.anchor="center-top";a.labels||(a.labels={});a.labels.position="center-top";a.labels.anchor="center-top";a.negativeMarkers||(a.negativeMarkers={});a.negativeMarkers.position="center-bottom";a.negativeMarkers.anchor="center-bottom";a.negativeLabels||(a.negativeLabels={});a.negativeLabels.position="center-bottom";a.negativeLabels.anchor="center-bottom";a.stroke={color:"#64b5f6",thickness:1.5};
a.fill={color:"#64b5f6",opacity:.7};a.negativeFill={color:"#ef6c00",opacity:.7};return a};$.oo.sparkline=$R;$.H("anychart.sparkline",$R);}).call(this,$)}
