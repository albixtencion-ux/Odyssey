/* Starbound Odyssey – Ekspansi
   Isi: Bahan bakar (BBM) + mesin mati, 4 tipe planet baru, flora/fauna/alien prosedural (sprite di-cache anti-lag),
   alien ramah (bisa direkrut jadi kru) & agresif, perang antariksa + bajak laut.
   Pasang: taruh file ini di samping index.html, lalu tambahkan <script src="expansion.js"></script>
   tepat SETELAH </script> utama. Semua modul lama dibungkus (wrap), tidak ada kode lama yang diubah. */
(()=>{
"use strict";
const R=Math.random,ft=Math.floor,
w=(o,n,f)=>{const old=o[n];o[n]=function(...a){return f.call(this,old,a)}},
say=t=>{try{Egg.say(t)}catch(e){}},gh=(s,k)=>Noise.hash(s,k,6131);

/* ===== 1. PLANET BARU (+ tipe flora per planet) ===== */
const NT=[{n:"Radioaktif",w:.34,rk:.7,dt:.1,tx:.5,hue:110,hz:"#7aff3a"},{n:"Badai",w:.42,rk:.66,dt:-.05,tx:0,hue:230,hz:"#6a7aff"},{n:"Fungi",w:.3,rk:.74,dt:.05,tx:.2,hue:320,hz:"#ff6ad0"},{n:"Bayangan",w:.36,rk:.68,dt:-.12,tx:.1,hue:262,hz:"#3a1a7a"}];
Object.assign(ENV,{Radioaktif:{ox:1,t:55,hz:2},Badai:{ox:.9,t:35,hz:1},Fungi:{ox:.5,t:60,hz:.5},Bayangan:{ox:1.1,t:12,hz:.5}});
Object.assign(I18N.D.en,{Radioaktif:"Radioactive",Badai:"Stormy",Fungi:"Fungal",Bayangan:"Shadow"});
w(Planet,"makeProfile",function(old,[s]){const b=old.call(this,s);let r=b;if(Noise.hash(s,901,4242)<.4)r={...b,...NT[ft(Noise.hash(s,902,4242)*4)]};r.fk=ft(Noise.hash(s,903,4242)*5);return r});
w(Planet,"init",function(old,a){Al.seed=-1;return old.apply(this,a)});

/* ===== 2. GENERATOR PROSEDURAL (genome -> sprite ter-cache, tanpa lag) ===== */
const GEN=s=>{const h=k=>gh(s,k),hue=h(1)*360;return{hue,plan:ft(h(2)*6),z:6+ft(h(3)*8),legs:2+ft(h(4)*3),eyes:1+ft(h(5)*2),horn:h(6)>.6,spots:h(7)>.5,glow:h(8)>.7,tail:h(9)>.5,c1:`hsl(${hue},60%,55%)`,c2:`hsl(${(hue+40)%360},55%,30%)`,c3:`hsl(${(hue+180)%360},85%,68%)`}};
const AG=id=>{const g=GEN(id);g.z=Math.min(12,g.z+3);return g};
const paint=(x,g,eye,al)=>{const z=g.z,r=(c,a,b,ww,hh)=>{x.fillStyle=c;x.fillRect((16+a)|0,(28+b)|0,Math.max(1,ww|0),Math.max(1,hh|0))};
 if(al){const H=z*1.2,p=g.plan%3;r(g.c2,-z/3,-H*.35,2,H*.35);r(g.c2,z/3-2,-H*.35,2,H*.35);r(g.c1,-z/2,-H*.8,z,H*.5);r(g.c2,-z/2-2,-H*.78,2,H*.35);r(g.c2,z/2,-H*.78,2,H*.35);r(g.c1,-z/3,-H*1.15,z*.66,H*.38);
  if(p===0)r(g.c3,-1,-H*1.15-3,2,3);else if(p===1){r(g.c3,-z/3,-H*1.15-2,2,3);r(g.c3,z/3-2,-H*1.15-2,2,3)}else{r(g.c2,-z/2-4,-H*.95,3,H*.5);r(g.c2,z/2+1,-H*.95,3,H*.5)}
  r(eye,-z/6-1,-H*1.02,2,2);if(g.eyes>1)r(eye,z/6,-H*1.02,2,2);if(g.glow)r(g.c3,-1,-H*.7,2,2);return}
 switch(g.plan){
 case 0:r(g.c2,-z/2,-z*.7+2,z,z*.7);r(g.c1,-z/2+1,-z*.7,z-2,z*.7);r(eye,-z/4,-z*.45,2,2);if(g.eyes>1)r(eye,z/5,-z*.45,2,2);break;
 case 1:for(let i=0;i<g.legs&&i<4;i++)r(g.c2,-z*.6+i*z*.4,-z*.3,2,z*.3);r(g.c1,-z*.7,-z*.7,z*1.4,z*.45);r(g.c1,z*.45,-z*.95,z*.4,z*.4);r(eye,z*.7,-z*.85,2,2);if(g.tail)r(g.c2,-z*.9,-z*.6,3,2);break;
 case 2:r(g.c1,-z/2,-z*.8,z,z*.55);r(g.c3,-z/4,-z*.7,z/2,2);r(eye,-z/4,-z*.55,2,2);for(let i=0;i<3;i++)r(g.c2,-z/2+i*z*.4,-z*.25,1,z*.35);break;
 case 3:for(let i=0;i<5;i++)r(i%2?g.c2:g.c1,-z*.9+i*z*.38,-z*.4-(i%2)*2,z*.5,z*.4);r(eye,z*.9-2,-z*.55,2,2);break;
 case 4:r(g.c2,-z*.7,-z*.15,2,z*.15);r(g.c2,z*.5,-z*.15,2,z*.15);r(g.c1,-z*.6,-z*.55,z*1.2,z*.45);r(g.c3,-z*.8,-z*.75,3,z*.3);r(g.c3,z*.6,-z*.75,3,z*.3);r(eye,-z*.25,-z*.5,2,2);r(eye,z*.15,-z*.5,2,2);break;
 default:r(g.c2,-z*.5,-z*.3,2,z*.3);r(g.c2,z*.3,-z*.3,2,z*.3);r(g.c1,-z*.6,-z*.75,z*1.2,z*.55);for(let i=0;i<4;i++)r(g.c3,-z*.5+i*z*.3,-z*.75-3,2,3);r(eye,z*.35,-z*.6,2,2)}
 if(g.spots)r(g.c3,-z/5,-z*.5,2,2);if(g.horn&&g.plan!==2&&g.plan!==3)r(g.c3,z*.1,-z*1.05,2,3);if(g.glow)r(g.c3,0,-z*.3,3,1)};
const SC=new Map();
const spr=(key,g,eye,al)=>{let c=SC.get(key);if(c)return c;if(SC.size>150)SC.clear();
 const mk=f=>{const cv=document.createElement("canvas");cv.width=cv.height=32;const x=cv.getContext("2d");if(f){x.translate(32,0);x.scale(-1,1)}paint(x,g,eye,al);return cv};
 c=[mk(0),mk(1)];SC.set(key,c);return c};

/* flora prosedural: 5 bentuk x 3 ukuran, warna dari profil planet */
const FL=new Map();
const flora=v=>{const P=Planet.pf,key=Planet.seed+":"+v;let c=FL.get(key);if(c)return c;if(FL.size>40)FL.clear();
 c=document.createElement("canvas");c.width=16;c.height=30;const x=c.getContext("2d"),h=10+v*6,fa=P.fa,fb=P.fb,r=(col,a,b,ww,hh)=>{x.fillStyle=col;x.fillRect(a|0,(30-b-hh)|0,Math.max(1,ww|0),Math.max(1,hh|0))};
 switch(P.fk){
 case 0:r(fa,7,0,2,h);r(fb,5,h,6,4);r(fa,4,h*.5,3,2);break;
 case 1:r(fa,7,0,2,h);r(fb,2,h,12,3);r(fa,4,h-2,8,2);break;
 case 2:for(let i=0;i<3;i++){r(fa,3+i*4,0,3,h*(.6+.2*(i%2)));r(fb,4+i*4,h*(.6+.2*(i%2)),1,3)}break;
 case 3:r(fa,6,0,2,h*.6);r(fb,8,h*.4,2,h*.5);r(fa,4,h*.3,2,h*.4);break;
 default:r(fa,7,0,2,h*.7);for(let i=0;i<3;i++)r(fb,3+i*4,h*.6+(i%2)*3,3,4)}
 FL.set(key,c);return c};
w(Renderer,"obj",function(old,a){if(a[0]===O.PLANT&&Planet.pf&&Planet.pf.fk!=null){this.g.drawImage(flora(ft(Noise.hash(a[1],a[2],8)*3)),a[3],a[4]+TS-30);return}return old.apply(this,a)});

/* fauna: genome baru untuk tiap spesies (logika gerak/AI lama tetap dipakai) */
w(Fauna,"setup",function(old,a){const n=this.seed!==Planet.seed;old.apply(this,a);if(n)for(const s of this.sp){const g=GEN(Planet.seed*7+s.i*13+5);g.plan=s.body===2?2:s.body===3?3:[0,1,4,5][g.plan%4];g.z=Math.max(5,Math.min(14,s.s+2));s.g=g}});

/* ===== 3. BAHAN BAKAR (BBM) ===== */
const css=document.createElement("style");
css.textContent="#fx{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:12;display:none;width:min(88%,330px);background:rgba(8,6,28,.95);border:2px solid #ffd35f;border-radius:12px;color:#c9c2ff;font:12px monospace;padding:12px}#fx button{display:block;width:100%;margin:6px 0 0;font:bold 12px monospace;color:#ffe9a0;background:rgba(255,211,95,.12);border:1px solid #ffd35f;border-radius:8px;padding:9px}#fx button:disabled{opacity:.35}#fuelb,#firb,#recb{position:fixed;border:2px solid #ffd35f;background:rgba(8,6,28,.6);color:#ffe9a0;font:bold 12px monospace;border-radius:12px;padding:10px 12px;touch-action:none;user-select:none;-webkit-user-select:none;opacity:var(--bo,1)}#fuelb{left:16px;bottom:calc(232px + env(safe-area-inset-bottom,0px));display:none}#firb,#recb{right:12px;bottom:calc(196px + env(safe-area-inset-bottom,0px));display:none;border-color:#ff5a4a;color:#ffd0c8;min-width:86px}#recb{border-color:#9aff9a;color:#d8ffd8}";
document.head.appendChild(css);
const px=document.createElement("div");px.id="fx";document.body.appendChild(px);
const mk=(id,t)=>{const b=document.createElement("button");b.id=id;b.textContent=t;b.oncontextmenu=()=>false;document.body.appendChild(b);return b};
const fb=mk("fuelb","BBM"),fr=mk("firb","TEMBAK"),rc=mk("recb","REKRUT");
const Fuel={f:100,max:100,low:0};
const Fx={open:false,
 show(){this.open=true;this.render();px.style.display="block"},hide(){this.open=false;px.style.display="none"},toggle(){this.open?this.hide():this.show()},
 fill(k,n){if(!Player.inv[k]||Fuel.f>=Fuel.max)return;Survival.take(k,1);Fuel.f=Math.min(Fuel.max,Fuel.f+n);this.render()},
 dump(){let n=0;for(const k of Object.keys(Player.inv))while(n<6&&Player.inv[k]){Survival.take(k,1);n++}Fuel.f=Math.min(Fuel.max,Fuel.f+n*4);this.render()},
 sos(){Bcn.go();this.render()},
 render(){const I=Player.inv,c=I.Carbon||0,o=I["Alien Organic Matter"]||0,n=Survival.total(),full=Fuel.f>=Fuel.max,sos=Game.mode==="space"&&Fuel.f<=0&&!Bcn.t&&!Bcn.cool;
  px.innerHTML=`<b style="color:#ffd35f">BBM ${Math.round(Fuel.f)}/${Fuel.max}</b><br><small>Terbang & boost menguras BBM. Kalau habis di angkasa: mesin mati dan oksigen terus turun.</small>`
  +`<button ${c&&!full?"":"disabled"} onclick="Fx.fill('Carbon',8)">1 Carbon → +8 BBM (punya ${c})</button>`
  +`<button ${o&&!full?"":"disabled"} onclick="Fx.fill('Alien Organic Matter',5)">1 Alien Organic → +5 BBM (punya ${o})</button>`
  +`<button ${n&&!full?"":"disabled"} onclick="Fx.dump()">Bakar kargo darurat (6 item → +24 BBM)</button>`
  +`<button ${sos?"":"disabled"} onclick="Fx.sos()">Kirim sinyal SOS (hasil acak, saat mesin mati)</button>`
  +`<button onclick="Fx.hide()">TUTUP</button>`},
 ui(){const sp=Game.mode==="space",ok=Game.started&&!Game.trans&&!Menu.open&&!Game.map;fb.style.display=Game.started?"block":"none";fr.style.display=sp&&ok?"block":"none";rc.style.display=!sp&&ok&&Al.nr&&Al.crew.length<3?"block":"none"}};
window.Fx=Fx;
fb.onpointerdown=()=>Fx.toggle();rc.onpointerdown=()=>Al.recruit();
fr.onpointerdown=()=>{War.firing=1};fr.onpointerup=fr.onpointerleave=fr.onpointercancel=()=>{War.firing=0};
addEventListener("keydown",e=>{if(e.repeat||!Game.started)return;const k=e.key.toLowerCase();if(k==="r")Fx.toggle();if(k==="c")Al.recruit()});

/* SOS: hasil acak -> pedagang / bajak laut / patroli alien menderek */
const Bcn={t:0,cool:0,go(){if(this.t>0||this.cool>0)return;this.t=8+R()*8;say("SOS dikirim... menunggu balasan")},
 tick(dt){if(this.cool>0)this.cool-=dt;if(this.t<=0)return;this.t-=dt;if(this.t>0)return;this.cool=30;const r=R();
  if(r<.4){const c=Player.inv.Crystal>0;if(c)Survival.take("Crystal",1);Fuel.f=Math.min(Fuel.max,Fuel.f+40);say(c?"Pedagang lewat: 1 Crystal ditukar 40 BBM":"Pedagang baik hati memberi 40 BBM gratis")}
  else if(r<.75){say("Bajak laut menyergap sinyal SOS-mu! Tembak mereka!");War.pirates()}
  else{const cx=ft(Space.x/GS),cy=ft(Space.y/GS);let b=null,bd=1e12;for(let j=-3;j<=3;j++)for(let i=-3;i<=3;i++){const p=Space.cell(cx+i,cy+j);if(p){const d=(p.x-Space.x)**2+(p.y-Space.y)**2;if(d<bd){bd=d;b=p}}}
   if(b){Space.x=b.x+b.r+120;Space.y=b.y;Space.vx=Space.vy=0}Fuel.f=Math.max(Fuel.f,20);say("Patroli alien menderek kapalmu ke planet terdekat (+20 BBM)")}}};

/* ===== 4. ALIEN (agresif / ramah-bisa direkrut) + KRU ===== */
const AN=s=>{const a=["Zu","Ke","Ori","Vael","Mi","Tho","Rax","Yu"],b=["ra","nok","lis","gar","vex","tun"];return a[ft(gh(s,40)*8)]+b[ft(gh(s,41)*6)]};
const Al={list:[],pop:new Set(),seed:-1,crew:[],nr:null,
 setup(){if(this.seed===Planet.seed)return;this.seed=Planet.seed;this.list=[];this.pop.clear()},
 fill(cx,cy){const k=cx+","+cy;if(this.pop.has(k))return;this.pop.add(k);if(this.list.length>=8)return;const h=s=>Noise.hash(cx*11+3,cy*17+s,Planet.seed+808);if(h(1)>.2)return;
  const tx=cx*CS+ft(h(2)*CS),ty=cy*CS+ft(h(3)*CS),t=Planet.at(tx,ty)[0];if(t<T.SAND||t===T.ROCK||Planet.blocked(tx,ty)||Math.hypot(tx-Ship.x,ty-Ship.y)<10)return;
  const id=ft(h(4)*1e6)+1,g=AG(id);this.list.push({id,g,name:AN(id),x:tx+.5,y:ty+.5,hp:g.z*5,mh:g.z*5,hostile:h(5)<.45,k,cd:0,wt:0,dx:0,dy:0,face:1})},
 kill(a){const I=Player.inv;if(Survival.total()<Survival.cap()){const k=R()<.15?"Rare Element":"Crystal";I[k]=(I[k]||0)+1;Gather.pops.push({txt:"+1 "+Tr(k),c:"#5ff3ff",t:1.4})}},
 recruit(){const a=this.nr,I=Player.inv;if(!a||this.crew.length>=3)return;if((I["Alien Organic Matter"]||0)<2||(I.Crystal||0)<1){say("Butuh 2 Alien Organic Matter + 1 Crystal untuk merekrut");return}
  Survival.take("Alien Organic Matter",2);Survival.take("Crystal",1);this.crew.push({id:a.id,name:a.name,g:a.g,mh:a.mh,x:a.x,y:a.y,t:0});a.gone=1;this.nr=null;say(a.name+" bergabung sebagai kru! ("+this.crew.length+"/3)")},
 update(dt){this.setup();const pcx=ft(Player.x/CS),pcy=ft(Player.y/CS);for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++)this.fill(pcx+i,pcy+j);
  const keep=[];this.nr=null;let nd=2.4;
  const tg=Gather.target,td=tg?Math.hypot(tg.x+.5-Player.x,tg.y+.5-Player.y):9;let hit=null,hd=Math.min(2,td);
  for(const a of this.list){if(a.gone)continue;if(Math.abs(a.x-Player.x)>45||Math.abs(a.y-Player.y)>45){this.pop.delete(a.k);continue}if(a.hp<=0){this.kill(a);continue}
   const dx=Player.x-a.x,dy=Player.y-a.y,d=Math.hypot(dx,dy);let vx,vy,v;
   if(a.hostile&&d<9&&d>.7&&!Survival.dead){vx=dx/d;vy=dy/d;v=1.7}
   else{a.wt-=dt;if(a.wt<=0){a.wt=1+R()*2.5;const an=R()*7,m=R()<.4?0:1;a.dx=Math.cos(an)*m;a.dy=Math.sin(an)*m}vx=a.dx;vy=a.dy;v=.7}
   const nx=a.x+vx*v*dt,ny=a.y+vy*v*dt,ok=(x,y)=>!Planet.blocked(ft(x),ft(y))&&Planet.at(ft(x),ft(y))[0]>=T.SAND;
   if(ok(nx,a.y))a.x=nx;else a.dx=-a.dx;if(ok(a.x,ny))a.y=ny;else a.dy=-a.dy;if(vx)a.face=vx>0?1:-1;
   if(a.hostile&&d<.95&&a.cd<=0&&!Survival.dead&&!Game.trans){Survival.hp-=7;a.cd=1.2;Survival.say(Tr("DISERANG!"),"alien")}a.cd-=dt;
   if(d<hd){hd=d;hit=a}if(!a.hostile&&d<nd){nd=d;this.nr=a}keep.push(a)}
  this.list=keep;
  if(hit&&Gather.held()){hit.hp-=28*dt;if(!hit.hostile){hit.hostile=true;say("Alien tersinggung! Sekarang dia menyerangmu")}}},
 crewUpdate(dt){this.crew.forEach((m,i)=>{const an=i*2.1+Game.time*.3,tx=Player.x+Math.cos(an)*1.6,ty=Player.y+Math.sin(an)*1.6,d=Math.hypot(tx-m.x,ty-m.y);
  if(d>14){m.x=Player.x;m.y=Player.y}else if(d>.15){const sp=Math.min(d,(3.2+d)*dt),nx=m.x+(tx-m.x)/d*sp,ny=m.y+(ty-m.y)/d*sp;if(!Planet.blocked(ft(nx),ft(m.y)))m.x=nx;if(!Planet.blocked(ft(m.x),ft(ny)))m.y=ny}
  m.t+=dt;let b=null,bd=5;for(const a of this.list)if(a.hostile){const dd=Math.hypot(a.x-m.x,a.y-m.y);if(dd<bd){bd=dd;b=a}}for(const c of Fauna.list)if(c.sp.beh===2){const dd=Math.hypot(c.x-m.x,c.y-m.y);if(dd<bd){bd=dd;b=c}}
  if(b){b.hp-=16*dt;if(b.sp&&b.hp<=0)Fauna.kill(b)}
  if(m.t>=25){m.t=0;if(Survival.total()<Survival.cap()){const k=["Iron Ore","Copper","Carbon","Crystal"][ft(R()*4)];Player.inv[k]=(Player.inv[k]||0)+1;Gather.pops.push({txt:"+1 "+Tr(k)+" (kru)",c:"#9aff9a",t:1.4})}}})}};
w(Fauna,"update",function(old,a){const r=old.apply(this,a);if(Game.mode==="planet"&&!Game.trans){Al.update(a[0]);Al.crewUpdate(a[0])}return r});
w(Fauna,"scan",function(old,a){const r=old.apply(this,a);if(Game.mode!=="planet"||Game.trans||Menu.open)return r;let b=null,bd=7;for(const x of Al.list){const d=Math.hypot(x.x-Player.x,x.y-Player.y);if(d<bd){bd=d;b=x}}
 if(b){const k="A"+Planet.name+b.id;if(!Fauna.logged[k])Fauna.logged[k]={name:b.name+" (alien)",planet:Planet.name,beh:b.hostile?"Agresif":"Pasif",s:b.g.z};say("SCAN alien "+b.name+": "+(b.hostile?"AGRESIF!":"ramah, bisa direkrut (tombol REKRUT / C)"))}return r});
/* gambar fauna prosedural + alien + kru (sprite cache, culling layar) */
w(Fauna,"draw",function(old,[ox,oy,time]){const L=this.list;this.list=[];old.call(this,ox,oy,time);this.list=L;const g=Renderer.g,W=Renderer.W,H=Renderer.H;
 for(const c of L){const s=c.sp;if(!s.g)continue;const x=Math.round(c.x*TS-ox),y=Math.round(c.y*TS-oy);if(x<-20||y<-20||x>W+20||y>H+20)continue;
  const eye=s.beh===2?"#ff3a3a":"#fff",im=spr(Planet.seed+":"+s.i+eye,s.g,eye,0)[c.face<0?1:0],fl=s.g.plan===2?-8+Math.sin(time*2+c.ph)*2:0;
  g.globalAlpha=.3;g.fillStyle="#000";g.fillRect(x-s.g.z/2,y+3,s.g.z,2);g.globalAlpha=1;g.drawImage(im,x-16,y-28+fl+(Math.sin(time*6+c.ph)>.7?-1:0));
  if(c.hp<s.hp){Renderer.rect("#000",x-6,y-s.g.z-9,12,2);Renderer.rect("#ff4a5a",x-6,y-s.g.z-9,12*c.hp/s.hp,2)}}
 const bot=(e,eye,mc,key)=>{const x=Math.round(e.x*TS-ox),y=Math.round(e.y*TS-oy);if(x<-20||y<-20||x>W+20||y>H+20)return;
  g.globalAlpha=.3;g.fillStyle="#000";g.fillRect(x-5,y+3,10,2);g.globalAlpha=1;g.drawImage(spr(key+eye,e.g,eye,1)[e.face<0?1:0],x-16,y-28);g.fillStyle=mc;g.fillRect(x-1,y-e.g.z*1.4-10,3,3);
  if(e.hp<e.mh){Renderer.rect("#000",x-6,y-e.g.z*1.4-14,12,2);Renderer.rect("#ff4a5a",x-6,y-e.g.z*1.4-14,12*e.hp/e.mh,2)}};
 for(const a of Al.list)bot(a,a.hostile?"#ff3a3a":"#9aff9a",a.hostile?"#ff3a3a":"#9aff9a","A"+a.id);
 for(const m of Al.crew){m.face=m.x<Player.x?1:-1;bot({...m,hp:1,mh:1,face:m.face},"#9ffcff","#9ffcff","A"+m.id)}});

/* ===== 5. PERANG ANTARIKSA ===== */
const FC=[{n:"Vorn",c:"#ff5a4a"},{n:"Aelu",c:"#4aa8ff"},{n:"Bajak Laut",c:"#c8a0ff"}];
const War={s:[],b:[],l:[],fx:[],t:50,on:0,end:0,kills:0,hull:100,hit:0,hos:[0,0,1],firing:0,cd:0,
 clear(){this.s=[];this.b=[];this.l=[];this.fx=[];this.on=0;this.hos=[0,0,1];this.kills=0},
 mk(x,y,f,hp){return{x,y,vx:0,vy:0,a:0,f,hp,cd:R(),p:0}},
 start(){const a=R()*6.28,d=240+R()*60,cx=Space.x+Math.cos(a)*d,cy=Space.y+Math.sin(a)*d;this.clear();this.on=1;this.end=80;
  for(let f=0;f<2;f++)for(let i=0;i<4;i++)this.s.push(this.mk(cx+(f?70:-70)+R()*30,cy+R()*80-40,f,26));say("PERANG ANTARIKSA! Vorn vs Aelu. Tembak salah satu untuk memilih sisi, atau kabur.")},
 pirates(){for(let i=0;i<3;i++)this.s.push(this.mk(Space.x+(R()*2-1)*260,Space.y+(R()*2-1)*260,2,22));this.on=Math.max(this.on,2);this.end=Math.max(this.end,70)},
 shoot(x,y,a,f,d){if(this.b.length<60)this.b.push({x,y,vx:Math.cos(a)*380,vy:Math.sin(a)*380,f,d,l:1.1})},
 boom(x,y){this.fx.push({x,y,t:0})},
 loot(e){this.boom(e.x,e.y);this.kills++;const r=R();this.l.push(e.f===2||r<.6?{x:e.x,y:e.y,k:"BBM",v:e.f===2?15:10}:{x:e.x,y:e.y,k:r<.68?"Rare Element":["Titanium","Copper","Crystal"][ft(R()*3)],v:1})},
 update(dt){const P=Space;if(!this.on){this.t-=dt;if(this.t<=0){this.t=70+R()*80;this.start()}}
  const S=this.s;
  for(const e of S){let tg=null,td=1e9;if(e.f<2)for(const o of S)if(o.f!==e.f&&o.f<2){const d=Math.hypot(o.x-e.x,o.y-e.y);if(d<td){td=d;tg=o}}
   const dp=Math.hypot(P.x-e.x,P.y-e.y);e.p=0;if(this.hos[e.f]&&dp<(e.f===2?700:320)&&dp<td){tg=P;td=dp;e.p=1}
   if(tg){const a=Math.atan2(tg.y-e.y,tg.x-e.x),k=td>80?1:td<50?-.6:0;e.vx+=(Math.cos(a)*k*95-e.vx)*dt*1.5;e.vy+=(Math.sin(a)*k*95-e.vy)*dt*1.5;e.a=a;e.cd-=dt;if(td<180&&e.cd<=0){e.cd=1+R()*.7;this.shoot(e.x,e.y,a+(R()-.5)*.3,e.f,e.p?7:6)}}else{e.vx*=1-dt;e.vy*=1-dt}
   e.x+=e.vx*dt;e.y+=e.vy*dt}
  for(const b of this.b){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;
   if(b.f===-1){for(const e of S)if(e.hp>0&&Math.hypot(e.x-b.x,e.y-b.y)<9){e.hp-=b.d;b.l=0;if(e.f<2)this.hos[e.f]=1;if(e.hp<=0)this.loot(e);break}}
   else{for(const e of S)if(b.f<2&&e.f<2&&e.f!==b.f&&e.hp>0&&Math.hypot(e.x-b.x,e.y-b.y)<9){e.hp-=b.d;b.l=0;if(e.hp<=0)this.boom(e.x,e.y);break}
    if(b.l>0&&(b.f===2||this.hos[b.f])&&Math.hypot(P.x-b.x,P.y-b.y)<9){this.hull-=b.d;b.l=0;this.hit=.25}}}
  this.b=this.b.filter(b=>b.l>0);this.s=S.filter(e=>e.hp>0&&Math.hypot(e.x-P.x,e.y-P.y)<1100);
  this.cd-=dt;if((this.firing||Input.keys.x)&&this.cd<=0&&!Menu.open&&!Game.map){this.cd=.28;let tg=null,td=240;for(const e of this.s){const d=Math.hypot(e.x-P.x,e.y-P.y);if(d<td){td=d;tg=e}}this.shoot(P.x,P.y,tg?Math.atan2(tg.y-P.y,tg.x-P.x):P.ang,-1,10*(1+.5*Al.crew.length));try{Snd.sfx("mine")}catch(x){}}
  for(const l of this.l){l.t=(l.t||0)+dt;if(Math.hypot(l.x-P.x,l.y-P.y)<18){if(l.k==="BBM"){Fuel.f=Math.min(Fuel.max,Fuel.f+l.v);l.got=1;say("+"+l.v+" BBM")}else if(Survival.total()<Survival.cap()){Player.inv[l.k]=(Player.inv[l.k]||0)+1;l.got=1;say("+1 "+Tr(l.k))}}if(l.t>40)l.got=1}
  this.l=this.l.filter(l=>!l.got);for(const f of this.fx)f.t+=dt;this.fx=this.fx.filter(f=>f.t<.6);
  this.hit=Math.max(0,this.hit-dt);if(!this.s.some(e=>this.hos[e.f]&&Math.hypot(e.x-P.x,e.y-P.y)<320))this.hull=Math.min(100,this.hull+3*dt);
  if(this.hull<=0){this.hull=100;say("Lambung hancur! Kapsul penyelamat aktif");Survival.die()}
  if(this.on){this.end-=dt;const f0=this.s.some(e=>e.f===0),f1=this.s.some(e=>e.f===1),pir=this.s.some(e=>e.f===2);
   if(this.end<=0||(!pir&&!(f0&&f1))){const al=f0&&!f1?0:f1&&!f0?1:-1;
    if(al>=0&&this.hos[1-al]&&!this.hos[al]){Fuel.f=Math.min(Fuel.max,Fuel.f+30);if(Survival.total()<Survival.cap())Player.inv["Rare Element"]=(Player.inv["Rare Element"]||0)+1;say(FC[al].n+" menang berkat kamu! Hadiah: +30 BBM, 1 Rare Element")}
    else if(al>=0)say(FC[al].n+" memenangkan perang");else say("Pertempuran usai");
    this.clear();this.t=70+R()*80}}},
 draw(){const g=Renderer.g,W=Renderer.W,H=Renderer.H,P=Space,ox=W/2-P.x,oy=H/2-P.y;g.font="8px monospace";g.textBaseline="top";
  for(const l of this.l){const x=l.x+ox,y=l.y+oy;if(x<-8||y<-8||x>W+8||y>H+8)continue;g.fillStyle=l.k==="BBM"?"#ffd35f":"#5ff3ff";g.globalAlpha=.6+.4*Math.sin(Game.time*8);g.fillRect(x-2,y-2,5,5);g.globalAlpha=1}
  let nb=null,nd=1e9;
  for(const e of this.s){const d=Math.hypot(e.x-P.x,e.y-P.y);if(d<nd){nd=d;nb=e}const x=e.x+ox,y=e.y+oy;if(x<-12||y<-12||x>W+12||y>H+12)continue;
   g.save();g.translate(x,y);g.rotate(e.a);g.fillStyle=FC[e.f].c;g.beginPath();g.moveTo(7,0);g.lineTo(-5,-5);g.lineTo(-3,0);g.lineTo(-5,5);g.fill();g.restore();g.fillStyle="#000";g.fillRect(x-6,y-10,12,2);g.fillStyle="#ff4a5a";g.fillRect(x-6,y-10,12*Math.max(0,e.hp)/(e.f===2?22:26),2)}
  for(const b of this.b){g.fillStyle=b.f===-1?"#9ffcff":FC[b.f].c;g.fillRect(b.x+ox-1,b.y+oy-1,3,3)}
  for(const f of this.fx){g.globalAlpha=1-f.t/.6;g.strokeStyle="#ffb36b";g.beginPath();g.arc(f.x+ox,f.y+oy,4+f.t*40,0,7);g.stroke();g.globalAlpha=1}
  if(nb&&nd>Math.min(W,H)/2){const a=Math.atan2(nb.y-P.y,nb.x-P.x),r=Math.min(W,H)/2-26;g.save();g.translate(W/2+Math.cos(a)*r,H/2+Math.sin(a)*r);g.rotate(a);g.fillStyle=FC[nb.f].c;g.beginPath();g.moveTo(6,0);g.lineTo(-3,-4);g.lineTo(-3,4);g.fill();g.restore()}
  const hh=this.on||this.hull<99?30:21;g.fillStyle="rgba(8,6,28,.7)";g.fillRect(4,42,118,hh);g.strokeStyle="#ffd35f";g.strokeRect(4.5,42.5,117,hh-1);
  const bar=(y,l,f,c)=>{g.fillStyle="#c9c2ff";g.fillText(l,8,y);g.fillStyle="#1a1740";g.fillRect(34,y+1,80,6);g.fillStyle=c;g.fillRect(34,y+1,80*Math.max(0,Math.min(1,f)),6)};
  bar(46,"BBM",Fuel.f/Fuel.max,Fuel.f<20?"#ff4a5a":"#ffd35f");if(hh>21)bar(55,"HULL",this.hull/100,"#ff7a3d");
  if(Al.crew.length){g.fillStyle="#9aff9a";g.fillText("KRU "+Al.crew.length+"/3 · tembak x"+(1+.5*Al.crew.length),8,hh+46)}
  if(Fuel.f<=0&&Math.floor(Game.time*3)%2){g.fillStyle="#ff4a5a";g.textAlign="center";g.fillText("MESIN MATI · O2 "+Math.round(Survival.o2),W/2,H*.25);g.textAlign="left"}
  if(this.hit>0){g.globalAlpha=Math.min(.4,this.hit*1.5);g.fillStyle="#ff2a3a";g.fillRect(0,0,W,H);g.globalAlpha=1}}};

/* ===== 6. PENGAIT KE GAME LOOP ===== */
w(Space,"update",function(old,[dt]){const oa=Input.axis,ax=oa.call(Input),th=Math.hypot(ax[0],ax[1]);
 if(Fuel.f>0&&!Game.trans){const was=Fuel.f;Fuel.f=Math.max(0,Fuel.f-th*(Gather.held()?3:1.2)*dt);
  if(was>0&&Fuel.f<=0){say("BAHAN BAKAR HABIS! Mesin mati di tengah angkasa...");Fx.show()}else if(was>=20&&Fuel.f<20)say("BBM tinggal "+Math.round(Fuel.f)+"%! Isi lewat tombol BBM")}
 if(Fuel.f<=0)Input.axis=()=>[0,0];
 try{old.call(this,dt)}finally{Input.axis=oa}
 if(!Game.trans)War.update(dt)});
w(Space,"draw",function(old,a){const r=old.apply(this,a);War.draw();return r});
w(Space,"arrive",function(old,a){War.clear();return old.apply(this,a)});
w(Survival,"update",function(old,[dt]){const o2=this.o2;old.call(this,dt);
 if(Game.mode==="space"&&Fuel.f<=0&&!this.dead&&!Game.trans){this.o2=Math.max(0,o2-1.2*dt);if(this.o2<=0){say("Oksigen habis... kamu diselamatkan kapsul darurat");this.die()}}
 Bcn.tick(dt);Fx.ui()});
w(Survival,"die",function(old,a){Fuel.f=Math.max(Fuel.f,25);War.clear();Bcn.t=0;return old.apply(this,a)});
w(HUD,"draw",function(old,a){const r=old.apply(this,a);if(Game.mode==="planet"){const g=Renderer.g,W=Renderer.W,H=Renderer.H;g.font="8px monospace";g.textBaseline="top";g.fillStyle="#1a1740";g.fillRect(W/2-24,H-5,48,3);g.fillStyle=Fuel.f<20?"#ff4a5a":"#ffd35f";g.fillRect(W/2-24,H-5,48*Fuel.f/Fuel.max,3);
 if(Al.crew.length){g.fillStyle="#9aff9a";g.textAlign="center";g.fillText("KRU "+Al.crew.length+"/3",W/2,H-15);g.textAlign="left"}}return r});
w(Game,"begin",function(old,a){if(a[0]===false){Fuel.f=Fuel.max;Al.crew=[];War.clear();War.hull=100}return old.apply(this,a)});
w(Save,"pack",function(old,a){const d=old.apply(this,a);d.X={f:Fuel.f,hull:War.hull,crew:Al.crew.map(m=>({id:m.id,name:m.name,mh:m.mh}))};return d});
w(Save,"load",function(old,a){const r=old.apply(this,a);try{const d=JSON.parse(localStorage.getItem(this.K));
 if(d&&d.X){Fuel.f=Math.max(0,Math.min(Fuel.max,+d.X.f||0));War.hull=d.X.hull||100;Al.crew=(d.X.crew||[]).map(m=>({id:m.id,name:m.name,mh:m.mh,g:AG(m.id),x:Player.x,y:Player.y,t:0}))}else if(d)Fuel.f=Fuel.max}catch(e){}return r});

window.OdysseyX={Fuel,War,Al,Fx,Bcn}; /* debug: OdysseyX.War.start(), OdysseyX.Fuel.f=0, dst. */
})();
