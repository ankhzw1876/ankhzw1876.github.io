/*! QR miniature worlds study 2; adapted from Every QR Code 0.1.2, MIT, commit ed404c6cba9d48c04d5e08de780293cff1b242de. See THIRD_PARTY_LICENSES.txt and ../engine-src/README.md. */
var SakuraEngine=(()=>{var Pn=Object.create;var De=Object.defineProperty;var Cn=Object.getOwnPropertyDescriptor;var Rn=Object.getOwnPropertyNames;var Mn=Object.getPrototypeOf,Tn=Object.prototype.hasOwnProperty;var Oe=(t,e)=>()=>(t&&(e=t(t=0)),e);var R=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),ke=(t,e)=>{for(var a in e)De(t,a,{get:e[a],enumerable:!0})},va=(t,e,a,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of Rn(e))!Tn.call(t,n)&&n!==a&&De(t,n,{get:()=>e[n],enumerable:!(o=Cn(e,n))||o.enumerable});return t};var An=(t,e,a)=>(a=t!=null?Pn(Mn(t)):{},va(e||!t||!t.__esModule?De(a,"default",{value:t,enumerable:!0}):a,t)),En=t=>va(De({},"__esModule",{value:!0}),t);var Ta=R((Qi,Ma)=>{Ma.exports=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}});var Z=R(ne=>{var St,Zn=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];ne.getSymbolSize=function(e){if(!e)throw new Error('"version" cannot be null or undefined');if(e<1||e>40)throw new Error('"version" should be in range from 1 to 40');return e*4+17};ne.getSymbolTotalCodewords=function(e){return Zn[e]};ne.getBCHDigit=function(t){let e=0;for(;t!==0;)e++,t>>>=1;return e};ne.setToSJISFunction=function(e){if(typeof e!="function")throw new Error('"toSJISFunc" is not a valid function.');St=e};ne.isKanjiModeEnabled=function(){return typeof St<"u"};ne.toSJIS=function(e){return St(e)}});var Ve=R(B=>{B.L={bit:1};B.M={bit:0};B.Q={bit:3};B.H={bit:2};function $n(t){if(typeof t!="string")throw new Error("Param is not a string");switch(t.toLowerCase()){case"l":case"low":return B.L;case"m":case"medium":return B.M;case"q":case"quartile":return B.Q;case"h":case"high":return B.H;default:throw new Error("Unknown EC Level: "+t)}}B.isValid=function(e){return e&&typeof e.bit<"u"&&e.bit>=0&&e.bit<4};B.from=function(e,a){if(B.isValid(e))return e;try{return $n(e)}catch{return a}}});var Ia=R(($i,Ea)=>{function Aa(){this.buffer=[],this.length=0}Aa.prototype={get:function(t){let e=Math.floor(t/8);return(this.buffer[e]>>>7-t%8&1)===1},put:function(t,e){for(let a=0;a<e;a++)this.putBit((t>>>e-a-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(t){let e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),t&&(this.buffer[e]|=128>>>this.length%8),this.length++}};Ea.exports=Aa});var qa=R((Ki,ja)=>{function Se(t){if(!t||t<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=t,this.data=new Uint8Array(t*t),this.reservedBit=new Uint8Array(t*t)}Se.prototype.set=function(t,e,a,o){let n=t*this.size+e;this.data[n]=a,o&&(this.reservedBit[n]=!0)};Se.prototype.get=function(t,e){return this.data[t*this.size+e]};Se.prototype.xor=function(t,e,a){this.data[t*this.size+e]^=a};Se.prototype.isReserved=function(t,e){return this.reservedBit[t*this.size+e]};ja.exports=Se});var _a=R(He=>{var Kn=Z().getSymbolSize;He.getRowColCoords=function(e){if(e===1)return[];let a=Math.floor(e/7)+2,o=Kn(e),n=o===145?26:Math.ceil((o-13)/(2*a-2))*2,r=[o-7];for(let i=1;i<a-1;i++)r[i]=r[i-1]-n;return r.push(6),r.reverse()};He.getPositions=function(e){let a=[],o=He.getRowColCoords(e),n=o.length;for(let r=0;r<n;r++)for(let i=0;i<n;i++)r===0&&i===0||r===0&&i===n-1||r===n-1&&i===0||a.push([o[r],o[i]]);return a}});var Da=R(Fa=>{var Jn=Z().getSymbolSize,Ba=7;Fa.getPositions=function(e){let a=Jn(e);return[[0,0],[a-Ba,0],[0,a-Ba]]}});var Oa=R(T=>{T.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};var re={N1:3,N2:3,N3:40,N4:10};T.isValid=function(e){return e!=null&&e!==""&&!isNaN(e)&&e>=0&&e<=7};T.from=function(e){return T.isValid(e)?parseInt(e,10):void 0};T.getPenaltyN1=function(e){let a=e.size,o=0,n=0,r=0,i=null,s=null;for(let l=0;l<a;l++){n=r=0,i=s=null;for(let u=0;u<a;u++){let c=e.get(l,u);c===i?n++:(n>=5&&(o+=re.N1+(n-5)),i=c,n=1),c=e.get(u,l),c===s?r++:(r>=5&&(o+=re.N1+(r-5)),s=c,r=1)}n>=5&&(o+=re.N1+(n-5)),r>=5&&(o+=re.N1+(r-5))}return o};T.getPenaltyN2=function(e){let a=e.size,o=0;for(let n=0;n<a-1;n++)for(let r=0;r<a-1;r++){let i=e.get(n,r)+e.get(n,r+1)+e.get(n+1,r)+e.get(n+1,r+1);(i===4||i===0)&&o++}return o*re.N2};T.getPenaltyN3=function(e){let a=e.size,o=0,n=0,r=0;for(let i=0;i<a;i++){n=r=0;for(let s=0;s<a;s++)n=n<<1&2047|e.get(i,s),s>=10&&(n===1488||n===93)&&o++,r=r<<1&2047|e.get(s,i),s>=10&&(r===1488||r===93)&&o++}return o*re.N3};T.getPenaltyN4=function(e){let a=0,o=e.data.length;for(let r=0;r<o;r++)a+=e.data[r];return Math.abs(Math.ceil(a*100/o/5)-10)*re.N4};function er(t,e,a){switch(t){case T.Patterns.PATTERN000:return(e+a)%2===0;case T.Patterns.PATTERN001:return e%2===0;case T.Patterns.PATTERN010:return a%3===0;case T.Patterns.PATTERN011:return(e+a)%3===0;case T.Patterns.PATTERN100:return(Math.floor(e/2)+Math.floor(a/3))%2===0;case T.Patterns.PATTERN101:return e*a%2+e*a%3===0;case T.Patterns.PATTERN110:return(e*a%2+e*a%3)%2===0;case T.Patterns.PATTERN111:return(e*a%3+(e+a)%2)%2===0;default:throw new Error("bad maskPattern:"+t)}}T.applyMask=function(e,a){let o=a.size;for(let n=0;n<o;n++)for(let r=0;r<o;r++)a.isReserved(r,n)||a.xor(r,n,er(e,r,n))};T.getBestMask=function(e,a){let o=Object.keys(T.Patterns).length,n=0,r=1/0;for(let i=0;i<o;i++){a(i),T.applyMask(i,e);let s=T.getPenaltyN1(e)+T.getPenaltyN2(e)+T.getPenaltyN3(e)+T.getPenaltyN4(e);T.applyMask(i,e),s<r&&(r=s,n=i)}return n}});var Pt=R(zt=>{var $=Ve(),Ne=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],We=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];zt.getBlocksCount=function(e,a){switch(a){case $.L:return Ne[(e-1)*4+0];case $.M:return Ne[(e-1)*4+1];case $.Q:return Ne[(e-1)*4+2];case $.H:return Ne[(e-1)*4+3];default:return}};zt.getTotalCodewordsCount=function(e,a){switch(a){case $.L:return We[(e-1)*4+0];case $.M:return We[(e-1)*4+1];case $.Q:return We[(e-1)*4+2];case $.H:return We[(e-1)*4+3];default:return}}});var La=R(Qe=>{var ze=new Uint8Array(512),Ye=new Uint8Array(256);(function(){let e=1;for(let a=0;a<255;a++)ze[a]=e,Ye[e]=a,e<<=1,e&256&&(e^=285);for(let a=255;a<512;a++)ze[a]=ze[a-255]})();Qe.log=function(e){if(e<1)throw new Error("log("+e+")");return Ye[e]};Qe.exp=function(e){return ze[e]};Qe.mul=function(e,a){return e===0||a===0?0:ze[Ye[e]+Ye[a]]}});var Ga=R(Pe=>{var Ct=La();Pe.mul=function(e,a){let o=new Uint8Array(e.length+a.length-1);for(let n=0;n<e.length;n++)for(let r=0;r<a.length;r++)o[n+r]^=Ct.mul(e[n],a[r]);return o};Pe.mod=function(e,a){let o=new Uint8Array(e);for(;o.length-a.length>=0;){let n=o[0];for(let i=0;i<a.length;i++)o[i]^=Ct.mul(a[i],n);let r=0;for(;r<o.length&&o[r]===0;)r++;o=o.slice(r)}return o};Pe.generateECPolynomial=function(e){let a=new Uint8Array([1]);for(let o=0;o<e;o++)a=Pe.mul(a,new Uint8Array([1,Ct.exp(o)]));return a}});var Ha=R((rs,Va)=>{var Ua=Ga();function Rt(t){this.genPoly=void 0,this.degree=t,this.degree&&this.initialize(this.degree)}Rt.prototype.initialize=function(e){this.degree=e,this.genPoly=Ua.generateECPolynomial(this.degree)};Rt.prototype.encode=function(e){if(!this.genPoly)throw new Error("Encoder not initialized");let a=new Uint8Array(e.length+this.degree);a.set(e);let o=Ua.mod(a,this.genPoly),n=this.degree-o.length;if(n>0){let r=new Uint8Array(this.degree);return r.set(o,n),r}return o};Va.exports=Rt});var Mt=R(Na=>{Na.isValid=function(e){return!isNaN(e)&&e>=1&&e<=40}});var Tt=R(V=>{var Wa="[0-9]+",tr="[A-Z $%*+\\-./:]+",Ce="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";Ce=Ce.replace(/u/g,"\\u");var ar="(?:(?![A-Z0-9 $%*+\\-./:]|"+Ce+`)(?:.|[\r
]))+`;V.KANJI=new RegExp(Ce,"g");V.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g");V.BYTE=new RegExp(ar,"g");V.NUMERIC=new RegExp(Wa,"g");V.ALPHANUMERIC=new RegExp(tr,"g");var or=new RegExp("^"+Ce+"$"),nr=new RegExp("^"+Wa+"$"),rr=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");V.testKanji=function(e){return or.test(e)};V.testNumeric=function(e){return nr.test(e)};V.testAlphanumeric=function(e){return rr.test(e)}});var K=R(E=>{var ir=Mt(),At=Tt();E.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]};E.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]};E.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]};E.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]};E.MIXED={bit:-1};E.getCharCountIndicator=function(e,a){if(!e.ccBits)throw new Error("Invalid mode: "+e);if(!ir.isValid(a))throw new Error("Invalid version: "+a);return a>=1&&a<10?e.ccBits[0]:a<27?e.ccBits[1]:e.ccBits[2]};E.getBestModeForData=function(e){return At.testNumeric(e)?E.NUMERIC:At.testAlphanumeric(e)?E.ALPHANUMERIC:At.testKanji(e)?E.KANJI:E.BYTE};E.toString=function(e){if(e&&e.id)return e.id;throw new Error("Invalid mode")};E.isValid=function(e){return e&&e.bit&&e.ccBits};function sr(t){if(typeof t!="string")throw new Error("Param is not a string");switch(t.toLowerCase()){case"numeric":return E.NUMERIC;case"alphanumeric":return E.ALPHANUMERIC;case"kanji":return E.KANJI;case"byte":return E.BYTE;default:throw new Error("Unknown mode: "+t)}}E.from=function(e,a){if(E.isValid(e))return e;try{return sr(e)}catch{return a}}});var $a=R(ie=>{var Xe=Z(),lr=Pt(),Ya=Ve(),J=K(),Et=Mt(),Xa=7973,Qa=Xe.getBCHDigit(Xa);function ur(t,e,a){for(let o=1;o<=40;o++)if(e<=ie.getCapacity(o,a,t))return o}function Za(t,e){return J.getCharCountIndicator(t,e)+4}function cr(t,e){let a=0;return t.forEach(function(o){let n=Za(o.mode,e);a+=n+o.getBitsLength()}),a}function dr(t,e){for(let a=1;a<=40;a++)if(cr(t,a)<=ie.getCapacity(a,e,J.MIXED))return a}ie.from=function(e,a){return Et.isValid(e)?parseInt(e,10):a};ie.getCapacity=function(e,a,o){if(!Et.isValid(e))throw new Error("Invalid QR Code version");typeof o>"u"&&(o=J.BYTE);let n=Xe.getSymbolTotalCodewords(e),r=lr.getTotalCodewordsCount(e,a),i=(n-r)*8;if(o===J.MIXED)return i;let s=i-Za(o,e);switch(o){case J.NUMERIC:return Math.floor(s/10*3);case J.ALPHANUMERIC:return Math.floor(s/11*2);case J.KANJI:return Math.floor(s/13);case J.BYTE:default:return Math.floor(s/8)}};ie.getBestVersionForData=function(e,a){let o,n=Ya.from(a,Ya.M);if(Array.isArray(e)){if(e.length>1)return dr(e,n);if(e.length===0)return 1;o=e[0]}else o=e;return ur(o.mode,o.getLength(),n)};ie.getEncodedBits=function(e){if(!Et.isValid(e)||e<7)throw new Error("Invalid QR Code version");let a=e<<12;for(;Xe.getBCHDigit(a)-Qa>=0;)a^=Xa<<Xe.getBCHDigit(a)-Qa;return e<<12|a}});var to=R(eo=>{var It=Z(),Ja=1335,mr=21522,Ka=It.getBCHDigit(Ja);eo.getEncodedBits=function(e,a){let o=e.bit<<3|a,n=o<<10;for(;It.getBCHDigit(n)-Ka>=0;)n^=Ja<<It.getBCHDigit(n)-Ka;return(o<<10|n)^mr}});var oo=R((ds,ao)=>{var fr=K();function pe(t){this.mode=fr.NUMERIC,this.data=t.toString()}pe.getBitsLength=function(e){return 10*Math.floor(e/3)+(e%3?e%3*3+1:0)};pe.prototype.getLength=function(){return this.data.length};pe.prototype.getBitsLength=function(){return pe.getBitsLength(this.data.length)};pe.prototype.write=function(e){let a,o,n;for(a=0;a+3<=this.data.length;a+=3)o=this.data.substr(a,3),n=parseInt(o,10),e.put(n,10);let r=this.data.length-a;r>0&&(o=this.data.substr(a),n=parseInt(o,10),e.put(n,r*3+1))};ao.exports=pe});var ro=R((ms,no)=>{var pr=K(),jt=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function he(t){this.mode=pr.ALPHANUMERIC,this.data=t}he.getBitsLength=function(e){return 11*Math.floor(e/2)+6*(e%2)};he.prototype.getLength=function(){return this.data.length};he.prototype.getBitsLength=function(){return he.getBitsLength(this.data.length)};he.prototype.write=function(e){let a;for(a=0;a+2<=this.data.length;a+=2){let o=jt.indexOf(this.data[a])*45;o+=jt.indexOf(this.data[a+1]),e.put(o,11)}this.data.length%2&&e.put(jt.indexOf(this.data[a]),6)};no.exports=he});var so=R((fs,io)=>{var hr=K();function ge(t){this.mode=hr.BYTE,typeof t=="string"?this.data=new TextEncoder().encode(t):this.data=new Uint8Array(t)}ge.getBitsLength=function(e){return e*8};ge.prototype.getLength=function(){return this.data.length};ge.prototype.getBitsLength=function(){return ge.getBitsLength(this.data.length)};ge.prototype.write=function(t){for(let e=0,a=this.data.length;e<a;e++)t.put(this.data[e],8)};io.exports=ge});var uo=R((ps,lo)=>{var gr=K(),br=Z();function be(t){this.mode=gr.KANJI,this.data=t}be.getBitsLength=function(e){return e*13};be.prototype.getLength=function(){return this.data.length};be.prototype.getBitsLength=function(){return be.getBitsLength(this.data.length)};be.prototype.write=function(t){let e;for(e=0;e<this.data.length;e++){let a=br.toSJIS(this.data[e]);if(a>=33088&&a<=40956)a-=33088;else if(a>=57408&&a<=60351)a-=49472;else throw new Error("Invalid SJIS character: "+this.data[e]+`
Make sure your charset is UTF-8`);a=(a>>>8&255)*192+(a&255),t.put(a,13)}};lo.exports=be});var co=R((hs,qt)=>{"use strict";var Re={single_source_shortest_paths:function(t,e,a){var o={},n={};n[e]=0;var r=Re.PriorityQueue.make();r.push(e,0);for(var i,s,l,u,c,d,m,f,p;!r.empty();){i=r.pop(),s=i.value,u=i.cost,c=t[s]||{};for(l in c)c.hasOwnProperty(l)&&(d=c[l],m=u+d,f=n[l],p=typeof n[l]>"u",(p||f>m)&&(n[l]=m,r.push(l,m),o[l]=s))}if(typeof a<"u"&&typeof n[a]>"u"){var g=["Could not find a path from ",e," to ",a,"."].join("");throw new Error(g)}return o},extract_shortest_path_from_predecessor_list:function(t,e){for(var a=[],o=e,n;o;)a.push(o),n=t[o],o=t[o];return a.reverse(),a},find_path:function(t,e,a){var o=Re.single_source_shortest_paths(t,e,a);return Re.extract_shortest_path_from_predecessor_list(o,a)},PriorityQueue:{make:function(t){var e=Re.PriorityQueue,a={},o;t=t||{};for(o in e)e.hasOwnProperty(o)&&(a[o]=e[o]);return a.queue=[],a.sorter=t.sorter||e.default_sorter,a},default_sorter:function(t,e){return t.cost-e.cost},push:function(t,e){var a={value:t,cost:e};this.queue.push(a),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};typeof qt<"u"&&(qt.exports=Re)});var ko=R(ye=>{var C=K(),po=oo(),ho=ro(),go=so(),bo=uo(),Me=Tt(),Ze=Z(),yr=co();function mo(t){return unescape(encodeURIComponent(t)).length}function Te(t,e,a){let o=[],n;for(;(n=t.exec(a))!==null;)o.push({data:n[0],index:n.index,mode:e,length:n[0].length});return o}function yo(t){let e=Te(Me.NUMERIC,C.NUMERIC,t),a=Te(Me.ALPHANUMERIC,C.ALPHANUMERIC,t),o,n;return Ze.isKanjiModeEnabled()?(o=Te(Me.BYTE,C.BYTE,t),n=Te(Me.KANJI,C.KANJI,t)):(o=Te(Me.BYTE_KANJI,C.BYTE,t),n=[]),e.concat(a,o,n).sort(function(i,s){return i.index-s.index}).map(function(i){return{data:i.data,mode:i.mode,length:i.length}})}function _t(t,e){switch(e){case C.NUMERIC:return po.getBitsLength(t);case C.ALPHANUMERIC:return ho.getBitsLength(t);case C.KANJI:return bo.getBitsLength(t);case C.BYTE:return go.getBitsLength(t)}}function kr(t){return t.reduce(function(e,a){let o=e.length-1>=0?e[e.length-1]:null;return o&&o.mode===a.mode?(e[e.length-1].data+=a.data,e):(e.push(a),e)},[])}function vr(t){let e=[];for(let a=0;a<t.length;a++){let o=t[a];switch(o.mode){case C.NUMERIC:e.push([o,{data:o.data,mode:C.ALPHANUMERIC,length:o.length},{data:o.data,mode:C.BYTE,length:o.length}]);break;case C.ALPHANUMERIC:e.push([o,{data:o.data,mode:C.BYTE,length:o.length}]);break;case C.KANJI:e.push([o,{data:o.data,mode:C.BYTE,length:mo(o.data)}]);break;case C.BYTE:e.push([{data:o.data,mode:C.BYTE,length:mo(o.data)}])}}return e}function xr(t,e){let a={},o={start:{}},n=["start"];for(let r=0;r<t.length;r++){let i=t[r],s=[];for(let l=0;l<i.length;l++){let u=i[l],c=""+r+l;s.push(c),a[c]={node:u,lastCount:0},o[c]={};for(let d=0;d<n.length;d++){let m=n[d];a[m]&&a[m].node.mode===u.mode?(o[m][c]=_t(a[m].lastCount+u.length,u.mode)-_t(a[m].lastCount,u.mode),a[m].lastCount+=u.length):(a[m]&&(a[m].lastCount=u.length),o[m][c]=_t(u.length,u.mode)+4+C.getCharCountIndicator(u.mode,e))}}n=s}for(let r=0;r<n.length;r++)o[n[r]].end=0;return{map:o,table:a}}function fo(t,e){let a,o=C.getBestModeForData(t);if(a=C.from(e,o),a!==C.BYTE&&a.bit<o.bit)throw new Error('"'+t+'" cannot be encoded with mode '+C.toString(a)+`.
 Suggested mode is: `+C.toString(o));switch(a===C.KANJI&&!Ze.isKanjiModeEnabled()&&(a=C.BYTE),a){case C.NUMERIC:return new po(t);case C.ALPHANUMERIC:return new ho(t);case C.KANJI:return new bo(t);case C.BYTE:return new go(t)}}ye.fromArray=function(e){return e.reduce(function(a,o){return typeof o=="string"?a.push(fo(o,null)):o.data&&a.push(fo(o.data,o.mode)),a},[])};ye.fromString=function(e,a){let o=yo(e,Ze.isKanjiModeEnabled()),n=vr(o),r=xr(n,a),i=yr.find_path(r.map,"start","end"),s=[];for(let l=1;l<i.length-1;l++)s.push(r.table[i[l]].node);return ye.fromArray(kr(s))};ye.rawSplit=function(e){return ye.fromArray(yo(e,Ze.isKanjiModeEnabled()))}});var xo=R(vo=>{var Ke=Z(),Bt=Ve(),wr=Ia(),Sr=qa(),zr=_a(),Pr=Da(),Ot=Oa(),Lt=Pt(),Cr=Ha(),$e=$a(),Rr=to(),Mr=K(),Ft=ko();function Tr(t,e){let a=t.size,o=Pr.getPositions(e);for(let n=0;n<o.length;n++){let r=o[n][0],i=o[n][1];for(let s=-1;s<=7;s++)if(!(r+s<=-1||a<=r+s))for(let l=-1;l<=7;l++)i+l<=-1||a<=i+l||(s>=0&&s<=6&&(l===0||l===6)||l>=0&&l<=6&&(s===0||s===6)||s>=2&&s<=4&&l>=2&&l<=4?t.set(r+s,i+l,!0,!0):t.set(r+s,i+l,!1,!0))}}function Ar(t){let e=t.size;for(let a=8;a<e-8;a++){let o=a%2===0;t.set(a,6,o,!0),t.set(6,a,o,!0)}}function Er(t,e){let a=zr.getPositions(e);for(let o=0;o<a.length;o++){let n=a[o][0],r=a[o][1];for(let i=-2;i<=2;i++)for(let s=-2;s<=2;s++)i===-2||i===2||s===-2||s===2||i===0&&s===0?t.set(n+i,r+s,!0,!0):t.set(n+i,r+s,!1,!0)}}function Ir(t,e){let a=t.size,o=$e.getEncodedBits(e),n,r,i;for(let s=0;s<18;s++)n=Math.floor(s/3),r=s%3+a-8-3,i=(o>>s&1)===1,t.set(n,r,i,!0),t.set(r,n,i,!0)}function Dt(t,e,a){let o=t.size,n=Rr.getEncodedBits(e,a),r,i;for(r=0;r<15;r++)i=(n>>r&1)===1,r<6?t.set(r,8,i,!0):r<8?t.set(r+1,8,i,!0):t.set(o-15+r,8,i,!0),r<8?t.set(8,o-r-1,i,!0):r<9?t.set(8,15-r-1+1,i,!0):t.set(8,15-r-1,i,!0);t.set(o-8,8,1,!0)}function jr(t,e){let a=t.size,o=-1,n=a-1,r=7,i=0;for(let s=a-1;s>0;s-=2)for(s===6&&s--;;){for(let l=0;l<2;l++)if(!t.isReserved(n,s-l)){let u=!1;i<e.length&&(u=(e[i]>>>r&1)===1),t.set(n,s-l,u),r--,r===-1&&(i++,r=7)}if(n+=o,n<0||a<=n){n-=o,o=-o;break}}}function qr(t,e,a){let o=new wr;a.forEach(function(l){o.put(l.mode.bit,4),o.put(l.getLength(),Mr.getCharCountIndicator(l.mode,t)),l.write(o)});let n=Ke.getSymbolTotalCodewords(t),r=Lt.getTotalCodewordsCount(t,e),i=(n-r)*8;for(o.getLengthInBits()+4<=i&&o.put(0,4);o.getLengthInBits()%8!==0;)o.putBit(0);let s=(i-o.getLengthInBits())/8;for(let l=0;l<s;l++)o.put(l%2?17:236,8);return _r(o,t,e)}function _r(t,e,a){let o=Ke.getSymbolTotalCodewords(e),n=Lt.getTotalCodewordsCount(e,a),r=o-n,i=Lt.getBlocksCount(e,a),s=o%i,l=i-s,u=Math.floor(o/i),c=Math.floor(r/i),d=c+1,m=u-c,f=new Cr(m),p=0,g=new Array(i),b=new Array(i),y=0,v=new Uint8Array(t.buffer);for(let A=0;A<i;A++){let j=A<l?c:d;g[A]=v.slice(p,p+j),b[A]=f.encode(g[A]),p+=j,y=Math.max(y,j)}let k=new Uint8Array(o),w=0,z,S;for(z=0;z<y;z++)for(S=0;S<i;S++)z<g[S].length&&(k[w++]=g[S][z]);for(z=0;z<m;z++)for(S=0;S<i;S++)k[w++]=b[S][z];return k}function Br(t,e,a,o){let n;if(Array.isArray(t))n=Ft.fromArray(t);else if(typeof t=="string"){let u=e;if(!u){let c=Ft.rawSplit(t);u=$e.getBestVersionForData(c,a)}n=Ft.fromString(t,u||40)}else throw new Error("Invalid data");let r=$e.getBestVersionForData(n,a);if(!r)throw new Error("The amount of data is too big to be stored in a QR Code");if(!e)e=r;else if(e<r)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+r+`.
`);let i=qr(e,a,n),s=Ke.getSymbolSize(e),l=new Sr(s);return Tr(l,e),Ar(l),Er(l,e),Dt(l,a,0),e>=7&&Ir(l,e),jr(l,i),isNaN(o)&&(o=Ot.getBestMask(l,Dt.bind(null,l,a))),Ot.applyMask(o,l),Dt(l,a,o),{modules:l,version:e,errorCorrectionLevel:a,maskPattern:o,segments:n}}vo.create=function(e,a){if(typeof e>"u"||e==="")throw new Error("No input text");let o=Bt.M,n,r;return typeof a<"u"&&(o=Bt.from(a.errorCorrectionLevel,Bt.M),n=$e.from(a.version),r=Ot.from(a.maskPattern),a.toSJISFunc&&Ke.setToSJISFunction(a.toSJISFunc)),Br(e,n,o,r)}});var Gt=R(se=>{function wo(t){if(typeof t=="number"&&(t=t.toString()),typeof t!="string")throw new Error("Color should be defined as hex string");let e=t.slice().replace("#","").split("");if(e.length<3||e.length===5||e.length>8)throw new Error("Invalid hex color: "+t);(e.length===3||e.length===4)&&(e=Array.prototype.concat.apply([],e.map(function(o){return[o,o]}))),e.length===6&&e.push("F","F");let a=parseInt(e.join(""),16);return{r:a>>24&255,g:a>>16&255,b:a>>8&255,a:a&255,hex:"#"+e.slice(0,6).join("")}}se.getOptions=function(e){e||(e={}),e.color||(e.color={});let a=typeof e.margin>"u"||e.margin===null||e.margin<0?4:e.margin,o=e.width&&e.width>=21?e.width:void 0,n=e.scale||4;return{width:o,scale:o?4:n,margin:a,color:{dark:wo(e.color.dark||"#000000ff"),light:wo(e.color.light||"#ffffffff")},type:e.type,rendererOpts:e.rendererOpts||{}}};se.getScale=function(e,a){return a.width&&a.width>=e+a.margin*2?a.width/(e+a.margin*2):a.scale};se.getImageWidth=function(e,a){let o=se.getScale(e,a);return Math.floor((e+a.margin*2)*o)};se.qrToImageData=function(e,a,o){let n=a.modules.size,r=a.modules.data,i=se.getScale(n,o),s=Math.floor((n+o.margin*2)*i),l=o.margin*i,u=[o.color.light,o.color.dark];for(let c=0;c<s;c++)for(let d=0;d<s;d++){let m=(c*s+d)*4,f=o.color.light;if(c>=l&&d>=l&&c<s-l&&d<s-l){let p=Math.floor((c-l)/i),g=Math.floor((d-l)/i);f=u[r[p*n+g]?1:0]}e[m++]=f.r,e[m++]=f.g,e[m++]=f.b,e[m]=f.a}}});var So=R(Je=>{var Ut=Gt();function Fr(t,e,a){t.clearRect(0,0,e.width,e.height),e.style||(e.style={}),e.height=a,e.width=a,e.style.height=a+"px",e.style.width=a+"px"}function Dr(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}Je.render=function(e,a,o){let n=o,r=a;typeof n>"u"&&(!a||!a.getContext)&&(n=a,a=void 0),a||(r=Dr()),n=Ut.getOptions(n);let i=Ut.getImageWidth(e.modules.size,n),s=r.getContext("2d"),l=s.createImageData(i,i);return Ut.qrToImageData(l.data,e,n),Fr(s,r,i),s.putImageData(l,0,0),r};Je.renderToDataURL=function(e,a,o){let n=o;typeof n>"u"&&(!a||!a.getContext)&&(n=a,a=void 0),n||(n={});let r=Je.render(e,a,n),i=n.type||"image/png",s=n.rendererOpts||{};return r.toDataURL(i,s.quality)}});var Co=R(Po=>{var Or=Gt();function zo(t,e){let a=t.a/255,o=e+'="'+t.hex+'"';return a<1?o+" "+e+'-opacity="'+a.toFixed(2).slice(1)+'"':o}function Vt(t,e,a){let o=t+e;return typeof a<"u"&&(o+=" "+a),o}function Lr(t,e,a){let o="",n=0,r=!1,i=0;for(let s=0;s<t.length;s++){let l=Math.floor(s%e),u=Math.floor(s/e);!l&&!r&&(r=!0),t[s]?(i++,s>0&&l>0&&t[s-1]||(o+=r?Vt("M",l+a,.5+u+a):Vt("m",n,0),n=0,r=!1),l+1<e&&t[s+1]||(o+=Vt("h",i),i=0)):n++}return o}Po.render=function(e,a,o){let n=Or.getOptions(a),r=e.modules.size,i=e.modules.data,s=r+n.margin*2,l=n.color.light.a?"<path "+zo(n.color.light,"fill")+' d="M0 0h'+s+"v"+s+'H0z"/>':"",u="<path "+zo(n.color.dark,"stroke")+' d="'+Lr(i,r,n.margin)+'"/>',c='viewBox="0 0 '+s+" "+s+'"',m='<svg xmlns="http://www.w3.org/2000/svg" '+(n.width?'width="'+n.width+'" height="'+n.width+'" ':"")+c+' shape-rendering="crispEdges">'+l+u+`</svg>
`;return typeof o=="function"&&o(null,m),m}});var Mo=R(Ae=>{var Gr=Ta(),Ht=xo(),Ro=So(),Ur=Co();function Nt(t,e,a,o,n){let r=[].slice.call(arguments,1),i=r.length,s=typeof r[i-1]=="function";if(!s&&!Gr())throw new Error("Callback required as last argument");if(s){if(i<2)throw new Error("Too few arguments provided");i===2?(n=a,a=e,e=o=void 0):i===3&&(e.getContext&&typeof n>"u"?(n=o,o=void 0):(n=o,o=a,a=e,e=void 0))}else{if(i<1)throw new Error("Too few arguments provided");return i===1?(a=e,e=o=void 0):i===2&&!e.getContext&&(o=a,a=e,e=void 0),new Promise(function(l,u){try{let c=Ht.create(a,o);l(t(c,e,o))}catch(c){u(c)}})}try{let l=Ht.create(a,o);n(null,t(l,e,o))}catch(l){n(l)}}Ae.create=Ht.create;Ae.toCanvas=Nt.bind(null,Ro.render);Ae.toDataURL=Nt.bind(null,Ro.renderToDataURL);Ae.toString=Nt.bind(null,function(t,e,a){return Ur.render(t,a)})});var nn={};ke(nn,{SEED_POST_SHADER:()=>ti,SEED_UNIFORMS_WGSL:()=>_,SEED_WEATHER_SHADER:()=>ei});var _,ei,ti,ft=Oe(()=>{_=`
struct Uniforms {
  aspectRatio: f32,
  time: f32,
  itemCount: f32,
  progress: f32,
  gridSize: f32,
  cameraBobX: f32,
  cameraBobY: f32,
  blockSize: f32,
  toggleAge: f32,
  flowerHue: f32,
  leafHue: f32,
  fruitHue: f32,
  fruitfulness: f32,
  flowerHueSpread: f32,
  leafHueSpread: f32,
  sceneEffect: f32,
  themePrimary: vec4f,
  themeSecondary: vec4f,
  themeThird: vec4f,
  themeFourth: vec4f,
  themeFifth: vec4f,
  terrainWater: vec4f,
  terrainShore: vec4f,
  terrainMeadow: vec4f,
  terrainRidge: vec4f,
  terrainSummit: vec4f,
  camera: vec4f,
}

fn hsvToRgb(hsv: vec3f) -> vec3f {
  let shifted = fract(vec3f(hsv.x) + vec3f(1.0, 0.6666667, 0.3333333));
  let rgb = clamp(abs(shifted * 6.0 - 3.0) - 1.0, vec3f(0.0), vec3f(1.0));
  return hsv.z * mix(vec3f(1.0), rgb, hsv.y);
}

fn themeInk() -> vec3f {
  var ink = uniforms.themePrimary.rgb;
  var luminance = dot(ink, vec3f(0.2126, 0.7152, 0.0722));
  let secondaryLuminance = dot(uniforms.themeSecondary.rgb, vec3f(0.2126, 0.7152, 0.0722));
  if (secondaryLuminance < luminance) {
    ink = uniforms.themeSecondary.rgb;
    luminance = secondaryLuminance;
  }
  let fourthLuminance = dot(uniforms.themeFourth.rgb, vec3f(0.2126, 0.7152, 0.0722));
  if (fourthLuminance < luminance) {
    ink = uniforms.themeFourth.rgb;
  }
  return mix(ink, vec3f(0.02), 0.32);
}

fn sceneWind() -> f32 {
  return 1.0 - step(0.51, abs(uniforms.sceneEffect));
}

fn sceneRain() -> f32 {
  return 1.0 - step(0.51, abs(uniforms.sceneEffect - 1.0));
}

fn sceneSnow() -> f32 {
  return 1.0 - step(0.51, abs(uniforms.sceneEffect - 2.0));
}

fn sceneBreeze() -> f32 {
  return sceneWind() * 0.72 + sceneRain() * 0.12;
}

fn sceneBranchBreeze() -> f32 {
  return sceneWind() * 0.42 + sceneRain() * 0.08;
}

fn themeFlower(noise: f32) -> vec3f {
  let tier = fract(noise * 7.31);
  let flowerMain = mix(uniforms.themePrimary.rgb, vec3f(1.0), 0.62);
  let flowerDeep = mix(uniforms.themePrimary.rgb, vec3f(1.0), 0.48);
  let tone = mix(flowerDeep, flowerMain, smoothstep(0.24, 0.88, tier));
  return clamp(tone, vec3f(0.0), vec3f(1.0));
}

fn themeLeaf(noise: f32) -> vec3f {
  let tier = fract(noise * 5.17);
  let leafMain = uniforms.themeFourth.rgb;
  let leafDeep = mix(themeInk(), leafMain, 0.54);
  return mix(leafDeep, leafMain, smoothstep(0.22, 0.86, tier));
}

fn themeGrass(noise: f32) -> vec3f {
  let tier = fract(noise * 7.31);
  let deep = uniforms.themeSecondary.rgb * 0.78;
  let light = mix(uniforms.themeSecondary.rgb, uniforms.themeFifth.rgb, 0.22);
  return mix(deep, light, tier);
}

fn qrContrast(hue: vec3f) -> vec3f {
  let luminance = dot(hue, vec3f(0.2126, 0.7152, 0.0722));
  let correction = smoothstep(0.78, 0.96, luminance) * 0.12;
  return mix(hue, themeInk(), correction);
}

fn themeQr(blockType: u32, noise: f32) -> vec3f {
  var hue = uniforms.themePrimary.rgb;
  if (blockType == 3u) {
    hue = uniforms.themeSecondary.rgb;
  } else if (blockType == 4u) {
    // QR ink follows the selected palette, independently of the pastel 3D flowers.
    hue = uniforms.themePrimary.rgb;
  } else if (blockType == 2u || blockType == 5u) {
    hue = uniforms.themeFourth.rgb;
  }
  let shade = 0.9 + fract(noise * 5.53) * 0.1;
  return qrContrast(hue) * shade;
}

fn themeBark(noise: f32) -> vec3f {
  let barkBase = vec3f(0.47, 0.30, 0.19);
  let barkLight = vec3f(0.65, 0.43, 0.28);
  return mix(barkBase, barkLight, 0.20 + noise * 0.44);
}

fn themeSnow() -> vec3f {
  return mix(uniforms.themeFifth.rgb, vec3f(1.0), 0.78);
}

fn projectPosition(localPos: vec3f) -> vec4f {
  let progress = uniforms.progress;
  let treeYaw = 0.78 + uniforms.camera.y;
  let shortestYaw = atan2(sin(treeYaw), cos(treeYaw));
  let isoAngleY = mix(shortestYaw, 0.0, progress) + uniforms.cameraBobX;
  let isoAngleX = mix(-0.55 + uniforms.camera.z, -1.5708, progress) + uniforms.cameraBobY;
  let cy = cos(isoAngleY);
  let sy = sin(isoAngleY);
  let cx = cos(isoAngleX);
  let sx = sin(isoAngleX);
  let ryX = localPos.x * cy - localPos.z * sy;
  let ryZ = localPos.x * sy + localPos.z * cy;
  let rxY = localPos.y * cx - ryZ * sx;
  let rxZ = localPos.y * sx + ryZ * cx;
  let portraitBoost = select(1.0, 1.2, uniforms.aspectRatio < 0.8);
  let morphPulse = 1.0 - sin(progress * 3.14159265) * 0.08;
  // Recenter near overhead and leave room for the slab's corners without
  // changing the initial tree view or the final scanning view.
  let overhead = smoothstep(0.0, 0.9, -uniforms.camera.z);
  let orbitFraming = mix(1.0, 0.86, overhead * (1.0 - progress));
  // Fit the paper margin into the same footprint as the original QR.
  let qrFraming = mix(1.0, uniforms.gridSize / (uniforms.gridSize + 8.0), smoothstep(0.64, 1.0, progress));
  let viewScale = (mix(41.5, 46.4, progress) / uniforms.gridSize)
    * portraitBoost * morphPulse * uniforms.camera.x * qrFraming * orbitFraming;
  let scaleX = viewScale / max(uniforms.aspectRatio, 1.0);
  let scaleY = viewScale / max(1.0 / uniforms.aspectRatio, 1.0);
  let yOffset = mix(mix(-0.12, -0.02, overhead), 0.08, progress);
  let xOffset = mix(0.0, 0.015, progress);
  return vec4f(
    (ryX + xOffset) * scaleX,
    (rxY + yOffset) * scaleY,
    rxZ * 0.01 + 0.5,
    1.0,
  );
}
`,ei=`
${_}

struct RainOutput {
  @builtin(position) position: vec4f,
  @location(0) alpha: f32,
  @location(1) uv: vec2f,
  @location(2) snow: f32,
  @location(3) seed: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read> rainData: array<vec4f>;

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> RainOutput {
  var output: RainOutput;
  let verticesPerDrop = 6u;
  let dropIndex = vertexIndex / verticesPerDrop;
  let localVertex = vertexIndex % verticesPerDrop;
  let snow = sceneSnow();
  let visibility = smoothstep(0.0, 0.3, 1.0 - uniforms.progress)
    * max(sceneRain(), snow);
  if (visibility < 0.01) {
    output.position = vec4f(0.0, 0.0, -10.0, 1.0);
    return output;
  }
  let data = rainData[dropIndex];
  let blockSize = uniforms.blockSize;
  let halfGrid = uniforms.gridSize * blockSize * 0.5;
  let seed = data.w;
  let cycleRate = mix(0.45 + seed * 0.3, 0.18 + seed * 0.12, snow);
  let cycle = fract(uniforms.time * cycleRate + data.z * 10.0);
  let dropY = mix(blockSize * 45.0, blockSize * 0.5, cycle);
  let baseX = data.x * blockSize - halfGrid + mix(0.015 * cycle, 0.0, snow);
  let baseZ = data.y * blockSize - halfGrid
    + mix(0.008 * cycle, 0.0, snow);
  let rainQuad = array<vec2f, 6>(
    vec2f(-1.0, 0.0), vec2f(1.0, 0.0), vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0), vec2f(1.0, 0.0), vec2f(1.0, 1.0),
  );
  let snowQuad = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0),
  );
  let rainPoint = rainQuad[localVertex];
  let snowPoint = snowQuad[localVertex];
  let point = mix(rainPoint, snowPoint, snow);
  let flakeSize = blockSize * (0.16 + seed * 0.22);
  let streakLength = mix(blockSize * (2.5 + seed * 1.5), flakeSize, snow);
  let streakWidth = mix(blockSize * 0.06, flakeSize, snow);
  let fadeTop = smoothstep(0.0, 0.1, cycle);
  let fadeBottom = 1.0 - smoothstep(0.85, 1.0, cycle);
  output.alpha = fadeTop * fadeBottom * visibility
    * mix(0.16 + seed * 0.12, 0.68 + seed * 0.2, snow);
  output.uv = snowPoint;
  output.snow = snow;
  output.seed = seed;
  output.position = projectPosition(vec3f(
    baseX + point.x * streakWidth,
    dropY + point.y * streakLength,
    baseZ,
  ));
  return output;
}

@fragment
fn fragmentMain(input: RainOutput) -> @location(0) vec4f {
  let radius = length(input.uv);
  let softFlake = 1.0 - smoothstep(0.48, 1.0, radius);
  let armA = 1.0 - smoothstep(0.055, 0.14, abs(input.uv.y));
  let armB = 1.0 - smoothstep(0.055, 0.14, abs(input.uv.y * 0.5 - input.uv.x * 0.866));
  let armC = 1.0 - smoothstep(0.055, 0.14, abs(input.uv.y * 0.5 + input.uv.x * 0.866));
  let crystal = max(max(armA, armB), armC) * (1.0 - smoothstep(0.68, 1.0, radius));
  let detailedFlake = max(softFlake * 0.42, crystal);
  let flakeShape = mix(softFlake, detailedFlake, step(0.58, fract(input.seed * 7.31)));
  if (input.snow > 0.5 && flakeShape < 0.02) { discard; }
  let rainGray = vec3f(0.56, 0.60, 0.64);
  let alpha = input.alpha * mix(1.0, flakeShape, input.snow);
  return vec4f(mix(rainGray, themeSnow(), input.snow), alpha);
}
`,ti=`
${_}

struct PostOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var sceneTexture: texture_2d<f32>;
@group(0) @binding(2) var sceneSampler: sampler;

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> PostOutput {
  let triangle = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f(3.0, -1.0),
    vec2f(-1.0, 3.0),
  );
  let position = triangle[vertexIndex];
  var output: PostOutput;
  output.position = vec4f(position, 0.0, 1.0);
  output.uv = vec2f(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5);
  return output;
}

@fragment
fn fragmentMain(input: PostOutput) -> @location(0) vec4f {
  let center = vec2f(0.5);
  let strength = sin(uniforms.progress * 3.14159265) * 0.006;
  let direction = (input.uv - center) * strength;
  var color = vec4f(0.0);
  for (var index = 0u; index < 8u; index++) {
    let sampleOffset = f32(index) / 7.0;
    color += textureSample(sceneTexture, sceneSampler,
      clamp(input.uv - direction * sampleOffset, vec2f(0.0), vec2f(1.0)));
  }
  color /= 8.0;
  let distanceFromCenter = length(input.uv - center);
  let vignette = 1.0 - distanceFromCenter * distanceFromCenter * strength * 5.0;
  return vec4f(color.rgb * vignette, color.a);
}
`});var rn={};ke(rn,{TERRAIN_SHADER:()=>oi});var ai,oi,sn=Oe(()=>{ai=`
struct Uniforms {
  aspectRatio: f32,
  time: f32,
  itemCount: f32,
  progress: f32,
  gridSize: f32,
  cameraBobX: f32,
  cameraBobY: f32,
  blockSize: f32,
  toggleAge: f32,
  flowerHue: f32,
  leafHue: f32,
  fruitHue: f32,
  fruitfulness: f32,
  flowerHueSpread: f32,
  leafHueSpread: f32,
  sceneEffect: f32,
  themePrimary: vec4f,
  themeSecondary: vec4f,
  themeThird: vec4f,
  themeFourth: vec4f,
  themeFifth: vec4f,
  terrainWater: vec4f,
  terrainShore: vec4f,
  terrainMeadow: vec4f,
  terrainRidge: vec4f,
  terrainSummit: vec4f,
}

fn terrainInk() -> vec3f {
  let first = uniforms.themePrimary.rgb;
  let second = uniforms.themeSecondary.rgb;
  let fourth = uniforms.themeFourth.rgb;
  let firstLuma = dot(first, vec3f(0.2126, 0.7152, 0.0722));
  let secondLuma = dot(second, vec3f(0.2126, 0.7152, 0.0722));
  let fourthLuma = dot(fourth, vec3f(0.2126, 0.7152, 0.0722));
  var ink = select(first, second, secondLuma < firstLuma);
  let inkLuma = min(firstLuma, secondLuma);
  ink = select(ink, fourth, fourthLuma < inkLuma);
  return mix(ink, vec3f(0.015), 0.22);
}

fn terrainPaper() -> vec3f {
  return mix(uniforms.themeFifth.rgb, vec3f(1.0), 0.68);
}

fn sceneSnow() -> f32 {
  return 1.0 - step(0.51, abs(uniforms.sceneEffect - 2.0));
}

fn terrainReliefProfile(heightValue: f32) -> f32 {
  return 0.1 + pow(heightValue, 0.72) * 12.6;
}

fn terrainProject(localPos: vec3f) -> vec4f {
  let progress = uniforms.progress;
  let angleY = mix(0.79, 0.0, progress);
  let angleX = mix(-0.56, -1.5708, progress);
  let cy = cos(angleY);
  let sy = sin(angleY);
  let cx = cos(angleX);
  let sx = sin(angleX);
  let rotatedX = localPos.x * cy - localPos.z * sy;
  let rotatedZ = localPos.x * sy + localPos.z * cy;
  let rotatedY = localPos.y * cx - rotatedZ * sx;
  let depth = localPos.y * sx + rotatedZ * cx;
  let portrait = select(1.0, 1.18, uniforms.aspectRatio < 0.8);
  let pulse = 1.0 + sin(progress * 3.14159265) * 0.025;
  let scale = mix(40.0, 46.4, progress) / uniforms.gridSize * portrait * pulse;
  let scaleX = scale / max(uniforms.aspectRatio, 1.0);
  let scaleY = scale / max(1.0 / uniforms.aspectRatio, 1.0);
  let yOffset = mix(-0.045, 0.08, progress);
  return vec4f(rotatedX * scaleX, (rotatedY + yOffset) * scaleY, depth * 0.01 + 0.5, 1.0);
}
`,oi=`
${ai}

struct TerrainOutput {
  @builtin(position) position: vec4f,
  @location(0) normal: vec3f,
  @location(1) uv: vec2f,
  @location(2) heightValue: f32,
  @location(3) heightFraction: f32,
  @location(4) shade: f32,
  @location(5) castShadow: f32,
  @location(6) valleyOcclusion: f32,
  @location(7) rimLight: f32,
  @location(8) fresnel: f32,
  @location(9) @interpolate(flat) blockType: u32,
  @location(10) @interpolate(flat) neighborMask: u32,
  @location(11) @interpolate(flat) faceIndex: u32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read> blockTypes: array<u32>;
@group(0) @binding(2) var<storage, read> blockPositions: array<vec4f>;
@group(0) @binding(3) var<storage, read> blockHeights: array<f32>;

fn terrainHeightAt(column: i32, row: i32) -> f32 {
  let size = i32(uniforms.gridSize);
  if (column < 0 || column >= size || row < 0 || row >= size) {
    return 0.0;
  }
  return blockHeights[u32(row * size + column)];
}

fn terrainValley(height: f32, column: i32, row: i32) -> f32 {
  var highest = 0.0;
  for (var rowOffset: i32 = -1; rowOffset <= 1; rowOffset = rowOffset + 1) {
    for (var columnOffset: i32 = -1; columnOffset <= 1; columnOffset = columnOffset + 1) {
      if (columnOffset == 0 && rowOffset == 0) { continue; }
      let neighbor = terrainHeightAt(column + columnOffset, row + rowOffset);
      highest = max(highest, neighbor);
    }
  }
  return smoothstep(0.02, 0.34, max(0.0, highest - height));
}

fn terrainShadow(height: f32, column: i32, row: i32) -> f32 {
  if (height < 0.02) { return 1.0; }
  let direction = normalize(vec2f(0.42, 0.76));
  var shadow = 1.0;
  for (var stepIndex: i32 = 1; stepIndex < 7; stepIndex = stepIndex + 1) {
    let offset = vec2f(f32(stepIndex)) * direction;
    let sampleColumn = column + i32(round(offset.x));
    let sampleRow = row + i32(round(offset.y));
    let neighbor = terrainHeightAt(sampleColumn, sampleRow);
    let occlusion = smoothstep(height + 0.06, height + 0.36, neighbor);
    let distanceFade = 1.0 - f32(stepIndex) * 0.075;
    shadow *= mix(1.0, 0.78, occlusion * max(distanceFade, 0.45));
  }
  return max(shadow, 0.74);
}

fn terrainTopNormal(column: i32, row: i32) -> vec3f {
  let slopeX = terrainHeightAt(column + 1, row) - terrainHeightAt(column - 1, row);
  let slopeZ = terrainHeightAt(column, row + 1) - terrainHeightAt(column, row - 1);
  return normalize(vec3f(-slopeX * 2.2, 1.0, -slopeZ * 2.2));
}

fn terrainGeometry(
  faceIndex: u32,
  uv: vec2f,
  footprint: f32,
  height: f32,
  topNormal: vec3f,
) -> array<vec3f, 2> {
  let halfWidth = footprint * 0.5;
  var position = vec3f(0.0);
  var normal = vec3f(0.0, 1.0, 0.0);
  if (faceIndex == 0u) {
    let summit = 1.0 - length(uv - vec2f(0.5)) * 0.2 * (1.0 - uniforms.progress);
    position = vec3f((uv.x - 0.5) * footprint, height * summit, (uv.y - 0.5) * footprint);
    normal = topNormal;
  } else if (faceIndex == 1u) {
    position = vec3f((uv.x - 0.5) * footprint, 0.0, (0.5 - uv.y) * footprint);
    normal = vec3f(0.0, -1.0, 0.0);
  } else if (faceIndex == 2u) {
    position = vec3f((uv.x - 0.5) * footprint, uv.y * height, halfWidth);
    normal = vec3f(0.0, 0.0, 1.0);
  } else if (faceIndex == 3u) {
    position = vec3f((0.5 - uv.x) * footprint, uv.y * height, -halfWidth);
    normal = vec3f(0.0, 0.0, -1.0);
  } else if (faceIndex == 4u) {
    position = vec3f(halfWidth, uv.y * height, (uv.x - 0.5) * footprint);
    normal = vec3f(1.0, 0.0, 0.0);
  } else {
    position = vec3f(-halfWidth, uv.y * height, (0.5 - uv.x) * footprint);
    normal = vec3f(-1.0, 0.0, 0.0);
  }
  return array<vec3f, 2>(position, normal);
}

@vertex
fn vertexMain(
  @builtin(vertex_index) vertexIndex: u32,
  @builtin(instance_index) instanceIndex: u32,
) -> TerrainOutput {
  var output: TerrainOutput;
  let faceIndex = vertexIndex / 6u;
  let quadIndex = vertexIndex % 6u;
  let quad = array<vec2f, 6>(
    vec2f(0.0, 0.0), vec2f(1.0, 0.0), vec2f(0.0, 1.0),
    vec2f(0.0, 1.0), vec2f(1.0, 0.0), vec2f(1.0, 1.0),
  );
  let uv = quad[quadIndex];
  let positionData = blockPositions[instanceIndex];
  let column = i32(positionData.x);
  let row = i32(positionData.y);
  let heightValue = clamp(blockHeights[instanceIndex], 0.0, 1.0);
  let blockSize = uniforms.blockSize;
  let terrainHeight = blockSize * terrainReliefProfile(heightValue);
  let flatHeight = blockSize * 0.11;
  let height = mix(terrainHeight, flatHeight, uniforms.progress);
  let footprint = blockSize * mix(0.84, 1.0, uniforms.progress);
  let topNormal = mix(terrainTopNormal(column, row), vec3f(0.0, 1.0, 0.0), uniforms.progress);
  let geometry = terrainGeometry(faceIndex, uv, footprint, height, topNormal);
  let halfGrid = uniforms.gridSize * blockSize * 0.5;
  let center = vec3f(
    (positionData.x + 0.5) * blockSize - halfGrid,
    0.0,
    (positionData.y + 0.5) * blockSize - halfGrid,
  );
  let worldPosition = center + geometry[0];
  let normal = normalize(geometry[1]);
  let lightDirection = normalize(vec3f(-0.41, 0.86, -0.3));
  let diffuse = max(dot(normal, lightDirection), 0.0);
  var shade = 0.3 + pow(diffuse, 0.62) * 0.7;
  if (normal.y > 0.45) { shade = min(1.0, shade * 1.08 + 0.06); }
  if (abs(normal.y) < 0.12) { shade *= 0.68; }
  let viewDirection = normalize(vec3f(sin(0.79), 0.58, cos(0.79)));
  let viewDot = abs(dot(normal, viewDirection));
  output.position = terrainProject(worldPosition);
  output.normal = normal;
  output.uv = uv;
  output.heightValue = heightValue;
  output.heightFraction = clamp(geometry[0].y / max(height, 0.00001), 0.0, 1.0);
  output.shade = mix(shade, 1.0, uniforms.progress);
  output.castShadow = terrainShadow(heightValue, column, row);
  output.valleyOcclusion = terrainValley(heightValue, column, row);
  output.rimLight = pow(1.0 - viewDot, 3.8);
  output.fresnel = pow(1.0 - viewDot, 2.4);
  output.blockType = blockTypes[instanceIndex];
  output.neighborMask = u32(positionData.w);
  output.faceIndex = faceIndex;
  return output;
}

fn terrainBandColor(height: f32) -> vec3f {
  let water = uniforms.terrainWater.rgb;
  let shore = uniforms.terrainShore.rgb;
  let meadow = uniforms.terrainMeadow.rgb;
  let ridge = uniforms.terrainRidge.rgb;
  let summit = uniforms.terrainSummit.rgb;
  if (height < 0.055) {
    return terrainPaper();
  }
  if (height < 0.22) {
    return water;
  }
  if (height < 0.34) {
    return mix(water, shore, smoothstep(0.22, 0.34, height));
  }
  if (height < 0.62) {
    return mix(shore, meadow, smoothstep(0.34, 0.62, height));
  }
  if (height < 0.84) {
    return mix(meadow, ridge, smoothstep(0.62, 0.84, height));
  }
  return mix(ridge, summit, smoothstep(0.84, 1.0, height));
}

fn terrainQrColor(blockType: u32, noise: f32) -> vec3f {
  var color = uniforms.themePrimary.rgb;
  if (blockType == 3u) {
    color = uniforms.themeSecondary.rgb;
  } else if (blockType == 4u) {
    color = mix(uniforms.themeThird.rgb, uniforms.themeFourth.rgb, 0.58);
  } else if (blockType == 2u || blockType == 5u) {
    color = uniforms.themeFourth.rgb;
  }
  let luma = dot(color, vec3f(0.2126, 0.7152, 0.0722));
  let contrast = mix(color, terrainInk(), smoothstep(0.76, 0.96, luma) * 0.2);
  return contrast * (0.92 + noise * 0.08);
}

fn terrainQrMask(uv: vec2f, neighborMask: u32) -> f32 {
  let up = (neighborMask & 1u) != 0u;
  let right = (neighborMask & 2u) != 0u;
  let down = (neighborMask & 4u) != 0u;
  let left = (neighborMask & 8u) != 0u;
  let radius = 0.46;
  var mask = 1.0;
  if (!left && !up && uv.x < radius && uv.y < radius) {
    mask *= 1.0 - step(radius, distance(uv, vec2f(radius)));
  }
  if (!right && !up && uv.x > 1.0 - radius && uv.y < radius) {
    mask *= 1.0 - step(radius, distance(uv, vec2f(1.0 - radius, radius)));
  }
  if (!left && !down && uv.x < radius && uv.y > 1.0 - radius) {
    mask *= 1.0 - step(radius, distance(uv, vec2f(radius, 1.0 - radius)));
  }
  if (!right && !down && uv.x > 1.0 - radius && uv.y > 1.0 - radius) {
    mask *= 1.0 - step(radius, distance(uv, vec2f(1.0 - radius)));
  }
  return mask;
}

fn terrainHash(position: vec2f) -> f32 {
  let scaled = fract(position * vec2f(0.1031, 0.103));
  let folded = scaled + dot(scaled, scaled.yx + 19.19);
  return fract((folded.x + folded.y) * folded.x);
}

@fragment
fn fragmentMain(input: TerrainOutput) -> @location(0) vec4f {
  let progress = uniforms.progress;
  let noise = terrainHash(input.position.xy + vec2f(uniforms.time * 0.13));
  let paper = terrainPaper();
  var terrainColor = terrainBandColor(input.heightValue);
  terrainColor *= mix(0.92, 1.06, input.shade);
  let contact = mix(0.82, 1.0, smoothstep(0.0, 0.72, input.heightFraction));
  terrainColor *= mix(contact, 1.0, progress);
  terrainColor *= mix(input.castShadow, 1.0, progress * 0.92);
  terrainColor *= 1.0 - input.valleyOcclusion * 0.18 * (1.0 - progress);
  terrainColor *= 1.0 + input.rimLight * 0.18 * (1.0 - progress);
  terrainColor *= 1.0 + input.fresnel * 0.09 * (1.0 - progress);
  let peak = smoothstep(0.62, 0.96, input.heightValue);
  let peakTint = uniforms.terrainSummit.rgb;
  terrainColor = mix(terrainColor, peakTint, peak * 0.16 * (1.0 - progress));
  let snowNoise = terrainHash(input.uv * 5.7 + vec2f(input.heightValue * 13.0));
  let topFace = select(0.0, 1.0, input.faceIndex == 0u);
  let snowCover = sceneSnow() * topFace * (1.0 - progress)
    * smoothstep(0.42 + snowNoise * 0.1, 0.72, input.heightValue);
  terrainColor = mix(terrainColor, terrainPaper(), snowCover * 0.88);
  let qrNoise = terrainHash(input.uv + vec2f(input.heightValue * 17.0));
  let qrMask = terrainQrMask(input.uv, input.neighborMask);
  let isActive = select(0.0, 1.0, input.blockType != 0u);
  var qrColor = mix(paper, terrainQrColor(input.blockType, qrNoise), isActive * qrMask);
  if (input.faceIndex != 0u) {
    qrColor = mix(qrColor, terrainInk(), 0.18);
  }
  var color = mix(terrainColor, qrColor, smoothstep(0.58, 0.98, progress));
  color += (noise - 0.5) * 0.022 * (1.0 - progress);
  return vec4f(clamp(color, vec3f(0.0), vec3f(1.0)), 1.0);
}
`});var ln={};ke(ln,{TREE_BLOCK_SHADER:()=>ni,TREE_BRANCH_SHADER:()=>ri,TREE_BUTTERFLY_SHADER:()=>ci,TREE_FALLING_PETAL_SHADER:()=>ui,TREE_FLOWER_SHADER:()=>li,TREE_GRASS_SHADER:()=>si,TREE_SHADOW_SHADER:()=>ii});var ni,ri,ii,si,li,ui,ci,un=Oe(()=>{ft();ni=`
${_}

struct BlockOutput {
  @builtin(position) position: vec4f,
  @location(0) normal: vec3f,
  @location(1) @interpolate(flat) blockType: u32,
  @location(2) column: f32,
  @location(3) row: f32,
  @location(4) uv: vec2f,
  @location(5) layer: f32,
  @location(6) @interpolate(flat) neighborMask: u32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read> blockTypes: array<u32>;
@group(0) @binding(2) var<storage, read> blockPositions: array<vec4f>;
@group(0) @binding(3) var<storage, read> blockHeights: array<f32>;
@group(0) @binding(4) var<storage, read> blockBaseY: array<f32>;

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> BlockOutput {
  var output: BlockOutput;
  let blockIndex = vertexIndex / 36u;
  let localVertexIndex = vertexIndex % 36u;
  let faceIndex = localVertexIndex / 6u;
  let quadIndex = localVertexIndex % 6u;
  let quad = array<vec2f, 6>(
    vec2f(0.0, 0.0), vec2f(1.0, 0.0), vec2f(0.0, 1.0),
    vec2f(0.0, 1.0), vec2f(1.0, 0.0), vec2f(1.0, 1.0),
  );
  let uv = quad[quadIndex];
  let positionData = blockPositions[blockIndex];
  let column = positionData.x;
  let row = positionData.y;
  let blockSize = uniforms.blockSize;
  let halfGrid = uniforms.gridSize * blockSize * 0.5;
  let centerX = (column + 0.5) * blockSize - halfGrid;
  let centerZ = (row + 0.5) * blockSize - halfGrid;
  let baseY = blockBaseY[blockIndex];
  // The single-tree scene already has real branches and blossoms. Do not
  // reveal the legacy elevated voxel scaffold as white cubes/specks during
  // morphing; the base layer alone contains the complete ground/QR matrix.
  if (baseY > 0.001) {
    output.position = vec4f(0.0, 0.0, -10.0, 1.0);
    return output;
  }
  let height = mix(blockHeights[blockIndex], blockSize, uniforms.progress);
  let treeProgress = 1.0 - uniforms.progress;
  let layer = baseY / blockSize;
  let revealStart = clamp(layer / 42.0, 0.0, 0.46);
  let layerRise = select(
    1.0,
    smoothstep(revealStart, min(1.0, revealStart + 0.42), treeProgress),
    baseY > 0.001,
  );
  let semanticAbsorb = 1.0 - smoothstep(0.68, 0.98, treeProgress);
  let layerScale = select(1.0, layerRise * semanticAbsorb, baseY > 0.001);
  let animatedBaseY = baseY * layerRise;
  let animatedHeight = height * layerScale;
  let halfWidth = blockSize * 0.5;
  var localPos = vec3f(0.0);
  var normal = vec3f(0.0);

  if (faceIndex == 0u) {
    localPos = vec3f(
      centerX + (uv.x - 0.5) * blockSize * layerScale,
      animatedBaseY + animatedHeight,
      centerZ + (uv.y - 0.5) * blockSize * layerScale,
    );
    normal = vec3f(0.0, 1.0, 0.0);
  } else if (faceIndex == 1u) {
    localPos = vec3f(
      centerX + (uv.x - 0.5) * blockSize * layerScale,
      animatedBaseY,
      centerZ + (0.5 - uv.y) * blockSize * layerScale,
    );
    normal = vec3f(0.0, -1.0, 0.0);
  } else if (faceIndex == 2u) {
    localPos = vec3f(
      centerX + (uv.x - 0.5) * blockSize * layerScale,
      animatedBaseY + uv.y * animatedHeight,
      centerZ + halfWidth * layerScale,
    );
    normal = vec3f(0.0, 0.0, 1.0);
  } else if (faceIndex == 3u) {
    localPos = vec3f(
      centerX + (0.5 - uv.x) * blockSize * layerScale,
      animatedBaseY + uv.y * animatedHeight,
      centerZ - halfWidth * layerScale,
    );
    normal = vec3f(0.0, 0.0, -1.0);
  } else if (faceIndex == 4u) {
    localPos = vec3f(
      centerX + halfWidth * layerScale,
      animatedBaseY + uv.y * animatedHeight,
      centerZ + (uv.x - 0.5) * blockSize * layerScale,
    );
    normal = vec3f(1.0, 0.0, 0.0);
  } else {
    localPos = vec3f(
      centerX - halfWidth * layerScale,
      animatedBaseY + uv.y * animatedHeight,
      centerZ + (0.5 - uv.x) * blockSize * layerScale,
    );
    normal = vec3f(-1.0, 0.0, 0.0);
  }

  let blockType = blockTypes[blockIndex];
  output.position = projectPosition(localPos);
  output.normal = normal;
  output.blockType = blockType;
  output.column = column;
  output.row = row;
  output.uv = uv;
  output.layer = layer;
  output.neighborMask = u32(positionData.w);
  return output;
}

fn qrModuleMask(uv: vec2f, neighborMask: u32) -> f32 {
  // Full square modules, matching the reference rather than rounded blobs.
  return 1.0;
}

@fragment
fn fragmentMain(input: BlockOutput) -> @location(0) vec4f {
  let normal = normalize(input.normal);
  let world = floor(uniforms.camera.w + 0.5);
  let blockSeed = input.column * 17.3 + input.row * 31.1 + input.layer * 73.7;
  let noiseA = fract(sin(blockSeed) * 43758.5);
  let noiseB = fract(sin(blockSeed * 1.7 + 127.1) * 43758.5);
  let noiseC = fract(sin(blockSeed * 2.3 + 311.7) * 43758.5);
  let center = uniforms.gridSize * 0.5;
  let shadowDelta = vec2f(input.column, input.row) - vec2f(center + 1.5);
  let shadowDistance = length(shadowDelta);
  let canopyRadius = uniforms.gridSize * 0.46;
  let canopyShadow = 1.0 - smoothstep(2.5, canopyRadius, shadowDistance);
  let trunkOcclusion = (1.0 - smoothstep(0.0, 3.75, shadowDistance)) * 0.2;
  let treeShadow = 1.0 - canopyShadow * 0.35 - trunkOcclusion;
  let layerRatio = min(input.layer / 15.0, 1.0);
  let canopyOcclusion = 0.65 + layerRatio * 0.35;
  var albedo = vec3f(0.5);
  if (normal.y > 0.5) {
    if (input.blockType == 0u) {
      let groundBase = mix(uniforms.themeFifth.rgb, uniforms.themeThird.rgb, 0.42);
      let dirtLight = mix(groundBase, vec3f(1.0), 0.48);
      let dirtMid = mix(groundBase, uniforms.themeThird.rgb, 0.13);
      let dirtDark = mix(groundBase, uniforms.themeThird.rgb, 0.24);
      if (noiseA < 0.4) {
        albedo = mix(dirtLight, dirtMid, noiseA / 0.4);
      } else if (noiseA < 0.7) {
        albedo = mix(dirtMid, dirtDark, (noiseA - 0.4) / 0.3);
      } else {
        albedo = mix(dirtDark, dirtDark * 0.85, (noiseA - 0.7) / 0.3);
      }
      albedo *= (1.0 + (noiseB - 0.5) * 0.18 + (noiseC - 0.5) * 0.08) * treeShadow;
      let groundRadius = distance(vec2f(input.column, input.row), vec2f(center));
      let petalSpeckle = noiseC * step(groundRadius, canopyRadius);
      let fallenPetal = themeFlower(noiseB);
      albedo = mix(albedo, fallenPetal, step(0.85, petalSpeckle) * 0.4);
    } else if (input.blockType == 1u) {
      let light = mix(themeFlower(noiseB), vec3f(1.0), 0.22);
      let middle = themeFlower(noiseB);
      let deep = mix(themeFlower(noiseB), themeInk(), 0.22);
      let rich = mix(themeFlower(noiseB), themeInk(), 0.36);
      if (noiseA < 0.33) {
        albedo = mix(light, middle, noiseA / 0.33);
      } else if (noiseA < 0.66) {
        albedo = mix(middle, deep, (noiseA - 0.33) / 0.33);
      } else {
        albedo = mix(deep, rich, (noiseA - 0.66) / 0.34);
      }
      let edgeDistance = min(min(input.uv.x, 1.0 - input.uv.x), min(input.uv.y, 1.0 - input.uv.y));
      let edgeShade = mix(0.88, 1.0, smoothstep(0.0, 0.12, edgeDistance));
      albedo *= (1.0 + (noiseB - 0.5) * 0.15) * canopyOcclusion * edgeShade;
    } else if (input.blockType == 2u) {
      let bark = themeBark(noiseA);
      albedo = bark * (1.0 + (noiseB - 0.5) * 0.15) * (0.6 + layerRatio * 0.4);
    } else if (input.blockType == 3u) {
      let dark = mix(themeLeaf(noiseB), themeInk(), 0.42);
      let middle = mix(themeLeaf(noiseB), themeInk(), 0.18);
      let bright = mix(themeLeaf(noiseB), vec3f(1.0), 0.12);
      let brown = mix(uniforms.themeFourth.rgb, themeInk(), 0.38);
      if (noiseA < 0.3) {
        albedo = mix(bright, middle, noiseA / 0.3);
      } else if (noiseA < 0.6) {
        albedo = mix(middle, dark, (noiseA - 0.3) / 0.3);
      } else {
        albedo = mix(dark, brown, (noiseA - 0.6) / 0.4);
      }
      albedo *= 1.0 + (noiseB - 0.5) * 0.2;
    } else {
      let sand = mix(uniforms.themeThird.rgb, uniforms.themeFifth.rgb, 0.68 + noiseB * 0.16);
      let fallen = mix(sand, themeFlower(noiseB), max(0.0, noiseA - 0.4) * 0.35);
      albedo = fallen * (1.0 + (noiseB - 0.5) * 0.12) * treeShadow;
    }
    albedo *= vec3f(1.1, 1.08, 1.02);
  } else {
    let sideSun = normalize(vec3f(-0.405616, 0.861934, -0.304212));
    let sideLight = 0.3 + max(dot(normal, sideSun), 0.0) * 0.65;
    if (input.blockType == 1u) {
      let deep = mix(themeFlower(noiseA), themeInk(), 0.3);
      let middle = themeFlower(noiseA);
      albedo = mix(deep, middle, noiseA);
    } else if (input.blockType == 2u) {
      albedo = themeBark(noiseA);
    } else if (input.blockType == 3u) {
      let dark = mix(themeLeaf(noiseA), themeInk(), 0.42);
      let middle = mix(themeLeaf(noiseA), themeInk(), 0.18);
      albedo = mix(dark, middle, noiseA);
    } else {
      albedo = mix(uniforms.themeFourth.rgb, uniforms.themeThird.rgb, noiseA);
    }
    albedo *= sideLight;
  }
  let sunDirection = normalize(vec3f(-0.405616, 0.861934, -0.304212));
  let sun = max(dot(normal, sunDirection), 0.0);
  let up = max(normal.y, 0.0);
  let lit = albedo * (
    vec3f(0.28, 0.28, 0.30) + 1.2 * sun * 0.85
      + vec3f(0.90, 0.85, 0.95) * up * 0.18
      + vec3f(0.55, 0.60, 0.50) * 0.15
  );
  let mapped = clamp(
    (lit * (2.51 * lit + 0.03)) / (lit * (2.43 * lit + 0.59) + 0.14),
    vec3f(0.0),
    vec3f(1.0),
  );
  var treeColor = pow(mapped, vec3f(1.0 / 2.2));
  let gray = dot(treeColor, vec3f(0.299, 0.587, 0.114));
  treeColor = mix(vec3f(gray), treeColor, 1.0);
  // Four coordinated ceramic tones follow the palette in display RGB.
  // Keep bypassing the legacy exposure chain, which washed pale tiles white.
  if (input.layer < 0.5) {
    var tile = mix(uniforms.themeFifth.rgb, uniforms.themeThird.rgb, 0.18);
    if (noiseA > 0.48 && noiseA <= 0.69) { tile = uniforms.themeThird.rgb * 0.9; }
    if (noiseA > 0.69 && noiseA <= 0.84) { tile = mix(uniforms.themeThird.rgb, uniforms.themePrimary.rgb, 0.12); }
    if (noiseA > 0.84) { tile = mix(uniforms.themeThird.rgb, uniforms.themeSecondary.rgb, 0.2); }
    if (input.blockType == 3u) { tile = mix(uniforms.themeSecondary.rgb, uniforms.themeFourth.rgb, noiseB); }
    let worldStyle = 1.0 - smoothstep(0.42, 0.84, uniforms.progress);
    if (world == 1.0) {
      let cloudStone = mix(uniforms.themeThird.rgb, uniforms.themeFifth.rgb, 0.52 + noiseA * 0.16);
      let islandMoss = mix(uniforms.themeSecondary.rgb, uniforms.themeFourth.rgb, 0.26 + noiseB * 0.32);
      tile = mix(tile, select(cloudStone, islandMoss, input.blockType != 0u), worldStyle);
    } else if (world == 2.0) {
      let lunarDust = mix(uniforms.themeThird.rgb, themeInk(), 0.18 + noiseA * 0.13);
      let baseLight = mix(lunarDust, uniforms.themePrimary.rgb, 0.26 + noiseB * 0.16);
      tile = mix(tile, select(lunarDust, baseLight, input.blockType != 0u), worldStyle);
    } else if (world == 3.0) {
      let desk = mix(themeBark(noiseA), uniforms.themeFifth.rgb, 0.16);
      let bookMosaic = mix(uniforms.themePrimary.rgb, uniforms.themeFourth.rgb, noiseB * 0.58);
      tile = mix(tile, select(desk, bookMosaic, input.blockType != 0u), worldStyle);
    }
    treeColor = tile * (0.94 + treeShadow * 0.06);
    if (abs(normal.y) < 0.5) { treeColor = mix(uniforms.themeThird.rgb, uniforms.themeFourth.rgb, 0.45) * 0.82; }
  }
  let qrPaper = mix(uniforms.themeFifth.rgb, vec3f(1.0), 0.52);
  let qrReveal = smoothstep(0.64, 0.96, uniforms.progress);
  if (
    uniforms.progress > 0.94 &&
    input.blockType != 0u &&
    abs(normal.y) > 0.5 &&
    qrModuleMask(input.uv, input.neighborMask) < 0.5
  ) {
    discard;
  }
  var qrMaterial = treeColor;
  if (input.blockType > 0u) { qrMaterial = themeQr(input.blockType, noiseA); }
  let inactiveColor = mix(treeColor, qrPaper, qrReveal);
  let activeColor = mix(treeColor, qrMaterial, qrReveal);
  var color = select(inactiveColor, activeColor, input.blockType != 0u);
  var snowPatch = 0.2 + step(0.68, noiseC) * 0.3;
  if (input.blockType == 0u) {
    snowPatch = 0.68 + noiseC * 0.2;
  }
  let snowCover = sceneSnow() * (1.0 - qrReveal) * step(0.5, normal.y) * snowPatch;
  color = mix(color, themeSnow(), snowCover);
  return vec4f(color, 1.0);
}
`,ri=`
${_}

struct BranchOutput {
  @builtin(position) position: vec4f,
  @location(0) normalX: f32,
  @location(1) normalY: f32,
  @location(2) normalZ: f32,
  @location(3) depth: f32,
  @location(4) seed: f32,
  @location(5) ringT: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read> segments: array<vec4f>;

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> BranchOutput {
  var output: BranchOutput;
  let segmentIndex = vertexIndex / 48u;
  let localIndex = vertexIndex % 48u;
  let sideIndex = localIndex / 6u;
  let triangleVertex = localIndex % 6u;
  let startData = segments[segmentIndex * 3u];
  let endData = segments[segmentIndex * 3u + 1u];
  let metadata = segments[segmentIndex * 3u + 2u];
  let visibility = smoothstep(0.38, 0.88, 1.0 - uniforms.progress);
  if (visibility < 0.01) {
    output.position = vec4f(0.0, 0.0, -10.0, 1.0);
    return output;
  }
  let angleStart = f32(sideIndex) * 0.78539816;
  let angleEnd = f32(sideIndex + 1u) * 0.78539816;
  var ringT = 0.0;
  var angle = angleStart;
  if (triangleVertex == 1u || triangleVertex == 4u || triangleVertex == 5u) {
    angle = angleEnd;
  }
  if (triangleVertex == 2u || triangleVertex == 3u || triangleVertex == 5u) {
    ringT = 1.0;
  }
  let center = mix(startData.xyz, endData.xyz, ringT);
  let radius = mix(startData.w, endData.w, ringT) * visibility;
  let axis = normalize(endData.xyz - startData.xyz);
  var reference = vec3f(0.0, 1.0, 0.0);
  if (abs(dot(axis, reference)) > 0.95) {
    reference = vec3f(1.0, 0.0, 0.0);
  }
  let tangent = normalize(cross(axis, reference));
  let bitangent = normalize(cross(tangent, axis));
  let depth = metadata.x;
  let windAmount = clamp(depth / 4.0, 0.0, 1.0) * 0.016 * visibility
    * sceneBranchBreeze();
  let windBase = sin(uniforms.time * 0.45 + center.x * 15.0 + center.z * 10.0);
  let windTurbulence = sin(uniforms.time * 1.1 + center.x * 40.0 + center.z * 30.0);
  let windX = windBase * windAmount + windTurbulence * windAmount * 0.25;
  let windZ = sin(uniforms.time * 0.35 + center.z * 12.0 + center.x * 8.0);
  let windedCenter = center + vec3f(windX, 0.0, windZ * windAmount * 0.6);
  let radial = tangent * cos(angle) + bitangent * sin(angle);
  let localPos = windedCenter + radial * radius;
  output.position = projectPosition(localPos);
  let faceAngle = (angleStart + angleEnd) * 0.5;
  let faceNormal = tangent * cos(faceAngle) + bitangent * sin(faceAngle);
  output.normalX = faceNormal.x;
  output.normalY = faceNormal.y;
  output.normalZ = faceNormal.z;
  output.depth = depth;
  output.seed = metadata.y;
  output.ringT = ringT;
  return output;
}

@fragment
fn fragmentMain(input: BranchOutput) -> @location(0) vec4f {
  let normal = normalize(vec3f(input.normalX, input.normalY, input.normalZ));
  let depthT = clamp(input.depth / 5.0, 0.0, 1.0);
  let isStem = select(0.0, 1.0, input.depth < -0.5 && input.depth > -1.5);
  let isOrbit = select(0.0, 1.0, input.depth <= -1.5);
  let noiseA = fract(sin(input.seed * 43.7 + input.depth * 17.3) * 43758.5);
  let noiseB = fract(sin(input.seed * 73.1 + input.depth * 31.1 + 127.1) * 43758.5);
  var bark = themeBark(noiseA);
  bark = mix(bark, themeLeaf(noiseA), isStem);
  bark = mix(bark, mix(uniforms.themeThird.rgb, uniforms.themeFifth.rgb, 0.32), isOrbit);
  let barkHighlight = vec3f(0.51, 0.28, 0.17);
  bark = mix(bark, barkHighlight, depthT * depthT * 0.2);
  let sunDirection = normalize(vec3f(-0.405616, 0.861934, -0.304212));
  let diffuse = max(dot(normal, sunDirection), 0.0);
  let grain = 0.985 + sin(atan2(normal.z, normal.x) * 17.0) * 0.015;
  var color = clamp(bark * grain * (0.72 + diffuse * 0.32), vec3f(0.0), vec3f(1.0));
  let snowCover = sceneSnow() * smoothstep(0.25, 0.9, normal.y)
    * (0.2 + step(0.68, noiseB) * 0.28);
  color = mix(color, themeSnow(), snowCover);
  return vec4f(color, 1.0);
}
`,ii=`
${_}

struct ShadowOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
  @location(1) @interpolate(flat) paper: u32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> ShadowOutput {
  let quad = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0),
  );
  let uv = quad[vertexIndex % 6u];
  let gridWidth = uniforms.gridSize * uniforms.blockSize;
  var output: ShadowOutput;
  output.uv = uv;
  output.paper = select(0u, 1u, vertexIndex >= 6u);
  if (output.paper == 1u) {
    // Keep four light modules around the QR even against a dark page.
    // Draw below the existing matrix; this is a paper margin, not a QR overlay.
    let radius = gridWidth * 0.5 + uniforms.blockSize * 4.0;
    output.position = projectPosition(vec3f(
      uv.x * radius, -uniforms.blockSize * 0.02, uv.y * radius,
    ));
    return output;
  }
  let center = vec2f(gridWidth * 0.045, gridWidth * 0.03);
  let radius = vec2f(gridWidth * 0.38, gridWidth * 0.31);
  let localPos = vec3f(
    center.x + uv.x * radius.x,
    uniforms.blockSize * 1.018,
    center.y + uv.y * radius.y,
  );
  output.position = projectPosition(localPos);
  return output;
}

@fragment
fn fragmentMain(input: ShadowOutput) -> @location(0) vec4f {
  if (input.paper == 1u) {
    let opacity = smoothstep(0.78, 0.98, uniforms.progress);
    if (opacity < 0.01) { discard; }
    return vec4f(mix(uniforms.themeFifth.rgb, vec3f(1.0), 0.52), opacity);
  }
  let visibility = smoothstep(0.30, 0.82, 1.0 - uniforms.progress);
  let canopy = 1.0 - smoothstep(0.18, 1.0, length(input.uv));
  let trunk = 1.0 - smoothstep(
    0.02,
    0.24,
    length((input.uv - vec2f(-0.08, -0.02)) * vec2f(1.65, 1.0)),
  );
  let directional = 1.0 - smoothstep(
    0.15,
    0.92,
    length((input.uv - vec2f(0.22, 0.13)) * vec2f(0.82, 1.32)),
  );
  let alpha = (canopy * 0.105 + directional * 0.045 + trunk * 0.11) * visibility;
  let shadowColor = mix(themeInk(), themeLeaf(0.32), 0.34);
  return vec4f(shadowColor, alpha);
}
`,si=`
${_}

struct GrassOutput {
  @builtin(position) position: vec4f,
  @location(0) normalX: f32,
  @location(1) normalY: f32,
  @location(2) normalZ: f32,
  @location(3) seed: f32,
  @location(4) bladeT: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read> grass: array<vec4f>;

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> GrassOutput {
  var output: GrassOutput;
  let verticesPerBlade = 3u;
  let bladeIndex = vertexIndex / verticesPerBlade;
  let bladeVertex = vertexIndex % verticesPerBlade;
  let data = grass[bladeIndex];
  let visibility = smoothstep(0.0, 0.3, 1.0 - uniforms.progress);
  if (visibility < 0.01) {
    output.position = vec4f(0.0, 0.0, -10.0, 1.0);
    return output;
  }

  let blockSize = uniforms.blockSize;
  let halfGrid = uniforms.gridSize * blockSize * 0.5;
  let seed = data.z;
  let baseX = data.x * blockSize - halfGrid;
  let baseZ = data.y * blockSize - halfGrid;
  let bladeHeight = blockSize * data.w * visibility;
  let angle = seed * 6.2831853;
  let halfWidth = blockSize * 0.16;
  let tiltX = (seed - 0.5) * 0.4;
  let tiltZ = (fract(seed * 7.13) - 0.5) * 0.4;
  let windBase = sin(uniforms.time * 0.45 + data.x * 0.25 + data.y * 0.15) * 0.02;
  let windTurbulence =
    sin(uniforms.time * 1.1 + data.x * 0.8 + data.y * 0.6) * 0.005;
  let windX = (windBase + windTurbulence) * sceneBreeze();
  let windZ = sin(uniforms.time * 0.35 + data.x * 0.15 + data.y * 0.25)
    * 0.012 * sceneBreeze();
  let tipX = baseX + (tiltX + windX) * bladeHeight * 4.0;
  let tipZ = baseZ + (tiltZ + windZ) * bladeHeight * 4.0;
  let yLift = blockSize;
  var localPos = vec3f(0.0);
  var normal = vec3f(0.0, 0.3, 0.3);
  var bladeT = 0.0;
  if (bladeVertex == 0u) {
    localPos = vec3f(
      baseX - halfWidth * cos(angle),
      yLift,
      baseZ - halfWidth * sin(angle),
    );
  } else if (bladeVertex == 1u) {
    localPos = vec3f(
      baseX + halfWidth * cos(angle),
      yLift,
      baseZ + halfWidth * sin(angle),
    );
  } else {
    let curlDroop = bladeHeight * seed * 0.15;
    localPos = vec3f(tipX, yLift + bladeHeight - curlDroop, tipZ);
    normal = vec3f(0.0, 0.9, 0.3);
    bladeT = 1.0;
  }
  output.position = projectPosition(localPos);
  output.normalX = normal.x;
  output.normalY = normal.y;
  output.normalZ = normal.z;
  output.seed = seed;
  output.bladeT = bladeT;
  return output;
}

@fragment
fn fragmentMain(input: GrassOutput) -> @location(0) vec4f {
  let normal = normalize(vec3f(input.normalX, input.normalY, input.normalZ));
  let tier = fract(input.seed * 7.31);
  let baseColor = themeGrass(tier) * 0.74;
  let tipColor = themeGrass(tier + 0.19);
  let bladeColor = mix(baseColor, tipColor, input.bladeT);
  let sunDirection = normalize(vec3f(-0.405616, 0.861934, -0.304212));
  let diffuse = max(dot(normal, sunDirection), 0.0);
  var color = clamp(bladeColor * (0.83 + diffuse * 0.22), vec3f(0.0), vec3f(1.0));
  let snowCover = sceneSnow() * smoothstep(0.52, 1.0, input.bladeT) * 0.78;
  color = mix(color, themeSnow(), snowCover);
  return vec4f(color, 1.0);
}
`,li=`
${_}

struct FlowerOutput {
  @builtin(position) position: vec4f,
  @location(0) petalT: f32,
  @location(1) normalX: f32,
  @location(2) normalY: f32,
  @location(3) normalZ: f32,
  @location(4) seed: f32,
  @location(5) isCenter: f32,
  @location(6) lateral: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read> flowers: array<vec4f>;

fn blossomOpacity() -> f32 {
  // Fade the intact canopy before petals can collapse into bright single pixels.
  // Morph progress makes the reverse transition follow the same clean path.
  return 1.0 - smoothstep(0.35, 0.72, uniforms.progress);
}

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> FlowerOutput {
  var output: FlowerOutput;
  let verticesPerFlower = 150u;
  let flowerIndex = vertexIndex / verticesPerFlower;
  let localIndex = vertexIndex % verticesPerFlower;
  let data = flowers[flowerIndex];
  let column = data.x;
  let row = data.y;
  let topY = data.z;
  let rawSeed = data.w;
  let isFrond = step(5.0, rawSeed);
  let isOrb = step(3.0, rawSeed) * (1.0 - isFrond);
  let isFruit = step(2.0, rawSeed) * (1.0 - isOrb) * (1.0 - isFrond);
  let isRegularLeaf = step(1.0, rawSeed) * (1.0 - isFruit)
    * (1.0 - isOrb) * (1.0 - isFrond);
  let isLeaf = max(isRegularLeaf, isFrond);
  let seed = rawSeed - isRegularLeaf - 2.0 * isFruit
    - 3.0 * isOrb - 5.0 * isFrond;
  output.seed = rawSeed;
  let visibility = smoothstep(0.0, 0.6, 1.0 - uniforms.progress);
  if (blossomOpacity() < 0.01) {
    output.position = vec4f(0.0, 0.0, -10.0, 1.0);
    return output;
  }
  let blossomScale = max(0.55, visibility);
  let blockSize = 0.0245;
  let halfGrid = uniforms.gridSize * blockSize * 0.5;
  let centerX = column * blockSize - halfGrid;
  let centerZ = row * blockSize - halfGrid;
  let groundPetal = step(topY, blockSize * 2.5);
  let gapColumn = floor((column + 0.5) / 2.0);
  let gapRow = floor((row + 0.5) / 2.0);
  let gapSample = fract(sin(
    gapColumn * 12.9898 + gapRow * 78.233 + uniforms.flowerHue * 91.37
  ) * 43758.5453);
  let gridCenter = uniforms.gridSize * 0.5;
  let interiorRadius = distance(vec2f(column, row), vec2f(gridCenter))
    / max(uniforms.gridSize * 0.46, 1.0);
  let interiorMask = 1.0 - step(0.76, interiorRadius);
  let canopyOrgan = (1.0 - groundPetal) * (1.0 - isFruit)
    * (1.0 - isOrb) * (1.0 - isFrond);
  let densityVisibility = 1.0;
  let windFactor = (1.0 - groundPetal) * visibility * (1.0 - isOrb);
  let windBase = sin(uniforms.time * 0.45 + column * 0.25 + row * 0.15)
    * 0.028 * sceneBreeze();
  let windTurbulence = sin(uniforms.time * 1.1 + column * 0.8 + row * 0.6)
    * 0.008 * sceneBreeze();
  let swayX = (windBase + windTurbulence) * windFactor;
  let swayZ = sin(uniforms.time * 0.35 + column * 0.15 + row * 0.25)
    * 0.018 * sceneBreeze();
  let meadow = step(uniforms.gridSize * 0.45,
    distance(vec2f(column, row), vec2f(gridCenter)));
  let organicScale = blockSize * (0.78 + seed * 0.14) * mix(1.0, 0.37, meadow);
  let orbScale = mix(organicScale, blockSize * 13.0, isOrb);
  let baseScale = mix(orbScale, blockSize * 1.4, isFrond)
    * blossomScale * densityVisibility;
  let flowerScale = mix(baseScale, baseScale * 1.12, isLeaf);
  var petalLength = mix(flowerScale * 0.92, flowerScale * 1.45, isLeaf);
  var petalWidth = mix(flowerScale * 0.46, flowerScale * 0.28, isLeaf);
  var curlHeight = mix(blockSize * 0.11, blockSize * 0.08, isLeaf)
    * blossomScale * densityVisibility;
  petalLength = mix(petalLength, flowerScale * 3.2, isFrond);
  petalWidth = mix(petalWidth, flowerScale * 0.32, isFrond);
  // One readable five-petal blossom, rather than mixed narrow confetti variants.
  if (isLeaf < 0.5 && isFruit < 0.5 && isOrb < 0.5) {
    petalLength *= 1.03;
    petalWidth *= 1.06;
    curlHeight *= 1.4;
  }
  let centerRadius = mix(blockSize * 0.12, blockSize * 0.04, isLeaf)
    * blossomScale * densityVisibility;
  let baseRotation = seed * 6.28318;
  let tiltAngle = (seed * 0.25 + 0.05) * (1.0 - isLeaf * 0.5);
  let tiltDirection = seed * 6.28318 * 3.17;
  let tiltAxisX = cos(tiltDirection);
  let tiltAxisZ = sin(tiltDirection);
  var localOffset = vec3f(0.0);
  var normal = vec3f(0.0, 1.0, 0.0);
  output.petalT = 0.0;
  output.isCenter = 0.0;
  output.lateral = 0.0;

  if (isFruit > 0.5 || isOrb > 0.5) {
    let fruitQuad = array<vec2f, 6>(
      vec2f(0.0, 0.0), vec2f(1.0, 0.0), vec2f(0.0, 1.0),
      vec2f(0.0, 1.0), vec2f(1.0, 0.0), vec2f(1.0, 1.0),
    );
    let cell = localIndex / 6u;
    let latitude = cell / 5u;
    let longitude = cell % 5u;
    let fruitUv = fruitQuad[localIndex % 6u];
    let theta = (f32(latitude) + fruitUv.y) * 0.2 * 3.14159;
    let phi = (f32(longitude) + fruitUv.x) * 0.2 * 6.28318 + baseRotation;
    let fruitNormal = vec3f(sin(theta) * cos(phi), cos(theta), sin(theta) * sin(phi));
    let fruitRadius = flowerScale * mix(0.64 + seed * 0.10, 1.0, isOrb);
    let shoulder = 0.9 + sin(theta) * 0.1;
    let dimple = pow(max(cos(theta), 0.0), 8.0) * fruitRadius * 0.14;
    localOffset = vec3f(
      fruitNormal.x * fruitRadius * shoulder,
      fruitNormal.y * fruitRadius * 1.05 - dimple,
      fruitNormal.z * fruitRadius * shoulder,
    );
    normal = normalize(vec3f(fruitNormal.x, fruitNormal.y / 1.05, fruitNormal.z));
    output.petalT = fruitUv.y;
  } else if (localIndex < 120u) {
    let petalIndex = localIndex / 24u;
    let petalVertex = localIndex % 24u;
    let segmentIndex = petalVertex / 6u;
    let triangleVertex = petalVertex % 6u;
    var rowIndex = segmentIndex;
    var side = -1.0;
    if (triangleVertex == 1u || triangleVertex == 4u || triangleVertex == 5u) {
      side = 1.0;
    }
    if (triangleVertex == 2u || triangleVertex == 3u || triangleVertex == 5u) {
      rowIndex = segmentIndex + 1u;
    }
    let petalT = f32(rowIndex) * 0.25;
    output.petalT = petalT;
    output.lateral = side;
    let angle = f32(petalIndex) * 1.25664 + baseRotation;
    var petalScale = 1.0;
    if (isLeaf > 0.5 && petalIndex >= 3u) { petalScale = 0.0; }
    if (isFrond > 0.5 && petalIndex >= 1u) { petalScale = 0.0; }
    let distance = petalT * petalLength * petalScale;
    let halfWidth = petalWidth * sin(petalT * 3.14159)
      * sqrt(1.0 - petalT * 0.3) * petalScale;
    let sideOffset = side * halfWidth;
    let cupHeight = flowerScale * 0.58 * (1.0 - isLeaf);
    let curl = curlHeight * 2.0 * petalT * (1.0 - petalT)
      + cupHeight * petalT * petalT;
    localOffset = vec3f(
      distance * cos(angle) + sideOffset * -sin(angle),
      curl,
      distance * sin(angle) + sideOffset * cos(angle),
    );
    let curlSlope = (curlHeight * 2.0 * (1.0 - 2.0 * petalT)
      + cupHeight * 2.0 * petalT) / max(petalLength, 0.0001);
    normal = normalize(vec3f(
      -curlSlope * cos(angle) + side * 0.2 * sin(angle),
      1.0,
      -curlSlope * sin(angle) - side * 0.2 * cos(angle),
    ));
  } else {
    output.isCenter = 1.0;
    let diskVertex = localIndex - 120u;
    let triangleIndex = diskVertex / 3u;
    let triangleVertex = diskVertex % 3u;
    let angleIndex = select(triangleIndex, triangleIndex + 1u, triangleVertex == 2u);
    if (triangleVertex > 0u) {
      let angle = f32(angleIndex) * 0.62832 + baseRotation;
      localOffset = vec3f(cos(angle) * centerRadius, curlHeight * 0.72,
        sin(angle) * centerRadius);
    } else {
      localOffset.y = curlHeight * 0.8;
    }
  }

  let tiltCos = cos(tiltAngle);
  let tiltSin = sin(tiltAngle);
  let dotAxis = tiltAxisX * localOffset.x + tiltAxisZ * localOffset.z;
  let tiltedOffset = vec3f(
    localOffset.x * tiltCos - tiltAxisZ * localOffset.y * tiltSin
      + tiltAxisX * dotAxis * (1.0 - tiltCos),
    localOffset.y * tiltCos
      + (tiltAxisZ * localOffset.x - tiltAxisX * localOffset.z) * tiltSin,
    localOffset.z * tiltCos + tiltAxisX * localOffset.y * tiltSin
      + tiltAxisZ * dotAxis * (1.0 - tiltCos),
  );
  let normalDotAxis = tiltAxisX * normal.x + tiltAxisZ * normal.z;
  normal = normalize(vec3f(
    normal.x * tiltCos - tiltAxisZ * normal.y * tiltSin
      + tiltAxisX * normalDotAxis * (1.0 - tiltCos),
    normal.y * tiltCos + (tiltAxisZ * normal.x - tiltAxisX * normal.z) * tiltSin,
    normal.z * tiltCos + tiltAxisX * normal.y * tiltSin
      + tiltAxisZ * normalDotAxis * (1.0 - tiltCos),
  ));
  let spin = uniforms.time * 0.055 * isOrb;
  let spinCos = cos(spin);
  let spinSin = sin(spin);
  let spunOffset = vec3f(
    tiltedOffset.x * spinCos - tiltedOffset.z * spinSin,
    tiltedOffset.y,
    tiltedOffset.x * spinSin + tiltedOffset.z * spinCos,
  );
  normal = normalize(vec3f(
    normal.x * spinCos - normal.z * spinSin,
    normal.y,
    normal.x * spinSin + normal.z * spinCos,
  ));
  let localPos = vec3f(
    centerX + swayX + spunOffset.x,
    topY + spunOffset.y,
    centerZ + swayZ * windFactor + spunOffset.z,
  );
  output.position = projectPosition(localPos);
  output.normalX = normal.x;
  output.normalY = normal.y;
  output.normalZ = normal.z;
  return output;
}

@fragment
fn fragmentMain(input: FlowerOutput) -> @location(0) vec4f {
  let opacity = blossomOpacity();
  if (opacity < 0.01) { discard; }
  let normal = normalize(vec3f(input.normalX, input.normalY, input.normalZ));
  let isFrond = step(5.0, input.seed);
  let isOrb = step(3.0, input.seed) * (1.0 - isFrond);
  let isFruit = step(2.0, input.seed) * (1.0 - isOrb) * (1.0 - isFrond);
  let isRegularLeaf = step(1.0, input.seed) * (1.0 - isFruit)
    * (1.0 - isOrb) * (1.0 - isFrond);
  let isLeaf = max(isRegularLeaf, isFrond);
  let seed = input.seed - isRegularLeaf - 2.0 * isFruit
    - 3.0 * isOrb - 5.0 * isFrond;
  var baseColor = vec3f(0.0);
  if (isOrb > 0.5) {
    let continent = sin(normal.x * 9.0 + seed * 11.0)
      + sin(normal.y * 13.0 - normal.z * 7.0)
      + sin((normal.x + normal.z) * 17.0 + seed * 5.0) * 0.45;
    let landMask = smoothstep(0.1, 0.72, continent);
    let ocean = mix(uniforms.themePrimary.rgb, uniforms.themeFifth.rgb, 0.12);
    let land = mix(uniforms.themeSecondary.rgb, uniforms.themeThird.rgb, 0.24);
    let latitudeLight = 0.9 + normal.y * 0.1;
    baseColor = mix(ocean, land, landMask) * latitudeLight;
    let polarCap = smoothstep(0.7, 0.94, abs(normal.y));
    baseColor = mix(baseColor, uniforms.themeFifth.rgb, polarCap * 0.72);
    let highlight = smoothstep(0.86, 0.98, fract(continent * 4.1 + seed));
    baseColor = mix(baseColor, uniforms.themeThird.rgb, highlight * 0.2);
  } else if (isFruit > 0.5) {
    let shadow = mix(uniforms.themeThird.rgb, themeInk(), 0.44);
    let skin = mix(uniforms.themeThird.rgb, uniforms.themePrimary.rgb, 0.28);
    let highlight = mix(skin, vec3f(1.0), 0.32);
    baseColor = mix(shadow, skin, 0.45 + normal.y * 0.25);
    baseColor = mix(baseColor, highlight, pow(max(normal.y, 0.0), 3.0) * 0.42);
  } else if (isLeaf > 0.5) {
    let tier = fract(seed * 5.17);
    let leafBase = mix(themeLeaf(tier), themeInk(), 0.18);
    let leafTip = themeLeaf(tier + 0.16);
    baseColor = mix(leafBase, leafTip, input.petalT);
    let vein = 1.0 - smoothstep(0.025, 0.17, abs(input.lateral));
    let edge = smoothstep(0.72, 1.0, abs(input.lateral));
    let tipShade = smoothstep(0.82, 1.0, input.petalT);
    baseColor *= 1.0 - vein * 0.20 - edge * 0.07 - tipShade * 0.08;
  } else if (input.isCenter > 0.5) {
    baseColor = vec3f(0.92, 0.78, 0.35) * (0.9 + fract(seed * 13.3) * 0.15);
  } else {
    let base = themeFlower(seed);
    let tip = uniforms.themePrimary.rgb;
    baseColor = mix(base, tip, smoothstep(0.62, 1.0, input.petalT) * 0.78);
    baseColor *= 1.0 - (1.0 - abs(input.petalT - 0.5) * 2.0) * 0.03;
  }
  let clusterShade = mix(0.92, 1.0, smoothstep(0.16, 0.86, fract(seed * 13.37)));
  let shadeAmount = (1.0 - isFruit) * (1.0 - isOrb);
  baseColor *= mix(1.0, clusterShade, shadeAmount);
  let sunDirection = normalize(vec3f(-0.405616, 0.861934, -0.304212));
  let diffuse = max(dot(normal, sunDirection), 0.0);
  let backLight = max(dot(-normal, sunDirection), 0.0);
  let flowerSubsurface = themeFlower(seed);
  let leafSubsurface = themeLeaf(seed);
  let fruitSubsurface = mix(uniforms.themeThird.rgb, vec3f(1.0), 0.18);
  let organSubsurface = mix(flowerSubsurface, leafSubsurface, isLeaf);
  var subsurfaceColor = mix(organSubsurface, fruitSubsurface, isFruit);
  let subsurface = backLight * 0.22 * subsurfaceColor;
  let sky = max(normal.y, 0.0) * 0.05 * uniforms.themeFifth.rgb;
  let underside = mix(0.55, 1.0, max(normal.y, 0.0))
    * mix(0.92, 1.0, fract(seed * 11.3));
  let viewDirection = normalize(vec3f(0.398015, 0.597022, 0.696526));
  let rim = pow(1.0 - max(dot(normal, viewDirection), 0.0), 3.0)
    * 0.07 * themeFlower(seed + 0.19);
  let lit = baseColor * underside * (vec3f(0.28, 0.28, 0.30) + 1.2 * diffuse * 0.88)
    + subsurface + sky + rim;
  var color = clamp(
    baseColor * (0.78 + diffuse * 0.24) + backLight * baseColor * 0.05,
    vec3f(0.0), vec3f(1.0),
  );
  let snowCover = sceneSnow() * smoothstep(0.18, 0.92, normal.y)
    * (0.38 + step(0.62, fract(seed * 9.17)) * 0.3);
  color = mix(color, themeSnow(), snowCover);
  return vec4f(color, opacity);
}
`,ui=`
${_}

struct PetalOutput {
  @builtin(position) position: vec4f,
  @location(0) normal: vec3f,
  @location(1) seed: f32,
  @location(2) petalT: f32,
  @location(3) lateral: f32,
  @location(4) fade: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read> petals: array<vec4f>;

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> PetalOutput {
  var output: PetalOutput;
  let verticesPerPetal = 24u;
  let petalIndex = vertexIndex / verticesPerPetal;
  let localIndex = vertexIndex % verticesPerPetal;
  let data = petals[petalIndex];
  let seed = data.w;
  let visibility = smoothstep(0.0, 0.35, 1.0 - uniforms.progress) * sceneWind();
  let cycleRate = 0.052 + seed * 0.025;
  let cycle = fract(uniforms.time * cycleRate + seed * 7.31);
  let fallT = smoothstep(0.03, 0.94, cycle);
  let fade = smoothstep(0.0, 0.08, cycle) * (1.0 - smoothstep(0.92, 1.0, cycle));
  let blockSize = uniforms.blockSize;
  let halfGrid = uniforms.gridSize * blockSize * 0.5;
  let groundY = blockSize * 1.12;
  let originX = data.x * blockSize - halfGrid;
  let originZ = data.y * blockSize - halfGrid;
  let phase = seed * 31.416;
  let driftX = sin(uniforms.time * 0.71 + phase) * blockSize * (1.2 + seed * 2.2);
  let driftZ = cos(uniforms.time * 0.53 + phase * 1.37) * blockSize * (1.0 + seed * 1.8);
  let travelX = (fallT - 0.5) * blockSize * (seed - 0.5) * 4.0;
  let travelZ = sin(fallT * 6.28318 + phase) * blockSize * 0.7;
  let windPulse = 0.72 + sin(uniforms.time * 0.8 + phase) * 0.28;
  let windTravelX = fallT * blockSize * (5.0 + seed * 5.0) * windPulse;
  let windTravelZ = fallT * blockSize * (seed - 0.5) * 2.2;
  let petalCenter = vec3f(
    originX + driftX + travelX + windTravelX,
    mix(data.z, groundY, fallT) + sin(fallT * 3.14159) * blockSize * 0.45,
    originZ + driftZ + travelZ + windTravelZ,
  );
  let center = petalCenter;

  let stripVertex = localIndex % 24u;
  let segmentIndex = stripVertex / 6u;
  let triangleVertex = stripVertex % 6u;
  var rowIndex = segmentIndex;
  var side = -1.0;
  if (triangleVertex == 1u || triangleVertex == 4u || triangleVertex == 5u) {
    side = 1.0;
  }
  if (triangleVertex == 2u || triangleVertex == 3u || triangleVertex == 5u) {
    rowIndex = segmentIndex + 1u;
  }
  let petalT = f32(rowIndex) * 0.25;
  let scale = blockSize * (0.72 + seed * 0.28) * visibility;
  let length = scale * petalT;
  let envelope = pow(max(sin(petalT * 3.14159), 0.0), 0.72);
  let petalWidth = scale * 0.42 * envelope * sqrt(1.0 - petalT * 0.28);
  let width = petalWidth;
  let curl = scale * 0.18 * 4.0 * petalT * (1.0 - petalT);
  let spin = uniforms.time * (0.8 + seed * 1.4) + phase;
  let spinCos = cos(spin);
  let spinSin = sin(spin);
  let local = vec3f(length, curl, side * width);
  let petalOffset = vec3f(
    local.x * spinCos - local.z * spinSin,
    local.y,
    local.x * spinSin + local.z * spinCos,
  );
  let spun = petalOffset;
  let tilt = 0.45 + fallT * 1.05 + sin(uniforms.time * 1.2 + phase) * 0.28;
  let tiltCos = cos(tilt);
  let tiltSin = sin(tilt);
  let offset = vec3f(
    spun.x,
    spun.y * tiltCos - spun.z * tiltSin,
    spun.y * tiltSin + spun.z * tiltCos,
  );
  let normal = normalize(vec3f(spinSin * tiltSin, tiltCos, spinCos * tiltSin));
  output.position = projectPosition(center + offset);
  output.normal = normal;
  output.seed = seed;
  output.petalT = petalT;
  output.lateral = side;
  output.fade = fade * visibility;
  return output;
}

@fragment
fn fragmentMain(input: PetalOutput) -> @location(0) vec4f {
  let tier = fract(input.seed * 7.31);
  let base = mix(themeFlower(tier), themeInk(), 0.12);
  let tip = mix(themeFlower(tier), vec3f(1.0), 0.28);
  var color = mix(base, tip, input.petalT);
  let vein = 1.0 - smoothstep(0.03, 0.22, abs(input.lateral));
  color *= 1.0 - vein * 0.08;
  let sunDirection = normalize(vec3f(-0.405616, 0.861934, -0.304212));
  let diffuse = max(dot(input.normal, sunDirection), 0.0);
  let backLight = max(dot(-input.normal, sunDirection), 0.0);
  let transmitted = mix(themeFlower(tier), vec3f(1.0), 0.35);
  let lit = color * (0.38 + diffuse * 0.94) + backLight * transmitted * 0.3;
  return vec4f(lit, input.fade);
}
`,ci=`
${_}

struct ButterflyOutput {
  @builtin(position) position: vec4f,
  @location(0) wingT: f32,
  @location(1) seed: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read> butterflyData: array<vec4f>;

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> ButterflyOutput {
  var output: ButterflyOutput;
  let verticesPerButterfly = 6u;
  let butterflyIndex = vertexIndex / verticesPerButterfly;
  let localVertex = vertexIndex % verticesPerButterfly;
  let visibility = smoothstep(0.0, 0.4, 1.0 - uniforms.progress) * sceneWind();
  if (visibility < 0.01) {
    output.position = vec4f(0.0, 0.0, -10.0, 1.0);
    return output;
  }
  let data = butterflyData[butterflyIndex];
  let orbitRadius = data.x;
  let orbitSpeed = data.y;
  let heightOffset = data.z;
  let seed = data.w;
  output.seed = seed;
  let blockSize = uniforms.blockSize;
  let halfGrid = uniforms.gridSize * blockSize * 0.5;
  let time = uniforms.time;
  let phase = seed * 6.28318;
  let orbitAngle = time * orbitSpeed + phase;
  let gust = sin(time * 0.42 + phase * 2.0) * blockSize * 2.4;
  let wobble = sin(time * 2.5 + seed * 8.0) * 0.3;
  let bobY = sin(time * 1.8 + seed * 5.0) * blockSize * 1.8;
  let centerColumn = uniforms.gridSize * 0.5 + cos(orbitAngle + wobble) * orbitRadius;
  let centerRow = uniforms.gridSize * 0.5 + sin(orbitAngle + wobble) * orbitRadius;
  let center = vec3f(
    centerColumn * blockSize - halfGrid + gust,
    blockSize * heightOffset + bobY,
    centerRow * blockSize - halfGrid,
  );
  let directionX = -sin(orbitAngle + wobble);
  let directionZ = cos(orbitAngle + wobble);
  let flapAngle = sin(time * (14.0 + seed * 10.0) + seed * 10.0) * 0.9;
  let wingSpan = blockSize * (0.72 + seed * 0.24) * visibility;
  let wingLength = blockSize * (0.66 + seed * 0.2) * visibility;
  let isRightWing = localVertex >= 3u;
  let wingVertex = localVertex % 3u;
  let wingSign = select(-1.0, 1.0, isRightWing);
  output.wingT = 0.0;
  var localPosition = center;
  if (wingVertex > 0u) {
    let forwardSign = select(-1.0, 1.0, wingVertex == 1u);
    let outwardScale = select(0.85, 1.0, wingVertex == 1u);
    let upwardScale = select(0.5, 0.7, wingVertex == 1u);
    let wingUp = sin(flapAngle * wingSign) * wingSpan * upwardScale;
    let wingOut = cos(flapAngle * wingSign) * wingSpan * outwardScale;
    localPosition = vec3f(
      center.x + directionZ * wingOut * wingSign
        + directionX * wingLength * 0.55 * forwardSign,
      center.y + wingUp,
      center.z - directionX * wingOut * wingSign
        + directionZ * wingLength * 0.55 * forwardSign,
    );
    output.wingT = select(0.7, 1.0, wingVertex == 1u);
  }
  output.position = projectPosition(localPosition);
  return output;
}

@fragment
fn fragmentMain(input: ButterflyOutput) -> @location(0) vec4f {
  let tier = fract(input.seed * 3.17);
  var wingBase = mix(themeInk(), uniforms.themePrimary.rgb, 0.78);
  var wingTip = mix(uniforms.themePrimary.rgb, uniforms.themeSecondary.rgb, 0.42);
  if (tier > 0.5) {
    wingBase = mix(themeInk(), uniforms.themeThird.rgb, 0.76);
    wingTip = mix(uniforms.themeThird.rgb, uniforms.themeFourth.rgb, 0.42);
  }
  var color = mix(wingBase, wingTip, input.wingT);
  color *= mix(0.62, 1.0, smoothstep(0.0, 0.25, input.wingT));
  let mapped = clamp(
    (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14),
    vec3f(0.0),
    vec3f(1.0),
  );
  return vec4f(pow(mapped, vec3f(1.0 / 2.2)), 0.9);
}
`});var cn={};ke(cn,{WORLD_PROP_SHADER:()=>di});var di,dn=Oe(()=>{ft();di=`
${_}

struct WorldProp {
  centerType: vec4f,
  sizeMaterial: vec4f,
  rotationSeed: vec4f,
}

struct PropGeometry {
  position: vec3f,
  normal: vec3f,
  valid: f32,
}

struct PropOutput {
  @builtin(position) position: vec4f,
  @location(0) normal: vec3f,
  @location(1) @interpolate(flat) material: u32,
  @location(2) seed: f32,
  @location(3) opacity: f32,
  @location(4) localHeight: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read> props: array<WorldProp>;

fn quadVertex(index: u32) -> vec2f {
  let quad = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0),
  );
  return quad[index % 6u];
}

fn boxGeometry(index: u32) -> PropGeometry {
  if (index >= 36u) { return PropGeometry(vec3f(0.0), vec3f(0.0, 1.0, 0.0), 0.0); }
  let face = index / 6u;
  let uv = quadVertex(index) * 0.5;
  var position = vec3f(0.0);
  var normal = vec3f(0.0, 1.0, 0.0);
  if (face == 0u) { position = vec3f(uv.x, 0.5, uv.y); }
  else if (face == 1u) { position = vec3f(uv.x, -0.5, -uv.y); normal = vec3f(0.0, -1.0, 0.0); }
  else if (face == 2u) { position = vec3f(uv.x, uv.y, 0.5); normal = vec3f(0.0, 0.0, 1.0); }
  else if (face == 3u) { position = vec3f(-uv.x, uv.y, -0.5); normal = vec3f(0.0, 0.0, -1.0); }
  else if (face == 4u) { position = vec3f(0.5, uv.y, -uv.x); normal = vec3f(1.0, 0.0, 0.0); }
  else { position = vec3f(-0.5, uv.y, uv.x); normal = vec3f(-1.0, 0.0, 0.0); }
  return PropGeometry(position, normal, 1.0);
}

fn frustumGeometry(index: u32) -> PropGeometry {
  if (index >= 36u) { return PropGeometry(vec3f(0.0), vec3f(0.0, 1.0, 0.0), 0.0); }
  let face = index / 6u;
  let uv = quadVertex(index) * 0.5;
  let bottomScale = 0.34;
  var position = vec3f(0.0);
  var normal = vec3f(0.0, 1.0, 0.0);
  if (face == 0u) { position = vec3f(uv.x, 0.5, uv.y); }
  else if (face == 1u) { position = vec3f(uv.x * bottomScale, -0.5, -uv.y * bottomScale); normal = vec3f(0.0, -1.0, 0.0); }
  else {
    let heightT = uv.y + 0.5;
    let width = mix(bottomScale, 1.0, heightT);
    if (face == 2u) { position = vec3f(uv.x * width, uv.y, 0.5 * width); normal = normalize(vec3f(0.0, -0.33, 1.0)); }
    else if (face == 3u) { position = vec3f(-uv.x * width, uv.y, -0.5 * width); normal = normalize(vec3f(0.0, -0.33, -1.0)); }
    else if (face == 4u) { position = vec3f(0.5 * width, uv.y, -uv.x * width); normal = normalize(vec3f(1.0, -0.33, 0.0)); }
    else { position = vec3f(-0.5 * width, uv.y, uv.x * width); normal = normalize(vec3f(-1.0, -0.33, 0.0)); }
  }
  return PropGeometry(position, normal, 1.0);
}

fn cylinderGeometry(index: u32) -> PropGeometry {
  if (index >= 144u) { return PropGeometry(vec3f(0.0), vec3f(0.0, 1.0, 0.0), 0.0); }
  let sideVertices = 72u;
  let capVertices = 36u;
  if (index < sideVertices) {
    let segment = index / 6u;
    let vertex = index % 6u;
    let angleA = f32(segment) / 12.0 * 6.2831853;
    let angleB = f32(segment + 1u) / 12.0 * 6.2831853;
    let useB = vertex == 1u || vertex == 4u || vertex == 5u;
    let upper = vertex == 2u || vertex == 3u || vertex == 5u;
    let angle = select(angleA, angleB, useB);
    let y = select(-0.5, 0.5, upper);
    let radial = vec3f(cos(angle) * 0.5, 0.0, sin(angle) * 0.5);
    return PropGeometry(vec3f(radial.x, y, radial.z), normalize(radial), 1.0);
  }
  let top = index < sideVertices + capVertices;
  var capIndex = index - sideVertices;
  if (!top) { capIndex = index - sideVertices - capVertices; }
  let segment = capIndex / 3u;
  let vertex = capIndex % 3u;
  let angleA = f32(segment) / 12.0 * 6.2831853;
  let angleB = f32(segment + 1u) / 12.0 * 6.2831853;
  var radial = vec2f(0.0);
  if (vertex == 1u) { radial = vec2f(cos(angleA), sin(angleA)) * 0.5; }
  else if (vertex == 2u) { radial = vec2f(cos(angleB), sin(angleB)) * 0.5; }
  let y = select(-0.5, 0.5, top);
  return PropGeometry(vec3f(radial.x, y, radial.y), vec3f(0.0, select(-1.0, 1.0, top), 0.0), 1.0);
}

fn sphereGeometry(index: u32) -> PropGeometry {
  let longitudeSegments = 6u;
  let latitudeSegments = 6u;
  if (index >= longitudeSegments * latitudeSegments * 6u) {
    return PropGeometry(vec3f(0.0), vec3f(0.0, 1.0, 0.0), 0.0);
  }
  let cell = index / 6u;
  let vertex = index % 6u;
  let longitude = cell % longitudeSegments;
  let latitude = cell / longitudeSegments;
  let uv = quadVertex(vertex) * 0.5 + 0.5;
  let theta = (f32(latitude) + uv.y) / f32(latitudeSegments) * 3.14159265;
  let phi = (f32(longitude) + uv.x) / f32(longitudeSegments) * 6.2831853;
  let normal = vec3f(sin(theta) * cos(phi), cos(theta), sin(theta) * sin(phi));
  return PropGeometry(normal * 0.5, normal, 1.0);
}

fn pyramidGeometry(index: u32) -> PropGeometry {
  if (index >= 18u) { return PropGeometry(vec3f(0.0), vec3f(0.0, 1.0, 0.0), 0.0); }
  if (index >= 12u) {
    let uv = quadVertex(index - 12u) * 0.5;
    return PropGeometry(vec3f(uv.x, -0.5, -uv.y), vec3f(0.0, -1.0, 0.0), 1.0);
  }
  let face = index / 3u;
  let vertex = index % 3u;
  let corners = array<vec3f, 4>(
    vec3f(-0.5, -0.5, -0.5), vec3f(0.5, -0.5, -0.5),
    vec3f(0.5, -0.5, 0.5), vec3f(-0.5, -0.5, 0.5),
  );
  let first = corners[face];
  let second = corners[(face + 1u) % 4u];
  let peak = vec3f(0.0, 0.5, 0.0);
  let position = select(select(first, second, vertex == 1u), peak, vertex == 2u);
  let normal = normalize(cross(second - first, peak - first));
  return PropGeometry(position, normal, 1.0);
}

fn ribbonGeometry(index: u32) -> PropGeometry {
  if (index >= 6u) { return PropGeometry(vec3f(0.0), vec3f(0.0, 0.0, 1.0), 0.0); }
  let uv = quadVertex(index) * 0.5;
  return PropGeometry(vec3f(uv.x, uv.y, 0.0), vec3f(0.0, 0.0, 1.0), 1.0);
}

fn rotateEuler(value: vec3f, rotation: vec3f) -> vec3f {
  let pitchCos = cos(rotation.y);
  let pitchSin = sin(rotation.y);
  let pitched = vec3f(value.x, value.y * pitchCos - value.z * pitchSin, value.y * pitchSin + value.z * pitchCos);
  let rollCos = cos(rotation.z);
  let rollSin = sin(rotation.z);
  let rolled = vec3f(pitched.x * rollCos - pitched.y * rollSin, pitched.x * rollSin + pitched.y * rollCos, pitched.z);
  let yawCos = cos(rotation.x);
  let yawSin = sin(rotation.x);
  return vec3f(rolled.x * yawCos - rolled.z * yawSin, rolled.y, rolled.x * yawSin + rolled.z * yawCos);
}

@vertex
fn vertexMain(
  @builtin(vertex_index) vertexIndex: u32,
  @builtin(instance_index) instanceIndex: u32,
) -> PropOutput {
  var output: PropOutput;
  let data = props[instanceIndex];
  let primitive = u32(round(data.centerType.w));
  var geometry = boxGeometry(vertexIndex);
  if (primitive == 1u) { geometry = frustumGeometry(vertexIndex); }
  else if (primitive == 2u) { geometry = cylinderGeometry(vertexIndex); }
  else if (primitive == 3u) { geometry = sphereGeometry(vertexIndex); }
  else if (primitive == 4u) { geometry = pyramidGeometry(vertexIndex); }
  else if (primitive == 5u) { geometry = ribbonGeometry(vertexIndex); }

  let opacity = 1.0 - smoothstep(0.22, 0.58, uniforms.progress);
  output.normal = vec3f(0.0, 1.0, 0.0);
  output.material = u32(round(data.sizeMaterial.w));
  output.seed = data.rotationSeed.w;
  output.opacity = opacity;
  output.localHeight = geometry.position.y + 0.5;
  if (opacity < 0.02 || geometry.valid < 0.5) {
    output.position = vec4f(0.0, 0.0, -10.0, 1.0);
    output.opacity = 0.0;
    return output;
  }

  let rotation = data.rotationSeed.xyz;
  let scaled = geometry.position * data.sizeMaterial.xyz;
  let localPosition = data.centerType.xyz + rotateEuler(scaled, rotation);
  output.normal = normalize(rotateEuler(geometry.normal, rotation));
  output.position = projectPosition(localPosition);
  return output;
}

fn propMaterial(material: u32, seed: f32, normal: vec3f, localHeight: f32) -> vec4f {
  let variation = 0.92 + fract(seed * 17.31) * 0.12;
  var color = mix(uniforms.themeFourth.rgb, themeInk(), 0.34);
  var alpha = 1.0;
  if (material == 1u) {
    color = mix(uniforms.themeSecondary.rgb, uniforms.themeFourth.rgb, 0.28);
  } else if (material == 2u) {
    color = mix(uniforms.themeThird.rgb, uniforms.themeFifth.rgb, 0.48);
  } else if (material == 3u) {
    color = uniforms.themePrimary.rgb;
  } else if (material == 4u) {
    color = mix(uniforms.themeThird.rgb, themeInk(), 0.42);
  } else if (material == 5u) {
    color = mix(uniforms.themePrimary.rgb, uniforms.themeFifth.rgb, 0.64);
    alpha = 0.84;
  } else if (material == 6u) {
    color = themeInk();
  } else if (material == 7u) {
    color = mix(uniforms.themePrimary.rgb, uniforms.themeSecondary.rgb, 0.36);
    color = mix(color, uniforms.themeFifth.rgb, clamp(localHeight, 0.0, 1.0) * 0.22);
    alpha = 0.78;
  } else if (material == 8u) {
    color = themeBark(seed);
  } else if (material == 9u) {
    color = mix(uniforms.themeFifth.rgb, vec3f(1.0), 0.42);
  } else if (material == 10u) {
    color = mix(uniforms.themePrimary.rgb, vec3f(1.0), 0.5);
  } else if (material == 11u) {
    color = mix(uniforms.themeThird.rgb, uniforms.themeFifth.rgb, 0.25 + fract(seed * 9.13) * 0.22);
  }
  let sunDirection = normalize(vec3f(-0.405616, 0.861934, -0.304212));
  let diffuse = max(dot(normal, sunDirection), 0.0);
  let sky = max(normal.y, 0.0) * 0.11;
  var lighting = 0.58 + diffuse * 0.38 + sky;
  if (material == 10u) { lighting = 1.12; }
  return vec4f(clamp(color * variation * lighting, vec3f(0.0), vec3f(1.0)), alpha);
}

@fragment
fn fragmentMain(input: PropOutput) -> @location(0) vec4f {
  if (input.opacity < 0.02) { discard; }
  let material = propMaterial(input.material, input.seed, normalize(input.normal), input.localHeight);
  let alpha = input.opacity * material.a;
  if (alpha < 0.02) { discard; }
  return vec4f(material.rgb, alpha);
}
`});var Di={};ke(Di,{CURRENT_GENERATOR_VERSION:()=>xe,MORPH_DURATION_MS:()=>ba,SAKURA_ENGINE_REVISION:()=>_i,SEED_WORLDS:()=>Fe,UPSTREAM_COMMIT:()=>Bi,WORLD_CODES:()=>ct,WORLD_PROP_LIMIT:()=>me,WORLD_PROP_STRIDE:()=>de,WORLD_PROP_VERTEX_COUNT:()=>dt,createEveryQRCodeIdentity:()=>Wo,createQRMatrix:()=>et,createQRSvgPath:()=>Yo,createSeedBlockField:()=>rt,createSeedGpuScene:()=>lt,createSeedModel:()=>Fi,createSeedWorldScene:()=>on,createSeedWorldScenes:()=>mt,isSeedWorld:()=>gt,mountSeed:()=>zn,normalizeSeedOrbit:()=>ga});var I=class extends Error{code;constructor(e,a){super(a),this.name="EveryQRCodeError",this.code=e}},D=class extends I{constructor(e){super("invalid-link",e),this.name="InvalidLinkError"}},ve=class extends I{constructor(){super("link-too-complex","That link is too long for the current Every QR Code format."),this.name="LinkTooComplexError"}},Q=class extends I{constructor(e,a){super("unsupported-version",`Unsupported ${e} version: ${a}.`),this.name="UnsupportedVersionError"}};var In=[1],xe=1;function jn(t){return In.some(e=>e===t)}function Le(t=xe){if(jn(t))return t;throw new RangeError(`Unsupported generator version: ${String(t)}`)}var xa=1,qn=/^[a-z0-9][a-z0-9/_-]*$/u,_n=128,Bn=4294967296;function Fn(t){return Array.from(t,e=>e.toString(16).padStart(2,"0")).join("")}async function Ge(t){if(!globalThis.crypto?.subtle)throw new I("generation-failed","Secure hashing is unavailable in this browser.");let e=new TextEncoder().encode(t);return new Uint8Array(await globalThis.crypto.subtle.digest("SHA-256",e))}function Dn(t){if(t.length!==32)throw new I("generation-failed","SHA-256 returned an unexpected digest length.");let e=new DataView(t.buffer,t.byteOffset,t.byteLength);return Object.freeze([e.getUint32(0,!1),e.getUint32(4,!1),e.getUint32(8,!1),e.getUint32(12,!1)])}function On(t){if(new TextEncoder().encode(t).length>_n||!qn.test(t))throw new RangeError(`Invalid Link DNA channel label: ${t}`)}var kt=class{#e;constructor(e){this.#e=[e[0],e[1],e[2],e[3]]}nextUint32(){let[e,a,o,n]=this.#e,r=e+a|0;return e=a^a>>>9,a=o+(o<<3)|0,o=o<<21|o>>>11,n=n+1|0,r=r+n|0,o=o+r|0,this.#e[0]=e>>>0,this.#e[1]=a>>>0,this.#e[2]=o>>>0,this.#e[3]=n>>>0,r>>>0}next(){return this.nextUint32()/Bn}},vt=class{identityVersion=xa;#e;#t=new Map;constructor(e){this.#e={family:e.family.slice(),page:e.page.slice(),site:e.site.slice()}}get familyDigest(){return this.#e.family.slice()}get pageDigest(){return this.#e.page.slice()}get siteDigest(){return this.#e.site.slice()}async channelSeed(e,a){On(a);let o=`${e}:${a}`,n=this.#t.get(o);if(n)return Object.freeze([...n]);let r=this.#e[e],i=`linkseed:channel:v1|${Fn(r)}|${a}`,s=Dn(await Ge(i));return this.#t.set(o,s),Object.freeze([...s])}async channel(e,a){return new kt(await this.channelSeed(e,a))}};async function wa(t,e=1){if(e!==xa)throw new Q("identity",e);let[a,o,n]=await Promise.all([Ge(`linkseed:family:v1|${t.familyIdentity}`),Ge(`linkseed:page:v1|${t.pageIdentity}`),Ge(`linkseed:site:v1|${t.siteIdentity}`)]);return new vt({family:a,page:o,site:n})}function xt(t,e,a){if(a<0||a>1)throw new RangeError("familyWeight");return t*a+e*(1-a)}var we={data:0,remainder:1,finder:2,separator:3,timing:4,alignment:5,format:6,version:7,"fixed-dark":8},Ue=255,Ln=[0,26,44,70,100,134,172],Gn={1:[],2:[6,18],3:[6,22],4:[6,26],5:[6,30],6:[6,34]};function wt(t,e,a,o,n){t[o*e+a]=we[n]}function q(t,e,a,o,n){let r=o*e+a;t[r]===Ue&&(t[r]=we[n])}function Un(t,e){let a=[[0,0],[e-7,0],[0,e-7]];for(let[o,n]of a)for(let r=0;r<7;r+=1)for(let i=0;i<7;i+=1)wt(t,e,o+i,n+r,"finder")}function Vn(t,e){for(let a=0;a<8;a+=1)q(t,e,a,7,"separator"),q(t,e,7,a,"separator"),q(t,e,e-8+a,7,"separator"),q(t,e,e-8,a,"separator"),q(t,e,a,e-8,"separator"),q(t,e,7,e-8+a,"separator")}function Hn(t,e){for(let a=8;a<=e-9;a+=1)q(t,e,a,6,"timing"),q(t,e,6,a,"timing")}function Nn(t,e,a){let o=Gn[a]??[];for(let n of o)for(let r of o)if(t[n*e+r]===Ue)for(let i=n-2;i<=n+2;i+=1)for(let s=r-2;s<=r+2;s+=1)wt(t,e,s,i,"alignment")}function Wn(t,e){for(let a=0;a<=5;a+=1)q(t,e,8,a,"format"),q(t,e,a,8,"format");q(t,e,8,7,"format"),q(t,e,8,8,"format"),q(t,e,7,8,"format");for(let a=e-8;a<e;a+=1)q(t,e,a,8,"format");for(let a=e-7;a<e;a+=1)q(t,e,8,a,"format");wt(t,e,8,e-8,"fixed-dark")}function Yn(t,e){let a=[],o=!0;for(let n=e-1;n>=1;n-=2){n===6&&(n-=1);for(let r=0;r<e;r+=1){let i=o?e-1-r:r;for(let s of[n,n-1]){let l=i*e+s;t[l]===Ue&&a.push(l)}}o=!o}return a}function Sa(t){if(!Number.isInteger(t)||t<1||t>6)throw new RangeError("symbolVersion");let e=17+4*t,a=new Uint8Array(e**2);a.fill(Ue),Un(a,e),Vn(a,e),Hn(a,e),Nn(a,e,t),Wn(a,e);let o=Yn(a,e),n=(Ln[t]??0)*8;if(o.length<n||o.length-n>7)throw new I("generation-failed","QR role placement did not match the profile.");return o.forEach((r,i)=>{a[r]=i<n?we.data:we.remainder}),a}var za=[1/16,4/16,6/16,4/16,1/16];function Pa(t,e,a){let o=new Float32Array(t.length);for(let n=0;n<e;n+=1)for(let r=0;r<e;r+=1){let i=0,s=0,l=Math.max(0,n-a),u=Math.min(e-1,n+a),c=Math.max(0,r-a),d=Math.min(e-1,r+a);for(let m=l;m<=u;m+=1)for(let f=c;f<=d;f+=1)i+=t[m*e+f]??0,s+=1;o[n*e+r]=i/s}return o}function Qn(t,e){let a=new Float32Array(t.length),o=new Float32Array(t.length);for(let n=0;n<e;n+=1)for(let r=0;r<e;r+=1){let i=0;for(let s=-2;s<=2;s+=1){let l=Math.max(0,Math.min(e-1,r+s));i+=(t[n*e+l]??0)*(za[s+2]??0)}a[n*e+r]=i}for(let n=0;n<e;n+=1)for(let r=0;r<e;r+=1){let i=0;for(let s=-2;s<=2;s+=1){let l=Math.max(0,Math.min(e-1,n+s));i+=(a[l*e+r]??0)*(za[s+2]??0)}o[n*e+r]=i}return o}function Ca(t,e,a){let o=[];t.forEach((r,i)=>{r===a&&o.push([i%e,Math.floor(i/e)])});let n=new Float32Array(t.length);for(let r=0;r<e;r+=1)for(let i=0;i<e;i+=1){let s=Number.POSITIVE_INFINITY;for(let[l,u]of o){let c=i-l,d=r-u;s=Math.min(s,c**2+d**2)}n[r*e+i]=Math.sqrt(s)}return n}function X(t,e,a,o){let n=Math.max(0,Math.min(e-1,a)),r=Math.max(0,Math.min(e-1,o));return t[r*e+n]??0}function Xn(t,e){let a=new Float32Array(t.length),o=4*Math.SQRT2;for(let n=0;n<e;n+=1)for(let r=0;r<e;r+=1){let i=X(t,e,r-1,n-1),s=X(t,e,r,n-1),l=X(t,e,r+1,n-1),u=X(t,e,r-1,n),c=X(t,e,r+1,n),d=X(t,e,r-1,n+1),m=X(t,e,r,n+1),f=X(t,e,r+1,n+1),p=l+2*c+f-i-2*u-d,g=d+2*m+f-i-2*s-l;a[n*e+r]=Math.min(1,Math.hypot(p,g)/o)}return a}function Ra(t){let e=Qn(t.cells,t.size);return{blur:e,darkDistance:Ca(t.cells,t.size,1),density3x3:Pa(t.cells,t.size,1),density5x5:Pa(t.cells,t.size,2),edge:Xn(e,t.size),lightDistance:Ca(t.cells,t.size,0),roles:Sa(t.symbolVersion)}}var To=An(Mo());var Ee=Object.freeze({boostErrorCorrection:!1,errorCorrection:"M",maxSymbolVersion:6,minSymbolVersion:1,profileVersion:1});function Vr(t){let e=new Uint8Array(t.modules.size**2);for(let a=0;a<t.modules.size;a+=1)for(let o=0;o<t.modules.size;o+=1){let n=t.modules.get(o,a);if(n!==0&&n!==1)throw new I("generation-failed","The QR encoder returned an invalid module.");e[a*t.modules.size+o]=n}return e}function Hr(t){if(!Number.isInteger(t.version)||t.version<1)throw new I("generation-failed","The QR encoder returned an invalid version.");if(t.version>Ee.maxSymbolVersion)throw new ve;if(t.modules.size!==17+4*t.version)throw new I("generation-failed","The QR encoder returned an invalid matrix size.");if(t.modules.data.length!==t.modules.size**2)throw new I("generation-failed","The QR encoder returned incomplete module data.");let e=t.maskPattern;if(e===void 0||!Number.isInteger(e)||e<0||e>7)throw new I("generation-failed","The QR encoder returned an invalid mask.");return e}function et(t,e=1){if(e!==Ee.profileVersion)throw new Q("QR profile",e);let a;try{a=To.default.create(t,{errorCorrectionLevel:Ee.errorCorrection})}catch(n){throw n instanceof Error&&n.message.includes("too big")?new ve:new I("generation-failed","The QR encoder could not create a symbol.")}let o=Hr(a);return{cells:Vr(a),errorCorrection:Ee.errorCorrection,maskPattern:o,profileVersion:Ee.profileVersion,size:a.modules.size,symbolVersion:a.version}}function Nr(t,e){return t.endsWith(e)?t.length===e.length||t[t.length-e.length-1]===".":!1}function Wr(t,e){let a=t.length-e.length-2,o=t.lastIndexOf(".",a);return o===-1?t:t.slice(o+1)}function Wt(t,e,a){if(a.validHosts!==null){let n=a.validHosts;for(let r of n)if(Nr(e,r))return r}let o=0;if(e.startsWith("."))for(;o<e.length&&e[o]===".";)o+=1;return t.length===e.length-o?null:Wr(e,t)}function Yt(t,e){return t.slice(0,-e.length-1)}var Qt=/[\t\n\r]/g,tt=!1;function Ao(t){return t>=97&&t<=122||t>=48&&t<=57||t>127||t>=65&&t<=90||t===45||t===95}function Eo(t,e,a){let o=a-e,n=t.charCodeAt(e)|32;if(o===2)return n===119&&(t.charCodeAt(e+1)|32)===115?1:0;if(o===3){let r=t.charCodeAt(e+1)|32,i=t.charCodeAt(e+2)|32;return n===119&&r===115&&i===115||n===102&&r===116&&i===112?1:0}else if(o===4){let r=t.charCodeAt(e+1)|32,i=t.charCodeAt(e+2)|32,s=t.charCodeAt(e+3)|32;return n===104&&r===116&&i===116&&s===112?1:n===102&&r===105&&i===108&&s===101?2:0}else if(o===5)return n===104&&(t.charCodeAt(e+1)|32)===116&&(t.charCodeAt(e+2)|32)===116&&(t.charCodeAt(e+3)|32)===112&&(t.charCodeAt(e+4)|32)===115?1:0;return 0}function le(t,e,a=!1){let o=0,n=t.length,r=!1,i=!1;if(tt=!1,!e){if(t.startsWith("data:"))return null;for(;o<t.length&&t.charCodeAt(o)<=32;)o+=1;for(;n>o+1&&t.charCodeAt(n-1)<=32;)n-=1;if(t.charCodeAt(o)===47&&t.charCodeAt(o+1)===47)o+=2;else{let b=t.indexOf(":/",o);if(b!==-1){let y=Eo(t,o,b);if(y===1)for(i=!0,o=b+2;t.charCodeAt(o)===47||t.charCodeAt(o)===92;)o+=1;else if(y===2){i=!0,o=b+1;let v=0;for(;(t.charCodeAt(o)===47||t.charCodeAt(o)===92)&&v<2;)o+=1,v+=1;if(v<2)return null}else{for(let v=o;v<b;v+=1){let k=t.charCodeAt(v)|32;if(!(k>=97&&k<=122||k>=48&&k<=57||k===46||k===45||k===43)){let w=t.charCodeAt(v);return w===9||w===10||w===13?le(t.replace(Qt,""),e,a):null}}if(t.charCodeAt(b+2)===47)o=b+3;else return null}}else if(t.charCodeAt(o)!==91){let y=-1;for(let v=o;v<n;v+=1){let k=t.charCodeAt(v);if(k===9||k===10||k===13)return le(t.replace(Qt,""),e,a);if(k===58){y=v;break}if(k===47||k===92||k===63||k===35)break}if(y!==-1){let v=!1;for(let k=y+1;k<n;k+=1){let w=t.charCodeAt(k);if(w===47||w===92||w===63||w===35)break;if(w===64){v=!0;break}}if(!v){let k=!0,w=y+1;for(;w<n;w+=1){let z=t.charCodeAt(w);if(z===47||z===92||z===63||z===35)break;if(z<48||z>57){k=!1;break}}if(w===y+1&&(k=!1),!k){let z=Eo(t,o,y);if(z===0){let S=!1;for(let A=y+1;A<n;A+=1){let j=t.charCodeAt(A);if(j===47||j===92||j===63||j===35)break;if(j===58){S=!0;break}}if(!S)return null}else if(i=!0,o=y+1,z===2){let S=0;for(;(t.charCodeAt(o)===47||t.charCodeAt(o)===92)&&S<2;)o+=1,S+=1;if(S<2)return null}else for(;t.charCodeAt(o)===47||t.charCodeAt(o)===92;)o+=1}}}}}let l=-1,u=-1,c=-1,d=-1,m=!1,f=a,p=o-1,g=-1;if(a&&o<n){let b=t.charCodeAt(o);(!(Ao(b)||b===46||b===95)||b===45)&&(f=!1)}for(let b=o;b<n;b+=1){let y=t.charCodeAt(b);if(y<64)if(y===47||y===35||y===63){n=b;break}else y===58?(d===-1&&(d=b),c=b):y===9||y===10||y===13?m=!0:a&&(y===46?((b-p>64||g===46||g===45)&&(f=!1),p=b):(y<48||y>57)&&(y!==45||g===46)&&(f=!1));else if(i&&y===92){n=b;break}else y===64?(l=b,d=-1):y===93?u=b:y>=65&&y<=90?r=!0:a&&!Ao(y)&&(f=!1);a&&(g=y)}if(m)return le(t.replace(Qt,""),e,a);if(l!==-1&&l>=o&&l<n&&(o=l+1),t.charCodeAt(o)===91)return u!==-1?t.slice(o+1,u).toLowerCase():null;if(c!==-1&&c>o&&c<n&&d===c&&(n=c),o>=n)return null;a&&f&&l===-1&&c===-1&&u===-1&&t.charCodeAt(n-1)!==46&&n-o<=255&&n-p-1<=63&&g!==45&&(tt=!0)}for(;n>o+1&&t.charCodeAt(n-1)===46;)n-=1;let s=o!==0||n!==t.length?t.slice(o,n):t;return r?s.toLowerCase():s}function Yr(t){if(t.length<7||t.length>15)return!1;let e=0;for(let a=0;a<t.length;a+=1){let o=t.charCodeAt(a);if(o===46)e+=1;else if(o<48||o>57)return!1}return e===3&&t.charCodeAt(0)!==46&&t.charCodeAt(t.length-1)!==46}function Qr(t){if(t.length<3)return!1;let e=t.startsWith("[")?1:0,a=t.length;if(t[a-1]==="]"&&(a-=1),a-e>39)return!1;let o=!1;for(;e<a;e+=1){let n=t.charCodeAt(e);if(n===58)o=!0;else if(!(n>=48&&n<=57||n>=97&&n<=102||n>=65&&n<=70))return!1}return o}function Xt(t){return Qr(t)||Yr(t)}var Xr=["test","localhost","invalid","example","example.com","example.net","example.org","local","onion","alt","home.arpa","ipv4only.arpa","resolver.arpa","service.arpa","6tisch.arpa","eap.arpa"];function Zt(t){for(let e of Xr)if(t.endsWith(e)&&(t.length===e.length||t.charCodeAt(t.length-e.length-1)===46))return!0;return!1}function Io(t){return t>=97&&t<=122||t>=48&&t<=57||t>127}function $t(t){if(t.length>255||t.length===0||!Io(t.charCodeAt(0))&&t.charCodeAt(0)!==46&&t.charCodeAt(0)!==95)return!1;let e=-1,a=-1,o=t.length;for(let n=0;n<o;n+=1){let r=t.charCodeAt(n);if(r===46){if(n-e>64||a===46||a===45)return!1;e=n}else if(!(Io(r)||r===45||r===95)||r===45&&a===46)return!1;a=r}return o-e-1<=63&&a!==45}function jo({allowIcannDomains:t=!0,allowPrivateDomains:e=!1,detectIp:a=!0,detectSpecialUse:o=!1,extractHostname:n=!0,mixedInputs:r=!0,validHosts:i=null,validateHostname:s=!0}){return{allowIcannDomains:t,allowPrivateDomains:e,detectIp:a,detectSpecialUse:o,extractHostname:n,mixedInputs:r,validHosts:i,validateHostname:s}}var Zr=jo({});function Kt(t){return t===void 0?Zr:jo(t)}function Jt(t,e){return e.length===t.length?"":t.slice(0,-e.length-1)}function ea(){return{domain:null,domainWithoutSuffix:null,hostname:null,isIcann:null,isIp:null,isPrivate:null,isSpecialUse:null,publicSuffix:null,subdomain:null}}function ta(t){t.domain=null,t.domainWithoutSuffix=null,t.hostname=null,t.isIcann=null,t.isIp=null,t.isPrivate=null,t.isSpecialUse=null,t.publicSuffix=null,t.subdomain=null}function aa(t,e,a,o,n){let r=Kt(o);if(typeof t!="string")return n;let i=!1;return r.extractHostname?r.mixedInputs?(i=$t(t),n.hostname=le(t,i,r.validateHostname)):n.hostname=le(t,!1,r.validateHostname):n.hostname=t,r.detectIp&&n.hostname!==null&&(n.isIp=Xt(n.hostname),n.isIp)?n:r.validateHostname&&r.extractHostname&&n.hostname!==null&&!(i&&n.hostname===t)&&!tt&&!$t(n.hostname)?(n.hostname=null,n):(e===0||n.hostname===null||(e===5&&r.detectSpecialUse&&(n.isSpecialUse=Zt(n.hostname)),a(n.hostname,r,n),e===2||n.publicSuffix===null)||(n.domain=Wt(n.publicSuffix,n.hostname,r),e===3||n.domain===null)||(n.subdomain=Jt(n.hostname,n.domain),e===4)||(n.domainWithoutSuffix=Yt(n.domain,n.publicSuffix)),n)}function oa(t,e,a){if(!e.allowPrivateDomains&&t.length>3){let o=t.length-1,n=t.charCodeAt(o),r=t.charCodeAt(o-1),i=t.charCodeAt(o-2),s=t.charCodeAt(o-3);if(n===109&&r===111&&i===99&&s===46)return a.isIcann=!0,a.isPrivate=!1,a.publicSuffix="com",!0;if(n===103&&r===114&&i===111&&s===46)return a.isIcann=!0,a.isPrivate=!1,a.publicSuffix="org",!0;if(n===117&&r===100&&i===101&&s===46)return a.isIcann=!0,a.isPrivate=!1,a.publicSuffix="edu",!0;if(n===118&&r===111&&i===103&&s===46)return a.isIcann=!0,a.isPrivate=!1,a.publicSuffix="gov",!0;if(n===116&&r===101&&i===110&&s===46)return a.isIcann=!0,a.isPrivate=!1,a.publicSuffix="net",!0;if(n===101&&r===100&&i===46)return a.isIcann=!0,a.isPrivate=!1,a.publicSuffix="de",!0}return!1}var ee=new Uint8Array([1,2,1,1,1,1,1,1,1,1,1,1,0,2,2,2,0,2,2,0,2,0,0,1,0,0,2,1,1,1,1,1,1,0,0,0,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,0,0,0,0,0,0,1,1,1,0,2,0,0,0,0,0,0,0,2,0,2,2,0,0,2,2,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,2,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,2,2,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,1,0,2,2,0,0,0,2,0,1,1,0,2,0,2,2,0,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,0,0,0,0,1,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,0,2,2,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,2,0,2,2,2,2,0,0,0,0,2,0,0,0,0,0,0,0,2,2,0,0,0,2,2,1,1,1,1,2,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,2,2,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,2,1,2,1,1,1,2,1,1,1,1,1,0,1,1,1,1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,0,0,0,0]),Ie=new Uint16Array([0,0,0,10,11,18,106,111,117,124,130,136,145,146,147,148,149,150,151,153,154,155,157,159,225,238,240,241,242,257,264,265,268,269,270,273,275,294,295,297,306,311,328,329,332,334,335,337,371,372,374,377,378,382,384,388,391,423,426,439,440,448,449,451,461,475,476,477,486,487,524,529,545,565,571,612,613,640,667,668,816,822,825,826,827,832,837,846,868,869,870,871,872,873,874,892,894,895,898,900,901,903,905,920,935,940,941,943,944,945,946,947,949,952,957,958,959,961,962,965,968,969,970,983,985,997,1008,1016,1018,1059,1062,1066,1067,1069,1072,1083,1085,1095,1097,1103,1105,1106,1108,1111,1112,1113,1165,1167,1169,1189,1190,1191,1192,1194,1205,1236,1247,1259,1268,1275,1280,1293,1304,1317,1318,1329,1363,1364,1365,1380,1395,1467,1468,1470,1471,1505,1506,1507,1508,1511,1515,1517,1546,1547,1555,1556,1557,1559,1561,1562,1564,1565,1566,1577,1578,1579,1580,1581,1582,1583,1584,1585,1586,1587,1588,1589,1590,1592,1593,1594,1596,2051,2054,2055,2057,2064,2071,2081,2085,2096,2097,2098,2110,2111,2113,2115,2116,2123,2124,2126,2127,2129,2130,2131,2132,2133,2207,2209,2230,2231,2232,2234,2260,2261,2312,2313,2315,2322,2328,2338,2348,2401,2402,2403,2413,2427,2428,2431,2438,2439,2447,2448,2449,2450,2451,2462,2463,2464,2466,2467,2468,2470,2480,2492,2498,2530,2534,2536,2537,2539,2540,2551,2552,2554,2562,2569,2575,2580,2581,2587,2590,2596,2603,2604,2611,2619,2620,2621,2659,2665,2680,2681,2686,2704,2735,2753,2755,2758,2766,2768,2775,2827,2851,2852,2853,2854,2855,2856,2857,2864,2865,2866,2867,2868,2869,2871,2872,2876,2956,2969,2970,3407,3411,3425,3477,3505,3527,3585,3607,3622,3685,3736,3774,3810,3835,3977,4023,4074,4093,4127,4142,4162,4192,4223,4246,4277,4307,4339,4366,4441,4463,4501,4511,4545,4564,4590,4632,4682,4708,4777,4778,4780,4803,4826,4862,4893,4910,4967,4980,5004,5033,5035,5069,5085,5113,5418,5427,5436,5443,5460,5464,5470,5509,5511,5518,5525,5534,5541,5542,5553,5556,5571,5572,5581,5582,5591,5600,5606,5608,5609,5610,5646,5647,5649,5657,5664,5677,5681,5683,5684,5690,5697,5711,5721,5726,5734,5742,5748,5749,5753,5755,5756,5768,5769,5770,5771,5773,5774,5777,5779,5782,5786,5787,5788,5794,5795,5796,5798,5800,5802,5803,5804,5807,5809,5812,5813,5815,6013,6020,6021,6031,6036,6053,6067,6076,6077,6078,6082,6083,6085,6087,6093,6094,6097,6098,6100,6101,6102,7002,7004,7008,7026,7035,7038,7045,7046,7048,7049,7050,7052,7104,7105,7108,7109,7226,7227,7238,7249,7256,7259,7268,7269,7270,7285,7340,7531,7533,7534,7536,7541,7554,7569,7576,7585,7588,7591,7598,7606,7610,7611,7612,7626,7630,7639,7640,7641,7645,7680,7681,7698,7705,7713,7714,7719,7727,7771,7772,7778,7781,7792,7797,7798,7801,7803,7838,7839,7845,7852,7853,7862,7871,7886,7890,7942,7943,7948,7950,7953,7955,7956,7957,7966,7980,7988,8002,8014,8015,8017,8019,8041,8052,8058,8059,8071,8083,8170,8182,8190,8193,8199,8224,8227,8228,8229,8231,8234,8237,8248,8250,8252,8280,8354,8361,8365,8366,8375,8397,8398,8403,8404,8483,8485,8487,8496,8500,8506,8512,8518,8528,8533,8534,8552,8563,8568,8573,8583,8589,8593,8599,8605,10214,10215,10216,10223,10225]),je=new Uint8Array([3,3,3,3,3,3,3,3,5,8,8,2,2,3,3,3,3,3,8,5,5,5,5,5,3,3,5,5,9,12,19,8,19,8,11,9,9,8,7,7,6,8,9,16,10,7,7,11,8,6,6,9,7,11,7,14,4,4,4,4,4,4,10,7,6,6,6,6,10,10,6,10,10,22,11,9,10,10,10,9,10,8,7,7,7,8,21,13,11,11,9,10,9,13,10,8,8,9,12,9,7,10,7,7,13,7,3,3,3,3,3,2,3,3,3,3,3,3,3,3,3,3,8,6,3,3,3,3,3,3,2,5,3,3,3,7,2,2,2,2,2,2,3,3,3,1,1,7,8,5,2,2,7,2,2,1,4,1,11,9,9,5,5,8,5,5,5,5,5,5,5,3,3,3,3,3,5,11,9,9,13,7,14,7,6,6,6,7,6,6,6,6,6,10,7,11,9,4,4,4,4,4,6,6,6,6,6,8,7,10,9,9,9,8,9,8,7,10,6,9,8,10,10,7,8,1,9,10,12,12,12,10,9,9,10,10,9,9,1,1,5,3,3,3,3,3,3,3,3,3,3,3,3,6,6,6,4,3,3,3,7,4,4,4,3,3,6,7,3,4,1,2,2,2,6,1,2,2,2,2,2,12,5,3,8,9,13,4,4,13,9,9,11,7,3,12,9,2,2,2,3,3,3,3,3,8,2,2,3,3,3,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,4,3,7,10,15,7,15,15,20,15,9,10,10,12,14,14,14,12,12,12,12,12,14,14,10,10,10,10,14,9,9,9,10,14,14,14,13,13,9,9,9,9,9,9,7,8,6,8,8,6,8,13,8,8,6,13,8,11,13,8,6,13,8,6,9,10,10,12,14,14,14,12,12,12,12,14,14,10,10,10,10,9,9,9,10,14,14,11,13,13,9,9,9,9,9,9,2,6,9,2,2,3,3,3,3,3,3,3,3,3,4,4,4,2,3,3,3,3,3,3,7,7,2,3,2,2,5,3,3,3,3,3,3,4,2,2,2,2,2,2,3,3,3,3,3,3,3,4,5,7,2,2,12,8,10,8,10,7,18,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,2,2,3,3,3,5,5,3,8,8,6,8,6,6,4,6,7,7,7,10,11,2,5,5,3,3,3,3,3,3,5,5,6,11,10,7,7,7,4,4,4,2,3,3,3,3,3,2,7,5,5,3,3,3,3,3,3,3,3,7,7,7,11,7,6,9,6,6,8,10,8,6,8,13,4,4,4,4,4,10,8,11,8,8,8,10,10,7,10,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,5,5,5,5,5,5,5,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,7,10,13,7,8,7,11,8,8,6,9,8,8,6,6,6,8,8,6,6,6,6,6,9,7,6,4,4,4,4,4,4,4,6,6,6,9,7,8,10,8,8,2,3,3,3,3,3,2,8,9,9,2,2,2,3,3,3,2,3,3,3,9,2,2,3,3,3,3,3,3,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,12,5,5,3,5,4,2,3,2,4,3,9,2,2,2,2,2,5,5,3,8,8,13,6,10,9,4,7,9,11,2,3,7,3,3,4,1,3,4,2,9,3,3,12,5,3,7,10,10,7,4,4,6,14,7,9,7,13,2,2,2,2,2,2,3,3,3,3,3,8,15,4,4,2,3,3,3,7,4,9,9,2,3,3,3,5,3,2,2,7,2,7,6,6,7,2,4,2,2,2,2,2,2,8,8,8,9,5,2,3,3,3,3,3,3,10,7,4,4,4,4,3,4,2,3,3,3,3,3,10,7,4,4,4,4,2,3,3,3,3,10,7,4,4,4,4,3,9,6,6,6,9,13,9,2,2,2,8,7,9,5,3,3,3,5,5,13,12,9,10,7,8,7,6,8,6,11,12,7,9,10,4,4,7,8,11,6,7,9,8,7,10,8,9,15,7,8,5,4,7,2,3,3,3,2,14,10,2,14,10,2,14,3,9,13,13,10,14,16,17,11,2,14,2,14,3,9,13,10,14,16,17,11,14,10,14,2,7,3,10,7,14,10,2,14,10,9,9,17,6,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,10,10,10,12,9,4,10,11,8,8,8,7,9,5,3,3,3,3,3,3,3,3,5,8,4,4,4,4,4,4,6,16,3,3,14,3,14,2,14,9,13,10,10,14,16,17,11,6,9,10,10,12,14,14,14,12,12,12,12,14,14,10,10,10,10,14,9,9,9,10,14,14,14,9,9,9,9,9,9,2,14,9,13,10,10,14,16,17,11,6,2,14,9,17,13,10,10,14,16,17,11,6,2,14,9,13,10,14,16,17,11,2,14,9,13,10,16,11,2,14,10,19,7,2,14,9,13,10,19,10,7,14,16,17,11,6,2,14,9,13,10,19,7,14,16,17,11,2,14,9,13,17,13,10,10,14,16,17,11,6,3,2,14,9,13,10,10,14,16,17,11,6,9,10,12,14,14,14,12,12,12,12,12,14,14,14,10,10,10,14,9,9,9,9,14,14,14,13,13,14,9,9,9,9,9,9,4,11,2,14,9,13,17,13,10,19,10,7,14,16,17,11,6,2,14,9,13,17,13,10,19,10,7,14,16,17,11,6,2,9,10,10,7,17,3,3,12,12,16,15,15,12,14,14,14,20,20,13,12,12,12,12,12,12,20,25,14,14,12,12,10,10,10,10,9,9,9,25,4,9,17,10,7,14,16,21,13,13,14,20,14,13,17,24,9,12,13,25,13,21,20,17,9,9,9,9,9,9,12,17,4,4,9,9,9,10,10,12,14,14,14,12,12,12,12,12,14,14,10,10,10,10,14,9,9,9,10,14,14,14,13,13,9,9,9,9,9,9,1,5,8,7,11,11,1,3,3,3,4,8,9,10,14,14,12,12,12,12,14,14,10,10,10,10,14,9,9,9,10,14,14,14,13,13,9,9,9,9,9,7,4,4,4,4,4,4,4,4,4,4,9,12,6,14,4,12,7,2,2,1,2,7,6,4,4,4,6,8,8,7,4,5,6,3,3,3,3,4,16,8,5,4,3,3,3,5,2,2,8,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,11,12,7,7,13,9,10,17,12,8,9,7,8,5,12,10,13,14,5,5,5,13,5,5,5,3,3,3,5,16,5,5,5,5,5,7,12,14,8,12,8,10,12,9,11,7,9,7,10,7,13,9,7,12,8,17,7,7,16,10,13,13,8,10,10,14,17,7,16,16,15,8,10,10,12,17,17,7,17,14,7,10,17,8,7,7,7,8,15,15,7,14,10,10,10,11,11,7,7,13,8,10,7,16,7,8,7,14,17,12,10,11,21,8,9,7,13,9,8,13,6,12,7,6,13,10,10,10,8,18,9,17,13,10,12,6,13,6,11,8,13,10,13,18,13,11,13,8,16,7,10,8,16,12,10,8,8,14,11,8,15,8,8,7,7,12,7,8,9,14,15,8,9,10,9,15,7,8,8,12,13,9,10,15,15,13,7,10,10,20,7,6,9,6,6,14,11,14,11,12,9,10,16,16,12,7,11,28,8,11,10,7,21,8,7,9,4,4,4,17,7,8,6,9,6,6,13,6,6,6,6,18,20,14,8,11,12,9,10,13,15,19,8,9,12,7,10,16,12,9,9,9,14,12,11,9,12,11,18,9,9,9,10,7,7,16,8,9,7,13,12,10,18,7,8,11,7,7,8,8,13,7,7,7,11,15,13,11,7,8,15,11,7,8,18,14,13,18,15,10,12,12,9,7,11,11,8,7,10,8,14,12,10,18,7,10,9,7,8,13,10,14,10,8,8,23,7,7,11,12,12,17,7,7,11,11,17,16,16,7,8,11,14,14,8,10,7,7,16,16,13,9,11,9,15,15,11,11,7,7,14,7,9,7,7,16,10,13,10,11,14,7,11,10,11,7,11,10,11,15,11,15,10,12,17,10,14,13,11,11,12,13,10,7,13,10,16,12,21,9,10,10,7,11,14,17,7,7,8,11,12,8,15,14,14,8,17,12,10,10,7,9,11,7,10,7,11,18,7,11,7,12,11,8,8,14,12,7,8,15,3,7,7,5,2,9,2,2,2,2,2,2,2,3,3,3,3,3,3,3,2,5,3,3,3,3,3,3,4,4,3,3,3,3,3,3,5,11,6,4,7,10,7,7,11,1,10,2,2,3,3,3,3,3,3,3,3,5,7,3,5,6,3,3,5,2,2,5,3,4,13,11,3,3,6,3,5,14,2,2,3,8,2,2,12,5,18,5,3,3,3,16,5,5,5,10,7,13,12,13,9,12,14,19,9,9,21,9,9,10,6,9,6,15,10,6,12,8,6,10,15,4,4,6,6,9,9,12,16,14,23,7,7,7,14,9,7,7,11,14,10,7,10,10,10,12,6,11,10,13,11,15,11,7,12,10,3,7,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,4,3,7,2,5,5,3,3,5,5,5,5,7,6,6,6,4,4,4,4,4,4,6,6,6,6,6,7,10,2,2,2,5,5,5,5,3,3,3,3,3,5,5,10,9,11,8,7,12,8,9,7,6,13,11,6,13,7,9,9,4,4,4,4,4,6,10,7,8,13,8,8,9,14,7,8,10,7,7,7,9,6,9,7,2,12,5,3,3,13,4,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,3,3,3,3,3,3,3,3,4,5,5,5,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,8,4,4,4,4,4,4,4,4,4,4,4,4,9,3,3,3,3,3,3,3,3,3,3,4,2,2,2,5,3,3,3,3,3,3,3,3,4,4,1,7,6,4,12,3,3,3,3,3,8,7,3,3,3,3,3,3,4,4,11,14,2,8,3,5,5,8,10,8,6,4,7,17,7,4,5,2,6,3,2,4,4,2,12,5,5,3,15,13,10,8,11,2,2,3,3,3,3,3,3,3,3,4,4,5,3,3,3,3,4,18,2,12,5,3,3,3,3,3,5,16,8,8,9,6,6,4,4,4,4,31,6,6,10,11,21,10,9,7,10,7,7,2,4,4,4,4,6,5,3,3,4,3,3,3,3,3,3,3,3,3,6,6,6,2,2,2,5,3,3,3,7,7,4,3,3,3,3,3,3,3,3,3,3,3,3,3,2,3,3,3,3,8,2,3,3,3,3,3,5,9,11,3,3,3,3,4,4,3,3,3,3,3,5,10,9,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,11,10,10,10,10,10,11,10,11,10,11,10,9,9,11,3,3,3,3,3,3,5,3,7,8,8,7,6,6,11,4,4,4,7,8,9,9,2,3,7,4,4,2,5,5,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,2,2,5,5,5,5,5,3,3,5,5,5,7,7,6,6,6,4,4,4,4,4,4,4,4,4,4,6,6,8,8,1,2,2,2,2,2,2,3,3,3,3,3,3,3,4,4,6,9,12,3,7,10,7,2,2,3,3,3,3,3,4,3,3,2,2,2,2,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,5,5,8,8,6,6,8,6,7,4,4,4,4,4,4,6,7,5,5,20,19,8,10,9,7,10,6,8,11,6,6,6,6,13,12,8,6,7,14,11,9,2,5,3,6,2,3,2,2,2,2,2,2,2,5,4,3,7,6,4,7,4,3,6,4,7,2,7,7,7,5,5,5,5,3,3,3,3,3,3,3,3,3,5,9,10,10,11,7,8,20,7,8,9,8,12,6,6,6,8,9,8,12,6,6,8,13,10,12,6,6,7,7,9,6,4,4,4,4,4,4,10,6,6,6,7,14,11,10,7,8,10,8,11,14,11,11,9,7,9,8,11,9,17,10,9,2,2,2,9,3,3,3,3,15,14,9,5,5,2,8,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,15,12,22,19,17,18,18,19,21,7,16,16,5,5,5,5,5,5,5,5,5,5,5,7,5,5,5,5,5,5,5,5,5,5,5,9,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,5,7,16,11,11,7,7,7,7,17,7,8,12,15,9,19,7,19,8,21,11,12,19,14,22,7,7,7,7,7,7,7,7,7,7,7,16,16,19,24,12,7,14,7,12,7,8,10,10,13,7,12,12,7,7,10,18,15,12,16,7,14,12,17,10,16,17,12,17,25,7,7,7,13,6,9,6,9,18,6,6,11,20,10,6,6,6,6,6,6,17,6,6,6,15,6,6,6,6,6,8,14,11,12,11,15,13,19,17,21,7,18,8,13,13,8,12,8,6,6,13,6,15,15,16,6,6,16,6,6,6,14,6,18,6,6,6,17,18,9,13,15,8,19,8,15,15,18,14,16,4,4,4,4,4,4,4,4,4,4,4,4,6,11,10,11,6,21,23,12,17,12,11,14,13,22,15,15,11,12,14,12,7,12,8,12,14,12,18,10,8,16,19,17,12,14,15,8,19,17,12,13,13,15,18,13,23,24,23,21,17,24,8,21,8,14,14,16,20,14,8,8,15,20,8,19,21,9,8,13,12,13,15,11,8,11,9,9,8,11,8,21,14,21,15,15,13,7,19,7,7,7,7,7,7,16,12,17,18,7,7,11,11,7,9,9,2,2,3,3,2,2,2,3,3,3,3,3,3,3,3,3,3,4,5,5,5,5,5,5,5,5,3,3,10,10,7,9,7,7,7,6,8,6,6,6,6,6,6,6,7,6,8,6,6,9,7,7,7,4,4,4,4,4,4,4,4,8,9,8,7,8,7,8,10,7,5,5,5,5,5,5,3,9,7,7,8,6,6,6,6,6,6,6,6,9,6,6,9,11,13,7,8,9,9,5,5,5,7,8,6,6,6,6,6,6,6,7,8,9,7,10,9,10,7,8,5,5,5,5,5,5,7,7,9,8,7,7,6,6,6,6,6,6,10,6,6,6,6,6,6,6,6,6,6,6,9,10,4,4,4,4,8,7,7,10,10,9,8,8,15,9,8,8,8,8,8,9,10,9,10,7,8,13,5,5,5,5,5,3,3,7,7,8,6,6,6,4,4,11,9,7,8,9,10,7,5,5,5,5,5,3,3,7,6,6,13,7,9,8,7,5,5,5,5,5,5,5,5,3,3,3,3,7,8,7,8,13,6,6,6,6,6,6,6,6,6,6,6,6,6,6,8,8,6,6,6,6,7,6,7,6,6,9,7,4,4,4,4,4,4,4,7,8,7,8,9,8,8,8,7,10,7,8,5,5,5,5,5,5,5,5,3,7,7,7,7,9,7,10,9,6,6,6,6,6,8,8,6,6,6,7,6,6,6,9,9,4,4,13,7,10,9,9,12,7,8,8,10,8,8,8,8,8,8,5,5,5,5,3,7,7,11,7,9,8,8,6,6,10,6,8,8,8,6,7,6,6,12,4,4,4,4,4,4,4,4,4,9,8,8,16,8,9,8,7,5,5,5,5,5,3,3,7,7,7,10,15,8,9,8,9,9,6,6,6,6,6,6,7,4,8,7,8,8,7,8,11,8,5,5,5,5,5,3,7,7,6,11,16,7,6,4,4,4,4,9,9,8,8,8,13,12,8,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,11,7,8,8,9,13,7,7,7,9,8,8,9,12,7,12,7,12,8,7,10,12,9,9,6,6,8,8,6,6,6,6,6,6,6,9,8,9,11,8,6,6,6,6,6,12,7,6,6,6,9,7,7,6,6,6,6,6,11,9,6,6,6,6,6,7,9,4,4,4,4,4,4,4,4,9,9,9,9,7,7,7,7,7,11,7,7,8,8,8,8,8,8,9,8,9,9,7,7,11,11,7,12,8,8,8,8,8,7,8,8,8,8,8,13,12,8,8,8,8,7,7,7,9,5,5,5,5,5,5,5,3,3,7,7,11,7,8,8,8,6,6,6,6,6,6,6,6,6,6,6,10,11,6,7,9,4,4,4,4,4,4,9,9,8,9,8,8,8,7,7,5,5,5,5,5,5,5,5,5,5,3,3,11,7,7,7,9,6,6,11,8,10,6,6,6,12,8,8,7,6,6,8,7,4,4,4,4,4,4,4,4,9,10,9,9,8,10,9,11,8,5,5,5,7,6,6,8,7,4,4,4,4,8,7,7,8,7,8,8,5,5,5,5,7,7,8,8,8,6,6,6,6,6,10,8,9,13,6,7,6,6,8,7,8,4,4,4,4,11,8,8,8,10,5,5,8,7,8,13,8,7,6,8,6,9,7,8,7,5,5,5,5,5,5,3,3,7,8,9,6,4,8,10,10,8,12,9,13,2,7,5,5,5,5,5,7,7,10,6,6,6,6,6,6,6,8,4,4,9,8,8,8,14,8,8,8,9,8,5,5,5,5,5,3,3,9,6,6,6,6,10,12,6,6,6,6,6,6,6,4,4,4,4,11,8,7,8,8,8,5,5,3,3,3,3,7,7,6,8,6,8,11,7,6,6,6,7,4,8,11,9,10,5,5,5,3,3,3,7,7,8,9,8,15,9,6,6,6,6,6,6,11,11,4,4,4,4,4,7,9,9,10,8,7,5,5,5,5,5,5,3,3,8,6,6,6,6,6,6,6,6,6,9,7,4,4,4,4,4,9,9,8,8,10,13,5,5,5,3,17,7,7,7,7,7,8,6,8,13,6,6,6,6,6,6,6,6,4,4,4,9,10,8,8,8,5,5,5,5,3,7,7,7,8,8,6,6,6,8,8,8,9,10,8,4,8,10,9,8,8,8,9,13,10,5,5,5,5,5,5,5,5,5,5,3,3,7,8,9,9,7,7,7,10,9,9,8,9,8,8,8,6,6,6,6,6,6,6,6,6,6,6,6,6,8,12,6,6,6,6,6,6,6,6,6,12,4,4,4,4,4,4,4,4,4,4,4,11,8,8,9,9,10,8,9,7,7,5,5,5,5,5,5,3,7,8,7,6,6,8,6,6,10,4,7,8,9,12,8,7,7,5,5,5,5,5,5,3,3,7,14,7,9,8,8,6,6,8,12,12,6,6,7,7,10,4,4,4,4,4,9,9,14,9,13,8,7,5,5,5,6,6,6,7,4,8,7,5,5,5,5,5,5,5,5,3,3,7,7,7,8,6,6,6,6,6,6,12,6,6,6,6,4,4,9,9,8,8,11,7,7,7,5,5,5,3,9,8,6,6,7,4,4,4,4,4,4,8,8,11,5,5,5,7,7,7,9,6,6,6,6,6,6,9,8,4,4,4,4,7,12,9,8,8,8,7,10,10,5,5,5,5,5,5,5,3,11,14,8,7,8,8,6,6,6,6,6,8,7,6,6,6,7,6,8,9,4,4,4,7,8,9,7,9,7,7,9,8,5,5,5,5,5,5,5,5,5,11,3,9,7,7,12,14,8,6,6,12,11,8,6,6,6,6,6,6,6,6,6,15,7,4,4,4,16,9,9,9,8,9,9,9,9,9,8,8,8,13,11,8,5,5,5,5,3,7,6,6,8,8,8,6,6,7,10,7,4,4,4,4,9,7,8,7,7,7,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,3,7,7,7,9,6,6,6,6,6,8,8,7,7,9,6,6,6,7,6,6,6,6,6,15,4,4,4,4,4,8,8,7,8,12,9,8,8,8,8,8,9,8,8,10,8,8,8,8,16,9,10,2,5,5,5,5,5,5,5,9,7,6,8,9,4,4,4,4,4,7,8,8,8,9,8,11,10,5,5,5,5,3,7,8,6,6,6,6,6,8,6,6,6,6,4,12,10,12,7,7,7,7,7,7,7,5,5,5,5,3,3,7,7,10,8,9,7,6,10,7,6,6,4,4,8,9,7,9,9,9,9,8,8,8,8,10,5,5,5,5,5,5,8,7,6,6,6,10,6,7,10,7,4,4,4,4,4,4,4,12,9,10,7,7,10,8,10,5,12,9,6,6,6,6,6,7,6,4,4,4,10,9,9,8,7,7,5,5,5,5,5,5,3,3,13,7,7,9,7,7,7,8,9,9,7,8,6,6,6,6,6,6,6,6,6,6,6,6,6,7,13,9,15,15,4,4,4,4,4,10,10,9,8,9,8,8,9,7,8,7,8,5,5,7,6,6,6,4,4,4,7,8,11,8,5,5,5,5,5,5,5,7,6,6,6,6,6,6,9,11,10,7,4,4,4,9,8,8,5,5,5,5,5,9,9,6,6,6,6,6,6,6,9,9,4,4,4,4,8,8,8,9,9,8,8,8,13,2,4,2,7,5,5,5,5,5,5,9,9,6,6,6,6,10,8,8,8,6,6,6,4,4,9,8,10,8,9,8,8,8,9,8,8,5,3,3,3,11,6,6,6,7,6,6,6,4,4,9,8,5,5,5,5,5,3,11,8,6,6,6,6,6,9,7,4,4,14,10,9,8,12,8,8,8,11,15,8,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,11,11,11,10,10,7,7,3,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,5,5,5,5,5,5,5,5,5,5,3,3,3,7,11,7,7,11,11,7,8,9,10,7,7,9,9,9,9,7,7,10,8,13,8,8,8,8,11,10,6,6,8,10,11,14,14,6,6,6,6,6,6,9,11,7,7,6,8,12,11,11,6,6,10,6,6,6,6,6,10,7,7,6,6,11,6,6,6,11,8,9,7,6,10,11,9,10,11,7,11,8,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,8,6,6,8,9,10,9,6,6,6,10,6,6,6,6,11,10,11,10,9,8,7,7,7,7,11,14,8,10,9,9,8,8,7,11,8,8,8,11,11,10,10,9,10,8,11,10,8,11,9,12,8,10,8,11,8,9,9,11,11,10,11,13,8,7,8,8,9,7,8,8,8,8,7,8,2,2,2,2,2,2,2,4,4,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,4,2,3,3,3,3,3,3,3,3,8,6,4,4,4,11,7,11,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5,5,5,5,3,3,3,3,8,7,7,8,8,4,8,7,7,7,9,7,8,9,8,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,6,3,3,3,3,3,3,3,3,4,2,2,3,3,3,3,3,4,5,5,3,8,8,6,9,4,4,10,7,3,3,3,2,5,3,3,3,3,3,3,3,3,3,3,3,3,4,3,2,2,2,3,3,3,3,3,4,10,2,3,3,3,3,3,3,3,4,2,3,3,3,3,3,3,3,3,2,2,3,3,3,5,2,4,2,6,2,2,9,5,5,3,3,3,3,3,3,3,5,5,5,9,8,7,6,6,11,4,4,4,4,4,4,4,4,6,6,7,7,11,8,8,6,5,11,2,3,3,3,3,3,3,3,3,3,3,3,3,3,4,2,2,3,3,3,3,3,3,6,4,4,4,4,3,3,3,3,5,7,2,3,3,3,3,3,8,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,6,4,4,4,4,2,2,3,3,3,3,3,3,3,4,3,3,3,3,3,3,3,3,3,3,3,3,4,2,2,3,3,3,3,3,3,2,3,3,3,3,3,6,3,3,8,10,3,4,4,1,1,1,1,1,1,1,8,9,10,7,7,1,1,3,8,7,7,8,8,8,1,6,1,1,6,3,3,4,7,3,3,5,5,4,4,4,4,4,2,7,7,8,12,3,4,5,1,3,4,4,10,4,3,3,3,8,7,7,2,2,2,2,2,2,2,2,2,12,9,20,7,5,5,5,9,13,5,5,5,5,5,3,3,3,16,5,5,5,13,7,8,8,11,8,7,9,7,11,12,9,9,8,8,11,10,14,7,12,10,11,13,7,9,11,17,17,14,13,7,8,7,10,10,7,16,13,7,8,17,12,9,8,6,7,10,6,6,12,6,8,10,8,8,8,6,8,6,14,6,6,6,13,6,10,6,6,7,14,8,6,6,10,11,10,9,9,7,7,6,6,6,9,9,7,9,10,9,13,12,4,4,4,4,4,4,4,4,4,4,6,6,6,8,8,6,8,9,10,9,7,10,10,8,7,8,7,10,12,9,8,15,8,7,8,8,7,7,15,13,7,10,9,14,18,16,7,24,7,8,10,11,16,8,14,7,9,9,9,13,19,14,15,14,11,7,13,9,10,7,13,9,10,11,12,8,9,2,3,5,8,7,4,4,10,5,3,3,3,3,3,5,4,4,4,2,2,2,2,2,1,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,2,2,2,3,3,3,3,3,3,3,3,3,3,4,2,12,5,3,8,10,15,6,7,2,3,2,5,5,12,2,5,5,5,5,2,2,5,5,12,9,5,2,2,9,5,5,12,12,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,9,12,5,8,8,9,5,5,5,8,19,7,16,15,14,9,9,9,9,7,11,11,11,7,14,10,10,5,5,5,5,5,5,5,5,5,15,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,9,9,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,14,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,15,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,5,5,5,5,5,5,5,12,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,9,9,12,9,9,12,12,12,15,7,11,7,14,11,18,13,8,18,15,18,12,14,12,8,8,8,8,9,9,9,12,7,10,10,8,8,12,12,12,7,12,12,9,7,7,7,7,7,8,15,12,9,10,10,7,10,10,13,11,10,9,22,11,9,8,8,8,8,8,13,18,13,9,15,19,9,7,7,10,7,7,7,11,8,13,17,7,7,10,10,10,7,20,16,7,7,7,7,7,7,11,21,12,12,13,11,14,16,8,8,13,11,7,7,13,7,7,14,15,15,6,6,6,6,6,6,6,6,6,6,13,10,18,6,6,6,6,6,6,6,6,6,11,8,8,12,12,11,11,8,12,9,9,9,13,13,9,9,9,9,9,9,6,10,12,6,6,6,6,17,11,7,7,7,7,14,14,12,6,7,7,6,6,15,10,13,10,6,8,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,13,9,9,15,13,6,12,12,6,19,11,10,7,7,16,8,19,17,9,9,9,9,9,6,6,6,10,8,16,8,6,6,9,6,6,6,6,6,6,6,6,8,8,8,6,7,6,6,6,6,6,6,6,6,6,6,6,14,6,6,6,6,20,6,9,6,14,9,9,9,6,9,8,8,12,9,8,8,8,8,7,8,12,7,8,8,8,6,8,6,6,6,6,6,6,6,9,8,8,6,6,13,9,12,13,12,14,13,12,11,11,6,8,8,8,6,13,12,11,11,12,6,11,12,11,13,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,15,6,6,6,6,6,6,6,13,6,6,6,6,6,6,6,6,6,6,6,6,6,8,8,8,8,6,18,6,12,13,13,13,9,10,15,9,12,6,6,6,6,6,6,6,6,9,15,10,9,10,13,9,19,8,18,17,10,10,8,8,6,6,6,6,6,6,10,14,8,16,16,9,8,15,8,8,10,12,14,7,7,8,8,7,7,7,7,8,13,13,11,9,9,9,12,10,17,8,11,9,7,7,14,8,14,14,7,7,7,7,7,7,14,7,7,7,7,7,10,10,8,14,7,7,7,7,8,8,8,8,8,17,9,7,15,7,8,12,7,9,14,7,7,7,9,13,8,14,7,16,18,13,15,14,12,13,10,15,9,7,7,7,10,13,15,15,9,9,9,9,19,11,7,11,11,13,8,8,8,8,7,12,19,17,9,9,13,7,7,7,9,7,7,7,12,13,15,10,8,8,14,15,12,13,13,8,12,14,7,11,7,14,15,13,12,8,8,8,8,11,13,15,15,8,13,12,8,8,8,13,10,16,14,11,8,8,12,12,9,15,15,12,12,13,8,8,9,12,13,9,8,8,8,8,8,8,8,8,8,8,8,11,12,11,7,14,7,13,13,13,12,18,16,7,12,11,10,10,15,9,9,9,21,7,7,7,11,16,8,8,11,11,7,7,7,7,7,19,7,7,7,7,7,7,7,7,7,12,8,9,12,14,11,9,9,9,22,12,3,4,8,8,15,4,2,2,5,5,3,3,3,3,3,3,6,6,4,4,4,12,7,10,2,3,3,3,3,3,3,3,6,7,3,7,5,14,4,4,7,8,10,4,1,3,3,6,2,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,4,2,2,5,3,4,2,2,2,2,2,2,11,5,5,5,11,5,5,3,5,5,5,5,11,14,13,9,11,9,12,8,11,11,8,11,16,9,9,7,10,9,12,8,15,6,7,6,6,13,10,8,11,8,6,6,6,12,16,6,11,7,8,9,18,6,6,9,4,4,6,13,6,6,6,6,8,8,9,16,7,7,14,7,8,8,8,7,7,7,7,7,7,15,13,7,10,7,7,10,12,16,15,7,9,9,14,11,11,10,9,10,8,12,7,8,7,7,10,12,7,12,8,7,2,3,3,3,3,3,3,3,3,3,3,5,3,3,5,5,5,10,4,8,7,10,3,3,3,3,3,3,3,3,3,3,1,3,3,3,3,3,3,3,7,4,5,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5,5,5,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,5,6,6,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,8,2,2,2,8,12,7,7,5,5,5,5,5,5,5,5,5,5,5,5,8,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,5,5,5,7,11,9,8,8,8,7,8,9,7,7,9,7,7,7,10,7,7,10,9,10,6,6,6,6,6,6,15,7,8,9,9,8,6,6,10,9,6,8,13,9,7,6,6,6,6,6,6,12,6,6,7,6,7,6,6,6,10,10,7,6,6,6,4,4,4,4,4,4,4,4,4,4,4,4,4,4,6,14,6,6,7,7,9,6,6,6,6,9,9,8,9,10,9,8,9,12,7,7,7,8,7,10,12,11,9,10,7,7,7,9,10,10,8,12,9,7,7,9,8,8,8,10,7,7,8,9,9,7,7,7,8,2,4,6,3,4,2,3,3,3,3,2,3,3,3,3,3,3,3,3,4,4,4,4,5,5,3,3,3,3,3,3,3,3,5,8,6,4,7,3,3,3,3,3,3,3,12,3,3,3,3,3,3,4,4,2,3,5,3,4,7,3,3,3,3,3,3,4,3,3,3,3,3,3,3,4,3,3,6,4,3,4,2,2,2,5,3,3,3,3,3,5,4,4,4,4,7,6,8,9,2,2,2,2,3,3,3,5,7,2,3,3,8,7,7,2,2,8,5,3,3,3,3,3,3,3,3,3,3,3,3,3,5,5,8,8,7,7,6,10,6,9,7,11,4,6,8,8,7,8,4,5,5,5,3,3,11,8,9,6,6,8,7,4,4,7,8,7,2,2,3,3,3,3,4,3,3,3,3,3,3,3,3,7,2,2,5,3,3,2,3,3,3,3,3,3,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,12,5,5,3,3,3,5,10,12,6,15,4,6,6,7,14,9,3,3,3,3,3,8,2,2,3,5,3,3,3,3,3,3,8,8,8,7,5,8,4,6,11,2,2,6,7,3,3,2,9,8,5,5,3,3,3,5,5,7,7,6,6,10,6,8,6,8,9,7,4,4,4,4,7,6,6,7,7,10,9,8,11,8,3,3,3,3,3,4,4,2,3,3,3,3,3,7,6,2,5,6,7,6,4,8,9,11,2,2,3,3,3,3,3,3,3,2,2,5,3,3,3,3,3,9,9,6,4,8,7,7,5,9,8,6,8,7,8,5,5,5,5,5,3,3,3,16,8,7,7,7,8,7,7,7,7,9,6,9,6,10,7,7,7,6,10,8,9,11,11,8,4,4,10,8,8,6,9,6,11,8,8,8,15,7,8,9,5,3,3,3,3,3,5,11,2,2,3,8,9,10,3,2,2,2,2,2,2,3,6,4,2,2,3,3,3,3,3,3,3,3,3,3,4,4,2,3,3,3,3,3,3,3,11,5,3,3,3,3,3,3,3,3,6,7,4,4,2,3,3,3,3,3,3,3,3,12,7,4,12,4,6,5,4,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,2,3,3,3,3,3,3,3,3,4,4,11,10,6,4,6,10,8,3,3,3,3,3,3,3,3,5,4,4,4,2,2,2,2,2,2,2,2,5,3,4,4,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,10,5,5,5,5,5,5,3,3,3,3,3,3,3,3,7,8,8,7,13,12,10,10,8,8,7,7,9,12,11,6,6,8,8,9,7,7,7,10,15,10,4,4,4,4,4,11,8,8,9,7,9,14,14,12,2,2,2,2,2,2,2,3,3,3,3,3,12,5,5,5,11,10,7,9,3,8,7,3,15,13,11,4,4,2,2,2,19,7,5,5,3,3,3,3,3,3,3,5,22,18,6,14,17,4,4,19,16,18,2,3,3,2,3,2,3,3,6,4,2,3,3,2,5,3,3,3,3,3,3,3,9,9,2,3,2,2,2,3,3,3,5,7,14,7,7,12,9,13,6,11,6,10,9,7,7,8,12,12,8,8,8,10,7,7,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,5,8,10,7,8,11,8,12,9,4,7,7,9,13,2,3,3,3,3,3,3,2,3,3,3,1,2,2,3,3,3,3,3,3,5,2,2,5,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,8,4,4,4,3,2,3,3,3,3,5,2,2,2,2,5,5,5,5,3,3,3,3,3,3,3,3,3,7,7,7,7,7,8,8,8,8,8,12,9,8,8,9,8,6,17,6,6,6,8,8,6,6,6,6,6,6,6,6,6,6,6,7,4,4,8,8,9,9,9,7,7,7,7,7,7,7,9,9,9,7,8,8,8,10,7,13,10,8,9,3,3,5,13,3,3,3,3,3,7,7,6,6,10,13,11,11,8,8,9,8,9,9,10,10,10,11,10,10,13,13,16,15,11,12,9,9,10,9,11,10,9,9,14,7,8,3,10,7,7,3,2,2,2,5,3,3,3,3,3,3,3,3,3,3,3,3,6,7,2,2,3,3,3,3,3,3,3,3,4,11,6,7,4,6,2,2,3,3,3,1,3,3,3,3,3,3,6,4,4,2,2,2,3,3,3,3,4,4,6,6,6,6,5,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,9,11,6,10,9,12,7,7,11,14,9,7,12,3,3,7,12,11,12,7,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,9,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,3,3,3,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,11,5,5,5,5,5,5,5,5,11,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,5,5,5,5,5,5,5,3,3,3,5,5,5,5,5,5,5,5,5,5,5,3,3,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,5,5,5,5,5,5,5,5,5,5,5,5,5,3,10,3,3,3,11,3,5,9,11,8,12,14,9,7,8,7,7,11,11,7,7,10,9,8,10,9,7,7,7,7,7,7,8,8,7,11,8,8,8,7,7,10,8,7,13,12,7,17,10,8,8,11,7,11,11,14,7,11,7,8,6,9,20,8,7,9,16,7,10,6,11,10,8,9,7,16,11,11,9,8,9,8,8,8,11,8,15,8,8,9,7,8,8,11,10,7,5,7,10,10,15,7,7,7,8,7,8,8,10,11,10,10,10,11,11,7,8,6,8,8,8,10,6,8,6,6,7,8,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,16,6,15,6,7,11,11,7,9,10,11,13,10,6,16,8,10,12,11,6,6,6,6,6,6,6,10,6,10,7,7,7,7,11,7,11,6,6,6,6,6,6,17,7,7,6,6,12,22,6,6,6,6,6,8,6,6,6,6,7,6,6,5,6,6,8,11,6,9,14,11,9,11,7,7,8,6,6,6,8,10,9,6,6,6,6,9,7,6,6,6,6,6,15,6,4,4,4,6,4,17,8,11,6,6,9,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,6,6,6,6,10,6,10,6,6,6,6,12,8,6,6,6,6,6,6,6,6,6,9,6,6,6,6,18,6,6,6,8,9,10,7,8,9,10,11,7,13,6,8,8,6,6,14,7,7,7,7,10,7,14,9,6,6,9,15,9,7,14,6,11,14,13,7,12,8,7,7,7,7,7,12,7,10,9,16,6,8,6,5,17,6,8,10,4,6,4,10,15,17,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,8,4,4,11,7,4,4,7,7,7,6,6,6,6,6,6,6,6,6,6,6,6,19,17,6,10,11,6,6,6,6,18,6,6,11,4,4,4,5,6,6,6,9,5,6,4,6,6,4,6,6,6,6,10,6,6,4,6,6,10,6,10,6,6,6,6,11,6,6,10,6,6,8,6,6,6,8,6,11,4,11,9,10,9,11,4,8,4,11,12,7,9,8,6,7,7,8,12,12,11,13,10,11,7,7,7,9,7,11,10,7,7,7,16,11,10,11,17,9,9,8,8,7,7,7,9,7,7,7,14,7,13,9,11,10,14,10,10,12,11,10,7,10,5,14,8,8,8,9,7,8,7,7,9,8,7,8,7,7,7,7,7,7,7,11,8,10,8,7,8,14,11,8,9,9,9,8,24,10,10,12,7,7,15,11,8,8,12,11,8,9,9,7,8,9,10,11,10,11,7,12,7,7,11,9,8,14,13,12,8,11,10,8,8,7,7,14,9,10,8,9,11,7,14,8,8,13,8,8,12,7,10,14,14,11,9,10,9,9,7,7,11,11,13,9,13,5,5,5,7,9,5,11,12,14,8,7,7,11,10,9,7,8,8,7,10,11,11,5,5,7,5,5,5,7,7,15,7,7,8,7,15,12,12,10,7,8,7,11,7,7,7,23,11,8,8,11,10,7,8,11,7,19,7,7,6,9,9,9,11,3,4,7,8,6,6,4,10,8,2,2]),na=new Uint16Array([0,0,0,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,12,1,1,1,1,1,17,1,1,1,12,1,12,1,12,13,1,1,1,1,12,1,12,1,1,1,1,1,14,21,1,1,1,1,1,1,1,19,12,1,1,1,1,1,1,1,20,1,1,1,16,18,1,1,15,1,1,1,1,12,1,1,1,1,1,1,22,1,1,1,1,12,1,1,1,1,1,1,1,1,12,12,12,12,12,12,12,12,12,12,12,12,1,24,25,26,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,12,12,12,12,1,32,0,0,0,1,1,1,1,35,34,1,1,1,1,1,33,1,1,1,1,37,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,38,0,0,0,0,39,40,0,0,0,0,12,1,1,12,1,1,1,1,43,44,44,44,43,44,43,43,45,44,43,44,43,43,43,43,43,43,45,43,43,43,43,43,43,44,46,46,44,43,43,43,43,43,12,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,49,51,49,49,49,51,49,50,49,52,49,50,50,49,49,49,50,52,50,52,49,50,50,12,54,54,53,55,50,52,49,49,47,48,56,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,59,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,66,1,12,1,1,65,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,77,0,0,0,0,0,0,0,0,0,0,0,0,0,75,78,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,76,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,12,1,1,1,1,88,1,90,1,1,1,1,1,1,1,1,93,1,1,1,1,1,1,1,1,1,1,1,1,0,1,96,96,1,1,12,1,99,1,1,1,1,1,1,1,97,1,98,1,100,1,1,1,1,1,101,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,109,110,1,1,1,1,1,1,112,112,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,120,121,1,1,1,1,1,1,1,1,1,1,1,1,1,121,1,1,1,1,1,1,1,1,1,1,121,1,1,1,1,1,1,1,1,1,125,122,124,119,1,123,1,1,113,1,1,1,1,116,1,126,1,1,1,1,1,1,118,1,107,1,108,1,12,127,105,1,111,1,1,1,1,1,106,114,1,12,12,12,117,115,1,1,1,1,1,1,0,0,0,0,1,12,12,1,1,1,1,1,12,133,1,1,1,1,1,1,1,1,1,1,1,12,135,1,1,1,1,1,1,1,1,136,137,12,12,134,132,44,44,139,49,49,138,141,140,1,1,0,0,0,0,0,0,0,0,0,0,0,0,144,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,142,0,0,0,0,1,0,143,131,1,0,1,12,12,1,1,1,1,1,0,0,0,0,0,0,0,1,147,146,20,1,1,12,12,1,20,12,12,1,1,1,1,1,133,1,1,151,1,1,1,1,152,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,1,1,135,1,1,151,1,1,1,1,152,1,1,133,1,1,1,151,1,1,1,1,152,1,1,133,1,1,1,1,1,1,1,1,133,1,1,1,1,1,1,1,1,1,1,1,159,1,1,1,151,1,1,1,1,1,152,1,1,159,1,1,1,1,1,1,1,1,1,1,133,1,1,1,1,151,1,1,1,1,152,1,1,1,133,1,1,151,1,1,1,1,163,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,1,166,1,1,159,1,1,1,1,1,151,1,1,1,1,1,152,1,1,159,1,1,1,1,1,151,1,1,1,1,1,152,1,153,157,157,12,1,12,165,1,1,1,1,1,157,157,157,153,1,1,1,156,157,160,164,1,1,1,1,156,156,1,1,155,153,153,156,169,155,169,1,1,167,1,155,154,156,1,1,1,1,156,1,158,1,1,1,12,1,161,1,161,1,1,1,161,160,162,168,155,153,1,1,1,1,1,1,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,171,172,171,172,171,171,171,171,173,173,171,172,171,172,171,171,12,1,12,12,12,12,1,12,12,12,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,12,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,193,1,1,1,1,12,199,200,201,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,12,1,1,1,1,1,1,1,1,150,1,1,1,1,1,1,1,1,1,1,1,196,1,1,1,184,1,209,1,1,1,207,1,1,204,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,12,1,1,1,1,1,12,1,1,1,1,1,1,1,1,176,190,1,1,1,186,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,182,1,1,1,1,1,1,1,191,1,1,1,1,195,1,1,1,1,170,1,1,189,1,1,1,192,1,1,1,12,1,1,1,1,1,1,1,1,1,1,1,1,180,1,12,1,1,12,1,1,1,1,183,1,1,1,188,1,12,1,1,1,1,1,1,1,1,1,1,1,1,1,1,12,1,1,208,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,194,1,1,1,1,1,12,1,1,1,1,1,1,1,1,175,12,1,1,1,178,12,1,1,1,1,1,1,1,198,1,1,1,1,1,1,1,1,1,1,177,1,1,1,1,1,1,203,1,1,1,181,1,1,1,187,1,12,1,1,12,1,1,1,1,1,1,1,1,1,1,191,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,174,1,1,1,1,1,1,1,1,1,1,185,1,1,1,1,1,1,1,1,1,1,1,205,1,1,1,1,1,1,1,1,1,1,12,1,206,1,1,12,1,1,1,1,179,1,1,1,185,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,12,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,12,1,1,1,197,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,12,12,1,1,1,1,1,1,1,1,1,202,1,1,12,1,1,1,12,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,219,0,0,0,0,0,220,0,0,0,0,0,0,1,12,1,1,1,224,1,1,1,0,225,222,223,1,1,1,1,1,1,230,1,232,1,1,1,1,1,1,1,1,1,1,1,228,1,1,1,1,1,234,1,1,12,1,12,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,233,1,1,1,12,1,1,1,1,229,1,1,1,227,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,231,1,1,1,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,1,12,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,240,13,1,1,1,12,12,237,238,1,1,1,1,239,1,1,12,1,1,1,1,1,1,1,241,1,1,12,16,1,1,1,1,1,1,242,1,1,1,12,12,1,1,1,1,1,1,242,12,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,251,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,255,255,1,0,0,0,0,0,1,12,0,0,0,0,0,0,0,0,171,260,261,1,12,1,1,1,1,12,263,1,1,262,1,1,265,1,1,1,1,1,1,1,1,0,1,1,1,269,270,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,12,1,0,1,0,0,0,0,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,12,0,281,0,0,282,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,12,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,59,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,1,0,306,0,0,0,0,0,0,0,0,0,308,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,12,1,1,1,1,1,1,1,1,1,12,1,1,1,1,1,324,324,325,324,0,185,1,1,13,320,1,318,0,0,0,0,0,0,0,321,1,1,326,1,204,1,1,1,1,319,1,316,1,322,1,314,1,323,1,315,1,1,1,1,1,1,1,12,1,1,1,1,12,317,317,1,1,1,184,1,1,12,1,1,1,1,1,1,1,1,1,1,12,1,1,1,1,12,1,1,1,1,313,1,0,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,329,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,265,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,369,369,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,361,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1,0,1,337,348,1,1,336,371,1,342,1,1,334,366,1,1,352,333,338,1,1,1,345,376,354,1,1,1,1,1,1,355,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,364,368,0,0,78,1,1,0,362,339,375,340,343,350,1,365,0,1,0,78,359,357,1,0,0,1,1,1,0,0,0,0,378,1,1,349,1,78,1,0,1,1,1,381,1,0,0,78,356,0,1,335,1,1,1,0,1,1,358,1,0,1,1,1,0,1,383,346,1,1,0,1,0,0,374,0,1,1,1,78,367,1,1,363,360,1,1,1,1,1,1,1,1,1,1,1,341,1,1,1,1,1,1,1,1,1,1,1,373,0,78,1,1,1,1,0,1,1,1,1,1,1,0,0,1,1,377,1,1,1,0,0,380,0,0,0,1,353,1,0,78,379,1,0,0,0,0,382,1,1,0,0,1,0,1,0,351,0,347,0,1,1,1,0,1,1,0,370,344,372,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,1,1,397,397,1,1,12,12,1,397,1,1,12,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,409,1,1,0,1,1,1,1,204,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,427,427,1,1,0,0,314,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,439,1,438,1,1,1,1,1,1,1,1,1,443,1,12,12,1,1,1,1,1,12,1,1,1,1,451,1,1,1,453,1,1,1,1,1,1,1,1,1,1,450,1,445,1,1,1,1,432,1,1,1,1,1,1,1,1,446,12,1,1,1,1,452,1,1,1,447,441,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,314,1,430,1,1,12,449,1,1,314,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,434,1,1,1,1,1,1,1,1,1,1,1,452,1,1,1,1,314,1,448,1,1,1,442,436,1,1,1,1,1,437,1,454,440,1,1,1,1,1,435,1,1,1,1,1,1,1,1,1,431,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,444,1,1,1,1,1,1,1,1,1,1,1,1,433,1,1,1,1,1,1,1,219,455,1,1,1,1,1,12,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,0,0,1,0,1,0,1,1,0,0,0,460,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,12,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,464,0,464,464,464,464,464,464,464,0,464,464,464,464,464,1,464,464,464,0,464,464,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,469,468,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,473,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,466,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,467,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,475,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,464,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,472,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,465,0,0,476,471,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,470,0,0,0,0,0,0,0,0,0,0,0,0,0,464,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,465,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,464,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,474,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,12,1,1,1,1,1,1,1,1,1,1,1,1,486,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,198,198,1,490,1,1,1,489,1,1,1,1,485,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,487,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,491,1,1,488,1,1,1,1,1,1,1,1,369,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,492,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,503,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,1,0,1,0,0,12,1,505,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,12,12,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,1,0,0,0,0,0,0,0,1,0,0,1,0,1,1,1,1,0,0,0,1,0,0,0,1,59,1,1,12,12,12,12,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,524,1,1,1,1,1,1,1,525,1,1,1,1,1,1,1,523,1,1,12,1,527,238,1,1,12,12,1,1,12,1,12,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,531,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,537,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,131,1,12,542,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,106,1,1,12,1,1,1,12,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,547,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,12,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,143,1,1,1,227,1,1,12,30,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,1,571,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,219,1,325,1,1,1,1,1,1,1,1,1,0,0,576,1,1,1,1,0,578,0,78,0,577,0,1,1,1,0,1,1,1,1,1,1,12,0,0,0,0,1,0,0,0,0,0,0,584,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,580,580,0,583,581,580,580,580,580,580,585,580,580,589,580,580,580,580,580,580,580,580,580,580,586,583,580,580,583,580,580,580,580,580,580,580,580,580,580,580,580,580,581,580,580,580,580,580,587,580,580,580,580,580,580,0,0,0,1,588,1,1,1,1,582,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,12,593,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,12,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,12,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,12,1,1,12,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,95,64,278,304,408,533,0,4,67,235,253,280,305,331,385,410,0,497,517,534,595,9,0,60,87,395,406,426,574,0,495,516,530,610,0,30,6,0,459,498,600,559,69,0,7,283,254,386,461,413,536,78,596,0,575,307,415,463,9,104,286,504,6,30,0,309,78,388,78,481,10,6,130,247,273,0,611,507,0,562,0,63,6,6,250,94,2,429,396,407,594,0,6,0,6,284,102,6,560,499,538,0,462,387,271,285,8,70,103,597,541,389,310,298,416,145,73,288,545,508,599,563,332,327,477,6,74,148,11,0,248,520,546,564,512,550,569,609,36,6,259,293,330,302,217,30,526,552,217,41,215,264,294,303,403,420,479,272,0,72,561,0,400,414,297,78,246,78,0,579,544,502,290,418,78,390,384,0,0,0,9,554,570,216,0,421,404,529,514,572,613,84,217,42,295,393,422,568,0,509,291,274,78,214,79,28,387,30,6,391,328,301,602,590,522,549,511,0,257,80,30,402,419,0,30,423,0,218,591,515,9,405,424,217,247,85,221,592,573,556,480,425,394,249,226,86,58,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,618,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,411,0,0,0,0,0,0,0,0,81,0,128,0,0,83,548,0,0,0,0,0,0,0,27,0,551,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,411,0,0,0,0,501,0,256,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,292,0,0,0,0,0,0,0,615,0,0,0,0,0,614,0,0,0,0,0,0,0,0,0,0,0,0,0,0,392,0,0,0,482,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,68,0,0,0,0,0,0,493,0,0,0,0,0,0,401,0,0,0,0,0,0,0,0,0,0,0,0,0,210,0,0,0,0,0,0,0,0,0,0,0,513,0,0,0,0,0,0,0,0,0,0,0,0,494,0,0,0,0,0,0,0,0,0,0,0,0,0,0,268,279,0,0,0,0,0,528,275,0,0,0,0,0,0,0,0,0,0,0,0,0,510,0,0,0,0,0,0,0,0,0,0,0,456,0,0,0,312,0,0,0,0,0,0,252,0,0,0,0,0,0,23,0,0,0,0,567,0,0,0,0,598,519,0,0,0,0,243,0,0,0,0,0,0,0,0,0,478,0,0,0,0,0,61,0,0,0,266,57,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,245,0,0,0,0,0,277,608,0,71,0,0,0,0,0,0,0,0,0,617,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,149,0,276,0,0,0,0,0,0,566,0,0,0,0,0,0,521,0,0,0,0,0,0,0,0,0,565,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,62,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,212,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,83,0,500,0,0,0,0,0,553,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,83,82,0,0,0,0,0,0,0,0,0,0,0,0,484,0,483,0,0,0,0,0,0,0,0,0,0,258,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,457,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,287,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,535,0,0,0,0,0,0,0,0,296,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,68,236,0,0,0,0,0,0,0,0,0,0,83,0,604,0,0,0,0,0,0,0,0,0,0,0,0,244,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,607,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,518,0,0,0,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,496,0,612,0,0,428,0,0,0,0,0,0,0,0,0,0,0,0,399,0,0,0,543,0,92,0,0,0,0,0,0,0,0,0,0,31,0,0,0,0,0,0,29,91,0,0,0,0,0,0,0,0,0,0,0,0,289,0,0,0,213,0,0,0,0,0,0,557,0,0,0,0,129,0,0,0,0,0,558,0,0,0,0,0,0,0,411,417,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,311,0,0,0,0,0,5,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,532,0,0,0,412,0,0,398,0,0,0,0,0,0,601,0,0,0,539,0,0,89,0,540,0,0,0,0,0,0,0,0,0,0,506,458,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,267,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,411,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,606,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,605,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,616,0,0,0,0,0,555,0,0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,603,0,0,211,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,621,621,621,621,621,621,621,620,622]),at="orgmilcomschnetedugovdrrformsfeedbackofficialaccoorgmilschnetgovmagazinemediaunioncargopilotgroupcaarespressworksaerodromeworkinggroupair-traffic-controlaircraftaccident-preventioneducatormarketplaceambulanceinsurancecateringairportrepbodyenginesoftwaremodellingair-surveillanceconsultingchartertrainermaintenanceservicesdesignflightskydivingfreightassociationstudentgroundhandlingdgcafuelclubtaxicrewshowballooningexpresstraderbrokerauthoragentsairtrafficjournalistsafetyconsultantmicrolightaccident-investigationparachutingequipmentproductionfederationrecreationscientistnavigationengineertradingglidingleasingresearchpassenger-associationentertainmentparaglidinghangglidingaerobaticrotorcraftemergencycertificationgovernmentaeroclubexchangelogisticschampionshiphomebuiltcouncilconferencecontrolairlinecivilaviationjournalorgcomnetedugovcoorgcomnomnetobjofforgcomnetuwukiloappsframerorgmilcomnetedugovcoradioorgcomnetcommuneedogpbcoitgvorgedugov*spreviewfrontendrelayononstagingupid*mtls*privatelinktypedreamdeveloperbravemochawindsurfaivenmirenupsunwnextbegetngrokclerkwale2bwebcsbrunputerflutterflowspawnbaseshiptodaymagicpatternsnetlifyondigitaloceanrailwayhostedclaudehasurabotdashvercelgithubluyanigadgetreplitcloudflaretelebitedgecomputeevervaultexponyatnoopencrpplxzeaburwasmerframerzeropsconvexmedusajsspritesonherculeseasypanelstreamlitsnowflakemesserliloginlinehackclubcodepennorthflankbase44corespeedleapcellngrok-freeclerkstagelovableon-fleek*us-west-3ap-south-2us-central-2us-central-1eu-central-1ap-south-1us-west-2us-east-2eu-north-1ap-north-1us-west-1us-east-1*rcloudintsegorgmilcomgobbetnetintedugovturmusicasenasamutualcoopip6uriurnin-addre164homeirisgovdixdaemoncloudnssthwien*inexexkunden4accogvormymyspreadshop4lima2ixortsinfofuturecmsfuturehosting12hpprivfuturemailinglima-cityfunkfeuer123webseitednshomemelmyspreadshopcloudletswasantqldvicactnswtascatholicwasaqldvictasidwasantozqldorgcomvicasnactnetedugovnswtasconfcomairflowlambda-urltransfer-webappairflowtransfer-webapptransfer-webapptransfer-webapp-fipstransfer-webappeu-west-3ap-south-2eu-south-2eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3eu-central-1mx-central-1me-central-1ca-central-1il-central-1ap-northeast-1ap-southeast-1me-south-1af-south-1eu-south-1ap-south-1ap-southeast-7us-west-2eu-west-2us-east-2eu-north-1ap-southeast-2ap-northeast-2ap-southeast-5us-gov-west-1us-gov-east-1ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1privatenotebookstudiolabelingnotebookstudionotebooknotebook-fipslabelingnotebookstudionotebook-fipsnotebookstudio-fipsnotebook-fipsnotebookstudionotebook-fipsnotebookstudioeu-west-3ap-south-2eu-south-2eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3eu-central-1me-central-1ca-central-1il-central-1ap-northeast-1ap-southeast-1me-south-1af-south-1eu-south-1ap-south-1us-west-2eu-west-2us-east-2eu-north-1ap-southeast-2ap-northeast-2experimentsus-gov-west-1us-gov-east-1ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1onrepostsagemakercopporgmilcompronetintedugovbiznameinfoshoprsorgmilcomnetedugovbrendlyresolvenzauscotvstoreorgcomnetedugovbizinfoidacaicoittvorgmilcomschnetedugovinfocloudezproxyacmymyspreadshopkuleuvenwebhostingtransurl123websitecloudnsinterhostsolutionsddns5476103298edgfacbmlonihkjutwvqpsryxzbarsycoororgcomedumyftpno-iporxcloud-ipfor-somemmafanfor-morewebhopselfipjozidyndnscloudnsdscloudfor-thefor-betteractivetrailcoeconorestooteorgcomeconeteduassurmoneyafricaarchitectesrestaurantloisirstourismavocatsinfoagrounivcoorgcomnetedugovtvdeportesaludtksatorgmilcomwebgobnetinteducienciaboliviarevistacooperativaempresanombreindustriamusicapatriamedicinademocraciapoliticapuebloindigenaplurinacionalarteblogwikiinfoagrotransportenoticiasprofesionalacademiaeconomiaecologiamovimientotecnologianaturalsimplesitecepesebamapadfmgalampbacscpirngorotomtrjspaprrprrsesmscepesebamapadfmgalampbacscpirngorotomtrjspaprrprrsesms*biaamfmtcmptvfeirasampajampanatalbelemananiradiog12medindfndbmdtrdthepoaggfjdfdefinfenflegsegongengcngorgzlgslglogppgmillelqslcimcomnomadmjabimbbibbsbabcrectecsjcetcpscpvhudieticriapipsiecnbiorioecogeoteoodoproatoartfstmatvetdetbetnetcntnotfotgrueduajuespappreptmpemparqsrvadvdevgovntrturagrjorfarjusmusdesvixxyzcozfozslzbhzmaringasantamariacampinagrandegoianiasorocabafloripasaobernardocuritibaboavistarecifeaparecidasaogoncasalvadorcuiabamorenamacapalondrinacontagemsocialfortalmaceioleilaoosascoriobranconiteroi9guacutcheblogflogvlogwikitaxicoopmanauspalmascaxiasjoinvillebaruericampinassantoandreribeiraoriopretoweorgcomnetedugovv0windsurfshiptodaycloudsitecoaccoorgnetgovofmilcomgovmediatechzacoorgcomnetedugsjgovmydnspenfnlabnbmbgcbcqconcontnuyksknsmyspreadshopno-ipawdevboxbarsyonidatemfuinabusavinstanceseceuguukussryzespawncsxcloud-ipmyphotosfantasyleaguetwmailcleverappsscrappingccwucloudnsftpaccessgame-serverccgovobjectsrmalpgcust*svcalp1aeappenginermalpgmyspreadshop4lima2ixsquare7cloudscale123websitefirenet12hpflowgotdnslinkyard-cloudcloudnslima-citydnskingobjectstorageedaccogoorusorgcomnetintedua\xE9roportxn--aroport-byaassogouvcomilgobgovcloudnses-1eu-west-1us-east-1euvipit1eurarubait1s3lbwebsites3websiteru-spbru-mskelasticcsrunstnukukcaukusnl-ams-1fr-par-1fr-par-2functionsnodess3ddlwhmrdbfnck8sifrs3-websitecockpitscblmgdbdtwhkafkpubprivs3ddlwhmrdbk8sifrs3-websitecockpitscblmgdbdtwhkafks3ddlrdbk8sifrs3-websitecockpitscblmgdbdtwhkafkk8sscalebookpl-wawfr-parnl-amsbaremetalsmartlabelinginstancesdechk2kuleuvenlaravelvoorloperurownoxazapscwhstgrvaporonline-serverobservablehqelementorantagonistreclaimjoteluluencowaydiademjelasticmatlabmagentositetrendhostingaxarnetperspectajenv-arubajelejoteravendbemergenttrafficplexconvexkeliwebserveboltbegetcdnstaticson-rancherprimetelonstackitunison-servicesdnshomelinkyardbarsyjelecloudnscocomnetgovmycn-northwest-1cn-north-1s3s3-accesspoints3-websites3s3-accesspointrdsdualstacks3-deprecatedemrappui-prods3-websiteemrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apis3s3-accesspoints3s3-accesspointrdsdualstackemrappui-prods3-websiteemrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apicn-northwest-1cn-north-1cn-northwest-1ebcomputeelbcn-north-1airflowcn-northwest-1cn-north-1oncn-northwest-1cn-north-1amazonawssagemakeramazonwebservicesdirectasgdsdhehahljlnmhbacscahqhshhihnlnynsnmofjbjzjxjtjhkcqtwgsjssxnxjxgxxzgz\u7DB2\u7D61\u7F51\u7EDC\u516C\u53F8orgmilcomnetedugovxn--55qx5dcanva-appsxn--io0a7iquickconnectcanvasitekhsjxn--od0algmyqnapcloudsrvrlessclustersrealtimestorageleadpagescarrdcrdorgmilcomnomnetedugovhidnssupabaserdpareplmypiumsoxmitotaplpagesfirewalledreplitowodevwebview-assetsvfswebview-assetss3s3-accesspointdualstackemrappui-prods3-websiteaws-cloud9emrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apicloud9eu-west-3ap-south-2eu-south-2eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3eu-central-1me-central-1ca-central-1il-central-1ap-northeast-1ap-southeast-1me-south-1af-south-1eu-south-1ap-south-1ap-southeast-7us-west-2eu-west-2us-east-2eu-north-1ap-southeast-2ap-northeast-2ap-southeast-5ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1s3s3-accesspointdualstackemrappui-prods3-websiteaws-cloud9emrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apicloud9s3s3-accesspointdualstackanalytics-gatewayemrappui-prods3-websiteaws-cloud9emrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apicloud9s3s3-accesspointdualstackemrappui-prods3-websiteemrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apis3s3-accesspointdualstacks3-deprecateds3-websites3-object-lambdaexecute-apis3s3-accesspoints3-websites3-accesspoint-fipss3-fipss3s3-accesspointdualstackemrappui-prods3-websites3-accesspoint-fipsaws-cloud9s3-fipsemrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apicloud9s3s3-accesspointdualstackemrappui-prods3-websites3-accesspoint-fipss3-fipsemrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apis3s3-accesspointdualstacks3-deprecatedanalytics-gatewayemrappui-prods3-websiteaws-cloud9emrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apicloud9vfss3s3-accesspointdualstackemrappui-prods3-websiteaws-cloud9emrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apicloud9eu-west-3ap-south-2eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3eu-central-1mx-central-1me-central-1ca-central-1il-central-1ap-northeast-1us-northeast-1ap-southeast-1me-south-1af-south-1ap-south-1ap-southeast-7us-west-2eu-west-2ap-east-2us-east-2ap-southeast-2ap-northeast-2ap-southeast-5us-gov-west-1us-gov-east-1ap-southeast-6ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1mrapaccesspoints3s3-accesspointdualstacks3-deprecatedanalytics-gatewayemrappui-prods3-websites3-accesspoint-fipsaws-cloud9s3-fipsemrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apicloud9s3s3-accesspointdualstacks3-deprecatedanalytics-gatewayemrappui-prods3-websites3-accesspoint-fipsaws-cloud9s3-fipsemrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apicloud9s3eu-west-3ap-south-2eu-south-2computes3-ap-northeast-2elbrdss3-ap-east-1s3-sa-east-1s3-us-gov-west-1s3-eu-central-1s3-ca-central-1eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3s3-website-us-west-2s3-website-eu-west-1s3-external-1eu-central-1me-central-1ca-central-1il-central-1s3-us-west-1s3-eu-west-1s3-website-sa-east-1s3-website-ap-southeast-2ap-northeast-1ap-southeast-1s3-us-west-2s3-eu-west-2me-south-1af-south-1eu-south-1ap-south-1us-west-2eu-west-2us-east-2s3-website-ap-southeast-1s3-1s3-globals3-ap-northeast-3eu-north-1airflowap-southeast-2s3-us-gov-east-1s3-fips-us-gov-east-1s3-me-south-1s3-ap-south-1ap-northeast-2s3-website-us-west-1ap-southeast-5s3-eu-north-1s3-ap-southeast-1s3-website-us-gov-west-1compute-1s3-eu-west-3us-gov-west-1s3-website-ap-northeast-1us-gov-east-1s3-fips-us-gov-west-1s3-website-us-east-1s3-ap-southeast-2ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1s3-us-east-2s3-ap-northeast-1authauthauth-fipsauth-fipseu-west-3ap-south-2eu-south-2eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3eu-central-1mx-central-1me-central-1ca-central-1il-central-1ap-northeast-1ap-southeast-1me-south-1af-south-1eu-south-1ap-south-1ap-southeast-7us-west-2eu-west-2us-east-2eu-north-1ap-southeast-2ap-northeast-2ap-southeast-5us-gov-west-1us-gov-east-1ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1rframeservicesbuilderstg-builderdev-builder*ociocpocsdemoinstanceeu-west-3eu-south-2ap-southeast-3ap-northeast-3eu-central-1me-central-1ca-central-1il-central-1ap-northeast-1ap-southeast-1me-south-1af-south-1eu-south-1ap-south-1ap-southeast-7us-west-2eu-west-2us-east-2eu-north-1ap-southeast-2ap-northeast-2ap-southeast-5us-gov-west-1us-gov-east-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1previeweu-4us-4us-1eu-1us-2eu-2us-3eu-3appspaasrag-cloudrag-cloud-chjcloudjcloud-ver-jpcdemonodebalancermembersipeuxvsoncillaocelotonzayalilynxsphinxfentigercustomercaracalo365cloudstaticxendevapp001testcode-builder-stgplatformmediasiteprojedrydpagesjsu2u2-localx0desazacncoitrueu4uhkukgrbrushatenadiarymyspreadshopfrom-flfrom-wvwebspace-hosttheworkpchatenablogcursorusercontentservesarcasmapplinzisakuratanwixsiteappchizigiizeis-into-carsdnsiskinkyadobeaemcloudis-a-therapistpgfogmyvncdojinis-an-actress1kappfldrvkozowqa2jpnmexprgmrfirewall-gatewaydynnscafjsfbsbxooguyxnbayfrom-gawoltlab-demois-a-anarchistwiardwebteaches-yogadattowebtb-hostinglive-websiteservegamegotpantheonfrom-nhsubsc-payfrom-ohvipsinaappfrom-cadyndns-officehomelinuxfrom-mahercules-appservebbsstreakusercontentfrom-okfrom-wyfastly-terrariumis-a-llamaqualyhqportalserveexchangeon-vaporvivenushopciscofreakgrayjayleaguesmetaaiusercontentfrom-iais-a-libertariansaves-the-whalestaveusercontentyolasiteoperaunitepoint2thisis-a-catererclaudeusercontentlinodeusercontentfrom-vagithubusercontentsells-for-lesshosteurcanva-appsplaystation-cloudddnsfreefrom-pafrom-prfrom-waddnskingoutsystemscloudhotelwithflightmydattois-a-nascarfanmydbserverminiserverdamnserverservehumouris-a-playerfrom-nvfrom-nmemergentagentgentappsamplifyappfrom-kyis-an-accountantnfshostserveircfrom-akpythonanywherestackhero-networkpostman-echolikescandydyndns-mailobservableusercontentserveftpfreeboxosfrom-utcdn77-storageamazonawsneat-urldyndns-serverlinodeis-a-teacherfrom-vtgleezemythic-beastsus1-pleniteu1-plenitla1-plenitpaywhirlservecounterstrikejdevcloudhealth-carereformis-into-animegoogleapisis-a-painterafricaisa-hockeynutatmetais-an-actora2hostedis-a-democratdatadetectest-le-patrondigitaloceanspacesis-a-designeris-a-hunterlinodeobjectstemp-dnsissmarterthanyoufrom-arsimplesiteevennodetownnews-stagingis-a-liberalgooglecodejelasticservemp3qualyhqpartnerdyndns-free1cooldnsest-a-la-masiondrayddnsdynuddnsfrom-orfrom-miis-a-bloggerfrom-himydobisscanvacodeis-an-engineerest-a-la-maisonupsunappdevinappswafflecellmyasustorwpenginepoweredfrom-ctservep2psame-appmyshopblocksthingdustdatalikes-piediscordsezis-with-thebanddev-myqnapcloudlpusercontentis-leetshopitsite3utilitiesis-a-personaltrainersinaappladeskis-a-cheflogoipselfipbase44-sandboxnospamproxyalibabacloudcsmesswithdnsauthgearappsiamallamawithgooglelutrausercontentmochausercontentframercanvasmytabitdyndns-homew-credentialless-staticblitzcpserverdiscordsaysis-a-nurseappspotatlassian-isolated-3premotewdfrom-mtwixstudiocode0emm180rmyactivedirectoryawsappsmytuleapdnsabrpolyspaceqbuserrenderbuiltwithdarkboutirgotdnsabrdnsdopaascanva-hosted-embedawsglobalacceleratorhomesecuritypcmyiphostditchyouripclever-clouddyndns-ipon-aptibleis-a-musiciansecuritytacticsappspaceusercontenthomeunixstrapiappsame-previewcf-ipfsmycloudnaselasticbeanstalkis-certifieddontexistkasserverik-serverdrive-platformatlassian-3pfirebaseappherokuappawsapprunnerbarsycenteris-a-cubicle-slaveservehttpmyshopifyis-a-guruquicksytessiiitesorsitesmagicpatternsappis-a-cpameteorappfrom-wiis-a-rockstarbumbleshrimpdattolocalreadthedocs-hostedfrom-rifamilydsdyndns-picsplesknsbplaceddnsaliasdynaliasdyndns-remotedoomdnsip-ddnsblogdnsis-a-doctorroutingthecloudamazoncognitobarsyonlinedsmynasddnsgurucloudflare-ipfsdeus-canvasfrom-idsmushcdnpagespeedmobilizerdyndns-at-homeunusualpersonhosted-by-previderis-a-republicandyn-o-saurstreamlitappworkisboringonthewificprapidqualifioappis-uberleetis-slickgetmyipwpdevcloudtypeformdyndns-at-workgentlentapismynascloudw-corp-staticblitzfrom-ingeekgalaxyservebeerfrom-mdonrenderspace-to-rentaivencloudappspacehostedwafaicloudcodespotblogspotatlassian-3p-us-gov-modfrom-ndfrom-msis-a-techieis-a-studentcustomer-ociis-a-photographerdurumisfrom-ksmassivegriddyndns-wikiis-an-entertaineris-a-hard-workermysecuritycamerafrom-mnrackmazedyndns-blogis-a-bulls-fanwritesthisblogfreemyipsimple-urlfrom-sdreservdauthgear-stagingest-mon-blogueuris-into-gamesrice-labsxtooldevicesakurawebis-an-anarchistoraclecloudappsdyndns-worksells-for-urhcloudfrom-dcfastvps-serverwpmucdnis-a-geekscrysecfrom-txis-into-cartoonsmodelscapetrycloudflarelocaltonetstreak-linkbalena-devicesfrom-njforgeblocksfreebox-oswebadorsitefrom-ncdoesntexisthobby-sitestreaklinkshomesecuritymacownprovidertuleap-partnersdattorelaywphostedmailalpha-myqnapcloudservequakeis-a-socialistservehalflifepivohostingdynuhostingquipelementsw-staticblitzdyndns-webfrom-deproject-studyaliases121is-not-certifiedhercules-devis-a-financialadvisorservepicsis-a-greenloseyouripfrom-ilwithyoutubemwcloudnonprodwiredbladehostingdnsdojofrom-tnpixolinomyqnapcloudis-an-artisthostedpiis-a-landscaperauiusercontentoaiusercontenton-forgeis-a-conservativedreamhostersnet-freaksapps-1and1is-goneencoreapifastly-edgefrom-nesalesforcefrom-scdeployagentoraclegovcloudappsfrom-alis-a-lawyercechirevultrobjectsstufftoreadisa-geekddnsgeeklovableprojecttry-snowplowfrom-moblogsyteis-a-bookkeepernogmyforumravendbmyboxdeelementoredsaacficogoorinforgcomgobnatneteduidstoreorgcomnetintedudevnomepublorgcomneteduathgovtestscalculatorspaynowinfoquizzesresearchedcloudnsfunnelsassessmentsjscaleforcetmacltdorgmilcompronetgovbizpresseklogesrsccloudcustomfltusrcloude4corealmgovmunicontentproxy9metacentrumdyndyndyndnsdynpagespages-researchitionoccustomercomymyspreadshopipv64diskussionsbereich4limacomrub2ixfirewall-gatewayddnssspdnsbarsykeymachinesquare7myhome-serverspeedpartnercommunity-proschuldockxenonconnectg\xFCnstigliefernbwcloud-os-instancedyndnssecmy-routerxn--gnstigliefern-wobin-butterl-o-g-i-nisteingeekin-dslin-berlinin-brbfuettertdasnetzleitungsenin-vpnlcube-serverdyn-ip24logoipdyn-berlinruhr-uni-bochum12hpgoipsrvdnsfruskygit-repossvn-reposinternet-dnsg\xFCnstigbestellenhome-webserverxn--gnstigbestellen-zvbbplacedheimdnscosidnswebspaceconfiglima-citydyndns1istmeinvirtualuserschulplattformmy-gatewayddnsseclebtimnetztest-iservmein-iservvirtual-userhome64iservschuletaifun-dnstraeumtgeradeschulserverdynamisches-dns123webseitednshomehs-heilbronndnsupdaterbssgraphicdwadpdwdaepeweaawapaafpfwfabwbpbacwcpcciwebuserapiobjectsidsiskospockkimodorikerbonesteamsparisjanewaypicardglobaltarpitreedpikekiraworfsulukirkarchertuckerhackercanarywesleystagingprereleaset3r2lpbravepanelngrokiservstglclcrmerpflypagesbarsyvivenushoplocalcertlocalplayerbearbloggatewaydeno-stagingis-not-ais-a-goodbotdashvercelmocha-sandboxplatter-appreplitgithubpreviewworkersinbrowserevervaultis-ahrsndenoxmitmodxmyaddrstorageapipayloadgrebedocruncontainersstgstagelclstageloginlineis-a-fullstackcodepenleapcellngrok-freeis-coolstoragewebharemediatechlibp2pdiscourseimaginecomyspreadshopstoreregbiz123hjemmesidefirmcoorgcomnetedugovsldorgmilcomwebgobartnetedugovtmorgpolcomsocartnetedugovassoagrondiscoodontk12medcuegyecpaabgengorgmilgalsaltulcomadmesmgobpubdocmonfindgnriouioproartlatvetnetfotedulojgovntrturibrbarxxxofficialbasechefprofmktgpsictechinfoarqtcontdentrrpppsiqgit-pagesritmedfieorgcomlibprieduaipgovriikmeactvsportorgmilcomscieunnetedugovnameinfopintouchtawktotawkmyspreadshoporgcomnomgobedu123miwebcomputeorgcomnetedugovbiznameinfocognito-idpeusc-de-east-1onjelasticnxaspdnsbarsydirectwpdeuxfleurstransurldogadoprvwcloudnsamazonwebservicesdnshomeuserpartycokoobinmkmfidemopaasdymyspreadshopalandkapsiikixn--hkkinen-5wacloudplatformdatacenterh\xE4kkinen123kotisivuidacorgmilcompronetedugovbiznameinforadioorgcomneteduuserexperts-comptablestmmyspreadshopgretaprdcomnomynhccifbxoshuissier-justicenotairesaeroportfreeboxoson-webavocatassoportgouvkdnschirurgiens-dentistes-en-franceavouesfbx-os123sitewebveterinairechirurgiens-dentistespharmacienchambagrimedecinfreebox-osdediboxgoupilemszicpyicpvicppleysheezypagesedugovcnpyorgcomcybllcpvtnetedugovtnxonlineschooldaemond6atcopanelorgnetplybotdashstackitkaasorgmilcomnetedugovbizmodltdorgcomedugovcoorgcomneteduappwriteacorgcomnetedugovcloudtranslateusercontentorgcomnetedumobiassoorgcomnetedugovbarsysimplesitediscourseindorgmilcomgobneteduorgcomwebnetedugovguaminfonxhra\u6559\u80B2\u654E\u80B2\u7DB2\u7D61\u7F51\u7D61\u7EC4\u7E54\u7D44\u7E54\u7F51\u7EDC\u7DB2\u7EDC\u7EC4\u7EC7\u7D44\u7EC7\u516C\u53F8\u653F\u5E9C\u500B\u4EBA\u4E2A\u4EBA\u7B87\u4EBAltdorgcomincneteduidvgovxn--uc0ay4axn--55qx5dxn--mk0axixn--io0a7ixn--uc0atvxn--zf0avxxn--lcvr32dxn--od0algxn--wcvs22dxn--gmqw5axn--od0aq3bxn--mxtq1mxn--ciqpnxn--tn0agxn--gmq050iorgmilcomgobneteduiservwp2tempurlmircloudfreesitewpmudevmyfastgadgetcloudaccessjelehalfboltfastvpsemergenteasypanelopencraftizcombrendlynamefromrtpersoadultmedorgpolrelcomproartnetedufirminfoassoshopcoopgouvtmcomediahotelforumvideosportorgsexagrargameslakaseroticaerotikatozsdereklamcasino2000filmsuliinfoboltshopprivnewsszexcityutazasjogaszkonyveloingatlaneacaicogoormy\u1B29\u1B2E\u1B36milwebschnetkopbizzonedesaponpesxn--9tfkymyspreadshopgovmytabittabitorderravpageaccok12idforgnetgovmuniltdplcaccotttvorgcomnetmeca6g5gpgamubacaicniocoukuptverdruscsdelhiindorgmilcomwebnicfingenpronetintedugovresbizbiharbarsyinternetbusinessschooltravelsupabasealumnigujaratfirminfoaeropostbankcoopindevscloudnsno-ipbarsybarrell-of-knowledgebarrel-of-knowledgensupdategroks-thisdnsupdatefor-ourknowsitalldvrcammittwalddynamic-dnsv-infowebhopselfipdyndnshere-for-moreilovecollegemayfirstforumzcloudnsmittwaldservertypo3servergroks-theeusekd1cdndyndnsidrawsainaueuapjpusstagemocksysdevicesclientcustreservdcustdevdisrecprodtestingcobeebyteutwenteboxfusebravepstmndedynngrokorgmilcomnomnetedugovqcxqzzbarsythingdustmo-siemensrb-hostingfh-muenstergitbookbluebitecloudbeesusercontentnodeartkiloappsforgerockdarklangresinstagingapigeebubbleb-datascryptedhypernodedappnodepantheonsitegitlabgithubkeeneticvirtualservercleverappshostyhostingon-rioedugitticketstelebitwixstudioon-k3sicp0icp12038jeleqotolairbubbleappsmyaddrstolosmyrdbxwebflowdrive-platformbeagleboardhasura-applolipopdefinimavaporcloudmusicianwebflowtestazurecontainerresindevicereadthedocsloginlineeditorxmoonscalesandcatsbasicserverwebthingsbrowsersafetymarkbeebyteappbitbucketidaccovistablogorgschnetgovxn--mgba3a4f16axn--mgba3a4fraarvanedge\u0627\u064A\u0631\u0627\u0646\u0627\u06CC\u0631\u0627\u0646jclaspeziapdudcefegelemeperetevebacanatavaparasabgagfgogrgpgalclblimfmrmcbmbvbfclcmcvcrcpcchlimifibicivipirisimncnbnanenrnpntnnolomobocoaogorosopotoptvtatctbtmtltotpusulunutpspapaqsvpvvvtvavvrtrsrprgrfrcrbrarorkrvstsssbscsmsispzczbzbozen-suedtirolmyspreadshopxn--bulsan-sdtirol-nsbxn--valledaoste-ebbtrentinoaltoadigetrentin-sued-tirolxn--forlcesena-c8axn--forl-cesena-fcbxn--bozen-sdtirol-2obtriestetrentinsuedtiroltrentino-s-tirollecceudineaostesienaparmaluccapaviagenoapaduaaostamonzaabruzzoternirietiturinmilanbozenlaziofermoleccocuneonuoropratola-speziavdataaligfvgpugmolcalcamlomumbsicpmnvenvaoedugovabrsarmaremrbastoslazibxosfirenzetrentinos\xFCdtirolval-d-aostavalle-aostamessinacremonaravennatoscanatrentin-suedtirolbolognacalabriaurbinopesarofriuli-v-giuliaogliastraxn--valle-aoste-ebblaquilaandriatranibarlettasyncloudxn--valle-d-aoste-ehbaostavalleyvalled-aostatrentino-alto-adigevallee-d-aostexn--balsan-sdtirol-nsbpistoiasicilialucaniacataniaiserniaperugiabresciaveneziagorizialiguriaimperiabulsan-suedtirolbalsan-suedtirolbarlettatraniandriaxn--trentino-sdtirol-szbforl\xEC-cesenatuscanyvall\xE9e-d-aostemantovavall\xE9e-aostecasertapiemontevalleaostaval-daostafriulivgiuliatrevisoforli-cesenavall\xE9edaosteferrarapescaravald-aostatrentino-altoadigefriuli-vegiuliavallee-aostecarboniaiglesiastarantomediocampidanovalleedaostetrentinosud-tirolcampobassotrentins\xFCd-tiroltrentinos\xFCd-tirolmonzabrianzatrentino-s\xFCdtirolxn--trentino-sd-tirol-c3bpotenzacosenzavicenzaemiliaromagnavenicefrosinonemarchepordenonetrentinosued-tirolvaresemolisevall\xE9eaostefriuli-veneziagiuliabasilicatalatinaanconasavonaveronamodenabiellabolzano-altoadigepugliafoggiaumbriatrentino-stirolgenovapadovamateranovararagusapiacenzatrentinostirolvalleeaostetempio-olbiasudsardegnatrentinsudtirolmassa-carrarafriuliveneziagiuliatrentinosuedtirolandria-barletta-tranitrapanixn--cesenaforl-i8amaceratacaltanissettaascoli-picenobrindisicarraramassacagliaririmininapolivibo-valentiachietibulsan-sudtirolbalsan-sudtiroltrentino-a-adigebulsanbalsaniglesiascarboniamilanotorinoteramodell-ogliastraarezzotrentinoalto-adigerovigotrentovenetoiglesias-carboniatrentino-sud-tirolaltoadigereggio-emiliareggio-calabriasardegnatranibarlettaandriapiedmontxn--sdtirol-n2amedio-campidanotrentino-s\xFCd-tirolfriuli-vgiuliafriuli-ve-giuliaromeennaromapisa32-b16-b64-blodiastibarineencomonaplesforlicesenailiadboxosalessandriasicilytrani-barletta-andriaxn--trentin-sdtirol-7vbpesarourbinotrentinsued-tirolcesena-forliforl\xECcesenaemilia-romagnamonzaebrianzaxn--trentinsdtirol-nsbtrentinos-tiroltrentins\xFCdtirolvalledaostaolbia-tempiocampidanomediovibovalentiasassarivalle-daostalombardysud-sardegnafriulivegiuliareggioemiliamonzaedellabrianzaalto-adigevercellitrentin-sudtiroltraniandriabarlettatrentino-sudtirolascolipicenobozen-s\xFCdtirolfriulive-giuliaflorencexn--cesena-forl-mcbcarbonia-iglesiasaosta-valleycarrara-massadellogliastratrentinoa-adigexn--valleaoste-e7apesaro-urbinoxn--trentinosdtirol-7vbxn--trentin-sd-tirol-rzbxn--trentinsd-tirol-6vbtrani-andria-barlettatrentin-s\xFCd-tirolxn--trentinosd-tirol-rzbgrossetomonza-e-della-brianzas\xFCdtirolreggiocalabriatrentinoaadigetrentin-s\xFCdtirolverbano-cusio-ossolafriuliv-giuliaverbaniacampaniatrentino-aadigefriulivenezia-giuliasardiniaandriabarlettatranibarletta-trani-andriacatanzarooristanourbino-pesarocesena-forl\xECvalle-d-aostacampidano-medio123homepagesiracusatempioolbiasuedtirollombardiaavellinocesenaforl\xECtrentinofriuli-venezia-giuliabozen-sudtirolandria-trani-barlettabulsan-s\xFCdtirolbalsan-s\xFCdtirolmonza-brianzabolzanotrentino-sued-tirolbellunosalernolivornocrotonesondriodnshometrentinsud-tirolmassacarraratrentin-sud-tiroltrentino-suedtirolviterbobergamocesenaforliolbiatempiopalermobeneventoagrigentoofcoorgnetfmaitvphdengorgmilcomschnetedugovperagrikanieasukehandachitatokaiaisaikonanoharuamaobuhigashiuraowariasahiinuyamatobishimaiwakurashitarainazawatoyonegamagorimihamatoyotataharakariyayatomioguchikomakimiyoshinishiotokonamekiyosuchiryutoyohashiokazakiisshikikasugaikotakiratoeianjotogofusosetohazutsushimashinshirotakahamanisshinshikatsuhekinantoyokawaichinomiyatoyoakeodateogataakitaikawakyowahonjoogayurihonjonoshirokamiokakatagamimitanegojomeyokotekosakadaisenkazunonikahohonjyomoriyoshimisatohappoukamikoanihachirogatahigashinarusesembokufujisatokitaakitaitayanagiowanitakkomutsutsurutahirosakigonoheoirasetowadamisawanohejiaomorishingohiranairokunohehashikamitsugarushichinohehachinohenakadomarisannohekuroishisakaeisumiasahiotakiinzaiabikomatsudoyachiyomutsuzawakujukuriomigawakashiwatoganemihamanaritasakuranagaramobarahanamigawachoshishiroichoseikozakishisuikatorimidorichonankyonanfuttsuonjukufunabashinagareyamanodasosatakochuotohnoshourayasukimitsuyokaichibayotsukaidosodegauratateyamakamagayayokoshibahikariyachimatakatsuuratomisatokisarazukamogawaichikawanarashinoichinomiyashimofusaminamibososhirakoichiharaoamishirasatoikatahonaiainansaijoseiyoiyoozuuwajimaniihamanamikatamasakiuchikokihokutobetoonshikokuchuomatsuyamaimabarikamijimakumakogenyawatahamamatsunosabaeikedaobamasakaifukuiohionotsurugamihamawakasaminamiechizeneiheijikatsuyamatakahamaechizensoedaukihaomutaokawanishiogoribuzenonojosueumiokiotochikugosasagurisaigawamizumakishinyoshitomikurumekurateyamadakasuganakamamiyamanogatatakatahakataiizukakawaratagawakasuyaashiyainatsukimunakataminamitsuikishonaikurogifukuchikeisenhigashimiyakoshinguyukuhashiokagakiyamekogaongausuikahotohochuotoyotsumiyawakadazaifuhisayamatachiaraiyanagawanakagawahirokawachikujochikushinochikuhochikuzennamieotamaokumashowateneiiwakikoorinangoononishigoshimogoomotegomishimafukushimaasakawakagamiishishirakawaiitatefutabahiratayugawahanawakitakatakawamatakunimiyabukibandaihigashihironoyamatomiharuyamatsuriaizubangedatesomaaizuwakamatsuyanaizuaizumisatonishiaizuizumizakikitashiobarataishinkaneyamakoriyamainawashirotanagurafurudonosamegawasukagawaishikawatamakawaikedaogakitaruiginanenahashimahichisonakatsugawaibigawashirakawamizunamiminokamomitakekawauesekigaharatomikasakahogikitagatayamagatatajimianpachimotosuyaotsukakamigaharahidakanisekitokigujominogodoyorogifukasamatsutakayamawanouchihigashishirakawakasaharashimonitatsumagoichiyodakannakanrashowameiwakiryuotaoratomiokafujiokaitakuranaganoharahigashiagatsumatakasakishibukawaminakamikatashinatsukiyonokawabanumataannakaoizumimidorishintoisesakiuenoyoshiokakusatsutakayamanakanojonanmokutamamuratatebayashimaebashiotakekaitadaiwahongofuchukuietajimashobaramiharahatsukaichihigashihiroshimamiyoshikumanokurenakasakaseraseranishiasaminamifukuyamashinichionomichiosakikamijimajinsekikogentakeharaotobenanaeikedatohmaozoraobiraabirakyowaeniwataikibibaisharirebunerimohiroooketootarupippunishiokoppechitosefurubirahakodateshiranukakitahiroshimakushiroobihironanporoiwamizawaniikappukunneppufukushimanakasatsunaitoyourakuromatsunaiakabirakamisunagawashibechaurakawakamifuranonakatombetsuasahikawashimokawakayabeokoppebiratoriabashirisaromaatsumanumatahidakabifukamukawamikasahorokanaitoyotomisarufutsuhigashikawaishikarikitamiyoichiesashiiwanaitomariminamifuranoakkeshifuranotoyakoyakumootoineppushikaoishiraoinemuronayorohaboroashorobihororishirifujiutashinaihokutotakasuebetsuurausuassabukikonaishimamakinaiedatetoyabieinikiesanuryuoumuteshikagarikubetsuashibetsukimobetsuaibetsutobetsusobetsuembetsushimizuchippubetsurishirihokuryuhoronobeshintokutsubetsushibetsuhonbetsumombetsutsukigatakuriyamakoshimizushiriuchikutchanmurorannoboribetsukamishihorowassamushinshinotsukembuchiwakkanaikamoenaikiyosatotakinoueshikabesunagawafukagawanakagawatakikawakamikawahigashikagurahamatonbetsumatsumaemoseushirankoshishakotanimakanemashikeotofuketomakomaisandatambaitamiawajikasaiasagoshisoonoakoyashirotoyookaminamiawajiinagawafukusakitakasagokamigorikasugaharimayokawaashiyahimejiakashitaishiaogakisannantakinosumototakarazukanishinomiyashingugoshikinishiwakiyokatakaaioimikisayoyabukawanishiamagasakisasayamashinonsenkakogawaichikawakamikawatatsunotsukubaiwamaogawaasahisakaitokaioaraiitakobandodaigosuifuinaamikasumigaurakashimaomitamayachiyoshimodatetomobetoridehitachinakainashikisakuragawakasamayawaramoriyahitachiomiyanamegatayamagatahitachikamisuushikutakahagiibarakitonekoganakasowayukimihojosomitoryugasakishimotsumafujishirotsuchiurachikuseihitachiotashirosatotamatsukuriuchiharashikahakuinanaotsubatawajimakahokukawakitatsurugikaganominotosuzuuchinadakomatsuanamizunakanotohakusannonoichikanazawaiwateshiwafudaikawaimoriokaofunatohanamakikuzumakikitakamininohekunoheyamadayahabasumitaichinosekitanohatahiraizumirikuzentakatajobojiotsuchihironomiyakoiwaizumikarumaiichinohenodakujitonooshushizukuishifujisawamizusawakamaishikanegasakimannoutazukotohiraayagawazentsujihigashikagawauchinomikanonjisanukimarugamemitoyotakamatsutadotsunaoshimatonoshoakuneamamiizumihiokiyusuikinkoisasookouyamanakatanekagoshimakanoyaisenkawanabeminamitanemakurazakitarumizunishinoomotematsumotosatsumasendaioimatsudaayaseebinamiurazushinakaiodawaraiseharasagamiharahakoneaikawakaiseiatsugitsukuihadanoyamatoyamakitazamaoisochigasakininomiyayokosukakamakuraminamiashigarafujisawasamukawakiyokawahiratsukayugawaraokawaumajikochitsunootoyoakiinonishitosayasudahidakamiharasakawaniyodogawahigashitsunokagamigeiseisusakiotsukinaharisukumomurototosakamiochitoyotosashimizumotoyamanankokunakamurakitagawayusuharaogunichoyoukiasoutoozugyokutoamakusamifunetakamoriyamagaminamataminamiogunikikuchisumotoyamatonagasumashikiaraokumamotokamiamakusanishiharayatsushiroayabeseikasakyoideineujinakagyokameokakyotangokyotanabekyotambaminamiyamashiroyamashinatanabeyawatawazukaminaminantanmiyazuhigashiyamafukuchiyamakitamukokamojoyokizumaizuruujitawaraoyamazakinagaokakyokumiyamakawagoeinabeshimameiwaasahitaikiudonoisetsukisosakikuwanamihamamiyamasuzukatamakimisuginabarikumanokomonominamiisewataraitobakiwatakikihotadomatsusakayokkaichikameyamaureshinoishinomakishichikashukuohirataiwaosakizaohigashimatsushimashikamaiwanumashibataogawaraonagawakawasakiseminemarumoriminamisanrikukakudamuratawakuyatomiyanatoriwataritagajomisatotomekamirifushiroishimatsushimayamamotoshiogamafurukawahyugaebinotsunosaitoayakushimanobeokakitauramiyazakitakazakigokaseshiibamimatashintomikunitomikitakatakobayashikawaminamitakaharukijotakanabemiyakonojonishimeranichinankitagawakadogawamorotsukakisofukushimaminamimakisakaeobuseikedaogawamiasaokayaasahiotakiotarichinoinaomichikumakomaganechikuhokukaruizawayasuokaooshikaikusakaminamiaikitogakushimatsukawakawakamitateshinatakamorikitaaikishiojirimiyadahakubaiizunaiijimaiiyamamiyotasuzakayasakatoguraookuwanagawaminowahirayayamagataminamiminowafujimiomachisakakitakaginaganonakanosakuhokomoronagisoshinanomachiwadauedaiidaharasuwatomiachiaokianankisosakunozawaonsenagematsutakayamashimosuwamatsumotoyamanouchinakagawamochizukiazuminotatsunoobamaomuraseihiunzenosetofutsuikichijiwanagasakiisahayahasamisaikaikawatanasasebohiradokuchinotsugototogitsutsushimashimabarashinkamigotomatsuurayamazoekashibaikomakawaitenrioyodosangokoryoudaojiikarugayamatokoriyamatenkawakatsuragikurotakikawakamimiyakemitsuetakatorikamikitayamayamatotakadahegurishinjokanmakisakuraitawaramotogoseoudanarasoniandokawanishishimoichihigashiyoshinokashiharashimokitayamanosegawayoshinomintsivorytopazsakuragehirnsumomoaseinetopalmail-boxmokurenyoitamuikaojiyagosensanjoaganomyokoseiroagaomishibataniigatanagaokamurakamiuonumayuzawakariwatagamitainaitsunanminamiuonumatochioyahikojoetsuseiroukamosadoizumozakitokamachiitoigawasekikawakashiwazakitsubamemitsukekokonoesaikiusukibeppuusahimeshimakunisakihasamataketatsukumihitaoitahijikusuyufukujukamitsuebungoonobungotakadaibaraniimibizentsuyamaokayamakasaokahayashimayakagemaniwaakaiwamisakishinjotamanotakahashikibichuowakesojanagishookumenannishiawakurakurashikiasakuchisetouchikagaminosatoshotomigusukunakagusukuyaeseizenaurumaiheyaaguniogiminanjokinminamidaitokitanakagusukuyonaguniokinawaishigakikunigamiurasoekadenataramahiraraginozataketomishimojizamamitonakiitomanhigashimotobuyonabarugushikamionnanahanagohaebarukumejimakitadaitonakijinnishiharayomitanginowantokashikiishikawaikedasuitaminohizuminishisakaikananabenodaitoosakasayamayaokishiwadatadaokakaizukatondabayashichihayaakasakakumatorikadomasayamahigashiosakashijonawatehirakatataishimisakitajirihannansennankatanotoyonominatosettsuhigashiyodogawaibarakinosekitachuohigashisumiyoshifujiiderakashiwaraizumiotsutoyonakamatsubaramoriguchiizumisanoshimamototakatsukineyagawahabikinotakaishikawachinaganoyoshinogarikamiminearitaouchiimarihizenogikashimaariakekiyamafukudomikitagatakitahataomachigenkaikanzakinishiaritakyuragisagataratosutakushiroishikaratsuhamatamakouhokukawagoeyoshidasatteogoseirumaasakaurawaogawaniizaomiyayoriiotakishikihonjooganohannohanyuinasaitamaokegawaarakawayoshikawayokozehasudasayamahidakafukayachichibuiwatsukiryokamiyoshimikamiizumifujimiwarabiranzanmiyoshiminanoyashiosakadosugitomisatohigashichichibutodasokakukiyonokazoshiraokakasukabekounosukawajimatsurugashimamiyashirokitamotohatoyamamoroyamahatogayakumagayakawaguchinagatorokamisatomatsubushinamegawatokigawakamikawafujiminohigashimatsuyamakoshigayatokorozawas3isk01isk02ryuohkoseikonanaishorittotakashimamaibarahikonetorahimenishiazaikokagamokotoyasuotsukusatsunagahamamoriyamatoyosatotakatsukinotogawaomihachimanhigashiomiakagiunnanizumogotsuamayatsukakakinokimatsuehamadamasudahikawahikimiokuizumoyasugiyakumomisatotamayuohdahigashiizumookinoshimanishinoshimatsuwanoshimaneshimadafujiedayoshidashimodagotembaiwataatamikosaiyaizuitoizumishimahaibaramakinoharaomaezakikawanehonkannamisusonohigashiizufukuroinumazukawazufujiaraishizuokahamamatsushimizuizunokunimatsuzakimorimachiminamiizunishiizukikugawakakegawafujikawafujinomiyaujiietsugaoyamayaitaohiranikkoashikagakuroisokanumasakurashioyakarasuyamamotegiichikaikaminokawatochigihagamokanogisanobatonasumibunasushiobaranishikatautsunomiyaiwafunemashikoshimotsukeohtawaratakanezawaitanokomatsushimatokushimaichibaminamiaizumiwajikikainanmiyoshinarutomimamugiananmatsushigesanagochishishikuinakagawamachidachiyodakomaefussainagitaitochofufuchuomeotahigashiyamatotoshimaokutamaaogashimakodairaedogawaarakawahachiojishinagawatachikawashibuyasuginamihinodekiyosesumidaoshimanerimamitakahamuraadachinakanomizuhobunkyomegurominatokoganeihigashikurumekokubunjihigashimurayamamusashimurayamatamakitahinochuokotokatsushikakouzushimaogasawaraakishimakunitachishinjukusetagayamusashinohachijoitabashiakirunohinoharachizunanbukotouramisasawakasayonagokogehinoyazutottorinichinansakaiminatokawaharaoyabetairainamiasahinantoimizufuchutakaokakurobeyamadajohanatoyamatonaminyuzenfunahashinakaniikawanamerikawaunazukitogahimiuozufukumitsutateyamakamiichiiwadearidayuasainamitaijikatsuragiaridagawatanabemihamahidakakainankiminomisatoshingushirahamakamitondayurakozakoyagobokitayamawakayamakudoyamahashimotokushimotokozagawahirogawakinokawanachikatsuurarsuseroeoishidasagaeoguniasahinagaitendonanyoobanazawanishikawasakataohkuratozawamikawamamurogawayamagatafunagatatakahatashonaishinjokahokuiideyuzakawanishitsuruokakaminoyamayamanobeshiratakamurayamanakayamakaneyamahigashineyonezawasakegawamitouubeyuuabushimonosekitabuseoshimatoyotaiwakunihikarishunannagatohagihofukudamatsutokuyamashowadoshitsurunanbukoshukaiminami-alpsnirasakikosugeotsukioshinohokutominobuyamanashifuefukichuokofuichikawamisatoyamanakakonakamichitabayamanishikatsuranarusawafujikawahayakawafujiyoshidafujikawaguchikouenohara\u9577\u91CE\u4EAC\u90FD\u5C90\u961C\u5927\u962A\u4E09\u91CD\u7FA4\u99AC\u5343\u8449\u6ECB\u8CC0\u4F50\u8CC0\u5948\u826Fadednelgaccogogror\u79CB\u7530\u611B\u77E5\u9AD8\u77E5\u57FC\u7389\u6C96\u7E04\u6803\u6728\u718A\u672C\u5CA9\u624B\u9752\u68EE\u5C71\u68A8\u65B0\u6F5F\u5CF6\u6839\u9CE5\u53D6\u9577\u5D0E\u9999\u5DDD\u5BAE\u57CE\u77F3\u5DDD\u5927\u5206\u5BAE\u5D0E\u8328\u57CE\u5C71\u53E3\u5175\u5EAB\u5C71\u5F62\u5FB3\u5CF6\u5E83\u5CF6\u798F\u5CF6\u798F\u5CA1\u5CA1\u5C71\u5BCC\u5C71\u9759\u5CA1\u611B\u5A9B\u798F\u4E95\u6771\u4EACxn--4it168dhatenadiaryxn--vgu402ckawaiishophatenablogcocottenamaste\u5317\u6D77\u9053penneehimeiwateversestabachibashigagonnagunmapermahaccaakitaosakauh-ohblushkochiaichifukuikuroncapooitigohyogotokyokyotopunyuthickcheap0t00g00j0mie2-ddaapyawjg0amfemsubxiiboomoobutchueekpgwrgrherskrboyrdyupperunderflierchipsmydnsheavyangryhippygirlyrulez\u795E\u5948\u5DDD\u9E7F\u5150\u5CF6\u548C\u6B4C\u5C71bambinaxn--nit225kokayamasaitamaxn--k7yn95exn--1lqs03nsapporoparasitelolipopmcxn--efvn9sniigatafukuokatokushimafukushimahiroshimakagoshimafakefurokinawaxn--8pvr4ucoolblogxn--0trq7p7nnkawasakinagasakimiyazakichilloutxn--8ltr62kxn--klty5xpeeweezombiecutegirlxn--rny31hxn--uuwu58axn--ntso0iqx3axn--djrs72d6uytoyamanikitanyantakagawamimozanagoyaboyfriendxn--2m4a15egreaterchowderegoismyamagatafashionstorexn--elqq16hxn--pssu33lsendaimiyagixn--rht27zpecoriaomorisaloonwatsonvivianxn--djty4knobushipigboatnaganopinokoxn--f6qx53asadistvelvetsecretxn--5js045dchicappayamanashiibarakidigickgirlfriendxn--1lqs71dmongolianxn--c3s14mxn--qqqt11mtochigixn--5rtq34kparallelo0o0mondkobesagabonadecaoitanarafoolkilldecimainhiholomosblokilociaoundopupugifutankcrapflopnooroopsmodsholyjeezstripperpepperbittershizuokaxn--rht3dkitakyushureadymadeicurusversusmatrixxn--rht61ehungryfloppygloomycrankyhandcraftedlittlestarxn--klt787dxn--kltx9awhitesnowsunnydaytottorilovepoptheshopbuyshopxn--5rtp49cxn--d5qv7z876cwebaccelxn--kbrq7oxn--4pvxsxn--1ctwolovesickkumamotocatfoodxn--tor131oyokohamawakayamatonkotsuxn--ehqz56nxn--uist22hxn--6btw5axn--kltp7dyamaguchifrenchkisspussycatxn--4it797kxn--uisz3gbabybluexn--zbx025dnetgamersxn--7t0a264ckanagawaxn--6orx2rishikawaxn--ntsq17ghalfmoonschoolbusjellybeanxn--mkru45iusercontentlolitapunkxn--32vp30hsakurastoragehokkaidoshimanecandypopbabymilksupersaleweblikeraindropbackdropwebsozaikikirarahateblodaynightmeneacsccogoormobiinfoaeusxxorgmilcomnetedugovorgcomnetedugovbizinfotmprdorgmilcomnomedugovassnotairespresseassocoopgouvveterinairemedecinpharmaciensorgnetedugovtraorgcomedurepgovmeneperekgacscaiiocogoitoresmshsseoulbusanulsandaeguc01milvkimmvchungnamjeonnamjeonbukeliv-dnsgyeonggijejueliv-cdnincheondaejeongangwongyeongbukgwangjuchungbukgyeongnameliv-apicoeduindorgcomembnetedugovorgmilcomnetedugovjcloudorgcomnetintedugovperbnrinfocooyorgcomnetedugovipfscanvamypepw3sstorachakeeneticjoinmcinbrowserdwebcyonnftstoragemyfritzaemewphlxachotelltdorgcomwebsocschngonetintedugrpgovassnomgacsccoorgnetedugovbizinfo123websiteidorgmilcomasnnetedugovconfidmedorgcomplcschnetedugovaccoorgnetgovpresstmassoirseproxaccosoundcasthoptocraftvp4c66orgnetedugovitsmcdirmyboxbarsyedgestacksynologylogintonohostwebhopdiskstationi234tcp4hoocgroknoipprivmydsddnsdnsforlohmustransipdscloudfilegear-sgbrasiliafilegearframerbarsybarsyonlinecoprdorgmilcomnomedugovinforgcomnetedugovnameacprorgcomartnetedugovpresseinfoassoinstgouvorgnycedugovbarsydscloudjuorgcomnetedugovminisiteaccoororgcomnetgovorgmilcompronetintedugovbizmuseumnameinfoaerocoopaccoorgcomnetintedugovbizcooporgcomgobneteduorgmilcomnetedugovbiznameaccoorgmilneteduadvgovcoorgcomnetaltgovforgotherhiskeeneticispmanagernomassoprod5476132eastasiacentraluswesteuropewestus2eastus2rucdnwest1-usfra1-desandboxjls-sto1jls-sto3jls-sto2aglobalabglobalsslmapprodfreetlsmapvpslon-1lon-2ny-1fr-1sg-1ny-2paassnwebpaashostingjelasticnordeste-idcsocuserpagescwebfileblobservicebuscoreatlricnjsjelasticwebsitestoragesezagbinruhuukjptsmyspreadshopmynetnameakamaiorigin-stagingfrom-coipv64dynv6cdn77serveblogadobeaemcloudhicamsprytdnsupno-ipownipde5ovhicpfirewall-gatewaysytesmypsxbarsyusgovcloudapimyamazemyradwebakamaihdsaveincloudfastlylbfrom-lasubsc-paysquare7in-the-bandblackbaudcdnhomelinuxoninfernoctfcloudservebbsdns-dynamiccloudfrontakamai-stagingipifonyham-radio-opsenseeringclickrisingcommunity-profrom-nylocalcertgrafana-devedgesuite-stagingcloudflareanycasteating-organicatlassian-devmydattofeste-iplocaltotorprojectknx-serveredgekeycloudflareglobalcloudyclustercasacamserveftpakamaized-stagingakamaiorigindns-cloudmyeffectboomlabotdashbuyshousestwmailhetemlazure-mobilein-dslthruhereredirectmedynuddnsbouncemesupabaseluyanicloudappakamaicloudfunctionsdebiannhlfanpgafanstatic-accessin-vpnmysynologymafeloappudohomeftptrafficmanagersiteleafseidatmemsetcloudflarecloudaccesskeyword-onazure-apiis-a-chefdoes-itgets-itwebhopselfiphomeipkicks-assedgesuitewindowsserver-ontunnelmolemydissentscrapper-sitecloudflarecnuni5srcfggffiobbzabchrsndenodynuopikddnsvpndnsakadnselastxkinghostvps-hostfastlyhomeunixazureedgeshopselectdontexistmyfritzcloudjiffyalwaysdatasells-itsquaresbroke-itazurefddattolocalat-band-campmeinforumfamilydsazurestaticappsdefinimabplaceddnsaliasdynaliasnow-dnsblogdnsroutingthecloudendofinternetdsmynasakamaiedgemymediapcadobeio-staticakamaiedge-stagingakamaihd-stagingddns-ipprivatizehealthinsurancelive-onkrellianschokokeksmassivegridmysecuritycamerarackmazeserveminecraftfrom-azis-a-geekakamaizedmoonscaleoffice-on-theusgovtrafficmanageradobeioruntimeedgekey-stagingreserve-onlinechannelsdvrdnsdojousgovcloudappcdn77-sslapps-1and1podzoneazurewebsitesdynathomescaleforceyandexcloudvusercontentisa-geekcdn-edgescoaemalcesappwriteazimuthtlonarvonoticeablestorecomwebrecnetperotherfirminfoartslgdloncogoiltdorgmilcolcomplcschgenngonetedugovbiznamefirmmobiacincoorgmilcomnomwebgobnetintedubizinfocomyspreadshopdemongovtransurl123websitehosting-clusterkhplaycistrongsnesosvalerv\xE5lerxn--vler-qoaossandeheroysandeher\xF8yb\xF8boheroyher\xF8yxn--hery-iraxn--b-5gavalerb\xF8boxn--b-5gasandesandexn--hery-iraxn--vler-qoav\xE5lerh\xE5re\xE5laahavaofsfvfhlolnlalrlhmfmtmahcostntbu\xE5strmreigersundmyspreadshopg\xE1ls\xE1eidsvolltingvollgildeskalflor\xF8vads\xF8vard\xF8vanylvenxn--bhccavuotna-k7astrandaxn--kvnangen-k0axn--sknland-fxaxn--mosjen-eyarakkestadhyllestadnannestadvevelstadvaapstenordre-landsondre-lands\xF8ndre-landtjieltexn--vrggt-xqads\xF8r-aurdalsor-aurdalheradstordmoldefordef\xF8rdeseljefedjeryggehemnexn--krehamn-dxasognegranes\xF8gnebrynetjomevallebykletokkegiskedovretj\xF8mehob\xF8lvoldasaudatolgas\xF8mnaviknad\xF8nnasomnadonnatranafrananesnaraumasmolatr\xE6nafr\xE6nalesjasm\xF8la\xF8rstaorstahitrafloraaukraloppafr\xF8yarissasnasahalsagalsaromsaraisar\xE1isafroyasn\xE5sagronghobolfjelltydal\xE5rdalardalaskimharamkraanghkekr\xE5anghkesorumbarumhurumb\xE6rums\xF8rummodums\xE1l\xE1tb\xE1l\xE1tfrognbjugnv\xE5ganvagangulenskienl\xF8tenlotenstrynvefsnxn--merker-kuaskaunsveiob\xF8mlobomloskj\xE5kvardoflorovadsosalatbalats\xE1latkl\xE6buklabuselbubarduulvikskjakkleppris\xF8rxn--nttery-byaefl\xE5eidflahofmilgolholsellomskifetvikdepvgsfhsaskerrisorhamarasnes\xE5snesr\xF8rosrorosxn--slat-5namasoynaroyvaroyluroydyroyaskoyradoyandoyrodoymeloyrad\xF8yand\xF8yr\xF8d\xF8ymel\xF8yask\xF8ylur\xF8ydyr\xF8ym\xE5s\xF8yv\xE6r\xF8yn\xE6r\xF8yhoylandeth\xF8ylandetdivtasvuodnal\xF8renskoglorenskognesoddtangenxn--tjme-hraxn--smla-hraxn--stjrdal-s1aunjargalillehammerunj\xE1rgaxn--hamary-fyadavvenjargaxn--bearalvhki-y4a123hjemmesidegjerdrumxn--brnnysund-m8acxn--tnsberg-q1axn--mlatvuopmi-s4axn--snsa-roaxn--skierv-utaxn--brum-voatysfjordkvafjordeidfjordkv\xE6fjordsongdalenmjondalenmj\xF8ndalenxn--gls-elackragerog\xE1\u014Bgaviikagangaviikas\xF8rreisasorreisas\xF8r-varangersor-varangerxn--risr-iraskiervaxn--frna-woaxn--trna-woakvinesdalleksvikleirvikr\xF8yrvikroyrviksvelvikvenneslaevje-og-hornnessandnessj\xF8enmarnardalvindafjordsandefjordenebakksnillfjordullensvangxn--trany-yuabr\xF8nn\xF8ysundnamsskoganaustevollxn--stjrdalshalsen-sqbnord-aurdalnord-frontr\xF8gstadtrogstadgrimstadflakstadgjerstadxn--sandy-yuaxn--leagaviika-52bnore-og-uvdalvegarsheixn--rlingen-mxaxn--ggaviika-8ya47hveg\xE5rsheikarlsoykvitsoymasfjordenhamaroyinderoyosteroydavvenj\xE1rgasauheradguovdageaidnuxn--vre-eiker-k8abronnoysiellakkr\xF8dsheradkrodsheradkvinnheradbr\xF8nn\xF8yxn--mtta-vrjjat-k7afxn--lrenskog-54akvits\xF8yv\xE1rgg\xE1tkarls\xF8yoster\xF8yinder\xF8yhamar\xF8ybronnoysundxn--aurskog-hland-jnbbahccavuotnab\xE1hccavuotnagiehtavuoatnastor-elvdalmidtre-gauldalxn--gildeskl-g0akarasjokevenassixn--bievt-0qaxn--yer-znalebesbynessebyxn--hbmer-xqamalselvm\xE5lselvxn--unjrga-rtam\xF8re-og-romsdalmore-og-romsdalhareidmeland\xF8rlandorlandstrand\xE5lg\xE5rdsolundalgardafjord\xE5fjorddielddanuorrikautokeinoxn--stre-toten-zcbskodjeaejriestangeliernebamblestokkefauskesn\xE5asesnaasekongsvingerlangevagberlevagxn--flor-jrahattfjelldalostre-toten\xF8stre-totenvestfoldxn--mely-ira\xE1laheadjualaheadjunordreisaxn--troms-zuaxn--lgrd-poacporsangerflatangerstavangerleikangerbremangersamnangergieldakarasjohkaxn--rdy-0nabfrostautsirasnoasatromsaxn--sr-aurdal-l8aflekkefjordj\xF8lsterjolsteraremarkhedmarkn\xE5\xE5mesjevuemienaamesjevuemiexn--vard-jrarollagmer\xE5kermerakerorskog\xF8rskogxn--bdddj-mrabd\xE1k\u014Boluoktaxn--osyro-wuaaknoluoktatrysilskjerv\xF8ymandaljondalbindalrindalmeldalsuldalorkdalsigdalalvdall\xE6rdalhurdalsirdalverdallerdallardaloppdal\xE5seralaseralhadselkrager\xF8divttasvuotnaoverhallasteinkjerxn--hnefoss-q1askedsmokorsettroms\xF8xn--dyry-iravestre-totenmuseumxn--sandnessjen-ogbrahkkeravjufylkesbiblb\xE1jddarbajddarxn--laheadju-7yarennes\xF8yxn--koluokta-7ya57hxn--hgebostad-g3aleirfjordstorfjordbalsfjordb\xE5tsfjordbatsfjordmuos\xE1tbiev\xE1tloab\xE1tk\xE1r\xE1\u0161johkan\xF8tter\xF8yxn--mjndalen-64anordkappl\xE1hppilahppialstahaugsiljanverranr\xF8ykenroykenhaldenlyngenbergenhortenh\xF8nefosshonefosstroandinbeiarnvarggatosoyroos\xF8yrotromsoidrettmuosatbievatruovatloabatvoagattynsetnessetxn--indery-fyask\xE1nitskanitraholtr\xE5holtxn--ystre-slidre-ujbandebusarpsborgbearduxn--karlsy-fyahordalandjorpelandj\xF8rpelanddeatnuringsakers\xF8r-odalsor-odalxn--slt-elabringerikeaudnedalnittedalnissedalhemsedalslattumsurnadalxn--blt-elabelverumstj\xF8rdalnaustdalhjartdalgj\xF8vikfyresdalhasviknarviklarvikgjovikmalvikgamviklenvikporsgrunnstjordalengerdaldrobakdr\xF8bakxn--msy-ula0hvestvagoyxn--vgan-qoaxn--ryken-vuaxn--lten-graxn--stfold-9xaxn--hpmir-xqaxn--lury-iram\xE1latvuopmimalatvuopmitysv\xE6rkirkenesbirkenesmoskenesb\xE1id\xE1rxn--fjord-lraxn--rdal-poabahcavuotnab\xE1hcavuotnaxn--frde-gralind\xE5sbearalvahkixn--hobl-irar\xE1hkker\xE1vjuxn--loabt-0qav\xE5g\xE5\xE1lt\xE1bod\xF8sundlundrader\xE5deetnetimeholeauregrueoddavagavegaranatanaarnasolasulaaltalekafusavangbergkvam\xE5mliamlibokntinnroangranosenoslobodor\xF8stroststat\xE5motamotivgupriv\xF8yeroyerliermossvossxn--nvuotna-hwalusterlunnermarkerh\xE1bmerhabmerhvalerfjalerxn--rholt-mratysvarbaidarfitjargaularh\xE1pmirhapmirmelhusfosnes\xF8ksnesoksnestysneshemnesevenesflesbergeidsbergtonsbergt\xF8nsberglindasxn--sndre-land-0cbnamsosxn--srum-gra\xF8ystre-slidreoystre-slidrevestre-slidretrondheimbalestrandxn--langevg-jxaaustrheimxn--skjk-soavagsoyaveroysandoykarmoyfinnoytranoyvestbytranbysykkylvenxn--hyanger-q1aspjelkavikandasuoloxn--fl-ziaxn--drbak-wuastathellexn--sr-varanger-ggbtelemarkxn--bhcavuotna-s4axn--porsgu-sta26f\u010D\xE1hcesuolocahcesuoloakrehamn\xE5krehamnsand\xF8ykarm\xF8yfinn\xF8ytran\xF8yv\xE5gs\xF8yaver\xF8ynamdalseidxn--lesund-huabadaddjaxn--vegrshei-c0axn--btsfjord-9zagildesk\xE5lporsanguxn--trgstad-r1an\xE1vuotnanavuotnahammerfestxn--sgne-graxn--brnny-wuacibestadharstadnarviikaeven\xE1\u0161\u0161ivestnesgjemnessandnesagdenesrennesoyxn--avery-yuaxn--tysvr-vrabearalv\xE1hkikongsbergspydebergrandabergxn--andy-iradavvesiidaxn--krdsherad-m8apors\xE1\u014Bgufredrikstadbjerkreimringeburennebuaurskog-holandnotteroyxn--vgsy-qoa0jxn--rmskog-byaskierv\xE1ivelandbyglandfrolandaurlandforsandxn--bjddar-ptamidsund\xE5lesundalesundfetsundfarsundovre-eiker\xF8vre-eikerakershusxn--moreke-juas\xF8rfold\xF8stfoldostfoldsorfoldh\xF8yangerhoyangerlevangerorkangertanangerxn--vestvgy-ixa6olillesandulsteinxn--rennesy-v1agranvinskjervoyxn--klbu-woalavagisxn--h-2faxn--ryrvik-byakafjordk\xE5fjordseljordfolkebiblxn--gjvik-wuajevnakerxn--kfjord-iuabudejjuxn--kranghke-b0axn--davvenjrga-y4axn--rland-uuaxn--ldingen-q1axn--mlselv-iuaxn--rady-iraxn--linds-prabrumunddalxn--ygarden-p1amo-i-ranaeidskogr\xF8mskogromskoghjelmelandxn--finny-yuaxn--sr-odal-q1axn--skjervy-v1aballangenkvanangenkv\xE6nangengratangenxn--hmmrfeasta-s4acvossevangensuohkanxn--rde-ulaxn--mli-tlaxn--ksnes-uuanordlandskanlandsk\xE5nlandsortlandfuoiskuxn--rros-graxn--hcesuolo-7ya35bxn--eveni-0qa01gagaivuotnag\xE1ivuotnaxn--seral-lradrammenmodalenmosjoenjan-mayentorskensteigengloppenxn--snes-poamatta-varjjatxn--sr-fron-q1aomasvuotnajessheimb\xE5d\xE5ddj\xE5xn--krager-gyaxn--kvfjord-nxaxn--asky-iraxn--snase-nraxn--bidr-5nacholt\xE5lenxn--vads-jraxn--jlster-byamosj\xF8enxn--rst-0nastavernxn--ostery-fyaxn--oppegrd-ixaxn--sknit-yqaxn--risa-5naoppeg\xE5rdskiptvetrendalenholtalenxn--mot-tlaxn--lhppi-xqaxn--holtlen-hxaxn--srreisa-q1akopervikxn--muost-0qaxn--bmlo-grahokksundkvalsundegersundxn--karmy-yuaullensakerxn--hylandet-54axn--kvitsy-fyaxn--bod-2nalangev\xE5gberlev\xE5gkristiansandxn--rsta-frahornindalstj\xF8rdalshalsenstjordalshalsensandnessjoenh\xE1mm\xE1rfeastaxn--lrdal-sras\xF8r-fronsor-fronnord-odalkristiansundm\xE1tta-v\xE1rjjatvestv\xE5g\xF8ynesoddennotoddenbuskerud\xF8ygardenoygardensalangenlavangenralingenr\xE6lingenlodingenl\xF8dingenlea\u014Bgaviikalaakesvuemieleangaviikauenorgexn--srfold-byaaskvollxn--rskog-uuaxn--nry-yla5gxn--vry-yla5ghammarfeastaxn--rhkkervju-01afxn--givuotna-8yakommunekrokstadelvanedre-eikerhagebostadh\xE6gebostadxn--berlevg-jxakviteseidxn--s-1faxn--l-1faxn--nmesjevuemie-tcbafuosskomo\xE5rekemoarekexn--lt-liacxn--jrpeland-54asvalbardoppegardholmestrandtvedestrandsogndalsokndalarendalsunndalfolldalxn--krjohka-hwab49jlyngdaletnedalnorddalsaltdalgausdalskedsmovaksdalgjesdalstordalxn--frya-hraaarbortedrangedalxn--smna-graaurskog-h\xF8landxn--vg-yiabtjeldsundhaugesundlindesnesxn--mre-og-romsdal-qqbxn--dnna-gradynheremerseineshacknetenterprisecloudmineaccomaorim\u0101oriorgmilcriiwigennetschoolhealthkiwigovtgeekxn--mori-qsacloudnsparliamentcomedorgcompronetedugovmuseumwebsitekinservicebarsywebsitebuildereerobookheimdnsleapcelleero-stagetechcrscsslorigingohomecdbedeeeiemesecabgngilnlalplchfisiincnnoroptatitmtltruauhulumkdkukskjplvtrgrfrkrhrusesismycynzcznetinteduassoososcloudstgbetaaezaeuhkusjshatenadiarycdn77hoptozaptois-a-knightmyftpno-ipjpnddnssdpdnsspdnsbarsysweetpepperis-a-bruinsfanis-very-sweetservegameis-a-soxfanhomelinuxcdn77-secureservebbsmisconfusedwebredirectblogsitefreedesktopcouchpotatofriestoolforgeaccesscamis-lostreadmyblogsmall-webfedorapeopleserveftpis-a-celticsfanmywirepotagertwmailin-dslsellsyourhomeread-booksfreeddnscable-modemis-savednflfanufcfanmlbfanstuff-4-saleendoftheinternetin-vpnmy-firewallhomeftpis-localis-a-chefboldlygoingnowherewebhopselfipkicks-assroxatunkcamdvrfedoraprojectgotdnsdvrdnsdyndnspubtlspimientahomeunixdontexistfedorainfracloudwmflabsfspagesbmoattachmentsteckidsfamilydsdnsaliasdynaliasnow-dnscloudnsdoomdnsduckdnsblogdnshomednsroutingthecloudendofinternetdsmynasip-dynamicpoivronhttpbinmyfirewallis-very-evilmysecuritycamerais-a-linux-userwmcloudis-a-geektuxfamilyis-a-candidatedoesntexistis-very-badhobby-sitegame-hostaltervistais-foundis-a-patsfandnsdojohepforgepodzonedynservcollegefanis-very-goodfrom-meis-very-niceisa-geeknerdpolacmedsldingorgcomnomgobabonetedupleskaemhlxmyboxrockyprvcydeuxfleurspdnscodebergheyflowstatichostorgmilcomnomgobneteduorgcomeduiorgmilcomngonetedugovcloudns1337ngrokacorggogfamcomwebgobnetedugokgopgkpgovgosbizpasaugumicsopozpapuwmwsrprusiskwpspkppspkmpspokeoiawsawifoumsdnskokwpmuppuppsppiwwiwoowuzswkzoschrzpisdnwzmiuwwitdpssewsseumigugimoirmpinbwinbwiihupporzgwgriwupowwskrwioswuozstarostwokonsulattmpccopruszkowmyspreadshopostrodakartuzyopolegminamediaustkazgorajgoraolawailawalomzawloclradombytomjaworznotargilubinkoninzagantorunkutnokepnonakloczestsopotsanokturekplockslasksklepzarowlukowmedaidgdaorgmilrelcomnomatmgsmartneteduelkgovwawsossexbiztgorysejnytychypomorzeboleslawiechomesklepsdscloudunicloudzakopanelegnicarawa-mazbydgoszczswidnikkrasnikwloclawekbielawamragowograjeworealestatebeskidykaszubymalopolskaprzeworskswiebodzinlecznadfirmaszkolawarmiagdyniamiastakazimierz-dolnymalborkswidnicadlugolekaostrolekapodlasieelblagtravelsimplesitezachpomormielecszczecinnieruchomosciwalbrzychlezajsklublinbedzinpoznanwielunmielnooleckostarachowicedkontopowiatwroclawrybniksuwalkileborkslupskgdanskostrowwlkptarnobrzegtourismwegrowkrakowglogowyou2pilanysamailwrocinfoagroautobeepshopprivlapypiszlodzcfolksecommerce-shopmazurypulawyskoczowrzeszowpomorskiezgierzkaliszolkuszlowiczostrowiecsosnowiecmazowszewodzislawbialowiezazgorzeleckatowicepabianicejelenia-gorawolominkarpaczsieradznowarudaczeladzkonskowolaskierniewiceswinoujscieturystykabieszczadycieszynketrzynolsztynbialystokbabia-goraprochowicewarszawastalowa-wolapolkowicegorlicegliwiceponiatowalimanowalubartowaugustowkobierzyceopocznognieznoszczytnokolobrzegshoparenapodhalebielskoklodzkostargardatwithplayitownnamecoorgnetedugovacorgcomproestnetedugovbiznameislaprofinforechtngrokmedaaaacacpaenglawjurbarbarsykeeneticavocatacctcloudnsorgcomsecplonetedugov123paginaweborgcomnetintedugovnomepublidkinbarsygovx443cloudnsorgmilcomnetedugovcooporgmilcomschnetedugovnamecomcannetlibassoaemclantmcontstoreorgcomnomrecwwwbarsyfirminfoshopartsstackitmyddnswebspacelima-cityacincooxorgedugovbarsybrendlyhbvpsvpsspectrumlandinghostingacppmordoviamcprecbgorgmilcomspbnetintedumsknovgovbirrasmcdirmytismircloudvladimirnalchikadygeyamarinepyatigorskmyjinobashkiriaeurodirvladikavkazna4ugroznykustanaikalmykiacldmaildagestaniranbuildcanvaliaravalwixdevelopmentappwritemigrationneedleverceldatabasestackitcodereplravendbonporterlovableaccoorgmilnetgovcoopmedorgcompubschnetedugovservicemecomygovorggovtvmedorgcomnetedugovinfoedgfacbmlonihkutwpsryxzbdtmacfhppmyspreadshopbrandpartiorgcomfhvpress123minsidaitcouldbeworlanbibkommunalforbundfhskiopsyskomvuxkomforbnaturbruksgymnloginlineorgcomnetedugovenscaledeuusentbotdaorgmilcomnetgovnowteleporthashbangplatformlovablebarsyshopwarebasehoplixbarsyonlinemsf5gitappgitpagewawamscofigma-govcaffeinefigmacanvasoltstscwputerbarsysupportchatgptsquareomniweopensocialcpanelplaycodenotionnovecorewpsquaredpreviewjelecyonbyensrhtfastvpspieboxconvexjouwwebheyflowplatformshloginlinemadethissourcecraftclouderaorgorgcomartedugouvunivmeorgcomnetedugovsurveysstatichfheiyuxs4allprojectmyfastubervibehostapp-ionosdeployagentmecoorgcomschnetedugovbizcncostoreorgmilcomneteduembaixadaconsuladokiraranohoprincipesaotomeheliohobarsystorebaseshopwaresellfyabkhaziavologdamordoviapenzalenugsochinavoiexnetspbmsknovnorth-kazakhstanashgabadkareliaarmeniageorgiavladimirnalchikivanovobukharaadygeyakhakassiakalugakrasnodarjambylaktyubinsktroitskbryanskobninskkurganazerbaijanpokrovskbashkiriatselinogradvladikavkazmurmansktulatuvamangyshlaktashkentchimkentgroznykaragandatermezarkhangelskkustanaikalmykiabalashoveast-kazakhstankaracoldagestantogliattibarsyredorgcomgobedumirenknightpointaccoorgjelasticdiscoursecleverappsschacmiincogoornetonlineshopcogoorgmilcomwebnicnetintedugovbiznametestcoorgmilcomnomnetedugovorangecloudpersoindorgcomfinnatnetgovensmincomtourismintlinfox0611oyaorgmilcomnetedugovquickconnectvpnplusnettprequalifymeaddrmyaddrntdllwadlnctvavdrk12orgmilpolbeltelcomwebgennetedutskkepgovbbsbiznameinfocoorgmilcompronetedugovbiznameinfobetter-thanworse-thansakurafromdyndnson-the-webmymailerorgmilurlcomneteduidvgovmydnsgameclubebizmeneacsccogotvorhotelmilmobiinfovodteiflgplkmsmsbcckhincndnvncoztltmkckppzpdprvcvkvlvcrkrkscxuzchernovtsyrivneyaltaodesavolynrovnolutskltdinforgcomnetedugovbizvinnicazhitomirternopilpoltavakropyvnytskyizaporizhzhiasevastopolsebastopoluzhgoroduzhhorodkharkovkharkivvinnytsiakhmelnytskyizaporizhzhecrimeaodessazhytomyrnikolaevcherkassydonetskluganskluhanskkirovogradivano-frankivskchernivtsikrymkievkyivlvivsumyzakarpattiamykolaivcherkasychernigovkhersonchernihivdnipropetrovskdnepropetrovskkhmelnitskiyneacsccogoorusorgmilcomedugovmyspreadshopadimono-ipbarsybarsyonlinelayershiftnh-servretrosnubapicampaignservicelugaffinitylotteryweeklylotteryraffleentrygluglugsmeaccoindependent-inquestnimsitecopropymntltdorgplcschnetgovnhsbarsyindependent-commissionindependent-reviewpolicepublic-inquiryindependent-panelconnhospindependent-inquiryroyal-commissionoraclegovcloudappscck12libccphxcclibpvtparochchtrcck12libcceatonk12coglibtecgendstmusann-arborwashtenawcck12glghcck12sealibforksolympiabainbridge-islkeyporthoquiamyarrow-pointcentraliaport-townsendsequimport-ludlowrentonsilverdalebremertonredmondsheltonbellevueport-orchardport-angeleskingstonchehalisaberdeengig-harborseattlepoulsboidmdndsddemenegacalamaiavawapailalflnmdcncscohnhmihiviwiriinmntnmocoutvtctmtgunjokakwvnvprarorasmskstxwynykyazisadninsnngosrvis-bymircloudservernamepointtoenscaledland-4-salefreeddnsstuff-4-saleazure-apinoipcloudnsgolffanheliohostazurewebsitesgvorgmilcomgubneteducoorgcomnetd0egvorgmilcomnetedugovmydnsiacostoree12orgmilcomnomwebgobbibrectecnetintedugovraremprendefirminfoartseducok12orgcomnethidnsidacaiiosonlahanamhanoicamauhueorgcompronetintedugovbizbacninhtayninhhoabinhnamdinhtravinhhaiphongvinhlonghaiduongquangnamquangtrithuathienhuequangninhbacgianghaugiangquangbinhsoctrangbentrethanhphohochiminhdanangkontumhatinhkhanhhoathanhhoahealthgialailaocaiyenbaibackanngheanlonganphuyenphuthocanthodaklakdongnainameinfovinhphucdongthapkiengiangtiengiangquangngailaichaulangsonlamdongdaknonghagiangangiangcaobangbinhduongninhthuanbinhthuanbaclieuthaibinhninhbinhbinhdinhtuyenquanghungyenbaria-vungtauthainguyendienbienbinhphuocschbizputerimagine-proxyorgcomnetedugovcloud66advisormypetsdyndnsxn--8dbq2axn--4dbgdty6cxn--5dbhl8dxn--hebda8bxn--80auxn--d1atxn--c1avgxn--o1acxn--o1achxn--90azhxn--55qx5dxn--uc0atvxn--od0algxn--wcvs22dxn--gmqw5axn--mxtq1mxn--12c1fe0brxn--h3cuzk1dixn--12co0c3b4evaxn--12cfi8ixb8lxn--o3cyx2axn--m3ch0j3axn--j1adpxn--90amcxn--90a1afxn--h1ahnxn--j1ael8bxn--h1alizxn--c1avgxn--j1aefxn--80aaa0cvacxn--41acaffeineexeopentunnelbotdashtelebitorgtmaccoagricorgmilnomwebnicngonetaltedugovlawnisschoolgrondaraccoorgmilcomschnetedugovbizinfoprg1-zeropstritonstackitlimazeropsaccoorgmilgov\u044F\u0441\u043F\u0431\u043E\u0440\u0433\u043A\u043E\u043C\u043C\u0441\u043A\u0431\u0438\u0437\u043C\u0438\u0440\u0441\u0430\u043C\u0430\u0440\u0430\u043A\u0440\u044B\u043C\u0441\u043E\u0447\u0438\u0430\u043A\u043E\u0434\u043F\u0440\u043E\u0440\u0433\u043E\u0431\u0440\u0443\u043F\u0440\u05E6\u05D4\u05DC\u05DE\u05DE\u05E9\u05DC\u05D9\u05E9\u05D5\u05D1\u05D0\u05E7\u05D3\u05DE\u05D9\u05D4\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E23\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08\u0E23\u0E31\u0E10\u0E1A\u0E32\u0E25\u0E28\u0E36\u0E01\u0E29\u0E32\u0E17\u0E2B\u0E32\u0E23\u0E40\u0E19\u0E47\u0E15\u6559\u80B2\u7DB2\u7D61\u7D44\u7E54\u516C\u53F8\u653F\u5E9C\u500B\u4EBA\uB2F7\uB137\uD55C\uAD6D\u6FB3\u95E8\u65B0\u95FB\u6FB3\u9580\u8054\u901A\u5BB6\u96FB\u5609\u91CC\u62DB\u8058\u901A\u8CA9\uB2F7\uCEF4\uC0BC\uC131\u30B3\u30E0\u10D2\u10D4\u0431\u0433\u0440\u0444\u0435\u044Eadcdbdgdidmdsdtdaebedeeegeiejekemenepereseveyegabacalamanauavapaqasazacfbfafgfnfpfwftfbgcgagggegkgngmgsgpgvgtgugilmlnlalclglplsltlhmimjmkmmmomambmcmdmfmgmzmpmsmtmgbbblbsbecccacnclcmcvctcscmhkhghchbhthphshlinikifigiaibicivisikninhnmncnbngnsnpnvntnjoionomobocoaofodorosotoptstttytatbtetgtithtmtltrusuvuaucueuguhulumunufjdjbjtjsjlkmkhkfkdkcktkukskpkgpmpnpkpjpgqaqmqiqsvtvcvbvmvlvrwpwtwzwbwcwawgwkwmwtrsrprgrfrercrbrarnrmrlrkrirhrwsusrssspsgsesbsaslsmsissxmxaxcxuypysylymykygybycyuztzsznzmzkzdzczbzaz\u03B5\u03BB\u03B5\u03C5\u4E16\u754C\u53F0\u7063\u8D2D\u7269\u516C\u76CA\u70B9\u770B\u81FA\u7063\u7F51\u7EDC\u66F8\u7C4D\u5728\u7EBF\u7F51\u7AD9\u624B\u673A\u673A\u6784\u5927\u62FF\u6E38\u620F\u4FE1\u606F\u53F0\u6E7E\u8C37\u6B4C\u6148\u5584\u5546\u6807\u9999\u6E2F\u4E2D\u56FD\u9910\u5385\u7F51\u5740\u4E2D\u570B\u5546\u57CE\u98DF\u54C1\u5FAE\u535A\u653F\u52A1\u79FB\u52A8\u96C6\u56E2\u516C\u53F8\u516B\u5366\u5546\u5E97\u5065\u5EB7\u7F51\u5E97\u653F\u5E9C\u65F6\u5C1A\u4F5B\u5C71\u4E2D\u4FE1\u5A31\u4E50\u5E7F\u4E1C\u4F01\u4E1Ahomedepotengineering\u0627\u0645\u0627\u0631\u0627\u062Arepublicankuokgroupversicherungchannelcitadelxn--pgbs0dhxn--b4w605ferdstatebankwebsitexn--mgb9awbf\u4E9A\u9A6C\u900A\u6DE1\u9A6C\u9521alibabaxn--ngbc5azdxn--mgbbh1axn--45br5cyltoshibabuildworldcloudtradeguideplacespacedancemoviephoneprimesmilebiblestyleappleazurestoreskypegripexn--l1accdrivelottehorsehouseleasechasereisestadahondaomegaaetnaamicaninjanokiamediadeltavodkaedekaosakapizzaslingemailgmailtirolshelltmallfinallegaltotalhotelamfamforumrehabmusicciticricohcoachwatchboschearthfaithirishmiamiarchidubaiguccipraxi\u307F\u3093\u306A\u30B9\u30C8\u30A2\u30BB\u30FC\u30EBcanonsalononionnikonepsonkoelngreensevencrownikanoradioaudioweiboglobopromogalloyahoociscorodeovideomangobingotokyovolvolottokyotophotosmartsportquesttrusthyattjetztadultcymrubaidutushuxn--kprw13dubankclickblackmerckgroupsharpcheapnowtvxn--h2brj9c\u05E7\u05D5\u05DD\u0570\u0561\u0575\u043E\u0440\u0433\u0441\u0440\u0431\u043C\u043E\u043D\u043A\u043E\u043C\u0431\u0435\u043B\u043C\u043A\u0434\u049B\u0430\u0437\u0440\u0443\u0441\u0443\u043A\u0440\u0645\u0635\u0631\u0642\u0637\u0631\u0639\u0631\u0628\u0643\u0648\u0645dadcfdmedwedredphdthdbidpidkrdmsdltdiceonewmeglemoerwecfageacbanbambaaaammakianraspacpaaxawtfbcgaegongingaigvigorgdogdhlmilrilonlaolloluoljllcalgalnflafltelsrlfrllplkimibmcamcombommomifmabbjcbscbwebcabnabtabmlbpubabcbbcnecincpncllcstcwtcpwcnyckfhbzhovhmoiskiobisbitcifyituipinvinwinxincbnbcnmanfangdnmenrenkpnmtnyunrunfununobiojioriohbogmofooboooooacoecoceongoproartistottnttbbtcateatlatvetpetbetnethktmitfitintjothotgotdotbotprueduicujnjyouinknhktdkappsapgapmapdnptopgopllpjmpzipvipripesqtrvdtvitvdevmovgovhivnrwlawsewnewbmwwownowhowdvrftrmtrsfrbarcartvscrseusawsupsubssbsadsddsldssasbmsmlsxxxboxfoxgmxtjxsextaxbuyflydiysoyjoyskypaydaygayxyzanzbizwebersenerpokerlameractortatarsolar\u0EA5\u0EB2\u0EA7\u0E04\u0E2D\u0E21\u0E44\u0E17\u0E22tourslocusnexuslexusgiftsbeatsboatspartspressglassswiss\u0915\u0949\u092E\u0928\u0947\u091Ftiresgivescodeshomesgamestunesshoescardswalesloansvegastoolsdealsautosparis\u30D5\u30A1\u30C3\u30B7\u30E7\u30F3workssucksrocksxeroxforexfedexpartylillymoneystudyrugbytoraytoday\u4E2D\u6587\u7F51xn--unup4y\u5929\u4E3B\u6559\u98DE\u5229\u6D66\u65B0\u52A0\u5761enterprises\u6211\u7231\u4F60\u5609\u91CC\u5927\u9152\u5E97christmasxn--fct429kholdingsxn--8y0a063axn--mgbx4cd0ablifestyleabogadoallstatenetbank\u0643\u0627\u062B\u0648\u0644\u064A\u0643xn--s9brj9cxn--gk3at1ebestbuycharityxn--55qx5dmicrosoftpropertybasketballhomegoodscorsicajewelrygallerygrocerysurgerycountrybrusselsverisignferreroxn--czr694bhdfcbankcommbanksoftbank\u067E\u0627\u0643\u0633\u062A\u0627\u0646\u067E\u0627\u06A9\u0633\u062A\u0627\u0646nextdirect\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0647\u0627\u0644\u0639\u0644\u064A\u0627\u0646xn--h2brj9c8cxn--80adxhksshikshaxn--mgbai9azgqp6jcuisinellabarclayscatholicxn--kpry57dcompanyxn--xhq521bblackfridayxn--mgba3a3ejtsandvikxn--d1acj3bacademydownload\u0645\u0644\u064A\u0633\u064A\u0627xn--j1amhxn--w4r85el8fhu5dnraipirangaathletaxn--fhbeixn--mgbqly7cvafrzuerichxn--c2br7g\u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8contractorsxn--io0a7igraphicsinsurancetemasekxn--xkc2al3hye2amotorcyclesphotographydirectoryplumbingxn--vhquvclothingtrainingcleaningwilliamhilllightingxn--mgba3a4f16ashoppingcateringeducationokinawapicturesventuresproductionsxn--9et52uwalmart\u0D2D\u0D3E\u0D30\u0D24\u0D02supportrealestatecapitalonexn--nqv7fs00emaauspostfloristdentistxn--qxamgodaddybradescobargainsmitsubishikerryhotelsxn--9dbq2axn--3pxu8kimmobilienxn--fjq720axn--mgbtx2bholidaymckinseymadridbusinessbuildershelsinkixn--4gbrim\u043C\u043E\u0441\u043A\u0432\u0430\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u0629coffeedegreelacaixapartnersalsaceofficeabbvievoyageorangegeorgeonlinechromemobilekindlegoogleoraclecircleschulesecureinsurexn--mgba7c0bbn0aestatexn--mgbc0a9azcgcruisehangoutxn--vuq861bxn--42c2d9arexrothfirestoneuniversityxn--nnx388alifeinsuranceextraspace\u043E\u043D\u043B\u0430\u0439\u043Dverm\xF6gensberatersoftwarexn--fiqs8sxn--mgbab2bdxn--w4rs40ltienda\u092D\u093E\u0930\u0924\u092E\u094Dafricatoyotaotsukasakuracameracreditcardnagoyaconsultingnetworkjunipertheatermonsterprogressivepioneerxn--55qw42gracingdatingvotingvikinglivinggivingxn--bck1b9a5dre4cbrotherweatherjoburg\u0641\u0644\u0633\u0637\u064A\u0646lplfinancialxn--clchc0ea0b2g2a9gcdfutbolschoolsocialglobaldentalwoodsidechanelairtelmatteltravelrealtorwebcamstream\u0C2D\u0C3E\u0C30\u0C24\u0C4Dunicomalstomxn--nodexn--6frz82gmuseumfurniturexn--rvc1e0am3exn--mix891faccenturexn--11b4c3dismailineustardiscountquebeccomsecclinicservicesxn--y9a3aqxn--c1avgswatchchurchsearch\u0627\u0644\u0627\u0631\u062F\u0646marketingcontacthealthmonashshoujisanofitaipeiamericanexpresssuzuki\u30A2\u30DE\u30BE\u30F3\u30AF\u30E9\u30A6\u30C9\u30DD\u30A4\u30F3\u30C8bharti\u30B0\u30FC\u30B0\u30EBxn--mgberp4a5d4armemorialxn--1qqw23alondonmormoninstitutevisionbostonnortoncouponmaisonamazonvirginberlindesigndurbanolayannissananquanxihuanhitachikaufengardenreisenbayerntechnologydatsunxn--90a3aclatinocasinostudiophysioxn--ngbe9e0apharmacytattootaobaoaramcoexpertreportabbottdirectselectimamatfairwindspictettargetmarketintuittravelersinsurancecreditdupontryukyusuppliesxn--tckwebnpparibasschmidtmerckmsdyodobashirestaurantbridgestonecricketxn--fpcrj9c3dbostikbroadwayattorneylefrakemerckxn--fiq228c5hscareersfarmerswinnersflowersxn--wgbh1cguitarsxn--54b7fta0ccxn--p1acfmakeupgalluplandroverxn--kcrx77d1x4agoldpointbauhausxn--mgbayh7gpahiphopplaystationxn--mgba3a4fraxn--eckvdtc9dhyundaixn--gckr3f0fistanbulticketsmarketsflightschintaireviewsxn--3e0b707ewindowsxn--fiqz9sfinancialxn--fzys8d69uvgm\u0627\u0628\u0648\u0638\u0628\u064Adiscoverreview\u09AC\u09BE\u0982\u09B2\u09BExn--5su34j936bgsgmoscowobserverapartments\u0434\u0435\u0442\u0438\u0627\u0631\u0627\u0645\u0643\u0648\u0441\u0430\u0439\u0442eurovisionxn--i1b6b1a6a2exn--xkc2dl3a5ee0h\u062A\u0648\u0646\u0633\u0645\u0648\u0642\u0639\u0628\u0627\u0631\u062A\u0680\u0627\u0631\u062A\u0634\u0628\u0643\u0629\u0639\u0645\u0627\u0646\u0628\u064A\u062A\u0643\u0639\u0631\u0627\u0642readkredbondlandbandfundfoodprodgoldfordtubecafesafelifeggeeieeefreefagepagegugezonewinememenamegamesaleablebikenikelikecarecbreherefiresaveloveliveblueartedatesitevotecaseluxebofamodaltdaasdatiaayogasinavanashiaasiajavabbvatevavivadatazaraarpacasavisasncfprofmaifsurfgolfdvagsongbingpingwangkpmggoogblogpohlfailcooldellcalldeallidlsarlfilmteamroomfarmimdbarabclubhdfcicbchsbcgmbhrichtechfishdishcashminiernikddiaudiwikimobitaxicitikiwidesiqponskinloanakdnwienopenporncerntownimmolimoolloinfonicofidolegosaxozeroaerovivoautovotomotofastbestresthostpostnextlgbtchatseatgiftmeetdietreitmintrentgentspotscotguruitausohumenucyoubanklinkpinkdclktalksilkbookseekworkrsvpaarpjeepshopcoophelpcamppccwshowbeerstarruhrflirweirhaircarsparsjprshausplusnewstipstoysjobskidsfanspicsdocsxboxamexsexynavycitysonyarmyallybabyplaydeliverybuzzgbizlamborghiniphilips\u0DBD\u0D82\u0D9A\u0DCF\u0CAD\u0CBE\u0CB0\u0CA4fitnessexpresslanxesspfizercenterwalterlawyersoccercareerkosherbrokerlockerdealerdoctorauthorxn--mgbqly7c0a67fbcverm\xF6gensberatungjaguarxn--pssy2uxn--hxt814eflickrrepairrogersairbusxn--mgbai9a5eva00beventsyachtsxn--t60b56a\u09AD\u09BE\u09F0\u09A4\u09AD\u09BE\u09B0\u09A4\u092D\u093E\u0930\u0924\u092D\u093E\u0930\u094B\u0924viajeshermeshughesxn--j1aef\u0938\u0902\u0917\u0920\u0928villas\u0B2D\u0B3E\u0B30\u0B24claimshotels\u0AAD\u0ABE\u0AB0\u0AA4zapposphotosjuegoscondostatamotorsgratistennis\u0A2D\u0A3E\u0A30\u0A24tkmaxxtjmaxxschaeffleryandexxn--80aswgrealtysafetybeautyluxuryxn--3ds443gsupplyfamilyxn--o3cw4hhockeysydneyxn--90aenissayalipayenergycomputeragencyxn--rovu88b\u96FB\u8A0A\u76C8\u79D1xn--gecrj9cstatefarmaccountantaquarelleolayangroup\u9999\u683C\u91CC\u62C9xn--p1ai\u7EC4\u7EC7\u673A\u6784xn--1ck2e1bxn--mgbt3dhdschwarz\u0645\u0648\u0631\u064A\u062A\u0627\u0646\u064A\u0627abudhabinowruzkomatsufujitsuhospitalxn--80asehdbxn--mgbtf8flxn--j6w193gxn--yfro4i67oprudentialxn--flw351ecruisescoursesrecipesxn--e1a4cferrarixn--ses554gxn--wgbl6awatchesstaplessinglesxn--mgbcpq6gpa1axn--otu796dpropertiescreditunionxn--mgbah1a3hjkrdstockholmhisamitsu\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629stcgroupdomainsoriginscouponsbloombergclubmedfroganslimitedxn--80aqecdr1aexposedinternationalequipmentbarclaycardxn--q7ce6axn--mgbi4ecexpprotectionassociatesconstructionxn--cck2b3bxn--45q11candroidfoundation\u05D9\u05E9\u05E8\u05D0\u05DCxn--mgbca7dzdocliniqueboutiqueengineerxn--qxa6asystemsfirmdalefashionauctionxn--nqv7finfinitirentalsreliancetradingweddingfishinghostinggentingbookingcookingxn--3hcrj9cgraingerxn--czrs0tdemocratsamsungyokohamaxn--h2breg3evexn--nyqy26alundbeckmelbournevacationssolutionsfrontierxn--vermgensberatung-pwbmanagementxn--cg4bkixn--mgb2ddeslincolnhamburgsandvikcoromantblockbusterairforcebarefootxn--4dbrk0ceinvestmentsfeedbackcommunityxn--ngbrx\u0627\u0644\u0628\u062D\u0631\u064A\u0646diamondsamsterdamhealthcareredumbrellaxn--mxtq1mxn--2scrj9cagakhanxn--mgbpl2fh\u043A\u0430\u0442\u043E\u043B\u0438\u043Acaravan\u0B9A\u0BBF\u0B99\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0BC2\u0BB0\u0BCDrichardlimortgageamericanfamilyxn--fzc2c9e2cscholarshipssaarlandxn--imr513nvlaanderensamsclubgoodyearkitchen\u0B87\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF\u0BBEweatherchannelallfinanzxn--kput3i\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u06C3xn--90aisxn--efvy88h\u0627\u0644\u062C\u0632\u0627\u0626\u0631xn--mgbaam7a8hexchangejpmorganxn--tiq49xqyjfidelitysecurityxn--mk1bu44cwanggouxn--fiq64bxn--6qq986b3xlxn--mgbbh1a71exn--80ao21amarshallsxn--5tzm5gtravelerspanasoniclatrobeyoutubeaccountantsxn--rhqv96gxn--cckwcxetdanalyticsxn--ygbi2ammx\u0628\u0627\u0632\u0627\u0631\u0628\u06BE\u0627\u0631\u062A\u0633\u0648\u0631\u064A\u0629organicfresenius\u0633\u0648\u0631\u064A\u0627xn--9krt00axn--qcka1pmcxn--jlq480n2rgdeloittesciencefinancexn--jvr189mxn--30rr7yhomesensehotmailbaseballfootballleclercboehringerxn--q9jyb4cxn--mix082f\u0627\u0644\u064A\u0645\u0646\u0647\u0645\u0631\u0627\u0647politie\u0633\u0648\u062F\u0627\u0646\u0627\u064A\u0631\u0627\u0646\u0627\u06CC\u0631\u0627\u0646netflixyamaxunxn--lgbbat1ad8jcollegestoragecapetowncolognekerrypropertiesxn--mgbgu82axn--ogbpf8flxn--czru2dwhoswhociprianilasallexn--g2xx48cforsalebanamexaudiblexn--vermgensberater-ctbxn--zfr164bericssonvanguardxn--45brj9cindustriestheatremarriottxn--3bst00mcomparexn--mgberp4a5d4a87gcapitaldigital\u0627\u0644\u0645\u063A\u0631\u0628barcelonashangrilaxn--d1alfcalvinkleinwwwcitysapporokawasakinagoyasendaikobekitakyushuyokohamackjp",qo=619,_o=623;var Oo=ee.length,Lo=je.length,Go=new Uint32Array(Lo),ot=new Uint32Array(Lo),ra=new Int32Array(Oo).fill(-1);for(let t=0,e=0;t<Oo;t+=1)for(let a=Ie[t];a<Ie[t+1];a+=1){Go[a]=e;let o=e+je[a],n=5381;for(let r=o-1;r>=e;r-=1)n=n*33^at.charCodeAt(r);ot[a]=n>>>0,je[a]===1&&at.charCodeAt(e)===42&&(ra[t]=a),e=o}var H=-1,ia=0,sa=0;function Bo(t,e,a,o){if(je[t]!==o)return!1;let n=Go[t];for(let r=0;r<o;r+=1)if(at.charCodeAt(n+r)!==e.charCodeAt(a+r))return!1;return!0}function Fo(t,e,a,o,n){let r=Ie[t],i=Ie[t+1];for(;r<i;){let s=r+i>>>1,l=ot[s];if(l<e)r=s+1;else if(l>e)i=s;else{for(let u=s;u>=r&&ot[u]===e;u-=1)if(Bo(u,a,o,n))return u;for(let u=s+1;u<i&&ot[u]===e;u+=1)if(Bo(u,a,o,n))return u;return-1}}return-1}function Do(t,e,a){let o=e,n=t.length,r=5381;H=-1;for(let s=t.length-1;s>=0;s-=1){let l=t.charCodeAt(s);if(l===46){let u=s+1,c=Fo(o,r>>>0,t,u,n-u);if(c===-1&&(c=ra[o]),c===-1)return H!==-1;o=na[c],(ee[o]&a)!==0&&(H=o,ia=u,sa=n),n=s,r=5381}else r=r*33^l}let i=Fo(o,r>>>0,t,0,n);return i===-1&&(i=ra[o]),i!==-1&&(o=na[i],(ee[o]&a)!==0&&(H=o,ia=0,sa=n)),H!==-1}function la(t,e,a){if(oa(t,e,a))return;let o=(e.allowPrivateDomains?2:0)|(e.allowIcannDomains?1:0);if(Do(t,_o,o)){a.isIcann=(ee[H]&1)!==0,a.isPrivate=(ee[H]&2)!==0,a.publicSuffix=t.slice(sa+1);return}if(Do(t,qo,o)){a.isIcann=(ee[H]&1)!==0,a.isPrivate=(ee[H]&2)!==0,a.publicSuffix=t.slice(ia);return}a.isIcann=!1,a.isPrivate=!1;let n=t.lastIndexOf(".");a.publicSuffix=n===-1?t:t.slice(n+1)}var Uo=ea();function Vo(t,e){return ta(Uo),aa(t,3,la,e,Uo).domain}var Ho=1,$r=4096,Kr=/^[a-z][a-z\d+.-]*:/iu,Jr=/^https?:\/\//iu,e0=new Set(["_ga","_gl","fbclid","gclid","msclkid"]),t0=new Set(["access_token","api_key","apikey","client_secret","password","passwd","session","sessionid","signature","token","x-amz-signature"]);function a0(t){let e=t.split(/[/?#]/u,1)[0]??"";if(!e||e.includes("@"))return!1;if(/^\[[0-9a-f:.]+\](?::\d+)?$/iu.test(e))return!0;let a=e.lastIndexOf(":"),o=a>-1,n=o?e.slice(0,a):e,r=o?e.slice(a+1):"";return o&&!/^\d+$/u.test(r)?!1:n.toLowerCase()==="localhost"||/^\d{1,3}(?:\.\d{1,3}){3}$/u.test(n)?!0:n.includes(".")&&!n.startsWith(".")&&!n.endsWith(".")}function o0(t){if(t.startsWith("//"))return`https:${t}`;if(Jr.test(t))return t;if(a0(t))return`https://${t}`;throw Kr.test(t)?new D("Every QR Code supports only HTTP and HTTPS links."):new D("That link does not look valid yet.")}function n0(t){if(t.protocol!=="http:"&&t.protocol!=="https:")throw new D("Every QR Code supports only HTTP and HTTPS links.");if(!t.hostname)throw new D("That link needs a hostname.");if(t.username||t.password)throw new D("Links containing a username or password are not supported.")}function r0(t){let e=t.protocol==="http:"&&t.port==="80",a=t.protocol==="https:"&&t.port==="443";(e||a)&&(t.port="")}function i0(t){let e=t.toLowerCase();return e.startsWith("utm_")||e0.has(e)}function s0(t){let e=new URL(t),a=new URLSearchParams;e.hash="";for(let[o,n]of e.searchParams)i0(o)||a.append(o,n);return a.sort(),e.search=a.toString(),e.toString()}function l0(t){for(let e of t.searchParams.keys())if(t0.has(e.toLowerCase()))return!0;return!1}function u0(t){return Vo(t,{allowPrivateDomains:!0})??t}function No(t,e={}){let a=e.identityVersion??Ho,o=e.identityScope??"site";if(a!==Ho)throw new Q("identity",a);if(new TextEncoder().encode(t).length>$r)throw new D("That link is longer than Every QR Code can safely process.");let n=t.trim();if(!n)throw new D("Enter a link to discover its form.");let r;try{r=new URL(o0(n))}catch(s){throw s instanceof I?s:new D("That link does not look valid yet.")}n0(r),r0(r);let i=r.toString();return{displayHost:r.host,familyIdentity:u0(r.hostname),hasSensitiveQuery:l0(r),input:t,pageIdentity:s0(r),payloadUrl:i,scope:o,siteIdentity:r.hostname}}async function Wo(t,e={}){let a=e.identityVersion??1,o=e.qrProfileVersion??1,n=e.identityScope?{identityScope:e.identityScope,identityVersion:a}:{identityVersion:a},r=No(t,n),i=et(r.payloadUrl,o),[s,l]=await Promise.all([wa(r,a),Promise.resolve(Ra(i))]);return{dna:s,fields:l,link:r,qr:i}}function c0(t){if(!Number.isInteger(t)||t<0||t>16)throw new RangeError("QR quiet zone")}function Yo(t,e=4){c0(e);let a=[];for(let o=0;o<t.size;o+=1){let n=0;for(;n<t.size;){if(t.cells[o*t.size+n]!==1){n+=1;continue}let r=n;for(;n<t.size&&t.cells[o*t.size+n]===1;)n+=1;let i=n-r;a.push(`M${r+e} ${o+e}h${i}v1h-${i}z`)}}return{path:a.join(""),size:t.size+e*2}}var d0={banana:.08,cloud:.15,conifer:.12,"multi-trunk":.12,round:.36,umbrella:.06,willow:.08,windswept:.03},m0=["round","cloud","conifer","umbrella","willow","banana","multi-trunk","windswept"];var N={branch:5,cherryBlossom:1,dirt:0,fallenPetals:4,grass:3,trunk:2},Qo=[{id:"tideglass",label:"Tideglass",material:"tidal",palette:{accent:15267567,atmosphere:9362687,base:3185108,dark:1923190,region:8636779},topology:"soft-sphere"},{id:"cinderveil",label:"Cinderveil",material:"molten",palette:{accent:16763474,atmosphere:16742469,base:2434609,dark:1316125,region:16734519},topology:"segmented-shell"},{id:"prismbloom",label:"Prismbloom",material:"crystal",palette:{accent:16767602,atmosphere:13220351,base:10323941,dark:4997493,region:7395526},topology:"faceted-sphere"},{id:"jellyhalo",label:"Jellyhalo",material:"gel",palette:{accent:16762464,atmosphere:16767464,base:15699629,dark:9521001,region:8837584},topology:"gel-shell"},{id:"mosswhorl",label:"Mosswhorl",material:"garden",palette:{accent:16768125,atmosphere:12380349,base:9160043,dark:3234627,region:5082979},topology:"terraced-world"},{id:"hollowlight",label:"Hollowlight",material:"energy",palette:{accent:16773016,atmosphere:8644831,base:3424873,dark:1580345,region:6741968},topology:"open-core"},{id:"orbit-forge",label:"Orbit Forge",material:"machine",palette:{accent:16113592,atmosphere:9558492,base:13803869,dark:6110515,region:3308420},topology:"ring-habitat"}],Xo=["Haven","Reach","Drift","Basin","Arc","Garden","Crown"];function f0(t){let e=0;for(let a of m0)if(e+=d0[a],t<e)return a;return"round"}var p0=2.12,h0=-.82,g0=4,M=.0245;function nt(t,e,a,o,n){t.push({baseY:o,column:e,index:t.length,layer:Math.round(o/M),row:a,type:n})}function b0(t,e,a){return t?e<6.25?N.cherryBlossom:e>=a?N.grass:N.fallenPetals:N.dirt}function y0(t,e,a){let o=Math.sin(t*127.1+e*311.7+a*43.7)*43758.5;return o-Math.floor(o)}function k0(t,e,a,o,n){let r=n/29,i=Math.ceil(12*r),s=i*M,l=n*.46;if(o<6.25)for(let p=1;p<i;p++)nt(t,e,a,p*M,N.trunk);if(o>=l**2)return;let u=1-Math.sqrt(o)/l,c=Math.ceil(18*r),d=Math.max(4,Math.ceil(c*(.25+.75*u**2))),m=Math.floor(4.5*u*r)*M,f=Math.floor(6*y0(e,a,500)*r);for(let p=0;p<d+f;p++)nt(t,e,a,s+p*M+m,N.cherryBlossom);if(!(o>=2.25))for(let p=0;p<4;p++)nt(t,e,a,s+p*M,N.cherryBlossom)}function v0(t,e,a){let o=t;for(let n=0;n<a;n+=1){let r=new Float32Array(t.length);for(let i=0;i<e;i+=1)for(let s=0;s<e;s+=1){let l=0,u=0;for(let c=-1;c<=1;c+=1)for(let d=-1;d<=1;d+=1){let m=i+c,f=s+d;m<0||m>=e||f<0||f>=e||(l+=o[m*e+f]??0,u+=1)}r[i*e+s]=l/u}o=r}return o}function x0(t,e,a){let o=(a-1)*.5,n=(t-o)/(a*.52),r=(e-o)/(a*.5),i=n*n+r*r,s=Math.max(0,Math.min(1,(i-.5)/.48));return 1-s*s*(3-2*s)}function w0(t){let e=new Float32Array(t.qrSize*t.qrSize);for(let r of t.modules)e[r.index]=Math.min(1,.42+r.relief*2.4);let a=v0(e,t.qrSize,3),o=Math.max(...a,Number.EPSILON),n=new Float32Array(e.length);for(let r=0;r<t.qrSize;r+=1)for(let i=0;i<t.qrSize;i+=1){let s=r*t.qrSize+i,l=e[s]??0,u=(a[s]??0)/o,d=Math.pow(Math.max(u,l*.34),.82)*x0(i,r,t.qrSize);n[s]=d}return n}function S0(t,e,a){let o=new Set(t.filter(l=>l.layer===0&&l.type!==N.dirt).map(l=>`${l.column}:${l.row}`)),n=new Float32Array(t.length*4),r=new Float32Array(t.length),i=new Float32Array(t.length),s=new Uint32Array(t.length);for(let l of t){let u=l.index*4;if(n[u]=l.column,n[u+1]=l.row,l.layer===0&&l.type!==N.dirt){let c=o.has(`${l.column}:${l.row-1}`)?1:0,d=o.has(`${l.column+1}:${l.row}`)?2:0,m=o.has(`${l.column}:${l.row+1}`)?4:0,f=o.has(`${l.column-1}:${l.row}`)?8:0;n[u+3]=c|d|m|f}r[l.index]=a?.[l.row*e+l.column]??M,i[l.index]=l.baseY,s[l.index]=l.type}return{baseY:i,blocks:t,blockSize:M,heights:r,positions:n,qrSize:e,types:s}}function rt(t,e="tree"){let a=new Set(t.modules.map(s=>s.index)),o=[],n=t.qrSize/2,r=(t.qrSize*.46)**2;for(let s=0;s<t.qrSize;s++)for(let l=0;l<t.qrSize;l++){let u=s*t.qrSize+l,c=(l-n)**2+(s-n)**2,d=a.has(u);nt(o,l,s,0,b0(d,c,r)),d&&e==="tree"&&k0(o,l,s,c,t.qrSize)}let i=e==="terrain"?w0(t):void 0;return S0(o,t.qrSize,i)}function Zo(t,e,a,o,n){if(t==="ring-habitat"||t==="open-core"){let u=t==="open-core"?.58:.68,c=t==="open-core"?.28:.22,d=e*Math.PI*2,m=a*Math.PI*2,f=u+(c+o)*Math.cos(m);return{normal:[Math.cos(d)*Math.cos(m),Math.sin(m),Math.sin(d)*Math.cos(m)],position:[f*Math.cos(d),(c+o)*Math.sin(m),f*Math.sin(d)]}}let r=(e-.5)*Math.PI*2,i=(.5-a)*Math.PI,s=.75+o,l=[Math.cos(i)*Math.cos(r),Math.sin(i),Math.cos(i)*Math.sin(r)];return{normal:l,position:[l[0]*s*n,l[1]*s,l[2]*s/n]}}function z0(t,e,a){let o=[],n=t.qr.size,r=p0/(n+g0*2),i=(n-1)/2;return t.qr.cells.forEach((s,l)=>{if(!s)return;let u=l%n,c=Math.floor(l/n),d=(u+.5)/n,m=(c+.5)/n,f=t.fields.density5x5[l]??0,p=t.fields.edge[l]??0,g=(f-.5)*.075+p*.045,b=Zo(e,d,m,g,a);o.push({index:l,normal:b.normal,qr:[(u-i)*r,h0+.024,(c-i)*r],relief:g,surface:b.position})}),o}function P0(t,e,a,o){let n=t.qr.size,r=Array.from(t.qr.cells,(s,l)=>{let u=(t.fields.blur[l]??0)*.62+(t.fields.edge[l]??0)*.28+o.next()*.1;return{index:l,score:u}}).sort((s,l)=>l.score-s.score),i=[];for(let s of r){if(i.length>=9)break;let l=s.index%n,u=Math.floor(s.index/n),c=(l+.5)/n,d=(u+.5)/n,m=Zo(e,c,d,.035,a);i.some(p=>p.normal[0]*m.normal[0]+p.normal[1]*m.normal[1]+p.normal[2]*m.normal[2]>.88)||i.push({normal:m.normal,position:m.position,scale:.16+s.score*.16,score:s.score})}return i}function C0(t){let e=1+Math.floor(t.next()*3);return Array.from({length:e},(a,o)=>({inclination:-.55+t.next()*1.1,orbit:1.05+o*.2+t.next()*.12,phase:t.next()*Math.PI*2,scale:.055+t.next()*.07}))}async function R0(t){let e=t.link.scope==="url"?"page":"site",[a,o,n,r,i,s,l]=await Promise.all([t.dna.channel("family","seed/v1/family"),t.dna.channel("family","tree/v1/family-shape"),t.dna.channel(e,"seed/v1/shape"),t.dna.channel(e,"seed/v1/detail"),t.dna.channel("family","morph/v1/family-structure"),t.dna.channel(e,"morph/v1/structure"),t.dna.channel("family","tree/v2/archetype")]),u=Qo[Math.floor(a.next()*Qo.length)];if(!u)throw new RangeError("Tree recipe");let d=.9+xt(o.next(),n.next(),.82)*.2,m=Xo[Math.floor(a.next()*Xo.length)]??"Haven";return{archetype:f0(l.next()),eccentricity:d,features:P0(t,u.topology,d,r),generatorVersion:1,material:u.material,morphSeed:xt(i.next(),s.next(),.78),modules:z0(t,u.topology,d),name:`${u.label} ${m}`,palette:u.palette,recipeId:u.id,recipeLabel:u.label,qrSize:t.qr.size,satellites:C0(r),topology:u.topology}}var M0={1:R0};async function $o(t,e={}){let a=Le(e.generatorVersion);return M0[a](t)}function ue(t){return t.morphSeed}function h(t,e,a=0,o=0){let n=e*127.1+a*311.7+o*43.7+t*7919,r=Math.sin(n)*43758.5;return r-Math.floor(r)}var T0=[.96,.02,.08,.78,.63,.51],A0=[.29,.37,.48,.12,.96,.74];function Ko(t,e,a){let o=Math.min(t.length-1,Math.floor(e*t.length));return((t[o]??0)+(a-.5)*.024+1)%1}function E0(t){let e=ue(t),a=h(e,13,0,7300),o=h(e,14,0,7400),n=o<.62?(.94+o*.22)%1:.72+(o-.62)*.55;return{bloomDensity:1.05+h(e,10,0,7e3)*.25,flowerHue:Ko(T0,h(e,11,0,7100),h(e,16,0,7600)),flowerHueSpread:.018+h(e,17,0,7700)*.15,fruitHue:n,fruitfulness:0,leafDensity:.03,leafHue:Ko(A0,h(e,15,0,7500),h(e,18,0,7800)),leafHueSpread:.015+h(e,19,0,7900)*.12}}function I0(t){let e=new Set(t.modules.map(o=>o.index)),a=0;for(let o=0;o<t.qrSize;o++)for(let n=0;n<t.qrSize;n++){let r=o*t.qrSize+n;n>0&&e.has(r)!==e.has(r-1)&&a++,o>0&&e.has(r)!==e.has(r-t.qrSize)&&a++}return a/(2*t.qrSize*(t.qrSize-1))}function j0(t){switch(t.archetype){case"round":return{base:.82,depth:.96,height:1.5,roundness:1.65,tiering:.01,trunk:1.05,width:.98};case"umbrella":return{base:.72,depth:1,height:.88,roundness:2.1,tiering:.02,trunk:.94,width:1.04};case"conifer":return{base:.48,depth:.66,height:2.6,roundness:.78,tiering:.05,trunk:1.5,width:.68};case"banana":return{base:.9,depth:.68,height:.82,roundness:1.8,tiering:0,trunk:1.18,width:.78};case"willow":return{base:.82,depth:.92,height:1.08,roundness:1.75,tiering:.02,trunk:1.08,width:.92};case"windswept":return{base:.78,depth:.86,height:1,roundness:1.9,tiering:.02,trunk:1.08,width:.95};case"cloud":return{base:.76,depth:.94,height:1.48,roundness:1.3,tiering:.18,trunk:.98,width:.98};case"multi-trunk":return{base:.86,depth:.96,height:1.08,roundness:2,tiering:.02,trunk:1.22,width:1}}}function q0(t,e){return(.29+t*.07)*e}function _0(t,e){return t==="banana"?9+Math.floor(e*3):t==="conifer"?6:t==="multi-trunk"?7+Math.floor(e*2):t==="umbrella"?6+Math.floor(e*2):t==="willow"?8+Math.floor(e*2):t==="windswept"?5+Math.floor(e*2):t==="cloud"?9+Math.floor(e*2):7+Math.floor(e*2)}function B0(t){let e=t.modules.length/(t.qrSize*t.qrSize),a=I0(t),o=t.qrSize/29,n=j0(t),r=h(t.morphSeed,1,0,100),i=h(t.morphSeed,2,0,200),s=h(t.morphSeed,3,0,300),l=h(t.morphSeed,4,0,400),u=h(t.morphSeed,6,0,600),c=h(t.morphSeed,7,0,700),d=h(t.morphSeed,8,0,800),m=q0(e,o)*n.trunk*(.98+r*.18),f=t.qrSize*.46*M,p=f*n.width*(.91+i*.14),g=f*n.depth*(.92+c*.12),b=f*n.height*(.88+(1-r)*.12),y=m*n.base,v=h(t.morphSeed,5,0,500)<.5?-1:1,k=d*Math.PI*2,w=t.archetype==="windswept"?f*(.12+a*.06):f*(.008+a*.018);return{archetype:t.archetype,branchCount:_0(t.archetype,s),branchLengthScale:(.64+e*.18)*(.88+i*.22),canopyBaseY:y,canopyDepth:g,canopyDensity:(.45+e*.55)*(.62+u*.82),canopyDomeHeight:b,canopyOffsetX:Math.cos(k)*w,canopyOffsetZ:Math.sin(k)*w,canopyRadius:p,canopyRoundness:n.roundness,canopyTiering:n.tiering,maxHeight:y+b*(t.archetype==="round"?.85:.96),minHeight:y,trunkHeight:m,trunkLean:(.04+a*.03)*o*(.42+l*1.16)*v,trunkRadius:(.024+e*.008)*o}}function st(t,e){return[t.trunkLean*(Math.sin(e*Math.PI*2.1)*.52+e*.65),t.trunkHeight*e,t.trunkLean*.42*Math.sin(e*Math.PI*1.6)]}function it(t,e){t.push(e)}function F0(t,e){for(let o=0;o<7;o++){let n=o/7,r=(o+1)/7,i=u=>1+Math.sin(u*Math.PI*4.6)*.13+Math.exp(-u*12)*.28,s=i(n),l=i(r);it(t,{depth:0,end:st(e,r),endRadius:e.trunkRadius*(1-r*.88)*l,seed:n*.5,start:st(e,n),startRadius:e.trunkRadius*(1-n*.88)*s})}}function D0(t){let e=ue(t),a=t.qrSize/29,o=B0(t),n=(.46+h(e,41,0,210)*.055)*a,r={...o,archetype:"cloud",trunkHeight:n,trunkRadius:(.027+h(e,42,0,220)*.008)*a,trunkLean:(.04+h(e,43,0,230)*.035)*(h(e,43,1,230)<.5?-1:1)*a,canopyRadius:.325*a,canopyDepth:.31*a,canopyBaseY:n*.42,canopyDomeHeight:n*.7,minHeight:n*.35,maxHeight:n*1.2},i=[],s=[];F0(i,r);let l=5,u=h(e,44,0,240)*Math.PI*2;for(let d=0;d<l;d++){let m=d/(l-1),f=d===4?2:2+(h(e,d,0,250)>.63?1:0);for(let p=0;p<f;p++){let g=d*7+p,b=u+d*2.17+p/f*Math.PI*2+(h(e,g,0,260)-.5)*.55,y=.39+m*.53+(h(e,g,0,270)-.5)*.05,v=st(r,y),k=r.canopyRadius*(.88-m*.27)*(.84+h(e,g,0,280)*.2),w=v,z=r.trunkRadius*(.43-m*.12);for(let S=0;S<3;S++){let A=(S+1)/3,j=(h(e,g,S,290)-.5)*.1,U=[v[0]+Math.cos(b+j)*k*A,v[1]+k*(.14*A+.16*A*A),v[2]+Math.sin(b+j)*k*A],fe=z*.54;if(it(i,{start:w,end:U,startRadius:z,endRadius:fe,depth:1,seed:h(e,g,S,300)}),S>=1)for(let Y=0;Y<2;Y++){let ya=b+(Y?.64:-.64)+(h(e,g,S*2+Y,310)-.5)*.4,yt=k*(.17+h(e,g,Y+S*2,320)*.14),ka=[U[0]+Math.cos(ya)*yt,U[1]+yt*(.52+h(e,g,Y,330)*.6),U[2]+Math.sin(ya)*yt];it(i,{start:U,end:ka,startRadius:fe*.65,endRadius:.0014*a,depth:2,seed:h(e,g,S*2+Y,340)}),s.push({position:ka,radius:.13+h(e,g,Y+S*2,350)*.06})}w=U,z=fe}s.push({position:w,radius:.17+h(e,g,0,360)*.06})}}let c=st(r,.96);for(let d=0;d<3;d++){let m=u+d*2.0944,f=[c[0]+Math.cos(m)*.09*a,c[1]+(.055+h(e,d,0,370)*.035)*a,c[2]+Math.sin(m)*.09*a];it(i,{start:c,end:f,startRadius:.007*a,endRadius:.0018*a,depth:2,seed:h(e,d,0,380)}),s.push({position:f,radius:.16})}return{metrics:r,segments:i,tips:s}}function O0(t){let e=new Float32Array(t.length*12);return t.forEach((a,o)=>{let n=o*12;e.set([...a.start,a.startRadius],n),e.set([...a.end,a.endRadius],n+4),e.set([a.depth,a.seed,0,0],n+8)}),e}function ua(t,e,a){let o=t.qrSize*M*.5;return[(e+o)/M,(a+o)/M]}function L0(t,e,a,o,n){let r=ue(e);if(h(r,n,0,780)<.01)return;let i=e.qrSize*M*.5,s=Math.hypot(o.position[0],o.position[2]),l=1+.45*(1-Math.min(1,s/(i*.46))),u=(1+.3*h(r,n,3,790))*l,c=o.radius*M*9*u,d=18+Math.floor(12*a.bloomDensity*u);for(let f=0;f<d;f++){let p=h(r,n,f,800),g=h(r,n,f,810)*Math.PI*2,b=2*h(r,n,f,820)-1,y=Math.sqrt(1-b*b),v=c*Math.sqrt(h(r,n,f,830)),k=o.position[0]+v*y*Math.cos(g)*1.5,w=o.position[1]+v*b*.38+c*.1,z=o.position[2]+v*y*Math.sin(g)*1.5,[S,A]=ua(e,k,z),j=f===0&&p<a.fruitfulness*.12;t.push(S,A,w,p+(j?2:0))}let m=3+Math.floor(3*h(r,n,0,1500));for(let f=0;f<m;f++){let p=h(r,n,f,1600),g=h(r,n,f,1700)*Math.PI*2,b=c*.5,y=o.position[0]+Math.cos(g)*b,v=o.position[1]-M*(.5+2*p),k=o.position[2]+Math.sin(g)*b,[w,z]=ua(e,y,k);t.push(w,z,v,p)}if(h(r,n,2,900)<a.leafDensity){let f=h(r,n,0,910)*Math.PI*2,[p,g]=ua(e,o.position[0]+Math.cos(f)*c*.4,o.position[2]+Math.sin(f)*c*.4);t.push(p,g,o.position[1]-M*.5,1+h(r,n))}}function G0(t,e){let a=[],o=ue(t),n=t.qrSize/2,r=Math.round(25*(.82+e.bloomDensity*.18));for(let i=0;i<r;i++){let s=h(o,i,0,10100)*Math.PI*2,l=h(o,i,0,10200),u=t.qrSize*(.1+l**2*.36),c=n+Math.cos(s)*u,d=n+Math.sin(s)*u,m=M*(1.04+h(o,i,0,10400)*.06),f=h(o,i,0,10500);a.push(c,d,m,f)}return new Float32Array(a)}function U0(t,e){if(t.length===0)return new Float32Array;let a=[],o=ue(e),n=e.qrSize*M*.5,r=10;for(let i=0;i<r;i++){let s=Math.floor(h(o,i,0,11e3)*t.length)%t.length,l=t[s];if(!l)continue;let u=h(o,i,0,11100)*Math.PI*2,c=l.radius*M*h(o,i,0,11200),d=l.position[0]+Math.cos(u)*c,m=l.position[2]+Math.sin(u)*c,f=l.position[1]+M*(.5+h(o,i,0,11300));a.push((d+n)/M,(m+n)/M,f,h(o,i,0,11400))}return new Float32Array(a)}function Jo(t){let e=new Float32Array(2e3),a=ue(t),o=t.qrSize*1.2,n=(o-t.qrSize)*.5;for(let r=0;r<500;r++){let i=r*4;e[i]=h(a,r,0,12100)*o-n,e[i+1]=h(a,r,0,12200)*o-n,e[i+2]=h(a,r,0,12300),e[i+3]=h(a,r,0,12400)}return e}function V0(t){let e=new Float32Array(40),a=ue(t),o=t.qrSize*.46;for(let n=0;n<10;n++){let r=n*4;e[r]=o*(.35+h(a,n,0,13100)*.55),e[r+1]=.25+h(a,n,0,13200)*.3,e[r+2]=4+h(a,n,0,13300)*9,e[r+3]=h(a,n,0,13400)}return e}function H0(t){let e=0,a=0,o=0;for(let n=3;n<t.length;n+=4){let r=Math.floor(t[n]??0);r>=5?o++:r>=2?a++:r>=1?o++:e++}return{blossomCount:e,data:new Float32Array(t),fruitCount:a,leafCount:o}}function N0(t,e,a,o){let n=[];e.forEach((i,s)=>L0(n,t,a,i,s));let r=t.qrSize/2;for(let i of t.modules){let s=i.index%t.qrSize,l=Math.floor(i.index/t.qrSize);if(!((s-r)**2+(l-r)**2<(t.qrSize*.46)**2))for(let u=0;u<3;u++){let c=h(t.morphSeed,i.index,u,12e3);n.push(s+.15+h(t.morphSeed,i.index,u,12100)*.7,l+.15+h(t.morphSeed,i.index,u,12200)*.7,M*(1.9+c*1.5),c)}}return H0(n)}function W0(t){let e=[],a=t.qrSize/2,o=(t.qrSize*.46)**2;for(let n of t.modules){let r=n.index%t.qrSize,i=Math.floor(n.index/t.qrSize);if((r-a)**2+(i-a)**2<o)continue;let l=16+Math.floor(8*h(t.morphSeed,r,i,6100));for(let u=0;u<l;u++){let c=h(t.morphSeed,r,i,6200+u),d=.85*(h(t.morphSeed,r,i,6300+u)-.5),m=.85*(h(t.morphSeed,r,i,6400+u)-.5),f=1.1+1.7*h(t.morphSeed,r,i,6500+u);e.push(r+d,i+m,c,f)}}return new Float32Array(e)}function Y0(t,e){let a=new Float32Array,o=Jo(t);return{appearance:e,blossomCount:0,butterflies:a,butterflyCount:0,fallingPetalCount:0,fallingPetals:a,flowerCount:0,flowers:a,fruitCount:0,grass:a,grassCount:0,groundPetalCount:0,groundPetals:a,leafCount:0,rain:o,rainCount:o.length/4,segmentCount:0,segments:a}}function Q0(t,e,a,o,n){let r=W0(t),i=G0(t,e),s=Jo(t),l=V0(t);return{appearance:e,blossomCount:a.blossomCount,butterflies:l,butterflyCount:l.length/4,fallingPetalCount:n.length/4,fallingPetals:n,flowerCount:a.data.length/4,flowers:a.data,fruitCount:a.fruitCount,grass:r,grassCount:r.length/4,groundPetalCount:i.length/4,groundPetals:i,leafCount:a.leafCount,rain:s,rainCount:s.length/4,segmentCount:o.length,segments:O0(o)}}function lt(t,e="tree"){let a=E0(t);if(e==="terrain")return Y0(t,a);let o=D0(t),n=N0(t,o.tips,a,o.metrics);return Q0(t,a,n,o.segments,U0(o.tips,t))}function ca(t){return Math.max(0,Math.min(1,t))}function en(t){return t[0]*.2126+t[1]*.7152+t[2]*.0722}function ce(t,e,a){return[t[0]+(e[0]-t[0])*a,t[1]+(e[1]-t[1])*a,t[2]+(e[2]-t[2])*a]}function X0(t,e){let a=en(t);return[ca(a+(t[0]-a)*e),ca(a+(t[1]-a)*e),ca(a+(t[2]-a)*e)]}function Z0(t,e){let a=en(t);if(Math.abs(a-e)<1e-4)return t;if(a<e){let o=(e-a)/Math.max(1e-4,1-a);return ce(t,[1,1,1],o)}return ce(t,[0,0,0],(a-e)/Math.max(1e-4,a))}function qe(t,e,a){return Z0(X0(t,a),e)}function da(t){let[e,a,o,n,r]=t;return[qe(ce(e,r,.1),.42,1.18),qe(ce(o,r,.24),.68,1.12),qe(ce(a,r,.06),.54,1.16),qe(ce(a,n,.34),.34,1.14),qe(ce(r,[1,1,1],.42),.88,1.04)]}var Fe=["sakura","islands","moon","library"],ct={islands:1,library:3,moon:2,sakura:0},te={box:0,frustum:1,cylinder:2,sphere:3,pyramid:4,ribbon:5},P={rock:0,foliage:1,structure:2,accent:3,metal:4,glass:5,dark:6,water:7,wood:8,paper:9,glow:10,lunar:11},de=12,dt=216,me=160,ut=Math.PI*2;function tn(t){return t-Math.floor(t)}function x(t,e,a=0,o=0){let r=(Number.isFinite(t.morphSeed)?t.morphSeed:0)*7919+e*127.1+a*311.7+o*43.7;return tn(Math.sin(r)*43758.5453)}function an(t,e,a,o=.2){let{activeModules:n,model:r}=t;if(r.modules.length===0||r.qrSize<=0)return 0;let i=(r.qrSize-1)*.5,s=i+e*r.qrSize,l=i+a*r.qrSize,u=Math.max(1,o*r.qrSize),c=0,d=0;for(let m=Math.max(0,Math.floor(l-u));m<=Math.min(r.qrSize-1,Math.ceil(l+u));m++)for(let f=Math.max(0,Math.floor(s-u));f<=Math.min(r.qrSize-1,Math.ceil(s+u));f++){if((f-s)**2+(m-l)**2>u**2)continue;d++;let p=m*r.qrSize+f;n.has(p)&&c++}return d===0?0:c/d}function ae(t,e){if(t.props.length/de>=me)throw new RangeError(`World prop limit exceeded (${me})`);let a=e.rotation??[0,0,0],o=[e.center[0],e.center[1],e.center[2],e.primitive,Math.max(1e-4,Math.abs(e.size[0])),Math.max(1e-4,Math.abs(e.size[1])),Math.max(1e-4,Math.abs(e.size[2])),e.material,a[0],a[1],a[2],tn(e.seed??0)];if(!o.every(Number.isFinite))throw new TypeError("World props must contain finite numbers");t.props.push(...o)}function fa(t,e,a){let o=Math.cos(a),n=Math.sin(a);return[t*o-e*n,t*n+e*o]}function W(t,e,a,o,n,r=[0,0,0]){ae(t,{center:e,material:o,primitive:te.box,rotation:r,seed:n,size:a})}function L(t,e,a,o,n,r=[0,0,0]){ae(t,{center:e,material:o,primitive:te.cylinder,rotation:r,seed:n,size:a})}function Be(t,e,a,o,n){ae(t,{center:e,material:o,primitive:te.sphere,seed:n,size:a})}function $0(t){let{model:e,side:a,top:o}=t,n=[[-.19,-.05,.25],[.17,-.17,.18],[.2,.18,.14],[-.2,.2,.12],[.015,.16,.2]],r=[];n.forEach(([d,m,f],p)=>{let g=an(t,d,m,.18),b=(x(e,p,0,101)-.5)*a*.035,y=(x(e,p,0,102)-.5)*a*.035,v=d*a+b,k=m*a+y,w=a*(.105+g*.035+x(e,p,0,103)*.018),z=a*(.14+f*.28+x(e,p,0,104)*.035),S=o+a*(f+g*.035);r.push([v,S,k]),ae(t,{center:[v,S-z*.5,k],material:P.rock,primitive:te.frustum,rotation:[x(e,p,0,105)*ut,0,0],seed:x(e,p,0,106),size:[w*2,z,w*(1.65+x(e,p,0,107)*.3)]}),L(t,[v,S+a*.008,k],[w*1.86,a*.025,w*1.54],P.foliage,x(e,p,0,108));let A=x(e,p,0,109)*ut,j=w*.52;if(ae(t,{center:[v+Math.cos(A)*w*.54,S-z*.42,k+Math.sin(A)*w*.5],material:P.rock,primitive:te.frustum,rotation:[A,0,0],seed:x(e,p,0,110),size:[j*1.2,z*.62,j]}),p!==2){let U=v+(x(e,p,0,111)-.5)*w*.65,fe=k+(x(e,p,0,112)-.5)*w*.55;L(t,[U,S+a*.055,fe],[a*.018,a*.11,a*.018],P.wood,x(e,p,0,113)),Be(t,[U,S+a*.125,fe],[a*.09,a*.105,a*.09],p%2===0?P.accent:P.foliage,x(e,p,0,114))}});let i=r[0];W(t,[i[0]-a*.01,i[1]+a*.055,i[2]],[a*.085,a*.09,a*.07],P.structure,x(e,1,0,140),[.28,0,0]),ae(t,{center:[i[0]-a*.01,i[1]+a*.12,i[2]],material:P.accent,primitive:te.pyramid,rotation:[.28,0,0],seed:x(e,2,0,141),size:[a*.11,a*.075,a*.095]});let s=r[1],l=s[1]-o+a*.08;ae(t,{center:[s[0]+a*.055,s[1]-l*.5,s[2]+a*.01],material:P.water,primitive:te.ribbon,rotation:[.35,0,0],seed:x(e,3,0,142),size:[a*.035,l,a*.004]});let u=r[0],c=r[4];for(let d=1;d<=7;d++){let m=d/8,f=u[0]+(c[0]-u[0])*m,p=u[1]+(c[1]-u[1])*m+Math.sin(m*Math.PI)*a*.025,g=u[2]+(c[2]-u[2])*m,b=Math.atan2(c[0]-u[0],c[2]-u[2]);W(t,[f,p+a*.014,g],[a*.04,a*.012,a*.022],P.wood,x(e,d,0,145),[b,0,0])}for(let d=0;d<11;d++){let m=x(e,d,0,160)*ut,f=a*(.16+x(e,d,0,161)*.34);Be(t,[Math.cos(m)*f,o+a*(.01+x(e,d,0,162)*.055),Math.sin(m)*f],[a*(.08+x(e,d,0,163)*.07),a*.035,a*.065],P.paper,x(e,d,0,164))}}function K0(t){let{model:e,side:a,top:o}=t,n=[[-.12,-.04,.085],[.11,.03,.065],[.02,.17,.05]];n.forEach(([l,u,c],d)=>{let m=a*(c+an(t,l,u,.16)*.015),f=l*a,p=u*a;Be(t,[f,o+m*.23,p],[m*2,m*1.25,m*2],d===0?P.structure:P.glass,x(e,d,0,300)),L(t,[f,o+a*.012,p],[m*2.18,a*.025,m*2.18],P.metal,x(e,d,0,301))});for(let l=0;l<n.length-1;l++){let u=n[l],c=n[l+1],d=u[0]*a,m=u[1]*a,f=c[0]*a,p=c[1]*a,g=f-d,b=p-m,y=Math.hypot(g,b),v=-Math.atan2(g,b);L(t,[(d+f)*.5,o+a*.045,(m+p)*.5],[a*.032,y,a*.032],P.structure,x(e,l,0,305),[v,Math.PI*.5,0])}[[-.24,-.18,.15],[.2,-.16,-.12],[-.23,.18,.24],[.23,.2,-.22]].forEach(([l,u,c],d)=>{let m=l*a,f=u*a;L(t,[m,o+a*.035,f],[a*.013,a*.07,a*.013],P.metal,x(e,d,0,310));for(let p=-1;p<=1;p++){let[g,b]=fa(p*a*.065,0,c);W(t,[m+g,o+a*.075,f+b],[a*.058,a*.009,a*.105],P.dark,x(e,d,p,311),[c,-.18,0])}}),L(t,[a*.015,o+a*.13,-a*.18],[a*.018,a*.24,a*.018],P.metal,x(e,0,0,320)),Be(t,[a*.015,o+a*.265,-a*.18],[a*.07,a*.025,a*.07],P.glow,x(e,1,0,321));for(let l=0;l<2;l++){let u=a*(l===0?-.29:.29),c=a*(l===0?.07:-.02),d=a*(l===0?.075:.055);for(let m=0;m<10;m++){let f=m/10*ut;ae(t,{center:[u+Math.cos(f)*d,o+a*.012,c+Math.sin(f)*d],material:P.lunar,primitive:te.frustum,rotation:[f,0,0],seed:x(e,l,m,330),size:[a*.026,a*.025,a*.04]})}}let i=a*.15,s=a*-.27;W(t,[i,o+a*.035,s],[a*.095,a*.045,a*.065],P.accent,x(e,0,0,340),[.3,0,0]);for(let[l,u]of[[-.045,-.035],[.045,-.035],[-.045,.035],[.045,.035]]){let[c,d]=fa(l*a,u*a,.3);L(t,[i+c,o+a*.018,s+d],[a*.022,a*.018,a*.022],P.dark,x(e,l,u,341),[.3,0,Math.PI*.5])}}function ma(t,e,a,o,n,r,i,s){let{model:l,top:u}=t,c=(f,p)=>{let[g,b]=fa(f,p,o);return[e+g,a+b]},d=(f,p,g,b,y)=>{let[v,k]=c(f,g);W(t,[v,u+p,k],b,P.wood,x(l,s,y,500),[o,0,0])},m=n*.055;d(-n*.47,r*.5,0,[m,r,i],1),d(n*.47,r*.5,0,[m,r,i],2);for(let f=0;f<=3;f++)d(0,r*(.04+f*.3),0,[n,r*.035,i],10+f);for(let f=0;f<3;f++)for(let g=0;g<5;g++){let b=n*(.105+x(l,s,g+f*10,510)*.035),y=r*(.17+x(l,s,g+f*10,511)*.065),v=-n*.35+g*n*.17,k=r*(.08+f*.3)+y*.5,[w,z]=c(v,-i*.035),S=[P.accent,P.structure,P.foliage,P.paper][(g+f+s)%4];W(t,[w,u+k,z],[b,y,i*.58],S,x(l,s,g+f*10,512),[o,0,(x(l,s,g+f*10,513)-.5)*.09])}}function J0(t){let{model:e,side:a,top:o}=t,n=a*.25,r=a*.34,i=a*.055;ma(t,0,a*.285,0,n*1.25,r,i,0),ma(t,-a*.285,a*.04,Math.PI*.5,n,r*.94,i,1),ma(t,a*.285,a*.04,-Math.PI*.5,n,r*.94,i,2),L(t,[0,o+a*.105,-a*.045],[a*.23,a*.18,a*.18],P.wood,x(e,0,0,600)),W(t,[0,o+a*.205,-a*.045],[a*.25,a*.025,a*.19],P.wood,x(e,1,0,601),[.06,0,0]);for(let s=0;s<6;s++)W(t,[a*(-.06+s*.023),o+a*(.226+s*.009),-a*.05],[a*.1,a*.014,a*.065],s%2===0?P.accent:P.structure,x(e,s,0,602),[.18-s*.025,0,0]);L(t,[-a*.075,o+a*.275,-a*.045],[a*.014,a*.115,a*.014],P.metal,x(e,0,0,610)),Be(t,[-a*.075,o+a*.345,-a*.045],[a*.065,a*.055,a*.065],P.glow,x(e,1,0,611));for(let[s,l,u]of[[-.17,-.22,.2],[.18,-.2,-.25]])W(t,[s*a,o+a*.08,l*a],[a*.105,a*.028,a*.09],P.structure,x(e,s,l,620),[u,0,0]),L(t,[s*a,o+a*.037,l*a],[a*.075,a*.07,a*.075],P.wood,x(e,s,l,621))}function _e(t,e){if(e==="sakura")return{propCount:0,props:new Float32Array,world:e};let a=[],o=Math.max(M*21,t.qrSize*M),n={activeModules:new Set(t.modules.map(s=>s.index)),model:t,props:a,side:o,top:M};e==="islands"?$0(n):e==="moon"?K0(n):J0(n);let r=new Float32Array(a);if(r.length%de!==0||!r.every(Number.isFinite))throw new TypeError(`Invalid ${e} prop buffer`);let i=r.length/de;if(i>me)throw new RangeError(`World prop limit exceeded (${i})`);return{propCount:i,props:r,world:e}}function on(t,e="sakura"){if(!Fe.includes(e))throw new RangeError(`Unsupported seed world: ${e}`);return _e(t,e)}function mt(t){return{islands:_e(t,"islands"),library:_e(t,"library"),moon:_e(t,"moon"),sakura:_e(t,"sakura")}}async function mn(){let t=await Promise.resolve().then(()=>(ft(),nn));return{post:t.SEED_POST_SHADER,weather:t.SEED_WEATHER_SHADER}}var mi={terrain:async()=>{let[t,e]=await Promise.all([mn(),Promise.resolve().then(()=>(sn(),rn))]);return{...t,form:"terrain",terrain:e.TERRAIN_SHADER}},tree:async()=>{let[t,e,a]=await Promise.all([mn(),Promise.resolve().then(()=>(un(),ln)),Promise.resolve().then(()=>(dn(),cn))]);return{...t,blocks:e.TREE_BLOCK_SHADER,branches:e.TREE_BRANCH_SHADER,butterflies:e.TREE_BUTTERFLY_SHADER,fallingPetals:e.TREE_FALLING_PETAL_SHADER,flowers:e.TREE_FLOWER_SHADER,form:"tree",grass:e.TREE_GRASS_SHADER,shadow:e.TREE_SHADOW_SHADER,worldProps:a.WORLD_PROP_SHADER}}},fi={1:mi};async function pi(t,e=xe){let a=Le(e);return fi[a][t]()}function gt(t){return typeof t=="string"&&Fe.includes(t)}function bn(t){if(!t.background)return{a:0,b:0,g:0,r:0};let[e,a,o]=t.background;return{a:1,b:Math.max(0,Math.min(1,o)),g:Math.max(0,Math.min(1,a)),r:Math.max(0,Math.min(1,e))}}function hi(t){return t==="calm"?3:t==="rain"?1:t==="snow"?2:0}function yn(t){return hi(t.effect)}var gi=[[.91,.48,.64],[.2,.56,.08],[.91,.88,.79],[.31,.43,.18],[.965,.945,.906]];function kn(t){return t.palette??gi}function ga(t,e){let a=Number.isFinite(t)?t%(Math.PI*2):0;return[Math.atan2(Math.sin(a),Math.cos(a)),Math.max(-.9,Math.min(.35,Number.isFinite(e)?e:0))]}var ba=950,bi=.38,vn=60,bt={copyDestination:8,storage:128,uniform:64},pt={fragment:2,vertex:1},pa={renderAttachment:16,textureBinding:4},oe={alpha:{dstFactor:"one-minus-src-alpha",operation:"add",srcFactor:"one"},color:{dstFactor:"one-minus-src-alpha",operation:"add",srcFactor:"src-alpha"}};function fn(t,e,a){let o=1-t;return 3*o*o*t*e+3*o*t*t*a+t**3}function yi(t,e,a){let o=1-t;return 3*o*o*e+6*o*t*(a-e)+3*t*t*(1-a)}function ki(t){if(t<=0)return 0;if(t>=1)return 1;let e=t;for(let a=0;a<7;a++){let o=fn(e,.2,.2)-t,n=yi(e,.2,.2);if(Math.abs(n)<1e-6)break;e=Math.max(0,Math.min(1,e-o/n))}return fn(e,.7,1)}function vi(t,e,a,o){let n=-Math.log(.01)/bi,r=t-a,i=Math.exp(-n*o),s=(r+(e+n*r)*o)*i,l=(e-n*(e+n*r)*o)*i;return[a+s,l]}function F(t,e,a){let o=t.createBuffer({label:e,mappedAtCreation:!0,size:xi(a.byteLength),usage:bt.copyDestination|bt.storage}),n=new Uint8Array(a.buffer,a.byteOffset,a.byteLength);return new Uint8Array(o.getMappedRange()).set(n),o.unmap(),o}function xi(t){return Math.max(Float32Array.BYTES_PER_ELEMENT*4,t)}function wi(t){return Math.max(.82,Math.min(1.45,t))}function Si(t){let e=pt.vertex|pt.fragment,a=t.createBindGroupLayout({label:"every-qrcode-block-layout",entries:[{binding:0,buffer:{type:"uniform"},visibility:e},{binding:1,buffer:{type:"read-only-storage"},visibility:e},{binding:2,buffer:{type:"read-only-storage"},visibility:e},{binding:3,buffer:{type:"read-only-storage"},visibility:e},{binding:4,buffer:{type:"read-only-storage"},visibility:e}]}),o=t.createBindGroupLayout({label:"every-qrcode-item-layout",entries:[{binding:0,buffer:{type:"uniform"},visibility:e},{binding:1,buffer:{type:"read-only-storage"},visibility:e}]}),n=t.createBindGroupLayout({label:"every-qrcode-post-layout",entries:[{binding:0,buffer:{type:"uniform"},visibility:e},{binding:1,texture:{sampleType:"float"},visibility:pt.fragment},{binding:2,sampler:{type:"filtering"},visibility:pt.fragment}]});return{blocks:a,items:o,post:n}}async function O(t,e,a){let o=t.createShaderModule({code:a,label:e}),r=(await o.getCompilationInfo()).messages.filter(i=>i.type==="error");if(r.length>0){let i=r.map(s=>`${s.lineNum}:${s.linePos} ${s.message}`);throw new Error(`${e} WGSL compilation failed
${i.join(`
`)}`)}return o}function G(t,e,a){let o=a.blend?{blend:a.blend,format:e}:{format:e};return t.createRenderPipeline({depthStencil:{depthCompare:"less",depthWriteEnabled:a.depthWrite??!0,format:"depth24plus"},fragment:{entryPoint:"fragmentMain",module:a.module,targets:[o]},label:a.label,layout:t.createPipelineLayout({bindGroupLayouts:[a.layout]}),primitive:{cullMode:"none",topology:"triangle-list"},vertex:{entryPoint:"vertexMain",module:a.module}})}async function zi(t,e,a,o){let[n,r]=await Promise.all([O(t,"every-qrcode-post",o.post),O(t,"every-qrcode-rain",o.weather)]),i=G(t,e,{blend:oe,depthWrite:!1,label:"every-qrcode-rain-pipeline",layout:a.items,module:r});return{post:t.createRenderPipeline({fragment:{entryPoint:"fragmentMain",module:n,targets:[{format:e}]},label:"every-qrcode-post-pipeline",layout:t.createPipelineLayout({bindGroupLayouts:[a.post]}),primitive:{topology:"triangle-list"},vertex:{entryPoint:"vertexMain",module:n}}),rain:i}}async function Pi(t,e,a,o,n){let r=await O(t,"every-qrcode-terrain",n.terrain),i=G(t,e,{label:"every-qrcode-terrain-pipeline",layout:a.blocks,module:r});return{...o,form:n.form,terrain:i}}async function Ci(t,e,a,o,n){let r=await Promise.all([O(t,"every-qrcode-blocks",n.blocks),O(t,"every-qrcode-branches",n.branches),O(t,"every-qrcode-butterflies",n.butterflies),O(t,"every-qrcode-falling-petals",n.fallingPetals),O(t,"every-qrcode-flowers",n.flowers),O(t,"every-qrcode-grass",n.grass),O(t,"every-qrcode-shadow",n.shadow),O(t,"every-qrcode-world-props",n.worldProps)]),[i,s,l,u,c,d,m,f]=r,p=G(t,e,{label:"every-qrcode-block-pipeline",layout:a.blocks,module:i}),g=G(t,e,{blend:oe,label:"every-qrcode-branch-pipeline",layout:a.items,module:s}),b=G(t,e,{blend:oe,depthWrite:!1,label:"every-qrcode-butterfly-pipeline",layout:a.items,module:l}),y=G(t,e,{blend:oe,depthWrite:!1,label:"every-qrcode-falling-petal-pipeline",layout:a.items,module:u}),v=G(t,e,{blend:oe,depthWrite:!0,label:"every-qrcode-flower-pipeline",layout:a.items,module:c}),k=G(t,e,{blend:oe,label:"every-qrcode-grass-pipeline",layout:a.items,module:d}),w=G(t,e,{blend:oe,depthWrite:!1,label:"every-qrcode-shadow-pipeline",layout:a.items,module:m}),z=G(t,e,{blend:oe,depthWrite:!0,label:"every-qrcode-world-prop-pipeline",layout:a.items,module:f});return{...o,blocks:p,branches:g,butterflies:b,fallingPetals:y,flowers:v,form:n.form,grass:k,shadow:w,worldProps:z}}async function Ri(t,e,a,o,n){let r=await pi(o,n),i=await zi(t,e,a,r);return r.form==="terrain"?Pi(t,e,a,i,r):Ci(t,e,a,i,r)}function Mi(t,e,a,o){let n=t.createBuffer({label:"every-qrcode-uniforms",size:vn*Float32Array.BYTES_PER_ELEMENT,usage:bt.copyDestination|bt.uniform}),r=new Float32Array(me*de);return r.set(o),{baseY:F(t,"every-qrcode-block-base-y",e.baseY),blockHeights:F(t,"every-qrcode-block-heights",e.heights),blockPositions:F(t,"every-qrcode-block-positions",e.positions),blockTypes:F(t,"every-qrcode-block-types",e.types),butterflies:F(t,"every-qrcode-butterflies",a.butterflies),fallingPetals:F(t,"every-qrcode-falling-petals",a.fallingPetals),flowers:F(t,"every-qrcode-flowers",a.flowers),grass:F(t,"every-qrcode-grass",a.grass),groundPetals:F(t,"every-qrcode-ground-petals",a.groundPetals),rain:F(t,"every-qrcode-rain",a.rain),segments:F(t,"every-qrcode-segments",a.segments),uniforms:n,worldProps:F(t,"every-qrcode-world-props",r)}}function Ti(t,e,a){let o={binding:0,resource:{buffer:a.uniforms}},n=t.createBindGroup({label:"every-qrcode-block-bind-group",layout:e.blocks,entries:[o,{binding:1,resource:{buffer:a.blockTypes}},{binding:2,resource:{buffer:a.blockPositions}},{binding:3,resource:{buffer:a.blockHeights}},{binding:4,resource:{buffer:a.baseY}}]}),r=t.createBindGroup({label:"every-qrcode-branch-bind-group",layout:e.items,entries:[o,{binding:1,resource:{buffer:a.segments}}]}),i=t.createBindGroup({label:"every-qrcode-flower-bind-group",layout:e.items,entries:[o,{binding:1,resource:{buffer:a.flowers}}]}),s=t.createBindGroup({label:"every-qrcode-ground-petal-bind-group",layout:e.items,entries:[o,{binding:1,resource:{buffer:a.groundPetals}}]}),l=t.createBindGroup({label:"every-qrcode-falling-petal-bind-group",layout:e.items,entries:[o,{binding:1,resource:{buffer:a.fallingPetals}}]}),u=t.createBindGroup({label:"every-qrcode-grass-bind-group",layout:e.items,entries:[o,{binding:1,resource:{buffer:a.grass}}]}),c=t.createBindGroup({label:"every-qrcode-rain-bind-group",layout:e.items,entries:[o,{binding:1,resource:{buffer:a.rain}}]}),d=t.createBindGroup({label:"every-qrcode-butterfly-bind-group",layout:e.items,entries:[o,{binding:1,resource:{buffer:a.butterflies}}]}),m=t.createBindGroup({label:"every-qrcode-world-prop-bind-group",layout:e.items,entries:[o,{binding:1,resource:{buffer:a.worldProps}}]});return{blocks:n,branches:r,butterflies:d,fallingPetals:l,flowers:i,grass:u,groundPetals:s,rain:c,worldProps:m}}function xn(t){t?.depth.destroy(),t?.scene.destroy()}function Ai(t,e,a){let o=t.device.createTexture({format:t.format,label:"every-qrcode-scene-texture",size:[e,a],usage:pa.renderAttachment|pa.textureBinding}),n=t.device.createTexture({format:"depth24plus",label:"every-qrcode-depth-texture",size:[e,a],usage:pa.renderAttachment}),r=o.createView(),i=t.device.createBindGroup({label:"every-qrcode-post-bind-group",layout:t.layouts.post,entries:[{binding:0,resource:{buffer:t.buffers.uniforms}},{binding:1,resource:r},{binding:2,resource:t.sampler}]});return{depth:n,postBindGroup:i,scene:o,sceneView:r}}function ha(t,e){let a=Math.min(window.devicePixelRatio||1,2),o=Math.max(1,Math.floor(t.clientWidth*a)),n=Math.max(1,Math.floor(t.clientHeight*a));t.width===o&&t.height===n&&e.targets||(t.width=o,t.height=n,e.context.configure({alphaMode:"premultiplied",device:e.device,format:e.format}),xn(e.targets),e.targets=Ai(e,o,n))}function wn(t,e,a,o,n){let r=1-a,i=Math.exp(-6*n)*Math.sin(12*n)*.012,s=new Float32Array(vn),l=e.sceneEffect===0?1:e.sceneEffect===1?.15:0,u=e.form==="terrain"?0:l;s[0]=t.width/Math.max(1,t.height),s[1]=o,s[2]=e.blockField.blocks.length,s[3]=a,s[4]=e.blockField.qrSize,s[5]=Math.sin(o*.15)*.003*r*u,s[6]=Math.sin(o*.11+1)*.002*r*u+i,s[7]=e.blockField.blockSize,s[8]=n,s[9]=e.scene.appearance.flowerHue,s[10]=e.scene.appearance.leafHue,s[11]=e.scene.appearance.fruitHue,s[12]=e.scene.appearance.fruitfulness,s[13]=e.scene.appearance.flowerHueSpread,s[14]=e.scene.appearance.leafHueSpread,s[15]=e.sceneEffect;for(let c=0;c<e.palette.length;c+=1){let d=e.palette[c],m=16+c*4;s[m]=d[0],s[m+1]=d[1],s[m+2]=d[2],s[m+3]=1}for(let c=0;c<e.terrainPalette.length;c+=1){let d=e.terrainPalette[c],m=36+c*4;s[m]=d[0],s[m+1]=d[1],s[m+2]=d[2],s[m+3]=1}s[56]=e.zoom,s[57]=e.orbitYaw,s[58]=e.orbitPitch,s[59]=ct[e.world],e.device.queue.writeBuffer(e.buffers.uniforms,0,s)}function Ei(t,e){let a=e.targets;if(!a)return;let o=t.beginRenderPass({colorAttachments:[{clearValue:e.clearColor,loadOp:"clear",storeOp:"store",view:a.sceneView}],depthStencilAttachment:{depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store",view:a.depth.createView()},label:"every-qrcode-scene-pass"}),n=e.pipelines.form==="terrain";o.setPipeline(n?e.pipelines.terrain:e.pipelines.blocks),o.setBindGroup(0,e.bindGroups.blocks),n?o.draw(36,e.blockField.blocks.length):(o.draw(e.blockField.blocks.length*36),o.setPipeline(e.pipelines.shadow),o.setBindGroup(0,e.bindGroups.grass),e.world==="sakura"?(o.draw(12),o.setPipeline(e.pipelines.grass),o.setBindGroup(0,e.bindGroups.grass),o.draw(e.scene.grassCount*3),o.setPipeline(e.pipelines.flowers),o.setBindGroup(0,e.bindGroups.groundPetals),o.draw(e.scene.groundPetalCount*150),o.setPipeline(e.pipelines.branches),o.setBindGroup(0,e.bindGroups.branches),o.draw(e.scene.segmentCount*48),o.setPipeline(e.pipelines.flowers),o.setBindGroup(0,e.bindGroups.flowers),o.draw(e.scene.flowerCount*150),e.scene.fallingPetalCount>0&&(o.setPipeline(e.pipelines.fallingPetals),o.setBindGroup(0,e.bindGroups.fallingPetals),o.draw(e.scene.fallingPetalCount*24))):(o.draw(6,1,6),o.setPipeline(e.pipelines.worldProps),o.setBindGroup(0,e.bindGroups.worldProps),o.draw(dt,e.worldPropCount))),(e.pipelines.form==="terrain"||e.world==="sakura")&&(o.setPipeline(e.pipelines.rain),o.setBindGroup(0,e.bindGroups.rain),o.draw(e.scene.rainCount*6)),e.pipelines.form==="tree"&&e.world==="sakura"&&(o.setPipeline(e.pipelines.butterflies),o.setBindGroup(0,e.bindGroups.butterflies),o.draw(e.scene.butterflyCount*6)),o.end()}function Ii(t,e){if(!e.targets)return;let a=t.beginRenderPass({colorAttachments:[{clearValue:e.clearColor,loadOp:"clear",storeOp:"store",view:e.context.getCurrentTexture().createView()}],label:"every-qrcode-post-pass"});a.setPipeline(e.pipelines.post),a.setBindGroup(0,e.targets.postBindGroup),a.draw(3),a.end()}function Sn(t){let e=t.device.createCommandEncoder({label:"every-qrcode-frame"});Ei(e,t),Ii(e,t),t.device.queue.submit([e.finish()])}function pn(t){if(t){xn(t.targets);for(let e of Object.values(t.buffers))e.destroy();t.context.unconfigure(),t.device.destroy()}}async function ji(t,e,a,o,n){if(!("gpu"in navigator))throw new Error("This browser does not support WebGPU");let r=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!r)throw new Error("No WebGPU adapter is available");let i=await r.requestDevice(),s=t.getContext("webgpu");if(!s)throw new Error("Could not create a WebGPU canvas context");let l=navigator.gpu.getPreferredCanvasFormat(),u=rt(e,o),c=lt(e,o),d=mt(e),m=Si(i),f=await Ri(i,l,m,o,e.generatorVersion),p=Mi(i,u,c,d[n].props),g=Ti(i,m,p),b=i.createSampler({magFilter:"linear",minFilter:"linear"}),y=kn(a);return{bindGroups:g,blockField:u,buffers:p,clearColor:bn(a),context:s,device:i,format:l,form:o,layouts:m,pipelines:f,palette:y,sampler:b,scene:c,sceneEffect:yn(a),terrainPalette:da(y),targets:void 0,world:n,worldPropCount:d[n].propCount,worldScenes:d,zoom:1,orbitYaw:0,orbitPitch:0}}function hn(t,e){let a=t.worldScenes[e];a.props.byteLength>0&&t.device.queue.writeBuffer(t.buffers.worldProps,0,a.props),t.world=e,t.worldPropCount=a.propCount}function gn(t,e){let a=kn(e);t.clearColor=bn(e),t.palette=a,t.sceneEffect=yn(e),t.terrainPalette=da(a)}function ht(t,e,a){let o=e.gpu;if(!o||e.closed||e.paused)return;e.frame=0;let n=Math.min(.05,Math.max(0,a-e.lastFrameTime)/1e3);if(e.reducedMotion||(e.motionTime+=n),o.form==="terrain"){let s=Math.min(.05,Math.max(0,a-e.lastFrameTime)/1e3),[l,u]=vi(e.progress,e.velocity,e.target,s);e.progress=l,e.velocity=u,Math.abs(l-e.target)<5e-4&&Math.abs(u)<.006&&(e.progress=e.target,e.velocity=0)}else{let s=a-e.transitionStart,l=e.transitionDuration===0?1:Math.min(1,s/e.transitionDuration),u=ki(l);e.progress=e.from+(e.target-e.from)*u}e.lastFrameTime=a,t.dataset.morphProgress=e.progress.toFixed(3),e.resizePending&&(e.resizePending=!1),ha(t,o);let r=e.motionTime,i=Math.max(0,(a-e.toggleTime)/1e3);wn(t,o,e.progress,r,i),Sn(o),(!e.reducedMotion||e.progress!==e.target)&&(e.frame=requestAnimationFrame(s=>ht(t,e,s)))}function qi(t){let e=performance.now();return{closed:!1,paused:!1,pauseStarted:0,reducedMotion:!1,motionTime:0,frame:0,from:0,gpu:void 0,lastFrameTime:e,progress:0,resizePending:!0,target:0,transitionDuration:0,transitionStart:e,toggleTime:e,velocity:0,zoom:1,orbitYaw:0,orbitPitch:0,world:t}}function zn(t,e,a={},o="tree",n={}){let r=n.world??"sakura";if(!gt(r))throw new RangeError(`Unsupported seed world: ${String(r)}`);let i=qi(r);i.paused=n.paused??!1,i.pauseStarted=performance.now(),i.reducedMotion=n.reducedMotion??!1;let s=a,l=()=>{!i.gpu||i.closed||(ha(t,i.gpu),wn(t,i.gpu,i.progress,i.motionTime,10),Sn(i.gpu),t.dataset.morphProgress=i.progress.toFixed(3))};return t.dataset.renderer="webgpu-initializing",ji(t,e,s,o,i.world).then(u=>{if(i.closed){pn(u);return}gn(u,s),hn(u,i.world),u.zoom=i.zoom,u.orbitYaw=i.orbitYaw,u.orbitPitch=i.orbitPitch,i.gpu=u,u.device.lost.then(c=>{i.closed||(i.paused=!0,cancelAnimationFrame(i.frame),i.frame=0,t.dataset.renderer="webgpu-error",n.onError?.(new Error("WebGPU device lost: "+(c.message||c.reason))))}),t.dataset.renderer="webgpu-wgsl",ha(t,u),i.paused||(i.frame=requestAnimationFrame(c=>ht(t,i,c))),n.onReady?.()}).catch(u=>{if(i.closed)return;let c=u instanceof Error?u:new Error("WebGPU initialization failed");t.dataset.renderer="webgpu-error",console.error("WebGPU renderer initialization failed:",c),n.onError?.(c)}),{dispose:()=>{i.closed=!0,cancelAnimationFrame(i.frame),pn(i.gpu),i.gpu=void 0},resize:()=>{i.resizePending=!0,i.reducedMotion&&!i.paused&&l()},pause:()=>{i.closed||i.paused||(i.paused=!0,i.pauseStarted=performance.now(),cancelAnimationFrame(i.frame),i.frame=0)},resume:()=>{if(i.closed||!i.paused)return;let u=performance.now(),c=u-i.pauseStarted;i.transitionStart+=c,i.toggleTime+=c,i.lastFrameTime=u,i.paused=!1,i.gpu&&(i.frame=requestAnimationFrame(d=>ht(t,i,d)))},setReducedMotion:u=>{i.closed||u===i.reducedMotion||(i.reducedMotion=u,u?(i.from=i.progress=i.target,i.velocity=0,i.transitionDuration=0,cancelAnimationFrame(i.frame),i.frame=0,i.paused||l()):!i.paused&&i.gpu&&!i.frame&&(i.lastFrameTime=performance.now(),i.frame=requestAnimationFrame(c=>ht(t,i,c))))},setFlat:(u,c={})=>{let d=u?1:0;if(c.immediate||i.reducedMotion){i.from=i.progress=i.target=d,i.velocity=0,i.transitionDuration=0,i.transitionStart=performance.now(),i.toggleTime=performance.now()-1e4,t.dataset.morphProgress=d.toFixed(3),l();return}if(d===i.target)return;let m=performance.now();i.from=i.progress,i.target=d,i.transitionDuration=ba*Math.max(.25,Math.abs(i.target-i.from)),i.transitionStart=m,i.toggleTime=m},setScene:u=>{s=u,i.gpu&&gn(i.gpu,u),i.reducedMotion&&!i.paused&&l()},setWorld:u=>{if(!gt(u))throw new RangeError(`Unsupported seed world: ${String(u)}`);i.closed||i.world===u||(i.world=u,i.gpu&&hn(i.gpu,u),i.reducedMotion&&!i.paused&&l())},setZoom:u=>{i.zoom=wi(u),i.gpu&&(i.gpu.zoom=i.zoom),i.reducedMotion&&!i.paused&&l()},setOrbit:(u,c)=>{i.closed||([i.orbitYaw,i.orbitPitch]=ga(u,c),i.gpu&&(i.gpu.orbitYaw=i.orbitYaw,i.gpu.orbitPitch=i.orbitPitch),i.reducedMotion&&!i.paused&&l())}}}var _i="micro-worlds-study-2",Bi="ed404c6cba9d48c04d5e08de780293cff1b242de";async function Fi(t,e={}){if(e.generatorVersion!==void 0&&e.generatorVersion!==1)throw new Error("The Sakura study supports generatorVersion 1 only.");return{...await $o(t,{generatorVersion:1}),archetype:"cloud"}}return En(Di);})();
