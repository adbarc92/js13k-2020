(()=>{window.running=!0,window.addEventListener("load",async()=>{await Ut(),fe(),f(),(()=>{const t=Jt();Qt(t),window.world=t;const e=t.party,n=W(nt,"Jeremiah"),a=W(at,"Seph"),s=W(st,"Kana");Ft(e,n),Ft(e,a),Ft(e,s);const r=performance.now();let o=r;const i=n=>{const a=(n-o)/16.666;j(a>2?2:a),X(n-r),o=n,oe();const s=G();if(s)de(s);else{const n=ee(t),a=Lt(e).actor;u(t),pe(n,0,0,2),ue(a,2)}window.running&&requestAnimationFrame(i)};i(r)})()});const t=t=>Math.abs(t)/t,e=(t,e,n,a)=>[t,e,t+n,e+a],n=(t,e)=>[t,e],a=(t,e)=>t.map((t,n)=>((t,e)=>{const[n,a]=t,[s,r,o,i]=e;return n>s&&n<o&&a>r&&a<i})(t,e)?n:-1).filter(t=>t>-1),s=t=>{const[e,a,s,r]=t,o=s-e,i=e+o/2,c=a+(r-a)/2;return[n(i,r),n(i,a),n(e+o/4,c),n(s-o/4,c)]},r=(t,e)=>t.allies.includes(e),o=async t=>new Promise(e=>{setTimeout(e,t)}),i=(t,e)=>Zt().pause?0:Math.floor(q()%((t+1)*e)/e);window.addEventListener("keydown",t=>{V()||$t(t.key)}),window.addEventListener("keyup",t=>{Et(t.key)});const c=async(t,e)=>(e||ge("cutscene"),new Promise(e=>{ke(t,e)})),l=async t=>{ge("menuConfirm"),c("",!0),await o(250);for(let e=0;e<t.length;e++){const n=t[e].trim();n&&await c(n)}ge("menuCancel")},h=t=>{const e=Zt(),n=Lt(e.party),a=t.actor;k(a,n.actor.x<a.x?I:x)},p=(t,e)=>{const n=t[e];n<0?t[e]+=1.2:n>0&&(t[e]-=1.2),Math.abs(t[e])<=1.2&&(t[e]=0)},u=t=>{if(t.pause)return;const e=ee(t),{characters:n}=e;n.forEach(t=>{m(t.actor,e)}),d(t.party,e,t)},d=(t,e,n)=>{const r=Lt(t).actor,{ax:o,ay:i,isGround:c}=r;M(r,b),Q(null);let l=o,h=i;const p=c?1.2:.04;Pt(Ct)&&(l=-p,k(r,I),M(r,v)),Pt(kt)&&(l=p,k(r,x),M(r,v)),Pt(_t)&&r.isGround&&(h=-5.1,r.vy=0,r.isGround=!1),Pt(Tt)&&(r.disablePlatformCollision=!0),r.isGround||M(r,S),$(r,l,h);const[u,d]=m(r,e);(u||d)&&te(u,d,n);const y=s(E(r));for(let t in e.characters){const n=e.characters[t],s=n.actor;U("",n);const r=E(s);let o=!1;a(y,r).forEach(()=>{o=!0});const i=n.label||n.name;o&&(i&&U(i,n),Q(()=>{n.action&&n.action(n)}),n.col&&n.col(n))}},m=(n,r)=>{(t=>{const e=H();t.ay+=t.isGround?1e-4*e:.2*e})(n);let o=0,i=0;const c=H();let{x:l,y:h,vx:u,vy:d,ax:m,ay:y,w:f,h:g}=n,w=u+m*c,I=d+y*c;Math.abs(w)>1.2&&(w=1.2*t(w)),Math.abs(I)>3.2&&(I=3.2*t(I)),_(n,w,I);let x=l+u*c,b=h+d*c;const[v,S]=Bt(r);return x<0?(x=0,o=-1):x+f>v&&(x=v-f,o=1),b<0?(b=0,i=-1):b+g>S&&(b=S-g,i=1),C(n,x,b),((t,n)=>{let r,o,i=!1,c=0;const l=Yt(n);do{c++,r=!1,o=!1;const n=s(e(t.x,t.y,t.w,t.h)),h={0:null,1:null,2:null,3:null};l.forEach(s=>{const i=e(s.px,s.py,s.size,s.size);Dt(s)?a(n,i).forEach(t=>{r=!0,h[t]=s}):t.y+t.h/2<s.py&&a(n,i).forEach(e=>{0!==e||t.disablePlatformCollision||(o=!0,r=!0,h[e]=s)})});const p=h[1],u=h[2],d=h[3],m=1;h[0]?t.vy>0&&(t.y=16*Math.floor((t.y+8)/16),i=!0):p?o||(t.y+=m,t.vy=0):u?o||(t.x+=m):d&&(o||(t.x-=m))}while(r&&c<10);i===t.isGround||i||(t.vy=0),t.isGround=i})(n,r),0===m&&p(n,"vx"),0===y&&p(n,"vy"),$(n,0,0),[o,i]},y={},f=()=>{y["1,1,10,15"]=rt,y["1,1,11,11"]=it,y["1,1,4,9"]=ot,y["1,1,5,15"]=ct,y["0,1,9,15"]=lt,y["0,1,7,11"]=yt,y["0,1,9,11"]=yt,y["0,1,11,11"]=yt,y["0,1,13,11"]=yt,y["0,1,8,7"]=yt,y["0,1,10,7"]=yt,y["0,1,12,7"]=yt,y["0,1,14,7"]=gt,y["0,1,7,3"]=yt,y["0,1,9,3"]=yt,y["0,1,11,3"]=yt,y["0,1,13,3"]=ft,y["2,2,2,15"]=wt,y["2,2,3,3"]=bt,y["2,2,2,12"]=It,y["2,2,1,12"]=It,y["2,1,5,15"]=It,y["2,1,3,15"]=It,y["2,1,4,15"]=It,y["2,1,3,13"]=It,y["2,1,9,9"]=It,y["2,1,1,15"]=ht,y["2,1,8,5"]=It,y["2,1,10,15"]=It,y["2,0,2,2"]=pt,y["3,0,2,3"]=ut,y["3,0,4,10"]=It,y["3,0,11,14"]=It,y["3,1,2,7"]=It,y["3,0,1,14"]=It,y["3,0,14,7"]=It,y["3,1,12,7"]=It,y["3,1,3,14"]=It,y["3,2,1,5"]=It,y["3,1,14,10"]=It,y["3,1,9,12"]=It,y["3,1,6,12"]=It,y["3,2,2,8"]=It,y["3,2,11,4"]=It,y["3,2,11,12"]=It,y["3,0,7,3"]=It,y["3,2,14,12"]=It,y["3,3,3,15"]=It,y["3,3,14,7"]=It,y["3,0,7,9"]=It,y["3,1,4,5"]=It,y["3,2,4,7"]=It,y["3,2,7,7"]=It,y["3,2,5,7"]=It,y["3,2,5,13"]=It,y["3,3,8,5"]=It,y["3,3,7,5"]=It,y["3,1,7,12"]=It,y["3,1,6,4"]=It,y["3,3,8,15"]=dt,y["3,3,1,3"]=vt,y["0,3,3,15"]=It,y["0,3,3,11"]=It,y["0,3,8,4"]=It,y["0,3,5,3"]=It,y["0,3,11,10"]=It,y["0,3,12,6"]=It,y["0,3,14,12"]=It,y["0,3,7,15"]=It,y["0,3,1,6"]=It,y["0,0,11,5"]=It,y["0,0,12,15"]=It,y["0,0,7,5"]=It,y["0,0,6,15"]=It,y["0,0,3,5"]=It,y["0,0,3,15"]=It,y["0,0,9,15"]=It,y["0,0,5,10"]=It,y["0,0,7,10"]=It,y["0,0,9,10"]=It,y["0,0,11,10"]=It,y["0,0,13,10"]=It,y["1,0,11,13"]=vt,y["1,0,2,15"]=mt,y["1,0,13,8"]=vt,y["2,0,3,9"]=xt,y["2,0,4,9"]=xt,y["2,0,5,9"]=xt,y["2,0,6,8"]=xt,y["2,0,2,8"]=xt,y["2,0,8,9"]=vt};var g,w;g=(t=1,e=.05,n=220,a=0,s=0,r=.1,o=0,i=1,c=0,l=0,h=0,p=0,u=0,d=0,m=0,y=0,f=0,g=1,I=0,x=44100,b=99+a*x,v=s*x,S=r*x,k=I*x,C=f*x,T=2*Math.PI,_=(t=>0<t?1:-1),$=b+k+v+S+C,M=(c*=500*T/x**2),E=(n*=(1+2*e*Math.random()-e)*T/x),P=_(m)*T/4,L=0,F=0,G=0,z=0,A=0,B=0,Y=1,D=[],O=w.createBufferSource(),R=w.createBuffer(1,$,x))=>{for(O.connect(w.destination);G<$;D[G++]=B)++A>100*y&&(A=0,B=L*n*Math.sin(F*m*T/x-P),B=_(B=o?1<o?2<o?3<o?Math.sin((B%T)**3):Math.max(Math.min(Math.tan(B),1),-1):1-(2*B/T%2+2)%2:1-4*Math.abs(Math.round(B/T)-B/T):Math.sin(B))*Math.abs(B)**i*t*.3*(G<b?G/b:G<b+k?1-(G-b)/k*(1-g):G<b+k+v?g:G<$-C?($-G-C)/S*g:0),B=C?B/2+(C>G?0:(G<$-C?1:(G-$)/C)*D[G-C|0]/2):B),L+=1-d+1e9*(Math.sin(G)+1)%2*d,F+=1-d+1e9*(Math.sin(G)**2+1)%2*d,n+=c+=500*l*T/x**3,Y&&++Y>p*x&&(n+=h*T/x,E+=h*T/x,Y=0),u&&++z>u*x&&(n=E,c=M,z=1,Y=Y||1);return R.getChannelData(0).set(D),O.buffer=R,O.start(),O},w=new AudioContext;const I=0,x=1,b=0,v=1,S=2,k=(t,e)=>{t.facing=e},C=(t,e,n)=>{t.x=e,t.y=n},T=t=>[t.x,t.y],_=(t,e,n)=>{t.vx=e,t.vy=n},$=(t,e,n)=>{t.ax=e,t.ay=n},M=(t,e)=>{t.anim=e},E=t=>e(t.x,t.y,t.w,t.h),P=t=>{const e=[];for(let n=0;n<4;n++)e.push([t,28*n+80]);return e},L=P(40),F=P(200),G=()=>null,z=t=>t.rounds[t.roundIndex];let A=null,B=1,Y=0;const D=(t,e)=>{const n=document.createElement("canvas");return n.width=t,n.height=e,[n,n.getContext("2d"),t,e]},O=()=>{var t;if(A)return A;{const[e,n]=D(512,512);return e.id="canv",n.imageSmoothingEnabled=!1,null===(t=document.getElementById("innerDiv"))||void 0===t||t.appendChild(e),A=e,e}},R=()=>O().getContext("2d"),j=t=>{B=t},H=()=>B,X=t=>{Y=t},q=()=>Y,U=(t,e)=>{e.aText=t},W=(t,e)=>{const{sprI:n,spr:a,stats:s,label:r,action:o,col:i,name:c}=t,l={sprite:"actors",spriteIndex:n,facing:I,anim:b,isGround:!1,disablePlatformCollision:!1,x:0,y:0,vx:0,vy:0,ax:0,ay:0,w:16,h:16};return a&&(l.sprite=a),{name:e||c,actor:l,label:r||"",action:o,col:i,aText:"",unit:s?Wt(c,l,t,0,0):void 0}};let K=!1,N=null;const V=()=>K,J=t=>{K=t},Q=t=>N=t,Z=t=>`This sign says: "${t}"`,tt=(t,e,n,a,s)=>({hp:t,dmg:e,def:n,mag:a,spd:s,iCnt:a,cCnt:0}),et=(tt(1,20,20,10,5),tt(20,8,5,10,15),tt(20,8,5,10,15),{name:"",stats:{bS:tt(90,100,20,5,10),ai:0},sprI:0}),nt={name:"",stats:{bS:tt(85,30,16,6,12),ai:0},sprI:0},at={name:"",stats:{bS:tt(60,19,25,4,6),ai:0},sprI:0},st={name:"",stats:{bS:tt(80,10,12,7,15),ai:0},sprI:0},rt=(tt(75,23,7,7,10),{name:"Old Man",sprI:15,action:async t=>{h(t);const e="\nHello there.\nI see you've arrived with your wits about you.\nThat's very good.  You'll need them.\nIf you examine the statues in this cave, you'll notice that they're all...\n...missing something.\nIf you seek refuge from this place, it may be prudent to find what is not found.\n  ".split("\n");await l(e),Se()}}),ot={name:"Runner Without Legs",spr:"terrain",sprI:8,action:async()=>{let t=[""];const e="This statue appears to be missing a pair of legs.";t=ae("examined_runner")?`\nThere's a plaque beneath this statue.\nIt says, "The Runner."\n${e}\n  `.split("\n"):(""+e).split("\n"),await l(t),Se()}},it={name:"Thinker Without Mind",spr:"terrain",sprI:8,action:async()=>{let t=[""];const e="This statue appears to be missing a brain.";t=ae("examined_thinker")?`\nThere's a plaque beneath this statue.\nIt says, "The Thinker."\n${e}\n  `.split("\n"):`\n      ${e}\n      `.split("\n"),await l(t),Se()}},ct={name:"Speaker Without Voice",spr:"terrain",sprI:8,action:async()=>{let t=[""];const e="This statue appears to be missing a voice.";t=ae("examined_speaker")?`\nThere's a plaque beneath this statue.\nIt says, "The Speaker."\n${e}\n  `.split("\n"):(""+e).split("\n"),await l(t),Se()}},lt={name:"Sign",spr:"terrain",sprI:5,action:async()=>{const t=[Z("Probably nothing is in these pots.")];await l(t),Se()}},ht={name:"Sign",spr:"terrain",sprI:5,action:async()=>{const t=[Z("SPIKES are dangerous.")];await l(t),Se()}},pt={name:"Sign",spr:"terrain",sprI:5,action:async()=>{const t=[Z("This fall is pointless.")];await l(t),Se()}},ut={name:"Sign",spr:"terrain",sprI:5,action:async()=>{const t=[Z("This fall is pointy.")];await l(t),Se()}},dt={name:"Sign",spr:"terrain",sprI:5,action:async()=>{const t=[Z("This cliff is tall.")];await l(t),Se()}},mt={name:"Sign",spr:"terrain",sprI:5,action:async()=>{const t=[Z("The SHRINE of LEGS.")];await l(t),Se()}},yt={name:"Pot",spr:"terrain",sprI:4,action:async()=>{const t="\nYou check the pot...\nThere's nothing inside.\n  ".split("\n");await l(t),Se()}},ft={name:"Pot!",spr:"terrain",sprI:4,action:async()=>{const t="\nThere's something strange about this pot...\nYou check the pot...\nThere's nothing inside.\n  ".split("\n");await l(t),Se()}},gt={name:"Pot",spr:"terrain",sprI:4,action:async()=>{const t="\nYou check the pot...\nThere's a VOICE inside!\n  ".split("\n");await l(t),Se()}},wt={name:"Pate",sprI:3,action:async t=>{h(t);let e=[""];e=ae("talked_to_pate")?"\nHello friend!\nI seem to have misplaced some treasure.\nIf you'd kindly bring it to me.  I'd be happy to accompany you out of here.\n    ".split("\n"):"\nHave you found my treasure yet?\nNo? Come back when you have!\n      ".split("\n"),await l(e),Se()}},It={name:"",spr:"terrain",sprI:6,col:async()=>{const t=Zt();t.pause=!0,ge("spikes"),await o(1e3),t.pause=!1,ne(Zt())}},xt={name:"",spr:"terrain",sprI:1},bt={name:"A gleaming item...",spr:"terrain",sprI:4,action:async()=>{const t="\nA gleaming marble radiating shifting hues...\n    ".split("\n");await l(t),Se()}},vt={name:"Item",spr:"terrain",sprI:11,action:async()=>{const t=["You acquired: Bomb"];await l(t),Se()}},St={},kt="ArrowRight",Ct="ArrowLeft",Tt="ArrowDown",_t=" ",$t=t=>{if(1===t.length&&(t=t.toUpperCase()),!St[t]){if(St[t]=!0,"Q"===t&&(window.running=!1),V())return;if(G(),"X"===t||"Enter"===t){const t=N;t&&t()}}};let Mt=-1;const Et=t=>{if(1===t.length&&(t=t.toUpperCase()),t===Tt){const t=Zt(),e=Lt(t.party).actor;e.disablePlatformCollision&&(clearTimeout(Mt),Mt=setTimeout(()=>{e.disablePlatformCollision=!1},150))}St[t]=!1},Pt=t=>(1===t.length&&(t=t.toUpperCase()),St[t]),Lt=t=>t.characters[0],Ft=(t,e)=>{t.characters.push(e)},Gt={0:[156,100,52],1:[171,82,54],2:[0,228,54],3:[0,135,81],4:[29,43,83],5:[95,87,79],6:[194,195,199],7:[255,241,232],8:[255,0,77],15:[0,0,0]},zt={};for(let t in Gt)zt[Gt[t].join("")]=+t;const At=(t,e,n,a)=>{const s=[],r=[],[,o]=D(16,16);he(t,0,0,1,o);const{data:i}=o.getImageData(0,0,16,16);let c=0;for(let t=0;t<i.length;t+=4){let e=zt[`${i[t+0]}${i[t+1]}${i[t+2]}`]||0;const o=c%16,l=Math.floor(c/16);let h=null;const p=y[[n,a,o,l].join(",")];p&&(h=W(p)),h&&(C(h.actor,16*o,16*l-16),r.push(h)),s.push({id:e,x:o,y:l,px:16*o,py:16*l,size:16}),c++}return{tiles:s,characters:r,w:16,h:16,bgSprite:e}},Bt=t=>[16*t.w,16*t.h],Yt=t=>t.tiles.filter(t=>[0,1,2,7].includes(t.id)),Dt=t=>[0,1,7].includes(t.id),Ot=(t,e,n,a,s)=>[t,e,n,a,s];let Rt=null;const jt=t=>{const[e,n,a,s]=D(t.width,t.height),r=a/2,o=s/2;return n.translate(r,o),n.rotate(Math.PI/2),n.drawImage(t,-r,-o),e},Ht=t=>{const[e,n,a]=D(t.width,t.height);return n.translate(a,0),n.scale(-1,1),n.drawImage(t,0,0),e},Xt=t=>{const[,,,e,n]=t,[a,s]=D(e,n);return he(t,0,0,1,s),a},qt=(t,e,n,a,s)=>{const r=(e,n,a,s,r,o)=>t[e]=Ot(n,a,s,r,o),o=(t,e,n)=>{let o=t;for(let t=0;t<n;t++)o=jt(o);r(`${e}_r${n}`,o,0,0,a,s)},i=e.width/a,c=e.height/s;for(let t=0;t<c;t++)for(let c=0;c<i;c++){const l=`${n}_${t*i+c}`,h=r(l,e,c*a,t*s,a,s);o(Xt(h),l,1),o(Xt(h),l,2),o(Xt(h),l,3),r(l+"_f",Ht(Xt(h)),0,0,a,s),r(l+"_fr1",jt(Ht(Xt(h))),0,0,a,s)}},Ut=async()=>{const t={},e=await new Promise(t=>{const e=new Image;e.onload=()=>{t(e)},e.src="packed.png"}),n=Xt(Ot(e,0,0,64,64));qt(t,n,"actors",16,16);const a=Xt(Ot(e,64,0,64,64));qt(t,a,"terrain",16,16);const s=Xt(Ot(e,0,64,64,64));qt(t,s,"map",16,16);const r=Xt(Ot(e,64,64,64,64));qt(t,r,"monsters",16,16),Rt=t},Wt=(t,e,n,a,s)=>{const{stats:r}=n;if(!r)throw Error(`CharacterDef '${t}' has no stats!`);const o={name:t,actor:e,bS:Object.assign({},r.bS),cS:Object.assign({},r.bS),i:s,allegiance:a,ai:r.ai};return k(o.actor,o.allegiance?I:x),Kt(o),o},Kt=t=>{const[e,n]=(a=t.i,0===t.allegiance?L[a]:F[a]);var a;C(t.actor,e,n)};let Nt=null;const Vt={0:"terrain_9",1:"terrain_10",2:"terrain_10",3:"terrain_9",4:"terrain_10",5:"terrain_9",6:"terrain_9",7:"terrain_9",8:"terrain_9",9:"terrain_9",10:"terrain_9",11:"terrain_9",12:"terrain_9",13:"terrain_9",14:"terrain_9",15:"terrain_9"},Jt=()=>{const t={characters:[W(et,"Runner")],inv:[],worldX:0,worldY:0},e=Lt(t);C(e.actor,128,180);const n={rooms:[],party:t,lastX:128,lastY:180,roomI:15,pause:!1,state:{}};for(let t=0;t<16;t++)n.rooms.push(At("map_"+t,Vt[t],t%4,Math.floor(t/4)));return n},Qt=t=>{Nt=t},Zt=()=>Nt,te=(t,e,n)=>{((t,e,n)=>{n.roomI=4*e+t})((n.roomI%4+t+4)%4,(Math.floor(n.roomI/4)+e+4)%4,n);const a=ee(n),s=Lt(n.party).actor,[r,o]=Bt(a);let i=0,c=0;t>0&&(i=0,c=s.y),t<0&&(i=r-16,c=s.y),e>0&&(i=s.x,c=0),e<0&&(i=s.x,c=o-16),C(s,i,c),n.lastX=i,n.lastY=c},ee=t=>t.rooms[t.roomI],ne=t=>{const e=Lt(t.party);C(e.actor,t.lastX,t.lastY)},ae=t=>void 0===(t=>Zt().state[t])(t)&&(((t,e)=>{Zt().state[t]=!0})(t),!0),se={font:"monospace",color:"#fff",size:14,align:"left",strokeColor:""},re={},oe=()=>{const t=O();le(0,0,t.width,t.height,"#557","#aaf")},ie=(t,e,n,a,s,r,o)=>{(o=o||R()).lineWidth=1,o[r?"strokeStyle":"fillStyle"]=s,o[r?"strokeRect":"fillRect"](t,e,n,a)},ce=(t,e,n,a,s)=>{const{font:r,size:o,color:i,align:c,strokeColor:l}=Object.assign(Object.assign({},se),a||{});(s=s||R()).font=`${o}px ${r}`,s.fillStyle=i,s.textAlign=c,s.textBaseline="middle",s.fillText(t,e,n),l&&(s.strokeStyle=l,s.lineWidth=.5,s.strokeText(t,e,n))},le=(t,e,n,a,s,r)=>{const o=R(),i=`${t},${e},${n},${a},${s},${r}`;if(!re[i]){const t=o.createLinearGradient(0,a,0,0);t.addColorStop(0,s),t.addColorStop(1,r),re[i]=t}o.fillStyle=re[i],o.fillRect(t,e,n,a)},he=(t,e,n,a,s)=>{a=a||1,s=s||R();const[r,o,i,c,l]="string"==typeof t?Rt[t]:t;s.drawImage(r,o,i,c,l,e,n,c*a,l*a)},pe=(t,e,n,a)=>{const s=a||1;t.tiles.forEach(r=>{const{id:o,x:i,y:c,size:l}=r,h=(e+i*l)*s,p=(n+c*l)*s;he(t.bgSprite,h,p,a),15!=o&&he("terrain_"+o,h,p,a)}),t.characters.forEach(t=>{const e=t.actor;ue(e,a);const{x:n,y:r}=e,o=t.aText;o&&ce(o,n*s+16*s/2,r*s-16*s/2,{size:16,align:"center"})})},ue=(t,e)=>{e=e||1;const{x:n,y:a}=t,s=n*e,r=a*e,[o,c,l]=(t=>{let{facing:e,sprite:n,spriteIndex:a,anim:s}=t,r=s,o=a<3,c=0;s===v?r-=i(1,100):3===s?o?r=2-i(1,250):(r=0,c=2*i(1,100)):4===s&&(r=o?2:0);let l="";switch(e){case 0:l="_f";break;case 2:l="_r3";break;case 3:l="_fr1"}return[n+"_"+(a+r+l),0,c]})(t);he(o,s+c,r+l,e)},de=t=>{oe();const e=(n=z(t)).turnOrder[n.currentIndex]||null;var n;we(5,15,150,20),ce("Turn: "+(null==e?void 0:e.name),10,26);const{allies:a,enemies:s}=t;for(let t=0;t<a.length;t++){const[e,n]=T(a[t].actor);C(a[t].actor,e,n),ue(a[t].actor,2),ce(""+a[t].name,2*e+16,2*n-5,{align:"center"})}xe(t,0),xe(t,1);for(let t=0;t<s.length;t++){const[e,n]=T(s[t].actor);ue(s[t].actor,2),ce(`${s[t].name}: ${""+s[t].cS.hp}/${""+s[t].bS.hp}`,2*e+5,2*n-5,{align:"center"})}t.text&&Ie(t.text),be(t)};let me=null;const ye=(t,e,n)=>{t[e]=n},fe=()=>{const t={};ye(t,"menuMove",[.6,0,1248,.04,,0,2,2.23,99,.8,,,,,,,,0,.05]),ye(t,"menuConfirm",[.4,0,1469,,,.08,,.14,56,,,,,,,,.04,,.04]),ye(t,"menuCancel",[.4,,1056,.03,,.06,3,.74,,.3,-38,.04,,,6,,,,.03]),ye(t,"jump",[,,223,.01,.1,.22,1,1.35,.1,,,,,.4,,,,.55,.09]),ye(t,"explosion",[,,518,.01,.05,1.59,4,1.24,.5,.4,,,,.3,,.7,.13,.58,.01]),ye(t,"actionStrike",[,,224,,.08,.17,4,1.12,4.7,-4.2,,,,1.6,-.9,.1,.01,.82,.01]),ye(t,"actionCharge",[,0,11,.16,.34,.06,2,2.05,,60,,,,,-1.2,.5,,,.01]),ye(t,"actionDefend",[,,1396,,.1,.14,1,.91,,,,,,.1,,.1,,.71,.07]),ye(t,"turnChime",[,0,750,.08,.05,.09,1,.01,,,,,.02,,,,.15,.4,.03]),ye(t,"death",[1.1,0,170,.06,,1.17,4,.7,.8,1.5,50,,,.5,,.6,,.7]),ye(t,"item",[,,1320,.05,,.07,1,.01,,8.3,531,,.02,,,,,.49,.04,.08]),ye(t,"cutscene",[,0,286,.01,,.07,,1.24,-.2,,-278,.13,,,,,,.26,.03]),ye(t,"spikes",[,,986,.02,,.05,,.05,15,46,,,,,-.8,.3,,,.02]),me=t},ge=t=>{g(...me[t])},we=(t,e,n,a,s)=>{ie(t,e,n,a,s=s||"#000"),ie(t,e,n,a,"#FFF",!0)},Ie=t=>{we(0,90,512,50),ce(t,256,116,{align:"center",size:20})},xe=(t,e)=>{const n=1===e?312:0;we(n,422,200,90),we(0,397,200,25),ce("Unit",10,409.5),ce("HP",80,409.5),ce("Chg",140,409.5),ce("Int",170,409.5);const a=1===e?t.enemies:t.allies;for(let t=0;t<a.length;t++){const s=a[t],{name:r,bS:o,cS:i}=s;0===e?(ce(r.slice(0,8),n+10,437+20*t),ce(`${i.hp}/${o.hp}`,n+80,437+20*t),ce(""+i.cCnt,n+145,437+20*t),ce(""+i.iCnt,n+175,437+20*t)):ce(r.slice(0,8),n+100,437+20*t,{align:"center"})}},be=t=>{const{turnOrder:e}=z(t),n=e.length,a=35*n;let s=512-512/3-a/2;we(s-5,5,a+5,80);for(let a=0;a<n;a++,s+=35){const{name:n,actor:o}=e[a],{sprite:i,spriteIndex:c}=o,l=10+(z(t).currentIndex===a?20:10);we(s,l,30,40,r(t,e[a])?"#29ADFF":"#FF004D");const h=r(t,e[a])?l-5:l+40+8;ce(n.slice(0,5),s+15,h,{size:12,align:"center",strokeColor:"#FFF"}),he(`${i}_${c}`,s,l+5,2)}};let ve=null,Se=()=>{const t=document.getElementById("dialogBox");window.removeEventListener("keypress",ve),t.style.opacity="0",t.style.width="0",J(!1)};const ke=(t,e)=>{const n=document.getElementById("dialogBox");window.removeEventListener("keypress",ve),n.innerHTML=`<div style="width:476px">${t}</div>`,n.style.opacity="1",n.style.width="512px",ve=t=>{const n=t.key.toUpperCase();n!==_t&&"X"!==n||(window.removeEventListener("keypress",ve),e())},setTimeout(()=>{window.addEventListener("keypress",ve)},25),J(!0)}})();