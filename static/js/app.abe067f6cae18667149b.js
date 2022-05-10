webpackJsonp([1],{"0QXo":function(t,e){},NHnr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("7+uW"),o={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},staticRenderFns:[]};var r=a("VU/8")({name:"App"},o,!1,function(t){a("Pe99")},null,null).exports,i=a("/ocq"),s=a("BO1k"),c=a.n(s),l={data:function(){return{markers:{},markersOnScreen:{},isShow:!1}},mounted:function(){this.loader()},methods:{loader:function(){mapboxgl.accessToken="pk.eyJ1IjoidGF1ZmlrbnVyIiwiYSI6ImNrN3N0bXBoYTBzdTEzbHJ2b2dxaHQ2bDMifQ.XnNZtDnItwYc8B4h9BL-TQ";var t=new mapboxgl.Map({container:"map",zoom:4,center:[118.0148634,-2.548926],style:"mapbox://styles/mapbox/light-v10"});t.addControl(new mapboxgl.NavigationControl);var e=["<",["get","mag"],2],a=["all",[">=",["get","mag"],2],["<",["get","mag"],3]],n=["all",[">=",["get","mag"],3],["<",["get","mag"],4]],o=["all",[">=",["get","mag"],4],["<",["get","mag"],5]],r=[">=",["get","mag"],5],i=["#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c"];t.on("load",function(){t.loadImage("https://flagcdn.com/256x192/id.png",function(e,a){if(e)throw e;t.addImage("cat",a),t.addSource("point",{type:"geojson",data:{type:"FeatureCollection",features:[{type:"Feature",geometry:{type:"Point",coordinates:[118.0148634,-2.548926]}}]}}),t.addLayer({id:"points",type:"symbol",source:"point",layout:{"icon-image":"cat","icon-size":.25}})}),t.addSource("earthquakes",{type:"geojson",data:"https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",cluster:!0,clusterRadius:80,clusterProperties:{mag1:["+",["case",e,1,0]],mag2:["+",["case",a,1,0]],mag3:["+",["case",n,1,0]],mag4:["+",["case",o,1,0]],mag5:["+",["case",r,1,0]]}}),t.addLayer({id:"earthquake_circle",type:"circle",source:"earthquakes",filter:["!=","cluster",!0],paint:{"circle-color":["case",e,i[0],a,i[1],n,i[2],o,i[3],i[4]],"circle-opacity":.6,"circle-radius":12}}),t.addLayer({id:"earthquake_label",type:"symbol",source:"earthquakes",filter:["!=","cluster",!0],layout:{"text-field":["number-format",["get","mag"],{"min-fraction-digits":1,"max-fraction-digits":1}],"text-font":["Open Sans Semibold","Arial Unicode MS Bold"],"text-size":10},paint:{"text-color":["case",["<",["get","mag"],3],"black","white"]}});var s={},l={};function d(t){var e=[],a=[t.mag1,t.mag2,t.mag3,t.mag4,t.mag5],n=0,o=!0,r=!1,s=void 0;try{for(var l,d=c()(a);!(o=(l=d.next()).done);o=!0){var m=l.value;e.push(n),n+=m}}catch(t){r=!0,s=t}finally{try{!o&&d.return&&d.return()}finally{if(r)throw s}}for(var p=n>=1e3?22:n>=100?20:n>=10?18:16,f=n>=1e3?50:n>=100?32:n>=10?24:18,g=Math.round(.6*f),v=2*f,h='<div>\n<svg width="'+v+'" height="'+v+'" viewbox="0 0 '+v+" "+v+'" text-anchor="middle" style="font: '+p+'px sans-serif; display: block">',y=0;y<a.length;y++)h+=u(e[y]/n,(e[y]+a[y])/n,f,g,i[y]);h+='<circle cx="'+f+'" cy="'+f+'" r="'+g+'" fill="white" />\n<text dominant-baseline="central" transform="translate('+f+", "+f+')">\n'+n.toLocaleString()+"\n</text>\n</svg>\n</div>";var b=document.createElement("div");return b.innerHTML=h,b.firstChild}function u(t,e,a,n,o){e-t==1&&(e-=1e-5);var r=2*Math.PI*(t-.25),i=2*Math.PI*(e-.25),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),d=Math.sin(i),u=e-t>.5?1:0;return'<path d="M '+(a+n*s)+" "+(a+n*c)+" L "+(a+a*s)+" "+(a+a*c)+" A "+a+" "+a+" 0 "+u+" 1 "+(a+a*l)+" "+(a+a*d)+" L "+(a+n*l)+" "+(a+n*d)+" A "+n+" "+n+" 0 "+u+" 0 "+(a+n*s)+" "+(a+n*c)+'" fill="'+o+'" />'}document.getElementById("fit").addEventListener("click",function(){t.fitBounds([[112.28900566392672,-9.64919305281563],[124.53196999645662,4.567331522854541]])}),t.on("render",function(){t.isSourceLoaded("earthquakes")&&function(){var e={},a=t.querySourceFeatures("earthquakes"),n=!0,o=!1,r=void 0;try{for(var i,u=c()(a);!(n=(i=u.next()).done);n=!0){var m=i.value,p=m.geometry.coordinates,f=m.properties;if(f.cluster){var g=f.cluster_id,v=s[g];if(!v){var h=d(f);v=s[g]=new mapboxgl.Marker({element:h}).setLngLat(p)}e[g]=v,l[g]||v.addTo(t)}}}catch(t){o=!0,r=t}finally{try{!n&&u.return&&u.return()}finally{if(o)throw r}}for(var g in l)e[g]||l[g].remove();l=e}()})})}}},d={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{attrs:{id:"map"}}),t._v(" "),a("div",{attrs:{id:"inputs"}},[a("div",{staticClass:"tooltip"},[a("input",{attrs:{type:"button",value:"Show Menu"},on:{click:function(e){t.isShow=!0}}}),t._v(" "),a("span",{staticClass:"tooltiptext tooltip-bottom"},[t._v("Show Menu")])]),t._v(" "),a("input",{attrs:{type:"button",id:"goldenHourEnd",value:"Hide Menu"},on:{click:function(e){t.isShow=!1}}}),t._v(" "),a("input",{attrs:{type:"button",value:"Fokus ID",id:"fit"}})]),t._v(" "),t.isShow?a("div",{attrs:{id:"menu"}},[t._m(0),t._v(" "),a("div",{attrs:{id:"worldview-options"}})]):t._e()])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",[this._v("\n      Hallow Test Menu\n      "),e("img",{attrs:{width:"100%",src:"https://docs.mapbox.com/mapbox-gl-js/assets/cat.png",alt:""}})])}]};var u=a("VU/8")(l,d,!1,function(t){a("0QXo")},null,null).exports;n.a.use(i.a);var m=new i.a({mode:"history",routes:[{path:"/",name:"mapbox",component:u}]});n.a.config.productionTip=!1,new n.a({el:"#app",router:m,components:{App:r},template:"<App/>"})},Pe99:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.abe067f6cae18667149b.js.map