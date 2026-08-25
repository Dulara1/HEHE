const loading=document.getElementById("loading"),no=document.getElementById("no"),yes=document.getElementById("yes"),question=document.getElementById("question"),success=document.getElementById("success"),canvas=document.getElementById("heartsCanvas"),ctx=canvas.getContext("2d");
let particles=[],count=0;

window.addEventListener("load",()=>setTimeout(()=>loading.classList.add("hide"),600));

function resize(){
  canvas.width=innerWidth*devicePixelRatio;
  canvas.height=innerHeight*devicePixelRatio;
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
resize();
addEventListener("resize",resize);

function heart(){
  particles.push({
    x:Math.random()*innerWidth,
    y:innerHeight+20,
    vx:(Math.random()-.5)*2,
    vy:-(Math.random()*3+1),
    s:Math.random()*14+8,
    a:1
  });
}

function draw(p){
  ctx.save();
  ctx.translate(p.x,p.y);
  ctx.beginPath();
  ctx.moveTo(0,p.s*.35);
  ctx.bezierCurveTo(-p.s*1.4,-p.s*.45,-p.s*.7,-p.s*1.25,0,-p.s*.65);
  ctx.bezierCurveTo(p.s*.7,-p.s*1.25,p.s*1.4,-p.s*.45,0,p.s*.35);
  ctx.fillStyle=`rgba(255,255,255,${p.a*.55})`;
  ctx.fill();
  ctx.restore();
}

function animate(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  if(Math.random()<.12)heart();
  particles.forEach(p=>{
    p.x+=p.vx;
    p.y+=p.vy;
    p.vy+=.015;
    p.a-=.003;
    draw(p);
  });
  particles=particles.filter(p=>p.a>0);
  requestAnimationFrame(animate);
}
animate();

document.querySelectorAll(".reveal").forEach(e=>{
  new IntersectionObserver(es=>es.forEach(x=>{
    if(x.isIntersecting)x.target.classList.add("visible");
  }),{threshold:.12}).observe(e);
});

function dodge(){
  count++;
  const r=document.getElementById("choices").getBoundingClientRect();
  no.style.position="absolute";
  no.style.left=Math.random()*Math.max(0,r.width-no.offsetWidth)+"px";
  no.style.top=Math.random()*Math.max(0,r.height-no.offsetHeight)+"px";
  document.getElementById("note").textContent=count>5?"okay okay 😭":"hehe... catch me 👀";
}

no.addEventListener("mouseenter",dodge);
no.addEventListener("touchstart",e=>{e.preventDefault();dodge()});
no.addEventListener("click",dodge);

yes.onclick=()=>{
  question.style.display="none";
  success.classList.add("show");
  for(let i=0;i<120;i++)setTimeout(heart,i*15);
  success.scrollIntoView({behavior:"smooth"});
};
