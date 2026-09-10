/* Travel AI — application logic
   BUILD 4.3.1 — traveller platform, single file (hardened database runtime).

   Everything the app needs is in here: the 250-country dataset, the India
   boundary polygon, and all view logic. No separate data file to upload.

   Country dataset: mledoze/countries (MPL-2.0) + dr5hn/countries-states-cities-database (ODbL).
   India boundary : datameet/maps india-composite (full claimed boundary, including
                    Jammu & Kashmir, Ladakh, Aksai Chin and Arunachal Pradesh),
                    simplified for web rendering. */

'use strict';

const BUILD = '4.3.1';

/* ---- embedded country dataset (250 territories) ---- */
const TRAVEL_COUNTRIES = [{"name":{"common":"Afghanistan","official":"Islamic Republic of Afghanistan"},"cca2":"AF","cca3":"AFG","flag":"🇦🇫","capital":["Kabul"],"currencies":{"AFN":{"name":"Afghan afghani","symbol":"؋"}},"languages":{"prs":"Dari","pus":"Pashto","tuk":"Turkmen"},"population":43844000,"timezones":["UTC+04:30"],"idd":{"root":"+9","suffixes":["3"]},"car":{"side":"right"},"region":"Asia","subregion":"Southern Asia","continents":["Asia"],"area":652230,"latlng":[33,65],"altSpellings":["Afġānistān","افغانستان"],"callingCode":"+93"},{"name":{"common":"Albania","official":"Republic of Albania"},"cca2":"AL","cca3":"ALB","flag":"🇦🇱","capital":["Tirana"],"currencies":{"ALL":{"name":"Albanian lek","symbol":"L"}},"languages":{"sqi":"Albanian"},"population":2363314,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["55"]},"car":{"side":"right"},"region":"Europe","subregion":"Southeast Europe","continents":["Europe"],"area":28748,"latlng":[41,20],"altSpellings":["Shqipëri","Shqipëria","Shqipnia"],"callingCode":"+355"},{"name":{"common":"Algeria","official":"People's Democratic Republic of Algeria"},"cca2":"DZ","cca3":"DZA","flag":"🇩🇿","capital":["Algiers"],"currencies":{"DZD":{"name":"Algerian dinar","symbol":"د.ج"}},"languages":{"ara":"Arabic"},"population":47400000,"timezones":["UTC+01:00"],"idd":{"root":"+2","suffixes":["13"]},"car":{"side":"right"},"region":"Africa","subregion":"Northern Africa","continents":["Africa"],"area":2381741,"latlng":[28,3],"altSpellings":["Dzayer","Algérie","الجزائر"],"callingCode":"+213"},{"name":{"common":"American Samoa","official":"American Samoa"},"cca2":"AS","cca3":"ASM","flag":"🇦🇸","capital":["Pago Pago"],"currencies":{"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"eng":"English","smo":"Samoan"},"population":49710,"timezones":["UTC-11:00"],"idd":{"root":"+1","suffixes":["684"]},"car":{"side":"right"},"region":"Oceania","subregion":"Polynesia","continents":["Oceania"],"area":199,"latlng":[-14.33333333,-170],"altSpellings":["Amerika Sāmoa","Amelika Sāmoa","Sāmoa Amelika","American Samoa"],"callingCode":"+1684"},{"name":{"common":"Andorra","official":"Principality of Andorra"},"cca2":"AD","cca3":"AND","flag":"🇦🇩","capital":["Andorra la Vella"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"cat":"Catalan"},"population":88306,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["76"]},"car":{"side":"right"},"region":"Europe","subregion":"Southern Europe","continents":["Europe"],"area":468,"latlng":[42.5,1.5],"altSpellings":["Principality of Andorra","Principat d'Andorra","Andorra"],"callingCode":"+376"},{"name":{"common":"Angola","official":"Republic of Angola"},"cca2":"AO","cca3":"AGO","flag":"🇦🇴","capital":["Luanda"],"currencies":{"AOA":{"name":"Angolan kwanza","symbol":"Kz"}},"languages":{"por":"Portuguese"},"population":36170961,"timezones":["UTC+01:00"],"idd":{"root":"+2","suffixes":["44"]},"car":{"side":"right"},"region":"Africa","subregion":"Middle Africa","continents":["Africa"],"area":1246700,"latlng":[-12.5,18.5],"altSpellings":["República de Angola","ʁɛpublika de an'ɡɔla","Angola"],"callingCode":"+244"},{"name":{"common":"Anguilla","official":"Anguilla"},"cca2":"AI","cca3":"AIA","flag":"🇦🇮","capital":["The Valley"],"currencies":{"XCD":{"name":"Eastern Caribbean dollar","symbol":"$"}},"languages":{"eng":"English"},"population":16010,"timezones":["UTC-04:00"],"idd":{"root":"+1","suffixes":["264"]},"car":{"side":"left"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":91,"latlng":[18.25,-63.16666666],"altSpellings":["Anguilla"],"callingCode":"+1264"},{"name":{"common":"Antarctica","official":"Antarctica"},"cca2":"AQ","cca3":"ATA","flag":"🇦🇶","capital":[],"currencies":{"AAD":{"name":"Antarctican dollar","symbol":"$"}},"languages":{},"population":0,"timezones":["UTC-03:00","UTC±00","UTC+03:00","UTC+05:00","UTC+06:00","UTC+07:00","UTC+10:00","UTC+11:00","UTC+13:00"],"idd":{"root":"+672","suffixes":[""]},"car":{"side":"right"},"region":"Antarctic","subregion":"","continents":["Antarctica"],"area":14000000,"latlng":[-90,0],"altSpellings":["Antarctica"],"callingCode":"+672"},{"name":{"common":"Antigua and Barbuda","official":"Antigua and Barbuda"},"cca2":"AG","cca3":"ATG","flag":"🇦🇬","capital":["Saint John's"],"currencies":{"XCD":{"name":"Eastern Caribbean dollar","symbol":"$"}},"languages":{"eng":"English"},"population":103603,"timezones":["UTC-04:00"],"idd":{"root":"+1","suffixes":["268"]},"car":{"side":"left"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":442,"latlng":[17.05,-61.8],"altSpellings":["Antigua and Barbuda"],"callingCode":"+1268"},{"name":{"common":"Argentina","official":"Argentine Republic"},"cca2":"AR","cca3":"ARG","flag":"🇦🇷","capital":["Buenos Aires"],"currencies":{"ARS":{"name":"Argentine peso","symbol":"$"}},"languages":{"grn":"Guaraní","spa":"Spanish"},"population":46735004,"timezones":["UTC-03:00"],"idd":{"root":"+5","suffixes":["4"]},"car":{"side":"right"},"region":"Americas","subregion":"South America","continents":["South America"],"area":2780400,"latlng":[-34,-64],"altSpellings":["Argentine Republic","República Argentina","Argentina"],"callingCode":"+54"},{"name":{"common":"Armenia","official":"Republic of Armenia"},"cca2":"AM","cca3":"ARM","flag":"🇦🇲","capital":["Yerevan"],"currencies":{"AMD":{"name":"Armenian dram","symbol":"֏"}},"languages":{"hye":"Armenian"},"population":3081100,"timezones":["UTC+04:00"],"idd":{"root":"+3","suffixes":["74"]},"car":{"side":"right"},"region":"Asia","subregion":"Western Asia","continents":["Asia"],"area":29743,"latlng":[40,45],"altSpellings":["Hayastan","Republic of Armenia","Հայաստանի Հանրապետություն","Հայաստան"],"callingCode":"+374"},{"name":{"common":"Aruba","official":"Aruba"},"cca2":"AW","cca3":"ABW","flag":"🇦🇼","capital":["Oranjestad"],"currencies":{"AWG":{"name":"Aruban florin","symbol":"ƒ"}},"languages":{"nld":"Dutch","pap":"Papiamento"},"population":107566,"timezones":["UTC-04:00"],"idd":{"root":"+2","suffixes":["97"]},"car":{"side":"right"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":180,"latlng":[12.5,-69.96666666],"altSpellings":["Aruba"],"callingCode":"+297"},{"name":{"common":"Australia","official":"Commonwealth of Australia"},"cca2":"AU","cca3":"AUS","flag":"🇦🇺","capital":["Canberra"],"currencies":{"AUD":{"name":"Australian dollar","symbol":"$"}},"languages":{"eng":"English"},"population":27400013,"timezones":["UTC+08:00","UTC+08:45","UTC+09:30","UTC+10:00","UTC+10:30","UTC+11:00"],"idd":{"root":"+6","suffixes":["1"]},"car":{"side":"left"},"region":"Oceania","subregion":"Australia and New Zealand","continents":["Oceania"],"area":7692024,"latlng":[-27,133],"altSpellings":["Australia"],"callingCode":"+61"},{"name":{"common":"Austria","official":"Republic of Austria"},"cca2":"AT","cca3":"AUT","flag":"🇦🇹","capital":["Vienna"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"bar":"Austro-Bavarian German"},"population":9200931,"timezones":["UTC+01:00"],"idd":{"root":"+4","suffixes":["3"]},"car":{"side":"right"},"region":"Europe","subregion":"Central Europe","continents":["Europe"],"area":83871,"latlng":[47.33333333,13.33333333],"altSpellings":["Osterreich","Oesterreich","Österreich"],"callingCode":"+43"},{"name":{"common":"Azerbaijan","official":"Republic of Azerbaijan"},"cca2":"AZ","cca3":"AZE","flag":"🇦🇿","capital":["Baku"],"currencies":{"AZN":{"name":"Azerbaijani manat","symbol":"₼"}},"languages":{"aze":"Azerbaijani","rus":"Russian"},"population":10241722,"timezones":["UTC+04:00"],"idd":{"root":"+9","suffixes":["94"]},"car":{"side":"right"},"region":"Asia","subregion":"Western Asia","continents":["Asia"],"area":86600,"latlng":[40.5,47.5],"altSpellings":["Republic of Azerbaijan","Azərbaycan Respublikası","Azərbaycan"],"callingCode":"+994"},{"name":{"common":"Bahamas","official":"Commonwealth of the Bahamas"},"cca2":"BS","cca3":"BHS","flag":"🇧🇸","capital":["Nassau"],"currencies":{"BSD":{"name":"Bahamian dollar","symbol":"$"},"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"eng":"English"},"population":398165,"timezones":["UTC-05:00"],"idd":{"root":"+1","suffixes":["242"]},"car":{"side":"left"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":13943,"latlng":[24.25,-76],"altSpellings":["Commonwealth of the Bahamas","Bahamas"],"callingCode":"+1242"},{"name":{"common":"Bahrain","official":"Kingdom of Bahrain"},"cca2":"BH","cca3":"BHR","flag":"🇧🇭","capital":["Manama"],"currencies":{"BHD":{"name":"Bahraini dinar","symbol":".د.ب"}},"languages":{"ara":"Arabic"},"population":1594654,"timezones":["UTC+03:00"],"idd":{"root":"+9","suffixes":["73"]},"car":{"side":"right"},"region":"Asia","subregion":"Western Asia","continents":["Asia"],"area":765,"latlng":[26,50.55],"altSpellings":["Kingdom of Bahrain","Mamlakat al-Baḥrayn","‏البحرين"],"callingCode":"+973"},{"name":{"common":"Bangladesh","official":"People's Republic of Bangladesh"},"cca2":"BD","cca3":"BGD","flag":"🇧🇩","capital":["Dhaka"],"currencies":{"BDT":{"name":"Bangladeshi taka","symbol":"৳"}},"languages":{"ben":"Bengali"},"population":169828911,"timezones":["UTC+06:00"],"idd":{"root":"+8","suffixes":["80"]},"car":{"side":"left"},"region":"Asia","subregion":"Southern Asia","continents":["Asia"],"area":147570,"latlng":[24,90],"altSpellings":["People's Republic of Bangladesh","Gônôprôjatôntri Bangladesh","Bangladesh"],"callingCode":"+880"},{"name":{"common":"Barbados","official":"Barbados"},"cca2":"BB","cca3":"BRB","flag":"🇧🇧","capital":["Bridgetown"],"currencies":{"BBD":{"name":"Barbadian dollar","symbol":"$"}},"languages":{"eng":"English"},"population":267800,"timezones":["UTC-04:00"],"idd":{"root":"+1","suffixes":["246"]},"car":{"side":"left"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":430,"latlng":[13.16666666,-59.53333333],"altSpellings":["Barbados"],"callingCode":"+1246"},{"name":{"common":"Belarus","official":"Republic of Belarus"},"cca2":"BY","cca3":"BLR","flag":"🇧🇾","capital":["Minsk"],"currencies":{"BYN":{"name":"Belarusian ruble","symbol":"Br"}},"languages":{"bel":"Belarusian","rus":"Russian"},"population":9109280,"timezones":["UTC+03:00"],"idd":{"root":"+3","suffixes":["75"]},"car":{"side":"right"},"region":"Europe","subregion":"Eastern Europe","continents":["Europe"],"area":207600,"latlng":[53,28],"altSpellings":["Bielaruś","Republic of Belarus","Белоруссия","Республика Белоруссия","Белару́сь"],"callingCode":"+375"},{"name":{"common":"Belgium","official":"Kingdom of Belgium"},"cca2":"BE","cca3":"BEL","flag":"🇧🇪","capital":["Brussels"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"deu":"German","fra":"French","nld":"Dutch"},"population":11825551,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["2"]},"car":{"side":"right"},"region":"Europe","subregion":"Western Europe","continents":["Europe"],"area":30528,"latlng":[50.83333333,4],"altSpellings":["België","Belgie","Belgien","Belgique","Kingdom of Belgium"],"callingCode":"+32"},{"name":{"common":"Belize","official":"Belize"},"cca2":"BZ","cca3":"BLZ","flag":"🇧🇿","capital":["Belmopan"],"currencies":{"BZD":{"name":"Belize dollar","symbol":"$"}},"languages":{"bjz":"Belizean Creole","eng":"English","spa":"Spanish"},"population":417634,"timezones":["UTC-06:00"],"idd":{"root":"+5","suffixes":["01"]},"car":{"side":"right"},"region":"Americas","subregion":"Central America","continents":["North America"],"area":22966,"latlng":[17.25,-88.75],"altSpellings":["Belize"],"callingCode":"+501"},{"name":{"common":"Benin","official":"Republic of Benin"},"cca2":"BJ","cca3":"BEN","flag":"🇧🇯","capital":["Porto-Novo"],"currencies":{"XOF":{"name":"West African CFA franc","symbol":"Fr"}},"languages":{"fra":"French"},"population":13224860,"timezones":["UTC+01:00"],"idd":{"root":"+2","suffixes":["29"]},"car":{"side":"right"},"region":"Africa","subregion":"Western Africa","continents":["Africa"],"area":112622,"latlng":[9.5,2.25],"altSpellings":["Republic of Benin","République du Bénin","Bénin"],"callingCode":"+229"},{"name":{"common":"Bermuda","official":"Bermuda"},"cca2":"BM","cca3":"BMU","flag":"🇧🇲","capital":["Hamilton"],"currencies":{"BMD":{"name":"Bermudian dollar","symbol":"$"}},"languages":{"eng":"English"},"population":64055,"timezones":["UTC-04:00"],"idd":{"root":"+1","suffixes":["441"]},"car":{"side":"left"},"region":"Americas","subregion":"North America","continents":["North America"],"area":54,"latlng":[32.33333333,-64.75],"altSpellings":["The Islands of Bermuda","The Bermudas","Somers Isles","Bermuda"],"callingCode":"+1441"},{"name":{"common":"Bhutan","official":"Kingdom of Bhutan"},"cca2":"BT","cca3":"BTN","flag":"🇧🇹","capital":["Thimphu"],"currencies":{"BTN":{"name":"Bhutanese ngultrum","symbol":"Nu."},"INR":{"name":"Indian rupee","symbol":"₹"}},"languages":{"dzo":"Dzongkha"},"population":784043,"timezones":["UTC+06:00"],"idd":{"root":"+9","suffixes":["75"]},"car":{"side":"left"},"region":"Asia","subregion":"Southern Asia","continents":["Asia"],"area":38394,"latlng":[27.5,90.5],"altSpellings":["Kingdom of Bhutan","ʼbrug-yul"],"callingCode":"+975"},{"name":{"common":"Bolivia","official":"Plurinational State of Bolivia"},"cca2":"BO","cca3":"BOL","flag":"🇧🇴","capital":["Sucre"],"currencies":{"BOB":{"name":"Bolivian boliviano","symbol":"Bs."}},"languages":{"aym":"Aymara","grn":"Guaraní","que":"Quechua","spa":"Spanish"},"population":11312620,"timezones":["UTC-04:00"],"idd":{"root":"+5","suffixes":["91"]},"car":{"side":"right"},"region":"Americas","subregion":"South America","continents":["South America"],"area":1098581,"latlng":[-17,-65],"altSpellings":["Buliwya","Wuliwya","Bolivia, Plurinational State of","Plurinational State of Bolivia","Estado Plurinacional de Bolivia","Bolivia"],"callingCode":"+591"},{"name":{"common":"Bosnia and Herzegovina","official":"Bosnia and Herzegovina"},"cca2":"BA","cca3":"BIH","flag":"🇧🇦","capital":["Sarajevo"],"currencies":{"BAM":{"name":"Bosnia and Herzegovina convertible mark","symbol":"KM"}},"languages":{"bos":"Bosnian","hrv":"Croatian","srp":"Serbian"},"population":3422000,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["87"]},"car":{"side":"right"},"region":"Europe","subregion":"Southeast Europe","continents":["Europe"],"area":51209,"latlng":[44,18],"altSpellings":["Bosnia-Herzegovina","Босна и Херцеговина","Bosna i Hercegovina"],"callingCode":"+387"},{"name":{"common":"Botswana","official":"Republic of Botswana"},"cca2":"BW","cca3":"BWA","flag":"🇧🇼","capital":["Gaborone"],"currencies":{"BWP":{"name":"Botswana pula","symbol":"P"}},"languages":{"eng":"English","tsn":"Tswana"},"population":2359609,"timezones":["UTC+02:00"],"idd":{"root":"+2","suffixes":["67"]},"car":{"side":"left"},"region":"Africa","subregion":"Southern Africa","continents":["Africa"],"area":582000,"latlng":[-22,24],"altSpellings":["Republic of Botswana","Lefatshe la Botswana","Botswana"],"callingCode":"+267"},{"name":{"common":"Bouvet Island","official":"Bouvet Island"},"cca2":"BV","cca3":"BVT","flag":"🇧🇻","capital":[],"currencies":{"NOK":{"name":"Norwegian krone","symbol":"ko"}},"languages":{"nor":"Norwegian"},"population":0,"timezones":["UTC+01:00"],"idd":{"root":"+4","suffixes":["7"]},"car":{"side":"right"},"region":"Antarctic","subregion":"","continents":["Antarctica"],"area":49,"latlng":[-54.43333333,3.4],"altSpellings":["Bouvetøya","Bouvet-øya"],"callingCode":"+47"},{"name":{"common":"Brazil","official":"Federative Republic of Brazil"},"cca2":"BR","cca3":"BRA","flag":"🇧🇷","capital":["Brasília"],"currencies":{"BRL":{"name":"Brazilian real","symbol":"R$"}},"languages":{"por":"Portuguese"},"population":213421037,"timezones":["UTC-05:00","UTC-04:00","UTC-03:00","UTC-02:00"],"idd":{"root":"+5","suffixes":["5"]},"car":{"side":"right"},"region":"Americas","subregion":"South America","continents":["South America"],"area":8515767,"latlng":[-10,-55],"altSpellings":["Brasil","Federative Republic of Brazil","República Federativa do Brasil"],"callingCode":"+55"},{"name":{"common":"British Indian Ocean Territory","official":"British Indian Ocean Territory"},"cca2":"IO","cca3":"IOT","flag":"🇮🇴","capital":["Diego Garcia"],"currencies":{"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"eng":"English"},"population":0,"timezones":["UTC+06:00"],"idd":{"root":"+2","suffixes":["46"]},"car":{"side":"right"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":60,"latlng":[-6,71.5],"altSpellings":["British Indian Ocean Territory"],"callingCode":"+246"},{"name":{"common":"British Virgin Islands","official":"Virgin Islands"},"cca2":"VG","cca3":"VGB","flag":"🇻🇬","capital":["Road Town"],"currencies":{"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"eng":"English"},"population":39471,"timezones":["UTC-04:00"],"idd":{"root":"+1","suffixes":["284"]},"car":{"side":"left"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":151,"latlng":[18.431383,-64.62305],"altSpellings":["Virgin Islands, British","British Virgin Islands"],"callingCode":"+1284"},{"name":{"common":"Brunei","official":"Nation of Brunei, Abode of Peace"},"cca2":"BN","cca3":"BRN","flag":"🇧🇳","capital":["Bandar Seri Begawan"],"currencies":{"BND":{"name":"Brunei dollar","symbol":"$"},"SGD":{"name":"Singapore dollar","symbol":"$"}},"languages":{"msa":"Malay"},"population":455500,"timezones":["UTC+08:00"],"idd":{"root":"+6","suffixes":["73"]},"car":{"side":"left"},"region":"Asia","subregion":"South-Eastern Asia","continents":["Asia"],"area":5765,"latlng":[4.5,114.66666666],"altSpellings":["Brunei Darussalam","Nation of Brunei","the Abode of Peace","Negara Brunei Darussalam"],"callingCode":"+673"},{"name":{"common":"Bulgaria","official":"Republic of Bulgaria"},"cca2":"BG","cca3":"BGR","flag":"🇧🇬","capital":["Sofia"],"currencies":{"BGN":{"name":"Bulgarian lev","symbol":"лв"}},"languages":{"bul":"Bulgarian"},"population":6437360,"timezones":["UTC+02:00"],"idd":{"root":"+3","suffixes":["59"]},"car":{"side":"right"},"region":"Europe","subregion":"Southeast Europe","continents":["Europe"],"area":110879,"latlng":[43,25],"altSpellings":["Republic of Bulgaria","Република България","България"],"callingCode":"+359"},{"name":{"common":"Burkina Faso","official":"Burkina Faso"},"cca2":"BF","cca3":"BFA","flag":"🇧🇫","capital":["Ouagadougou"],"currencies":{"XOF":{"name":"West African CFA franc","symbol":"Fr"}},"languages":{"fra":"French"},"population":24070553,"timezones":["UTC±00"],"idd":{"root":"+2","suffixes":["26"]},"car":{"side":"right"},"region":"Africa","subregion":"Western Africa","continents":["Africa"],"area":272967,"latlng":[13,-2],"altSpellings":["Burkina Faso"],"callingCode":"+226"},{"name":{"common":"Burundi","official":"Republic of Burundi"},"cca2":"BI","cca3":"BDI","flag":"🇧🇮","capital":["Gitega"],"currencies":{"BIF":{"name":"Burundian franc","symbol":"Fr"}},"languages":{"fra":"French","run":"Kirundi"},"population":12332788,"timezones":["UTC+02:00"],"idd":{"root":"+2","suffixes":["57"]},"car":{"side":"right"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":27834,"latlng":[-3.5,30],"altSpellings":["Republic of Burundi","Republika y'Uburundi","République du Burundi","Burundi"],"callingCode":"+257"},{"name":{"common":"Cambodia","official":"Kingdom of Cambodia"},"cca2":"KH","cca3":"KHM","flag":"🇰🇭","capital":["Phnom Penh"],"currencies":{"KHR":{"name":"Cambodian riel","symbol":"៛"},"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"khm":"Khmer"},"population":17577760,"timezones":["UTC+07:00"],"idd":{"root":"+8","suffixes":["55"]},"car":{"side":"right"},"region":"Asia","subregion":"South-Eastern Asia","continents":["Asia"],"area":181035,"latlng":[13,105],"altSpellings":["Kingdom of Cambodia","Kâmpŭchéa"],"callingCode":"+855"},{"name":{"common":"Cameroon","official":"Republic of Cameroon"},"cca2":"CM","cca3":"CMR","flag":"🇨🇲","capital":["Yaoundé"],"currencies":{"XAF":{"name":"Central African CFA franc","symbol":"Fr"}},"languages":{"eng":"English","fra":"French"},"population":29442327,"timezones":["UTC+01:00"],"idd":{"root":"+2","suffixes":["37"]},"car":{"side":"right"},"region":"Africa","subregion":"Middle Africa","continents":["Africa"],"area":475442,"latlng":[6,12],"altSpellings":["Republic of Cameroon","République du Cameroun","Cameroon"],"callingCode":"+237"},{"name":{"common":"Canada","official":"Canada"},"cca2":"CA","cca3":"CAN","flag":"🇨🇦","capital":["Ottawa"],"currencies":{"CAD":{"name":"Canadian dollar","symbol":"$"}},"languages":{"eng":"English","fra":"French"},"population":41548787,"timezones":["UTC-08:00","UTC-07:00","UTC-06:00","UTC-05:00","UTC-04:00","UTC-03:30"],"idd":{"root":"+1","suffixes":["204","226","236","249","250","263","289","306","343","354","365","367","368","382","387","403","416","418","428","431","437","438","450","468","474","506","514","519","548","579","581","584","587","600","604","613","622","633","639","644","647","655","672","677","683","688","705","709","742","753","778","780","782","807","819","825","867","873","879","902","905","942"]},"car":{"side":"right"},"region":"Americas","subregion":"North America","continents":["North America"],"area":9984670,"latlng":[60,-95],"altSpellings":["Canada"],"callingCode":"+1"},{"name":{"common":"Cape Verde","official":"Republic of Cabo Verde"},"cca2":"CV","cca3":"CPV","flag":"🇨🇻","capital":["Praia"],"currencies":{"CVE":{"name":"Cape Verdean escudo","symbol":"Esc"}},"languages":{"por":"Portuguese"},"population":491233,"timezones":["UTC-01:00"],"idd":{"root":"+2","suffixes":["38"]},"car":{"side":"right"},"region":"Africa","subregion":"Western Africa","continents":["Africa"],"area":4033,"latlng":[16,-24],"altSpellings":["Republic of Cabo Verde","República de Cabo Verde","Cabo Verde"],"callingCode":"+238"},{"name":{"common":"Caribbean Netherlands","official":"Bonaire, Sint Eustatius and Saba"},"cca2":"BQ","cca3":"BES","flag":"🇧🇶","capital":["Kralendijk","Oranjestad","The Bottom"],"currencies":{"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"eng":"English","nld":"Dutch","pap":"Papiamento"},"population":26552,"timezones":["UTC-04:00"],"idd":{"root":"+5","suffixes":["99"]},"car":{"side":"right"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":328,"latlng":[12.18,-68.25],"altSpellings":["BES islands","Bonaire Sint Eustatius and Saba","Caribisch Nederland"],"callingCode":"+599"},{"name":{"common":"Cayman Islands","official":"Cayman Islands"},"cca2":"KY","cca3":"CYM","flag":"🇰🇾","capital":["George Town"],"currencies":{"KYD":{"name":"Cayman Islands dollar","symbol":"$"}},"languages":{"eng":"English"},"population":84738,"timezones":["UTC-05:00"],"idd":{"root":"+1","suffixes":["345"]},"car":{"side":"left"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":264,"latlng":[19.5,-80.5],"altSpellings":["Cayman Islands"],"callingCode":"+1345"},{"name":{"common":"Central African Republic","official":"Central African Republic"},"cca2":"CF","cca3":"CAF","flag":"🇨🇫","capital":["Bangui"],"currencies":{"XAF":{"name":"Central African CFA franc","symbol":"Fr"}},"languages":{"fra":"French","sag":"Sango"},"population":6470307,"timezones":["UTC+01:00"],"idd":{"root":"+2","suffixes":["36"]},"car":{"side":"right"},"region":"Africa","subregion":"Middle Africa","continents":["Africa"],"area":622984,"latlng":[7,21],"altSpellings":["Central African Republic","République centrafricaine","Ködörösêse tî Bêafrîka"],"callingCode":"+236"},{"name":{"common":"Chad","official":"Republic of Chad"},"cca2":"TD","cca3":"TCD","flag":"🇹🇩","capital":["N'Djamena"],"currencies":{"XAF":{"name":"Central African CFA franc","symbol":"Fr"}},"languages":{"ara":"Arabic","fra":"French"},"population":19340757,"timezones":["UTC+01:00"],"idd":{"root":"+2","suffixes":["35"]},"car":{"side":"right"},"region":"Africa","subregion":"Middle Africa","continents":["Africa"],"area":1284000,"latlng":[15,19],"altSpellings":["Tchad","Republic of Chad","République du Tchad"],"callingCode":"+235"},{"name":{"common":"Chile","official":"Republic of Chile"},"cca2":"CL","cca3":"CHL","flag":"🇨🇱","capital":["Santiago"],"currencies":{"CLP":{"name":"Chilean peso","symbol":"$"}},"languages":{"spa":"Spanish"},"population":20206953,"timezones":["UTC-05:00","UTC-03:00"],"idd":{"root":"+5","suffixes":["6"]},"car":{"side":"right"},"region":"Americas","subregion":"South America","continents":["South America"],"area":756102,"latlng":[-30,-71],"altSpellings":["Republic of Chile","República de Chile","Chile"],"callingCode":"+56"},{"name":{"common":"China","official":"People's Republic of China"},"cca2":"CN","cca3":"CHN","flag":"🇨🇳","capital":["Beijing"],"currencies":{"CNY":{"name":"Chinese yuan","symbol":"¥"}},"languages":{"zho":"Chinese"},"population":1408280000,"timezones":["UTC+06:00","UTC+08:00"],"idd":{"root":"+8","suffixes":["6"]},"car":{"side":"right"},"region":"Asia","subregion":"Eastern Asia","continents":["Asia"],"area":9706961,"latlng":[35,105],"altSpellings":["Zhōngguó","Zhongguo","Zhonghua","People's Republic of China","中华人民共和国","中国"],"callingCode":"+86"},{"name":{"common":"Christmas Island","official":"Territory of Christmas Island"},"cca2":"CX","cca3":"CXR","flag":"🇨🇽","capital":["Flying Fish Cove"],"currencies":{"AUD":{"name":"Australian dollar","symbol":"$"}},"languages":{"eng":"English"},"population":1692,"timezones":["UTC+07:00"],"idd":{"root":"+6","suffixes":["1"]},"car":{"side":"left"},"region":"Oceania","subregion":"Australia and New Zealand","continents":["Oceania"],"area":135,"latlng":[-10.5,105.66666666],"altSpellings":["Territory of Christmas Island","Christmas Island"],"callingCode":"+61"},{"name":{"common":"Cocos (Keeling) Islands","official":"Territory of the Cocos (Keeling) Islands"},"cca2":"CC","cca3":"CCK","flag":"🇨🇨","capital":["West Island"],"currencies":{"AUD":{"name":"Australian dollar","symbol":"$"}},"languages":{"eng":"English"},"population":593,"timezones":["UTC+06:30"],"idd":{"root":"+6","suffixes":["1"]},"car":{"side":"left"},"region":"Oceania","subregion":"Australia and New Zealand","continents":["Oceania"],"area":14,"latlng":[-12.5,96.83333333],"altSpellings":["Keeling Islands","Cocos Islands","Cocos (Keeling) Islands"],"callingCode":"+61"},{"name":{"common":"Colombia","official":"Republic of Colombia"},"cca2":"CO","cca3":"COL","flag":"🇨🇴","capital":["Bogotá"],"currencies":{"COP":{"name":"Colombian peso","symbol":"$"}},"languages":{"spa":"Spanish"},"population":53057212,"timezones":["UTC-05:00"],"idd":{"root":"+5","suffixes":["7"]},"car":{"side":"right"},"region":"Americas","subregion":"South America","continents":["South America"],"area":1141748,"latlng":[4,-72],"altSpellings":["Republic of Colombia","República de Colombia","Colombia"],"callingCode":"+57"},{"name":{"common":"Comoros","official":"Union of the Comoros"},"cca2":"KM","cca3":"COM","flag":"🇰🇲","capital":["Moroni"],"currencies":{"KMF":{"name":"Comorian franc","symbol":"Fr"}},"languages":{"ara":"Arabic","fra":"French","zdj":"Comorian"},"population":870038,"timezones":["UTC+03:00"],"idd":{"root":"+2","suffixes":["69"]},"car":{"side":"right"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":1862,"latlng":[-12.16666666,44.25],"altSpellings":["Union of the Comoros","Union des Comores","Udzima wa Komori","al-Ittiḥād al-Qumurī","Komori"],"callingCode":"+269"},{"name":{"common":"Cook Islands","official":"Cook Islands"},"cca2":"CK","cca3":"COK","flag":"🇨🇰","capital":["Avarua"],"currencies":{"CKD":{"name":"Cook Islands dollar","symbol":"$"},"NZD":{"name":"New Zealand dollar","symbol":"$"}},"languages":{"eng":"English","rar":"Cook Islands Māori"},"population":15040,"timezones":["UTC-10:00"],"idd":{"root":"+6","suffixes":["82"]},"car":{"side":"left"},"region":"Oceania","subregion":"Polynesia","continents":["Oceania"],"area":236,"latlng":[-21.23333333,-159.76666666],"altSpellings":["Kūki 'Āirani","Cook Islands"],"callingCode":"+682"},{"name":{"common":"Costa Rica","official":"Republic of Costa Rica"},"cca2":"CR","cca3":"CRI","flag":"🇨🇷","capital":["San José"],"currencies":{"CRC":{"name":"Costa Rican colón","symbol":"₡"}},"languages":{"spa":"Spanish"},"population":5309625,"timezones":["UTC-06:00"],"idd":{"root":"+5","suffixes":["06"]},"car":{"side":"right"},"region":"Americas","subregion":"Central America","continents":["North America"],"area":51100,"latlng":[10,-84],"altSpellings":["Republic of Costa Rica","República de Costa Rica","Costa Rica"],"callingCode":"+506"},{"name":{"common":"Croatia","official":"Republic of Croatia"},"cca2":"HR","cca3":"HRV","flag":"🇭🇷","capital":["Zagreb"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"hrv":"Croatian"},"population":3866233,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["85"]},"car":{"side":"right"},"region":"Europe","subregion":"Southeast Europe","continents":["Europe"],"area":56594,"latlng":[45.16666666,15.5],"altSpellings":["Hrvatska","Republic of Croatia","Republika Hrvatska"],"callingCode":"+385"},{"name":{"common":"Cuba","official":"Republic of Cuba"},"cca2":"CU","cca3":"CUB","flag":"🇨🇺","capital":["Havana"],"currencies":{"CUC":{"name":"Cuban convertible peso","symbol":"$"},"CUP":{"name":"Cuban peso","symbol":"$"}},"languages":{"spa":"Spanish"},"population":9748007,"timezones":["UTC-05:00"],"idd":{"root":"+5","suffixes":["3"]},"car":{"side":"right"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":109884,"latlng":[21.5,-80],"altSpellings":["Republic of Cuba","República de Cuba","Cuba"],"callingCode":"+53"},{"name":{"common":"Curaçao","official":"Country of Curaçao"},"cca2":"CW","cca3":"CUW","flag":"🇨🇼","capital":["Willemstad"],"currencies":{"ANG":{"name":"Netherlands Antillean guilder","symbol":"ƒ"}},"languages":{"eng":"English","nld":"Dutch","pap":"Papiamento"},"population":156115,"timezones":["UTC-04:00"],"idd":{"root":"+5","suffixes":["99"]},"car":{"side":"right"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":444,"latlng":[12.116667,-68.933333],"altSpellings":["Curacao","Kòrsou","Country of Curaçao","Land Curaçao","Pais Kòrsou","Curaçao"],"callingCode":"+599"},{"name":{"common":"Cyprus","official":"Republic of Cyprus"},"cca2":"CY","cca3":"CYP","flag":"🇨🇾","capital":["Nicosia"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"ell":"Greek","tur":"Turkish"},"population":966400,"timezones":["UTC+02:00"],"idd":{"root":"+3","suffixes":["57"]},"car":{"side":"left"},"region":"Europe","subregion":"Southern Europe","continents":["Europe"],"area":9251,"latlng":[35,33],"altSpellings":["Kýpros","Kıbrıs","Republic of Cyprus","Κυπριακή Δημοκρατία","Kıbrıs Cumhuriyeti","Κύπρος"],"callingCode":"+357"},{"name":{"common":"Czechia","official":"Czech Republic"},"cca2":"CZ","cca3":"CZE","flag":"🇨🇿","capital":["Prague"],"currencies":{"CZK":{"name":"Czech koruna","symbol":"Kč"}},"languages":{"ces":"Czech","slk":"Slovak"},"population":10876875,"timezones":["UTC+01:00"],"idd":{"root":"+4","suffixes":["20"]},"car":{"side":"right"},"region":"Europe","subregion":"Central Europe","continents":["Europe"],"area":78865,"latlng":[49.75,15.5],"altSpellings":["Česká republika","Česko"],"callingCode":"+420"},{"name":{"common":"DR Congo","official":"Democratic Republic of the Congo"},"cca2":"CD","cca3":"COD","flag":"🇨🇩","capital":["Kinshasa"],"currencies":{"CDF":{"name":"Congolese franc","symbol":"FC"}},"languages":{"fra":"French","kon":"Kikongo","lin":"Lingala","lua":"Tshiluba","swa":"Swahili"},"population":112832000,"timezones":["UTC+01:00","UTC+02:00"],"idd":{"root":"+2","suffixes":["43"]},"car":{"side":"right"},"region":"Africa","subregion":"Middle Africa","continents":["Africa"],"area":2344858,"latlng":[0,25],"altSpellings":["DR Congo","Congo-Kinshasa","Congo, the Democratic Republic of the","Democratic Republic of Congo","DRC","République démocratique du Congo"],"callingCode":"+243"},{"name":{"common":"Denmark","official":"Kingdom of Denmark"},"cca2":"DK","cca3":"DNK","flag":"🇩🇰","capital":["Copenhagen"],"currencies":{"DKK":{"name":"Danish krone","symbol":"kr"}},"languages":{"dan":"Danish"},"population":6004342,"timezones":["UTC+01:00"],"idd":{"root":"+4","suffixes":["5"]},"car":{"side":"right"},"region":"Europe","subregion":"Northern Europe","continents":["Europe"],"area":43094,"latlng":[56,10],"altSpellings":["Danmark","Kingdom of Denmark","Kongeriget Danmark"],"callingCode":"+45"},{"name":{"common":"Djibouti","official":"Republic of Djibouti"},"cca2":"DJ","cca3":"DJI","flag":"🇩🇯","capital":["Djibouti"],"currencies":{"DJF":{"name":"Djiboutian franc","symbol":"Fr"}},"languages":{"ara":"Arabic","fra":"French"},"population":1066809,"timezones":["UTC+03:00"],"idd":{"root":"+2","suffixes":["53"]},"car":{"side":"right"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":23200,"latlng":[11.5,43],"altSpellings":["Jabuuti","Gabuuti","Republic of Djibouti","République de Djibouti","Gabuutih Ummuuno","Djibouti"],"callingCode":"+253"},{"name":{"common":"Dominica","official":"Commonwealth of Dominica"},"cca2":"DM","cca3":"DMA","flag":"🇩🇲","capital":["Roseau"],"currencies":{"XCD":{"name":"Eastern Caribbean dollar","symbol":"$"}},"languages":{"eng":"English"},"population":67408,"timezones":["UTC-04:00"],"idd":{"root":"+1","suffixes":["767"]},"car":{"side":"left"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":751,"latlng":[15.41666666,-61.33333333],"altSpellings":["Dominique","Wai‘tu kubuli","Commonwealth of Dominica","Dominica"],"callingCode":"+1767"},{"name":{"common":"Dominican Republic","official":"Dominican Republic"},"cca2":"DO","cca3":"DOM","flag":"🇩🇴","capital":["Santo Domingo"],"currencies":{"DOP":{"name":"Dominican peso","symbol":"$"}},"languages":{"spa":"Spanish"},"population":10771504,"timezones":["UTC-04:00"],"idd":{"root":"+1","suffixes":["809","829","849"]},"car":{"side":"right"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":48671,"latlng":[19,-70.66666666],"altSpellings":["República Dominicana"],"callingCode":"+1"},{"name":{"common":"Ecuador","official":"Republic of Ecuador"},"cca2":"EC","cca3":"ECU","flag":"🇪🇨","capital":["Quito"],"currencies":{"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"spa":"Spanish"},"population":18103660,"timezones":["UTC-06:00","UTC-05:00"],"idd":{"root":"+5","suffixes":["93"]},"car":{"side":"right"},"region":"Americas","subregion":"South America","continents":["South America"],"area":276841,"latlng":[-2,-77.5],"altSpellings":["Republic of Ecuador","República del Ecuador","Ecuador"],"callingCode":"+593"},{"name":{"common":"Egypt","official":"Arab Republic of Egypt"},"cca2":"EG","cca3":"EGY","flag":"🇪🇬","capital":["Cairo"],"currencies":{"EGP":{"name":"Egyptian pound","symbol":"£"}},"languages":{"ara":"Arabic"},"population":107271260,"timezones":["UTC+02:00"],"idd":{"root":"+2","suffixes":["0"]},"car":{"side":"right"},"region":"Africa","subregion":"Northern Africa","continents":["Africa"],"area":1002450,"latlng":[27,30],"altSpellings":["Arab Republic of Egypt","مصر‎"],"callingCode":"+20"},{"name":{"common":"El Salvador","official":"Republic of El Salvador"},"cca2":"SV","cca3":"SLV","flag":"🇸🇻","capital":["San Salvador"],"currencies":{"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"spa":"Spanish"},"population":6029976,"timezones":["UTC-06:00"],"idd":{"root":"+5","suffixes":["03"]},"car":{"side":"right"},"region":"Americas","subregion":"Central America","continents":["North America"],"area":21041,"latlng":[13.83333333,-88.91666666],"altSpellings":["Republic of El Salvador","República de El Salvador","El Salvador"],"callingCode":"+503"},{"name":{"common":"Equatorial Guinea","official":"Republic of Equatorial Guinea"},"cca2":"GQ","cca3":"GNQ","flag":"🇬🇶","capital":["Malabo"],"currencies":{"XAF":{"name":"Central African CFA franc","symbol":"Fr"}},"languages":{"fra":"French","por":"Portuguese","spa":"Spanish"},"population":1668768,"timezones":["UTC+01:00"],"idd":{"root":"+2","suffixes":["40"]},"car":{"side":"right"},"region":"Africa","subregion":"Middle Africa","continents":["Africa"],"area":28051,"latlng":[2,10],"altSpellings":["Republic of Equatorial Guinea","República de Guinea Ecuatorial","République de Guinée équatoriale","República da Guiné Equatorial","Guinea Ecuatorial"],"callingCode":"+240"},{"name":{"common":"Eritrea","official":"State of Eritrea"},"cca2":"ER","cca3":"ERI","flag":"🇪🇷","capital":["Asmara"],"currencies":{"ERN":{"name":"Eritrean nakfa","symbol":"Nfk"}},"languages":{"ara":"Arabic","eng":"English","tir":"Tigrinya"},"population":3607000,"timezones":["UTC+03:00"],"idd":{"root":"+2","suffixes":["91"]},"car":{"side":"right"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":117600,"latlng":[15,39],"altSpellings":["State of Eritrea","ሃገረ ኤርትራ","Dawlat Iritriyá","ʾErtrā","Iritriyā","ኤርትራ"],"callingCode":"+291"},{"name":{"common":"Estonia","official":"Republic of Estonia"},"cca2":"EE","cca3":"EST","flag":"🇪🇪","capital":["Tallinn"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"est":"Estonian"},"population":1369995,"timezones":["UTC+02:00"],"idd":{"root":"+3","suffixes":["72"]},"car":{"side":"right"},"region":"Europe","subregion":"Northern Europe","continents":["Europe"],"area":45227,"latlng":[59,26],"altSpellings":["Eesti","Republic of Estonia","Eesti Vabariik"],"callingCode":"+372"},{"name":{"common":"Eswatini","official":"Kingdom of Eswatini"},"cca2":"SZ","cca3":"SWZ","flag":"🇸🇿","capital":["Lobamba"],"currencies":{"SZL":{"name":"Swazi lilangeni","symbol":"L"},"ZAR":{"name":"South African rand","symbol":"R"}},"languages":{"eng":"English","ssw":"Swazi"},"population":1235549,"timezones":["UTC+02:00"],"idd":{"root":"+2","suffixes":["68"]},"car":{"side":"left"},"region":"Africa","subregion":"Southern Africa","continents":["Africa"],"area":17364,"latlng":[-26.5,31.5],"altSpellings":["Swaziland","weSwatini","Swatini","Ngwane","Kingdom of Eswatini"],"callingCode":"+268"},{"name":{"common":"Ethiopia","official":"Federal Democratic Republic of Ethiopia"},"cca2":"ET","cca3":"ETH","flag":"🇪🇹","capital":["Addis Ababa"],"currencies":{"ETB":{"name":"Ethiopian birr","symbol":"Br"}},"languages":{"amh":"Amharic"},"population":111652998,"timezones":["UTC+03:00"],"idd":{"root":"+2","suffixes":["51"]},"car":{"side":"right"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":1104300,"latlng":[8,38],"altSpellings":["ʾĪtyōṗṗyā","Federal Democratic Republic of Ethiopia","የኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ","ኢትዮጵያ"],"callingCode":"+251"},{"name":{"common":"Falkland Islands","official":"Falkland Islands"},"cca2":"FK","cca3":"FLK","flag":"🇫🇰","capital":["Stanley"],"currencies":{"FKP":{"name":"Falkland Islands pound","symbol":"£"}},"languages":{"eng":"English"},"population":3662,"timezones":["UTC-03:00"],"idd":{"root":"+5","suffixes":["00"]},"car":{"side":"left"},"region":"Americas","subregion":"South America","continents":["South America"],"area":12173,"latlng":[-51.75,-59],"altSpellings":["Islas Malvinas","Falkland Islands (Malvinas)","Falkland Islands"],"callingCode":"+500"},{"name":{"common":"Faroe Islands","official":"Faroe Islands"},"cca2":"FO","cca3":"FRO","flag":"🇫🇴","capital":["Tórshavn"],"currencies":{"DKK":{"name":"Danish krone","symbol":"kr"},"FOK":{"name":"Faroese króna","symbol":"kr"}},"languages":{"dan":"Danish","fao":"Faroese"},"population":55146,"timezones":["UTC±00"],"idd":{"root":"+2","suffixes":["98"]},"car":{"side":"right"},"region":"Europe","subregion":"Northern Europe","continents":["Europe"],"area":1393,"latlng":[62,-7],"altSpellings":["Føroyar","Færøerne","Faeroe Islands"],"callingCode":"+298"},{"name":{"common":"Fiji","official":"Republic of Fiji"},"cca2":"FJ","cca3":"FJI","flag":"🇫🇯","capital":["Suva"],"currencies":{"FJD":{"name":"Fijian dollar","symbol":"$"}},"languages":{"eng":"English","fij":"Fijian","hif":"Fiji Hindi"},"population":900869,"timezones":["UTC+12:00"],"idd":{"root":"+6","suffixes":["79"]},"car":{"side":"left"},"region":"Oceania","subregion":"Melanesia","continents":["Oceania"],"area":18272,"latlng":[-18,175],"altSpellings":["Viti","Republic of Fiji","Matanitu ko Viti","Fijī Gaṇarājya","Fiji"],"callingCode":"+679"},{"name":{"common":"Finland","official":"Republic of Finland"},"cca2":"FI","cca3":"FIN","flag":"🇫🇮","capital":["Helsinki"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"fin":"Finnish","swe":"Swedish"},"population":5645651,"timezones":["UTC+02:00"],"idd":{"root":"+3","suffixes":["58"]},"car":{"side":"right"},"region":"Europe","subregion":"Northern Europe","continents":["Europe"],"area":338424,"latlng":[64,26],"altSpellings":["Suomi","Republic of Finland","Suomen tasavalta","Republiken Finland"],"callingCode":"+358"},{"name":{"common":"France","official":"French Republic"},"cca2":"FR","cca3":"FRA","flag":"🇫🇷","capital":["Paris"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"fra":"French"},"population":68688000,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["3"]},"car":{"side":"right"},"region":"Europe","subregion":"Western Europe","continents":["Europe"],"area":551695,"latlng":[46,2],"altSpellings":["French Republic","République française","France"],"callingCode":"+33"},{"name":{"common":"French Guiana","official":"Guiana"},"cca2":"GF","cca3":"GUF","flag":"🇬🇫","capital":["Cayenne"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"fra":"French"},"population":292354,"timezones":["UTC-03:00"],"idd":{"root":"+5","suffixes":["94"]},"car":{"side":"right"},"region":"Americas","subregion":"South America","continents":["South America"],"area":83534,"latlng":[4,-53],"altSpellings":["Guiana","Guyane","Guyane française"],"callingCode":"+594"},{"name":{"common":"French Polynesia","official":"French Polynesia"},"cca2":"PF","cca3":"PYF","flag":"🇵🇫","capital":["Papeetē"],"currencies":{"XPF":{"name":"CFP franc","symbol":"₣"}},"languages":{"fra":"French"},"population":279500,"timezones":["UTC-10:00","UTC-09:30","UTC-09:00"],"idd":{"root":"+6","suffixes":["89"]},"car":{"side":"right"},"region":"Oceania","subregion":"Polynesia","continents":["Oceania"],"area":4167,"latlng":[-15,-140],"altSpellings":["Polynésie française","French Polynesia","Pōrīnetia Farāni"],"callingCode":"+689"},{"name":{"common":"French Southern and Antarctic Lands","official":"Territory of the French Southern and Antarctic Lands"},"cca2":"TF","cca3":"ATF","flag":"🇹🇫","capital":["Port-aux-Français"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"fra":"French"},"population":0,"timezones":["UTC+05:00"],"idd":{"root":"+2","suffixes":["62"]},"car":{"side":"right"},"region":"Antarctic","subregion":"Southern Africa","continents":["Antarctica"],"area":7747,"latlng":[-49.25,69.167],"altSpellings":["French Southern Territories","Territoire des Terres australes et antarctiques fr"],"callingCode":"+262"},{"name":{"common":"Gabon","official":"Gabonese Republic"},"cca2":"GA","cca3":"GAB","flag":"🇬🇦","capital":["Libreville"],"currencies":{"XAF":{"name":"Central African CFA franc","symbol":"Fr"}},"languages":{"fra":"French"},"population":2469296,"timezones":["UTC+01:00"],"idd":{"root":"+2","suffixes":["41"]},"car":{"side":"right"},"region":"Africa","subregion":"Middle Africa","continents":["Africa"],"area":267668,"latlng":[-1,11.75],"altSpellings":["Gabonese Republic","République Gabonaise","Gabon"],"callingCode":"+241"},{"name":{"common":"Gambia","official":"Republic of the Gambia"},"cca2":"GM","cca3":"GMB","flag":"🇬🇲","capital":["Banjul"],"currencies":{"GMD":{"name":"dalasi","symbol":"D"}},"languages":{"eng":"English"},"population":2422712,"timezones":["UTC±00"],"idd":{"root":"+2","suffixes":["20"]},"car":{"side":"right"},"region":"Africa","subregion":"Western Africa","continents":["Africa"],"area":10689,"latlng":[13.46666666,-16.56666666],"altSpellings":["Republic of the Gambia","Gambia"],"callingCode":"+220"},{"name":{"common":"Georgia","official":"Georgia"},"cca2":"GE","cca3":"GEO","flag":"🇬🇪","capital":["Tbilisi"],"currencies":{"GEL":{"name":"lari","symbol":"₾"}},"languages":{"kat":"Georgian"},"population":3704500,"timezones":["UTC+04:00"],"idd":{"root":"+9","suffixes":["95"]},"car":{"side":"right"},"region":"Asia","subregion":"Western Asia","continents":["Asia"],"area":69700,"latlng":[42,43.5],"altSpellings":["Sakartvelo","საქართველო"],"callingCode":"+995"},{"name":{"common":"Germany","official":"Federal Republic of Germany"},"cca2":"DE","cca3":"DEU","flag":"🇩🇪","capital":["Berlin"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"deu":"German"},"population":83517030,"timezones":["UTC+01:00"],"idd":{"root":"+4","suffixes":["9"]},"car":{"side":"right"},"region":"Europe","subregion":"Western Europe","continents":["Europe"],"area":357114,"latlng":[51,9],"altSpellings":["Federal Republic of Germany","Bundesrepublik Deutschland","Deutschland"],"callingCode":"+49"},{"name":{"common":"Ghana","official":"Republic of Ghana"},"cca2":"GH","cca3":"GHA","flag":"🇬🇭","capital":["Accra"],"currencies":{"GHS":{"name":"Ghanaian cedi","symbol":"₵"}},"languages":{"eng":"English"},"population":33742380,"timezones":["UTC±00"],"idd":{"root":"+2","suffixes":["33"]},"car":{"side":"right"},"region":"Africa","subregion":"Western Africa","continents":["Africa"],"area":238533,"latlng":[8,-2],"altSpellings":["Ghana"],"callingCode":"+233"},{"name":{"common":"Gibraltar","official":"Gibraltar"},"cca2":"GI","cca3":"GIB","flag":"🇬🇮","capital":["Gibraltar"],"currencies":{"GIP":{"name":"Gibraltar pound","symbol":"£"}},"languages":{"eng":"English"},"population":38000,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["50"]},"car":{"side":"right"},"region":"Europe","subregion":"Southern Europe","continents":["Europe"],"area":6,"latlng":[36.13333333,-5.35],"altSpellings":["Gibraltar"],"callingCode":"+350"},{"name":{"common":"Greece","official":"Hellenic Republic"},"cca2":"GR","cca3":"GRC","flag":"🇬🇷","capital":["Athens"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"ell":"Greek"},"population":10400720,"timezones":["UTC+02:00"],"idd":{"root":"+3","suffixes":["0"]},"car":{"side":"right"},"region":"Europe","subregion":"Southern Europe","continents":["Europe"],"area":131990,"latlng":[39,22],"altSpellings":["Elláda","Hellenic Republic","Ελληνική Δημοκρατία","Ελλάδα"],"callingCode":"+30"},{"name":{"common":"Greenland","official":"Greenland"},"cca2":"GL","cca3":"GRL","flag":"🇬🇱","capital":["Nuuk"],"currencies":{"DKK":{"name":"krone","symbol":"kr."}},"languages":{"kal":"Greenlandic"},"population":56542,"timezones":["UTC-04:00","UTC-03:00","UTC-01:00","UTC±00"],"idd":{"root":"+2","suffixes":["99"]},"car":{"side":"right"},"region":"Americas","subregion":"North America","continents":["North America"],"area":2166086,"latlng":[72,-40],"altSpellings":["Grønland","Kalaallit Nunaat"],"callingCode":"+299"},{"name":{"common":"Grenada","official":"Grenada"},"cca2":"GD","cca3":"GRD","flag":"🇬🇩","capital":["St. George's"],"currencies":{"XCD":{"name":"Eastern Caribbean dollar","symbol":"$"}},"languages":{"eng":"English"},"population":109021,"timezones":["UTC-04:00"],"idd":{"root":"+1","suffixes":["473"]},"car":{"side":"left"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":344,"latlng":[12.11666666,-61.66666666],"altSpellings":["Grenada"],"callingCode":"+1473"},{"name":{"common":"Guadeloupe","official":"Guadeloupe"},"cca2":"GP","cca3":"GLP","flag":"🇬🇵","capital":["Basse-Terre"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"fra":"French"},"population":373791,"timezones":["UTC-04:00"],"idd":{"root":"+5","suffixes":["90"]},"car":{"side":"right"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":1628,"latlng":[16.25,-61.583333],"altSpellings":["Gwadloup","Guadeloupe"],"callingCode":"+590"},{"name":{"common":"Guam","official":"Guam"},"cca2":"GU","cca3":"GUM","flag":"🇬🇺","capital":["Hagåtña"],"currencies":{"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"cha":"Chamorro","eng":"English","spa":"Spanish"},"population":153836,"timezones":["UTC+10:00"],"idd":{"root":"+1","suffixes":["671"]},"car":{"side":"right"},"region":"Oceania","subregion":"Micronesia","continents":["Oceania"],"area":549,"latlng":[13.46666666,144.78333333],"altSpellings":["Guåhån","Guam"],"callingCode":"+1671"},{"name":{"common":"Guatemala","official":"Republic of Guatemala"},"cca2":"GT","cca3":"GTM","flag":"🇬🇹","capital":["Guatemala City"],"currencies":{"GTQ":{"name":"Guatemalan quetzal","symbol":"Q"}},"languages":{"spa":"Spanish"},"population":18079810,"timezones":["UTC-06:00"],"idd":{"root":"+5","suffixes":["02"]},"car":{"side":"right"},"region":"Americas","subregion":"Central America","continents":["North America"],"area":108889,"latlng":[15.5,-90.25],"altSpellings":["Guatemala"],"callingCode":"+502"},{"name":{"common":"Guernsey","official":"Bailiwick of Guernsey"},"cca2":"GG","cca3":"GGY","flag":"🇬🇬","capital":["St. Peter Port"],"currencies":{"GBP":{"name":"British pound","symbol":"£"},"GGP":{"name":"Guernsey pound","symbol":"£"}},"languages":{"eng":"English","fra":"French","nfr":"Guernésiais"},"population":64781,"timezones":["UTC±00"],"idd":{"root":"+4","suffixes":["4"]},"car":{"side":"left"},"region":"Europe","subregion":"Northern Europe","continents":["Europe"],"area":78,"latlng":[49.46666666,-2.58333333],"altSpellings":["Bailiwick of Guernsey","Bailliage de Guernesey","Guernsey"],"callingCode":"+44"},{"name":{"common":"Guinea","official":"Republic of Guinea"},"cca2":"GN","cca3":"GIN","flag":"🇬🇳","capital":["Conakry"],"currencies":{"GNF":{"name":"Guinean franc","symbol":"Fr"}},"languages":{"fra":"French"},"population":14363931,"timezones":["UTC±00"],"idd":{"root":"+2","suffixes":["24"]},"car":{"side":"right"},"region":"Africa","subregion":"Western Africa","continents":["Africa"],"area":245857,"latlng":[11,-10],"altSpellings":["Republic of Guinea","République de Guinée","Guinée"],"callingCode":"+224"},{"name":{"common":"Guinea-Bissau","official":"Republic of Guinea-Bissau"},"cca2":"GW","cca3":"GNB","flag":"🇬🇼","capital":["Bissau"],"currencies":{"XOF":{"name":"West African CFA franc","symbol":"Fr"}},"languages":{"por":"Portuguese","pov":"Upper Guinea Creole"},"population":1781308,"timezones":["UTC±00"],"idd":{"root":"+2","suffixes":["45"]},"car":{"side":"right"},"region":"Africa","subregion":"Western Africa","continents":["Africa"],"area":36125,"latlng":[12,-15],"altSpellings":["Republic of Guinea-Bissau","República da Guiné-Bissau","Guiné-Bissau"],"callingCode":"+245"},{"name":{"common":"Guyana","official":"Co-operative Republic of Guyana"},"cca2":"GY","cca3":"GUY","flag":"🇬🇾","capital":["Georgetown"],"currencies":{"GYD":{"name":"Guyanese dollar","symbol":"$"}},"languages":{"eng":"English"},"population":772975,"timezones":["UTC-04:00"],"idd":{"root":"+5","suffixes":["92"]},"car":{"side":"right"},"region":"Americas","subregion":"South America","continents":["South America"],"area":214969,"latlng":[5,-59],"altSpellings":["Co-operative Republic of Guyana","Guyana"],"callingCode":"+592"},{"name":{"common":"Haiti","official":"Republic of Haiti"},"cca2":"HT","cca3":"HTI","flag":"🇭🇹","capital":["Port-au-Prince"],"currencies":{"HTG":{"name":"Haitian gourde","symbol":"G"}},"languages":{"fra":"French","hat":"Haitian Creole"},"population":11867032,"timezones":["UTC-05:00"],"idd":{"root":"+5","suffixes":["09"]},"car":{"side":"right"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":27750,"latlng":[19,-72.41666666],"altSpellings":["Republic of Haiti","République d'Haïti","Repiblik Ayiti","Haïti"],"callingCode":"+509"},{"name":{"common":"Heard Island and McDonald Islands","official":"Heard Island and McDonald Islands"},"cca2":"HM","cca3":"HMD","flag":"🇭🇲","capital":[],"currencies":{"AUD":{"name":"Australian dollar","symbol":"$"}},"languages":{"eng":"English"},"population":0,"timezones":["UTC+05:00"],"idd":{"root":"+672","suffixes":[""]},"car":{"side":"right"},"region":"Antarctic","subregion":"","continents":["Antarctica"],"area":412,"latlng":[-53.1,72.51666666],"altSpellings":["Heard Island and McDonald Islands"],"callingCode":"+672"},{"name":{"common":"Honduras","official":"Republic of Honduras"},"cca2":"HN","cca3":"HND","flag":"🇭🇳","capital":["Tegucigalpa"],"currencies":{"HNL":{"name":"Honduran lempira","symbol":"L"}},"languages":{"spa":"Spanish"},"population":9892632,"timezones":["UTC-06:00"],"idd":{"root":"+5","suffixes":["04"]},"car":{"side":"right"},"region":"Americas","subregion":"Central America","continents":["North America"],"area":112492,"latlng":[15,-86.5],"altSpellings":["Republic of Honduras","República de Honduras","Honduras"],"callingCode":"+504"},{"name":{"common":"Hong Kong","official":"Hong Kong Special Administrative Region of the People's Republic of China"},"cca2":"HK","cca3":"HKG","flag":"🇭🇰","capital":["City of Victoria"],"currencies":{"HKD":{"name":"Hong Kong dollar","symbol":"$"}},"languages":{"eng":"English","zho":"Chinese"},"population":7527500,"timezones":["UTC+08:00"],"idd":{"root":"+8","suffixes":["52"]},"car":{"side":"left"},"region":"Asia","subregion":"Eastern Asia","continents":["Asia"],"area":1104,"latlng":[22.267,114.188],"altSpellings":["香港"],"callingCode":"+852"},{"name":{"common":"Hungary","official":"Hungary"},"cca2":"HU","cca3":"HUN","flag":"🇭🇺","capital":["Budapest"],"currencies":{"HUF":{"name":"Hungarian forint","symbol":"Ft"}},"languages":{"hun":"Hungarian"},"population":9539502,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["6"]},"car":{"side":"right"},"region":"Europe","subregion":"Central Europe","continents":["Europe"],"area":93028,"latlng":[47,20],"altSpellings":["Magyarország"],"callingCode":"+36"},{"name":{"common":"Iceland","official":"Iceland"},"cca2":"IS","cca3":"ISL","flag":"🇮🇸","capital":["Reykjavik"],"currencies":{"ISK":{"name":"Icelandic króna","symbol":"kr"}},"languages":{"isl":"Icelandic"},"population":391810,"timezones":["UTC±00"],"idd":{"root":"+3","suffixes":["54"]},"car":{"side":"right"},"region":"Europe","subregion":"Northern Europe","continents":["Europe"],"area":103000,"latlng":[65,-18],"altSpellings":["Island","Republic of Iceland","Lýðveldið Ísland","Ísland"],"callingCode":"+354"},{"name":{"common":"India","official":"Republic of India"},"cca2":"IN","cca3":"IND","flag":"🇮🇳","capital":["New Delhi"],"currencies":{"INR":{"name":"Indian rupee","symbol":"₹"}},"languages":{"eng":"English","hin":"Hindi","tam":"Tamil"},"population":1417492000,"timezones":["UTC+05:30"],"idd":{"root":"+9","suffixes":["1"]},"car":{"side":"left"},"region":"Asia","subregion":"Southern Asia","continents":["Asia"],"area":3287590,"latlng":[20,77],"altSpellings":["Bhārat","Republic of India","Bharat Ganrajya","இந்தியா","भारत"],"callingCode":"+91"},{"name":{"common":"Indonesia","official":"Republic of Indonesia"},"cca2":"ID","cca3":"IDN","flag":"🇮🇩","capital":["Jakarta"],"currencies":{"IDR":{"name":"Indonesian rupiah","symbol":"Rp"}},"languages":{"ind":"Indonesian"},"population":284438782,"timezones":["UTC+07:00","UTC+08:00","UTC+09:00"],"idd":{"root":"+6","suffixes":["2"]},"car":{"side":"left"},"region":"Asia","subregion":"South-Eastern Asia","continents":["Asia"],"area":1904569,"latlng":[-5,120],"altSpellings":["Republic of Indonesia","Republik Indonesia","Indonesia"],"callingCode":"+62"},{"name":{"common":"Iran","official":"Islamic Republic of Iran"},"cca2":"IR","cca3":"IRN","flag":"🇮🇷","capital":["Tehran"],"currencies":{"IRR":{"name":"Iranian rial","symbol":"﷼"}},"languages":{"fas":"Persian (Farsi)"},"population":85961000,"timezones":["UTC+03:30"],"idd":{"root":"+9","suffixes":["8"]},"car":{"side":"right"},"region":"Asia","subregion":"Southern Asia","continents":["Asia"],"area":1648195,"latlng":[32,53],"altSpellings":["Islamic Republic of Iran","Iran, Islamic Republic of","Jomhuri-ye Eslāmi-ye Irān","ایران"],"callingCode":"+98"},{"name":{"common":"Iraq","official":"Republic of Iraq"},"cca2":"IQ","cca3":"IRQ","flag":"🇮🇶","capital":["Baghdad"],"currencies":{"IQD":{"name":"Iraqi dinar","symbol":"ع.د"}},"languages":{"ara":"Arabic","arc":"Aramaic","ckb":"Sorani"},"population":46118793,"timezones":["UTC+03:00"],"idd":{"root":"+9","suffixes":["64"]},"car":{"side":"right"},"region":"Asia","subregion":"Western Asia","continents":["Asia"],"area":438317,"latlng":[33,44],"altSpellings":["Republic of Iraq","Jumhūriyyat al-‘Irāq","العراق"],"callingCode":"+964"},{"name":{"common":"Ireland","official":"Republic of Ireland"},"cca2":"IE","cca3":"IRL","flag":"🇮🇪","capital":["Dublin"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"eng":"English","gle":"Irish"},"population":5458600,"timezones":["UTC±00"],"idd":{"root":"+3","suffixes":["53"]},"car":{"side":"left"},"region":"Europe","subregion":"Northern Europe","continents":["Europe"],"area":70273,"latlng":[53,-8],"altSpellings":["Éire","Republic of Ireland","Poblacht na hÉireann"],"callingCode":"+353"},{"name":{"common":"Isle of Man","official":"Isle of Man"},"cca2":"IM","cca3":"IMN","flag":"🇮🇲","capital":["Douglas"],"currencies":{"GBP":{"name":"British pound","symbol":"£"},"IMP":{"name":"Manx pound","symbol":"£"}},"languages":{"eng":"English","glv":"Manx"},"population":84530,"timezones":["UTC±00"],"idd":{"root":"+4","suffixes":["4"]},"car":{"side":"left"},"region":"Europe","subregion":"Northern Europe","continents":["Europe"],"area":572,"latlng":[54.25,-4.5],"altSpellings":["Ellan Vannin","Mann","Mannin","Isle of Man"],"callingCode":"+44"},{"name":{"common":"Israel","official":"State of Israel"},"cca2":"IL","cca3":"ISR","flag":"🇮🇱","capital":["Jerusalem"],"currencies":{"ILS":{"name":"Israeli new shekel","symbol":"₪"}},"languages":{"ara":"Arabic","heb":"Hebrew"},"population":10119400,"timezones":["UTC+02:00"],"idd":{"root":"+9","suffixes":["72"]},"car":{"side":"right"},"region":"Asia","subregion":"Western Asia","continents":["Asia"],"area":20770,"latlng":[31.47,35.13],"altSpellings":["State of Israel","Medīnat Yisrā'el","יִשְׂרָאֵל"],"callingCode":"+972"},{"name":{"common":"Italy","official":"Italian Republic"},"cca2":"IT","cca3":"ITA","flag":"🇮🇹","capital":["Rome"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"ita":"Italian"},"population":58919230,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["9"]},"car":{"side":"right"},"region":"Europe","subregion":"Southern Europe","continents":["Europe"],"area":301336,"latlng":[42.83333333,12.83333333],"altSpellings":["Italian Republic","Repubblica italiana","Italia"],"callingCode":"+39"},{"name":{"common":"Ivory Coast","official":"Republic of Côte d'Ivoire"},"cca2":"CI","cca3":"CIV","flag":"🇨🇮","capital":["Yamoussoukro"],"currencies":{"XOF":{"name":"West African CFA franc","symbol":"Fr"}},"languages":{"fra":"French"},"population":29389150,"timezones":["UTC±00"],"idd":{"root":"+2","suffixes":["25"]},"car":{"side":"right"},"region":"Africa","subregion":"Western Africa","continents":["Africa"],"area":322463,"latlng":[8,-5],"altSpellings":["Côte d'Ivoire","Cote d'Ivoire","Ivory Coast","Republic of Côte d'Ivoire","République de Côte d'Ivoire","Cote D'Ivoire"],"callingCode":"+225"},{"name":{"common":"Jamaica","official":"Jamaica"},"cca2":"JM","cca3":"JAM","flag":"🇯🇲","capital":["Kingston"],"currencies":{"JMD":{"name":"Jamaican dollar","symbol":"$"}},"languages":{"eng":"English","jam":"Jamaican Patois"},"population":2825544,"timezones":["UTC-05:00"],"idd":{"root":"+1","suffixes":["876"]},"car":{"side":"left"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":10991,"latlng":[18.25,-77.5],"altSpellings":["Jamaica"],"callingCode":"+1876"},{"name":{"common":"Japan","official":"Japan"},"cca2":"JP","cca3":"JPN","flag":"🇯🇵","capital":["Tokyo"],"currencies":{"JPY":{"name":"Japanese yen","symbol":"¥"}},"languages":{"jpn":"Japanese"},"population":123300000,"timezones":["UTC+09:00"],"idd":{"root":"+8","suffixes":["1"]},"car":{"side":"left"},"region":"Asia","subregion":"Eastern Asia","continents":["Asia"],"area":377930,"latlng":[36,138],"altSpellings":["Nippon","Nihon","日本"],"callingCode":"+81"},{"name":{"common":"Jersey","official":"Bailiwick of Jersey"},"cca2":"JE","cca3":"JEY","flag":"🇯🇪","capital":["Saint Helier"],"currencies":{"GBP":{"name":"British pound","symbol":"£"},"JEP":{"name":"Jersey pound","symbol":"£"}},"languages":{"eng":"English","fra":"French","nrf":"Jèrriais"},"population":103267,"timezones":["UTC±00"],"idd":{"root":"+4","suffixes":["4"]},"car":{"side":"left"},"region":"Europe","subregion":"Northern Europe","continents":["Europe"],"area":116,"latlng":[49.25,-2.16666666],"altSpellings":["Bailiwick of Jersey","Bailliage de Jersey","Bailliage dé Jèrri","Jersey"],"callingCode":"+44"},{"name":{"common":"Jordan","official":"Hashemite Kingdom of Jordan"},"cca2":"JO","cca3":"JOR","flag":"🇯🇴","capital":["Amman"],"currencies":{"JOD":{"name":"Jordanian dinar","symbol":"د.ا"}},"languages":{"ara":"Arabic"},"population":11734000,"timezones":["UTC+02:00"],"idd":{"root":"+9","suffixes":["62"]},"car":{"side":"right"},"region":"Asia","subregion":"Western Asia","continents":["Asia"],"area":89342,"latlng":[31,36],"altSpellings":["Hashemite Kingdom of Jordan","al-Mamlakah al-Urdunīyah al-Hāshimīyah","الأردن"],"callingCode":"+962"},{"name":{"common":"Kazakhstan","official":"Republic of Kazakhstan"},"cca2":"KZ","cca3":"KAZ","flag":"🇰🇿","capital":["Astana"],"currencies":{"KZT":{"name":"Kazakhstani tenge","symbol":"₸"}},"languages":{"kaz":"Kazakh","rus":"Russian"},"population":20407844,"timezones":["UTC+05:00","UTC+06:00"],"idd":{"root":"+7","suffixes":["6","7"]},"car":{"side":"right"},"region":"Asia","subregion":"Central Asia","continents":["Asia"],"area":2724900,"latlng":[48,68],"altSpellings":["Qazaqstan","Казахстан","Republic of Kazakhstan","Қазақстан Республикасы","Qazaqstan Respublïkası","Қазақстан"],"callingCode":"+7"},{"name":{"common":"Kenya","official":"Republic of Kenya"},"cca2":"KE","cca3":"KEN","flag":"🇰🇪","capital":["Nairobi"],"currencies":{"KES":{"name":"Kenyan shilling","symbol":"Sh"}},"languages":{"eng":"English","swa":"Swahili"},"population":53330978,"timezones":["UTC+03:00"],"idd":{"root":"+2","suffixes":["54"]},"car":{"side":"left"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":580367,"latlng":[1,38],"altSpellings":["Republic of Kenya","Jamhuri ya Kenya","Kenya"],"callingCode":"+254"},{"name":{"common":"Kiribati","official":"Independent and Sovereign Republic of Kiribati"},"cca2":"KI","cca3":"KIR","flag":"🇰🇮","capital":["South Tarawa"],"currencies":{"AUD":{"name":"Australian dollar","symbol":"$"},"KID":{"name":"Kiribati dollar","symbol":"$"}},"languages":{"eng":"English","gil":"Gilbertese"},"population":120740,"timezones":["UTC+12:00","UTC+13:00","UTC+14:00"],"idd":{"root":"+6","suffixes":["86"]},"car":{"side":"left"},"region":"Oceania","subregion":"Micronesia","continents":["Oceania"],"area":811,"latlng":[1.41666666,173],"altSpellings":["Republic of Kiribati","Ribaberiki Kiribati","Kiribati"],"callingCode":"+686"},{"name":{"common":"Kosovo","official":"Republic of Kosovo"},"cca2":"XK","cca3":"UNK","flag":"🇽🇰","capital":["Pristina"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"sqi":"Albanian","srp":"Serbian"},"population":1585566,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["83"]},"car":{"side":"right"},"region":"Europe","subregion":"Southeast Europe","continents":["Europe"],"area":10908,"latlng":[42.666667,21.166667],"altSpellings":["Република Косово","Republika e Kosovës"],"callingCode":"+383"},{"name":{"common":"Kuwait","official":"State of Kuwait"},"cca2":"KW","cca3":"KWT","flag":"🇰🇼","capital":["Kuwait City"],"currencies":{"KWD":{"name":"Kuwaiti dinar","symbol":"د.ك"}},"languages":{"ara":"Arabic"},"population":4881254,"timezones":["UTC+03:00"],"idd":{"root":"+9","suffixes":["65"]},"car":{"side":"right"},"region":"Asia","subregion":"Western Asia","continents":["Asia"],"area":17818,"latlng":[29.5,45.75],"altSpellings":["State of Kuwait","Dawlat al-Kuwait","الكويت"],"callingCode":"+965"},{"name":{"common":"Kyrgyzstan","official":"Kyrgyz Republic"},"cca2":"KG","cca3":"KGZ","flag":"🇰🇬","capital":["Bishkek"],"currencies":{"KGS":{"name":"Kyrgyzstani som","symbol":"с"}},"languages":{"kir":"Kyrgyz","rus":"Russian"},"population":7281800,"timezones":["UTC+06:00"],"idd":{"root":"+9","suffixes":["96"]},"car":{"side":"right"},"region":"Asia","subregion":"Central Asia","continents":["Asia"],"area":199951,"latlng":[41,75],"altSpellings":["Киргизия","Kyrgyz Republic","Кыргыз Республикасы","Kyrgyz Respublikasy","Кыргызстан"],"callingCode":"+996"},{"name":{"common":"Laos","official":"Lao People's Democratic Republic"},"cca2":"LA","cca3":"LAO","flag":"🇱🇦","capital":["Vientiane"],"currencies":{"LAK":{"name":"Lao kip","symbol":"₭"}},"languages":{"lao":"Lao"},"population":7647000,"timezones":["UTC+07:00"],"idd":{"root":"+8","suffixes":["56"]},"car":{"side":"right"},"region":"Asia","subregion":"South-Eastern Asia","continents":["Asia"],"area":236800,"latlng":[18,105],"altSpellings":["Lao","Lao People's Democratic Republic","Sathalanalat Paxathipatai Paxaxon Lao","ສປປລາວ"],"callingCode":"+856"},{"name":{"common":"Latvia","official":"Republic of Latvia"},"cca2":"LV","cca3":"LVA","flag":"🇱🇻","capital":["Riga"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"lav":"Latvian"},"population":1830400,"timezones":["UTC+02:00"],"idd":{"root":"+3","suffixes":["71"]},"car":{"side":"right"},"region":"Europe","subregion":"Northern Europe","continents":["Europe"],"area":64559,"latlng":[57,25],"altSpellings":["Republic of Latvia","Latvijas Republika","Latvija"],"callingCode":"+371"},{"name":{"common":"Lebanon","official":"Lebanese Republic"},"cca2":"LB","cca3":"LBN","flag":"🇱🇧","capital":["Beirut"],"currencies":{"LBP":{"name":"Lebanese pound","symbol":"ل.ل"}},"languages":{"ara":"Arabic","fra":"French"},"population":5490000,"timezones":["UTC+02:00"],"idd":{"root":"+9","suffixes":["61"]},"car":{"side":"right"},"region":"Asia","subregion":"Western Asia","continents":["Asia"],"area":10452,"latlng":[33.83333333,35.83333333],"altSpellings":["Lebanese Republic","Al-Jumhūrīyah Al-Libnānīyah","لبنان"],"callingCode":"+961"},{"name":{"common":"Lesotho","official":"Kingdom of Lesotho"},"cca2":"LS","cca3":"LSO","flag":"🇱🇸","capital":["Maseru"],"currencies":{"LSL":{"name":"Lesotho loti","symbol":"L"},"ZAR":{"name":"South African rand","symbol":"R"}},"languages":{"eng":"English","sot":"Sotho"},"population":2116427,"timezones":["UTC+02:00"],"idd":{"root":"+2","suffixes":["66"]},"car":{"side":"left"},"region":"Africa","subregion":"Southern Africa","continents":["Africa"],"area":30355,"latlng":[-29.5,28.5],"altSpellings":["Kingdom of Lesotho","Muso oa Lesotho","Lesotho"],"callingCode":"+266"},{"name":{"common":"Liberia","official":"Republic of Liberia"},"cca2":"LR","cca3":"LBR","flag":"🇱🇷","capital":["Monrovia"],"currencies":{"LRD":{"name":"Liberian dollar","symbol":"$"}},"languages":{"eng":"English"},"population":5248621,"timezones":["UTC±00"],"idd":{"root":"+2","suffixes":["31"]},"car":{"side":"right"},"region":"Africa","subregion":"Western Africa","continents":["Africa"],"area":111369,"latlng":[6.5,-9.5],"altSpellings":["Republic of Liberia","Liberia"],"callingCode":"+231"},{"name":{"common":"Libya","official":"State of Libya"},"cca2":"LY","cca3":"LBY","flag":"🇱🇾","capital":["Tripoli"],"currencies":{"LYD":{"name":"Libyan dinar","symbol":"ل.د"}},"languages":{"ara":"Arabic"},"population":7459000,"timezones":["UTC+02:00"],"idd":{"root":"+2","suffixes":["18"]},"car":{"side":"right"},"region":"Africa","subregion":"Northern Africa","continents":["Africa"],"area":1759540,"latlng":[25,17],"altSpellings":["State of Libya","Dawlat Libya","‏ليبيا"],"callingCode":"+218"},{"name":{"common":"Liechtenstein","official":"Principality of Liechtenstein"},"cca2":"LI","cca3":"LIE","flag":"🇱🇮","capital":["Vaduz"],"currencies":{"CHF":{"name":"Swiss franc","symbol":"Fr"}},"languages":{"deu":"German"},"population":40900,"timezones":["UTC+01:00"],"idd":{"root":"+4","suffixes":["23"]},"car":{"side":"right"},"region":"Europe","subregion":"Western Europe","continents":["Europe"],"area":160,"latlng":[47.26666666,9.53333333],"altSpellings":["Principality of Liechtenstein","Fürstentum Liechtenstein","Liechtenstein"],"callingCode":"+423"},{"name":{"common":"Lithuania","official":"Republic of Lithuania"},"cca2":"LT","cca3":"LTU","flag":"🇱🇹","capital":["Vilnius"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"lit":"Lithuanian"},"population":2894548,"timezones":["UTC+02:00"],"idd":{"root":"+3","suffixes":["70"]},"car":{"side":"right"},"region":"Europe","subregion":"Northern Europe","continents":["Europe"],"area":65300,"latlng":[56,24],"altSpellings":["Republic of Lithuania","Lietuvos Respublika","Lietuva"],"callingCode":"+370"},{"name":{"common":"Luxembourg","official":"Grand Duchy of Luxembourg"},"cca2":"LU","cca3":"LUX","flag":"🇱🇺","capital":["Luxembourg"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"deu":"German","fra":"French","ltz":"Luxembourgish"},"population":681973,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["52"]},"car":{"side":"right"},"region":"Europe","subregion":"Western Europe","continents":["Europe"],"area":2586,"latlng":[49.75,6.16666666],"altSpellings":["Grand Duchy of Luxembourg","Grand-Duché de Luxembourg","Großherzogtum Luxemburg","Groussherzogtum Lëtzebuerg","Luxembourg"],"callingCode":"+352"},{"name":{"common":"Macau","official":"Macao Special Administrative Region of the People's Republic of China"},"cca2":"MO","cca3":"MAC","flag":"🇲🇴","capital":["Macao"],"currencies":{"MOP":{"name":"Macanese pataca","symbol":"P"}},"languages":{"por":"Portuguese","zho":"Chinese"},"population":685900,"timezones":["UTC+08:00"],"idd":{"root":"+8","suffixes":["53"]},"car":{"side":"left"},"region":"Asia","subregion":"Eastern Asia","continents":["Asia"],"area":30,"latlng":[22.16666666,113.55],"altSpellings":["Macao","Macao Special Administrative Region of the People's Republic of China","中華人民共和國澳門特別行政區","Região Administrativa Especial de Macau da República Popular da China","澳門"],"callingCode":"+853"},{"name":{"common":"Madagascar","official":"Republic of Madagascar"},"cca2":"MG","cca3":"MDG","flag":"🇲🇬","capital":["Antananarivo"],"currencies":{"MGA":{"name":"Malagasy ariary","symbol":"Ar"}},"languages":{"fra":"French","mlg":"Malagasy"},"population":31727042,"timezones":["UTC+03:00"],"idd":{"root":"+2","suffixes":["61"]},"car":{"side":"right"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":587041,"latlng":[-20,47],"altSpellings":["Republic of Madagascar","Repoblikan'i Madagasikara","République de Madagascar","Madagasikara"],"callingCode":"+261"},{"name":{"common":"Malawi","official":"Republic of Malawi"},"cca2":"MW","cca3":"MWI","flag":"🇲🇼","capital":["Lilongwe"],"currencies":{"MWK":{"name":"Malawian kwacha","symbol":"MK"}},"languages":{"eng":"English","nya":"Chewa"},"population":20734262,"timezones":["UTC+02:00"],"idd":{"root":"+2","suffixes":["65"]},"car":{"side":"left"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":118484,"latlng":[-13.5,34],"altSpellings":["Republic of Malawi","Malawi"],"callingCode":"+265"},{"name":{"common":"Malaysia","official":"Malaysia"},"cca2":"MY","cca3":"MYS","flag":"🇲🇾","capital":["Kuala Lumpur"],"currencies":{"MYR":{"name":"Malaysian ringgit","symbol":"RM"}},"languages":{"eng":"English","msa":"Malay"},"population":34231700,"timezones":["UTC+08:00"],"idd":{"root":"+6","suffixes":["0"]},"car":{"side":"left"},"region":"Asia","subregion":"South-Eastern Asia","continents":["Asia"],"area":330803,"latlng":[2.5,112.5],"altSpellings":["Malaysia"],"callingCode":"+60"},{"name":{"common":"Maldives","official":"Republic of the Maldives"},"cca2":"MV","cca3":"MDV","flag":"🇲🇻","capital":["Malé"],"currencies":{"MVR":{"name":"Maldivian rufiyaa","symbol":".ރ"}},"languages":{"div":"Maldivian"},"population":515132,"timezones":["UTC+05:00"],"idd":{"root":"+9","suffixes":["60"]},"car":{"side":"left"},"region":"Asia","subregion":"Southern Asia","continents":["Asia"],"area":300,"latlng":[3.25,73],"altSpellings":["Maldive Islands","Republic of the Maldives","Dhivehi Raajjeyge Jumhooriyya","Maldives"],"callingCode":"+960"},{"name":{"common":"Mali","official":"Republic of Mali"},"cca2":"ML","cca3":"MLI","flag":"🇲🇱","capital":["Bamako"],"currencies":{"XOF":{"name":"West African CFA franc","symbol":"Fr"}},"languages":{"fra":"French"},"population":22395489,"timezones":["UTC±00"],"idd":{"root":"+2","suffixes":["23"]},"car":{"side":"right"},"region":"Africa","subregion":"Western Africa","continents":["Africa"],"area":1240192,"latlng":[17,-4],"altSpellings":["Republic of Mali","République du Mali","Mali"],"callingCode":"+223"},{"name":{"common":"Malta","official":"Republic of Malta"},"cca2":"MT","cca3":"MLT","flag":"🇲🇹","capital":["Valletta"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"eng":"English","mlt":"Maltese"},"population":574250,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["56"]},"car":{"side":"left"},"region":"Europe","subregion":"Southern Europe","continents":["Europe"],"area":316,"latlng":[35.83333333,14.58333333],"altSpellings":["Republic of Malta","Repubblika ta' Malta","Malta"],"callingCode":"+356"},{"name":{"common":"Marshall Islands","official":"Republic of the Marshall Islands"},"cca2":"MH","cca3":"MHL","flag":"🇲🇭","capital":["Majuro"],"currencies":{"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"eng":"English","mah":"Marshallese"},"population":42418,"timezones":["UTC+12:00"],"idd":{"root":"+6","suffixes":["92"]},"car":{"side":"right"},"region":"Oceania","subregion":"Micronesia","continents":["Oceania"],"area":181,"latlng":[9,168],"altSpellings":["Republic of the Marshall Islands","Aolepān Aorōkin M̧ajeļ","M̧ajeļ"],"callingCode":"+692"},{"name":{"common":"Martinique","official":"Martinique"},"cca2":"MQ","cca3":"MTQ","flag":"🇲🇶","capital":["Fort-de-France"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"fra":"French"},"population":339897,"timezones":["UTC-04:00"],"idd":{"root":"+5","suffixes":["96"]},"car":{"side":"right"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":1128,"latlng":[14.666667,-61],"altSpellings":["Martinique"],"callingCode":"+596"},{"name":{"common":"Mauritania","official":"Islamic Republic of Mauritania"},"cca2":"MR","cca3":"MRT","flag":"🇲🇷","capital":["Nouakchott"],"currencies":{"MRU":{"name":"Mauritanian ouguiya","symbol":"UM"}},"languages":{"ara":"Arabic"},"population":4927532,"timezones":["UTC±00"],"idd":{"root":"+2","suffixes":["22"]},"car":{"side":"right"},"region":"Africa","subregion":"Western Africa","continents":["Africa"],"area":1030700,"latlng":[20,-12],"altSpellings":["Islamic Republic of Mauritania","al-Jumhūriyyah al-ʾIslāmiyyah al-Mūrītāniyyah","موريتانيا"],"callingCode":"+222"},{"name":{"common":"Mauritius","official":"Republic of Mauritius"},"cca2":"MU","cca3":"MUS","flag":"🇲🇺","capital":["Port Louis"],"currencies":{"MUR":{"name":"Mauritian rupee","symbol":"₨"}},"languages":{"eng":"English","fra":"French","mfe":"Mauritian Creole"},"population":1243741,"timezones":["UTC+04:00"],"idd":{"root":"+2","suffixes":["30"]},"car":{"side":"left"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":2040,"latlng":[-20.28333333,57.55],"altSpellings":["Republic of Mauritius","République de Maurice","Maurice"],"callingCode":"+230"},{"name":{"common":"Mayotte","official":"Department of Mayotte"},"cca2":"YT","cca3":"MYT","flag":"🇾🇹","capital":["Mamoudzou"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"fra":"French"},"population":337011,"timezones":["UTC+03:00"],"idd":{"root":"+2","suffixes":["62"]},"car":{"side":"right"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":374,"latlng":[-12.83333333,45.16666666],"altSpellings":["Department of Mayotte","Département de Mayotte","Mayotte"],"callingCode":"+262"},{"name":{"common":"Mexico","official":"United Mexican States"},"cca2":"MX","cca3":"MEX","flag":"🇲🇽","capital":["Mexico City"],"currencies":{"MXN":{"name":"Mexican peso","symbol":"$"}},"languages":{"spa":"Spanish"},"population":130575786,"timezones":["UTC-08:00","UTC-07:00","UTC-06:00","UTC-05:00"],"idd":{"root":"+5","suffixes":["2"]},"car":{"side":"right"},"region":"Americas","subregion":"North America","continents":["North America"],"area":1964375,"latlng":[23,-102],"altSpellings":["Mexicanos","United Mexican States","Estados Unidos Mexicanos","México"],"callingCode":"+52"},{"name":{"common":"Micronesia","official":"Federated States of Micronesia"},"cca2":"FM","cca3":"FSM","flag":"🇫🇲","capital":["Palikir"],"currencies":{"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"eng":"English"},"population":105564,"timezones":["UTC+10:00","UTC+11:00"],"idd":{"root":"+6","suffixes":["91"]},"car":{"side":"right"},"region":"Oceania","subregion":"Micronesia","continents":["Oceania"],"area":702,"latlng":[6.91666666,158.25],"altSpellings":["Federated States of Micronesia","Micronesia, Federated States of","Micronesia"],"callingCode":"+691"},{"name":{"common":"Moldova","official":"Republic of Moldova"},"cca2":"MD","cca3":"MDA","flag":"🇲🇩","capital":["Chișinău"],"currencies":{"MDL":{"name":"Moldovan leu","symbol":"L"}},"languages":{"ron":"Moldavian"},"population":2381300,"timezones":["UTC+02:00"],"idd":{"root":"+3","suffixes":["73"]},"car":{"side":"right"},"region":"Europe","subregion":"Eastern Europe","continents":["Europe"],"area":33846,"latlng":[47,29],"altSpellings":["Moldova, Republic of","Republic of Moldova","Republica Moldova","Moldova"],"callingCode":"+373"},{"name":{"common":"Monaco","official":"Principality of Monaco"},"cca2":"MC","cca3":"MCO","flag":"🇲🇨","capital":["Monaco"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"fra":"French"},"population":38423,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["77"]},"car":{"side":"right"},"region":"Europe","subregion":"Western Europe","continents":["Europe"],"area":2.02,"latlng":[43.73333333,7.4],"altSpellings":["Principality of Monaco","Principauté de Monaco","Monaco"],"callingCode":"+377"},{"name":{"common":"Mongolia","official":"Mongolia"},"cca2":"MN","cca3":"MNG","flag":"🇲🇳","capital":["Ulan Bator"],"currencies":{"MNT":{"name":"Mongolian tögrög","symbol":"₮"}},"languages":{"mon":"Mongolian"},"population":3544835,"timezones":["UTC+07:00","UTC+08:00"],"idd":{"root":"+9","suffixes":["76"]},"car":{"side":"right"},"region":"Asia","subregion":"Eastern Asia","continents":["Asia"],"area":1564110,"latlng":[46,105],"altSpellings":["Монгол улс"],"callingCode":"+976"},{"name":{"common":"Montenegro","official":"Montenegro"},"cca2":"ME","cca3":"MNE","flag":"🇲🇪","capital":["Podgorica"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"cnr":"Montenegrin"},"population":623327,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["82"]},"car":{"side":"right"},"region":"Europe","subregion":"Southeast Europe","continents":["Europe"],"area":13812,"latlng":[42.5,19.3],"altSpellings":["Crna Gora","Црна Гора"],"callingCode":"+382"},{"name":{"common":"Montserrat","official":"Montserrat"},"cca2":"MS","cca3":"MSR","flag":"🇲🇸","capital":["Plymouth"],"currencies":{"XCD":{"name":"Eastern Caribbean dollar","symbol":"$"}},"languages":{"eng":"English"},"population":4386,"timezones":["UTC-04:00"],"idd":{"root":"+1","suffixes":["664"]},"car":{"side":"left"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":102,"latlng":[16.75,-62.2],"altSpellings":["Montserrat"],"callingCode":"+1664"},{"name":{"common":"Morocco","official":"Kingdom of Morocco"},"cca2":"MA","cca3":"MAR","flag":"🇲🇦","capital":["Rabat"],"currencies":{"MAD":{"name":"Moroccan dirham","symbol":"د.م."}},"languages":{"ara":"Arabic","ber":"Berber"},"population":36828330,"timezones":["UTC+01:00"],"idd":{"root":"+2","suffixes":["12"]},"car":{"side":"right"},"region":"Africa","subregion":"Northern Africa","continents":["Africa"],"area":446550,"latlng":[32,-5],"altSpellings":["Kingdom of Morocco","Al-Mamlakah al-Maġribiyah","المغرب"],"callingCode":"+212"},{"name":{"common":"Mozambique","official":"Republic of Mozambique"},"cca2":"MZ","cca3":"MOZ","flag":"🇲🇿","capital":["Maputo"],"currencies":{"MZN":{"name":"Mozambican metical","symbol":"MT"}},"languages":{"por":"Portuguese"},"population":34090466,"timezones":["UTC+02:00"],"idd":{"root":"+2","suffixes":["58"]},"car":{"side":"left"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":801590,"latlng":[-18.25,35],"altSpellings":["Republic of Mozambique","República de Moçambique","Moçambique"],"callingCode":"+258"},{"name":{"common":"Myanmar","official":"Republic of the Union of Myanmar"},"cca2":"MM","cca3":"MMR","flag":"🇲🇲","capital":["Naypyidaw"],"currencies":{"MMK":{"name":"Burmese kyat","symbol":"Ks"}},"languages":{"mya":"Burmese"},"population":51316756,"timezones":["UTC+06:30"],"idd":{"root":"+9","suffixes":["5"]},"car":{"side":"right"},"region":"Asia","subregion":"South-Eastern Asia","continents":["Asia"],"area":676578,"latlng":[22,98],"altSpellings":["Burma","Republic of the Union of Myanmar","Pyidaunzu Thanmăda Myăma Nainngandaw","မြန်မာ"],"callingCode":"+95"},{"name":{"common":"Namibia","official":"Republic of Namibia"},"cca2":"NA","cca3":"NAM","flag":"🇳🇦","capital":["Windhoek"],"currencies":{"NAD":{"name":"Namibian dollar","symbol":"$"},"ZAR":{"name":"South African rand","symbol":"R"}},"languages":{"afr":"Afrikaans","deu":"German","eng":"English","her":"Herero","hgm":"Khoekhoe","kwn":"Kwangali","loz":"Lozi","ndo":"Ndonga","tsn":"Tswana"},"population":3022401,"timezones":["UTC+02:00"],"idd":{"root":"+2","suffixes":["64"]},"car":{"side":"left"},"region":"Africa","subregion":"Southern Africa","continents":["Africa"],"area":825615,"latlng":[-22,17],"altSpellings":["Namibië","Republic of Namibia","Namibia"],"callingCode":"+264"},{"name":{"common":"Nauru","official":"Republic of Nauru"},"cca2":"NR","cca3":"NRU","flag":"🇳🇷","capital":["Yaren"],"currencies":{"AUD":{"name":"Australian dollar","symbol":"$"}},"languages":{"eng":"English","nau":"Nauru"},"population":11680,"timezones":["UTC+12:00"],"idd":{"root":"+6","suffixes":["74"]},"car":{"side":"left"},"region":"Oceania","subregion":"Micronesia","continents":["Oceania"],"area":21,"latlng":[-0.53333333,166.91666666],"altSpellings":["Naoero","Pleasant Island","Republic of Nauru","Ripublik Naoero","Nauru"],"callingCode":"+674"},{"name":{"common":"Nepal","official":"Federal Democratic Republic of Nepal"},"cca2":"NP","cca3":"NPL","flag":"🇳🇵","capital":["Kathmandu"],"currencies":{"NPR":{"name":"Nepalese rupee","symbol":"₨"}},"languages":{"nep":"Nepali"},"population":29911840,"timezones":["UTC+05:45"],"idd":{"root":"+9","suffixes":["77"]},"car":{"side":"left"},"region":"Asia","subregion":"Southern Asia","continents":["Asia"],"area":147181,"latlng":[28,84],"altSpellings":["Federal Democratic Republic of Nepal","Loktāntrik Ganatantra Nepāl","नेपाल"],"callingCode":"+977"},{"name":{"common":"Netherlands","official":"Kingdom of the Netherlands"},"cca2":"NL","cca3":"NLD","flag":"🇳🇱","capital":["Amsterdam"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"nld":"Dutch"},"population":18080943,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["1"]},"car":{"side":"right"},"region":"Europe","subregion":"Western Europe","continents":["Europe"],"area":41850,"latlng":[52.5,5.75],"altSpellings":["Holland","Nederland","The Netherlands"],"callingCode":"+31"},{"name":{"common":"New Caledonia","official":"New Caledonia"},"cca2":"NC","cca3":"NCL","flag":"🇳🇨","capital":["Nouméa"],"currencies":{"XPF":{"name":"CFP franc","symbol":"₣"}},"languages":{"fra":"French"},"population":264596,"timezones":["UTC+11:00"],"idd":{"root":"+6","suffixes":["87"]},"car":{"side":"right"},"region":"Oceania","subregion":"Melanesia","continents":["Oceania"],"area":18575,"latlng":[-21.5,165.5],"altSpellings":["Nouvelle-Calédonie"],"callingCode":"+687"},{"name":{"common":"New Zealand","official":"New Zealand"},"cca2":"NZ","cca3":"NZL","flag":"🇳🇿","capital":["Wellington"],"currencies":{"NZD":{"name":"New Zealand dollar","symbol":"$"}},"languages":{"eng":"English","mri":"Māori","nzs":"New Zealand Sign Language"},"population":5324700,"timezones":["UTC+13:00","UTC+13:45"],"idd":{"root":"+6","suffixes":["4"]},"car":{"side":"left"},"region":"Oceania","subregion":"Australia and New Zealand","continents":["Oceania"],"area":270467,"latlng":[-41,174],"altSpellings":["Aotearoa","New Zealand"],"callingCode":"+64"},{"name":{"common":"Nicaragua","official":"Republic of Nicaragua"},"cca2":"NI","cca3":"NIC","flag":"🇳🇮","capital":["Managua"],"currencies":{"NIO":{"name":"Nicaraguan córdoba","symbol":"C$"}},"languages":{"spa":"Spanish"},"population":6803886,"timezones":["UTC-06:00"],"idd":{"root":"+5","suffixes":["05"]},"car":{"side":"right"},"region":"Americas","subregion":"Central America","continents":["North America"],"area":130373,"latlng":[13,-85],"altSpellings":["Republic of Nicaragua","República de Nicaragua","Nicaragua"],"callingCode":"+505"},{"name":{"common":"Niger","official":"Republic of Niger"},"cca2":"NE","cca3":"NER","flag":"🇳🇪","capital":["Niamey"],"currencies":{"XOF":{"name":"West African CFA franc","symbol":"Fr"}},"languages":{"fra":"French"},"population":26312034,"timezones":["UTC+01:00"],"idd":{"root":"+2","suffixes":["27"]},"car":{"side":"right"},"region":"Africa","subregion":"Western Africa","continents":["Africa"],"area":1267000,"latlng":[16,8],"altSpellings":["Nijar","Niger"],"callingCode":"+227"},{"name":{"common":"Nigeria","official":"Federal Republic of Nigeria"},"cca2":"NG","cca3":"NGA","flag":"🇳🇬","capital":["Abuja"],"currencies":{"NGN":{"name":"Nigerian naira","symbol":"₦"}},"languages":{"eng":"English"},"population":223800000,"timezones":["UTC+01:00"],"idd":{"root":"+2","suffixes":["34"]},"car":{"side":"right"},"region":"Africa","subregion":"Western Africa","continents":["Africa"],"area":923768,"latlng":[10,8],"altSpellings":["Nijeriya","Naíjíríà","Federal Republic of Nigeria","Nigeria"],"callingCode":"+234"},{"name":{"common":"Niue","official":"Niue"},"cca2":"NU","cca3":"NIU","flag":"🇳🇺","capital":["Alofi"],"currencies":{"NZD":{"name":"New Zealand dollar","symbol":"$"}},"languages":{"eng":"English","niu":"Niuean"},"population":1681,"timezones":["UTC-11:00"],"idd":{"root":"+6","suffixes":["83"]},"car":{"side":"left"},"region":"Oceania","subregion":"Polynesia","continents":["Oceania"],"area":260,"latlng":[-19.03333333,-169.86666666],"altSpellings":["Niuē"],"callingCode":"+683"},{"name":{"common":"Norfolk Island","official":"Territory of Norfolk Island"},"cca2":"NF","cca3":"NFK","flag":"🇳🇫","capital":["Kingston"],"currencies":{"AUD":{"name":"Australian dollar","symbol":"$"}},"languages":{"eng":"English","pih":"Norfuk"},"population":2188,"timezones":["UTC+12:00"],"idd":{"root":"+6","suffixes":["72"]},"car":{"side":"left"},"region":"Oceania","subregion":"Australia and New Zealand","continents":["Oceania"],"area":36,"latlng":[-29.03333333,167.95],"altSpellings":["Territory of Norfolk Island","Teratri of Norf'k Ailen","Norfolk Island"],"callingCode":"+672"},{"name":{"common":"North Korea","official":"Democratic People's Republic of Korea"},"cca2":"KP","cca3":"PRK","flag":"🇰🇵","capital":["Pyongyang"],"currencies":{"KPW":{"name":"North Korean won","symbol":"₩"}},"languages":{"kor":"Korean"},"population":25950000,"timezones":["UTC+09:00"],"idd":{"root":"+8","suffixes":["50"]},"car":{"side":"right"},"region":"Asia","subregion":"Eastern Asia","continents":["Asia"],"area":120538,"latlng":[40,127],"altSpellings":["Democratic People's Republic of Korea","DPRK","조선민주주의인민공화국","Chosŏn Minjujuŭi Inmin Konghwaguk","Korea, Democratic People's Republic of","북한"],"callingCode":"+850"},{"name":{"common":"North Macedonia","official":"Republic of North Macedonia"},"cca2":"MK","cca3":"MKD","flag":"🇲🇰","capital":["Skopje"],"currencies":{"MKD":{"name":"denar","symbol":"den"}},"languages":{"mkd":"Macedonian"},"population":1826247,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["89"]},"car":{"side":"right"},"region":"Europe","subregion":"Southeast Europe","continents":["Europe"],"area":25713,"latlng":[41.83333333,22],"altSpellings":["The former Yugoslav Republic of Macedonia","Republic of North Macedonia","Macedonia, The Former Yugoslav Republic of","Република Северна Македонија","Macedonia","Северна Македонија"],"callingCode":"+389"},{"name":{"common":"Northern Mariana Islands","official":"Commonwealth of the Northern Mariana Islands"},"cca2":"MP","cca3":"MNP","flag":"🇲🇵","capital":["Saipan"],"currencies":{"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"cal":"Carolinian","cha":"Chamorro","eng":"English"},"population":47329,"timezones":["UTC+10:00"],"idd":{"root":"+1","suffixes":["670"]},"car":{"side":"right"},"region":"Oceania","subregion":"Micronesia","continents":["Oceania"],"area":464,"latlng":[15.2,145.75],"altSpellings":["Commonwealth of the Northern Mariana Islands","Sankattan Siha Na Islas Mariånas","Northern Mariana Islands"],"callingCode":"+1670"},{"name":{"common":"Norway","official":"Kingdom of Norway"},"cca2":"NO","cca3":"NOR","flag":"🇳🇴","capital":["Oslo"],"currencies":{"NOK":{"name":"Norwegian krone","symbol":"kr"}},"languages":{"nno":"Norwegian Nynorsk","nob":"Norwegian Bokmål","smi":"Sami"},"population":5606944,"timezones":["UTC+01:00"],"idd":{"root":"+4","suffixes":["7"]},"car":{"side":"right"},"region":"Europe","subregion":"Northern Europe","continents":["Europe"],"area":323802,"latlng":[62,10],"altSpellings":["Norge","Noreg","Kingdom of Norway","Kongeriket Norge","Kongeriket Noreg"],"callingCode":"+47"},{"name":{"common":"Oman","official":"Sultanate of Oman"},"cca2":"OM","cca3":"OMN","flag":"🇴🇲","capital":["Muscat"],"currencies":{"OMR":{"name":"Omani rial","symbol":"ر.ع."}},"languages":{"ara":"Arabic"},"population":5306976,"timezones":["UTC+04:00"],"idd":{"root":"+9","suffixes":["68"]},"car":{"side":"right"},"region":"Asia","subregion":"Western Asia","continents":["Asia"],"area":309500,"latlng":[21,57],"altSpellings":["Sultanate of Oman","Salṭanat ʻUmān","عمان"],"callingCode":"+968"},{"name":{"common":"Pakistan","official":"Islamic Republic of Pakistan"},"cca2":"PK","cca3":"PAK","flag":"🇵🇰","capital":["Islamabad"],"currencies":{"PKR":{"name":"Pakistani rupee","symbol":"₨"}},"languages":{"eng":"English","urd":"Urdu"},"population":241499431,"timezones":["UTC+05:00"],"idd":{"root":"+9","suffixes":["2"]},"car":{"side":"left"},"region":"Asia","subregion":"Southern Asia","continents":["Asia"],"area":881912,"latlng":[30,70],"altSpellings":["Pākistān","Islamic Republic of Pakistan","Islāmī Jumhūriya'eh Pākistān","پاکستان"],"callingCode":"+92"},{"name":{"common":"Palau","official":"Republic of Palau"},"cca2":"PW","cca3":"PLW","flag":"🇵🇼","capital":["Ngerulmud"],"currencies":{"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"eng":"English","pau":"Palauan"},"population":16733,"timezones":["UTC+09:00"],"idd":{"root":"+6","suffixes":["80"]},"car":{"side":"right"},"region":"Oceania","subregion":"Micronesia","continents":["Oceania"],"area":459,"latlng":[7.5,134.5],"altSpellings":["Republic of Palau","Beluu er a Belau","Palau"],"callingCode":"+680"},{"name":{"common":"Palestine","official":"State of Palestine"},"cca2":"PS","cca3":"PSE","flag":"🇵🇸","capital":["Ramallah"],"currencies":{"EGP":{"name":"Egyptian pound","symbol":"E£"},"ILS":{"name":"Israeli new shekel","symbol":"₪"},"JOD":{"name":"Jordanian dinar","symbol":"JD"}},"languages":{"ara":"Arabic"},"population":5483450,"timezones":["UTC+02:00"],"idd":{"root":"+9","suffixes":["70"]},"car":{"side":"right"},"region":"Asia","subregion":"Western Asia","continents":["Asia"],"area":6220,"latlng":[31.9,35.2],"altSpellings":["Palestine, State of","State of Palestine","Dawlat Filasṭin","فلسطين"],"callingCode":"+970"},{"name":{"common":"Panama","official":"Republic of Panama"},"cca2":"PA","cca3":"PAN","flag":"🇵🇦","capital":["Panama City"],"currencies":{"PAB":{"name":"Panamanian balboa","symbol":"B/."},"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"spa":"Spanish"},"population":4064780,"timezones":["UTC-05:00"],"idd":{"root":"+5","suffixes":["07"]},"car":{"side":"right"},"region":"Americas","subregion":"Central America","continents":["North America"],"area":75417,"latlng":[9,-80],"altSpellings":["Republic of Panama","República de Panamá","Panamá"],"callingCode":"+507"},{"name":{"common":"Papua New Guinea","official":"Independent State of Papua New Guinea"},"cca2":"PG","cca3":"PNG","flag":"🇵🇬","capital":["Port Moresby"],"currencies":{"PGK":{"name":"Papua New Guinean kina","symbol":"K"}},"languages":{"eng":"English","hmo":"Hiri Motu","tpi":"Tok Pisin"},"population":11781559,"timezones":["UTC+10:00","UTC+11:00"],"idd":{"root":"+6","suffixes":["75"]},"car":{"side":"left"},"region":"Oceania","subregion":"Melanesia","continents":["Oceania"],"area":462840,"latlng":[-6,147],"altSpellings":["Independent State of Papua New Guinea","Independen Stet bilong Papua Niugini","Papua Niugini"],"callingCode":"+675"},{"name":{"common":"Paraguay","official":"Republic of Paraguay"},"cca2":"PY","cca3":"PRY","flag":"🇵🇾","capital":["Asunción"],"currencies":{"PYG":{"name":"Paraguayan guaraní","symbol":"₲"}},"languages":{"grn":"Guaraní","spa":"Spanish"},"population":6109644,"timezones":["UTC-03:00"],"idd":{"root":"+5","suffixes":["95"]},"car":{"side":"right"},"region":"Americas","subregion":"South America","continents":["South America"],"area":406752,"latlng":[-23,-58],"altSpellings":["Republic of Paraguay","República del Paraguay","Tetã Paraguái","Paraguay"],"callingCode":"+595"},{"name":{"common":"Peru","official":"Republic of Peru"},"cca2":"PE","cca3":"PER","flag":"🇵🇪","capital":["Lima"],"currencies":{"PEN":{"name":"Peruvian sol","symbol":"S/."}},"languages":{"aym":"Aymara","que":"Quechua","spa":"Spanish"},"population":34350244,"timezones":["UTC-05:00"],"idd":{"root":"+5","suffixes":["1"]},"car":{"side":"right"},"region":"Americas","subregion":"South America","continents":["South America"],"area":1285216,"latlng":[-10,-76],"altSpellings":["Republic of Peru","República del Perú","Perú"],"callingCode":"+51"},{"name":{"common":"Philippines","official":"Republic of the Philippines"},"cca2":"PH","cca3":"PHL","flag":"🇵🇭","capital":["Manila"],"currencies":{"PHP":{"name":"Philippine peso","symbol":"₱"}},"languages":{"eng":"English","fil":"Filipino"},"population":114123600,"timezones":["UTC+08:00"],"idd":{"root":"+6","suffixes":["3"]},"car":{"side":"right"},"region":"Asia","subregion":"South-Eastern Asia","continents":["Asia"],"area":342353,"latlng":[13,122],"altSpellings":["Republic of the Philippines","Repúblika ng Pilipinas","Pilipinas"],"callingCode":"+63"},{"name":{"common":"Pitcairn Islands","official":"Pitcairn Group of Islands"},"cca2":"PN","cca3":"PCN","flag":"🇵🇳","capital":["Adamstown"],"currencies":{"NZD":{"name":"New Zealand dollar","symbol":"$"}},"languages":{"eng":"English"},"population":35,"timezones":["UTC-08:00"],"idd":{"root":"+6","suffixes":["4"]},"car":{"side":"left"},"region":"Oceania","subregion":"Polynesia","continents":["Oceania"],"area":47,"latlng":[-25.06666666,-130.1],"altSpellings":["Pitcairn","Pitcairn Henderson Ducie and Oeno Islands","Pitcairn Islands"],"callingCode":"+64"},{"name":{"common":"Poland","official":"Republic of Poland"},"cca2":"PL","cca3":"POL","flag":"🇵🇱","capital":["Warsaw"],"currencies":{"PLN":{"name":"Polish złoty","symbol":"zł"}},"languages":{"pol":"Polish"},"population":37401000,"timezones":["UTC+01:00"],"idd":{"root":"+4","suffixes":["8"]},"car":{"side":"right"},"region":"Europe","subregion":"Central Europe","continents":["Europe"],"area":312679,"latlng":[52,20],"altSpellings":["Republic of Poland","Rzeczpospolita Polska","Polska"],"callingCode":"+48"},{"name":{"common":"Portugal","official":"Portuguese Republic"},"cca2":"PT","cca3":"PRT","flag":"🇵🇹","capital":["Lisbon"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"por":"Portuguese"},"population":10749635,"timezones":["UTC-01:00","UTC±00"],"idd":{"root":"+3","suffixes":["51"]},"car":{"side":"right"},"region":"Europe","subregion":"Southern Europe","continents":["Europe"],"area":92090,"latlng":[39.5,-8],"altSpellings":["Portuguesa","Portuguese Republic","República Portuguesa","Portugal"],"callingCode":"+351"},{"name":{"common":"Puerto Rico","official":"Commonwealth of Puerto Rico"},"cca2":"PR","cca3":"PRI","flag":"🇵🇷","capital":["San Juan"],"currencies":{"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"eng":"English","spa":"Spanish"},"population":3203295,"timezones":["UTC-04:00"],"idd":{"root":"+1","suffixes":["787","939"]},"car":{"side":"right"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":8870,"latlng":[18.25,-66.5],"altSpellings":["Commonwealth of Puerto Rico","Estado Libre Asociado de Puerto Rico","Puerto Rico"],"callingCode":"+1"},{"name":{"common":"Qatar","official":"State of Qatar"},"cca2":"QA","cca3":"QAT","flag":"🇶🇦","capital":["Doha"],"currencies":{"QAR":{"name":"Qatari riyal","symbol":"ر.ق"}},"languages":{"ara":"Arabic"},"population":3173024,"timezones":["UTC+03:00"],"idd":{"root":"+9","suffixes":["74"]},"car":{"side":"right"},"region":"Asia","subregion":"Western Asia","continents":["Asia"],"area":11586,"latlng":[25.5,51.25],"altSpellings":["State of Qatar","Dawlat Qaṭar","قطر"],"callingCode":"+974"},{"name":{"common":"Republic of the Congo","official":"Republic of the Congo"},"cca2":"CG","cca3":"COG","flag":"🇨🇬","capital":["Brazzaville"],"currencies":{"XAF":{"name":"Central African CFA franc","symbol":"Fr"}},"languages":{"fra":"French","kon":"Kikongo","lin":"Lingala"},"population":6142180,"timezones":["UTC+01:00"],"idd":{"root":"+2","suffixes":["42"]},"car":{"side":"right"},"region":"Africa","subregion":"Middle Africa","continents":["Africa"],"area":342000,"latlng":[-1,15],"altSpellings":["Congo","Congo-Brazzaville","République du Congo"],"callingCode":"+242"},{"name":{"common":"Romania","official":"Romania"},"cca2":"RO","cca3":"ROU","flag":"🇷🇴","capital":["Bucharest"],"currencies":{"RON":{"name":"Romanian leu","symbol":"lei"}},"languages":{"ron":"Romanian"},"population":19036031,"timezones":["UTC+02:00"],"idd":{"root":"+4","suffixes":["0"]},"car":{"side":"right"},"region":"Europe","subregion":"Southeast Europe","continents":["Europe"],"area":238391,"latlng":[46,25],"altSpellings":["Rumania","Roumania","România"],"callingCode":"+40"},{"name":{"common":"Russia","official":"Russian Federation"},"cca2":"RU","cca3":"RUS","flag":"🇷🇺","capital":["Moscow"],"currencies":{"RUB":{"name":"Russian ruble","symbol":"₽"}},"languages":{"rus":"Russian"},"population":146028325,"timezones":["UTC+02:00","UTC+03:00","UTC+04:00","UTC+05:00","UTC+06:00","UTC+07:00","UTC+08:00","UTC+09:00","UTC+10:00","UTC+11:00","UTC+12:00"],"idd":{"root":"+7","suffixes":["3","4","5","8","9"]},"car":{"side":"right"},"region":"Europe","subregion":"Eastern Europe","continents":["Europe"],"area":17098242,"latlng":[60,100],"altSpellings":["Russian Federation","Российская Федерация","Россия"],"callingCode":"+7"},{"name":{"common":"Rwanda","official":"Republic of Rwanda"},"cca2":"RW","cca3":"RWA","flag":"🇷🇼","capital":["Kigali"],"currencies":{"RWF":{"name":"Rwandan franc","symbol":"Fr"}},"languages":{"eng":"English","fra":"French","kin":"Kinyarwanda"},"population":14104969,"timezones":["UTC+02:00"],"idd":{"root":"+2","suffixes":["50"]},"car":{"side":"right"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":26338,"latlng":[-2,30],"altSpellings":["Republic of Rwanda","Repubulika y'u Rwanda","République du Rwanda","Rwanda"],"callingCode":"+250"},{"name":{"common":"Réunion","official":"Réunion Island"},"cca2":"RE","cca3":"REU","flag":"🇷🇪","capital":["Saint-Denis"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"fra":"French"},"population":896175,"timezones":["UTC+04:00"],"idd":{"root":"+2","suffixes":["62"]},"car":{"side":"right"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":2511,"latlng":[-21.15,55.5],"altSpellings":["Reunion","La Réunion"],"callingCode":"+262"},{"name":{"common":"Saint Barthélemy","official":"Collectivity of Saint Barthélemy"},"cca2":"BL","cca3":"BLM","flag":"🇧🇱","capital":["Gustavia"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"fra":"French"},"population":10562,"timezones":["UTC-04:00"],"idd":{"root":"+5","suffixes":["90"]},"car":{"side":"right"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":21,"latlng":[18.5,-63.41666666],"altSpellings":["St. Barthelemy","Collectivity of Saint Barthélemy","Collectivité de Saint-Barthélemy","Saint-Barthélemy"],"callingCode":"+590"},{"name":{"common":"Saint Helena, Ascension and Tristan da Cunha","official":"Saint Helena, Ascension and Tristan da Cunha"},"cca2":"SH","cca3":"SHN","flag":"🇸🇭","capital":["Jamestown"],"currencies":{"GBP":{"name":"Pound sterling","symbol":"£"},"SHP":{"name":"Saint Helena pound","symbol":"£"}},"languages":{"eng":"English"},"population":5651,"timezones":["UTC±00"],"idd":{"root":"+2","suffixes":["90","47"]},"car":{"side":"left"},"region":"Africa","subregion":"Western Africa","continents":["Africa"],"area":394,"latlng":[-15.95,-5.72],"altSpellings":["Saint Helena","St. Helena, Ascension and Tristan da Cunha"],"callingCode":"+2"},{"name":{"common":"Saint Kitts and Nevis","official":"Federation of Saint Christopher and Nevis"},"cca2":"KN","cca3":"KNA","flag":"🇰🇳","capital":["Basseterre"],"currencies":{"XCD":{"name":"Eastern Caribbean dollar","symbol":"$"}},"languages":{"eng":"English"},"population":51320,"timezones":["UTC-04:00"],"idd":{"root":"+1","suffixes":["869"]},"car":{"side":"left"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":261,"latlng":[17.33333333,-62.75],"altSpellings":["Federation of Saint Christopher and Nevis","Saint Kitts and Nevis"],"callingCode":"+1869"},{"name":{"common":"Saint Lucia","official":"Saint Lucia"},"cca2":"LC","cca3":"LCA","flag":"🇱🇨","capital":["Castries"],"currencies":{"XCD":{"name":"Eastern Caribbean dollar","symbol":"$"}},"languages":{"eng":"English"},"population":184100,"timezones":["UTC-04:00"],"idd":{"root":"+1","suffixes":["758"]},"car":{"side":"left"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":616,"latlng":[13.88333333,-60.96666666],"altSpellings":["Saint Lucia"],"callingCode":"+1758"},{"name":{"common":"Saint Martin","official":"Saint Martin"},"cca2":"MF","cca3":"MAF","flag":"🇲🇫","capital":["Marigot"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"fra":"French"},"population":31496,"timezones":["UTC-04:00"],"idd":{"root":"+5","suffixes":["90"]},"car":{"side":"right"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":53,"latlng":[18.08333333,-63.95],"altSpellings":["Collectivity of Saint Martin","Collectivité de Saint-Martin","Saint Martin (French part)","Saint-Martin"],"callingCode":"+590"},{"name":{"common":"Saint Pierre and Miquelon","official":"Saint Pierre and Miquelon"},"cca2":"PM","cca3":"SPM","flag":"🇵🇲","capital":["Saint-Pierre"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"fra":"French"},"population":5819,"timezones":["UTC-03:00"],"idd":{"root":"+5","suffixes":["08"]},"car":{"side":"right"},"region":"Americas","subregion":"North America","continents":["North America"],"area":242,"latlng":[46.83333333,-56.33333333],"altSpellings":["Collectivité territoriale de Saint-Pierre-et-Miquelon","Saint-Pierre-et-Miquelon"],"callingCode":"+508"},{"name":{"common":"Saint Vincent and the Grenadines","official":"Saint Vincent and the Grenadines"},"cca2":"VC","cca3":"VCT","flag":"🇻🇨","capital":["Kingstown"],"currencies":{"XCD":{"name":"Eastern Caribbean dollar","symbol":"$"}},"languages":{"eng":"English"},"population":110872,"timezones":["UTC-04:00"],"idd":{"root":"+1","suffixes":["784"]},"car":{"side":"left"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":389,"latlng":[13.25,-61.2],"altSpellings":["Saint Vincent and the Grenadines"],"callingCode":"+1784"},{"name":{"common":"Samoa","official":"Independent State of Samoa"},"cca2":"WS","cca3":"WSM","flag":"🇼🇸","capital":["Apia"],"currencies":{"WST":{"name":"Samoan tālā","symbol":"T"}},"languages":{"eng":"English","smo":"Samoan"},"population":205557,"timezones":["UTC+14:00"],"idd":{"root":"+6","suffixes":["85"]},"car":{"side":"left"},"region":"Oceania","subregion":"Polynesia","continents":["Oceania"],"area":2842,"latlng":[-13.58333333,-172.33333333],"altSpellings":["Independent State of Samoa","Malo Saʻoloto Tutoʻatasi o Sāmoa","Samoa"],"callingCode":"+685"},{"name":{"common":"San Marino","official":"Most Serene Republic of San Marino"},"cca2":"SM","cca3":"SMR","flag":"🇸🇲","capital":["City of San Marino"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"ita":"Italian"},"population":34132,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["78"]},"car":{"side":"right"},"region":"Europe","subregion":"Southern Europe","continents":["Europe"],"area":61,"latlng":[43.76666666,12.41666666],"altSpellings":["Republic of San Marino","Repubblica di San Marino","San Marino"],"callingCode":"+378"},{"name":{"common":"Saudi Arabia","official":"Kingdom of Saudi Arabia"},"cca2":"SA","cca3":"SAU","flag":"🇸🇦","capital":["Riyadh"],"currencies":{"SAR":{"name":"Saudi riyal","symbol":"ر.س"}},"languages":{"ara":"Arabic"},"population":35300280,"timezones":["UTC+03:00"],"idd":{"root":"+9","suffixes":["66"]},"car":{"side":"right"},"region":"Asia","subregion":"Western Asia","continents":["Asia"],"area":2149690,"latlng":[25,45],"altSpellings":["Saudi","Kingdom of Saudi Arabia","Al-Mamlakah al-‘Arabiyyah as-Su‘ūdiyyah","المملكة العربية السعودية"],"callingCode":"+966"},{"name":{"common":"Senegal","official":"Republic of Senegal"},"cca2":"SN","cca3":"SEN","flag":"🇸🇳","capital":["Dakar"],"currencies":{"XOF":{"name":"West African CFA franc","symbol":"Fr"}},"languages":{"fra":"French"},"population":18593258,"timezones":["UTC±00"],"idd":{"root":"+2","suffixes":["21"]},"car":{"side":"right"},"region":"Africa","subregion":"Western Africa","continents":["Africa"],"area":196722,"latlng":[14,-14],"altSpellings":["Republic of Senegal","République du Sénégal","Sénégal"],"callingCode":"+221"},{"name":{"common":"Serbia","official":"Republic of Serbia"},"cca2":"RS","cca3":"SRB","flag":"🇷🇸","capital":["Belgrade"],"currencies":{"RSD":{"name":"Serbian dinar","symbol":"дин."}},"languages":{"srp":"Serbian"},"population":6567783,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["81"]},"car":{"side":"right"},"region":"Europe","subregion":"Southeast Europe","continents":["Europe"],"area":88361,"latlng":[44,21],"altSpellings":["Srbija","Republika Srbija","Србија","Република Србија","Republic of Serbia"],"callingCode":"+381"},{"name":{"common":"Seychelles","official":"Republic of Seychelles"},"cca2":"SC","cca3":"SYC","flag":"🇸🇨","capital":["Victoria"],"currencies":{"SCR":{"name":"Seychellois rupee","symbol":"₨"}},"languages":{"crs":"Seychellois Creole","eng":"English","fra":"French"},"population":122729,"timezones":["UTC+04:00"],"idd":{"root":"+2","suffixes":["48"]},"car":{"side":"left"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":452,"latlng":[-4.58333333,55.66666666],"altSpellings":["Republic of Seychelles","Repiblik Sesel","République des Seychelles","Seychelles"],"callingCode":"+248"},{"name":{"common":"Sierra Leone","official":"Republic of Sierra Leone"},"cca2":"SL","cca3":"SLE","flag":"🇸🇱","capital":["Freetown"],"currencies":{"SLL":{"name":"Sierra Leonean leone","symbol":"Le"}},"languages":{"eng":"English"},"population":9077691,"timezones":["UTC±00"],"idd":{"root":"+2","suffixes":["32"]},"car":{"side":"right"},"region":"Africa","subregion":"Western Africa","continents":["Africa"],"area":71740,"latlng":[8.5,-11.5],"altSpellings":["Republic of Sierra Leone","Sierra Leone"],"callingCode":"+232"},{"name":{"common":"Singapore","official":"Republic of Singapore"},"cca2":"SG","cca3":"SGP","flag":"🇸🇬","capital":["Singapore"],"currencies":{"SGD":{"name":"Singapore dollar","symbol":"$"}},"languages":{"eng":"English","msa":"Malay","tam":"Tamil","zho":"Chinese"},"population":6036900,"timezones":["UTC+08:00"],"idd":{"root":"+6","suffixes":["5"]},"car":{"side":"left"},"region":"Asia","subregion":"South-Eastern Asia","continents":["Asia"],"area":710,"latlng":[1.36666666,103.8],"altSpellings":["Singapura","Republik Singapura","新加坡共和国","Singapore"],"callingCode":"+65"},{"name":{"common":"Sint Maarten","official":"Sint Maarten"},"cca2":"SX","cca3":"SXM","flag":"🇸🇽","capital":["Philipsburg"],"currencies":{"ANG":{"name":"Netherlands Antillean guilder","symbol":"ƒ"}},"languages":{"eng":"English","fra":"French","nld":"Dutch"},"population":41349,"timezones":["UTC-04:00"],"idd":{"root":"+1","suffixes":["721"]},"car":{"side":"right"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":34,"latlng":[18.033333,-63.05],"altSpellings":["Sint Maarten (Dutch part)","Sint Maarten"],"callingCode":"+1721"},{"name":{"common":"Slovakia","official":"Slovak Republic"},"cca2":"SK","cca3":"SVK","flag":"🇸🇰","capital":["Bratislava"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"slk":"Slovak"},"population":5413813,"timezones":["UTC+01:00"],"idd":{"root":"+4","suffixes":["21"]},"car":{"side":"right"},"region":"Europe","subregion":"Central Europe","continents":["Europe"],"area":49037,"latlng":[48.66666666,19.5],"altSpellings":["Slovak Republic","Slovenská republika","Slovensko"],"callingCode":"+421"},{"name":{"common":"Slovenia","official":"Republic of Slovenia"},"cca2":"SI","cca3":"SVN","flag":"🇸🇮","capital":["Ljubljana"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"slv":"Slovene"},"population":2130638,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["86"]},"car":{"side":"right"},"region":"Europe","subregion":"Central Europe","continents":["Europe"],"area":20273,"latlng":[46.11666666,14.81666666],"altSpellings":["Republic of Slovenia","Republika Slovenija","Slovenija"],"callingCode":"+386"},{"name":{"common":"Solomon Islands","official":"Solomon Islands"},"cca2":"SB","cca3":"SLB","flag":"🇸🇧","capital":["Honiara"],"currencies":{"SBD":{"name":"Solomon Islands dollar","symbol":"$"}},"languages":{"eng":"English"},"population":750325,"timezones":["UTC+11:00"],"idd":{"root":"+6","suffixes":["77"]},"car":{"side":"left"},"region":"Oceania","subregion":"Melanesia","continents":["Oceania"],"area":28896,"latlng":[-8,159],"altSpellings":["Solomon Islands"],"callingCode":"+677"},{"name":{"common":"Somalia","official":"Federal Republic of Somalia"},"cca2":"SO","cca3":"SOM","flag":"🇸🇴","capital":["Mogadishu"],"currencies":{"SOS":{"name":"Somali shilling","symbol":"Sh"}},"languages":{"ara":"Arabic","som":"Somali"},"population":19655000,"timezones":["UTC+03:00"],"idd":{"root":"+2","suffixes":["52"]},"car":{"side":"right"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":637657,"latlng":[10,49],"altSpellings":["aṣ-Ṣūmāl","Federal Republic of Somalia","Jamhuuriyadda Federaalka Soomaaliya","Jumhūriyyat aṣ-Ṣūmāl al-Fiderāliyya","Soomaaliya"],"callingCode":"+252"},{"name":{"common":"South Africa","official":"Republic of South Africa"},"cca2":"ZA","cca3":"ZAF","flag":"🇿🇦","capital":["Pretoria","Bloemfontein","Cape Town"],"currencies":{"ZAR":{"name":"South African rand","symbol":"R"}},"languages":{"afr":"Afrikaans","eng":"English","nbl":"Southern Ndebele","nso":"Northern Sotho","sot":"Southern Sotho","ssw":"Swazi","tsn":"Tswana","tso":"Tsonga","ven":"Venda","xho":"Xhosa","zul":"Zulu"},"population":63100945,"timezones":["UTC+02:00"],"idd":{"root":"+2","suffixes":["7"]},"car":{"side":"left"},"region":"Africa","subregion":"Southern Africa","continents":["Africa"],"area":1221037,"latlng":[-29,24],"altSpellings":["RSA","Suid-Afrika","Republic of South Africa","South Africa"],"callingCode":"+27"},{"name":{"common":"South Georgia","official":"South Georgia and the South Sandwich Islands"},"cca2":"GS","cca3":"SGS","flag":"🇬🇸","capital":["King Edward Point"],"currencies":{"SHP":{"name":"Saint Helena pound","symbol":"£"}},"languages":{"eng":"English"},"population":0,"timezones":["UTC-02:00"],"idd":{"root":"+5","suffixes":["00"]},"car":{"side":"right"},"region":"Antarctic","subregion":"South America","continents":["Antarctica"],"area":3903,"latlng":[-54.5,-37],"altSpellings":["South Georgia and the South Sandwich Islands","South Georgia"],"callingCode":"+500"},{"name":{"common":"South Korea","official":"Republic of Korea"},"cca2":"KR","cca3":"KOR","flag":"🇰🇷","capital":["Seoul"],"currencies":{"KRW":{"name":"South Korean won","symbol":"₩"}},"languages":{"kor":"Korean"},"population":51159889,"timezones":["UTC+09:00"],"idd":{"root":"+8","suffixes":["2"]},"car":{"side":"right"},"region":"Asia","subregion":"Eastern Asia","continents":["Asia"],"area":100210,"latlng":[37,127.5],"altSpellings":["Korea, Republic of","Republic of Korea","남조선","대한민국"],"callingCode":"+82"},{"name":{"common":"South Sudan","official":"Republic of South Sudan"},"cca2":"SS","cca3":"SSD","flag":"🇸🇸","capital":["Juba"],"currencies":{"SSP":{"name":"South Sudanese pound","symbol":"£"}},"languages":{"eng":"English"},"population":15786898,"timezones":["UTC+03:00"],"idd":{"root":"+2","suffixes":["11"]},"car":{"side":"right"},"region":"Africa","subregion":"Middle Africa","continents":["Africa"],"area":619745,"latlng":[7,30],"altSpellings":["South Sudan"],"callingCode":"+211"},{"name":{"common":"Spain","official":"Kingdom of Spain"},"cca2":"ES","cca3":"ESP","flag":"🇪🇸","capital":["Madrid"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"spa":"Spanish"},"population":49315949,"timezones":["UTC±00","UTC+01:00"],"idd":{"root":"+3","suffixes":["4"]},"car":{"side":"right"},"region":"Europe","subregion":"Southern Europe","continents":["Europe"],"area":505992,"latlng":[40,-4],"altSpellings":["Kingdom of Spain","Reino de España","España"],"callingCode":"+34"},{"name":{"common":"Sri Lanka","official":"Democratic Socialist Republic of Sri Lanka"},"cca2":"LK","cca3":"LKA","flag":"🇱🇰","capital":["Colombo"],"currencies":{"LKR":{"name":"Sri Lankan rupee","symbol":"Rs  රු"}},"languages":{"sin":"Sinhala","tam":"Tamil"},"population":21763170,"timezones":["UTC+05:30"],"idd":{"root":"+9","suffixes":["4"]},"car":{"side":"left"},"region":"Asia","subregion":"Southern Asia","continents":["Asia"],"area":65610,"latlng":[7,81],"altSpellings":["ilaṅkai","Democratic Socialist Republic of Sri Lanka","śrī laṃkāva"],"callingCode":"+94"},{"name":{"common":"Sudan","official":"Republic of the Sudan"},"cca2":"SD","cca3":"SDN","flag":"🇸🇩","capital":["Khartoum"],"currencies":{"SDG":{"name":"Sudanese pound","symbol":"PT"}},"languages":{"ara":"Arabic","eng":"English"},"population":51662000,"timezones":["UTC+02:00"],"idd":{"root":"+2","suffixes":["49"]},"car":{"side":"right"},"region":"Africa","subregion":"Northern Africa","continents":["Africa"],"area":1886068,"latlng":[15,30],"altSpellings":["Republic of the Sudan","Jumhūrīyat as-Sūdān","السودان"],"callingCode":"+249"},{"name":{"common":"Suriname","official":"Republic of Suriname"},"cca2":"SR","cca3":"SUR","flag":"🇸🇷","capital":["Paramaribo"],"currencies":{"SRD":{"name":"Surinamese dollar","symbol":"$"}},"languages":{"nld":"Dutch"},"population":616500,"timezones":["UTC-03:00"],"idd":{"root":"+5","suffixes":["97"]},"car":{"side":"left"},"region":"Americas","subregion":"South America","continents":["South America"],"area":163820,"latlng":[4,-56],"altSpellings":["Sarnam","Sranangron","Republic of Suriname","Republiek Suriname","Suriname"],"callingCode":"+597"},{"name":{"common":"Svalbard and Jan Mayen","official":"Svalbard og Jan Mayen"},"cca2":"SJ","cca3":"SJM","flag":"🇸🇯","capital":["Longyearbyen"],"currencies":{"NOK":{"name":"krone","symbol":"kr"}},"languages":{"nor":"Norwegian"},"population":0,"timezones":["UTC+01:00"],"idd":{"root":"+4","suffixes":["779"]},"car":{"side":"right"},"region":"Europe","subregion":"Northern Europe","continents":["Europe"],"area":-1,"latlng":[78,20],"altSpellings":["Svalbard and Jan Mayen Islands","Svalbard og Jan Mayen"],"callingCode":"+4779"},{"name":{"common":"Sweden","official":"Kingdom of Sweden"},"cca2":"SE","cca3":"SWE","flag":"🇸🇪","capital":["Stockholm"],"currencies":{"SEK":{"name":"Swedish krona","symbol":"kr"}},"languages":{"swe":"Swedish"},"population":10596652,"timezones":["UTC+01:00"],"idd":{"root":"+4","suffixes":["6"]},"car":{"side":"right"},"region":"Europe","subregion":"Northern Europe","continents":["Europe"],"area":450295,"latlng":[62,15],"altSpellings":["Kingdom of Sweden","Konungariket Sverige","Sverige"],"callingCode":"+46"},{"name":{"common":"Switzerland","official":"Swiss Confederation"},"cca2":"CH","cca3":"CHE","flag":"🇨🇭","capital":["Bern"],"currencies":{"CHF":{"name":"Swiss franc","symbol":"Fr."}},"languages":{"fra":"French","gsw":"Swiss German","ita":"Italian","roh":"Romansh"},"population":9082848,"timezones":["UTC+01:00"],"idd":{"root":"+4","suffixes":["1"]},"car":{"side":"right"},"region":"Europe","subregion":"Western Europe","continents":["Europe"],"area":41284,"latlng":[47,8],"altSpellings":["Swiss Confederation","Schweiz","Suisse","Svizzera","Svizra"],"callingCode":"+41"},{"name":{"common":"Syria","official":"Syrian Arab Republic"},"cca2":"SY","cca3":"SYR","flag":"🇸🇾","capital":["Damascus"],"currencies":{"SYP":{"name":"Syrian pound","symbol":"£"}},"languages":{"ara":"Arabic"},"population":25620000,"timezones":["UTC+02:00"],"idd":{"root":"+9","suffixes":["63"]},"car":{"side":"right"},"region":"Asia","subregion":"Western Asia","continents":["Asia"],"area":185180,"latlng":[35,38],"altSpellings":["Syrian Arab Republic","Al-Jumhūrīyah Al-ʻArabīyah As-Sūrīyah","سوريا"],"callingCode":"+963"},{"name":{"common":"São Tomé and Príncipe","official":"Democratic Republic of São Tomé and Príncipe"},"cca2":"ST","cca3":"STP","flag":"🇸🇹","capital":["São Tomé"],"currencies":{"STN":{"name":"São Tomé and Príncipe dobra","symbol":"Db"}},"languages":{"por":"Portuguese"},"population":209607,"timezones":["UTC±00"],"idd":{"root":"+2","suffixes":["39"]},"car":{"side":"right"},"region":"Africa","subregion":"Middle Africa","continents":["Africa"],"area":964,"latlng":[1,7],"altSpellings":["Democratic Republic of São Tomé and Príncipe","Sao Tome and Principe","República Democrática de São Tomé e Príncipe","São Tomé e Príncipe"],"callingCode":"+239"},{"name":{"common":"Taiwan","official":"Republic of China (Taiwan)"},"cca2":"TW","cca3":"TWN","flag":"🇹🇼","capital":["Taipei"],"currencies":{"TWD":{"name":"New Taiwan dollar","symbol":"$"}},"languages":{"zho":"Chinese"},"population":23337936,"timezones":["UTC+08:00"],"idd":{"root":"+8","suffixes":["86"]},"car":{"side":"right"},"region":"Asia","subregion":"Eastern Asia","continents":["Asia"],"area":36193,"latlng":[23.5,121],"altSpellings":["Táiwān","Republic of China","中華民國","Zhōnghuá Mínguó","Chinese Taipei","臺灣"],"callingCode":"+886"},{"name":{"common":"Tajikistan","official":"Republic of Tajikistan"},"cca2":"TJ","cca3":"TJK","flag":"🇹🇯","capital":["Dushanbe"],"currencies":{"TJS":{"name":"Tajikistani somoni","symbol":"ЅМ"}},"languages":{"rus":"Russian","tgk":"Tajik"},"population":10499000,"timezones":["UTC+05:00"],"idd":{"root":"+9","suffixes":["92"]},"car":{"side":"right"},"region":"Asia","subregion":"Central Asia","continents":["Asia"],"area":143100,"latlng":[39,71],"altSpellings":["Toçikiston","Republic of Tajikistan","Ҷумҳурии Тоҷикистон","Çumhuriyi Toçikiston","Тоҷикистон"],"callingCode":"+992"},{"name":{"common":"Tanzania","official":"United Republic of Tanzania"},"cca2":"TZ","cca3":"TZA","flag":"🇹🇿","capital":["Dodoma"],"currencies":{"TZS":{"name":"Tanzanian shilling","symbol":"Sh"}},"languages":{"eng":"English","swa":"Swahili"},"population":68153004,"timezones":["UTC+03:00"],"idd":{"root":"+2","suffixes":["55"]},"car":{"side":"left"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":945087,"latlng":[-6,35],"altSpellings":["Tanzania, United Republic of","United Republic of Tanzania","Jamhuri ya Muungano wa Tanzania","Tanzania"],"callingCode":"+255"},{"name":{"common":"Thailand","official":"Kingdom of Thailand"},"cca2":"TH","cca3":"THA","flag":"🇹🇭","capital":["Bangkok"],"currencies":{"THB":{"name":"Thai baht","symbol":"฿"}},"languages":{"tha":"Thai"},"population":65859640,"timezones":["UTC+07:00"],"idd":{"root":"+6","suffixes":["6"]},"car":{"side":"left"},"region":"Asia","subregion":"South-Eastern Asia","continents":["Asia"],"area":513120,"latlng":[15,100],"altSpellings":["Prathet","Thai","Kingdom of Thailand","ราชอาณาจักรไทย","Ratcha Anachak Thai","ประเทศไทย"],"callingCode":"+66"},{"name":{"common":"Timor-Leste","official":"Democratic Republic of Timor-Leste"},"cca2":"TL","cca3":"TLS","flag":"🇹🇱","capital":["Dili"],"currencies":{"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"por":"Portuguese","tet":"Tetum"},"population":1391221,"timezones":["UTC+09:00"],"idd":{"root":"+6","suffixes":["70"]},"car":{"side":"left"},"region":"Asia","subregion":"South-Eastern Asia","continents":["Asia"],"area":14874,"latlng":[-8.83333333,125.91666666],"altSpellings":["East Timor","Timor","Democratic Republic of Timor-Leste","República Democrática de Timor-Leste","Repúblika Demokrátika Timór-Leste","Timor-Leste"],"callingCode":"+670"},{"name":{"common":"Togo","official":"Togolese Republic"},"cca2":"TG","cca3":"TGO","flag":"🇹🇬","capital":["Lomé"],"currencies":{"XOF":{"name":"West African CFA franc","symbol":"Fr"}},"languages":{"fra":"French"},"population":8095498,"timezones":["UTC±00"],"idd":{"root":"+2","suffixes":["28"]},"car":{"side":"right"},"region":"Africa","subregion":"Western Africa","continents":["Africa"],"area":56785,"latlng":[8,1.16666666],"altSpellings":["Togolese","Togolese Republic","République Togolaise","Togo"],"callingCode":"+228"},{"name":{"common":"Tokelau","official":"Tokelau"},"cca2":"TK","cca3":"TKL","flag":"🇹🇰","capital":["Fakaofo"],"currencies":{"NZD":{"name":"New Zealand dollar","symbol":"$"}},"languages":{"eng":"English","smo":"Samoan","tkl":"Tokelauan"},"population":1647,"timezones":["UTC+13:00"],"idd":{"root":"+6","suffixes":["90"]},"car":{"side":"right"},"region":"Oceania","subregion":"Polynesia","continents":["Oceania"],"area":12,"latlng":[-9,-172],"altSpellings":["Tokelau"],"callingCode":"+690"},{"name":{"common":"Tonga","official":"Kingdom of Tonga"},"cca2":"TO","cca3":"TON","flag":"🇹🇴","capital":["Nuku'alofa"],"currencies":{"TOP":{"name":"Tongan paʻanga","symbol":"T$"}},"languages":{"eng":"English","ton":"Tongan"},"population":100179,"timezones":["UTC+13:00"],"idd":{"root":"+6","suffixes":["76"]},"car":{"side":"left"},"region":"Oceania","subregion":"Polynesia","continents":["Oceania"],"area":747,"latlng":[-20,-175],"altSpellings":["Tonga"],"callingCode":"+676"},{"name":{"common":"Trinidad and Tobago","official":"Republic of Trinidad and Tobago"},"cca2":"TT","cca3":"TTO","flag":"🇹🇹","capital":["Port of Spain"],"currencies":{"TTD":{"name":"Trinidad and Tobago dollar","symbol":"$"}},"languages":{"eng":"English"},"population":1368333,"timezones":["UTC-04:00"],"idd":{"root":"+1","suffixes":["868"]},"car":{"side":"left"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":5130,"latlng":[11,-61],"altSpellings":["Republic of Trinidad and Tobago","Trinidad and Tobago"],"callingCode":"+1868"},{"name":{"common":"Tunisia","official":"Tunisian Republic"},"cca2":"TN","cca3":"TUN","flag":"🇹🇳","capital":["Tunis"],"currencies":{"TND":{"name":"Tunisian dinar","symbol":"د.ت"}},"languages":{"ara":"Arabic"},"population":11972169,"timezones":["UTC+01:00"],"idd":{"root":"+2","suffixes":["16"]},"car":{"side":"right"},"region":"Africa","subregion":"Northern Africa","continents":["Africa"],"area":163610,"latlng":[34,9],"altSpellings":["Republic of Tunisia","al-Jumhūriyyah at-Tūnisiyyah","تونس"],"callingCode":"+216"},{"name":{"common":"Turkmenistan","official":"Turkmenistan"},"cca2":"TM","cca3":"TKM","flag":"🇹🇲","capital":["Ashgabat"],"currencies":{"TMT":{"name":"Turkmenistan manat","symbol":"m"}},"languages":{"rus":"Russian","tuk":"Turkmen"},"population":7057841,"timezones":["UTC+05:00"],"idd":{"root":"+9","suffixes":["93"]},"car":{"side":"right"},"region":"Asia","subregion":"Central Asia","continents":["Asia"],"area":488100,"latlng":[40,60],"altSpellings":["Türkmenistan"],"callingCode":"+993"},{"name":{"common":"Turks and Caicos Islands","official":"Turks and Caicos Islands"},"cca2":"TC","cca3":"TCA","flag":"🇹🇨","capital":["Cockburn Town"],"currencies":{"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"eng":"English"},"population":50894,"timezones":["UTC-05:00"],"idd":{"root":"+1","suffixes":["649"]},"car":{"side":"left"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":948,"latlng":[21.75,-71.58333333],"altSpellings":["Turks and Caicos Islands"],"callingCode":"+1649"},{"name":{"common":"Tuvalu","official":"Tuvalu"},"cca2":"TV","cca3":"TUV","flag":"🇹🇻","capital":["Funafuti"],"currencies":{"AUD":{"name":"Australian dollar","symbol":"$"},"TVD":{"name":"Tuvaluan dollar","symbol":"$"}},"languages":{"eng":"English","tvl":"Tuvaluan"},"population":10643,"timezones":["UTC+12:00"],"idd":{"root":"+6","suffixes":["88"]},"car":{"side":"left"},"region":"Oceania","subregion":"Polynesia","continents":["Oceania"],"area":26,"latlng":[-8,178],"altSpellings":["Tuvalu"],"callingCode":"+688"},{"name":{"common":"Türkiye","official":"Republic of Türkiye"},"cca2":"TR","cca3":"TUR","flag":"🇹🇷","capital":["Ankara"],"currencies":{"TRY":{"name":"Turkish lira","symbol":"₺"}},"languages":{"tur":"Turkish"},"population":85664944,"timezones":["UTC+03:00"],"idd":{"root":"+9","suffixes":["0"]},"car":{"side":"right"},"region":"Asia","subregion":"Western Asia","continents":["Asia"],"area":783562,"latlng":[39,35],"altSpellings":["Turkiye","Republic of Turkey","Türkiye Cumhuriyeti","Türkiye"],"callingCode":"+90"},{"name":{"common":"Uganda","official":"Republic of Uganda"},"cca2":"UG","cca3":"UGA","flag":"🇺🇬","capital":["Kampala"],"currencies":{"UGX":{"name":"Ugandan shilling","symbol":"Sh"}},"languages":{"eng":"English","swa":"Swahili"},"population":45905417,"timezones":["UTC+03:00"],"idd":{"root":"+2","suffixes":["56"]},"car":{"side":"left"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":241550,"latlng":[1,32],"altSpellings":["Republic of Uganda","Jamhuri ya Uganda","Uganda"],"callingCode":"+256"},{"name":{"common":"Ukraine","official":"Ukraine"},"cca2":"UA","cca3":"UKR","flag":"🇺🇦","capital":["Kyiv"],"currencies":{"UAH":{"name":"Ukrainian hryvnia","symbol":"₴"}},"languages":{"ukr":"Ukrainian"},"population":32862000,"timezones":["UTC+02:00","UTC+03:00"],"idd":{"root":"+3","suffixes":["80"]},"car":{"side":"right"},"region":"Europe","subregion":"Eastern Europe","continents":["Europe"],"area":603500,"latlng":[49,32],"altSpellings":["Ukrayina","Україна"],"callingCode":"+380"},{"name":{"common":"United Arab Emirates","official":"United Arab Emirates"},"cca2":"AE","cca3":"ARE","flag":"🇦🇪","capital":["Abu Dhabi"],"currencies":{"AED":{"name":"United Arab Emirates dirham","symbol":"د.إ"}},"languages":{"ara":"Arabic"},"population":10678556,"timezones":["UTC+04:00"],"idd":{"root":"+9","suffixes":["71"]},"car":{"side":"right"},"region":"Asia","subregion":"Western Asia","continents":["Asia"],"area":83600,"latlng":[24,54],"altSpellings":["UAE","Emirates","دولة الإمارات العربية المتحدة"],"callingCode":"+971"},{"name":{"common":"United Kingdom","official":"United Kingdom of Great Britain and Northern Ireland"},"cca2":"GB","cca3":"GBR","flag":"🇬🇧","capital":["London"],"currencies":{"GBP":{"name":"British pound","symbol":"£"}},"languages":{"eng":"English"},"population":68265209,"timezones":["UTC±00"],"idd":{"root":"+4","suffixes":["4"]},"car":{"side":"left"},"region":"Europe","subregion":"Northern Europe","continents":["Europe"],"area":242900,"latlng":[54,-2],"altSpellings":["Great Britain","United Kingdom"],"callingCode":"+44"},{"name":{"common":"United States","official":"United States of America"},"cca2":"US","cca3":"USA","flag":"🇺🇸","capital":["Washington D.C."],"currencies":{"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"eng":"English"},"population":340110988,"timezones":["UTC-10:00","UTC-09:00","UTC-08:00","UTC-07:00","UTC-06:00","UTC-05:00"],"idd":{"root":"+1","suffixes":["201","202","203","205","206","207","208","209","210","212","213","214","215","216","217","218","219","220","223","224","225","227","228","229","231","234","239","240","248","251","252","253","254","256","260","262","267","269","270","272","274","276","279","281","283","301","302","303","304","305","307","308","309","310","312","313","314","315","316","317","318","319","320","321","323","325","326","327","330","331","332","334","336","337","339","341","346","347","351","352","360","361","364","380","385","386","401","402","404","405","406","407","408","409","410","412","413","414","415","417","419","423","424","425","430","432","434","435","440","442","443","445","447","448","458","463","464","469","470","475","478","479","480","484","500","501","502","503","504","505","507","508","509","510","512","513","515","516","517","518","520","521","522","523","524","525","526","527","528","529","530","531","532","533","534","535","538","539","540","541","542","543","544","545","546","547","549","550","551","552","553","554","556","557","558","559","561","562","563","564","566","567","569","570","571","572","573","574","575","577","578","580","582","585","586","588","589","601","602","603","605","606","607","608","609","610","612","614","615","616","617","618","619","620","623","626","628","629","630","631","636","640","641","646","650","651","656","657","659","660","661","662","667","669","678","679","680","681","682","689","700","701","702","703","704","706","707","708","710","712","713","714","715","716","717","718","719","720","724","725","726","727","730","731","732","734","737","740","743","747","754","757","760","762","763","765","769","770","771","772","773","774","775","779","781","785","786","801","802","803","804","805","806","808","810","812","813","814","815","816","817","818","820","826","828","830","831","832","838","839","840","843","845","847","848","850","854","856","857","858","859","860","862","863","864","865","870","872","878","901","903","904","906","907","908","909","910","912","913","914","915","916","917","918","919","920","925","928","929","930","931","934","936","937","938","940","941","943","945","947","948","949","951","952","954","956","959","970","971","972","973","975","978","979","980","983","984","985","986","989"]},"car":{"side":"right"},"region":"Americas","subregion":"North America","continents":["North America"],"area":9372610,"latlng":[38,-97],"altSpellings":["USA","United States of America","United States"],"callingCode":"+1"},{"name":{"common":"United States Minor Outlying Islands","official":"United States Minor Outlying Islands"},"cca2":"UM","cca3":"UMI","flag":"🇺🇲","capital":[],"currencies":{"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"eng":"English"},"population":0,"timezones":["UTC-11:00","UTC+12:00"],"idd":{"root":"+2","suffixes":["68"]},"car":{"side":"right"},"region":"Americas","subregion":"North America","continents":["North America"],"area":34.2,"latlng":[19.3,166.633333],"altSpellings":["United States Minor Outlying Islands"],"callingCode":"+268"},{"name":{"common":"United States Virgin Islands","official":"Virgin Islands of the United States"},"cca2":"VI","cca3":"VIR","flag":"🇻🇮","capital":["Charlotte Amalie"],"currencies":{"USD":{"name":"United States dollar","symbol":"$"}},"languages":{"eng":"English"},"population":87146,"timezones":["UTC-04:00"],"idd":{"root":"+1","suffixes":["340"]},"car":{"side":"left"},"region":"Americas","subregion":"Caribbean","continents":["North America"],"area":347,"latlng":[18.35,-64.933333],"altSpellings":["Virgin Islands, U.S.","United States Virgin Islands"],"callingCode":"+1340"},{"name":{"common":"Uruguay","official":"Oriental Republic of Uruguay"},"cca2":"UY","cca3":"URY","flag":"🇺🇾","capital":["Montevideo"],"currencies":{"UYU":{"name":"Uruguayan peso","symbol":"$"}},"languages":{"spa":"Spanish"},"population":3499451,"timezones":["UTC-03:00"],"idd":{"root":"+5","suffixes":["98"]},"car":{"side":"right"},"region":"Americas","subregion":"South America","continents":["South America"],"area":181034,"latlng":[-33,-56],"altSpellings":["Oriental Republic of Uruguay","República Oriental del Uruguay","Uruguay"],"callingCode":"+598"},{"name":{"common":"Uzbekistan","official":"Republic of Uzbekistan"},"cca2":"UZ","cca3":"UZB","flag":"🇺🇿","capital":["Tashkent"],"currencies":{"UZS":{"name":"Uzbekistani soʻm","symbol":"so'm"}},"languages":{"rus":"Russian","uzb":"Uzbek"},"population":37859698,"timezones":["UTC+05:00"],"idd":{"root":"+9","suffixes":["98"]},"car":{"side":"right"},"region":"Asia","subregion":"Central Asia","continents":["Asia"],"area":447400,"latlng":[41,64],"altSpellings":["Republic of Uzbekistan","O‘zbekiston Respublikasi","Ўзбекистон Республикаси","O‘zbekiston"],"callingCode":"+998"},{"name":{"common":"Vanuatu","official":"Republic of Vanuatu"},"cca2":"VU","cca3":"VUT","flag":"🇻🇺","capital":["Port Vila"],"currencies":{"VUV":{"name":"Vanuatu vatu","symbol":"Vt"}},"languages":{"bis":"Bislama","eng":"English","fra":"French"},"population":321409,"timezones":["UTC+11:00"],"idd":{"root":"+6","suffixes":["78"]},"car":{"side":"right"},"region":"Oceania","subregion":"Melanesia","continents":["Oceania"],"area":12189,"latlng":[-16,167],"altSpellings":["Republic of Vanuatu","Ripablik blong Vanuatu","République de Vanuatu","Vanuatu"],"callingCode":"+678"},{"name":{"common":"Vatican City","official":"Vatican City State"},"cca2":"VA","cca3":"VAT","flag":"🇻🇦","capital":["Vatican City"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"ita":"Italian","lat":"Latin"},"population":882,"timezones":["UTC+01:00"],"idd":{"root":"+3","suffixes":["906698","79"]},"car":{"side":"right"},"region":"Europe","subregion":"Southern Europe","continents":["Europe"],"area":0.44,"latlng":[41.9,12.45],"altSpellings":["Holy See (Vatican City State)","Vatican City State","Vatican","Stato della Città del Vaticano","Vaticano"],"callingCode":"+3"},{"name":{"common":"Venezuela","official":"Bolivarian Republic of Venezuela"},"cca2":"VE","cca3":"VEN","flag":"🇻🇪","capital":["Caracas"],"currencies":{"VES":{"name":"Venezuelan bolívar soberano","symbol":"Bs.S."}},"languages":{"spa":"Spanish"},"population":28517000,"timezones":["UTC-04:00"],"idd":{"root":"+5","suffixes":["8"]},"car":{"side":"right"},"region":"Americas","subregion":"South America","continents":["South America"],"area":916445,"latlng":[8,-66],"altSpellings":["Bolivarian Republic of Venezuela","Venezuela, Bolivarian Republic of","República Bolivariana de Venezuela","Venezuela"],"callingCode":"+58"},{"name":{"common":"Vietnam","official":"Socialist Republic of Vietnam"},"cca2":"VN","cca3":"VNM","flag":"🇻🇳","capital":["Hanoi"],"currencies":{"VND":{"name":"Vietnamese đồng","symbol":"₫"}},"languages":{"vie":"Vietnamese"},"population":101343800,"timezones":["UTC+07:00"],"idd":{"root":"+8","suffixes":["4"]},"car":{"side":"right"},"region":"Asia","subregion":"South-Eastern Asia","continents":["Asia"],"area":331212,"latlng":[16.16666666,107.83333333],"altSpellings":["Socialist Republic of Vietnam","Cộng hòa Xã hội chủ nghĩa Việt Nam","Viet Nam","Việt Nam"],"callingCode":"+84"},{"name":{"common":"Wallis and Futuna","official":"Territory of the Wallis and Futuna Islands"},"cca2":"WF","cca3":"WLF","flag":"🇼🇫","capital":["Mata-Utu"],"currencies":{"XPF":{"name":"CFP franc","symbol":"₣"}},"languages":{"fra":"French"},"population":11620,"timezones":["UTC+12:00"],"idd":{"root":"+6","suffixes":["81"]},"car":{"side":"right"},"region":"Oceania","subregion":"Polynesia","continents":["Oceania"],"area":142,"latlng":[-13.3,-176.2],"altSpellings":["Territory of the Wallis and Futuna Islands","Territoire des îles Wallis et Futuna","Wallis et Futuna"],"callingCode":"+681"},{"name":{"common":"Western Sahara","official":"Sahrawi Arab Democratic Republic"},"cca2":"EH","cca3":"ESH","flag":"🇪🇭","capital":["El Aaiún"],"currencies":{"DZD":{"name":"Algerian dinar","symbol":"دج"},"MAD":{"name":"Moroccan dirham","symbol":"DH"},"MRU":{"name":"Mauritanian ouguiya","symbol":"UM"}},"languages":{"ber":"Berber","mey":"Hassaniya","spa":"Spanish"},"population":600904,"timezones":["UTC+01:00"],"idd":{"root":"+2","suffixes":["125288","125289"]},"car":{"side":"right"},"region":"Africa","subregion":"Northern Africa","continents":["Africa"],"area":266000,"latlng":[24.5,-13],"altSpellings":["Taneẓroft Tutrimt","الصحراء الغربية"],"callingCode":"+2"},{"name":{"common":"Yemen","official":"Republic of Yemen"},"cca2":"YE","cca3":"YEM","flag":"🇾🇪","capital":["Sana'a"],"currencies":{"YER":{"name":"Yemeni rial","symbol":"﷼"}},"languages":{"ara":"Arabic"},"population":32684503,"timezones":["UTC+03:00"],"idd":{"root":"+9","suffixes":["67"]},"car":{"side":"right"},"region":"Asia","subregion":"Western Asia","continents":["Asia"],"area":527968,"latlng":[15,48],"altSpellings":["Yemeni Republic","al-Jumhūriyyah al-Yamaniyyah","اليَمَن"],"callingCode":"+967"},{"name":{"common":"Zambia","official":"Republic of Zambia"},"cca2":"ZM","cca3":"ZMB","flag":"🇿🇲","capital":["Lusaka"],"currencies":{"ZMW":{"name":"Zambian kwacha","symbol":"ZK"}},"languages":{"eng":"English"},"population":19693423,"timezones":["UTC+02:00"],"idd":{"root":"+2","suffixes":["60"]},"car":{"side":"left"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":752612,"latlng":[-15,30],"altSpellings":["Republic of Zambia","Zambia"],"callingCode":"+260"},{"name":{"common":"Zimbabwe","official":"Republic of Zimbabwe"},"cca2":"ZW","cca3":"ZWE","flag":"🇿🇼","capital":["Harare"],"currencies":{"BWP":{"name":"Botswana pula","symbol":"P"},"CNY":{"name":"Chinese yuan","symbol":"¥"},"EUR":{"name":"Euro","symbol":"€"},"GBP":{"name":"British pound","symbol":"£"},"INR":{"name":"Indian rupee","symbol":"₹"},"JPY":{"name":"Japanese yen","symbol":"¥"},"USD":{"name":"United States dollar","symbol":"$"},"ZAR":{"name":"South African rand","symbol":"Rs"},"ZWB":{"name":"Zimbabwean bonds","symbol":"$"}},"languages":{"bwg":"Chibarwe","eng":"English","kck":"Kalanga","khi":"Khoisan","ndc":"Ndau","nde":"Northern Ndebele","nya":"Chewa","sna":"Shona","sot":"Sotho","toi":"Tonga","tsn":"Tswana","tso":"Tsonga","ven":"Venda","xho":"Xhosa","zib":"Zimbabwean Sign Language"},"population":17073087,"timezones":["UTC+02:00"],"idd":{"root":"+2","suffixes":["63"]},"car":{"side":"left"},"region":"Africa","subregion":"Eastern Africa","continents":["Africa"],"area":390757,"latlng":[-20,30],"altSpellings":["Republic of Zimbabwe","Zimbabwe"],"callingCode":"+263"},{"name":{"common":"Åland Islands","official":"Åland Islands"},"cca2":"AX","cca3":"ALA","flag":"🇦🇽","capital":["Mariehamn"],"currencies":{"EUR":{"name":"Euro","symbol":"€"}},"languages":{"swe":"Swedish"},"population":30654,"timezones":["UTC+02:00"],"idd":{"root":"+3","suffixes":["5818"]},"car":{"side":"right"},"region":"Europe","subregion":"Northern Europe","continents":["Europe"],"area":1580,"latlng":[60.116667,19.9],"altSpellings":["Aaland","Aland","Ahvenanmaa","Åland"],"callingCode":"+35818"}];

/* ---- India, full claimed boundary ---- */
const INDIA_FULL = {"type":"Feature","id":"IN","properties":{"name":"India","id":"IN"},"geometry":{"type":"MultiPolygon","coordinates":[[[[77.519,35.486],[77.63,35.462],[77.651,35.487],[77.688,35.453],[77.815,35.522],[77.911,35.462],[77.938,35.559],[78.04,35.587],[78.091,35.533],[78.157,35.551],[78.197,35.64],[78.182,35.667],[78.244,35.725],[78.409,35.731],[78.441,35.781],[78.536,35.763],[78.673,35.852],[78.8,35.87],[78.856,35.974],[79.028,35.914],[79.078,35.947],[79.27,35.927],[79.343,35.988],[79.442,35.968],[79.456,35.872],[79.489,35.849],[79.572,35.897],[79.572,35.813],[79.639,35.778],[79.704,35.639],[79.817,35.627],[79.846,35.575],[79.954,35.634],[79.999,35.602],[79.966,35.554],[80.055,35.423],[80.183,35.509],[80.166,35.553],[80.205,35.575],[80.358,35.529],[80.412,35.477],[80.412,35.426],[80.286,35.354],[80.283,35.204],[80.255,35.206],[80.195,35.118],[80.234,34.99],[80.186,34.946],[80.205,34.891],[80.137,34.869],[80.099,34.775],[80.067,34.762],[80.074,34.706],[79.952,34.674],[79.898,34.696],[79.787,34.627],[79.794,34.48],[79.702,34.486],[79.623,34.45],[79.538,34.479],[79.509,34.454],[79.603,34.307],[79.607,34.238],[79.491,34.191],[79.486,34.126],[79.416,34.1],[79.403,34.002],[79.19,34.025],[79.099,33.99],[78.995,34.037],[78.887,33.973],[79.028,33.754],[79.012,33.685],[79.09,33.637],[79.004,33.607],[78.907,33.62],[78.886,33.576],[78.914,33.555],[78.94,33.38],[78.963,33.339],[79.027,33.32],[79.107,33.2],[79.152,33.182],[79.217,33.238],[79.302,33.191],[79.408,33.189],[79.331,33.001],[79.364,32.938],[79.4,32.942],[79.39,32.917],[79.471,32.879],[79.481,32.801],[79.557,32.759],[79.548,32.677],[79.452,32.604],[79.413,32.52],[79.351,32.529],[79.331,32.565],[79.276,32.556],[79.248,32.517],[79.132,32.481],[79.1,32.371],[79.014,32.381],[78.968,32.336],[78.779,32.479],[78.757,32.567],[78.781,32.616],[78.74,32.696],[78.634,32.645],[78.633,32.605],[78.516,32.615],[78.395,32.53],[78.472,32.442],[78.454,32.386],[78.51,32.303],[78.488,32.276],[78.596,32.198],[78.631,32.126],[78.683,32.115],[78.734,32.005],[78.78,31.994],[78.74,31.842],[78.702,31.807],[78.751,31.68],[78.799,31.682],[78.847,31.609],[78.72,31.509],[78.797,31.444],[78.75,31.368],[78.778,31.312],[78.9,31.29],[78.944,31.366],[79.019,31.349],[79.019,31.427],[79.099,31.455],[79.171,31.399],[79.171,31.363],[79.236,31.335],[79.226,31.261],[79.301,31.219],[79.312,31.148],[79.413,31.108],[79.427,31.023],[79.507,31.032],[79.553,30.957],[79.603,30.94],[79.752,31.006],[79.866,30.972],[79.931,30.881],[80.008,30.866],[80.112,30.78],[80.173,30.809],[80.213,30.753],[80.239,30.762],[80.249,30.72],[80.193,30.666],[80.218,30.58],[80.315,30.565],[80.345,30.52],[80.418,30.524],[80.541,30.449],[80.607,30.471],[80.734,30.401],[80.802,30.323],[81.031,30.247],[81.045,30.206],[80.997,30.186],[80.933,30.177],[80.91,30.223],[80.863,30.169],[80.878,30.129],[80.761,30.05],[80.747,30.006],[80.674,29.957],[80.603,29.959],[80.494,29.796],[80.435,29.806],[80.366,29.748],[80.42,29.639],[80.408,29.596],[80.343,29.553],[80.35,29.519],[80.287,29.477],[80.302,29.453],[80.243,29.444],[80.317,29.315],[80.297,29.205],[80.248,29.221],[80.272,29.142],[80.233,29.119],[80.183,29.137],[80.145,29.104],[80.135,29.007],[80.058,28.917],[80.075,28.824],[80.254,28.756],[80.361,28.635],[80.451,28.629],[80.517,28.552],[80.504,28.665],[80.569,28.688],[80.59,28.648],[80.668,28.642],[80.69,28.588],[80.768,28.566],[80.789,28.525],[80.866,28.49],[80.896,28.507],[80.916,28.458],[80.98,28.455],[80.965,28.438],[81.018,28.452],[81.034,28.397],[81.211,28.361],[81.233,28.289],[81.321,28.197],[81.318,28.134],[81.371,28.143],[81.375,28.177],[81.447,28.161],[81.478,28.083],[81.698,27.988],[81.885,27.857],[81.926,27.86],[81.968,27.929],[82.07,27.924],[82.121,27.866],[82.209,27.843],[82.449,27.679],[82.708,27.723],[82.758,27.586],[82.736,27.502],[82.929,27.501],[83.035,27.449],[83.188,27.454],[83.317,27.33],[83.409,27.413],[83.388,27.48],[83.614,27.469],[83.864,27.346],[83.884,27.377],[83.833,27.426],[83.847,27.445],[84.024,27.433],[84.098,27.517],[84.151,27.517],[84.149,27.486],[84.206,27.47],[84.208,27.442],[84.254,27.454],[84.292,27.385],[84.62,27.339],[84.689,27.221],[84.643,27.046],[84.793,26.996],[84.825,27.021],[84.892,26.97],[84.963,26.961],[84.969,26.916],[85.053,26.889],[85.024,26.854],[85.191,26.87],[85.177,26.81],[85.211,26.758],[85.334,26.742],[85.627,26.873],[85.729,26.808],[85.734,26.651],[85.851,26.609],[85.852,26.568],[85.947,26.613],[85.959,26.651],[86.027,26.667],[86.217,26.589],[86.333,26.619],[86.542,26.539],[86.57,26.497],[86.731,26.423],[86.766,26.459],[86.834,26.439],[86.894,26.462],[86.933,26.517],[87.015,26.532],[87.072,26.586],[87.091,26.45],[87.162,26.404],[87.26,26.41],[87.266,26.374],[87.341,26.347],[87.369,26.408],[87.466,26.44],[87.605,26.381],[87.677,26.436],[87.767,26.411],[87.793,26.469],[87.849,26.437],[87.888,26.487],[88.008,26.361],[88.091,26.426],[88.097,26.536],[88.186,26.738],[88.174,26.865],[88.12,26.95],[88.135,26.985],[88.037,27.037],[87.987,27.119],[88.067,27.336],[88.042,27.372],[88.075,27.432],[88.044,27.496],[88.197,27.791],[88.173,27.821],[88.196,27.854],[88.118,27.918],[88.142,27.965],[88.207,27.941],[88.238,27.97],[88.251,27.942],[88.34,27.986],[88.414,27.981],[88.495,28.055],[88.546,28.034],[88.554,28.082],[88.637,28.118],[88.671,28.074],[88.755,28.08],[88.836,28.015],[88.836,27.928],[88.868,27.92],[88.888,27.856],[88.857,27.816],[88.848,27.668],[88.763,27.566],[88.806,27.407],[88.921,27.327],[88.915,27.291],[88.802,27.249],[88.746,27.142],[88.872,27.109],[88.875,26.943],[88.921,26.994],[88.945,26.933],[89.021,26.941],[89.096,26.892],[89.134,26.807],[89.263,26.814],[89.379,26.862],[89.47,26.803],[89.557,26.813],[89.65,26.777],[89.626,26.723],[89.755,26.734],[89.775,26.702],[89.861,26.702],[89.862,26.738],[90.046,26.73],[90.194,26.774],[90.23,26.859],[90.3,26.848],[90.356,26.901],[90.417,26.905],[90.546,26.817],[90.717,26.77],[91.053,26.783],[91.097,26.822],[91.336,26.78],[91.408,26.84],[91.495,26.792],[91.69,26.807],[91.892,26.921],[92.056,26.847],[92.103,26.867],[92.121,26.961],[92.031,27.08],[92.027,27.169],[92.072,27.235],[92.038,27.258],[92.123,27.287],[92.065,27.327],[92.017,27.481],[91.767,27.465],[91.695,27.506],[91.652,27.483],[91.566,27.584],[91.584,27.608],[91.562,27.631],[91.629,27.7],[91.643,27.761],[91.848,27.761],[91.874,27.722],[91.924,27.717],[91.983,27.777],[92.057,27.78],[92.244,27.888],[92.293,27.872],[92.319,27.797],[92.424,27.835],[92.456,27.793],[92.5,27.851],[92.73,27.978],[92.732,28.054],[92.656,28.08],[92.677,28.151],[92.922,28.201],[92.947,28.262],[93.149,28.367],[93.192,28.494],[93.426,28.662],[93.623,28.685],[93.637,28.655],[93.712,28.665],[93.79,28.737],[93.915,28.741],[93.912,28.773],[93.975,28.821],[94.02,28.793],[94.028,28.853],[94.179,28.936],[94.261,28.932],[94.366,29.026],[94.277,29.094],[94.293,29.152],[94.379,29.154],[94.457,29.213],[94.541,29.22],[94.626,29.296],[94.697,29.315],[94.752,29.23],[94.804,29.208],[94.807,29.165],[94.884,29.179],[95.018,29.126],[94.995,29.174],[95.097,29.142],[95.104,29.096],[95.212,29.108],[95.263,29.068],[95.299,29.136],[95.413,29.126],[95.434,29.193],[95.458,29.137],[95.504,29.126],[95.502,29.192],[95.596,29.188],[95.606,29.236],[95.709,29.204],[95.743,29.226],[95.737,29.298],[95.812,29.348],[95.877,29.315],[95.966,29.376],[96.054,29.383],[96.136,29.346],[96.152,29.296],[96.264,29.246],[96.26,29.217],[96.303,29.192],[96.288,29.132],[96.2,29.099],[96.215,29.069],[96.187,29.037],[96.33,29.113],[96.364,29.042],[96.444,28.995],[96.448,28.94],[96.522,28.939],[96.523,28.862],[96.589,28.819],[96.573,28.783],[96.632,28.734],[96.641,28.68],[96.545,28.687],[96.514,28.582],[96.475,28.573],[96.466,28.523],[96.406,28.506],[96.474,28.496],[96.498,28.429],[96.493,28.542],[96.614,28.62],[96.687,28.59],[96.712,28.611],[96.76,28.519],[96.861,28.483],[96.925,28.353],[97.001,28.325],[97.078,28.371],[97.126,28.362],[97.284,28.231],[97.36,28.205],[97.312,28.062],[97.354,28.067],[97.395,28.012],[97.363,27.965],[97.366,27.877],[97.298,27.916],[97.247,27.9],[97.088,27.734],[97.032,27.749],[96.983,27.666],[96.935,27.662],[96.89,27.606],[96.935,27.508],[96.903,27.453],[97.164,27.142],[97.138,27.091],[97.063,27.092],[96.984,27.154],[96.868,27.185],[96.884,27.26],[96.797,27.346],[96.704,27.372],[96.606,27.366],[96.524,27.286],[96.441,27.306],[96.229,27.279],[96.023,27.18],[95.946,27.051],[95.802,27.015],[95.723,26.881],[95.667,26.903],[95.608,26.813],[95.525,26.823],[95.431,26.7],[95.303,26.651],[95.234,26.682],[95.149,26.616],[95.062,26.45],[95.132,26.378],[95.118,26.101],[95.186,26.073],[95.012,25.898],[95.049,25.76],[94.935,25.667],[94.882,25.591],[94.898,25.566],[94.846,25.561],[94.784,25.481],[94.683,25.466],[94.635,25.395],[94.576,25.214],[94.741,25.127],[94.744,25.037],[94.696,24.968],[94.714,24.935],[94.632,24.84],[94.605,24.713],[94.542,24.704],[94.509,24.594],[94.456,24.573],[94.426,24.481],[94.398,24.482],[94.408,24.44],[94.322,24.329],[94.157,23.848],[94.126,23.833],[94.096,23.889],[93.93,23.95],[93.808,23.927],[93.754,24.006],[93.624,24.011],[93.592,23.961],[93.56,23.982],[93.505,23.942],[93.414,24.074],[93.349,24.105],[93.328,24.081],[93.329,23.985],[93.395,23.924],[93.392,23.756],[93.438,23.687],[93.388,23.446],[93.401,23.384],[93.355,23.353],[93.385,23.135],[93.294,23.007],[93.229,23.012],[93.185,23.059],[93.127,23.044],[93.164,22.911],[93.131,22.907],[93.094,22.806],[93.095,22.672],[93.14,22.593],[93.106,22.527],[93.185,22.428],[93.202,22.264],[93.142,22.246],[93.151,22.176],[93.111,22.204],[93.038,22.195],[93.059,22.101],[93.005,22.105],[93.005,21.987],[92.951,22.03],[92.906,21.941],[92.863,22.063],[92.7,22.155],[92.68,22.012],[92.603,21.978],[92.603,22.062],[92.562,22.128],[92.606,22.124],[92.609,22.164],[92.522,22.56],[92.517,22.722],[92.474,22.747],[92.45,22.894],[92.371,22.936],[92.392,23.056],[92.358,23.103],[92.347,23.236],[92.404,23.241],[92.317,23.472],[92.28,23.719],[92.241,23.72],[92.215,23.652],[92.203,23.706],[92.148,23.736],[92.047,23.646],[91.957,23.734],[91.934,23.685],[91.97,23.478],[91.937,23.467],[91.943,23.435],[91.845,23.406],[91.762,23.3],[91.836,23.092],[91.774,23.069],[91.78,23.029],[91.721,22.988],[91.645,22.985],[91.619,22.937],[91.543,23.0],[91.491,23.158],[91.507,23.184],[91.45,23.219],[91.454,23.26],[91.418,23.256],[91.409,23.285],[91.381,23.209],[91.417,23.065],[91.347,23.102],[91.29,23.319],[91.32,23.36],[91.291,23.351],[91.249,23.49],[91.201,23.52],[91.213,23.551],[91.16,23.611],[91.156,23.671],[91.2,23.647],[91.208,23.687],[91.153,23.689],[91.157,23.742],[91.219,23.737],[91.254,23.837],[91.233,23.927],[91.276,23.923],[91.304,23.998],[91.379,23.975],[91.374,24.108],[91.586,24.073],[91.638,24.104],[91.666,24.234],[91.688,24.162],[91.763,24.142],[91.745,24.247],[91.816,24.21],[91.85,24.224],[91.845,24.191],[91.902,24.137],[91.94,24.268],[91.92,24.337],[91.957,24.357],[91.996,24.322],[91.97,24.385],[92.097,24.373],[92.137,24.425],[92.164,24.419],[92.155,24.523],[92.224,24.517],[92.254,24.678],[92.296,24.737],[92.232,24.9],[92.299,24.916],[92.4,24.849],[92.498,24.876],[92.489,24.948],[92.419,24.967],[92.425,25.03],[92.227,25.093],[92.207,25.111],[92.227,25.118],[92.062,25.188],[91.752,25.176],[91.747,25.141],[91.703,25.159],[91.638,25.123],[91.602,25.143],[91.612,25.176],[91.47,25.134],[91.268,25.207],[90.862,25.158],[90.78,25.186],[90.733,25.155],[90.666,25.166],[90.663,25.197],[90.441,25.145],[90.33,25.194],[90.119,25.223],[89.967,25.304],[89.838,25.293],[89.82,25.382],[89.882,25.617],[89.816,25.815],[89.887,25.945],[89.825,25.945],[89.871,25.981],[89.835,26.011],[89.819,25.988],[89.809,26.043],[89.79,26.018],[89.802,26.04],[89.774,26.038],[89.795,26.088],[89.747,26.158],[89.681,26.164],[89.701,26.174],[89.679,26.238],[89.634,26.229],[89.649,26.165],[89.609,26.181],[89.591,26.157],[89.63,26.119],[89.596,26.099],[89.63,26.107],[89.65,26.063],[89.605,26.064],[89.577,25.969],[89.54,25.97],[89.541,26.006],[89.431,26.011],[89.424,26.048],[89.356,26.008],[89.254,26.064],[89.267,26.094],[89.23,26.124],[89.155,26.138],[89.141,26.236],[89.1,26.28],[89.105,26.316],[89.123,26.287],[89.136,26.32],[89.084,26.322],[89.087,26.398],[88.994,26.413],[88.957,26.46],[88.905,26.409],[88.919,26.359],[88.958,26.362],[88.952,26.332],[88.987,26.348],[88.996,26.29],[89.06,26.293],[89.051,26.242],[88.959,26.24],[88.898,26.289],[88.862,26.273],[88.878,26.234],[88.842,26.231],[88.793,26.31],[88.666,26.263],[88.668,26.297],[88.709,26.288],[88.675,26.32],[88.746,26.322],[88.745,26.348],[88.703,26.335],[88.681,26.38],[88.702,26.389],[88.624,26.435],[88.623,26.471],[88.56,26.458],[88.485,26.541],[88.436,26.545],[88.399,26.627],[88.332,26.482],[88.353,26.448],[88.372,26.488],[88.485,26.46],[88.524,26.359],[88.458,26.377],[88.35,26.282],[88.35,26.22],[88.177,26.148],[88.157,26.079],[88.184,26.073],[88.183,26.025],[88.14,26.013],[88.086,25.917],[88.107,25.815],[88.151,25.776],[88.269,25.808],[88.266,25.783],[88.402,25.673],[88.454,25.665],[88.444,25.597],[88.5,25.584],[88.54,25.508],[88.609,25.516],[88.699,25.471],[88.707,25.5],[88.767,25.498],[88.76,25.526],[88.81,25.523],[88.841,25.364],[88.929,25.304],[89.009,25.303],[89.008,25.264],[88.956,25.255],[88.961,25.209],[88.936,25.211],[88.949,25.178],[88.923,25.165],[88.844,25.214],[88.806,25.171],[88.711,25.208],[88.566,25.175],[88.442,25.21],[88.453,25.037],[88.399,24.945],[88.34,24.94],[88.33,24.87],[88.276,24.898],[88.257,24.878],[88.224,24.962],[88.138,24.936],[88.175,24.86],[88.068,24.769],[88.009,24.668],[88.142,24.511],[88.334,24.382],[88.445,24.379],[88.526,24.345],[88.555,24.293],[88.57,24.327],[88.699,24.314],[88.735,24.279],[88.746,24.147],[88.699,24.121],[88.743,24.055],[88.729,23.994],[88.758,24.007],[88.769,23.982],[88.738,23.983],[88.733,23.911],[88.668,23.87],[88.575,23.862],[88.602,23.817],[88.556,23.785],[88.581,23.761],[88.558,23.649],[88.594,23.641],[88.58,23.603],[88.646,23.609],[88.654,23.556],[88.741,23.48],[88.801,23.497],[88.795,23.443],[88.764,23.448],[88.749,23.401],[88.765,23.367],[88.732,23.352],[88.746,23.308],[88.696,23.302],[88.719,23.255],[88.79,23.218],[88.812,23.256],[88.943,23.206],[88.996,23.215],[88.869,23.101],[88.88,23.007],[88.845,23.009],[88.86,22.943],[88.894,22.952],[88.909,22.88],[88.969,22.845],[88.912,22.757],[88.962,22.694],[88.926,22.652],[88.96,22.616],[88.938,22.56],[88.996,22.469],[88.985,22.326],[89.024,22.296],[88.996,22.286],[89.071,22.197],[89.071,22.149],[89.098,22.155],[89.04,22.102],[89.034,22.046],[89.076,21.998],[89.064,21.937],[89.007,21.94],[89.019,21.976],[88.995,21.951],[89.017,21.899],[88.986,21.896],[89.032,21.863],[89.002,21.809],[89.1,21.637],[89.057,21.612],[89.02,21.66],[89.027,21.599],[88.957,21.617],[88.945,21.666],[88.92,21.63],[88.886,21.658],[88.86,21.777],[88.832,21.768],[88.867,21.757],[88.849,21.616],[88.81,21.634],[88.819,21.684],[88.801,21.655],[88.723,21.678],[88.7,21.857],[88.727,21.975],[88.758,21.968],[88.779,22.014],[88.755,22.075],[88.685,22.067],[88.735,22.03],[88.72,22.003],[88.664,22.021],[88.639,22.076],[88.619,22.018],[88.599,22.031],[88.619,21.932],[88.579,21.976],[88.614,21.921],[88.586,21.889],[88.571,21.907],[88.555,21.815],[88.552,21.876],[88.527,21.852],[88.5,21.876],[88.518,21.948],[88.458,21.896],[88.491,21.841],[88.449,21.812],[88.478,21.788],[88.451,21.612],[88.43,21.607],[88.424,21.719],[88.434,21.62],[88.397,21.591],[88.38,21.675],[88.402,21.72],[88.365,21.731],[88.397,21.714],[88.368,21.682],[88.343,21.72],[88.307,21.73],[88.295,21.705],[88.275,21.734],[88.31,21.675],[88.286,21.599],[88.31,21.579],[88.247,21.561],[88.156,21.956],[88.224,22.075],[88.209,22.149],[88.181,22.191],[88.02,22.223],[88.022,22.2],[88.133,22.184],[88.19,22.104],[88.048,22.014],[87.974,21.854],[87.919,21.801],[87.876,21.817],[87.887,21.777],[87.804,21.696],[87.387,21.571],[87.348,21.583],[87.377,21.55],[87.187,21.555],[87.128,21.513],[87.092,21.537],[87.109,21.502],[87.039,21.478],[87.06,21.47],[86.912,21.338],[86.832,21.212],[86.827,21.137],[86.975,20.821],[86.967,20.782],[86.887,20.797],[86.868,20.775],[86.996,20.77],[87.003,20.712],[86.926,20.71],[86.964,20.695],[87.07,20.721],[86.769,20.503],[86.732,20.535],[86.762,20.503],[86.746,20.469],[86.716,20.479],[86.738,20.477],[86.735,20.416],[86.708,20.409],[86.788,20.377],[86.768,20.329],[86.674,20.294],[86.799,20.347],[86.521,20.185],[86.555,20.192],[86.423,20.002],[86.382,19.965],[86.378,19.991],[86.315,19.988],[86.372,19.952],[85.54,19.696],[85.592,19.702],[85.343,19.581],[85.083,19.378],[85.038,19.392],[85.08,19.372],[84.917,19.26],[84.909,19.279],[84.795,19.116],[84.746,19.117],[84.746,19.075],[84.793,19.114],[84.767,19.072],[84.558,18.79],[84.362,18.567],[84.335,18.577],[84.349,18.56],[84.307,18.532],[84.36,18.554],[84.138,18.351],[84.1,18.35],[84.132,18.343],[84.129,18.31],[83.952,18.214],[83.925,18.229],[83.94,18.21],[83.668,18.088],[83.578,18.014],[83.556,18.026],[83.544,17.964],[83.457,17.9],[83.455,17.923],[83.411,17.808],[83.215,17.59],[82.602,17.284],[82.306,17.038],[82.251,16.875],[82.356,16.851],[82.36,16.825],[82.362,16.943],[82.333,16.989],[82.371,16.909],[82.342,16.736],[82.269,16.707],[82.339,16.713],[82.334,16.688],[82.366,16.719],[82.346,16.729],[82.369,16.713],[82.309,16.597],[82.258,16.689],[82.3,16.585],[82.259,16.561],[82.305,16.56],[82.04,16.463],[81.963,16.397],[81.964,16.436],[81.951,16.393],[81.719,16.309],[81.717,16.365],[81.71,16.305],[81.547,16.345],[81.553,16.372],[81.267,16.293],[81.198,16.174],[81.152,15.972],[81.126,15.993],[81.139,15.965],[80.997,15.822],[81.031,15.761],[80.982,15.775],[81.013,15.757],[80.976,15.738],[80.959,15.759],[80.938,15.71],[80.898,15.755],[80.923,15.715],[80.832,15.701],[80.835,15.751],[80.813,15.742],[80.785,15.808],[80.787,15.854],[80.811,15.78],[80.805,15.842],[80.677,15.89],[80.522,15.857],[80.264,15.672],[80.232,15.542],[80.193,15.502],[80.215,15.504],[80.205,15.468],[80.1,15.321],[80.048,15.074],[80.078,14.809],[80.185,14.597],[80.14,14.565],[80.196,14.578],[80.168,14.339],[80.137,14.245],[80.104,14.252],[80.137,14.242],[80.126,14.066],[80.257,13.782],[80.236,13.644],[80.322,13.389],[80.328,13.44],[80.346,13.283],[80.328,13.233],[80.314,13.247],[80.305,13.091],[80.264,13.011],[80.25,12.803],[80.233,12.845],[80.23,12.787],[80.256,12.781],[80.156,12.462],[80.134,12.431],[80.115,12.454],[80.131,12.426],[79.972,12.235],[80.01,12.253],[79.873,12.04],[79.759,11.672],[79.78,11.701],[79.765,11.485],[79.782,11.5],[79.832,11.363],[79.761,11.379],[79.839,11.352],[79.857,11.196],[79.852,10.837],[79.827,10.817],[79.85,10.825],[79.881,10.311],[79.793,10.273],[79.798,10.305],[79.662,10.348],[79.658,10.323],[79.639,10.365],[79.581,10.312],[79.56,10.327],[79.603,10.347],[79.545,10.35],[79.543,10.324],[79.462,10.35],[79.492,10.328],[79.468,10.322],[79.524,10.315],[79.393,10.32],[79.294,10.26],[79.231,10.147],[79.268,10.04],[78.995,9.712],[78.9,9.487],[79.0,9.347],[78.959,9.34],[79.189,9.28],[78.861,9.251],[78.667,9.189],[78.66,9.152],[78.583,9.127],[78.492,9.141],[78.266,9.018],[78.172,8.884],[78.164,8.757],[78.125,8.762],[78.16,8.75],[78.197,8.788],[78.2,8.764],[78.11,8.639],[78.136,8.597],[78.115,8.58],[78.14,8.588],[78.131,8.495],[78.044,8.383],[78.07,8.374],[77.807,8.24],[77.747,8.175],[77.584,8.137],[77.55,8.074],[77.317,8.123],[77.012,8.35],[76.64,8.825],[76.546,8.9],[76.544,8.932],[76.569,8.913],[76.603,8.934],[76.573,8.927],[76.6,8.971],[76.662,8.954],[76.632,8.979],[76.666,8.994],[76.588,8.994],[76.539,8.934],[76.46,9.136],[76.487,9.115],[76.496,9.168],[76.471,9.143],[76.428,9.25],[76.458,9.142],[76.357,9.365],[76.236,9.96],[76.288,9.947],[76.27,10.033],[76.23,10.018],[76.243,9.973],[76.22,9.999],[76.168,10.18],[76.208,10.195],[76.155,10.188],[76.034,10.528],[76.065,10.543],[76.028,10.528],[75.92,10.778],[75.96,10.812],[75.917,10.794],[75.91,10.827],[75.912,10.785],[75.826,11.12],[75.87,11.124],[75.805,11.155],[75.827,11.179],[75.804,11.162],[75.78,11.222],[75.802,11.234],[75.778,11.228],[75.735,11.331],[75.758,11.36],[75.734,11.347],[75.689,11.44],[75.62,11.476],[75.543,11.711],[75.497,11.733],[75.487,11.78],[75.456,11.772],[75.463,11.804],[75.455,11.778],[75.355,11.862],[75.3,11.943],[75.345,11.933],[75.315,11.97],[75.281,11.995],[75.293,11.952],[75.232,12.022],[75.201,12.004],[75.131,12.212],[74.825,12.838],[74.869,12.839],[74.832,12.847],[74.814,12.908],[74.822,12.849],[74.781,13.09],[74.695,13.343],[74.691,13.444],[74.707,13.41],[74.72,13.452],[74.689,13.462],[74.666,13.631],[74.68,13.605],[74.679,13.634],[74.722,13.638],[74.68,13.65],[74.678,13.682],[74.67,13.637],[74.65,13.664],[74.59,13.919],[74.513,13.987],[74.503,14.023],[74.529,14.022],[74.502,14.027],[74.427,14.275],[74.517,14.242],[74.442,14.272],[74.427,14.309],[74.422,14.286],[74.41,14.415],[74.383,14.417],[74.35,14.502],[74.383,14.539],[74.372,14.562],[74.353,14.519],[74.311,14.518],[74.292,14.594],[74.35,14.604],[74.29,14.596],[74.268,14.624],[74.296,14.638],[74.255,14.705],[74.284,14.712],[74.233,14.745],[74.206,14.714],[74.118,14.771],[74.092,14.801],[74.12,14.799],[74.126,14.837],[74.162,14.817],[74.165,14.859],[74.115,14.841],[74.097,14.892],[74.041,14.917],[74.051,14.984],[73.913,15.083],[73.956,15.157],[73.898,15.328],[73.785,15.408],[73.877,15.396],[73.885,15.428],[73.789,15.459],[73.826,15.504],[73.77,15.49],[73.734,15.588],[73.79,15.652],[73.734,15.615],[73.691,15.713],[73.716,15.729],[73.653,15.741],[73.676,15.752],[73.666,15.808],[73.639,15.813],[73.629,15.871],[73.598,15.921],[73.511,15.938],[73.457,16.053],[73.456,16.212],[73.43,16.199],[73.413,16.272],[73.435,16.284],[73.409,16.274],[73.385,16.336],[73.428,16.372],[73.367,16.379],[73.469,16.413],[73.37,16.395],[73.358,16.441],[73.388,16.448],[73.353,16.443],[73.317,16.511],[73.337,16.56],[73.362,16.478],[73.361,16.507],[73.444,16.5],[73.362,16.524],[73.349,16.555],[73.41,16.557],[73.359,16.553],[73.319,16.598],[73.354,16.593],[73.373,16.629],[73.401,16.589],[73.402,16.616],[73.333,16.619],[73.345,16.692],[73.307,16.728],[73.346,16.828],[73.297,16.813],[73.289,16.879],[73.317,16.883],[73.278,16.891],[73.283,16.952],[73.297,16.98],[73.33,16.945],[73.33,16.968],[73.272,16.987],[73.257,17.048],[73.287,16.999],[73.291,17.033],[73.325,17.04],[73.282,17.038],[73.315,17.084],[73.285,17.079],[73.248,17.22],[73.191,17.297],[73.262,17.258],[73.26,17.284],[73.3,17.292],[73.24,17.291],[73.213,17.381],[73.172,17.399],[73.214,17.433],[73.189,17.441],[73.191,17.511],[73.14,17.558],[73.217,17.589],[73.171,17.58],[73.138,17.61],[73.116,17.68],[73.137,17.713],[73.089,17.834],[73.13,17.834],[73.091,17.84],[73.085,17.894],[73.054,17.902],[73.092,17.94],[73.031,17.949],[73.091,17.99],[73.02,17.991],[73.004,18.02],[73.04,18.052],[73.018,18.027],[72.992,18.052],[72.99,18.192],[72.933,18.217],[72.936,18.28],[72.967,18.279],[72.977,18.245],[73.073,18.217],[73.06,18.182],[73.102,18.142],[73.045,18.296],[73.086,18.319],[73.03,18.263],[72.921,18.347],[72.907,18.54],[72.965,18.535],[73.006,18.467],[72.968,18.54],[72.925,18.542],[72.857,18.694],[72.868,18.801],[72.913,18.792],[72.939,18.825],[72.997,18.778],[72.98,18.752],[73.016,18.715],[72.979,18.8],[73.013,18.802],[72.985,18.811],[72.989,18.865],[72.927,18.85],[72.909,18.897],[72.948,18.891],[72.95,18.946],[72.987,18.943],[72.957,18.969],[73.067,19.021],[73.001,19.004],[72.986,19.19],[72.93,19.087],[72.958,19.037],[72.914,18.997],[72.866,19.006],[72.806,18.893],[72.823,18.937],[72.79,18.947],[72.839,19.043],[72.805,19.143],[72.831,19.18],[72.797,19.129],[72.78,19.154],[72.841,19.254],[72.783,19.192],[72.786,19.305],[72.912,19.288],[72.854,19.35],[72.813,19.324],[72.777,19.348],[72.745,19.46],[72.889,19.524],[72.846,19.541],[72.781,19.504],[72.787,19.524],[72.73,19.529],[72.716,19.592],[72.748,19.599],[72.695,19.726],[72.715,19.745],[72.692,19.739],[72.697,19.802],[72.655,19.833],[72.692,19.863],[72.666,19.934],[72.711,19.969],[72.746,19.942],[72.708,20.072],[72.748,20.202],[72.783,20.211],[72.747,20.207],[72.754,20.29],[72.837,20.372],[72.83,20.442],[72.9,20.53],[72.89,20.627],[72.913,20.637],[72.887,20.637],[72.845,20.744],[72.93,20.759],[72.857,20.752],[72.854,20.824],[72.826,20.794],[72.783,20.919],[72.824,20.915],[72.824,20.95],[72.864,20.946],[72.833,20.96],[72.85,20.972],[72.758,20.929],[72.734,20.998],[72.728,21.054],[72.849,21.032],[72.798,21.05],[72.828,21.092],[72.778,21.065],[72.707,21.087],[72.71,21.131],[72.789,21.18],[72.733,21.144],[72.677,21.158],[72.64,21.08],[72.638,21.207],[72.662,21.226],[72.695,21.193],[72.742,21.198],[72.64,21.235],[72.646,21.267],[72.618,21.268],[72.639,21.298],[72.598,21.298],[72.636,21.319],[72.627,21.343],[72.686,21.355],[72.661,21.347],[72.646,21.387],[72.699,21.463],[72.762,21.448],[72.728,21.478],[72.646,21.446],[72.68,21.501],[72.823,21.61],[72.834,21.666],[72.928,21.676],[72.784,21.664],[72.738,21.69],[72.537,21.663],[72.527,21.711],[72.619,21.906],[72.652,21.947],[72.714,21.936],[72.75,21.973],[72.647,21.965],[72.537,21.896],[72.508,21.976],[72.586,22.205],[72.646,22.216],[72.761,22.174],[72.819,22.257],[72.876,22.23],[72.912,22.265],[72.84,22.282],[72.748,22.231],[72.535,22.305],[72.431,22.205],[72.38,22.337],[72.356,22.285],[72.326,22.308],[72.331,22.248],[72.283,22.245],[72.299,22.103],[72.235,22.012],[72.182,22.022],[72.238,22.0],[72.247,21.924],[72.163,21.96],[72.25,21.911],[72.25,21.81],[72.215,21.857],[72.166,21.81],[72.215,21.796],[72.238,21.709],[72.281,21.69],[72.306,21.627],[72.236,21.454],[72.11,21.301],[72.089,21.315],[72.111,21.199],[72.009,21.135],[71.898,21.113],[71.794,21.051],[71.778,21.068],[71.808,21.037],[71.765,21.066],[71.743,21.035],[71.775,21.039],[71.766,21.021],[71.514,20.955],[71.442,20.868],[71.365,20.872],[71.384,20.854],[71.208,20.806],[71.147,20.758],[71.087,20.77],[71.073,20.733],[70.972,20.728],[70.998,20.713],[70.981,20.7],[70.898,20.697],[70.878,20.728],[70.822,20.691],[70.45,20.849],[70.422,20.893],[70.363,20.902],[70.156,21.055],[69.777,21.455],[69.805,21.46],[69.775,21.458],[69.391,21.805],[69.396,21.855],[69.355,21.835],[69.26,21.914],[68.976,22.215],[68.935,22.307],[68.98,22.408],[69.068,22.479],[69.035,22.39],[69.192,22.418],[69.157,22.31],[69.227,22.256],[69.32,22.292],[69.331,22.328],[69.48,22.332],[69.524,22.369],[69.51,22.425],[69.551,22.399],[69.552,22.349],[69.59,22.365],[69.574,22.322],[69.594,22.352],[69.613,22.328],[69.622,22.365],[69.668,22.323],[69.646,22.357],[69.728,22.475],[69.74,22.429],[69.808,22.398],[69.832,22.45],[69.898,22.465],[69.921,22.438],[69.908,22.489],[69.986,22.545],[70.118,22.55],[70.107,22.52],[70.132,22.552],[70.174,22.542],[70.192,22.58],[70.216,22.57],[70.198,22.601],[70.255,22.682],[70.284,22.676],[70.26,22.718],[70.318,22.759],[70.351,22.885],[70.448,22.97],[70.396,22.98],[70.39,22.936],[70.352,22.923],[70.287,22.945],[70.235,22.979],[70.219,23.055],[70.224,22.953],[70.148,22.946],[70.12,22.962],[70.132,22.996],[70.107,22.964],[70.14,22.933],[70.1,22.908],[70.004,22.92],[69.898,22.871],[69.885,22.913],[69.875,22.867],[69.784,22.864],[69.782,22.835],[69.729,22.819],[69.717,22.744],[69.683,22.763],[69.711,22.738],[69.664,22.772],[69.661,22.748],[69.603,22.778],[69.613,22.757],[69.577,22.76],[69.569,22.796],[69.452,22.775],[69.352,22.818],[69.362,22.881],[69.35,22.818],[69.303,22.83],[69.324,22.844],[69.23,22.833],[69.225,22.876],[69.227,22.837],[69.196,22.836],[69.121,22.878],[69.142,22.896],[69.069,22.917],[69.076,22.952],[69.064,22.915],[69.009,22.947],[69.014,22.983],[68.991,22.954],[68.982,22.992],[68.962,22.968],[68.632,23.169],[68.721,23.134],[68.579,23.227],[68.63,23.22],[68.604,23.241],[68.662,23.273],[68.628,23.293],[68.679,23.302],[68.636,23.306],[68.608,23.367],[68.619,23.325],[68.576,23.347],[68.569,23.373],[68.599,23.366],[68.498,23.454],[68.509,23.494],[68.449,23.48],[68.485,23.517],[68.454,23.516],[68.469,23.551],[68.425,23.509],[68.428,23.558],[68.548,23.714],[68.811,23.879],[68.772,23.859],[68.762,23.884],[68.749,23.847],[68.659,23.859],[68.679,23.845],[68.582,23.814],[68.532,23.752],[68.515,23.78],[68.514,23.745],[68.464,23.774],[68.477,23.743],[68.434,23.736],[68.453,23.779],[68.427,23.819],[68.4,23.637],[68.37,23.624],[68.392,23.606],[68.35,23.582],[68.266,23.556],[68.29,23.598],[68.272,23.625],[68.254,23.568],[68.172,23.617],[68.35,23.73],[68.32,23.758],[68.327,23.733],[68.271,23.698],[68.262,23.736],[68.246,23.671],[68.19,23.729],[68.215,23.758],[68.207,23.834],[68.261,23.835],[68.279,23.917],[68.335,23.916],[68.357,23.974],[68.365,23.94],[68.38,23.971],[68.753,23.971],[68.765,24.296],[68.808,24.313],[68.866,24.212],[68.945,24.303],[69.003,24.223],[69.095,24.274],[69.194,24.236],[69.313,24.281],[69.494,24.268],[69.594,24.292],[69.732,24.171],[70.025,24.171],[70.11,24.295],[70.561,24.421],[70.603,24.408],[70.562,24.354],[70.571,24.252],[70.714,24.216],[70.907,24.259],[70.874,24.295],[70.947,24.349],[71.042,24.351],[71.12,24.402],[71.103,24.436],[70.999,24.444],[70.986,24.596],[71.096,24.689],[70.938,24.939],[70.888,25.148],[70.665,25.397],[70.66,25.702],[70.387,25.674],[70.269,25.714],[70.1,25.938],[70.083,26.083],[70.175,26.251],[70.174,26.551],[70.056,26.601],[69.823,26.589],[69.51,26.744],[69.484,26.805],[69.513,27.01],[69.587,27.183],[70.026,27.563],[70.133,27.806],[70.372,28.012],[70.506,28.037],[70.589,28.01],[70.677,27.922],[70.684,27.828],[70.74,27.742],[70.872,27.706],[71.206,27.835],[71.383,27.873],[71.666,27.878],[71.898,27.961],[71.927,28.122],[72.207,28.395],[72.299,28.67],[72.39,28.77],[72.946,29.028],[73.282,29.572],[73.397,29.946],[73.807,30.068],[73.973,30.198],[73.956,30.276],[73.88,30.36],[73.974,30.444],[73.927,30.439],[73.935,30.49],[73.964,30.456],[74.012,30.534],[74.072,30.523],[74.096,30.611],[74.193,30.665],[74.232,30.724],[74.287,30.736],[74.261,30.775],[74.302,30.779],[74.32,30.847],[74.382,30.86],[74.366,30.893],[74.423,30.908],[74.416,30.94],[74.546,30.992],[74.568,31.055],[74.597,31.038],[74.696,31.074],[74.689,31.128],[74.602,31.133],[74.611,31.099],[74.571,31.081],[74.51,31.132],[74.552,31.364],[74.601,31.42],[74.655,31.426],[74.637,31.485],[74.575,31.501],[74.616,31.569],[74.487,31.715],[74.559,31.758],[74.607,31.89],[74.819,31.959],[74.879,32.054],[75.012,32.036],[75.123,32.081],[75.174,32.068],[75.203,32.12],[75.24,32.091],[75.322,32.179],[75.316,32.208],[75.372,32.226],[75.381,32.269],[75.321,32.297],[75.322,32.344],[75.193,32.401],[75.192,32.426],[75.133,32.409],[75.102,32.477],[75.027,32.498],[75.016,32.464],[74.952,32.446],[74.877,32.494],[74.681,32.493],[74.69,32.534],[74.638,32.615],[74.695,32.661],[74.654,32.729],[74.705,32.842],[74.633,32.809],[74.659,32.787],[74.638,32.751],[74.514,32.744],[74.445,32.804],[74.372,32.77],[74.341,32.81],[74.001,32.954],[73.926,33.034],[73.816,33.01],[73.634,33.093],[73.67,33.211],[73.627,33.242],[73.576,33.377],[73.63,33.456],[73.612,33.508],[73.634,33.526],[73.572,33.63],[73.601,33.699],[73.567,33.798],[73.595,33.892],[73.501,34.018],[73.488,34.279],[73.398,34.378],[73.453,34.569],[73.564,34.59],[73.657,34.563],[73.7,34.648],[73.665,34.67],[73.728,34.764],[73.838,34.814],[73.928,34.811],[74.045,34.89],[74.061,34.989],[74.111,35.018],[74.077,35.048],[74.087,35.083],[74.132,35.119],[74.112,35.153],[74.036,35.15],[74.003,35.185],[73.958,35.165],[73.926,35.21],[73.809,35.243],[73.75,35.221],[73.693,35.349],[73.727,35.419],[73.794,35.449],[73.786,35.524],[73.405,35.529],[73.331,35.663],[73.24,35.658],[73.126,35.721],[73.112,35.759],[73.2,35.787],[73.178,35.86],[73.129,35.846],[73.092,35.876],[73.026,35.842],[72.999,35.863],[72.904,35.842],[72.891,35.877],[72.819,35.888],[72.786,35.848],[72.683,35.82],[72.569,35.852],[72.51,35.902],[72.568,36.012],[72.521,36.079],[72.549,36.233],[72.594,36.27],[72.686,36.276],[72.848,36.376],[72.871,36.452],[72.967,36.477],[73.075,36.609],[73.062,36.697],[73.374,36.758],[73.604,36.71],[73.852,36.718],[73.868,36.755],[73.839,36.801],[73.697,36.855],[73.651,36.916],[73.67,36.922],[73.842,36.907],[74.041,36.834],[74.13,36.857],[74.151,36.918],[74.277,36.915],[74.424,37.007],[74.522,37.006],[74.563,36.971],[74.573,37.039],[74.689,37.096],[74.735,37.038],[74.841,37.066],[74.902,36.941],[74.939,36.948],[74.937,36.992],[75.146,37.034],[75.241,36.972],[75.418,36.959],[75.394,36.928],[75.433,36.876],[75.426,36.784],[75.46,36.73],[75.534,36.734],[75.54,36.78],[75.736,36.753],[75.941,36.606],[76.028,36.44],[76.149,36.425],[76.239,36.32],[76.389,36.31],[76.469,36.22],[76.719,36.16],[76.779,36.04],[76.779,35.91],[76.839,35.86],[77.009,35.82],[77.09,35.74],[77.209,35.71],[77.349,35.72],[77.421,35.64],[77.469,35.652],[77.519,35.486]]],[[[93.049,13.546],[93.05,13.479],[93.029,13.457],[93.041,13.452],[93.042,13.431],[93.015,13.427],[93.04,13.424],[93.053,13.402],[93.07,13.413],[93.068,13.395],[93.08,13.399],[93.06,13.376],[93.096,13.328],[93.072,13.305],[93.068,13.325],[93.048,13.318],[93.052,13.35],[93.043,13.34],[93.012,13.348],[92.997,13.325],[92.974,13.36],[92.963,13.342],[92.973,13.323],[93.006,13.309],[92.997,13.288],[93.006,13.284],[93.018,13.316],[93.016,13.298],[93.028,13.292],[93.021,13.273],[93.055,13.274],[93.054,13.255],[93.073,13.263],[93.044,13.186],[93.041,13.057],[93.015,13.024],[93.006,13.034],[92.994,13.021],[92.977,13.031],[92.982,13.011],[92.97,13.007],[92.944,13.035],[92.95,13.096],[92.94,13.05],[92.897,13.089],[92.92,13.057],[92.887,13.041],[92.921,13.042],[92.914,12.997],[92.939,12.987],[92.947,12.967],[92.915,12.945],[92.906,12.991],[92.888,12.937],[92.865,12.938],[92.869,12.907],[92.883,12.905],[92.877,12.881],[92.861,12.88],[92.857,12.895],[92.812,12.896],[92.8,12.974],[92.808,12.99],[92.827,12.983],[92.837,13.009],[92.807,13.003],[92.795,13.013],[92.807,13.028],[92.799,13.088],[92.822,13.072],[92.814,13.093],[92.823,13.1],[92.827,13.091],[92.833,13.112],[92.817,13.123],[92.833,13.132],[92.85,13.12],[92.845,13.132],[92.857,13.135],[92.817,13.152],[92.822,13.17],[92.841,13.167],[92.826,13.178],[92.835,13.233],[92.862,13.236],[92.861,13.253],[92.83,13.267],[92.832,13.287],[92.844,13.281],[92.85,13.297],[92.83,13.308],[92.848,13.372],[92.86,13.358],[92.863,13.374],[92.886,13.386],[92.864,13.382],[92.852,13.4],[92.857,13.409],[92.886,13.403],[92.878,13.418],[92.894,13.429],[92.879,13.467],[92.907,13.476],[92.91,13.496],[92.938,13.494],[92.919,13.504],[92.941,13.521],[92.926,13.521],[92.929,13.532],[92.977,13.54],[92.997,13.528],[92.999,13.566],[93.015,13.561],[93.022,13.541],[93.037,13.575],[93.049,13.546]]],[[[92.71,12.227],[92.72,12.189],[92.707,12.163],[92.742,12.181],[92.764,12.172],[92.74,12.099],[92.747,12.055],[92.712,12.049],[92.733,12.045],[92.748,12.062],[92.772,12.045],[92.798,12.051],[92.771,12.02],[92.743,12.03],[92.745,12.014],[92.762,12.004],[92.773,12.012],[92.773,12.0],[92.752,11.995],[92.766,11.987],[92.762,11.977],[92.733,11.977],[92.744,11.964],[92.724,11.958],[92.734,11.949],[92.723,11.923],[92.733,11.929],[92.739,11.893],[92.752,11.93],[92.79,11.935],[92.8,11.897],[92.79,11.888],[92.799,11.883],[92.795,11.846],[92.763,11.697],[92.751,11.705],[92.748,11.683],[92.709,11.701],[92.698,11.692],[92.714,11.693],[92.718,11.666],[92.693,11.646],[92.672,11.647],[92.68,11.621],[92.69,11.632],[92.703,11.616],[92.705,11.647],[92.722,11.639],[92.739,11.653],[92.725,11.66],[92.729,11.677],[92.763,11.658],[92.763,11.639],[92.741,11.632],[92.759,11.634],[92.762,11.608],[92.719,11.473],[92.71,11.499],[92.676,11.499],[92.656,11.515],[92.656,11.567],[92.642,11.575],[92.626,11.557],[92.615,11.614],[92.643,11.613],[92.65,11.63],[92.613,11.634],[92.6,11.667],[92.607,11.712],[92.581,11.712],[92.572,11.692],[92.559,11.807],[92.549,11.813],[92.557,11.843],[92.552,11.826],[92.547,11.836],[92.533,11.822],[92.521,11.843],[92.542,11.908],[92.572,11.94],[92.591,11.919],[92.594,11.884],[92.601,11.9],[92.611,11.893],[92.615,11.847],[92.629,12.102],[92.669,12.209],[92.681,12.174],[92.682,12.214],[92.687,12.222],[92.695,12.212],[92.703,12.24],[92.71,12.227]]],[[[92.91,12.911],[92.93,12.909],[92.914,12.882],[92.937,12.884],[92.937,12.86],[92.957,12.836],[92.964,12.791],[92.941,12.773],[92.959,12.767],[92.978,12.737],[92.974,12.721],[92.991,12.708],[92.975,12.702],[92.968,12.622],[92.949,12.616],[92.968,12.612],[92.99,12.535],[92.979,12.488],[92.968,12.479],[92.958,12.494],[92.932,12.464],[92.97,12.465],[92.93,12.437],[92.922,12.402],[92.898,12.441],[92.91,12.457],[92.892,12.442],[92.85,12.47],[92.907,12.419],[92.888,12.41],[92.878,12.424],[92.811,12.436],[92.81,12.457],[92.809,12.433],[92.84,12.423],[92.866,12.362],[92.9,12.346],[92.902,12.335],[92.875,12.332],[92.897,12.321],[92.835,12.302],[92.781,12.315],[92.77,12.297],[92.747,12.296],[92.744,12.306],[92.719,12.307],[92.706,12.327],[92.718,12.492],[92.701,12.518],[92.715,12.597],[92.694,12.612],[92.719,12.614],[92.724,12.643],[92.732,12.623],[92.759,12.667],[92.784,12.666],[92.792,12.633],[92.796,12.701],[92.78,12.671],[92.743,12.669],[92.738,12.697],[92.749,12.697],[92.752,12.722],[92.73,12.822],[92.743,12.83],[92.749,12.809],[92.749,12.832],[92.753,12.821],[92.761,12.842],[92.778,12.842],[92.788,12.825],[92.803,12.888],[92.857,12.891],[92.856,12.877],[92.869,12.875],[92.904,12.895],[92.905,12.922],[92.91,12.911]]],[[[93.846,7.245],[93.863,7.237],[93.863,7.211],[93.894,7.204],[93.897,7.088],[93.916,7.075],[93.926,7.028],[93.963,7.003],[93.955,6.994],[93.94,7.011],[93.929,6.996],[93.957,6.959],[93.926,6.942],[93.925,6.909],[93.91,6.905],[93.906,6.847],[93.925,6.837],[93.915,6.81],[93.895,6.795],[93.88,6.817],[93.868,6.815],[93.853,6.757],[93.842,6.753],[93.822,6.762],[93.828,6.818],[93.817,6.815],[93.803,6.835],[93.81,6.852],[93.79,6.877],[93.802,6.884],[93.783,6.893],[93.774,6.92],[93.763,6.908],[93.758,6.948],[93.73,6.995],[93.712,6.998],[93.7,7.022],[93.67,7.017],[93.676,7.037],[93.662,7.104],[93.675,7.116],[93.66,7.128],[93.686,7.156],[93.687,7.187],[93.735,7.189],[93.762,7.215],[93.81,7.206],[93.812,7.237],[93.846,7.245]]],[[[92.549,10.88],[92.545,10.865],[92.557,10.86],[92.555,10.88],[92.589,10.853],[92.595,10.79],[92.566,10.796],[92.601,10.767],[92.595,10.783],[92.604,10.784],[92.622,10.762],[92.62,10.67],[92.595,10.657],[92.592,10.635],[92.564,10.624],[92.548,10.592],[92.578,10.568],[92.524,10.507],[92.485,10.511],[92.438,10.545],[92.387,10.527],[92.416,10.629],[92.386,10.657],[92.385,10.791],[92.397,10.803],[92.408,10.789],[92.503,10.889],[92.513,10.888],[92.512,10.867],[92.525,10.897],[92.549,10.88]]],[[[92.827,12.303],[92.877,12.301],[92.882,12.284],[92.895,12.283],[92.898,12.255],[92.87,12.239],[92.889,12.193],[92.851,12.195],[92.865,12.164],[92.855,12.154],[92.832,12.167],[92.823,12.16],[92.833,12.147],[92.81,12.127],[92.82,12.105],[92.792,12.099],[92.81,12.089],[92.773,12.059],[92.746,12.094],[92.786,12.237],[92.769,12.227],[92.75,12.247],[92.761,12.269],[92.774,12.256],[92.786,12.277],[92.781,12.308],[92.827,12.303]]],[[[93.537,8.236],[93.558,8.221],[93.55,8.181],[93.525,8.175],[93.509,8.151],[93.557,8.089],[93.561,8.037],[93.543,8.046],[93.537,8.032],[93.521,8.031],[93.512,7.998],[93.496,8.042],[93.52,8.039],[93.521,8.066],[93.525,8.048],[93.549,8.066],[93.527,8.084],[93.497,8.052],[93.49,8.086],[93.501,8.091],[93.483,8.097],[93.463,8.167],[93.499,8.202],[93.505,8.228],[93.537,8.236]]],[[[92.975,12.033],[92.991,12.04],[93.016,12.018],[93.061,11.901],[93.048,11.88],[93.031,11.887],[93.004,11.934],[93.008,11.945],[93.033,11.931],[93.01,11.949],[93.02,11.958],[93.01,11.975],[93.016,11.958],[93.007,11.949],[92.995,11.971],[93.002,11.95],[92.99,11.943],[92.965,11.981],[92.93,11.993],[92.953,12.008],[92.971,12.048],[92.975,12.033]]],[[[93.378,8.021],[93.404,8.006],[93.4,7.968],[93.412,7.957],[93.427,7.965],[93.455,7.932],[93.468,7.89],[93.459,7.87],[93.427,7.9],[93.396,7.895],[93.377,7.878],[93.34,7.889],[93.344,7.922],[93.359,7.935],[93.35,7.942],[93.328,7.919],[93.319,7.924],[93.31,7.955],[93.32,7.994],[93.378,8.021]]],[[[88.169,21.786],[88.172,21.736],[88.155,21.682],[88.128,21.68],[88.157,21.674],[88.149,21.634],[88.11,21.623],[88.087,21.63],[88.091,21.638],[88.052,21.64],[88.039,21.665],[88.06,21.71],[88.052,21.715],[88.125,21.865],[88.139,21.875],[88.174,21.817],[88.169,21.786]]],[[[93.736,7.423],[93.739,7.401],[93.771,7.385],[93.775,7.365],[93.739,7.31],[93.703,7.295],[93.664,7.248],[93.647,7.265],[93.651,7.3],[93.638,7.308],[93.651,7.322],[93.648,7.372],[93.663,7.367],[93.723,7.389],[93.721,7.445],[93.736,7.423]]],[[[88.727,21.666],[88.75,21.65],[88.769,21.655],[88.774,21.617],[88.795,21.598],[88.791,21.584],[88.758,21.581],[88.752,21.596],[88.731,21.576],[88.71,21.591],[88.721,21.639],[88.69,21.684],[88.697,21.711],[88.704,21.684],[88.727,21.666]]],[[[88.646,21.917],[88.667,21.913],[88.652,21.872],[88.641,21.872],[88.653,21.868],[88.637,21.786],[88.62,21.797],[88.613,21.817],[88.621,21.831],[88.595,21.858],[88.619,21.896],[88.629,21.887],[88.623,21.902],[88.635,21.918],[88.646,21.917]]],[[[92.661,11.494],[92.688,11.466],[92.695,11.422],[92.655,11.405],[92.699,11.387],[92.7,11.365],[92.672,11.348],[92.611,11.34],[92.589,11.365],[92.597,11.397],[92.63,11.4],[92.624,11.488],[92.641,11.511],[92.661,11.494]]],[[[92.711,12.986],[92.725,12.977],[92.734,12.889],[92.707,12.831],[92.685,12.823],[92.697,12.807],[92.677,12.779],[92.658,12.857],[92.678,12.882],[92.685,12.94],[92.677,12.963],[92.698,12.99],[92.711,12.986]]],[[[93.131,8.355],[93.149,8.345],[93.134,8.273],[93.159,8.243],[93.21,8.217],[93.202,8.196],[93.124,8.226],[93.095,8.265],[93.088,8.294],[93.1,8.334],[93.131,8.355]]],[[[92.78,9.247],[92.819,9.214],[92.83,9.142],[92.804,9.118],[92.739,9.12],[92.721,9.142],[92.72,9.211],[92.764,9.215],[92.773,9.251],[92.78,9.247]]],[[[88.211,21.67],[88.227,21.668],[88.233,21.642],[88.211,21.62],[88.213,21.595],[88.18,21.689],[88.205,21.724],[88.216,21.699],[88.196,21.682],[88.211,21.67]]],[[[93.628,8.529],[93.644,8.518],[93.645,8.462],[93.63,8.454],[93.628,8.417],[93.63,8.509],[93.617,8.541],[93.623,8.569],[93.628,8.529]]],[[[93.079,12.209],[93.096,12.192],[93.092,12.149],[93.102,12.144],[93.096,12.097],[93.081,12.082],[93.045,12.126],[93.055,12.176],[93.079,12.209]]]]}};

/* ================= HELPERS ================= */

const CFG = window.TRAVEL_CONFIG || {};
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

const INTERESTS = ['Beaches','Mountains','Nature','Food','Culture','History','Nightlife',
                   'Shopping','Adventure','Luxury','Budget','Road trips','Photography'];

function readJSON(key, dflt) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : dflt; }
  catch (e) { return dflt; }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage off */ }
}
function esc(s) {
  return String(s ?? '').replace(/[&<>'"]/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}
function flagEmoji(code) {
  const c = String(code || '').toUpperCase();
  if (!/^[A-Z]{2}$/.test(c)) return '🌍';
  return c.replace(/./g, ch => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}
function norm(q) { return String(q || '').trim().replace(/\s+/g, ' '); }
function setText(sel, v) { const el = $(sel); if (el) el.textContent = v; }
function setHTML(sel, v) { const el = $(sel); if (el) el.innerHTML = v; }
function num(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return isFinite(n) ? n : null;
}
function money(n, cur) {
  if (n === null || n === undefined || !isFinite(n)) return '—';
  return Math.round(n).toLocaleString() + (cur ? ' ' + cur : '');
}
function compactPop(n) {
  n = Number(n) || 0;
  if (!n) return '—';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  return n.toLocaleString();
}
function safeUrl(u) {
  try {
    const p = new URL(String(u));
    return (p.protocol === 'http:' || p.protocol === 'https:') ? p.href : '';
  } catch (e) { return ''; }
}
function fetchTimeout(url, opts, ms) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms || 20000);
  return fetch(url, Object.assign({ signal: c.signal }, opts || {})).finally(() => clearTimeout(t));
}
function firstCurrency(c) {
  const e = Object.entries((c && c.currencies) || {});
  return e.length ? Object.assign({ code: e[0][0] }, e[0][1]) : { code: 'USD', name: 'US Dollar', symbol: '$' };
}

/* ================= COUNTRY DATA ================= */

const COUNTRIES = TRAVEL_COUNTRIES;
const BY_CODE = new Map();
COUNTRIES.forEach(c => {
  if (c.cca2) BY_CODE.set(c.cca2.toUpperCase(), c);
  if (c.cca3) BY_CODE.set(c.cca3.toUpperCase(), c);
});

const ALIASES = {
  'usa':'US','u.s.':'US','u.s.a.':'US','america':'US','united states of america':'US','states':'US',
  'uk':'GB','u.k.':'GB','britain':'GB','great britain':'GB','england':'GB','scotland':'GB',
  'wales':'GB','northern ireland':'GB','uae':'AE','emirates':'AE','dubai':'AE','abu dhabi':'AE',
  'south korea':'KR','korea':'KR','s korea':'KR','north korea':'KP','dprk':'KP',
  'russia':'RU','vietnam':'VN','viet nam':'VN','czech republic':'CZ','czechia':'CZ',
  'holland':'NL','turkey':'TR','turkiye':'TR','türkiye':'TR','burma':'MM','myanmar':'MM',
  'ivory coast':'CI',"cote d'ivoire":'CI','cape verde':'CV','swaziland':'SZ','eswatini':'SZ',
  'macedonia':'MK','east timor':'TL','timor leste':'TL','laos':'LA','congo':'CD','drc':'CD',
  'dr congo':'CD','bosnia':'BA','taiwan':'TW','hong kong':'HK','macau':'MO','macao':'MO',
  'palestine':'PS','vatican':'VA','saudi':'SA','ksa':'SA','sri lanka':'LK','ceylon':'LK',
  'nz':'NZ','eire':'IE','bharat':'IN','hindustan':'IN','swiss':'CH','switzerland':'CH'
};

function matchScore(c, low) {
  const common = String(c.name.common || '').toLowerCase();
  const official = String(c.name.official || '').toLowerCase();
  if (c.cca2.toLowerCase() === low) return 100;
  if (String(c.cca3 || '').toLowerCase() === low) return 98;
  if (common === low) return 96;
  if (official === low) return 92;
  for (const a of c.altSpellings || []) if (String(a).toLowerCase() === low) return 88;
  if (low.length < 3) return 0;
  if (common.indexOf(low) === 0) return 80 - Math.min(common.length, 30) * 0.1;
  if (official.indexOf(low) === 0) return 70;
  if (new RegExp('\\b' + low.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(common)) return 60;
  if (common.indexOf(low) > -1) return 50;
  if (official.indexOf(low) > -1) return 40;
  for (const a of c.altSpellings || []) if (String(a).toLowerCase().indexOf(low) > -1) return 30;
  const cap = ((c.capital || [])[0] || '').toLowerCase();
  if (cap && cap.indexOf(low) === 0) return 25;
  return 0;
}

function rankCountries(q, limit) {
  const low = norm(q).toLowerCase();
  if (!low) return [];
  const alias = ALIASES[low];
  const out = [];
  for (const c of COUNTRIES) {
    let s = matchScore(c, low);
    if (alias && c.cca2 === alias) s = Math.max(s, 99);
    if (s > 0) out.push({ c, s });
  }
  out.sort((a, b) => b.s - a.s || a.c.name.common.length - b.c.name.common.length);
  return out.slice(0, limit || 6).map(x => x.c);
}

function countryByCode(code) { return BY_CODE.get(String(code || '').toUpperCase()) || null; }

function resolveCountry(input) {
  const q = norm(input);
  if (!q) return null;
  const low = q.toLowerCase();
  if (ALIASES[low] && BY_CODE.has(ALIASES[low])) return ALIASES[low];
  const best = rankCountries(q, 1)[0];
  return best ? best.cca2 : null;
}

/* ================= STATE ================= */

const DEFAULT_PROFILE = {
  home: '', homeName: '', passport: '', currency: 'USD', from: '',
  style: 'Mid-range', travelType: 'Solo', diet: 'Any', interests: ['Food', 'Culture', 'Nature']
};

let profile = Object.assign({}, DEFAULT_PROFILE, readJSON('travel_ai_profile_v3', {}) || {});
let saved = readJSON('travel_ai_saved_v3', []) || [];
if (!Array.isArray(saved)) saved = [];
let tripPlan = readJSON('travel_ai_plan_v3', null);

let selectedCountry = null;
let selectedCode = '';
let currentCountryBundle = null;
let currentView = 'discover';
let countryToken = 0, cityToken = 0, boxToken = 0;
let scanTimer = null, scanFailsafe = null;
let visaBucket = 'Visa free';
let visaMatrixBuilding = false, visaMatrixTimer = null;

/* ================= BACKEND ================= */

function api(action, params) {
  if (!CFG.API_URL) {
    return Promise.reject(new Error('The Travel AI database backend is not connected. Add your Apps Script /exec URL to js/config.js as API_URL.'));
  }
  let u;
  try { u = new URL(CFG.API_URL); }
  catch (e) { return Promise.reject(new Error('API_URL in js/config.js is not a valid URL.')); }

  u.searchParams.set('action', action);
  Object.entries(params || {}).forEach(([k, v]) => u.searchParams.set(k, String(v ?? '')));

  return fetchTimeout(u.toString(), { cache: 'no-store', redirect: 'follow' }, CFG.REQUEST_TIMEOUT_MS || 75000)
    .then(async r => {
      const body = await r.text();
      let j;
      try { j = JSON.parse(body); }
      catch (e) {
        throw new Error('The backend returned a page instead of data. Re-deploy the web app with access set to "Anyone" and paste the new /exec URL.');
      }
      if (!j.ok) throw new Error(j.error || 'The backend rejected that request.');
      return j;
    })
    .catch(err => {
      if (err && err.name === 'AbortError') { const t = new Error('That took too long. Try again.'); t.timeout = true; throw t; }
      if (err instanceof TypeError) throw new Error('Could not reach the backend. Check API_URL and that the web app is deployed to "Anyone".');
      throw err;
    });
}

/* Traveller context used by database filters and recommendation scoring. */
function ctx(extra) {
  return Object.assign({
    home: profile.homeName || profile.home,
    passport: profile.passport || profile.home,
    from: profile.from,
    currency: profile.currency,
    style: profile.style,
    travelType: profile.travelType,
    diet: profile.diet,
    interests: (profile.interests || []).join(', ')
  }, extra || {});
}

function renderSources(sel, sources, checked) {
  const el = $(sel);
  if (!el) return;
  const seen = new Set(); const list = [];
  (sources || []).forEach(s => {
    const url = safeUrl(s && s.url);
    if (!url || seen.has(url)) return;
    seen.add(url);
    list.push({ url, name: (s && s.name) || '', official: !!(s && s.official) });
  });
  el.innerHTML = list.slice(0, 6).map((s, i) =>
    '<a class="' + (s.official ? 'official' : '') + '" href="' + esc(s.url) +
    '" target="_blank" rel="noopener noreferrer">' +
    (s.official ? '🏛 ' : '') + esc(s.name || ('Source ' + (i + 1))) + '</a>').join('');
  if (checked) {
    el.insertAdjacentHTML('afterend',
      '<div class="checked-note">Checked ' + esc(new Date(checked).toLocaleString()) + '</div>');
  }
}

/* ================= BRIEF RENDERER ================= */

const BRIEF_HEADS = new Set(['QUICK ANSWER','KEY POINTS','CHECK BEFORE YOU GO','VISA STATUS',
  'BASIC REQUIREMENTS','BEFORE BOOKING','SAFETY LEVEL','WATCH FOR','SMART PRECAUTION',
  'QUICK COMPARISON','RECOMMENDATION']);

function renderBrief(text) {
  const lines = String(text || '').split(/\n/).map(x => x.trim()).filter(Boolean);
  if (!lines.length) return '<div class="brief-empty">Nothing came back. Try again.</div>';

  let html = '', inList = false;
  const closeList = () => { if (inList) { html += '</ul>'; inList = false; } };

  for (const raw of lines) {
    const line = raw.replace(/\*\*/g, '').replace(/^#{1,6}\s*/, '').trim();
    if (!line) continue;
    const up = line.replace(/[:：]\s*$/, '').toUpperCase();

    if (BRIEF_HEADS.has(up)) {
      closeList();
      html += '<div class="brief-section-title">' + esc(line.replace(/[:：]\s*$/, '')) + '</div>';
      continue;
    }
    if (/^(•|[-*+])\s+/.test(line) || /^\d+[.)]\s+/.test(line)) {
      if (!inList) { html += '<ul class="brief-list">'; inList = true; }
      html += '<li>' + esc(line.replace(/^(•|[-*+])\s+/, '').replace(/^\d+[.)]\s+/, '')) + '</li>';
      continue;
    }
    closeList();
    if (/^[A-Za-z][A-Za-z /&-]{1,24}:\s+/.test(line)) html += '<div class="brief-fact">' + esc(line) + '</div>';
    else html += '<p class="brief-copy">' + esc(line) + '</p>';
  }
  closeList();
  return html;
}

/* ================= EXCHANGE RATES ================= */

async function getRate(from, to) {
  from = String(from || '').toUpperCase();
  to = String(to || '').toUpperCase();
  if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to)) throw new Error('Use 3-letter currency codes.');
  if (from === to) return { rate: 1, date: 'Same currency' };

  const key = 'fx_' + from + '_' + to;
  try {
    const hit = JSON.parse(sessionStorage.getItem(key) || 'null');
    if (hit && Date.now() - hit.t < 30 * 60 * 1000) return { rate: hit.rate, date: hit.date };
  } catch (e) { /* ignore */ }

  let out = null;
  try {
    const r = await fetchTimeout((CFG.FX_PRIMARY || '') + '/' + from, { cache: 'no-store' }, 12000);
    if (r.ok) {
      const j = await r.json();
      const rate = j && j.rates && Number(j.rates[to]);
      if (rate) out = { rate, date: (j.time_last_update_utc || '').slice(5, 16) || 'Reference rate' };
    }
  } catch (e) { /* fallback */ }

  if (!out) {
    try {
      const url = (CFG.FX_FALLBACK || '') + '?base=' + encodeURIComponent(from) + '&symbols=' + encodeURIComponent(to);
      const r = await fetchTimeout(url, { cache: 'no-store' }, 12000);
      if (r.ok) {
        const j = await r.json();
        const rate = j && j.rates && Number(j.rates[to]);
        if (rate) out = { rate, date: j.date || 'Reference rate' };
      }
    } catch (e) { /* give up */ }
  }

  if (!out) throw new Error('No published rate for ' + from + ' to ' + to + '.');
  try { sessionStorage.setItem(key, JSON.stringify({ rate: out.rate, date: out.date, t: Date.now() })); }
  catch (e) { /* ignore */ }
  return out;
}

function fmtRate(n) {
  if (n >= 1000) return n.toFixed(0);
  if (n >= 100) return n.toFixed(1);
  if (n >= 1) return n.toFixed(2);
  if (n >= 0.01) return n.toFixed(4);
  return n.toPrecision(3);
}

/* Prices arrive in local currency; show home currency alongside where possible. */
async function priceLabel(p, localCur) {
  const amount = p ? num(p.amount) : null;
  if (amount === null) return { text: 'Not published', cls: 'unknown', note: (p && p.note) || '' };
  if (amount === 0) return { text: 'Free', cls: 'free', note: (p && p.note) || '' };

  const code = String((p && p.currency) || localCur || 'USD').toUpperCase();
  let text = amount.toLocaleString() + ' ' + code;
  const home = String(profile.currency || '').toUpperCase();
  if (home && home !== code) {
    try {
      const { rate } = await getRate(code, home);
      text += '  ≈  ' + Math.round(amount * rate).toLocaleString() + ' ' + home;
    } catch (e) { /* local only */ }
  }
  return { text, cls: 'paid', note: (p && p.note) || '' };
}

async function paintPrices(scope, localCur) {
  for (const node of [...document.querySelectorAll(scope + ' [data-price]')]) {
    let raw = null;
    try { raw = JSON.parse(node.dataset.price); } catch (e) { raw = null; }
    const l = await priceLabel(raw, localCur);
    node.classList.add('price-' + l.cls);
    const add = node.querySelector('.add');
    node.textContent = l.text + (l.note ? '  ·  ' + l.note : '');
    if (add) node.appendChild(add);
  }
}

/* ================= ANSWER BOX ================= */

function openBox(kicker, title, html) {
  setText('#boxKicker', kicker);
  setText('#boxTitle', title);
  setHTML('#boxBody', html || '');
  const b = $('#answerBox'), bd = $('#boxBackdrop');
  if (bd) bd.classList.add('open');
  if (b) { b.classList.add('open'); b.setAttribute('aria-hidden', 'false'); }
  document.body.classList.add('box-open');
}

function closeBox() {
  const b = $('#answerBox'), bd = $('#boxBackdrop');
  if (bd) bd.classList.remove('open');
  if (b) { b.classList.remove('open'); b.setAttribute('aria-hidden', 'true'); }
  document.body.classList.remove('box-open');
  boxToken++;
}

function boxLoading(msg) {
  return '<div class="box-loading"><div class="box-spin"></div>' +
    '<span class="loading-pulse">' + esc(msg) + '</span></div>';
}

/* ================= ONBOARDING ================= */

let pendingHome = null;

function needsOnboarding() { return !profile.home || !countryByCode(profile.home); }

function openOnboarding() {
  const o = $('#onboard');
  if (o) { o.classList.add('open'); o.setAttribute('aria-hidden', 'false'); }
  document.body.classList.add('onboard-open');
  renderHomeList(rankPopularHomes());
  const input = $('#homeSearch');
  if (input) setTimeout(() => input.focus(), 120);
}

function closeOnboarding() {
  const o = $('#onboard');
  if (o) { o.classList.remove('open'); o.setAttribute('aria-hidden', 'true'); }
  document.body.classList.remove('onboard-open');
}

/* A short starter list so the screen is never empty. */
function rankPopularHomes() {
  const codes = ['IN','US','GB','AE','CA','AU','SG','DE','FR','JP','ZA','NZ','MY','PH','NG'];
  return codes.map(countryByCode).filter(Boolean);
}

function renderHomeList(list) {
  const box = $('#homeResults');
  if (!box) return;
  if (!list.length) {
    box.innerHTML = '<div class="search-empty">No country matches that name.</div>';
    return;
  }
  box.innerHTML = list.map((c, i) => {
    const cur = firstCurrency(c);
    return '<div class="onboard-row" role="option" data-code="' + esc(c.cca2) + '" data-i="' + i + '">' +
      '<span class="f">' + esc(c.flag || flagEmoji(c.cca2)) + '</span>' +
      '<b>' + esc(c.name.common) + '</b>' +
      '<small>' + esc(cur.code) + '</small></div>';
  }).join('');
  box.querySelectorAll('.onboard-row').forEach(row => {
    row.onclick = () => pickHome(row.dataset.code);
  });
}

function pickHome(code) {
  const c = countryByCode(code);
  if (!c) return;
  pendingHome = c;
  const cur = firstCurrency(c);
  setText('#pickedFlag', c.flag || flagEmoji(c.cca2));
  setText('#pickedName', c.name.common);
  setHTML('#pickedChips',
    '<span>Passport: ' + esc(c.name.common) + '</span>' +
    '<span>Currency: ' + esc(cur.code) + '</span>' +
    '<span>' + esc(c.region || '') + '</span>');
  const p = $('#homePicked');
  if (p) { p.hidden = false; p.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
}

function confirmHome() {
  if (!pendingHome) return;
  const c = pendingHome;
  const cur = firstCurrency(c);
  profile.home = c.cca2;
  profile.homeName = c.name.common;
  profile.passport = c.cca2;
  profile.currency = cur.code;
  writeJSON('travel_ai_profile_v3', profile);
  closeOnboarding();
  afterProfileChange();
  showView('discover');
  loadMonthPicks();
}

/* ================= PROFILE ================= */

function afterProfileChange() {
  const home = countryByCode(profile.home);
  setText('#homePill', home ? (home.flag || flagEmoji(home.cca2)) : '🌍');
  setHTML('#profileChips',
    '<span>' + esc(home ? home.flag + ' ' + home.name.common : 'Home not set') + '</span>' +
    '<span>' + esc(profile.currency) + '</span>' +
    (profile.from ? '<span>From ' + esc(profile.from) + '</span>' : '') +
    '<span>' + esc(profile.style) + '</span>' +
    '<span>' + esc(profile.travelType) + '</span>' +
    (profile.diet && profile.diet !== 'Any' ? '<span>' + esc(profile.diet) + '</span>' : ''));

  setText('#fBudgetCur', profile.currency);
  setText('#pBudgetCur', profile.currency);
  setText('#visaHeading', 'Where can I travel on a ' + (profile.homeName || 'your') + ' passport?');
  const f = $('#fFrom'); if (f && !f.value) f.value = profile.from || '';
  const st = $('#fStyle'); if (st) st.value = profile.style;
  const tt = $('#fType'); if (tt) tt.value = profile.travelType;
  renderInterestChips();
}

function renderInterestChips() {
  const box = $('#fInterests');
  if (!box) return;
  box.innerHTML = INTERESTS.map(i =>
    '<button type="button" data-int="' + esc(i) + '" class="' +
    ((profile.interests || []).indexOf(i) > -1 ? 'on' : '') + '">' + esc(i) + '</button>').join('');
  box.querySelectorAll('[data-int]').forEach(b => {
    b.onclick = () => {
      const v = b.dataset.int;
      const list = profile.interests || [];
      const i = list.indexOf(v);
      if (i > -1) list.splice(i, 1); else list.push(v);
      profile.interests = list;
      writeJSON('travel_ai_profile_v3', profile);
      b.classList.toggle('on');
    };
  });
}

function openProfile() {
  const home = countryByCode(profile.home);
  openBox('TRAVELLER PROFILE', 'Your profile',
    '<div class="finder-grid">' +
    '<div class="field"><label>Home country</label>' +
    '<input id="prHome" value="' + esc(home ? home.name.common : '') + '" autocomplete="off"></div>' +
    '<div class="field"><label for="prFrom">Departure city</label>' +
    '<input id="prFrom" value="' + esc(profile.from || '') + '" placeholder="e.g. Delhi"></div>' +
    '<div class="field"><label for="prStyle">Travel style</label><select id="prStyle">' +
    ['Budget','Mid-range','Comfort','Luxury'].map(x => '<option>' + x + '</option>').join('') + '</select></div>' +
    '<div class="field"><label for="prType">Travel type</label><select id="prType">' +
    ['Solo','Couple','Family','Friends','Honeymoon'].map(x => '<option>' + x + '</option>').join('') + '</select></div>' +
    '<div class="field"><label for="prDiet">Diet</label><select id="prDiet">' +
    ['Any','Vegetarian','Vegan','Halal','Jain','Kosher'].map(x => '<option>' + x + '</option>').join('') + '</select></div>' +
    '<div class="field"><label for="prCur">Home currency</label>' +
    '<input id="prCur" maxlength="3" value="' + esc(profile.currency) + '"></div>' +
    '</div>' +
    '<div class="field chips-field"><label>Interests</label><div class="chip-select" id="prInterests"></div></div>' +
    '<div class="brief-empty" id="prError" hidden></div>' +
    '<button class="primary-btn wide" id="prSave">Save profile</button>' +
    '<div class="disclaimer">Changing your home country recalculates visa results, budgets and ' +
    'recommendations across the whole app.</div>');

  $('#prStyle').value = profile.style;
  $('#prType').value = profile.travelType;
  $('#prDiet').value = profile.diet || 'Any';

  const chips = $('#prInterests');
  chips.innerHTML = INTERESTS.map(i =>
    '<button type="button" data-pi="' + esc(i) + '" class="' +
    ((profile.interests || []).indexOf(i) > -1 ? 'on' : '') + '">' + esc(i) + '</button>').join('');
  chips.querySelectorAll('[data-pi]').forEach(b => b.onclick = () => b.classList.toggle('on'));

  $('#prSave').onclick = () => {
    const err = $('#prError');
    const code = resolveCountry($('#prHome').value);
    if (!code) {
      err.hidden = false;
      err.textContent = 'That home country was not recognised. Try the full country name.';
      return;
    }
    const c = countryByCode(code);
    const cur = norm($('#prCur').value).toUpperCase() || firstCurrency(c).code;
    if (!/^[A-Z]{3}$/.test(cur)) {
      err.hidden = false;
      err.textContent = 'Home currency needs a 3-letter code such as INR or USD.';
      return;
    }
    profile.home = c.cca2;
    profile.homeName = c.name.common;
    profile.passport = c.cca2;
    profile.currency = cur;
    profile.from = norm($('#prFrom').value);
    profile.style = $('#prStyle').value;
    profile.travelType = $('#prType').value;
    profile.diet = $('#prDiet').value;
    profile.interests = [...chips.querySelectorAll('[data-pi].on')].map(b => b.dataset.pi);
    writeJSON('travel_ai_profile_v3', profile);
    afterProfileChange();
    closeBox();
    if (currentView === 'visa') loadVisaMatrix(visaBucket, true);
  };
}

/* ================= VIEW ROUTING ================= */

function showView(name) {
  currentView = name;
  $$('.view').forEach(v => v.classList.toggle('active', v.dataset.viewname === name));
  $$('#tabbar button').forEach(b => b.classList.toggle('on', b.dataset.view === name));
  $$('.nav a').forEach(a => a.classList.toggle('on', a.dataset.view === name));
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (name === 'visa' && !$('#visaResults').innerHTML.trim()) loadVisaMatrix(visaBucket);
  if (name === 'trips') renderTrips();
  if (name === 'country' && !selectedCountry) {
    setHTML('#factStrip', '');
    setText('#countryName', 'Choose a country');
  }
}

/* ================= COUNTRY SCAN ================= */

function scanReset() {
  ['scanGeo','scanFx','scanWx','scanVisa','scanAi'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('ok');
  });
}
function scanMark(id) { const el = document.getElementById(id); if (el) el.classList.add('ok'); }
function setScan(p, t) {
  const bar = $('#scanProgress');
  if (bar) bar.style.width = Math.max(0, Math.min(100, p)) + '%';
  setText('#scanStep', t || '');
}
function openScan(name, code) {
  clearTimeout(scanTimer); clearTimeout(scanFailsafe);
  scanReset();
  setText('#scanCountry', name || 'Acquiring destination');
  setText('#scanFlag', code ? flagEmoji(code) : '🌍');
  setScan(5, 'Acquiring destination...');
  const o = $('#scanOverlay');
  if (o) { o.classList.add('open'); o.setAttribute('aria-hidden', 'false'); }
  document.body.classList.add('scan-open');
  scanFailsafe = setTimeout(hideScan, 180000);
}
function hideScan() {
  clearTimeout(scanFailsafe);
  const o = $('#scanOverlay');
  if (o) { o.classList.remove('open'); o.setAttribute('aria-hidden', 'true'); }
  document.body.classList.remove('scan-open');
}
function closeScan(msg) {
  setScan(100, msg || 'Destination ready.');
  clearTimeout(scanTimer);
  scanTimer = setTimeout(hideScan, 420);
}
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ================= COUNTRY FLOW ================= */

async function selectCountry(input, silent) {
  const token = ++countryToken;
  const code = /^[A-Za-z]{2}$/.test(norm(input)) ? norm(input).toUpperCase() : resolveCountry(input);
  const c = code ? countryByCode(code) : null;

  if (!c) {
    openScan('Destination not found', '');
    setScan(100, 'No country matches "' + norm(input) + '".');
    setTimeout(hideScan, 1500);
    return;
  }

  if (!silent) openScan(c.name.common, c.cca2);

  try {
    selectedCountry = c;
    selectedCode = c.cca2;
    currentCountryBundle = null;

    if (!silent) { setScan(10, 'Opening saved travel data...'); scanMark('scanGeo'); }
    renderCountry();
    showView('country');

    // Live utilities must never block the database page.
    loadRate();
    loadWeather();

    if (!CFG.API_URL) {
      if (!silent) closeScan('Destination ready with basic data.');
      return;
    }

    // One database-first request. Existing information is rendered immediately.
    const br = await api('countryBundle', ctx({
      country: c.name.common,
      countryCode: c.cca2,
      passport: profile.passport || profile.home
    }));
    if (token !== countryToken) return;
    currentCountryBundle = br.data || null;
    applyCountryBundleToView(currentCountryBundle);

    if (br.ready) {
      ensureVisaShown();
      if (!silent) {
        scanMark('scanAi');
        closeScan(br.stale ? 'Saved guide opened · refreshing quietly.' : 'Saved guide opened instantly.');
      }
      if (needsWatch(br)) watchCountryBundle(c, token);
      return;
    }

    // No CORE dataset exists yet. Build only then; partial stages are shown as they arrive.
    await buildCountryProgressively(c, token, silent);
    if (token !== countryToken) return;
    const latest = await api('countryBundle', ctx({ country: c.name.common, countryCode: c.cca2, passport: profile.passport || profile.home, watch: 1 }));
    if (token !== countryToken) return;
    currentCountryBundle = latest.data || currentCountryBundle;
    applyCountryBundleToView(currentCountryBundle);
    ensureVisaShown();
    if (!silent) closeScan(c.name.common + ' travel database is ready.');
    if (needsWatch(latest)) watchCountryBundle(c, token);
  } catch (e) {
    if (token !== countryToken) return;
    setScan(100, e.message || 'Could not load that destination.');
    setTimeout(hideScan, 2200);
  }
}

function applyCountryBundleToView(bundle) {
  if (!bundle) return;
  if (Array.isArray(bundle.cities) && bundle.cities.length) renderCitiesList(bundle.cities);
  const pk = String(profile.passport || profile.home || '').toUpperCase();
  const visa = bundle.visas && bundle.visas[pk];
  if (visa) renderVisaFromBundle(visa);
  if (bundle.safety) renderSafetyFromBundle(bundle.safety);
}

/* Bundle has no row for this passport (e.g. passport outside the configured list):
   fetch just that visa row so the tab and badge never stay on "checking". */
function ensureVisaShown() {
  const pk = String(profile.passport || profile.home || '').toUpperCase();
  const has = pk && currentCountryBundle && currentCountryBundle.visas && currentCountryBundle.visas[pk];
  if (!has) loadVisaBrief();
}

function isBuilding(build) {
  const s = String((build && build.status) || '').toUpperCase();
  return s === 'QUEUED' || s === 'BUILDING';
}
function needsWatch(br) {
  return !!br && ((br.pending || []).length > 0 || isBuilding(br.build));
}

/* Missing sections are built in the background; refresh the open page quietly
   when they land (every 20 s for up to ~4 minutes, stops on country change). */
async function watchCountryBundle(c, token) {
  for (let i = 0; i < 12; i++) {
    await wait(20000);
    if (token !== countryToken) return;
    let r;
    try {
      r = await api('countryBundle', ctx({ country: c.name.common, countryCode: c.cca2, passport: profile.passport || profile.home, watch: 1 }));
    } catch (e) { continue; }
    if (token !== countryToken) return;
    if (r.data && r.ready) {
      const sig = b => JSON.stringify([b && b.updatedAt, b && b.sectionTimes, b && b.visas && Object.keys(b.visas).length]);
      const changed = sig(r.data) !== sig(currentCountryBundle);
      currentCountryBundle = r.data;
      if (changed) applyCountryBundleToView(r.data);   // re-render only when something new landed
    }
    if (!needsWatch(r)) return;
  }
}

function renderCitiesList(list) {
  const grid = $('#cityGrid');
  if (!grid) return;
  grid.innerHTML = (list || []).slice(0, 6).map((c, i) =>
    '<article class="city-card" data-city="' + esc(c.name) + '" role="button" tabindex="0" style="--i:' + i + '">' +
    '<div class="city-top"><div><b>' + esc(c.name) + '</b><small class="reg">' + esc(c.region || '') + '</small></div>' +
    (c.score ? '<div class="city-score">' + esc(c.score) + '</div>' : '') + '</div>' +
    '<p>' + esc(c.famousFor || '') + '</p><div class="city-tags">' + (c.tags || []).slice(0, 3).map(t => '<em>' + esc(t) + '</em>').join('') + '</div>' +
    '<div class="city-meta"><span>◷ ' + esc(c.days || '—') + '</span><span>❄ ' + esc(c.bestTime || '—') + '</span>' +
    (c.bestFor ? '<span>★ ' + esc(c.bestFor) + '</span>' : '') + '</div><div class="city-go">EXPLORE ▸</div></article>'
  ).join('');
  grid.querySelectorAll('.city-card').forEach(card => {
    card.onclick = () => openCity(card.dataset.city);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); } });
  });
}

function renderVisaFromBundle(v) {
  if (!v) return;
  const ans = 'VISA STATUS\n' + (v.status || 'Unconfirmed') + (v.maxStay ? ' · ' + v.maxStay : '') +
    '\n\nBASIC REQUIREMENTS\n• ' + (v.note || 'Verify passport validity and entry conditions before booking.') +
    '\n\nBEFORE BOOKING\n• Re-check the official immigration or embassy source because entry rules can change.';
  setHTML('#visaBrief', renderBrief(ans));
  const badge = $('#countryVisaBadge');
  if (badge) { badge.textContent = 'Visa: ' + (v.status || 'see tab'); badge.className = 'visa-badge ' + visaClass(v.status || ''); }
}

function renderSafetyFromBundle(r) {
  if (!r) return;
  let watch = [];
  try { watch = JSON.parse(r.WatchForJSON || '[]'); } catch (e) {}
  const ans = 'SAFETY LEVEL\n' + (r.Level || 'Normal caution') + (r.Summary ? ' — ' + r.Summary : '') +
    '\n\nWATCH FOR\n' + watch.slice(0,4).map(x => '• ' + x).join('\n') +
    '\n\nSMART PRECAUTION\n• ' + (r.Precaution || 'Follow current official travel advice.');
  setHTML('#safetyBrief', renderBrief(ans));
}

function applyBuildProgress(build) {
  const p = Number((build && build.progress) || 0);
  const stage = String((build && build.stage) || 'WAITING').toUpperCase();
  if (p >= 5) scanMark('scanGeo');
  if (p >= 42) scanMark('scanFx');
  if (p >= 68) { scanMark('scanWx'); scanMark('scanVisa'); }
  if (p >= 84) scanMark('scanAi');

  const messages = {
    CORE: 'Discovering the best cities, seasons and travel costs...',
    ESSENTIALS: 'Checking current visa rules and safety guidance...',
    EXPERIENCE_A: 'Building city guides, attractions and local experiences...',
    EXPERIENCE_B: 'Finishing attractions, food and local tips...',
    COMPLETE: 'Travel guide ready.'
  };
  setScan(Math.max(8, p), messages[stage] || 'Preparing fresh destination intelligence...');
}

async function buildCountryProgressively(c, token, silent) {
  const statusOf = b => String((b && b.status) || '').toUpperCase();
  const fetchStatus = async () => {
    const st = await api('countryBuildStatus', { countryCode: c.cca2 });
    return st.build || st;
  };
  let build = await fetchStatus();
  applyBuildProgress(build);

  const started = Date.now();
  const loaded = { cities: false, essentials: false };
  let queuedNote = '';

  // Four stages: CORE, ESSENTIALS, EXPERIENCE_A, EXPERIENCE_B. Time-boxed rather than
  // count-boxed, because a stage may be running in the background worker instead.
  while (Date.now() - started < 6 * 60 * 1000) {
    if (token !== countryToken) return;
    if (statusOf(build) === 'READY') return;
    if (statusOf(build) === 'ERROR') throw new Error(build.error || 'The destination build stopped. Please try again.');

    let step = null;
    try {
      // Run the next stage now so the first visitor does not wait for the 1-minute trigger.
      step = await api('processCountryBuild', ctx({ countryCode: c.cca2, passport: profile.passport || profile.home }));
    } catch (e) {
      if (!e.timeout) throw e;           // a slow stage keeps running on the server; keep polling
    }
    if (token !== countryToken) return;
    if (step && step.build) build = step.build;
    if (step && step.limited) queuedNote = step.message || '';

    if (!step || step.busy || step.limited) {
      // Another process owns this stage (worker or another visitor): wait, then re-check.
      setScan(Math.max(8, Number(build.progress || 0)), queuedNote || 'Another traveller is building this guide. Waiting for the next section...');
      await wait(8000);
      if (token !== countryToken) return;
      try { build = await fetchStatus(); } catch (e) { /* retry next loop */ }
    }
    applyBuildProgress(build);

    // Populate visible sections behind the progress panel as soon as they exist.
    const p = Number(build.progress || 0);
    if (p >= 42 && !loaded.cities) { loaded.cities = true; loadCities(); }
    if (p >= 68 && !loaded.essentials) { loaded.essentials = true; loadVisaBrief(); loadSafety(); }
    if (statusOf(build) === 'READY') return;
    await wait(250);
  }

  build = await fetchStatus();
  applyBuildProgress(build);
  if (statusOf(build) !== 'READY') {
    throw new Error(queuedNote || build.error || 'The destination is still preparing in the background. Please reopen it in a few minutes.');
  }
}

function renderCountry() {
  const c = selectedCountry;
  if (!c) return;
  const cur = firstCurrency(c);

  setText('#countryFlag', c.flag || flagEmoji(c.cca2));
  setText('#countryName', c.name.common);
  setText('#countryTagline', (c.subregion || c.region || 'Explore') + ' · ' + (c.capital || ['—'])[0]);
  setText('#countryRegionBadge', c.region || '—');
  setText('#citiesTitle', 'Best cities in ' + c.name.common);
  setText('#visaPaneTitle', 'Visa for a ' + (profile.homeName || 'your') + ' passport');

  const zones = c.timezones || [];
  const facts = [
    ['Capital', (c.capital || ['—'])[0]],
    ['Currency', cur.code],
    ['Exchange rate', 'Loading...', 'factRate'],
    ['Capital weather', 'Loading...', 'factWx'],
    ['Language', Object.values(c.languages || {})[0] || '—'],
    ['Population', compactPop(c.population)],
    ['Time zone', (zones[0] || '—') + (zones.length > 1 ? ' (+' + (zones.length - 1) + ')' : '')],
    ['Calling code', c.callingCode || '—'],
    ['Driving', (c.car && c.car.side) || '—']
  ];
  setHTML('#factStrip', facts.map(f =>
    '<div class="fact"><small>' + esc(f[0]) + '</small><b' +
    (f[2] ? ' id="' + f[2] + '"' : '') + '>' + esc(f[1]) + '</b></div>').join(''));

  const cityGrid = $('#cityGrid');
  if (cityGrid) cityGrid.innerHTML = '';
  setHTML('#costTiers', '');
  setHTML('#visaBrief', '');
  setHTML('#safetyBrief', '');
  setText('#countryVisaBadge', 'Visa: checking');

  syncSaveBtn();
  showPane('cities');
}

async function loadRate() {
  if (!selectedCountry) return;
  const cur = firstCurrency(selectedCountry);
  const from = String(profile.currency || 'USD').toUpperCase();
  try {
    if (from === cur.code) { setText('#factRate', 'Same as home'); return; }
    const { rate } = await getRate(from, cur.code);
    setText('#factRate', '1 ' + from + ' = ' + fmtRate(rate) + ' ' + cur.code);
  } catch (e) { setText('#factRate', 'Unavailable'); }
}

async function geocodeCapital(city, country) {
  const key = 'geo_' + country + '_' + city;
  try { const hit = JSON.parse(sessionStorage.getItem(key) || 'null'); if (hit) return hit; }
  catch (e) { /* ignore */ }
  const url = (CFG.GEOCODE_SEARCH || '') + '?name=' + encodeURIComponent(city) + '&count=10&language=en&format=json';
  const r = await fetchTimeout(url, { cache: 'no-store' }, 10000);
  if (!r.ok) throw new Error('geocode');
  const j = await r.json();
  const res = j.results || [];
  if (!res.length) throw new Error('no match');
  const hit = res.find(x => String(x.country_code || '').toUpperCase() === String(country).toUpperCase()) || res[0];
  const coords = { lat: hit.latitude, lon: hit.longitude };
  try { sessionStorage.setItem(key, JSON.stringify(coords)); } catch (e) { /* ignore */ }
  return coords;
}

const WMO = {0:['Clear','☀'],1:['Mostly clear','◔'],2:['Partly cloudy','☁'],3:['Overcast','☁'],
  45:['Fog','≋'],48:['Freezing fog','≋'],51:['Light drizzle','☂'],53:['Drizzle','☂'],55:['Heavy drizzle','☂'],
  56:['Freezing drizzle','☂'],57:['Freezing drizzle','☂'],61:['Light rain','☂'],63:['Rain','☂'],65:['Heavy rain','☂'],
  66:['Freezing rain','☂'],67:['Freezing rain','☂'],71:['Light snow','❄'],73:['Snow','❄'],75:['Heavy snow','❄'],
  77:['Snow grains','❄'],80:['Showers','☂'],81:['Showers','☂'],82:['Heavy showers','☂'],85:['Snow showers','❄'],
  86:['Snow showers','❄'],95:['Thunderstorm','ϟ'],96:['Thunderstorm','ϟ'],99:['Severe storm','ϟ']};

async function loadWeather() {
  if (!selectedCountry) return;
  const c = selectedCountry;
  const capital = (c.capital || [])[0];
  const centre = c.latlng || [];
  let lat = centre[0], lon = centre[1];

  if (capital) {
    try { const g = await geocodeCapital(capital, c.cca2); lat = g.lat; lon = g.lon; }
    catch (e) { /* centroid fallback */ }
  }
  if (lat == null || lon == null) { setText('#factWx', 'No coordinates'); return; }

  const f = String(CFG.TEMPERATURE_UNIT || 'C').toUpperCase() === 'F';
  try {
    const url = (CFG.OPEN_METEO_FORECAST || '') + '?latitude=' + encodeURIComponent(lat) +
      '&longitude=' + encodeURIComponent(lon) + '&current=temperature_2m,weather_code&timezone=auto' +
      (f ? '&temperature_unit=fahrenheit' : '');
    const r = await fetchTimeout(url, { cache: 'no-store' }, 12000);
    if (!r.ok) throw new Error('bad');
    const j = await r.json();
    const cur = j.current || {};
    if (cur.temperature_2m == null) throw new Error('none');
    const w = WMO[cur.weather_code] || ['Weather', '◌'];
    setText('#factWx', w[1] + ' ' + Math.round(cur.temperature_2m) + '°' + (f ? 'F' : 'C') + ' · ' + w[0]);
  } catch (e) { setText('#factWx', 'Unavailable'); }
}

/* ---- panes ---- */

function showPane(name) {
  const map = { cities:'#paneCities', costs:'#paneCosts', visa:'#paneVisa',
                safety:'#paneSafety', plan:'#panePlan', ask:'#paneAsk' };
  Object.entries(map).forEach(([k, sel]) => {
    const el = $(sel);
    if (el) el.classList.toggle('active', k === name);
  });
  $$('#countryTabs button').forEach(b => {
    const on = b.dataset.tab === name;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  if (name === 'costs' && !$('#costTiers').innerHTML.trim()) loadCosts();
  if (name === 'safety' && !$('#safetyBrief').innerHTML.trim()) loadSafety();
  if (name === 'visa' && !$('#visaBrief').innerHTML.trim()) loadVisaBrief();
}

/* ---- cities ---- */

function skeletons(n) {
  return Array.from({ length: n }, (_, i) => '<div class="skeleton" style="--i:' + i + '"></div>').join('');
}

function visaClass(status) {
  const s = String(status || '').toLowerCase();
  if (s.indexOf('free') > -1) return 'visa-free';
  if (s.indexOf('arrival') > -1) return 'visa-voa';
  if (s.indexOf('evisa') > -1 || s.indexOf('e-visa') > -1) return 'visa-evisa';
  if (s.indexOf('required') > -1) return 'visa-req';
  return 'visa-unk';
}

async function loadCities(force) {
  if (!selectedCountry) return;
  const token = ++cityToken;
  const grid = $('#cityGrid');
  if (!grid) return;

  if (!CFG.API_URL) {
    grid.innerHTML = '<div class="brief-empty">Connect the Travel AI database backend to map cities. ' +
      'Add your Apps Script /exec URL as API_URL in js/config.js.</div>';
    return;
  }

  if (!force && currentCountryBundle && Array.isArray(currentCountryBundle.cities) && currentCountryBundle.cities.length) {
    renderCitiesList(currentCountryBundle.cities);
    return;
  }

  grid.innerHTML = skeletons(6);

  try {
    const r = await api('cityGuide', ctx({
      country: selectedCountry.name.common,
      countryCode: selectedCode,
      nocache: force ? Date.now() : ''
    }));
    if (token !== cityToken) return;

    const list = (r.data && r.data.cities) || [];
    if (!list.length) throw new Error('No cities came back. Try Refresh.');

    renderCitiesList(list);
  } catch (e) {
    if (token !== cityToken) return;
    grid.innerHTML = '<div class="brief-empty">' + esc(e.message) + '</div>';
  }
}

/* ---- city dossier in the answer box ---- */

async function openCity(city) {
  if (!city || !selectedCountry) return;
  const token = ++boxToken;
  const localCur = firstCurrency(selectedCountry).code;

  openBox('CITY INTELLIGENCE', city, boxLoading('Compiling field intelligence for ' + city + '...'));

  try {
    const r = await api('cityExplore', ctx({
      city, country: selectedCountry.name.common,
      countryCode: selectedCode, localCurrency: localCur
    }));
    if (token !== boxToken) return;

    const d = r.data || {};
    const daily = d.daily || {};
    const costCur = d.currency || localCur;
    const dailyTotal = ['stay','food','transport','activities']
      .reduce((s, k) => s + (num(daily[k]) || 0), 0);

    let html = '';
    if (d.intro) html += '<p class="brief-copy">' + esc(d.intro) + '</p>';

    html += '<div class="dstrip">' +
      (d.score ? '<div><small>AI TRAVEL SCORE</small><b>' + esc(d.score) + ' / 100</b></div>' : '') +
      (d.days ? '<div><small>RECOMMENDED STAY</small><b>' + esc(d.days) + '</b></div>' : '') +
      (d.bestTime ? '<div><small>BEST TIME</small><b>' + esc(d.bestTime) + '</b></div>' : '') +
      (d.gettingAround ? '<div><small>GETTING AROUND</small><b>' + esc(d.gettingAround) + '</b></div>' : '') +
      '</div>';

    if ((d.perfectFor || []).length) {
      html += '<div class="rec-tags" style="margin-bottom:16px">' +
        d.perfectFor.map(t => '<em>' + esc(t) + '</em>').join('') + '</div>';
    }

    if (dailyTotal) {
      html += '<section class="dsec"><header><span class="dsec-kicker">DAILY COST</span>' +
        '<h3>' + esc(profile.style) + ' traveller, per person</h3></header>' +
        '<div class="cost-bars">' + costBars(daily, costCur) + '</div>' +
        '<div class="rec-total"><small>APPROX DAILY TOTAL</small><b>' +
        money(dailyTotal, localCur) + '</b><span class="badge badge-est">Estimate</span></div></section>';
    }

    if ((d.sights || []).length) {
      html += '<section class="dsec"><header><span class="dsec-kicker">MUST SEE · ' + d.sights.length +
        '</span><h3>What to see</h3></header><div class="dgrid">' +
        d.sights.map((x, i) => attractionCard(x, i, 'fee', city)).join('') + '</div></section>';
    }

    if ((d.activities || []).length) {
      html += '<section class="dsec"><header><span class="dsec-kicker">TOP EXPERIENCES</span>' +
        '<h3>Things to do</h3></header><div class="dgrid">' +
        d.activities.map((x, i) => attractionCard(x, i, 'price', city)).join('') + '</div></section>';
    }

    if ((d.food || []).length) {
      html += '<section class="dsec"><header><span class="dsec-kicker">FOOD</span><h3>Eat this</h3></header>' +
        '<ul class="dlist">' + d.food.map(x => '<li><b>' + esc(x.name) + '</b><span>' +
        esc(x.what || '') + '</span></li>').join('') + '</ul></section>';
    }

    if ((d.tips || []).length) {
      html += '<section class="dsec"><header><span class="dsec-kicker">FIELD NOTES</span>' +
        '<h3>Local tips</h3></header><ul class="dtips">' +
        d.tips.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></section>';
    }

    html += '<div class="disclaimer">Prices are estimates for a foreign adult visitor and change often. ' +
      'Opening hours and tickets should be confirmed on the official site before you go.</div>' +
      '<div class="source-list" id="citySources"></div>';

    setHTML('#boxBody', html);
    renderSources('#citySources', r.sources, r.checked);
    paintPrices('#boxBody', costCur);
    wireAddToTrip(city);
  } catch (e) {
    if (token !== boxToken) return;
    setHTML('#boxBody', '<div class="brief-empty">' + esc(e.message) + '</div>');
  }
}

function attractionCard(x, i, priceKey, city) {
  const p = x[priceKey] || null;
  return '<article class="dcard" style="--i:' + i + '">' +
    '<div class="dcard-top"><b>' + esc(x.name) + '</b>' +
    (x.category ? '<span class="dcat">' + esc(x.category) + '</span>' : '') + '</div>' +
    '<p>' + esc(x.what || '') + '</p>' +
    (x.why ? '<p class="why">' + esc(x.why) + '</p>' : '') +
    '<div class="dmeta">' +
    (x.duration ? '<span>◷ ' + esc(x.duration) + '</span>' : '') +
    (x.bestTime ? '<span>❄ ' + esc(x.bestTime) + '</span>' : '') +
    (x.bestFor ? '<span>★ ' + esc(x.bestFor) + '</span>' : '') +
    '</div>' +
    '<div class="dprice" data-price=\'' + esc(JSON.stringify(p)) + '\'>...' +
    '<button class="add" data-add="' + esc(x.name) + '" data-city="' + esc(city) + '">+ Trip</button>' +
    '</div></article>';
}

function costBars(daily, cur) {
  const rows = [['Stay','stay'],['Food','food'],['Transport','transport'],['Activities','activities']];
  const vals = rows.map(r => num(daily[r[1]]) || 0);
  const max = Math.max(...vals, 1);
  return rows.map((r, i) =>
    '<div class="cost-bar"><span>' + r[0] + '</span>' +
    '<i style="width:' + Math.round((vals[i] / max) * 100) + '%"></i>' +
    '<b>' + money(vals[i], cur) + '</b></div>').join('');
}

function wireAddToTrip(city) {
  $$('#boxBody [data-add]').forEach(b => {
    b.onclick = ev => {
      ev.stopPropagation();
      addToTrip(b.dataset.add, b.dataset.city || city);
      b.textContent = '✓ Added';
      b.disabled = true;
    };
  });
}

function addToTrip(name, city) {
  const list = readJSON('travel_ai_wish_v3', []) || [];
  list.push({ name, city, country: selectedCountry ? selectedCountry.name.common : '', code: selectedCode });
  writeJSON('travel_ai_wish_v3', list);
}

/* ---- trip costs ---- */

async function loadCosts(force) {
  if (!selectedCountry) return;
  const out = $('#costTiers');
  if (!out) return;
  out.innerHTML = '<div class="tier-grid">' + skeletons(4) + '</div>';

  try {
    const r = await api('tripCosts', ctx({
      country: selectedCountry.name.common,
      countryCode: selectedCode,
      days: 7,
      nocache: force ? Date.now() : ''
    }));
    const d = r.data || {};
    const cur = d.currency || profile.currency;
    const days = num(d.days) || 7;
    const tiers = d.tiers || [];
    if (!tiers.length) throw new Error('No cost data came back.');

    out.innerHTML = '<div class="tier-grid">' + tiers.map((t, i) => {
      const daily = ['stay','food','transport','activities'].reduce((s, k) => s + (num(t[k]) || 0), 0);
      const lo = daily * days + (num(t.flightLow) || 0);
      const hi = daily * days + (num(t.flightHigh) || 0);
      return '<div class="tier ' + (t.tier === profile.style ? 'on' : '') + '" style="--i:' + i + '">' +
        '<h4>' + esc(t.tier) + '</h4><span class="per">per person, per day</span>' +
        '<div class="rows">' +
        '<div><span>Stay</span><b>' + money(t.stay, '') + '</b></div>' +
        '<div><span>Food</span><b>' + money(t.food, '') + '</b></div>' +
        '<div><span>Transport</span><b>' + money(t.transport, '') + '</b></div>' +
        '<div><span>Activities</span><b>' + money(t.activities, '') + '</b></div>' +
        '<div><span>Daily</span><b>' + money(daily, cur) + '</b></div>' +
        '</div><div class="big"><span>' + days + ' days + est. flight</span><b>' +
        money(lo, '') + ' – ' + money(hi, cur) + '</b></div></div>';
    }).join('') + '</div>' +
    '<div class="rec-total" style="margin-top:14px"><span class="badge badge-est">Flights not included</span>' +
    '<small style="color:#8ba7b8">Connect a live fare provider to include flight prices.</small></div>' +
    '<div class="source-list" id="costSources"></div>';

    renderSources('#costSources', r.sources, r.checked);
  } catch (e) {
    out.innerHTML = '<div class="brief-empty">' + esc(e.message) + '</div>';
  }
}

/* ---- visa + safety ---- */

async function loadVisaBrief(force) {
  if (!selectedCountry) return;
  const token = countryToken;
  const pk = String(profile.passport || profile.home || '').toUpperCase();
  const cachedVisa = currentCountryBundle && currentCountryBundle.visas && currentCountryBundle.visas[pk];
  if (!force && cachedVisa) { renderVisaFromBundle(cachedVisa); return; }
  setHTML('#visaBrief', '<span class="loading-pulse">Checking current visa position...</span>');
  try {
    const r = await api('visaInfo', ctx({
      country: selectedCountry.name.common,
      countryCode: selectedCode,
      nocache: force ? Date.now() : ''
    }));
    if (token !== countryToken) return;
    setHTML('#visaBrief', renderBrief(r.answer));
    renderSources('#visaSources', r.sources, r.checked);

    const m = String(r.answer || '').match(/visa[- ]free|visa on arrival|e-?visa|visa required/i);
    const status = m ? m[0] : '';
    const badge = $('#countryVisaBadge');
    if (badge) {
      badge.textContent = 'Visa: ' + (status || 'see tab');
      badge.className = 'visa-badge ' + visaClass(status);
    }
  } catch (e) {
    if (token !== countryToken) return;
    setHTML('#visaBrief', '<div class="brief-empty">' + esc(e.message) + '</div>');
    const badge = $('#countryVisaBadge');
    if (badge) { badge.textContent = 'Visa: check tab'; badge.className = 'visa-badge visa-unk'; }
  }
}

async function loadSafety(force) {
  if (!selectedCountry) return;
  if (!force && currentCountryBundle && currentCountryBundle.safety) { renderSafetyFromBundle(currentCountryBundle.safety); return; }
  setHTML('#safetyBrief', '<span class="loading-pulse">Checking current advisories...</span>');
  try {
    const r = await api('safetyInfo', ctx({
      country: selectedCountry.name.common,
      countryCode: selectedCode,
      nocache: force ? Date.now() : ''
    }));
    setHTML('#safetyBrief', renderBrief(r.answer));
    renderSources('#safetySources', r.sources, r.checked);
  } catch (e) {
    setHTML('#safetyBrief', '<div class="brief-empty">' + esc(e.message) + '</div>');
  }
}

/* ---- ask ---- */

async function askAI(q) {
  q = norm(q);
  if (!q) return;
  if (!selectedCountry) { setHTML('#askOut', '<div class="brief-empty">Open a country first.</div>'); return; }
  setHTML('#askOut', '<span class="loading-pulse">Thinking...</span>');
  setHTML('#askSources', '');
  try {
    const r = await api('askTravel', ctx({
      question: q, country: selectedCountry.name.common, countryCode: selectedCode
    }));
    setHTML('#askOut', renderBrief(r.answer));
    renderSources('#askSources', r.sources, r.checked);
  } catch (e) {
    setHTML('#askOut', '<div class="brief-empty">' + esc(e.message) + '</div>');
  }
}

/* ================= TRIP PLANNER ================= */

async function buildPlan() {
  if (!selectedCountry) { alert('Open a country first.'); return; }
  const out = $('#planOut');
  out.innerHTML = boxLoading('Routing your itinerary...');
  $('#pOptimize').disabled = true;

  try {
    const r = await api('planTrip', ctx({
      country: selectedCountry.name.common,
      countryCode: selectedCode,
      days: $('#pDays').value,
      cities: $('#pCities').value,
      arrival: $('#pArrival').value,
      budget: $('#pBudget').value
    }));
    tripPlan = r.data || {};
    writeJSON('travel_ai_plan_v3', tripPlan);
    renderPlan();
    $('#pOptimize').disabled = false;
  } catch (e) {
    out.innerHTML = '<div class="brief-empty">' + esc(e.message) + '</div>';
  }
}

function renderPlan() {
  const out = $('#planOut');
  if (!out) return;
  if (!tripPlan || !(tripPlan.days || []).length) { out.innerHTML = ''; return; }

  out.innerHTML =
    '<div class="plan-meta"><b>' + esc(tripPlan.title || 'Your trip') + '</b>' +
    '<p>' + esc(tripPlan.summary || '') + '</p></div>' +
    '<div class="timeline">' + tripPlan.days.map((d, i) => planDay(d, i)).join('') + '</div>' +
    '<div id="optOut"></div>';

  out.querySelectorAll('[data-move]').forEach(b => {
    b.onclick = () => {
      const i = Number(b.dataset.idx), dir = b.dataset.move === 'up' ? -1 : 1;
      const j = i + dir;
      if (j < 0 || j >= tripPlan.days.length) return;
      const arr = tripPlan.days;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      arr.forEach((d, k) => d.day = k + 1);
      writeJSON('travel_ai_plan_v3', tripPlan);
      renderPlan();
    };
  });
  out.querySelectorAll('[data-del]').forEach(b => {
    b.onclick = () => {
      tripPlan.days.splice(Number(b.dataset.del), 1);
      tripPlan.days.forEach((d, k) => d.day = k + 1);
      writeJSON('travel_ai_plan_v3', tripPlan);
      renderPlan();
    };
  });
}

function planDay(d, i) {
  const slot = (label, s) => {
    if (!s) return '';
    const what = typeof s === 'string' ? s : (s.what || '');
    const note = typeof s === 'string' ? '' : (s.note || '');
    if (!what) return '';
    return '<div class="slot"><small>' + label + '</small><div><b>' + esc(what) + '</b>' +
      (note ? '<p>' + esc(note) + '</p>' : '') + '</div></div>';
  };
  return '<article class="tday" style="--i:' + i + '">' +
    '<div class="tday-head"><div class="tday-num">' + (d.day || i + 1) + '</div>' +
    '<div><b>' + esc(d.city || '') + '</b><small>' + esc(d.theme || '') + '</small></div>' +
    '<div class="tools">' +
    '<button data-move="up" data-idx="' + i + '" aria-label="Move up">↑</button>' +
    '<button data-move="down" data-idx="' + i + '" aria-label="Move down">↓</button>' +
    '<button data-del="' + i + '" aria-label="Remove day">×</button></div></div>' +
    slot('MORNING', d.morning) + slot('AFTERNOON', d.afternoon) + slot('EVENING', d.evening) +
    (d.food ? '<div class="slot"><small>FOOD</small><div><b>' + esc(d.food) + '</b></div></div>' : '') +
    (d.transport ? '<div class="slot"><small>TRANSPORT</small><div><b>' + esc(d.transport) + '</b></div></div>' : '') +
    '</article>';
}

async function optimizePlan() {
  if (!tripPlan) return;
  const out = $('#optOut');
  if (out) out.innerHTML = '<span class="loading-pulse">Checking your routing...</span>';
  try {
    const r = await api('optimizeTrip', ctx({
      country: selectedCountry ? selectedCountry.name.common : '',
      itinerary: JSON.stringify(tripPlan).slice(0, 3500)
    }));
    const d = r.data || {};
    const issues = d.issues || [];
    out.innerHTML =
      '<div class="plan-meta" style="margin-top:14px"><b>Routing score: ' + esc(d.score ?? '—') + ' / 100</b>' +
      '<p>' + esc(d.verdict || '') + '</p></div>' +
      (issues.length
        ? '<div class="opt-issues">' + issues.map(x =>
            '<div class="opt-issue"><b>Day ' + esc(x.day) + ' · ' + esc(x.problem) + '</b>' +
            esc(x.fix) + '</div>').join('') + '</div>'
        : '<div class="brief-empty">No routing problems found. The plan is efficient.</div>');
  } catch (e) {
    if (out) out.innerHTML = '<div class="brief-empty">' + esc(e.message) + '</div>';
  }
}

/* ================= DESTINATION FINDER ================= */

async function runFinder() {
  const out = $('#finderResults');
  const days = parseInt($('#fDays').value, 10) || 7;

  profile.from = norm($('#fFrom').value) || profile.from;
  profile.style = $('#fStyle').value;
  profile.travelType = $('#fType').value;
  writeJSON('travel_ai_profile_v3', profile);
  afterProfileChange();

  out.innerHTML = boxLoading('Scoring destinations against your budget, month and passport...');

  try {
    const r = await api('discover', ctx({
      month: $('#fMonth').value,
      days,
      budget: $('#fBudget').value,
      visaFilter: $('#fVisa').value,
      weather: $('#fWeather').value
    }));
    const d = r.data || {};
    const picks = d.picks || [];
    if (!picks.length) throw new Error('No destinations came back. Widen the budget or the filters.');

    const cur = d.currency || profile.currency;
    out.innerHTML = picks.map((p, i) => recCard(p, i, cur, days)).join('') +
      '<div class="disclaimer">Flight prices are not included until a live fare provider is connected. ' +
      'Visa status must be confirmed officially before booking.</div>' +
      '<div class="source-list" id="finderSources"></div>';

    renderSources('#finderSources', r.sources, r.checked);
    wireRecActions(out);
  } catch (e) {
    out.innerHTML = '<div class="brief-empty">' + esc(e.message) + '</div>';
  }
}

function recCard(p, i, cur, days) {
  const daily = p.daily || {};
  const dailyTotal = ['stay','food','transport','activities'].reduce((s, k) => s + (num(daily[k]) || 0), 0);
  const flight = p.flight || {};
  const total = p.tripTotal || {};
  const vClass = visaClass(p.visa && p.visa.status);

  return '<article class="rec" style="--i:' + i + '">' +
    '<header class="rec-head">' +
    '<span class="rec-flag">' + esc(flagEmoji(p.code)) + '</span>' +
    '<div class="rec-id"><b>' + esc(String(p.country || '').toUpperCase()) + '</b>' +
    '<small>' + esc((p.cities || []).slice(0, 4).join(' · ')) + '</small></div>' +
    '<div class="ring" style="--p:' + (num(p.match) || 0) + '"><i>' + esc(p.match ?? '—') + '%' +
    '<small>MATCH</small></i></div></header>' +

    '<div class="rec-body">' +
    '<p class="rec-why">' + esc(p.why || '') + '</p>' +
    '<div class="rec-tags">' + (p.bestFor || []).map(t => '<em>' + esc(t) + '</em>').join('') + '</div>' +

    '<div class="rec-facts">' +
    '<div class="rec-fact"><small>BEST PERIOD</small><b>' + esc(p.bestPeriod || '—') + '</b></div>' +
    '<div class="rec-fact"><small>VISA</small><b class="' + vClass + '">' +
    esc((p.visa && p.visa.status) || 'Unconfirmed') + '</b>' +
    ((p.visa && p.visa.note) ? '<b style="color:#8fb0c1;font-size:11px">' + esc(p.visa.note) + '</b>' : '') + '</div>' +
    '<div class="rec-fact"><small>FLIGHT (EST.)</small><b>' +
    money(flight.low, '') + ' – ' + money(flight.high, cur) + '</b></div>' +
    '</div>' +

    (dailyTotal ? '<div class="cost-bars">' + costBars(daily, cur) + '</div>' : '') +

    '<div class="rec-total"><small>APPROX ' + days + '-DAY TRIP</small>' +
    '<b>' + money(total.low, '') + ' – ' + money(total.high, cur) + '</b>' +
    '<span class="badge badge-est">Flights not included</span></div>' +
    '</div>' +

    '<div class="rec-actions">' +
    '<button class="primary-btn" data-explore="' + esc(p.code) + '">Explore ' + esc(p.country) + '</button>' +
    '<button class="secondary-btn" data-plan="' + esc(p.code) + '">Build trip</button>' +
    '<button class="secondary-btn" data-save="' + esc(p.code) + '">Save</button>' +
    '</div></article>';
}

function wireRecActions(scope) {
  scope.querySelectorAll('[data-explore]').forEach(b =>
    b.onclick = () => selectCountry(b.dataset.explore));
  scope.querySelectorAll('[data-plan]').forEach(b =>
    b.onclick = async () => { await selectCountry(b.dataset.plan); showPane('plan'); });
  scope.querySelectorAll('[data-save]').forEach(b =>
    b.onclick = () => { saveCountry(b.dataset.save); b.textContent = '✓ Saved'; });
}

/* ================= MONTH PICKS ================= */

async function loadMonthPicks(force) {
  const out = $('#monthGroups');
  if (!out) return;
  const month = $('#monthPick') ? $('#monthPick').value : MONTHS[new Date().getMonth()];
  setText('#monthTitle', 'Where to go in ' + month);

  if (!CFG.API_URL) {
    out.innerHTML = '<div class="brief-empty">Connect the Travel AI database backend to see monthly picks.</div>';
    return;
  }
  out.innerHTML = '<div class="mrow">' + skeletons(4) + '</div>';

  try {
    const r = await api('monthPicks', ctx({ month, nocache: force ? Date.now() : '' }));
    const d = r.data || {};
    const groups = d.groups || [];
    if (!groups.length) throw new Error('No picks came back.');
    const cur = d.currency || profile.currency;

    out.innerHTML = groups.map(g =>
      '<div class="mgroup"><h3>' + esc(g.title) + '</h3><div class="mrow">' +
      (g.picks || []).map((p, i) =>
        '<article class="mcard" data-explore="' + esc(p.code) + '" role="button" tabindex="0" style="--i:' + i + '">' +
        '<div class="mflag">' + esc(flagEmoji(p.code)) + '</div>' +
        '<b>' + esc(p.country) + '</b>' +
        '<p>' + esc(p.why || '') + '</p>' +
        '<div class="mmeta"><span>' + esc(p.weather || '') + '</span>' +
        '<span class="' + visaClass(p.visa) + '">' + esc(p.visa || '') + '</span>' +
        (p.tripTotal ? '<span>~' + money(p.tripTotal, cur) + '</span>' : '') + '</div>' +
        '</article>').join('') + '</div></div>').join('');

    out.querySelectorAll('[data-explore]').forEach(el => {
      el.onclick = () => selectCountry(el.dataset.explore);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
      });
    });
  } catch (e) {
    out.innerHTML = '<div class="brief-empty">' + esc(e.message) + '</div>';
  }
}

/* ================= VISA MATRIX ================= */

async function loadVisaMatrix(bucket, force) {
  visaBucket = bucket || visaBucket;
  const out = $('#visaResults');
  if (!out) return;

  $$('#visaTabs button').forEach(b => b.classList.toggle('active', b.dataset.bucket === visaBucket));

  if (!profile.home) { out.innerHTML = '<div class="brief-empty">Set your home country first.</div>'; return; }
  if (!CFG.API_URL) { out.innerHTML = '<div class="brief-empty">Connect the database backend first.</div>'; return; }

  if (force) { clearTimeout(visaMatrixTimer); visaMatrixBuilding = false; }
  if (!out.innerHTML.trim() || force) out.innerHTML = boxLoading('Opening your stored passport matrix...');

  try {
    await api('ensurePassportDataset', ctx({ passport: profile.passport || profile.home }));
    let r = await api('visaMatrix', ctx({ bucket: visaBucket }));
    let d = r.data || {}, list = d.countries || [], build = r.build || {};

    const progress = Number((d.coverage && d.coverage.progress) || build.visaProgress || 0);
    const built = Number((d.coverage && d.coverage.built) || build.visaBuilt || 0);
    const total = Number((d.coverage && d.coverage.total) || build.visaTotal || 249);
    const building = !!r.building;

    const progressBox = building
      ? '<div class="brief-empty" style="margin-bottom:14px"><b>Building your complete ' + esc(profile.homeName || 'passport') + ' visa database</b><br>' +
        '<span>Saved ' + built + ' of ' + total + ' countries · ' + progress + '%</span><br>' +
        '<span style="color:#8fb0c1">Results below are already saved. The remaining countries continue updating automatically.</span></div>'
      : '<div class="brief-empty" style="margin-bottom:14px"><b>✓ Complete passport matrix ready</b><br><span>' + total + ' destinations stored in Google Sheets.</span></div>';

    const cards = list.length
      ? '<div class="visa-grid">' + list.map((c, i) =>
          '<article class="vcard" data-explore="' + esc(c.code) + '" role="button" tabindex="0" style="--i:' + i + '">' +
          '<span class="f">' + esc(flagEmoji(c.code)) + '</span>' +
          '<div><b>' + esc(c.country) + '</b><small>' + esc(c.note || c.region || '') + '</small></div>' +
          '</article>').join('') + '</div>'
      : '<div class="brief-empty">No ' + esc(visaBucket.toLowerCase()) + ' destinations are confirmed in the saved portion yet. The passport matrix is still being built.</div>';

    out.innerHTML = progressBox + cards +
      '<div class="disclaimer">Visa rules can change. The matrix is stored for fast browsing and refreshed periodically; confirm official requirements before booking.</div>';

    out.querySelectorAll('[data-explore]').forEach(el => {
      el.onclick = () => selectCountry(el.dataset.explore);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
      });
    });

    // Keep the first user's screen alive while the matrix is being created.
    // One chunk is processed now; the time trigger continues even if they leave.
    if (building && !visaMatrixBuilding) {
      visaMatrixBuilding = true;
      api('processPassportDataset', ctx({ passport: profile.passport || profile.home }))
        .catch(() => null)
        .finally(() => {
          visaMatrixBuilding = false;
          clearTimeout(visaMatrixTimer);
          visaMatrixTimer = setTimeout(() => {
            if (currentView === 'visa') loadVisaMatrix(visaBucket, false);
          }, 1200);
        });
    }
  } catch (e) {
    out.innerHTML = '<div class="brief-empty">' + esc(e.message) + '</div>';
  }
}

/* ================= SAVED TRIPS ================= */

function saveCountry(code) {
  const c = countryByCode(code || selectedCode);
  if (!c) return;
  if (saved.some(x => x.code === c.cca2)) saved = saved.filter(x => x.code !== c.cca2);
  else saved.push({ code: c.cca2, name: c.name.common, flag: c.flag || flagEmoji(c.cca2) });
  writeJSON('travel_ai_saved_v3', saved);
  syncSaveBtn();
}

function syncSaveBtn() {
  const b = $('#saveCountryBtn');
  if (!b) return;
  const on = saved.some(x => x.code === selectedCode);
  b.textContent = on ? '✓ Saved' : '＋ Save';
  b.setAttribute('aria-pressed', on ? 'true' : 'false');
}

function renderTrips() {
  const out = $('#tripsOut');
  if (!out) return;
  const wish = readJSON('travel_ai_wish_v3', []) || [];

  let html = '';
  html += '<h3 style="font-size:16px;margin:0 0 10px">Saved countries</h3>';
  html += saved.length
    ? saved.map(x =>
        '<div class="trip-item"><b>' + esc(x.flag) + ' ' + esc(x.name) + '</b><span class="sp"></span>' +
        '<button class="secondary-btn" data-open="' + esc(x.code) + '">Open</button>' +
        '<button class="secondary-btn" data-drop="' + esc(x.code) + '">Remove</button></div>').join('')
    : '<div class="brief-empty">Nothing saved yet. Save a country from the finder or a country page.</div>';

  html += '<h3 style="font-size:16px;margin:22px 0 10px">Saved attractions</h3>';
  html += wish.length
    ? wish.map((x, i) =>
        '<div class="trip-item"><b>' + esc(x.name) + '</b>' +
        '<small style="color:#8fb0c1">' + esc(x.city) + ', ' + esc(x.country) + '</small>' +
        '<span class="sp"></span><button class="secondary-btn" data-wdrop="' + i + '">Remove</button></div>').join('')
    : '<div class="brief-empty">Add attractions from any city dossier with the + Trip button.</div>';

  if (tripPlan && (tripPlan.days || []).length) {
    html += '<h3 style="font-size:16px;margin:22px 0 10px">Current itinerary</h3>' +
      '<div class="trip-item"><b>' + esc(tripPlan.title || 'Your trip') + '</b>' +
      '<small style="color:#8fb0c1">' + tripPlan.days.length + ' days</small><span class="sp"></span>' +
      '<button class="secondary-btn" id="openPlan">Open</button></div>';
  }

  out.innerHTML = html;

  out.querySelectorAll('[data-open]').forEach(b => b.onclick = () => selectCountry(b.dataset.open));
  out.querySelectorAll('[data-drop]').forEach(b => b.onclick = () => {
    saved = saved.filter(x => x.code !== b.dataset.drop);
    writeJSON('travel_ai_saved_v3', saved); renderTrips(); syncSaveBtn();
  });
  out.querySelectorAll('[data-wdrop]').forEach(b => b.onclick = () => {
    const list = readJSON('travel_ai_wish_v3', []) || [];
    list.splice(Number(b.dataset.wdrop), 1);
    writeJSON('travel_ai_wish_v3', list); renderTrips();
  });
  const op = $('#openPlan');
  if (op) op.onclick = () => { showView('country'); showPane('plan'); renderPlan(); };
}

/* ================= SEARCH BINDING ================= */

function bindSearch(inputSel, boxSel, btnSel, onPick) {
  const input = $(inputSel), box = $(boxSel);
  if (!input) return;
  let active = -1, items = [];

  const close = () => {
    if (box) { box.classList.remove('open'); box.innerHTML = ''; }
    input.setAttribute('aria-expanded', 'false');
    active = -1; items = [];
  };
  const highlight = i => {
    const nodes = box ? [...box.querySelectorAll('.search-result')] : [];
    nodes.forEach(n => n.classList.remove('active'));
    if (i >= 0 && nodes[i]) { nodes[i].classList.add('active'); nodes[i].scrollIntoView({ block: 'nearest' }); }
    active = i;
  };
  const choose = i => {
    const c = items[i];
    if (!c) return;
    input.value = c.name.common;
    close();
    onPick(c.cca2);
  };
  const render = list => {
    if (!box) return;
    items = list; active = -1;
    if (!list.length) {
      box.innerHTML = '<div class="search-empty">No country matches that.</div>';
      box.classList.add('open'); return;
    }
    box.innerHTML = list.map((c, i) =>
      '<div class="search-result" role="option" data-i="' + i + '">' +
      '<span><b>' + esc(c.flag || flagEmoji(c.cca2)) + ' ' + esc(c.name.common) + '</b></span>' +
      '<small>' + esc(c.region || '') + '</small></div>').join('');
    box.classList.add('open');
    input.setAttribute('aria-expanded', 'true');
    box.querySelectorAll('.search-result').forEach(el =>
      el.addEventListener('mousedown', ev => { ev.preventDefault(); choose(Number(el.dataset.i)); }));
  };

  input.addEventListener('input', () => {
    const q = input.value;
    if (norm(q).length < 2) { close(); return; }
    render(rankCountries(q, 6));
  });

  input.addEventListener('keydown', e => {
    const open = box && box.classList.contains('open') && items.length;
    if (e.key === 'ArrowDown' && open) { e.preventDefault(); highlight(Math.min(active + 1, items.length - 1)); return; }
    if (e.key === 'ArrowUp' && open) { e.preventDefault(); highlight(Math.max(active - 1, 0)); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (open && active >= 0) { choose(active); return; }
      close();
      const code = resolveCountry(input.value);
      if (code) onPick(code); else selectCountry(input.value);
      return;
    }
    if (e.key === 'Escape') close();
  });

  input.addEventListener('blur', () => setTimeout(close, 120));

  if (btnSel) {
    const btn = $(btnSel);
    if (btn) btn.onclick = () => {
      close();
      const code = resolveCountry(input.value);
      if (code) onPick(code); else selectCountry(input.value);
    };
  }
}

/* ================= MAP ================= */

function mapFallback(msg) {
  const el = $('#chartdiv');
  if (el) el.innerHTML = '<div class="map-fallback">' + esc(msg) + '</div>';
}

function initMap() {
  if (typeof am5 === 'undefined' || typeof am5map === 'undefined' || typeof am5geodata_worldLow === 'undefined') {
    mapFallback('The map library did not load. Use search instead.');
    return;
  }

  try {
    am5.ready(() => {
      try {
        const root = am5.Root.new('chartdiv');
        if (root._logo) root._logo.dispose();
        if (typeof am5themes_Animated !== 'undefined') root.setThemes([am5themes_Animated.new(root)]);

        const chart = root.container.children.push(am5map.MapChart.new(root, {
          panX: 'rotateX', panY: 'rotateY',
          projection: am5map.geoNaturalEarth1(),
          wheelY: 'zoom', wheelSensitivity: 0.8
        }));

        const style = {
          tooltipText: '{name}', interactive: true,
          fill: am5.color(0x17684b), stroke: am5.color(0x58d7af),
          strokeWidth: 0.65, cursorOverStyle: 'pointer'
        };
        const hover = { fill: am5.color(0x1aa494), stroke: am5.color(0x58eaff), strokeWidth: 1.5 };

        /* India is drawn from its own boundary, so it is excluded from the base map. */
        const world = chart.series.push(am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
          exclude: ['AQ', 'IN']
        }));
        world.mapPolygons.template.setAll(style);
        world.mapPolygons.template.states.create('hover', hover);

        const india = chart.series.push(am5map.MapPolygonSeries.new(root, {
          geoJSON: { type: 'FeatureCollection', features: [INDIA_FULL] }
        }));
        india.mapPolygons.template.setAll(style);
        india.mapPolygons.template.states.create('hover', hover);

        function codeOf(target) {
          const di = target.dataItem;
          if (!di) return '';
          let id = '';
          try { id = di.get('id') || ''; } catch (e) { id = ''; }
          if (!id) {
            const dc = di.dataContext || {};
            id = dc.id || (dc.properties && dc.properties.id) || '';
          }
          id = String(id).toUpperCase();
          return /^[A-Z]{2}$/.test(id) ? id : '';
        }

        [world, india].forEach(series => {
          series.mapPolygons.template.events.on('click', ev => {
            const code = codeOf(ev.target);
            if (code) selectCountry(code);
          });
        });

        chart.appear(800, 100);
      } catch (inner) {
        mapFallback('The map could not be drawn. Use search instead.');
      }
    });
  } catch (e) {
    mapFallback('The map could not be drawn. Use search instead.');
  }
}

/* ================= QUICK ANSWERS ================= */

const QUICK = [
  ['DISCOVER', 'Where should I travel this month?', () => {
    showView('discover');
    const el = $('#monthGroups'); if (el) el.scrollIntoView({ behavior: 'smooth' });
  }],
  ['VISA', 'Where can I go visa-free?', () => { showView('visa'); loadVisaMatrix('Visa free'); }],
  ['BUDGET', 'What fits my budget?', () => showView('finder')],
  ['VISA', 'Which countries give visa on arrival?', () => { showView('visa'); loadVisaMatrix('Visa on arrival'); }]
];

function renderQuick() {
  const g = $('#quickGrid');
  if (!g) return;
  g.innerHTML = QUICK.map((q, i) =>
    '<button data-q="' + i + '"><span>' + esc(q[0]) + '</span>' + esc(q[1]) + '</button>').join('');
  g.querySelectorAll('[data-q]').forEach(b => b.onclick = () => QUICK[Number(b.dataset.q)][2]());
}

/* ================= DIAGNOSTICS ================= */

async function travelAIDiag() {
  const rows = [];
  const add = (l, ok, d) => rows.push('<div class="fact"><small>' + esc(l) + '</small><b>' +
    (ok ? '✓ ' : '✗ ') + esc(d) + '</b></div>');

  add('Build', true, BUILD);
  add('Country dataset', COUNTRIES.length === 250, COUNTRIES.length + ' loaded');
  add('India boundary', !!(INDIA_FULL && INDIA_FULL.geometry), 'full J&K polygon');
  add('Home country', !!profile.home, profile.homeName || 'not set');
  add('Backend URL', !!CFG.API_URL, CFG.API_URL ? 'configured' : 'API_URL empty');

  ['Japan', 'USA', 'Thai'].forEach(q => {
    const code = resolveCountry(q);
    add('Resolve "' + q + '"', !!code, code ? (countryByCode(code).name.common) : 'failed');
  });

  openBox('DIAGNOSTICS', 'Self test',
    '<div class="fact-strip">' + rows.join('') +
    '<div class="fact"><small>EXCHANGE RATE</small><b id="dFx">checking...</b></div>' +
    '<div class="fact"><small>WEATHER</small><b id="dWx">checking...</b></div>' +
    '<div class="fact"><small>AI BACKEND</small><b id="dApi">checking...</b></div></div>' +
    '<div class="disclaimer">Screenshot this if you need to report a problem.</div>');

  getRate(profile.currency || 'USD', 'JPY')
    .then(r => setText('#dFx', '✓ 1 ' + profile.currency + ' = ' + fmtRate(r.rate) + ' JPY'))
    .catch(e => setText('#dFx', '✗ ' + e.message));

  fetchTimeout((CFG.OPEN_METEO_FORECAST || '') + '?latitude=28.6&longitude=77.2&current=temperature_2m', {}, 10000)
    .then(r => r.json())
    .then(j => setText('#dWx', '✓ ' + Math.round(j.current.temperature_2m) + '°C New Delhi'))
    .catch(() => setText('#dWx', '✗ unreachable'));

  if (CFG.API_URL) {
    api('health')
      .then(j => setText('#dApi', '✓ v' + j.version + (j.keyConfigured ? ', key set' : ', NO KEY') +
        (j.flightsLive ? ', live fares' : ', estimated fares')))
      .catch(e => setText('#dApi', '✗ ' + e.message));
  } else setText('#dApi', '— not configured');
}
window.travelAIDiag = travelAIDiag;

/* ================= EVENTS ================= */

function on(sel, fn) { const el = $(sel); if (el) el.onclick = fn; }

/* view navigation */
$$('[data-view]').forEach(el => {
  el.onclick = e => { e.preventDefault(); showView(el.dataset.view); };
  if (el.getAttribute('role') === 'button') {
    el.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); el.click(); }
    });
  }
});

/* onboarding */
bindSearchOnboard();
function bindSearchOnboard() {
  const input = $('#homeSearch');
  if (!input) return;
  let active = -1;
  input.addEventListener('input', () => {
    const q = norm(input.value);
    renderHomeList(q.length < 1 ? rankPopularHomes() : rankCountries(q, 8));
    active = -1;
  });
  input.addEventListener('keydown', e => {
    const rows = [...document.querySelectorAll('#homeResults .onboard-row')];
    if (!rows.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, rows.length - 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); }
    else if (e.key === 'Enter') { e.preventDefault(); (rows[active] || rows[0]).click(); return; }
    else return;
    rows.forEach(r => r.classList.remove('active'));
    rows[active].classList.add('active');
    rows[active].scrollIntoView({ block: 'nearest' });
  });
}
on('#homeConfirm', confirmHome);
on('#homePill', () => { pendingHome = null; const p = $('#homePicked'); if (p) p.hidden = true; openOnboarding(); });

/* search */
bindSearch('#countrySearch', '#countryResults', '#countrySearchBtn', selectCountry);
bindSearch('#globalSearch', '#globalResults', null, selectCountry);

document.addEventListener('click', e => {
  if (!e.target.closest('.search-shell')) $$('.search-results').forEach(x => x.classList.remove('open'));
});

/* country tabs */
$$('#countryTabs button').forEach(b => b.onclick = () => showPane(b.dataset.tab));
$$('#visaTabs button').forEach(b => b.onclick = () => loadVisaMatrix(b.dataset.bucket));

on('#citiesRefresh', () => loadCities(true));
on('#costsRefresh', () => loadCosts(true));
on('#visaRefresh', () => loadVisaBrief(true));
on('#safetyRefresh', () => loadSafety(true));
on('#saveCountryBtn', () => saveCountry());
on('#fRun', runFinder);
on('#pRun', buildPlan);
on('#pOptimize', optimizePlan);
on('#editProfileBtn', openProfile);
on('#boxClose', closeBox);
on('#boxBackdrop', closeBox);
on('#adminBtn', () => {
  if (CFG.ADMIN_URL) window.open(CFG.ADMIN_URL, '_blank', 'noopener');
  else alert('Admin is private. Open your admin link (run showAdminLink in the Apps Script editor to get it).');
});
on('#themeBtn', () => {
  const low = document.body.classList.toggle('low-glow');
  try { localStorage.setItem('travel_ai_lowglow', low ? '1' : '0'); } catch (e) { /* ignore */ }
});

/* ask */
on('#aiSend', () => askAI($('#aiInput') ? $('#aiInput').value : ''));
const aiIn = $('#aiInput');
if (aiIn) aiIn.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); askAI(e.target.value); }
});

const ASK_CHIPS = ['Best time to visit?', 'Is it safe for solo travellers?', 'How much cash should I carry?',
                   'Best local food to try?', 'Do I need travel insurance?'];
const chipBox = $('#askChips');
if (chipBox) {
  chipBox.innerHTML = ASK_CHIPS.map(q => '<button data-ask="' + esc(q) + '">' + esc(q) + '</button>').join('');
  chipBox.querySelectorAll('[data-ask]').forEach(b => b.onclick = () => {
    const el = $('#aiInput'); if (el) el.value = b.dataset.ask;
    askAI(b.dataset.ask);
  });
}

/* month select */
const mp = $('#monthPick'), fm = $('#fMonth');
const thisMonth = MONTHS[new Date().getMonth()];
if (mp) {
  mp.innerHTML = MONTHS.map(m => '<option' + (m === thisMonth ? ' selected' : '') + '>' + m + '</option>').join('');
  mp.onchange = () => loadMonthPicks();
}
if (fm) fm.innerHTML = MONTHS.map(m => '<option' + (m === thisMonth ? ' selected' : '') + '>' + m + '</option>').join('');

/* escape closes overlays */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const b = $('#answerBox');
  if (b && b.classList.contains('open')) closeBox();
});

/* install prompt */
let installEvent = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  installEvent = e;
  let hidden = false;
  try { hidden = localStorage.getItem('travel_ai_install_hidden') === '1'; } catch (err) { /* ignore */ }
  const bar = $('#installBar');
  if (bar && !hidden) bar.hidden = false;
});
on('#installBtn', async () => {
  const bar = $('#installBar'); if (bar) bar.hidden = true;
  if (!installEvent) return;
  installEvent.prompt();
  try { await installEvent.userChoice; } catch (e) { /* ignore */ }
  installEvent = null;
});
on('#installX', () => {
  const bar = $('#installBar'); if (bar) bar.hidden = true;
  try { localStorage.setItem('travel_ai_install_hidden', '1'); } catch (e) { /* ignore */ }
});
window.addEventListener('appinstalled', () => { const b = $('#installBar'); if (b) b.hidden = true; });

/* offline shell */
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

/* ================= INIT ================= */

try { if (localStorage.getItem('travel_ai_lowglow') === '1') document.body.classList.add('low-glow'); }
catch (e) { /* ignore */ }

console.log('%cTravel AI build ' + BUILD + ' — ' + COUNTRIES.length +
  ' countries loaded. Run travelAIDiag() for a self test.', 'color:#3ad;font-weight:bold');

afterProfileChange();
renderQuick();
initMap();
renderPlan();

if (needsOnboarding()) {
  openOnboarding();
} else {
  loadMonthPicks();
}

if (location.hash === '#diag') setTimeout(travelAIDiag, 400);
if (location.hash === '#visa') showView('visa');
if (location.hash === '#finder') showView('finder');
