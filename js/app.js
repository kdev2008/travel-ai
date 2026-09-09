const CFG=window.TRAVEL_CONFIG||{};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

let selectedCode=CFG.DEFAULT_COUNTRY||'IN';
let selectedCountry=null;
let currentIntelAction='travel';
let countryLoadToken=0;
let scanTimer=null;
let searchTimer=null;

let profile=JSON.parse(localStorage.getItem('travel_ai_profile')||'null')||(CFG.DEFAULT_PROFILE||{passportCountry:'IN',homeCurrency:'INR',travelStyle:'Mid-range',interests:[]});
let savedTrips=JSON.parse(localStorage.getItem('travel_ai_saved')||'[]');

const aliases={
  'usa':'US','us':'US','america':'US','united states':'US','united states of america':'US',
  'uk':'GB','u.k.':'GB','britain':'GB','great britain':'GB','england':'GB',
  'uae':'AE','u.a.e.':'AE','dubai':'AE',
  'south korea':'KR','korea':'KR','republic of korea':'KR',
  'north korea':'KP',
  'russia':'RU',
  'vietnam':'VN','viet nam':'VN',
  'czech republic':'CZ','czechia':'CZ'
};

const guides={
  IN:{tagline:'Incredible diversity. Timeless experiences.',intro:'India rewards focused travel: choose one or two regions rather than trying to see everything in one trip.',places:[
    ['Taj Mahal','Agra','https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=700&q=80'],
    ['Jaipur','Rajasthan','https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=700&q=80'],
    ['Kerala Backwaters','Kerala','https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=80'],
    ['Varanasi','Uttar Pradesh','https://images.unsplash.com/photo-1561361058-c24e02d6e8d9?auto=format&fit=crop&w=700&q=80'],
    ['Ladakh','Himalayas','https://images.unsplash.com/photo-1626014303757-6366ef55c4ab?auto=format&fit=crop&w=700&q=80'],
    ['Goa','Coast','https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=80']
  ]},
  JP:{tagline:'Ancient traditions. Future-forward cities.',intro:'Japan is easy to navigate and works especially well for city, food, culture and rail-based travel.',places:[
    ['Tokyo','Kanto','https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=700&q=80'],
    ['Kyoto','Kansai','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=700&q=80'],
    ['Osaka','Kansai','https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=700&q=80'],
    ['Mount Fuji','Honshu','https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=700&q=80']
  ]}
};

function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function flagEmoji(code){return String(code||'').toUpperCase().replace(/./g,c=>String.fromCodePoint(127397+c.charCodeAt()))}
function compactPopulation(n){if(!n)return'—';if(n>=1e9)return(n/1e9).toFixed(2)+' Billion';if(n>=1e6)return(n/1e6).toFixed(1)+' Million';return Number(n).toLocaleString()}
function firstCurrency(c){const e=Object.entries(c?.currencies||{});return e.length?{code:e[0][0],...e[0][1]}:{code:'USD',name:'US Dollar',symbol:'$'}}
function wait(ms){return new Promise(r=>setTimeout(r,ms))}
function normalizeQuery(q){return String(q||'').trim().replace(/\s+/g,' ')}

function renderBriefText(text){
  const lines=String(text||'').split(/\n/).map(x=>x.trim()).filter(Boolean);
  if(!lines.length)return '<div class="brief-empty">No information available.</div>';

  const headings=new Set([
    'QUICK ANSWER','KEY POINTS','CHECK BEFORE YOU GO',
    'VISA STATUS','BASIC REQUIREMENTS','BEFORE BOOKING',
    'SAFETY LEVEL','WATCH FOR','SMART PRECAUTION',
    'TRAVEL BASICS','BEST FOR','PRACTICAL TIPS',
    'TRIP STYLE','ROUTE','DAY PLAN','BUDGET NOTE','BOOK FIRST',
    'ESTIMATED TOTAL','BASIC BREAKDOWN','SAVE MONEY',
    'QUICK COMPARISON','RECOMMENDATION'
  ]);

  let html='',inList=false;
  const closeList=()=>{if(inList){html+='</ul>';inList=false}};

  for(const raw of lines){
    const line=raw.replace(/\*\*/g,'').replace(/^#{1,6}\s*/,'').trim();
    const upper=line.toUpperCase();

    if(headings.has(upper)){
      closeList();
      html+=`<div class="brief-section-title">${esc(line)}</div>`;
      continue;
    }

    if(/^•\s+/.test(line)||/^[-*]\s+/.test(line)){
      if(!inList){html+='<ul class="brief-list">';inList=true}
      html+=`<li>${esc(line.replace(/^(•|[-*])\s+/,''))}</li>`;
      continue;
    }

    closeList();

    if(/^Day\s+\d+\s*:/i.test(line))html+=`<div class="brief-day">${esc(line)}</div>`;
    else if(/^[A-Za-z][A-Za-z /&-]{1,24}:\s+/.test(line))html+=`<div class="brief-fact">${esc(line)}</div>`;
    else html+=`<p class="brief-copy">${esc(line)}</p>`;
  }

  closeList();
  return html;
}

function api(action,params={}){
  if(!CFG.API_URL)throw new Error('AI backend is not connected. Add your Apps Script /exec URL to js/config.js.');
  const u=new URL(CFG.API_URL);
  u.searchParams.set('action',action);
  Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,String(v??'')));
  return fetch(u.toString(),{cache:'no-store'})
    .then(async r=>{
      const j=await r.json();
      if(!j.ok)throw new Error(j.error||'AI request failed.');
      return j;
    });
}

function renderSources(selector,sources){
  const el=$(selector);
  if(!el)return;
  const unique=[];
  const seen=new Set();
  (sources||[]).forEach(s=>{
    if(!s?.url||seen.has(s.url))return;
    seen.add(s.url);
    unique.push(s);
  });
  el.innerHTML=unique.slice(0,6).map((s,i)=>`<a href="${esc(s.url)}" target="_blank" rel="noopener" title="${esc(s.url)}">${esc(s.name||('Source '+(i+1)))}</a>`).join('');
}

/* ---------- SCI-FI COUNTRY SELECTION ---------- */

function scanReset(){
  ['scanGeo','scanFx','scanWx','scanAi'].forEach(id=>$('#'+id)?.classList.remove('ok'));
}
function scanMark(id){$('#'+id)?.classList.add('ok')}
function setScan(percent,text){
  $('#scanProgress').style.width=Math.max(0,Math.min(100,percent))+'%';
  $('#scanStep').textContent=text||'';
}
function openScan(name,code){
  clearTimeout(scanTimer);
  scanReset();
  $('#scanCountry').textContent=name||'Synchronizing Destination';
  $('#scanFlag').textContent=code?flagEmoji(code):'🌍';
  setScan(4,'Acquiring geographic target...');
  $('#scanOverlay').classList.add('open');
  $('#scanOverlay').setAttribute('aria-hidden','false');
}
function closeScan(){
  setScan(100,'Destination intelligence synchronized.');
  scanTimer=setTimeout(()=>{
    $('#scanOverlay').classList.remove('open');
    $('#scanOverlay').setAttribute('aria-hidden','true');
  },450);
}

async function resolveCountry(input){
  const q=normalizeQuery(input);
  if(!q)throw new Error('Type a country name.');

  const low=q.toLowerCase();
  if(aliases[low])return aliases[low];
  if(/^[a-z]{2}$/i.test(q))return q.toUpperCase();

  if(/^[a-z]{3}$/i.test(q)){
    try{
      const r=await fetch(`${CFG.REST_COUNTRIES_BASE}/alpha/${encodeURIComponent(q)}`);
      if(r.ok){
        const j=await r.json(),c=Array.isArray(j)?j[0]:j;
        if(c?.cca2)return c.cca2;
      }
    }catch(e){}
  }

  const r=await fetch(`${CFG.REST_COUNTRIES_BASE}/name/${encodeURIComponent(q)}`);
  if(!r.ok)throw new Error('Country not found.');

  const list=await r.json();
  if(!Array.isArray(list)||!list.length)throw new Error('Country not found.');

  const exact=list.find(c=>
    String(c?.name?.common||'').toLowerCase()===low ||
    String(c?.name?.official||'').toLowerCase()===low
  );

  const best=exact||list.sort((a,b)=>{
    const an=String(a?.name?.common||''),bn=String(b?.name?.common||'');
    return an.length-bn.length;
  })[0];

  if(!best?.cca2)throw new Error('Country not found.');
  return best.cca2;
}

async function fetchCountryByCode(code){
  const r=await fetch(`${CFG.REST_COUNTRIES_BASE}/alpha/${encodeURIComponent(code)}`,{cache:'no-store'});
  if(!r.ok)throw new Error('Country data unavailable.');
  const j=await r.json();
  const c=Array.isArray(j)?j[0]:j;
  if(!c?.cca2)throw new Error('Country data unavailable.');
  return c;
}

async function selectCountryAnimated(input,source='search'){
  const token=++countryLoadToken;
  let raw=normalizeQuery(input);
  openScan(raw,/^[A-Z]{2}$/.test(raw)?raw:'');

  try{
    setScan(12,source==='map'?'Locking map coordinates...':'Resolving destination identity...');
    let code=/^[A-Z]{2}$/.test(raw)?raw:await resolveCountry(raw);
    if(token!==countryLoadToken)return;

    scanMark('scanGeo');
    setScan(28,'Loading country intelligence...');
    const country=await fetchCountryByCode(code);
    if(token!==countryLoadToken)return;

    selectedCountry=country;
    selectedCode=country.cca2;

    $('#scanCountry').textContent=country.name?.common||country.cca2;
    $('#scanFlag').textContent=country.flag||flagEmoji(country.cca2);

    setScan(43,'Rendering destination profile...');
    renderCountry();
    await wait(120);

    setScan(58,'Synchronizing exchange rate...');
    const fxPromise=loadRate().then(()=>scanMark('scanFx'));

    setScan(72,'Reading capital weather...');
    const weatherPromise=loadWeather().then(()=>scanMark('scanWx'));

    await Promise.allSettled([fxPromise,weatherPromise]);
    if(token!==countryLoadToken)return;

    setScan(86,'Preparing traveller context...');
    closeScan();

    setTimeout(()=>$('#countrySection')?.scrollIntoView({behavior:'smooth',block:'start'}),520);

    if(CFG.AUTO_AI_SNAPSHOT!==false){
      generateSnapshot(country).finally(()=>scanMark('scanAi'));
    }
  }catch(e){
    $('#scanCountry').textContent='Destination Not Found';
    setScan(100,e.message||'Unable to load destination.');
    setTimeout(closeScan,950);
  }
}

/* ---------- SEARCH / AUTOCOMPLETE ---------- */

async function searchCountries(q){
  q=normalizeQuery(q);
  if(q.length<2)return [];
  if(aliases[q.toLowerCase()]){
    try{return [await fetchCountryByCode(aliases[q.toLowerCase()])]}catch(e){}
  }
  try{
    const r=await fetch(`${CFG.REST_COUNTRIES_BASE}/name/${encodeURIComponent(q)}`);
    if(!r.ok)return [];
    const j=await r.json();
    return Array.isArray(j)?j.slice(0,6):[];
  }catch(e){return []}
}

function renderSearchResults(container,list,input){
  const box=$(container);
  if(!box)return;
  if(!list.length){
    box.innerHTML='<div class="search-empty">No country found</div>';
    box.classList.add('open');
    return;
  }
  box.innerHTML=list.map(c=>`<div class="search-result" data-country-code="${esc(c.cca2)}">
    <span><b>${esc(c.flag||flagEmoji(c.cca2))} ${esc(c.name?.common||'')}</b><small>${esc(c.region||'')}</small></span>
    <small>${esc(c.cca2||'')}</small>
  </div>`).join('');
  box.classList.add('open');

  box.querySelectorAll('[data-country-code]').forEach(el=>{
    el.addEventListener('click',()=>{
      input.value=el.querySelector('b')?.textContent?.replace(/^[^\s]+\s/,'')||'';
      box.classList.remove('open');
      selectCountryAnimated(el.dataset.countryCode,'search');
    });
  });
}

function bindCountrySearch(inputSelector,resultSelector,buttonSelector){
  const input=$(inputSelector),results=$(resultSelector);
  if(!input)return;

  input.addEventListener('input',()=>{
    clearTimeout(searchTimer);
    const q=input.value;
    if(normalizeQuery(q).length<2){results?.classList.remove('open');return}
    searchTimer=setTimeout(async()=>{
      const list=await searchCountries(q);
      if(normalizeQuery(input.value)!==normalizeQuery(q))return;
      renderSearchResults(resultSelector,list,input);
    },180);
  });

  input.addEventListener('keydown',e=>{
    if(e.key==='Enter'){
      e.preventDefault();
      results?.classList.remove('open');
      selectCountryAnimated(input.value,'search');
    }
    if(e.key==='Escape')results?.classList.remove('open');
  });

  if(buttonSelector){
    $(buttonSelector)?.addEventListener('click',()=>{
      results?.classList.remove('open');
      selectCountryAnimated(input.value,'search');
    });
  }
}

document.addEventListener('click',e=>{
  if(!e.target.closest('.search-shell'))$$('.search-results').forEach(x=>x.classList.remove('open'));
});

/* ---------- COUNTRY DATA ---------- */

function renderProfile(){
  $('#profilePassport').textContent='Passport: '+profile.passportCountry+' '+flagEmoji(profile.passportCountry);
  $('#profileCurrency').textContent='Home Currency: '+profile.homeCurrency;
}

function renderCountry(){
  const c=selectedCountry;
  if(!c)return;
  const g=guides[c.cca2]||{};
  const cur=firstCurrency(c);

  $('#countryFlag').textContent=c.flag||flagEmoji(c.cca2);
  $('#countryName').textContent=c.name?.common||'Country';
  $('#countryTagline').textContent=g.tagline||'Explore the essentials before you go.';
  $('#countryRegionBadge').textContent=c.region||'';
  $('#countrySubregionBadge').textContent=c.subregion||'';

  $('#capital').textContent=(c.capital||['—'])[0];
  $('#currency').textContent=`${cur.name} (${cur.code})`;
  $('#languages').textContent=Object.values(c.languages||{}).slice(0,3).join(', ')||'—';
  $('#population').textContent=compactPopulation(c.population);
  $('#timezone').textContent=(c.timezones||['—'])[0];
  $('#callingCode').textContent=(c.idd?.root||'')+((c.idd?.suffixes||[''])[0]);
  $('#drivingSide').textContent=(c.car?.side||'—')+' side';

  $('#countryIntro').textContent=g.intro||`${c.name?.common} is in ${c.subregion||c.region}. Use the quick facts below for the basics, then open a travel tab for short AI guidance and official links.`;

  renderFacts(c,cur);
  renderPlaces(c,g);

  const p=(g.places||[])[0];
  if(p)$('#countryPhoto').style.backgroundImage=`linear-gradient(to top,#05131dc9,#05131d10),url('${p[2]}')`;
  else $('#countryPhoto').style.backgroundImage=`linear-gradient(to top,#05131dc9,#05131d10),url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85')`;

  syncSaveButton();
  showOverview();
}

function renderFacts(c,cur){
  const facts=[
    ['Continent',(c.continents||[])[0]||c.region],
    ['Region',c.subregion||c.region],
    ['Capital',(c.capital||['—'])[0]],
    ['Area',(c.area||0).toLocaleString()+' km²'],
    ['Population',compactPopulation(c.population)],
    ['Language',Object.values(c.languages||{})[0]||'—'],
    ['Currency',cur.code],
    ['Time Zone',(c.timezones||['—'])[0]],
    ['Driving',c.car?.side||'—']
  ];
  $('#quickFacts').innerHTML=facts.map(x=>`<div class="fact-row"><span>${esc(x[0])}</span><b>${esc(x[1])}</b></div>`).join('');
}

function renderPlaces(c,g){
  const cap=(c.capital||['Capital'])[0];
  const generic=[
    [cap+' Highlights',cap,'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=700&q=80'],
    ['Historic District','Heritage','https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=700&q=80'],
    ['Nature Escape','Scenic Region','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80'],
    ['Local Market','City Experience','https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=700&q=80']
  ];
  $('#placesGrid').innerHTML=(g.places||generic).slice(0,6).map(p=>`<article class="place-card">
    <img src="${p[2]}" alt="">
    <div class="place-body"><b>${esc(p[0])}</b><small>${esc(p[1])}</small></div>
  </article>`).join('');
}

async function loadRate(){
  if(!selectedCountry)return;
  const cur=firstCurrency(selectedCountry);
  const from=(profile.homeCurrency||'INR').toUpperCase();

  if(from===cur.code){
    $('#exchangeRate').textContent=`1 ${from} = 1 ${cur.code}`;
    $('#rateTime').textContent='Same currency';
    return;
  }

  try{
    const r=await fetch(`${CFG.FX_RATE_BASE}/${encodeURIComponent(from)}/${encodeURIComponent(cur.code)}`,{cache:'no-store'});
    if(!r.ok)throw new Error('Rate unavailable');
    const j=await r.json();
    const rate=Number(j.rate);
    $('#exchangeRate').textContent=rate?`1 ${from} = ${cur.symbol||''}${rate.toFixed(rate>100?1:2)}`:'Unavailable';
    $('#rateTime').textContent=j.date?`Ref. ${j.date}`:'Reference rate';
  }catch(e){
    $('#exchangeRate').textContent='Unavailable';
    $('#rateTime').textContent='';
  }
}

function weatherLabel(code){
  return ({
    0:['Clear','☀'],1:['Mostly clear','◔'],2:['Partly cloudy','☁'],3:['Cloudy','☁'],
    45:['Fog','≋'],48:['Fog','≋'],51:['Drizzle','☂'],53:['Drizzle','☂'],55:['Drizzle','☂'],
    61:['Rain','☂'],63:['Rain','☂'],65:['Heavy rain','☂'],71:['Snow','❄'],73:['Snow','❄'],
    80:['Showers','☂'],81:['Showers','☂'],82:['Heavy showers','☂'],95:['Thunderstorm','ϟ']
  })[code]||['Weather','◌'];
}

async function loadWeather(){
  if(!selectedCountry)return;
  const lat=selectedCountry?.capitalInfo?.latlng?.[0]??selectedCountry?.latlng?.[0];
  const lon=selectedCountry?.capitalInfo?.latlng?.[1]??selectedCountry?.latlng?.[1];
  if(lat==null||lon==null)throw new Error('Weather coordinates unavailable');

  try{
    const url=`${CFG.OPEN_METEO_FORECAST}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
    const r=await fetch(url,{cache:'no-store'});
    if(!r.ok)throw new Error('Weather unavailable');
    const j=await r.json();
    const w=weatherLabel(j.current?.weather_code);
    $('#weatherTemp').textContent=Math.round(j.current?.temperature_2m??0)+'°C';
    $('#weatherText').textContent=w[0];
    $('#weatherIcon').textContent=w[1];
  }catch(e){
    $('#weatherTemp').textContent='--°';
    $('#weatherText').textContent='Unavailable';
    $('#weatherIcon').textContent='◌';
  }
}

/* ---------- AI ---------- */

async function generateSnapshot(c){
  const box=$('#countryAiText');
  const status=$('#briefStatus');
  $('#countryAiSources').innerHTML='';

  if(!CFG.API_URL){
    status.textContent='Backend not connected';
    box.innerHTML='<div class="brief-empty">Country facts are live. Add API_URL in js/config.js to enable the AI traveller snapshot.</div>';
    return;
  }

  status.textContent='Generating...';
  box.innerHTML='<span class="loading-pulse">Preparing a short traveller brief...</span>';

  try{
    const q=`Give the essential traveller snapshot only: who this destination suits, 3 basic travel points, and one thing to verify before travel.`;
    const r=await api('askTravel',{
      question:q,
      country:c.name?.common||'',
      countryCode:c.cca2,
      passport:profile.passportCountry,
      homeCurrency:profile.homeCurrency,
      style:profile.travelStyle
    });

    box.innerHTML=renderBriefText(r.answer);
    renderSources('#countryAiSources',r.sources);
    status.textContent='Live';

    $('#aiResponse').innerHTML=renderBriefText(r.answer);
    renderSources('#aiSources',r.sources);
  }catch(e){
    status.textContent='Unavailable';
    box.innerHTML=`<div class="brief-empty">${esc(e.message)}</div>`;
  }
}

function showOverview(){
  $('#tabOverview').classList.add('active');
  $('#tabDynamic').classList.remove('active');
  $$('#countryTabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab==='overview'));
}

async function showIntel(action){
  if(!selectedCountry)return;
  currentIntelAction=action;

  if(action==='itinerary'){openTool('planner');return}
  if(action==='costs'){openTool('budget');return}

  $('#tabOverview').classList.remove('active');
  $('#tabDynamic').classList.add('active');
  $$('#countryTabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===action));

  const titles={
    travel:'Travel Basics',
    places:'Places to Visit',
    visa:'Visa / Entry',
    safety:'Safety',
    culture:'Culture & Etiquette',
    faq:'Traveller FAQ'
  };
  $('#dynamicTitle').textContent=titles[action]||'Travel Information';
  $('#dynamicContent').innerHTML='<span class="loading-pulse">Checking current travel information...</span>';
  $('#dynamicSources').innerHTML='';

  try{
    let apiAction='askTravel',question='';

    if(action==='visa')apiAction='visaInfo';
    else if(action==='safety')apiAction='safetyInfo';
    else if(action==='places')question='Give 5 best places to visit and who each is best for. Keep it very short.';
    else if(action==='culture')question='Give only the essential culture and etiquette points a visitor should know.';
    else if(action==='faq')question='Give a short traveller FAQ: money, SIM, transport, cards, water, tipping and emergencies.';
    else question='Give only the basic travel information: money, SIM, transport, payments, best season and one practical tip.';

    const r=await api(apiAction,{
      country:selectedCountry.name?.common||'',
      countryCode:selectedCode,
      passport:profile.passportCountry,
      homeCurrency:profile.homeCurrency,
      style:profile.travelStyle,
      question
    });

    $('#dynamicContent').innerHTML=renderBriefText(r.answer);
    renderSources('#dynamicSources',r.sources);
  }catch(e){
    $('#dynamicContent').innerHTML=`<div class="brief-empty">${esc(e.message)}</div>`;
  }
}

async function askAI(q){
  q=normalizeQuery(q);
  if(!q||!selectedCountry)return;

  $('#aiResponse').innerHTML='<span class="loading-pulse">Thinking...</span>';
  $('#aiSources').innerHTML='';

  try{
    const r=await api('askTravel',{
      question:q,
      country:selectedCountry.name?.common||'',
      countryCode:selectedCode,
      passport:profile.passportCountry,
      homeCurrency:profile.homeCurrency,
      style:profile.travelStyle
    });
    $('#aiResponse').innerHTML=renderBriefText(r.answer);
    renderSources('#aiSources',r.sources);
  }catch(e){
    $('#aiResponse').innerHTML=`<div class="brief-empty">${esc(e.message)}</div>`;
  }
}

/* ---------- MAP ---------- */

function initMap(){
  am5.ready(()=>{
    const root=am5.Root.new('chartdiv');
    root.setThemes([am5themes_Animated.new(root)]);

    const chart=root.container.children.push(am5map.MapChart.new(root,{
      panX:'rotateX',
      panY:'rotateY',
      projection:am5map.geoNaturalEarth1(),
      wheelY:'zoom',
      wheelSensitivity:.8
    }));

    const series=chart.series.push(am5map.MapPolygonSeries.new(root,{
      geoJSON:am5geodata_worldLow,
      exclude:['AQ']
    }));

    series.mapPolygons.template.setAll({
      tooltipText:'{name}',
      interactive:true,
      fill:am5.color(0x17684b),
      stroke:am5.color(0x58d7af),
      strokeWidth:.65
    });

    series.mapPolygons.template.states.create('hover',{
      fill:am5.color(0x1aa494),
      stroke:am5.color(0x58eaff),
      strokeWidth:1.5
    });

    series.mapPolygons.template.events.on('click',ev=>{
      const dc=ev.target.dataItem?.dataContext||{};
      const id=String(dc.id||ev.target.dataItem?.get('id')||'').toUpperCase();
      if(id)selectCountryAnimated(id,'map');
    });

    series.mapPolygons.template.events.on('pointerover',ev=>{
      const dc=ev.target.dataItem?.dataContext||{};
      const id=String(dc.id||'');
      const tt=$('#countryTooltip');
      tt.innerHTML=`<b>${flagEmoji(id)} ${esc(dc.name||'')}</b><small>Click to synchronize</small>`;
      tt.style.display='block';
      tt.style.left='58%';
      tt.style.top='31%';
    });

    series.mapPolygons.template.events.on('pointerout',()=>$('#countryTooltip').style.display='none');
    chart.appear(800,100);
  });
}

/* ---------- MODALS / TOOLS ---------- */

function openModal(html){
  $('#modalBody').innerHTML=html;
  $('#modalBackdrop').classList.add('open');
  $('#toolModal').classList.add('open');
  $('#toolModal').setAttribute('aria-hidden','false');
}
function closeModal(){
  $('#modalBackdrop').classList.remove('open');
  $('#toolModal').classList.remove('open');
  $('#toolModal').setAttribute('aria-hidden','true');
}

function openTool(action){
  if(action==='profile'){renderProfileModal();return}
  if(action==='saved'){renderSavedModal();return}
  if(action==='checklist'){
    const items=['Passport','Visa / entry documents','Travel insurance','Flights','Hotels','Cards / cash','SIM / eSIM','Medicines','Adapter','Emergency contacts'];
    const state=JSON.parse(localStorage.getItem('travel_ai_checklist')||'{}');
    openModal(`<h2>Travel Checklist</h2><div class="check-list">${items.map((x,i)=>`<label class="check-item"><input type="checkbox" data-check="${i}" ${state[i]?'checked':''}> ${esc(x)}</label>`).join('')}</div>`);
    $$('[data-check]').forEach(x=>x.onchange=()=>{state[x.dataset.check]=x.checked;localStorage.setItem('travel_ai_checklist',JSON.stringify(state))});
    return;
  }

  if(!selectedCountry){
    alert('Choose a country first.');
    return;
  }

  const country=selectedCountry.name?.common||'Selected country';
  const cur=firstCurrency(selectedCountry);

  if(action==='currency'){
    openModal(`<h2>Currency Converter</h2>
      <div class="form-grid">
        <div class="field"><label>From</label><input id="mFrom" value="${esc(profile.homeCurrency)}"></div>
        <div class="field"><label>To</label><input id="mTo" value="${esc(cur.code)}"></div>
        <div class="field"><label>Amount</label><input id="mAmount" type="number" value="10000"></div>
      </div>
      <button class="primary-btn" id="mConvert">Convert</button>
      <div class="result-box" id="mResult"></div>`);
    $('#mConvert').onclick=convertModal;
    return;
  }

  if(action==='planner'||action==='budget'){
    openModal(`<h2>${action==='planner'?'AI Trip Planner':'Budget Intelligence'}</h2>
      <p class="brief-copy">${esc(country)}</p>
      <div class="form-grid">
        <div class="field"><label>Days</label><input id="pDays" type="number" min="1" value="7"></div>
        <div class="field"><label>Travellers</label><input id="pTrav" type="number" min="1" value="1"></div>
        <div class="field"><label>Style</label><select id="pStyle"><option>Budget</option><option>Mid-range</option><option>Comfort</option><option>Luxury</option></select></div>
        <div class="field"><label>Currency</label><input id="pCur" value="${esc(profile.homeCurrency)}"></div>
      </div>
      <div class="field"><label>Interests</label><textarea id="pInt" rows="3">${esc((profile.interests||[]).join(', '))}</textarea></div>
      <button class="primary-btn" id="pRun">Generate</button>
      <div class="result-box brief-render" id="pResult"></div>
      <div class="source-list" id="pSources"></div>`);
    $('#pStyle').value=profile.travelStyle||'Mid-range';
    $('#pRun').onclick=()=>runPlanner(action);
    return;
  }

  if(action==='compare'){
    openModal(`<h2>Compare Countries</h2>
      <div class="compare-grid">
        <div class="field"><label>Country A</label><input id="cmpA" value="${esc(country)}"></div>
        <div class="field"><label>Country B</label><input id="cmpB" placeholder="e.g. Vietnam"></div>
      </div>
      <button class="primary-btn" id="cmpRun">Compare</button>
      <div class="result-box brief-render" id="cmpResult"></div>
      <div class="source-list" id="cmpSources"></div>`);
    $('#cmpRun').onclick=runCompare;
    return;
  }

  if(action==='visa'){showIntel('visa');$('#countrySection').scrollIntoView({behavior:'smooth'});return}
  if(action==='safety'){showIntel('safety');$('#countrySection').scrollIntoView({behavior:'smooth'});return}
  if(action==='tips'){showIntel('travel');$('#countrySection').scrollIntoView({behavior:'smooth'});return}
}

async function convertModal(){
  const from=$('#mFrom').value.trim().toUpperCase();
  const to=$('#mTo').value.trim().toUpperCase();
  const amount=Number($('#mAmount').value||0);
  $('#mResult').innerHTML='<span class="loading-pulse">Loading rate...</span>';

  try{
    if(from===to){$('#mResult').textContent=`${amount.toLocaleString()} ${from}`;return}
    const r=await fetch(`${CFG.FX_RATE_BASE}/${encodeURIComponent(from)}/${encodeURIComponent(to)}`);
    if(!r.ok)throw new Error('Rate unavailable');
    const j=await r.json();
    $('#mResult').textContent=`${amount.toLocaleString()} ${from} = ${(amount*Number(j.rate)).toLocaleString(undefined,{maximumFractionDigits:2})} ${to}`;
  }catch(e){
    $('#mResult').textContent='Rate unavailable';
  }
}

async function runPlanner(mode){
  $('#pResult').innerHTML='<span class="loading-pulse">Generating...</span>';
  $('#pSources').innerHTML='';
  try{
    const r=await api(mode==='planner'?'planTrip':'budgetTrip',{
      country:selectedCountry.name?.common||'',
      countryCode:selectedCode,
      passport:profile.passportCountry,
      days:$('#pDays').value,
      travellers:$('#pTrav').value,
      style:$('#pStyle').value,
      currency:$('#pCur').value,
      interests:$('#pInt').value
    });
    $('#pResult').innerHTML=renderBriefText(r.answer);
    renderSources('#pSources',r.sources);
  }catch(e){
    $('#pResult').innerHTML=`<div class="brief-empty">${esc(e.message)}</div>`;
  }
}

async function runCompare(){
  $('#cmpResult').innerHTML='<span class="loading-pulse">Comparing...</span>';
  $('#cmpSources').innerHTML='';
  try{
    const r=await api('compareCountries',{
      a:$('#cmpA').value,
      b:$('#cmpB').value,
      passport:profile.passportCountry,
      currency:profile.homeCurrency,
      style:profile.travelStyle,
      interests:(profile.interests||[]).join(', ')
    });
    $('#cmpResult').innerHTML=renderBriefText(r.answer);
    renderSources('#cmpSources',r.sources);
  }catch(e){
    $('#cmpResult').innerHTML=`<div class="brief-empty">${esc(e.message)}</div>`;
  }
}

function renderProfileModal(){
  openModal(`<h2>Traveller Profile</h2>
    <div class="profile-grid">
      <div class="field"><label>Passport country code</label><input id="prPass" value="${esc(profile.passportCountry)}"></div>
      <div class="field"><label>Home currency</label><input id="prCur" value="${esc(profile.homeCurrency)}"></div>
      <div class="field"><label>Travel style</label><select id="prStyle"><option>Budget</option><option>Mid-range</option><option>Comfort</option><option>Luxury</option></select></div>
      <div class="field"><label>Interests</label><input id="prInt" value="${esc((profile.interests||[]).join(', '))}"></div>
    </div>
    <button class="primary-btn" id="prSave">Save Profile</button>`);
  $('#prStyle').value=profile.travelStyle||'Mid-range';
  $('#prSave').onclick=()=>{
    profile={
      passportCountry:$('#prPass').value.trim().toUpperCase(),
      homeCurrency:$('#prCur').value.trim().toUpperCase(),
      travelStyle:$('#prStyle').value,
      interests:$('#prInt').value.split(',').map(x=>x.trim()).filter(Boolean)
    };
    localStorage.setItem('travel_ai_profile',JSON.stringify(profile));
    renderProfile();
    loadRate();
    closeModal();
  };
}

function renderSavedModal(){
  openModal(`<h2>My Trips</h2><div class="saved-list">${savedTrips.length?savedTrips.map(x=>`<div class="saved-item"><span>${esc(x.flag)} <b>${esc(x.name)}</b></span><div><button class="secondary-btn" data-open="${esc(x.code)}">Open</button> <button class="secondary-btn" data-remove="${esc(x.code)}">Remove</button></div></div>`).join(''):'<div class="brief-empty">No saved countries yet.</div>'}</div>`);
  $$('[data-open]').forEach(b=>b.onclick=()=>{closeModal();selectCountryAnimated(b.dataset.open,'saved')});
  $$('[data-remove]').forEach(b=>b.onclick=()=>{
    savedTrips=savedTrips.filter(x=>x.code!==b.dataset.remove);
    localStorage.setItem('travel_ai_saved',JSON.stringify(savedTrips));
    renderSavedModal();
    syncSaveButton();
  });
}

function saveCurrent(){
  if(!selectedCountry)return;
  if(savedTrips.some(x=>x.code===selectedCode))savedTrips=savedTrips.filter(x=>x.code!==selectedCode);
  else savedTrips.push({code:selectedCode,name:selectedCountry.name?.common||selectedCode,flag:selectedCountry.flag||flagEmoji(selectedCode)});
  localStorage.setItem('travel_ai_saved',JSON.stringify(savedTrips));
  syncSaveButton();
}
function syncSaveButton(){
  const on=savedTrips.some(x=>x.code===selectedCode);
  $('#saveCountryBtn').textContent=on?'✓ Saved to My Trips':'＋ Add to My Trips';
}

/* ---------- EVENTS ---------- */

bindCountrySearch('#countrySearch','#countryResults','#countrySearchBtn');
bindCountrySearch('#globalSearch','#globalResults');

$$('[data-prompt]').forEach(b=>b.onclick=()=>{
  $('#aiInput').value=b.dataset.prompt;
  askAI(b.dataset.prompt);
});
$('#aiSend').onclick=()=>askAI($('#aiInput').value);
$('#aiInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();askAI(e.target.value)}});

$$('[data-action]').forEach(x=>x.onclick=()=>openTool(x.dataset.action));
$('#editProfileBtn').onclick=()=>openTool('profile');
$('#savedTopBtn').onclick=()=>openTool('saved');
$('#saveCountryBtn').onclick=saveCurrent;
$('#viewPlacesBtn').onclick=()=>showIntel('places');
$('#dynamicRefresh').onclick=()=>showIntel(currentIntelAction);
$('#modalClose').onclick=closeModal;
$('#modalBackdrop').onclick=closeModal;
$('#themeBtn').onclick=()=>document.body.classList.toggle('low-glow');
$('#adminBtn').onclick=()=>CFG.ADMIN_URL?window.open(CFG.ADMIN_URL,'_blank'):alert('Set ADMIN_URL in js/config.js after deploying Apps Script.');

$$('#countryTabs button').forEach(b=>b.onclick=()=>b.dataset.tab==='overview'?showOverview():showIntel(b.dataset.tab));
$$('[data-scroll]').forEach(a=>a.onclick=()=>document.getElementById(a.dataset.scroll)?.scrollIntoView({behavior:'smooth'}));

renderProfile();
initMap();
selectCountryAnimated(selectedCode,'initial');