(()=>{window.running=!0,window.addEventListener("load",async()=>{await We(),lt(),(()=>{Le();const e=_e(),t=Se("Jerry",xe),n=Se("Seph",Ie),a=Se("Kana",Me);He(e,t),He(e,n),He(e,a);const r=s(_e(),ke);q(r),o(r);const c=performance.now();let i=c;const l=e=>{ot(r);const t=(e-i)/16.666;me(t>2?2:t),fe(e-c),i=e,window.running&&requestAnimationFrame(l)};l(c)})(),W()||bt("Ho ho, friend. Look yonder. There's a tonne of treasure in that pit over there. I certainly won't kick you into the pit. Trust me. I'm Patches the Spider.")});const e=e=>e.reduce((e,t)=>e&&0===t.cS.hp,!0),t=e=>Math.floor(Math.random()*Math.floor(e)),n=e=>e[t(e.length)],a=(e,t)=>e.allies.includes(t),r=async e=>new Promise(t=>{setTimeout(t,e)}),s=(e,t)=>{const n=(e=>{const t=[];for(let n=0;n<e.length;n++){const{unit:a}=e[n];if(!a)throw Error("Character has no unit when making battle party");a.i=n,Ve(a),t.push(a)}return t})(e.characters),a=(e=>{const t=[];for(let n=0;n<e.length;n++)t.push(Je(e[n].name,e[n],A,n));return t})(t.enemies),r=L(n,a),s=ee(n.concat(a));return Y(r,s),q(r),K(!1),r},o=async e=>{for(;!se(e);)await c(e);setTimeout(()=>{s(_e(),ke)},2e3)},c=async e=>{const t=Z(e);for(d(t);!re(t);)await i(e,t),te(t);const n=h(t);Y(e,n),ne(e)},i=async(e,t)=>{const r=ae(t);if(Xe(r)){if(r.cS.def!==r.bS.def&&Ye(r),0!==r.cS.spd)return Ne(r),new Promise(s=>{V(s);const o=e.actionMenuStack[0];a(e,r)?(o.disabledItems=r.cS.iCnt<=0?[2,4]:[],o.i=-1,De(o,1,!0),K(!0)):setTimeout(()=>{((e,t,a)=>{switch(a.ai){case 1:if(a.cS.cCnt<a.cS.iCnt)l($,t,null);else{const a=n(e.allies);l(T,t,a)}break;case 2:const r=n(e.allies);l(T,t,r)}})(e,t,r)},1e3)});r.cS.spd=r.bS.spd}else t.nextTurnOrder.push(r)},l=async(e,t,n)=>{K(!1);const s=W(),o=ae(t);switch(Qe(o),F(o.actor,x),s.text=oe(e),await r(1e3),Ze(o,e),e){case T:const t=u(o,n);if(s.text="Did "+-t+" damage.",dt("actionStrike"),F(n.actor,I),await r(800),F(n.actor,y),!Xe(n)){const e=a(s,n)?w:k;M(n.actor,e)}break;case $:m(o),dt("actionCharge");break;case O:g(o),dt("actionDefend");break;case D:p(o);break;case E:f(o,n);break;default:console.error("No action:",e,"exists.")}t.nextTurnOrder.push(o),await r(2e3),Ve(o),F(o.actor,y),s.text="",await r(500),X()()},d=e=>{(e=>{e.turnOrder=e.turnOrder.sort((e,t)=>t.cS.spd-e.cS.spd)})(e)},h=e=>ee(e.nextTurnOrder),u=(e,t)=>{const{cS:n,bS:a}=t,{def:r}=n,{dmg:s}=e.bS,o=-Math.floor(Math.max(s-r,1));return Ke(n,a,o),o},m=e=>{const{cS:t}=e;t.cCnt++},f=(e,n)=>{75+(e.bS.mag-n.bS.mag>0?e.bS.mag-n.bS.mag:0)>t(100)?(n.cS.spd=0,n.cS.cCnt=0,z("Interrupted!")):z("Interrupt failed...")},p=e=>{const{cS:t,bS:n}=e;t.iCnt--,t.hp=n.hp},g=e=>{const{cS:t}=e;t.def*=1.5};var S,b;window.addEventListener("keydown",e=>{if(ve()||$e(e.key),"q"===e.key&&(window.running=!1)," "===e.key&&wt(),N()){const t=W(),n=e.key,a=t.actionMenuStack[0];"ArrowDown"===n?De(a,1):"ArrowUp"===n?De(a,-1):"Enter"===n?Pe(a):"Escape"===n&&t.actionMenuStack.length>1&&Ae(a)}}),window.addEventListener("keyup",e=>{Ee(e.key)}),S=(e=1,t=.05,n=220,a=0,r=0,s=.1,o=0,c=1,i=0,l=0,d=0,h=0,u=0,m=0,f=0,p=0,g=0,S=1,w=0,k=44100,y=99+a*k,x=r*k,I=s*k,M=w*k,C=g*k,v=2*Math.PI,F=(e=>0<e?1:-1),T=y+M+x+I+C,$=(i*=500*v/k**2),E=(n*=(1+2*t*Math.random()-t)*v/k),O=F(f)*v/4,D=0,P=0,A=0,B=0,_=0,H=0,L=1,j=[],z=b.createBufferSource(),R=b.createBuffer(1,T,k))=>{for(z.connect(b.destination);A<T;j[A++]=H)++_>100*p&&(_=0,H=D*n*Math.sin(P*f*v/k-O),H=F(H=o?1<o?2<o?3<o?Math.sin((H%v)**3):Math.max(Math.min(Math.tan(H),1),-1):1-(2*H/v%2+2)%2:1-4*Math.abs(Math.round(H/v)-H/v):Math.sin(H))*Math.abs(H)**c*e*.3*(A<y?A/y:A<y+M?1-(A-y)/M*(1-S):A<y+M+x?S:A<T-C?(T-A-C)/I*S:0),H=C?H/2+(C>A?0:(A<T-C?1:(A-T)/C)*j[A-C|0]/2):H),D+=1-m+1e9*(Math.sin(A)+1)%2*m,P+=1-m+1e9*(Math.sin(A)**2+1)%2*m,n+=i+=500*l*v/k**3,L&&++L>h*k&&(n+=d*v/k,E+=d*v/k,L=0),u&&++B>u*k&&(n=E,i=$,B=1,L=L||1);return R.getChannelData(0).set(j),z.buffer=R,z.start(),z},b=new AudioContext;const w=2,k=3,y=0,x=3,I=4,M=(e,t)=>{e.facing=t},C=(e,t,n)=>{e.x=t,e.y=n},v=e=>[e.x,e.y],F=(e,t)=>{e.anim=t},T=0,$=1,E=2,O=3,D=4,P=["Strike","Charge","Break","Defend","Heal","Use","Flee"],A=1,B=e=>{const t=[];for(let n=0;n<4;n++)t.push([e,28*n+80]);return t},_=B(40),H=B(200),L=(e,t)=>{const n=ge();return{allies:e,enemies:t,rounds:[],roundIndex:0,actionMenuStack:[Oe(n/2-50,n-20*P.length,100,P,G,[],!0,20)],text:""}},j=(e,t)=>0===t?_[e]:H[e],z=e=>{W().text=e},R=async e=>new Promise(t=>{const n=e.enemies,[a,r]=j(0,A),s=Oe(2*a-ht,2*r+ut/2,100,Array(n.length).fill(""),a=>{e.actionMenuStack.shift(),t(a>=0?n[a]:null)},e.enemies.filter(e=>!Xe(e)).map((e,t)=>t),!1,96);s.i=-1,De(s,1),e.actionMenuStack.unshift(s)}),G=async e=>{const t=W(),n=Z(t);switch(e){case T:let a=await R(t);if(!a)return;l(T,n,a);break;case $:l($,n,null);break;case O:l(O,n,null);break;case D:l(D,n,null);break;case E:const r=await R(t);if(!r)return;l(E,n,r);break;default:console.error("Action",e,"Is not implemented yet.")}};let U=null;const q=e=>{U=e},W=()=>U;let J=!1;const K=e=>{J=e},N=()=>J;let Q=()=>{};const V=e=>{Q=e},X=()=>Q,Y=(e,t)=>{e.rounds.push(t)},Z=e=>e.rounds[e.roundIndex],ee=e=>({turnOrder:e,nextTurnOrder:[],currentIndex:0}),te=e=>{e.currentIndex++},ne=e=>{e.roundIndex++},ae=e=>e.turnOrder[e.currentIndex]||null,re=e=>null===ae(e),se=t=>e(t.enemies)||e(t.allies),oe=e=>P[e];let ce=null,ie=1,le=0;const de=(e,t)=>{const n=document.createElement("canvas");return n.width=e,n.height=t,[n,n.getContext("2d"),e,t]},he=()=>{var e;if(ce)return ce;{const[t,n]=de(512,512);return t.id="canv",n.imageSmoothingEnabled=!1,null===(e=document.getElementById("innerDiv"))||void 0===e||e.appendChild(t),ce=t,t}},ue=()=>he().getContext("2d"),me=e=>{ie=e},fe=e=>{le=e},pe=()=>le,ge=()=>512,Se=(e,t)=>({name:e,pos:[0,0],unit:Je(e,t,0,0)}),be=(e,t,n,a,r)=>({hp:e,dmg:t,def:n,mag:a,spd:r,iCnt:a,cCnt:0}),we={name:"Golem",stats:{bS:be(50,30,20,10,5),ai:2},sprI:5},ke=(be(20,8,5,10,15),{enemies:[we,we,we,we]}),ye={name:"Runner",stats:{bS:be(100,25,15,5,10),ai:0},sprI:0},xe={name:"Striker",stats:{bS:be(70,12,6,6,12),ai:0},sprI:0},Ie={name:"Defender",stats:{bS:be(100,12,13,4,6),ai:0},sprI:0},Me={name:"Speedster",stats:{bS:be(80,10,7,7,15),ai:0},sprI:0};be(70,20,7,7,10);let Ce=!1;const ve=()=>Ce,Fe=()=>{Ce=!Ce},Te={},$e=e=>{Te[e]||(Te[e]=!0)},Ee=e=>{Te[e]=!1},Oe=(e,t,n,a,r,s,o,c)=>({x:e,y:t,w:n,h:(c=c||16)*a.length,i:0,cb:r,disabledItems:s,items:a,lineHeight:c,bg:!!o}),De=(e,t,n)=>{const a=e.items.length;let r=0,s=0,o=e.i;do{if(r++,r>30)break;s=o+t,s<0?s=a-1:s>=a&&(s=0),o=s}while(e.disabledItems.includes(s));e.i=s,n||dt("menuMove")},Pe=e=>{e.cb(e.i),dt("menuConfirm")},Ae=e=>{e.cb(-1),dt("menuCancel")};let Be=null;const _e=()=>Be,He=(e,t)=>{e.characters.push(t)},Le=()=>{const e={characters:[],inventory:[]};e.characters.push(Se("Runner",ye)),Be=e},je=(e,t,n,a,r)=>[e,t,n,a,r];let ze=null;const Re=e=>{const[t,n,a,r]=de(e.width,e.height),s=a/2,o=r/2;return n.translate(s,o),n.rotate(Math.PI/2),n.drawImage(e,-s,-o),t},Ge=e=>{const[t,n,a]=de(e.width,e.height);return n.translate(a,0),n.scale(-1,1),n.drawImage(e,0,0),t},Ue=e=>{const[,,,t,n]=e,[a,r]=de(t,n);return rt(e,0,0,1,r),a},qe=(e,t,n,a,r)=>{const s=(t,n,a,r,s,o)=>e[t]=je(n,a,r,s,o),o=(e,t,n)=>{let o=e;for(let e=0;e<n;e++)o=Re(o);s(`${t}_r${n}`,o,0,0,a,r)},c=t.width/a,i=t.height/r;for(let e=0;e<i;e++)for(let i=0;i<c;i++){const l=`${n}_${e*c+i}`,d=s(l,t,i*a,e*r,a,r);o(Ue(d),l,1),o(Ue(d),l,2),o(Ue(d),l,3),s(l+"_f",Ge(Ue(d)),0,0,a,r),s(l+"_fr1",Re(Ge(Ue(d))),0,0,a,r)}},We=async()=>{const e={},t=await new Promise(e=>{const t=new Image;t.onload=()=>{e(t)},t.src="packed.png"}),n=Ue(je(t,0,0,64,64));qe(e,n,"actors",16,16);const a=Ue(je(t,64,0,64,64));qe(e,a,"terrain",16,16);const r=Ue(je(t,0,64,64,64));qe(e,r,"map",16,16);const s=Ue(je(t,64,64,64,64));qe(e,s,"monsters",16,16),ze=e},Je=(e,t,n,a)=>{const{stats:r,sprI:s}=t;if(!r)throw Error("CharacterDef has no stats");const o={name:e,actor:(c=s,{sprite:"actors",spriteIndex:c,facing:0,anim:y,isGround:!1,x:0,y:0,vx:0,vy:0,ax:0,ay:0,w:16,h:16}),bS:Object.assign({},r.bS),cS:Object.assign({},r.bS),i:a,allegiance:n,ai:r.ai};var c;return M(o.actor,o.allegiance?0:1),Ve(o),o},Ke=(e,t,n)=>{const{hp:a}=e,{hp:r}=t;let s=a+n;s>r?s=r:s<0&&(s=0),e.hp=s},Ne=e=>{const{allegiance:t}=e,[n,a]=j(e.i,t);C(e.actor,n+(t?-20:20),a)},Qe=e=>{const t=ge()/2/2-8;C(e.actor,t,t)},Ve=e=>{const[t,n]=j(e.i,e.allegiance);C(e.actor,t,n)},Xe=e=>e.cS.hp>0,Ye=e=>{e.cS.def=e.bS.def},Ze=(e,t)=>{const{cS:n}=e;switch(t){case T:case $:n.spd+=2;break;case E:n.spd+=0;break;case O:n.spd+=3;break;case D:n.spd-=1;break;case 5:n.spd-=2;break;case 6:n.spd-=3}},et={font:"monospace",color:"#fff",size:14,align:"left",strokeColor:""},tt={},nt=(e,t,n,a,r,s,o)=>{(o=o||ue()).lineWidth=1,o[s?"strokeStyle":"fillStyle"]=r,o[s?"strokeRect":"fillRect"](e,t,n,a)},at=(e,t,n,a,r)=>{const{font:s,size:o,color:c,align:i,strokeColor:l}=Object.assign(Object.assign({},et),a||{});(r=r||ue()).font=`${o}px ${s}`,r.fillStyle=c,r.textAlign=i,r.textBaseline="middle",r.fillText(e,t,n),l&&(r.strokeStyle=l,r.lineWidth=.5,r.strokeText(e,t,n))},rt=(e,t,n,a,r)=>{a=a||1,r=r||ue();const[s,o,c,i,l]="string"==typeof e?ze[e]:e;r.drawImage(s,o,c,i,l,t,n,i*a,l*a)},st=(e,t)=>{t=t||1;const{x:n,y:a}=e,r=n*t,s=a*t,[o,c,i]=(e=>{let{facing:t,sprite:n,spriteIndex:a,anim:r}=e,s=r,o=a<3,c=0;1===r?s-=Math.floor(pe()%200/100):r===x?o?s=2-Math.floor(pe()%500/250):(s=0,c=2*Math.floor(pe()%200/100)):r===I&&(s=o?2:0);let i="";switch(t){case 0:i="_f";break;case 2:i="_r3";break;case 3:i="_fr1"}return[n+"_"+(a+s+i),0,c]})(e);rt(o,r+c,s+i,t)},ot=e=>{(()=>{const e=he();((e,t,n,a,r,s)=>{const o=ue(),c=`0,0,${n},${a},#557,#aaf`;if(!tt[c]){const e=o.createLinearGradient(0,a,0,0);e.addColorStop(0,"#557"),e.addColorStop(1,"#aaf"),tt[c]=e}o.fillStyle=tt[c],o.fillRect(0,0,n,a)})(0,0,e.width,e.height)})();const t=ae(Z(e));mt(5,15,150,20),at("Turn: "+(null==t?void 0:t.name),10,26);const{allies:n,enemies:a,actionMenuStack:r}=e,s=r[0];for(let e=0;e<n.length;e++){const[t,a]=v(n[e].actor);C(n[e].actor,t,a),st(n[e].actor,2),at(""+n[e].name,2*t+16,2*a-5,{align:"center"})}gt(e,0),gt(e,A);for(let e=0;e<a.length;e++){const[t,n]=v(a[e].actor);st(a[e].actor,2),at(`${a[e].name}: ${""+a[e].cS.hp}/${""+a[e].bS.hp}`,2*t+5,2*n-5,{align:"center"})}N()&&ft(s),e.text&&pt(e.text),St(e)};let ct=null;const it=(e,t,n)=>{e[t]=n},lt=()=>{const e={};it(e,"menuMove",[.6,0,1248,.04,,0,2,2.23,99,.8,,,,,,,,0,.05]),it(e,"menuConfirm",[,,1469,,,.08,,.14,56,,,,,,,,.04,,.04]),it(e,"menuCancel",[,,1056,.03,,.06,3,.74,,.3,-38,.04,,,6,,,,.03]),it(e,"jump",[,,223,.01,.1,.22,1,1.35,.1,,,,,.4,,,,.55,.09]),it(e,"explosion",[,,518,.01,.05,1.59,4,1.24,.5,.4,,,,.3,,.7,.13,.58,.01]),it(e,"actionStrike",[,,224,,.08,.17,4,1.12,4.7,-4.2,,,,1.6,-.9,.1,.01,.82,.01]),it(e,"actionCharge",[,0,11,.16,.34,.06,2,2.05,,60,,,,,-1.2,.5,,,.01]),it(e,"actionDefend",[,,1396,,.1,.14,1,.91,,,,,,.1,,.1,,.71,.07]),it(e,"turnChime",[,0,750,.08,.05,.09,1,.01,,,,,.02,,,,.15,.4,.03]),it(e,"death",[1.1,0,170,.06,,1.17,4,.7,.8,1.5,50,,,.5,,.6,,.7]),ct=e},dt=e=>{S(...ct[e])},ht=16,ut=16,mt=(e,t,n,a,r)=>{nt(e,t,n,a,r=r||"#000"),nt(e,t,n,a,"#FFF",!0)},ft=e=>{const{x:t,y:n,w:a,h:r,i:s,bg:o,items:c,lineHeight:i}=e;o&&mt(t,n,a,r),c.forEach((r,s)=>{let o="#FFF";e.disabledItems.includes(s)&&(o="#999"),at(r,t+a/2,n+s*i+i/2,{align:"center",color:o})}),((e,t)=>{const n=ue(),a=ut,r=ht;n.save(),n.translate(e+2,t),n.beginPath(),n.moveTo(0,0),n.lineTo(0,a),n.lineTo(r,a/2),n.closePath(),n.fillStyle="#FFF",n.fill(),n.restore()})(t,n+i*s)},pt=e=>{const t=ge();mt(0,90,t,50),at(e,ge()/2,116,{align:"center",size:20})},gt=(e,t)=>{const n=ge(),a=t===A?n-200:0,r=n-90;mt(a,r,200,90),((e,t)=>{const n=t-25;mt(0,n,200,25),at("Unit",10,n+12.5),at("HP",80,n+12.5),at("Chg",140,n+12.5),at("Int",170,n+12.5)})(0,r);const s=t===A?e.enemies:e.allies;for(let e=0;e<s.length;e++){const n=s[e],{name:o,bS:c,cS:i}=n;0===t?(at(o.slice(0,8),a+10,r+15+20*e),at(`${i.hp}/${c.hp}`,a+80,r+15+20*e),at(""+i.cCnt,a+145,r+15+20*e),at(""+i.iCnt,a+175,r+15+20*e)):at(o.slice(0,8),a+100,r+15+20*e,{align:"center"})}},St=e=>{const{turnOrder:t}=Z(e),n=t.length,r=35*n;let s=ge()-ge()/3-r/2;mt(s-5,5,r+5,80);for(let r=0;r<n;r++,s+=35){const{name:n,actor:o}=t[r],{sprite:c,spriteIndex:i}=o,l=10+(Z(e).currentIndex===r?20:10);mt(s,l,30,40,a(e,t[r])?"#29ADFF":"#FF004D");const d=a(e,t[r])?l-5:l+40+8;at(n.slice(0,5),s+15,d,{size:12,align:"center",strokeColor:"#FFF"}),rt(`${c}_${i}`,s,l+5,2)}},bt=e=>{const t=document.getElementById("dialogBox"),n=ge();t.innerHTML=e,t.style["font-size"]="24px",t.style.border="2px solid white",t.style.height="128px",t.style.width=n-54+"px",t.style.top=n-128+"px",Fe()},wt=()=>{var e;null===(e=document.getElementById("dialogBox"))||void 0===e||e.setAttribute("style","display: none"),Fe()}})();