import{r as l,j as n}from"./react-DxEnWDGL.js";import{a7 as u,a8 as m,a9 as o,aa as C,ab as w}from"./vendor-PhLZFuqe.js";const T=e=>typeof e=="object"&&e!==null,Z=(e,t)=>{if(e===t)return!0;if(e==null||t==null||!T(e)&&!T(t))return!1;if(T(e)&&T(t)){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(const s in e)if(Object.prototype.hasOwnProperty.call(e,s)&&Object.prototype.hasOwnProperty.call(t,s)){if(!Z(e[s],t[s]))return!1}else return!1;return!0}return!1},ee=e=>{const t=l.useRef(e);return Z(t.current,e)||(t.current=e),t.current};function f(...e){const t=[];return e.forEach(s=>{if(s)switch(typeof s){case"string":t.push(s);break;case"object":Object.keys(s).forEach(r=>{s[r]&&t.push(r)});break;default:t.push(`${s}`)}}),t.join(" ")}const b=e=>e!==void 0&&e!==!1&&e!==null&&e!=="";function V(e){return typeof e=="string"||typeof e=="number"}const R=l.createContext({isRendered:!1}),te=()=>{const e=l.useContext(R);if(!e.isRendered)throw new Error("[TGUI] Wrap your app with <AppRoot> component");return e},v=()=>te().platform||"base",S=!!(typeof window<"u"&&window.document&&window.document.createElement),se=S?l.useLayoutEffect:l.useEffect,ne=(e,t)=>{const s=l.useRef({callbackFunction:e,duration:t});se(()=>{s.current.callbackFunction=e,s.current.duration=t},[e,t]);const r=l.useRef(),a=l.useCallback(()=>clearTimeout(r==null?void 0:r.current),[]);return{set:l.useCallback(()=>{a(),r.current=setTimeout(s.current.callbackFunction,s.current.duration)},[a]),clear:a}},re=70,F=225,ae=()=>{const[e,t]=l.useState([]),s=l.useMemo(()=>new Map,[]),r=ne(()=>t([]),F);function a(i,d,h){const g=Date.now(),x=e.filter(N=>N.date+F>g);t([...x,{x:i,y:d,date:g,pointerId:h}]),r.set(),s.delete(h)}return{clicks:e,onPointerDown:i=>{const{top:d,left:h}=i.currentTarget.getBoundingClientRect(),g=i.clientX-(h??0),x=i.clientY-(d??0);s.set(i.pointerId,setTimeout(()=>a(g,x,i.pointerId),re))},onPointerCancel:i=>{const d=s.get(i.pointerId);clearTimeout(d),s.delete(i.pointerId)}}},ce=({clicks:e})=>n.jsx("span",{"aria-hidden":!0,className:"tgui-8071f6e38c77bc0b",children:e.map(t=>n.jsx("span",{className:"tgui-e156954daf886976",style:{top:t.y,left:t.x}},t.date))}),oe=l.forwardRef((e,t)=>{var{Component:s="div",children:r,className:a,interactiveAnimation:c="background",readOnly:p}=e,i=u(e,["Component","children","className","interactiveAnimation","readOnly"]);const d=v(),{clicks:h,onPointerCancel:g,onPointerDown:x}=ae(),N=d==="base"&&c==="background"&&!p;return n.jsxs(s,m(o({ref:t,className:f("tgui-b5d680db78c4cc2e",d==="ios"&&"tgui-34eb6f8b96874d40",c==="opacity"&&"tgui-7c5d6c1f6bbe3eaf",a),onPointerCancel:g,onPointerDown:x,readOnly:p},i),{children:[N&&n.jsx(ce,{clicks:h}),r]}))}),ie={1:"tgui-5c92f90c2701fa17",2:"tgui-809f1f8a3f64154d",3:"tgui-5b8bdfbd2af10f59"},y=l.forwardRef((e,t)=>{var{weight:s="3",Component:r="span",plain:a=!0,caps:c,className:p}=e,i=u(e,["weight","Component","plain","caps","className"]);return n.jsx(r,o({ref:t,className:f("tgui-c3e2e598bd70eee6",a&&"tgui-080a44e6ac3f4d27",s&&ie[s],c&&"tgui-c602097b30e4ede9",p)},i))}),le={1:"tgui-30064fce0d501f17",2:"tgui-8f63cd31b2513281"},j=l.forwardRef((e,t)=>{var{level:s="1",className:r,Component:a}=e,c=u(e,["level","className","Component"]);return n.jsx(y,m(o({},c),{ref:t,className:f("tgui-266b6ffdbad2b90e",le[s],r),Component:a||"h6"}))}),de={1:"tgui-2916d621b0ea5857",2:"tgui-937d123c23df98b3"},E=e=>{var{level:t="1",className:s,Component:r}=e,a=u(e,["level","className","Component"]);return n.jsx(y,m(o({},a),{className:f("tgui-f37a43dcc29ade55",de[t],s),Component:r||"span"}))},A=l.forwardRef((e,t)=>{var{weight:s,className:r,Component:a}=e,c=u(e,["weight","className","Component"]);return n.jsx(y,m(o({ref:t},c),{weight:s,className:f("tgui-65c206f0fd891b6b",r),Component:a||"span"}))}),ue=()=>{const t=v()==="ios";return{Title:a=>t?n.jsx(A,o({},a)):n.jsx(j,o({level:"1"},a)),Description:a=>t?n.jsx(E,o({},a)):n.jsx(j,o({level:"2"},a))}},Ve=l.forwardRef((e,t)=>{var{children:s,titleBadge:r,hint:a,subhead:c,subtitle:p,description:i,className:d,before:h,after:g,Component:x,hovered:N,multiline:L}=e,D=u(e,["children","titleBadge","hint","subhead","subtitle","description","className","before","after","Component","hovered","multiline"]);const P=v(),{Title:k,Description:M}=ue(),I=b(s)||b(a)||b(r);return n.jsxs(oe,m(o({ref:t,Component:x||"div",className:f("tgui-b8dfba0b5c3d054c",P==="ios"&&"tgui-7b5bccbb645b495f",N&&"tgui-7edaaf0c57797623",L&&"tgui-6c49dadccf648a5b",d)},D),{children:[b(h)&&n.jsx("div",{className:"tgui-aaa795d78c356ac1",children:h}),n.jsxs("div",{className:"tgui-8735a62be5a8b8a7",children:[b(c)&&n.jsx(j,{className:"tgui-46dd90b57ffed25f",level:"2",weight:"3",children:c}),I&&n.jsxs(k,{className:"tgui-a894f59f4c5ad72f",children:[b(s)&&n.jsx("span",{className:"tgui-1c6d7865a76a19bc",children:s}),b(a)&&n.jsx("span",{className:"tgui-bb909928b48f948b",children:a}),b(r)&&r]}),b(p)&&n.jsx(j,{className:"tgui-d528ef65a8b76273",level:"2",weight:"3",children:p}),b(i)&&n.jsx(M,{className:"tgui-fc059ed3ac5799a6",children:i})]}),b(g)&&n.jsx("div",{className:"tgui-56b2e897ed7ccb22",children:g})]}))}),fe=e=>e<40?4:e<96?8:12,pe={number:"tgui-562f7459d74103ea",dot:"tgui-4f69ed647e40e245"},me={primary:"tgui-6e63faaa2b33f4ae",critical:"tgui-4b52474c713ffa7c",secondary:"tgui-0278f262d68294f0",gray:"tgui-0883e451f3707277",white:"tgui-6b3dbcedd9052940"},U=e=>{var{type:t,mode:s="primary",large:r,className:a,children:c}=e,p=u(e,["type","mode","large","className","children"]);const i=t==="number";return n.jsx("span",m(o({className:f("tgui-c8f4bcd1606fb026",pe[t],me[s],i&&r&&"tgui-c1a5e9170826a773",a)},p),{children:b(c)&&i&&n.jsxs(n.Fragment,{children:[r&&n.jsx(j,{Component:"span",level:"2",weight:"2",children:c}),!r&&n.jsx(E,{weight:"2",children:c})]})}))},he=e=>{var{type:t,className:s}=e,r=u(e,["type","className"]);return t!=="number"?(console.error('[ImageBadge]: Component supports only type="number"'),null):n.jsx(U,o({type:"number",className:f("tgui-e3bcc434a6ee9317",s)},r))},Y=e=>{var{size:t=40,className:s,alt:r,crossOrigin:a,decoding:c,loading:p,referrerPolicy:i,sizes:d,src:h,srcSet:g,useMap:x,style:N,fallbackIcon:L,children:D,onLoad:P,onError:k}=e,M=u(e,["size","className","alt","crossOrigin","decoding","loading","referrerPolicy","sizes","src","srcSet","useMap","style","fallbackIcon","children","onLoad","onError"]);const[I,H]=l.useState(!1),[X,W]=l.useState(!1),z=h||g,J=(X||!z)&&l.isValidElement(L),K=O=>{I||(H(!0),W(!1),P==null||P(O))},_=O=>{H(!1),W(!0),k==null||k(O)};return n.jsxs("div",m(o({style:o({width:t,minWidth:t,height:t,borderRadius:(N==null?void 0:N.borderRadius)||fe(t)},N),className:f("tgui-30d8642662534eb5",I&&"tgui-72bd4140eca37f53",s)},M),{children:[z&&n.jsx("img",{alt:r,className:"tgui-1191c597a64dbd25",crossOrigin:a,decoding:c,loading:p,referrerPolicy:i,sizes:d,src:h,srcSet:g,useMap:x,onLoad:K,onError:_}),J&&n.jsx("div",{className:"tgui-5ee2f1c6e1da49b5",children:L}),D]}))};Y.Badge=he;const ge=e=>{var{className:t,Component:s}=e,r=u(e,["className","Component"]);return n.jsx(y,m(o({},r),{className:f("tgui-e05fce4753086879",t),Component:s||"h5"}))},be=e=>{var{className:t,Component:s}=e,r=u(e,["className","Component"]);return n.jsx(y,m(o({},r),{Component:s||"h1",className:f("tgui-c6d7432a5c12debe",t)}))},xe={1:"h2",2:"h3",3:"h4"},Ne={1:"tgui-2fc52ee93e8068a6",2:"tgui-72c2a480384c4fb1",3:"tgui-45c5f45d3e9105f4"},$=e=>{var{level:t="2",className:s,Component:r}=e,a=u(e,["level","className","Component"]);return n.jsx(y,m(o({},a),{className:f("tgui-da537051a4a87aec",Ne[t],s),Component:r||xe[t]}))},ve=e=>{var{size:t}=e,s=u(e,["size"]);return t?t<=28?n.jsx(E,o({level:t<=24?"2":"1",weight:"1",caps:!0},s)):t===40?n.jsx(ge,o({weight:"2",caps:!0},s)):t===48?n.jsx($,o({weight:"1",level:"3",caps:!0},s)):n.jsx(be,o({weight:"1",caps:!0},s)):null},je=e=>{var{type:t,className:s}=e,r=u(e,["type","className"]);if(t!=="number")throw new Error('[ImageBadge]: Component supports only type="number"');return n.jsx(U,o({type:"number",className:f("tgui-54214e0db34f53c3",s)},r))},Ce=e=>{var{className:t,style:s,acronym:r,fallbackIcon:a,size:c}=e,p=u(e,["className","style","acronym","fallbackIcon","size"]);return n.jsx(Y,o({style:o({borderRadius:"50%"},s),className:f("tgui-91c5537b51b490a7",r&&"tgui-305551eb3f5abb68",t),fallbackIcon:r?n.jsx(ve,{size:c,children:r}):a,size:c},p))};Ce.Badge=je;const we=e=>{var t=C({},w(e));return n.jsx("svg",m(o({width:"16",height:"16",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t),{children:n.jsx("path",{d:"m6 3 5 5-5 5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}))},Fe=({className:e,children:t})=>{const s=v(),r=b(t);return n.jsxs("div",{className:f("tgui-97dd747d03e9d3e0",e),children:[r&&n.jsx(A,{className:"tgui-64a5a0dc5509605e",children:t}),(!r||s==="ios")&&n.jsx(we,{className:"tgui-3b026a2674eb3f4c"})]})},Ze=e=>{var{className:t,children:s,Component:r="div"}=e,a=u(e,["className","children","Component"]);const c=v();return n.jsx(r,m(o({className:f("tgui-389a43acd684137a",c==="ios"&&"tgui-cfed40fe81d34ad5",t)},a),{children:s}))},Ue=e=>{var{children:t,header:s,description:r,className:a,action:c}=e,p=u(e,["children","header","description","className","action"]);const i=b(s),d=b(r);return n.jsxs("section",m(o({className:f("tgui-e5c3a5b87f8b1f46",a)},p),{children:[b(t)&&t,(i||d)&&n.jsxs("dl",{className:"tgui-9c3dbc0ef84585d4",children:[i&&n.jsx($,{Component:"dt",level:"3",weight:"2",children:s}),d&&n.jsx(A,{className:"tgui-87cd6af55f73428d",Component:"dd",children:r})]}),b(c)&&c]}))},ye=e=>{var{className:t}=e,s=u(e,["className"]);return n.jsx("hr",o({className:f("tgui-8af0d10d5540c6cc",t)},s))},Pe=e=>{var t=C({},w(e));return v()==="ios"?n.jsx(E,o({},t)):n.jsx(j,o({level:"2"},t))},q=e=>{var{className:t,children:s,centered:r}=e,a=u(e,["className","children","centered"]);const c=v();return n.jsx("footer",m(o({className:f("tgui-dbb364e8ced00cc8",c==="ios"&&"tgui-8c4c6f82ba895475",r&&"tgui-8ebba379083b615a",t)},a),{children:n.jsx(Pe,{className:"tgui-67471b69da3e3062",children:s})}))},ke=()=>{const e=v();return{Default:r=>{var a=C({},w(r));return e==="ios"?n.jsx(E,o({caps:!0},a)):n.jsx(j,o({level:"2",weight:"2"},a))},Large:r=>{var a=C({},w(r));return e==="ios"?n.jsx(j,o({level:"1",weight:"2"},a)):n.jsx(A,o({weight:"2"},a))}}},G=e=>{var{large:t,className:s,children:r}=e,a=u(e,["large","className","children"]);const c=v(),{Default:p,Large:i}=ke(),d=t?i:p;return n.jsx("header",m(o({className:f("tgui-d0251b46536ac046",c==="ios"&&"tgui-b7217abb24e8763a",t&&"tgui-34fd1a25cc171439",s)},a),{children:n.jsx(d,{Component:"h1",className:"tgui-9c200683b316fde6",children:r})}))},Q=e=>{var{header:t,footer:s,className:r,children:a}=e,c=u(e,["header","footer","className","children"]);const p=v(),i=V(t)?n.jsx(G,{children:t}):t,d=V(s)?n.jsx(q,{children:s}):s;return n.jsxs("section",m(o({className:f("tgui-3dfa44f9f78f9a22",p==="base"&&"tgui-8e15431b81f6601e",p==="ios"&&"tgui-97eca24324122dbc",r)},c),{children:[n.jsxs("div",{className:"tgui-db9be63c4fecf79b",children:[i,n.jsx("div",{className:"tgui-4b78bed6e925088e",children:l.Children.map(a,(h,g)=>n.jsxs(n.Fragment,{children:[h,g<l.Children.count(a)-1&&n.jsx(ye,{className:"tgui-a6d406c4dc060899"})]}))})]}),d]}))};Q.Header=G;Q.Footer=q;const Re=l.forwardRef((e,t)=>{var{Component:s="span",className:r}=e,a=u(e,["Component","className"]);return n.jsx(s,m(o({},a),{ref:t,className:f("tgui-b9fd8cdf929947df",r)}))}),Ee=e=>{var t=C({},w(e));return n.jsx("svg",m(o({width:"20",height:"20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t),{children:n.jsx("path",{d:"M6.4 1h7.2c1.14 0 1.93 0 2.55.05.6.05.95.14 1.21.28a3 3 0 0 1 1.31 1.3c.14.27.23.62.28 1.22.05.62.05 1.41.05 2.55v7.2c0 1.14 0 1.93-.05 2.55-.05.6-.14.95-.28 1.21a3 3 0 0 1-1.3 1.31c-.27.14-.62.23-1.22.28-.62.05-1.41.05-2.55.05H6.4c-1.14 0-1.93 0-2.55-.05-.6-.05-.95-.14-1.21-.28a3 3 0 0 1-1.31-1.3 3.2 3.2 0 0 1-.28-1.22A34.7 34.7 0 0 1 1 13.6V6.4c0-1.14 0-1.93.05-2.55.05-.6.14-.95.28-1.21a3 3 0 0 1 1.3-1.31 3.2 3.2 0 0 1 1.22-.28C4.47 1 5.26 1 6.4 1Z",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}))},Le=e=>{var t=C({},w(e));return n.jsxs("svg",m(o({width:"20",height:"20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t),{children:[n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M.48 2.87C0 3.88 0 5.2 0 7.8v4.4c0 2.61 0 3.92.48 4.93a5 5 0 0 0 2.4 2.4c1 .47 2.3.47 4.92.47h4.4c2.61 0 3.92 0 4.93-.48a5 5 0 0 0 2.4-2.4c.47-1 .47-2.3.47-4.92V7.8c0-2.61 0-3.92-.48-4.93a5 5 0 0 0-2.4-2.4C16.13 0 14.83 0 12.2 0H7.8C5.19 0 3.88 0 2.87.48a5 5 0 0 0-2.4 2.4ZM15.7 7.46a1 1 0 0 0-1.42-1.42L8 12.34l-2.3-2.3a1 1 0 1 0-1.4 1.42l3 3a1 1 0 0 0 1.4 0l7-7Z",fill:"currentColor"}),n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M15.7 7.46a1 1 0 0 0-1.4-1.42L8 12.34l-2.3-2.3a1 1 0 1 0-1.4 1.42l3 3a1 1 0 0 0 1.4 0l7-7Z",fill:"#fff"})]}))},Ie=e=>{var t=C({},w(e));return n.jsxs("svg",m(o({width:"20",height:"20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t),{children:[n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M6.4 0h7.2c2.24 0 3.36 0 4.22.44a4 4 0 0 1 1.74 1.74c.44.86.44 1.98.44 4.22v7.2c0 2.24 0 3.36-.44 4.22a4 4 0 0 1-1.74 1.74c-.86.44-1.98.44-4.22.44H6.4c-2.24 0-3.36 0-4.22-.44a4 4 0 0 1-1.74-1.74C0 16.96 0 15.84 0 13.6V6.4c0-2.24 0-3.36.44-4.22A4 4 0 0 1 2.18.44C3.04 0 4.16 0 6.4 0ZM4 10a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Z",fill:"currentColor"}),n.jsx("path",{d:"M4 10a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Z",fill:"#fff"})]}))},Ye=e=>{var{style:t,className:s,disabled:r,indeterminate:a}=e,c=u(e,["style","className","disabled","indeterminate"]);return n.jsxs("label",{className:f("tgui-abbb25a9ce45033e",r&&"tgui-6e9776e8c33b2626",s),children:[n.jsx(Re,m(o({},c),{Component:"input",type:"checkbox",className:"tgui-60cf4cc79ba44c4f",disabled:r})),n.jsx(Ee,{className:"tgui-21b20ecaad17ccf9","aria-hidden":!0}),n.jsx("div",{"aria-hidden":!0,className:"tgui-bca5056bf34297b0",children:a?n.jsx(Ie,{}):n.jsx(Le,{})})]})},Te=(e,t)=>{t&&(typeof t=="function"?t(e):t.current=e)},Se=(...e)=>{let t=null;return{get current(){return t},set current(s){t=s,e.forEach(r=>r&&Te(s,r))}}},B=()=>{var e;if(S)return(e=window.Telegram)===null||e===void 0?void 0:e.WebApp},Ae=e=>{if(!S||!window.matchMedia)return()=>{};const t=window.matchMedia("(prefers-color-scheme: dark)"),s=()=>{e(t.matches?"dark":"light")};return t.addEventListener("change",s),()=>t.removeEventListener("change",s)},De=()=>S&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",Me=e=>{const{appearance:t}=l.useContext(R),[s,r]=l.useState(e||t||De()),a=l.useCallback(()=>{const c=B();c&&r(c.colorScheme)},[]);return l.useEffect(()=>{if(e!==void 0)return r(e),()=>{};const c=B();return c?(c.onEvent("themeChanged",a),()=>c.offEvent("themeChanged",a)):Ae(r)},[e]),s},Oe=()=>{const e=B();return e&&["ios","macos"].includes(e.platform)?"ios":"base"},Be=e=>{if(e!==void 0)return e;const t=l.useContext(R);return t.isRendered&&t.platform!==void 0?t.platform:Oe()},He=e=>{if(e!==void 0)return e;const t=l.useContext(R);return t.isRendered&&t.portalContainer!==void 0?t.portalContainer:l.useRef(null)},$e=l.forwardRef((e,t)=>{var{platform:s,appearance:r,portalContainer:a,children:c,className:p}=e,i=u(e,["platform","appearance","portalContainer","children","className"]);const d=Me(r),h=He(a),g=Be(s),x=ee({platform:g,appearance:d,portalContainer:h,isRendered:!0});return n.jsx("div",m(o({ref:Se(t,h),className:f("tgui-6a12827a138e8827",g==="ios"&&"tgui-56dbb42c1dbd5e2b",d==="dark"&&"tgui-865b921add8ee075",p)},i),{children:n.jsx(R.Provider,{value:x,children:c})}))});export{Ce as A,Ve as C,Ze as L,Fe as N,Ue as P,Q as S,A as T,Ye as a,$ as b,$e as c};