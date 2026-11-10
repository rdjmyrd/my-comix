const pages = [
 {title:"Весь мир впереди!", label:"ОБЛОЖКА", image:"assets/pages/01-cover.jpg", alt:"Оригинальная обложка комикса", lines:[["narrator","Знакомьтесь, это Бен — путешественник и любитель приключений. Он мечтает увидеть мир. Весь мир впереди!"]]},
 {title:"Куда дальше?", label:"ГЛАВА 1 · МАРШРУТ", image:"assets/pages/02-route.jpg", alt:"Бен выбирает маршрут", lines:[["ben","Хм… А куда бы отправиться сегодня?"],["narrator","Бен рассматривает карту мира. Столько стран и столько интересного впереди!"],["ben","Так… Европа, Азия, Африка, Америка… Столько стран!"],["ben","Решено! Вперёд!"]]},
 {title:"Нидерланды", label:"ГЛАВА 2 · НИДЕРЛАНДЫ", image:"assets/pages/03-netherlands.jpg", alt:"Оригинальная страница о Нидерландах", lines:[["ben","Ух! Я в Амстердаме!"],["narrator","Бен приехал в Нидерланды. Здесь его ждут каналы, красивые дома и знаменитые тюльпаны."],["ben","Тут столько тюльпанов! Нужно взять букетик."],["narrator","Бен гуляет по городу и надеется, что отлично проведёт время."]]},
 {title:"Япония", label:"ГЛАВА 3 · ЯПОНИЯ", image:"assets/pages/04-japan.jpg", alt:"Оригинальная страница о Японии", lines:[["ben","Вау… Токио, невероятно!"],["narrator","Следующая остановка — Япония. Бен знакомится с Токио и его яркими улицами."],["ben","Не знаю, что это… Но сейчас попробую!"],["ben","Какая красивая сакура!"],["narrator","Бен пробует новое и любуется цветущими деревьями. Каждая минута приносит открытие."]]},
 {title:"Египет", label:"ГЛАВА 4 · ЕГИПЕТ", image:"assets/pages/05-egypt.jpg", alt:"Оригинальная страница о Египте", lines:[["ben","Ух ты… Какие пирамиды!"],["narrator","В Египте Бен увидел величественные пирамиды и бескрайние пески пустыни."],["ben","Здесь столько всего интересного!"],["ben","Какой тут красивый закат!"],["narrator","Солнце садится за горизонт, и Бен готов отправляться дальше."]]},
 {title:"Греция", label:"ГЛАВА 5 · ГРЕЦИЯ", image:"assets/pages/06-greece.jpg", alt:"Оригинальная страница о Греции", lines:[["ben","Вау… Какая красота!"],["narrator","В Греции Бена встречают белые домики, голубые купола и лазурное море."],["ben","Надо сделать пару красивых кадров!"],["ben","Какой прекрасный день!"],["narrator","Бен сохраняет воспоминания об этом путешествии. Но теперь пора возвращаться домой."]]},
 {title:"Дома", label:"ГЛАВА 6 · ВОЗВРАЩЕНИЕ", image:"assets/pages/07-home.jpg", alt:"Оригинальная страница о возвращении Бена домой", lines:[["ben","Наконец-то я дома!"],["narrator","Бен вернулся домой после удивительного путешествия. Он вспоминает все места, которые успел посетить."],["ben","Столько интересных мест я посетил!"],["narrator","Но карта всё ещё лежит на столе, и впереди у Бена новые мечты."],["ben","Интересно, куда я отправлюсь в следующий раз?"]]},
 {title:"До новых приключений!", label:"ПОСЛЕДНЯЯ СТРАНИЦА", image:"assets/pages/08-back-cover.jpg", alt:"Оригинальная задняя обложка комикса", lines:[["narrator","Путешествие заканчивается, а приключения продолжаются! Спасибо, что путешествовали вместе с Беном."],["ben","До новых встреч!"]]}
];
const $=id=>document.getElementById(id);
let current=0, enabled=true, active=false, token=0;
let voices={ben:null,narrator:null};
function loadVoices(){
 if(!('speechSynthesis' in window))return;
 const ru=speechSynthesis.getVoices().filter(v=>(v.lang||'').toLowerCase().startsWith('ru'));
 const female=/female|woman|alena|milena|irina|yulia|svetlana|оксана|алёна|ирина/i;
 const male=/male|man|pavel|dmitri|yuri|александр|дмитрий|юрий/i;
 voices.narrator=ru.find(v=>female.test(v.name))||ru[0]||null;
 voices.ben=ru.find(v=>male.test(v.name))||ru[Math.min(1,ru.length-1)]||ru[0]||null;
}
if('speechSynthesis' in window){loadVoices();speechSynthesis.onvoiceschanged=loadVoices;}
function stop(){
 token++;
 if('speechSynthesis' in window)speechSynthesis.cancel();
 active=false;
 $('playBtn').textContent='▶';
 $('playBtn').setAttribute('aria-label','Слушать');
 $('audioStatus').textContent=enabled?'Русская озвучка · Бен и диктор':'Звук выключен';
}
function render(){
 const p=pages[current];
 const img=$('comicPage');
 img.classList.add('changing');
 window.setTimeout(()=>{img.src=p.image;img.alt=p.alt||'Страница комикса';img.classList.remove('changing');},90);
 $('chapterTitle').textContent=p.title;
 $('pageCount').textContent=`${current+1} / ${pages.length}`;
 $('progressFill').style.width=`${(current+1)/pages.length*100}%`;
 $('audioTitle').textContent='Слушать: '+p.title;
 $('prevBtn').disabled=current===0;
 $('nextBtn').disabled=current===pages.length-1;
 $('prevTextBtn').disabled=current===0;
 $('nextTextBtn').textContent=current===pages.length-1?'Сначала ↺':'Далее →';
 $('dots').innerHTML='';
 pages.forEach((item,i)=>{
  const b=document.createElement('button');
  b.className='dot'+(i===current?' active':'');b.type='button';b.title=item.title;
  b.setAttribute('aria-label',`Страница ${i+1}: ${item.title}`);
  b.addEventListener('click',()=>go(i));$('dots').appendChild(b);
 });
}
function go(i){
 const next=Math.max(0,Math.min(pages.length-1,i));
 if(next===current)return;
 stop();current=next;render();
}
function speak(line,run){
 return new Promise(resolve=>{
  if(!enabled||!('speechSynthesis' in window)||run!==token){resolve();return;}
  const u=new SpeechSynthesisUtterance(line[1]);u.lang='ru-RU';
  const ben=line[0]==='ben';if(voices[line[0]])u.voice=voices[line[0]];
  u.rate=ben?1.02:.92;u.pitch=ben?1.2:.92;u.volume=1;
  $('audioStatus').textContent=ben?'Говорит Бен':'Говорит диктор';
  u.onend=resolve;u.onerror=resolve;speechSynthesis.speak(u);
 });
}
async function play(){
 if(!enabled){$('audioStatus').textContent='Сначала включите звук';return;}
 if(!('speechSynthesis' in window)){$('audioStatus').textContent='Браузер не поддерживает озвучку';return;}
 stop();const run=token;active=true;$('playBtn').textContent='Ⅱ';$('playBtn').setAttribute('aria-label','Пауза / остановить');
 for(const line of pages[current].lines){if(run!==token)break;await speak(line,run);}
 if(run===token){active=false;$('playBtn').textContent='▶';$('playBtn').setAttribute('aria-label','Слушать');$('audioStatus').textContent='Озвучка завершена';}
}
$('prevBtn').addEventListener('click',()=>go(current-1));
$('nextBtn').addEventListener('click',()=>go(current+1));
$('prevTextBtn').addEventListener('click',()=>go(current-1));
$('nextTextBtn').addEventListener('click',()=>go(current===pages.length-1?0:current+1));
$('brandHome').addEventListener('click',e=>{e.preventDefault();go(0);});
$('playBtn').addEventListener('click',()=>active?stop():play());
$('stopBtn').addEventListener('click',stop);
$('soundToggle').addEventListener('click',()=>{
 enabled=!enabled;$('soundToggle').setAttribute('aria-pressed',String(enabled));
 $('soundToggle').innerHTML=(enabled?'🔊':'🔇')+' <span>'+(enabled?'Звук включён':'Звук выключен')+'</span>';
 if(!enabled)stop();else $('audioStatus').textContent='Русская озвучка · Бен и диктор';
});
document.addEventListener('keydown',e=>{
 if(e.key==='ArrowRight')go(current+1);
 if(e.key==='ArrowLeft')go(current-1);
 if(e.key===' '&&e.target.tagName!=='BUTTON'){e.preventDefault();active?stop():play();}
});
let touchStartX=0;
$('viewer').addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].clientX;},{passive:true});
$('viewer').addEventListener('touchend',e=>{
 const dx=e.changedTouches[0].clientX-touchStartX;
 if(Math.abs(dx)>55)go(current+(dx<0?1:-1));
},{passive:true});
render();
