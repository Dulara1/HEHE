const $=s=>document.querySelector(s);
const loading=$("#loading"), start=$("#startBtn"), yes=$("#yesBtn"), no=$("#noBtn");
const question=$("#question"), success=$("#success"), replay=$("#replayBtn"), toast=$("#toast");
const canvas=$("#heartsCanvas"), ctx=canvas.getContext("2d");
let particles=[], mouse={x:-9999,y:-9999}, noCount=0, music=false;

window.addEventListener("load",()=>setTimeout(()=>loading.classList.add("hide"),650));

function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
resize();addEventListener("resize",resize);
addEventListener("mousemove",e=>mouse={x:e.clientX,y:e.clientY});

function addHeart(x=Math.random()*innerWidth,y=innerHeight+20,burst=false){
  particles.push({x,y,vx:(Math.random()-.5)*(burst?8:1.5),vy:-(Math.random()*(burst?9:2)+1),size:Math.random()*14+8,life:1,rot:Math.random()*6,vr:(Math.random()-.5)*.08});
}
function heartPath(c,x,y,s){
  c.save();c.translate(x,y);c.rotate(s.rot);
  c.beginPath();c.moveTo(0,s.size*.35);
  c.bezierCurveTo(-s.size*1.4,-s.size*.45,-s.size*.7,-s.size*1.25,0,-s.size*.65);
  c.bezierCurveTo(s.size*.7,-s.size*1.25,s.size*1.4,-s.size*.45,0,s.size*.35);
  c.fillStyle=`rgba(255,255,255,${s.life*.5})`;c.fill();c.restore()
}
function animate(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  if(Math.random()<.12)addHeart();
  particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.015;p.life-=.003;p.rot+=p.vr;heartPath(ctx,p.x,p.y,p)});
  particles=particles.filter(p=>p.life>0&&p.y>-50);
  requestAnimationFrame(animate)
}
animate();

start.onclick=()=>document.querySelector("#story").scrollIntoView({behavior:"smooth"});

const observer=new IntersectionObserver(entries=>{
 entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")})
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(e=>observer.observe(e));

function showToast(msg){
 toast.textContent=msg;toast.classList.add("show");
 setTimeout(()=>toast.classList.remove("show"),1800)
}
function dodge(){
 noCount++;
 const area=document.querySelector(".choice-area"), r=area.getBoundingClientRect();
 const maxX=Math.max(0,r.width-no.offsetWidth-10), maxY=Math.max(0,r.height-no.offsetHeight-10);
 no.style.position="absolute";
 no.style.left=(Math.random()*maxX)+"px";
 no.style.top=(Math.random()*maxY)+"px";
 const lines=[
  "hehe... try again 😭",
  "are you sure? 👀",
  "that button is shy",
  "NOPE 😂",
  "you can't catch it!",
  "the universe says YES 💗"
 ];
 showToast(lines[Math.min(noCount-1,lines.length-1)]);
 if(noCount>=6){no.textContent="okay fine 😭";no.style.opacity=".7"}
}
no.addEventListener("mouseenter",dodge);
no.addEventListener("touchstart",e=>{e.preventDefault();dodge()});
no.addEventListener("click",dodge);

yes.onclick=()=>{
  question.style.display="none";
  success.classList.add("show");
  for(let i=0;i<120;i++)setTimeout(()=>addHeart(innerWidth/2,innerHeight*.72,true),i*14);
  success.scrollIntoView({behavior:"smooth"});
};
replay.onclick=()=>{
  success.classList.remove("show");success.style.display="none";
  question.style.display="grid";
  question.scrollIntoView({behavior:"smooth"});
  setTimeout(()=>success.style.display="",100);
};
$("#musicBtn").onclick=()=>{
 music=!music;
 $("#musicBtn").textContent=music?"♫":"♪";
 showToast(music?"Music button enabled — add your own audio in script.js 🎵":"music off");
};

/* Gentle parallax for the floating hearts */
addEventListener("mousemove",e=>{
 document.querySelectorAll(".floating-heart").forEach((el,i)=>{
   const d=(i+1)*5;
   el.style.transform=`translate(${(e.clientX-innerWidth/2)/d}px,${(e.clientY-innerHeight/2)/d}px)`
 })
});
