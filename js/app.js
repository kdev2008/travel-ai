const CFG=window.TRAVEL_CONFIG||{};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let selectedCode=CFG.DEFAULT_COUNTRY||'IN', selectedCountry=null, currentIntelAction='travel';

const defaultProfile=CFG.DEFAULT_PROFILE||{passportCountry:'IN',homeCurrency:'INR',travelStyle:'Mid-range',interests:['Culture']};
let profile=JSON.parse(localStorage.getItem('travel_ai_profile')||'null')||defaultProfile;
let savedTrips=JSON.parse(localStorage.getItem('travel_ai_saved')||'[]');

const localGuides={
  IN:{tagline:'Incredible diversity. Timeless experiences.',intro:'India is a land of vibrant cultures, historic monuments, mountain landscapes, tropical coasts and extraordinary food traditions. From ancient cities to modern metros, it rewards slow, curious travel.',places:[
    ['Taj Mahal','Agra','https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=700&q=80'],
    ['Jaipur','Rajasthan','https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=700&q=80'],
    ['Kerala Backwaters','Kerala','https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=80'],
    ['Varanasi','Uttar Pradesh','https://images.unsplash.com/photo-1561361058-c24e02d6e8d9?auto=format&fit=crop&w=700&q=80'],
    ['Ladakh','Himalayas','https://images.unsplash.com/photo-1626014303757-6366ef55c4ab?auto=format&fit=crop&w=700&q=80'],
    ['Goa','Beaches','https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=80']
  ]},
  JP:{tagline:'Ancient traditions. Future-forward cities.',intro:'Japan blends refined tradition, efficient modern cities, exceptional food, mountain scenery and a deep culture of hospitality.',places:[
    ['Tokyo','Kanto','https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=700&q=80'],
    ['Kyoto','Kansai','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=700&q=80'],
    ['Osaka','Kansai','https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=700&q=80'],
    ['Mount Fuji','Honshu','https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=700&q=80']
  ]},
  TH:{tagline:'Tropical energy. Legendary hospitality.',intro:'Thailand mixes buzzing cities, Buddhist heritage, island landscapes, famous street food and a well-developed tourism network.',places:[
    ['Bangkok','Central Thailand','https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=700&q=80'],
    ['Chiang Mai','Northern Thailand','https://images.unsplash.com/photo-1598970605070-a38a6ccd3a2d?auto=format&fit=crop&w=700&q=80'],
    ['Phuket','Andaman Coast','https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=700&q=80'],
    ['Krabi','Southern Thailand','https://images.unsplash.com/photo-1552550049-db097c9480d1?auto=format&fit=crop&w=700&q=80']
  ]}
};

function compactPopulation(n){if(!n)return '—';if(n>=1e9)return (n/1e9).toFixed(2)+' Billion';if(n>=1e6)return (n/1e6).toFixed(1)+' Million';return Number(n).toLocaleString()}
function firstCurrency(c){const entries=Object.entries(c?.currencies||{});return entries.length?{code:entries[0][0],...entries[0][1]}:{code:'USD',name:'US Dollar',symbol:'$'}}
function flagEmoji(code){return String(code||'').toUpperCase().replace(/./g,c=>String.fromCodePoint(127397+c.charCodeAt()))}
function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function apiUrl(action,params={}){if(!CFG.API_URL)return '';const u=new URL(CFG.API_URL);u.searchParams.set('action',action);Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,String(v??'')));return u.toString()}
async function callApi(action,params={}){
  if(!CFG.API_URL)throw new Error('AI backend is not connected. Add your Apps Script /exec URL in js/config.js.');
  const r=await fetch(apiUrl(action,params));const j=await r.json();if(!j.ok)throw new Error(j.error||'Request failed');return j
}
function renderProfile(){
  $('#profilePassport').textContent='Passport: '+profile.passportCountry+' '+flagEmoji(profile.passportCountry);
  $('#profileCurrency').textContent='Home Currency: '+profile.homeCurrency;
}

async function loadCountry(code){
  try{
    const r=await fetch(`${CFG.REST_COUNTRIES_BASE}/alpha/${encodeURIComponent(code)}`);
    const j=await r.json();selectedCountry=Array.isArray(j)?j[0]:j;selectedCode=selectedCountry.cca2||code;
    renderCountry();loadRate();loadWeather();
  }catch(e){console.error(e)}
}
function renderCountry(){
  const c=selectedCountry;if(!c)return;const guide=localGuides[c.cca2]||{};const curr=firstCurrency(c);
  $('#countryFlag').textContent=c.flag||flagEmoji(c.cca2);$('#countryName').textContent=c.name?.common||'Country';
  $('#countryTagline').textContent=guide.tagline||'Discover culture, places and unforgettable experiences.';
  $('#countryRegionBadge').textContent=c.region||'';$('#countrySubregionBadge').textContent=c.subregion||'';
  $('#capital').textContent=(c.capital||['—'])[0];$('#currency').textContent=`${curr.name} (${curr.code})`;
  $('#languages').textContent=Object.values(c.languages||{}).slice(0,3).join(', ')||'—';$('#population').textContent=compactPopulation(c.population);
  $('#timezone').textContent=(c.timezones||['—'])[0];$('#callingCode').textContent=(c.idd?.root||'')+((c.idd?.suffixes||[''])[0]);
  $('#drivingSide').textContent=(c.car?.side||'—')+' side';
  $('#countryIntro').textContent=guide.intro||`${c.name?.common} is in ${c.subregion||c.region}. Explore its culture, transport, visa planning, costs, food and destinations with your AI travel companion.`;
  renderFacts(c,curr);renderPlaces(c,guide);setPhoto(guide);syncSaveButton();clearDynamic();
}
function renderFacts(c,curr){
  const facts=[['Continent',(c.continents||[])[0]||c.region],['Region',c.subregion||c.region],['Capital',(c.capital||['—'])[0]],['Area',(c.area||0).toLocaleString()+' km²'],['Population',compactPopulation(c.population)],['Official Language',Object.values(c.languages||{})[0]||'—'],['Currency',curr.name+' ('+curr.code+')'],['Time Zone',(c.timezones||['—'])[0]],['Driving Side',c.car?.side||'—'],['TLD',(c.tld||['—'])[0]]];
  $('#quickFacts').innerHTML=facts.map(x=>`<div class="fact-row"><span>${escapeHtml(x[0])}</span><b>${escapeHtml(x[1])}</b></div>`).join('');
}
function renderPlaces(c,guide){
  const cap=(c.capital||['Capital'])[0];
  const generic=[[`${cap} Highlights`,cap,'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=700&q=80'],['Historic Quarter','Heritage Area','https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=700&q=80'],['Nature Escape','Scenic Region','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80'],['Local Market','City Center','https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=700&q=80']];
  const places=(guide.places||generic).slice(0,6);
  $('#placesGrid').innerHTML=places.map(p=>`<article class="place-card"><img src="${p[2]}" alt=""><div class="place-body"><b>${escapeHtml(p[0])}</b><small>${escapeHtml(p[1])}</small></div></article>`).join('');
}
function setPhoto(guide){const p=(guide.places||[])[0];if(p)$('#countryPhoto').style.backgroundImage=`linear-gradient(to top,#05131dc9,#05131d10),url('${p[2]}')`}
async function loadRate(){
  const curr=firstCurrency(selectedCountry);const from=profile.homeCurrency||'INR';$('#exchangeRate').textContent='Loading…';
  if(from===curr.code){$('#exchangeRate').textContent=`1 ${from} = 1 ${curr.code}`;$('#rateTime').textContent='Same currency';return}
  try{
    const r=await fetch(`${CFG.FX_RATE_BASE}/${encodeURIComponent(from)}/${encodeURIComponent(curr.code)}`);
    const j=await r.json();const rate=Number(j.rate);$('#exchangeRate').textContent=rate?`1 ${from} = ${curr.symbol||''}${rate.toFixed(rate>100?1:2)}`:'Rate unavailable';$('#rateTime').textContent=j.date?`Updated ${j.date}`:'Reference rate';
  }catch(e){$('#exchangeRate').textContent='Rate unavailable'}
}
function weatherLabel(code){const map={0:['Clear','☀'],1:['Mostly clear','◔'],2:['Partly cloudy','☁'],3:['Cloudy','☁'],45:['Fog','≋'],51:['Drizzle','☂'],61:['Rain','☂'],63:['Rain','☂'],65:['Heavy rain','☂'],71:['Snow','❄'],80:['Showers','☂'],95:['Thunderstorm','ϟ']};return map[code]||['Weather','◌']}
async function loadWeather(){
  const lat=selectedCountry?.capitalInfo?.latlng?.[0]??selectedCountry?.latlng?.[0],lon=selectedCountry?.capitalInfo?.latlng?.[1]??selectedCountry?.latlng?.[1];
  if(lat==null||lon==null)return;
  try{
    const u=`${CFG.OPEN_METEO_FORECAST}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
    const r=await fetch(u);const j=await r.json();const w=weatherLabel(j.current?.weather_code);
    $('#weatherTemp').textContent=Math.round(j.current?.temperature_2m??0)+'°C';$('#weatherText').textContent=w[0];$('#weatherIcon').textContent=w[1];
  }catch(e){$('#weatherText').textContent='Unavailable'}
}
function clearDynamic(){$('#tabOverview').classList.add('active');$('#tabDynamic').classList.remove('active');$$('#countryTabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab==='overview'))}
async function showIntel(action){
  currentIntelAction=action;$('#tabOverview').classList.remove('active');$('#tabDynamic').classList.add('active');$$('#countryTabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===action));
  const titles={travel:'Travel Information',places:'Places to Visit',itinerary:'AI Itinerary',costs:'Travel Costs',visa:'Visa Research',safety:'Safety Brief',culture:'Culture & Etiquette',faq:'Traveller FAQ'};
  $('#dynamicTitle').textContent=titles[action]||'Travel Intelligence';$('#dynamicContent').innerHTML='<span class="loading-pulse">Researching current travel information…</span>';$('#dynamicSources').innerHTML='';
  const country=selectedCountry?.name?.common||selectedCode;
  try{
    let apiAction='askTravel',q='';
    if(action==='visa')apiAction='visaInfo';
    else if(action==='safety')apiAction='safetyInfo';
    else if(action==='itinerary'){openTool('planner');return}
    else if(action==='costs'){openTool('budget');return}
    else if(action==='places')q=`Recommend the best places to visit in ${country}, including famous highlights and 3 less obvious places.`;
    else if(action==='culture')q=`Give a practical culture and etiquette guide for travellers visiting ${country}. Include behaviour, dress, tipping, food etiquette and common mistakes.`;
    else if(action==='faq')q=`Create a concise traveller FAQ for ${country}: money, SIM, transport, water, tipping, payment cards, emergencies and best time to visit.`;
    else q=`Give current practical travel information for ${country}: arrival, transport, SIM/eSIM, money, payments, local transport, best season and useful traveller tips.`;
    const params={country:country,countryCode:selectedCode,passport:profile.passportCountry,question:q};
    const res=await callApi(apiAction,params);$('#dynamicContent').textContent=res.answer||res.content||'No result.';renderSources('#dynamicSources',res.sources||[]);
  }catch(e){$('#dynamicContent').textContent=e.message}
}
function renderSources(sel,sources){$(sel).innerHTML=(sources||[]).slice(0,8).map((s,i)=>`<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.name||('Source '+(i+1)))}</a>`).join('')}
async function askAI(q){
  q=String(q||'').trim();if(!q)return;$('#aiResponse').innerHTML='<span class="loading-pulse">Thinking with live travel context…</span>';$('#aiSources').innerHTML='';
  try{
    const res=await callApi('askTravel',{question:q,country:selectedCountry?.name?.common||'',countryCode:selectedCode,passport:profile.passportCountry,homeCurrency:profile.homeCurrency,style:profile.travelStyle});
    $('#aiResponse').textContent=res.answer||'No answer.';renderSources('#aiSources',res.sources||[]);
  }catch(e){$('#aiResponse').textContent=e.message}
}
function initMap(){
  am5.ready(function(){
    const root=am5.Root.new('chartdiv');root.setThemes([am5themes_Animated.new(root)]);
    const chart=root.container.children.push(am5map.MapChart.new(root,{panX:'rotateX',panY:'rotateY',projection:am5map.geoNaturalEarth1(),wheelY:'zoom',wheelSensitivity:.8}));
    const polygonSeries=chart.series.push(am5map.MapPolygonSeries.new(root,{geoJSON:am5geodata_worldLow,exclude:['AQ']}));
    polygonSeries.mapPolygons.template.setAll({tooltipText:'{name}',interactive:true,fill:am5.color(0x166447),stroke:am5.color(0x5ad9b0),strokeWidth:.65});
    polygonSeries.mapPolygons.template.states.create('hover',{fill:am5.color(0x1fb7a8),stroke:am5.color(0x58eaff),strokeWidth:1.5});
    polygonSeries.mapPolygons.template.events.on('click',ev=>{const id=ev.target.dataItem?.get('id');if(id)loadCountry(id)});
    polygonSeries.mapPolygons.template.events.on('pointerover',ev=>{const d=ev.target.dataItem?.dataContext||{};const tt=$('#countryTooltip');tt.innerHTML=`<b>${flagEmoji(d.id||'')} ${escapeHtml(d.name||'')}</b><small>Click to explore</small>`;tt.style.display='block';tt.style.left='58%';tt.style.top='31%'});
    polygonSeries.mapPolygons.template.events.on('pointerout',()=>$('#countryTooltip').style.display='none');chart.appear(800,100);
  });
}
function openModal(html){$('#modalBody').innerHTML=html;$('#modalBackdrop').classList.add('open');$('#toolModal').classList.add('open');$('#toolModal').setAttribute('aria-hidden','false')}
function closeModal(){$('#modalBackdrop').classList.remove('open');$('#toolModal').classList.remove('open');$('#toolModal').setAttribute('aria-hidden','true')}
function openTool(action){
  const country=selectedCountry?.name?.common||'Selected country';const curr=firstCurrency(selectedCountry);
  if(action==='currency'){
    openModal(`<h2 class="modal-title">Currency Converter</h2><p class="modal-sub">Live reference exchange rate for ${escapeHtml(country)}</p><div class="form-grid"><div class="field"><label>From</label><input id="mFrom" value="${escapeHtml(profile.homeCurrency)}"></div><div class="field"><label>To</label><input id="mTo" value="${escapeHtml(curr.code)}"></div><div class="field"><label>Amount</label><input id="mAmount" type="number" value="10000"></div></div><button class="primary-btn" id="mConvert">Convert</button><div class="result-box" id="mResult"></div>`);
    $('#mConvert').onclick=convertModal;return
  }
  if(action==='planner'||action==='budget'){
    openModal(`<h2 class="modal-title">${action==='planner'?'AI Trip Planner':'Budget Intelligence'}</h2><p class="modal-sub">${escapeHtml(country)} • personalized for your profile</p><div class="form-grid"><div class="field"><label>Days</label><input id="pDays" type="number" min="1" value="7"></div><div class="field"><label>Travellers</label><input id="pTravellers" type="number" min="1" value="1"></div><div class="field"><label>Travel style</label><select id="pStyle"><option>Budget</option><option ${profile.travelStyle==='Mid-range'?'selected':''}>Mid-range</option><option>Comfort</option><option>Luxury</option></select></div><div class="field"><label>Home currency</label><input id="pCurrency" value="${escapeHtml(profile.homeCurrency)}"></div></div><div class="field"><label>Interests / requirements</label><textarea id="pInterests" rows="3">${escapeHtml((profile.interests||[]).join(', '))}</textarea></div><button class="primary-btn" id="pRun">${action==='planner'?'Build My Itinerary':'Estimate My Budget'}</button><div class="result-box" id="pResult"></div><div class="source-list" id="pSources"></div>`);
    $('#pRun').onclick=()=>runPlanner(action);return
  }
  if(action==='compare'){
    openModal(`<h2 class="modal-title">Compare Countries</h2><p class="modal-sub">AI comparison based on your traveller profile</p><div class="compare-grid"><div class="field"><label>Country A</label><input id="cmpA" value="${escapeHtml(country)}"></div><div class="field"><label>Country B</label><input id="cmpB" placeholder="e.g. Vietnam"></div></div><button class="primary-btn" id="cmpRun">Compare</button><div class="result-box" id="cmpResult"></div><div class="source-list" id="cmpSources"></div>`);
    $('#cmpRun').onclick=runCompare;return
  }
  if(action==='checklist'){
    const defaults=['Passport','Visa / entry documents','Travel insurance','Flight tickets','Accommodation confirmations','Local currency / cards','eSIM or SIM plan','Medicines','Universal adapter','Emergency contacts'];
    const saved=JSON.parse(localStorage.getItem('travel_ai_checklist')||'{}');openModal(`<h2 class="modal-title">Travel Checklist</h2><p class="modal-sub">Saved on this device</p><div class="check-list">${defaults.map((x,i)=>`<label class="check-item"><input type="checkbox" data-check="${i}" ${saved[i]?'checked':''}> ${escapeHtml(x)}</label>`).join('')}</div>`);
    $$('[data-check]').forEach(x=>x.onchange=()=>{saved[x.dataset.check]=x.checked;localStorage.setItem('travel_ai_checklist',JSON.stringify(saved))});return
  }
  if(action==='saved'){renderSavedModal();return}
  if(action==='profile'){renderProfileModal();return}
  if(action==='visa'){showIntel('visa');document.getElementById('countrySection').scrollIntoView();return}
  if(action==='safety'){showIntel('safety');document.getElementById('countrySection').scrollIntoView();return}
  if(action==='tips'){showIntel('travel');document.getElementById('countrySection').scrollIntoView();return}
}
async function convertModal(){
  const from=$('#mFrom').value.trim().toUpperCase(),to=$('#mTo').value.trim().toUpperCase(),amt=Number($('#mAmount').value||0);$('#mResult').innerHTML='<span class="loading-pulse">Loading rate…</span>';
  try{if(from===to){$('#mResult').textContent=`${amt.toLocaleString()} ${from} = ${amt.toLocaleString()} ${to}`;return}const r=await fetch(`${CFG.FX_RATE_BASE}/${from}/${to}`);const j=await r.json();const rate=Number(j.rate);$('#mResult').textContent=rate?`${amt.toLocaleString()} ${from} = ${(amt*rate).toLocaleString(undefined,{maximumFractionDigits:2})} ${to}\nReference date: ${j.date||'latest'}`:'Rate unavailable'}catch(e){$('#mResult').textContent='Rate unavailable'}
}
async function runPlanner(mode){
  $('#pResult').innerHTML='<span class="loading-pulse">Building a realistic travel plan…</span>';$('#pSources').innerHTML='';
  try{
    const action=mode==='planner'?'planTrip':'budgetTrip';const res=await callApi(action,{country:selectedCountry?.name?.common||'',countryCode:selectedCode,passport:profile.passportCountry,days:$('#pDays').value,travellers:$('#pTravellers').value,style:$('#pStyle').value,currency:$('#pCurrency').value,interests:$('#pInterests').value});
    $('#pResult').textContent=res.answer||'No result.';renderSources('#pSources',res.sources||[]);
  }catch(e){$('#pResult').textContent=e.message}
}
async function runCompare(){
  $('#cmpResult').innerHTML='<span class="loading-pulse">Comparing destinations…</span>';$('#cmpSources').innerHTML='';
  try{const res=await callApi('compareCountries',{a:$('#cmpA').value,b:$('#cmpB').value,passport:profile.passportCountry,currency:profile.homeCurrency,style:profile.travelStyle,interests:(profile.interests||[]).join(', ')});$('#cmpResult').textContent=res.answer||'No result.';renderSources('#cmpSources',res.sources||[])}catch(e){$('#cmpResult').textContent=e.message}
}
function saveCurrentCountry(){
  if(!selectedCountry)return;const entry={code:selectedCode,name:selectedCountry.name?.common,flag:selectedCountry.flag||flagEmoji(selectedCode),savedAt:new Date().toISOString()};
  if(!savedTrips.some(x=>x.code===entry.code))savedTrips.push(entry);else savedTrips=savedTrips.filter(x=>x.code!==entry.code);
  localStorage.setItem('travel_ai_saved',JSON.stringify(savedTrips));syncSaveButton()
}
function syncSaveButton(){const on=savedTrips.some(x=>x.code===selectedCode);$('#saveCountryBtn').textContent=on?'✓ Saved to My Trips':'＋ Add to My Trips'}
function renderSavedModal(){
  openModal(`<h2 class="modal-title">My Trips</h2><p class="modal-sub">Saved locally on this device</p><div class="saved-list">${savedTrips.length?savedTrips.map(x=>`<div class="saved-item"><span>${escapeHtml(x.flag)} <b>${escapeHtml(x.name)}</b></span><div><button class="secondary-btn" data-open="${x.code}">Open</button> <button class="secondary-btn" data-remove="${x.code}">Remove</button></div></div>`).join(''):'<div class="result-box">No saved countries yet.</div>'}</div>`);
  $$('[data-open]').forEach(b=>b.onclick=()=>{closeModal();loadCountry(b.dataset.open);document.getElementById('countrySection').scrollIntoView()});$$('[data-remove]').forEach(b=>b.onclick=()=>{savedTrips=savedTrips.filter(x=>x.code!==b.dataset.remove);localStorage.setItem('travel_ai_saved',JSON.stringify(savedTrips));renderSavedModal();syncSaveButton()})
}
function renderProfileModal(){
  openModal(`<h2 class="modal-title">Traveller Profile</h2><p class="modal-sub">Used to personalize visa, budget and itinerary answers</p><div class="profile-grid"><div class="field"><label>Passport country code</label><input id="prPassport" value="${escapeHtml(profile.passportCountry)}"></div><div class="field"><label>Home currency</label><input id="prCurrency" value="${escapeHtml(profile.homeCurrency)}"></div><div class="field"><label>Travel style</label><select id="prStyle"><option>Budget</option><option>Mid-range</option><option>Comfort</option><option>Luxury</option></select></div><div class="field"><label>Interests (comma separated)</label><input id="prInterests" value="${escapeHtml((profile.interests||[]).join(', '))}"></div></div><button class="primary-btn" id="prSave">Save Profile</button>`);
  $('#prStyle').value=profile.travelStyle||'Mid-range';$('#prSave').onclick=()=>{profile={passportCountry:$('#prPassport').value.trim().toUpperCase(),homeCurrency:$('#prCurrency').value.trim().toUpperCase(),travelStyle:$('#prStyle').value,interests:$('#prInterests').value.split(',').map(x=>x.trim()).filter(Boolean)};localStorage.setItem('travel_ai_profile',JSON.stringify(profile));renderProfile();loadRate();closeModal()}
}
$$('[data-prompt]').forEach(b=>b.onclick=()=>{$('#aiInput').value=b.dataset.prompt;askAI(b.dataset.prompt)});$('#aiSend').onclick=()=>askAI($('#aiInput').value);$('#aiInput').addEventListener('keydown',e=>{if(e.key==='Enter')askAI(e.target.value)});
$$('[data-action]').forEach(x=>x.onclick=()=>openTool(x.dataset.action));$('#saveCountryBtn').onclick=saveCurrentCountry;$('#viewPlacesBtn').onclick=()=>showIntel('places');$('#editProfileBtn').onclick=()=>openTool('profile');$('#savedTopBtn').onclick=()=>openTool('saved');$('#themeBtn').onclick=()=>document.body.classList.toggle('glow-off');$('#adminBtn').onclick=()=>{if(CFG.ADMIN_URL)window.open(CFG.ADMIN_URL,'_blank');else alert('Add ADMIN_URL in js/config.js after deploying Apps Script.')};
$('#modalClose').onclick=closeModal;$('#modalBackdrop').onclick=closeModal;$('#dynamicRefresh').onclick=()=>showIntel(currentIntelAction);
$$('#countryTabs button').forEach(b=>b.onclick=()=>b.dataset.tab==='overview'?clearDynamic():showIntel(b.dataset.tab));
$$('[data-scroll]').forEach(a=>a.onclick=()=>document.getElementById(a.dataset.scroll)?.scrollIntoView());
async function countrySearch(q){q=String(q||'').trim();if(!q)return;try{const r=await fetch(`${CFG.REST_COUNTRIES_BASE}/name/${encodeURIComponent(q)}?fullText=true`);const j=await r.json();if(Array.isArray(j)&&j[0]){loadCountry(j[0].cca2);document.getElementById('countrySection').scrollIntoView()}}catch(e){}}
$('#countrySearch').addEventListener('keydown',e=>{if(e.key==='Enter')countrySearch(e.target.value)});$('#globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter')countrySearch(e.target.value)});
renderProfile();initMap();loadCountry(selectedCode);